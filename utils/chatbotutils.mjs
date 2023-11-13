import * as fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
dotenv.config();
const url = "https://daywiseai.com"
const VECTOR_STORE_PATH = `vector/${removeProtocol(url)}.index`;
const model = new OpenAI({});

async function createChatBot(url1){
    //let vectorStore;
    const fileExists = await checkFileExists(VECTOR_STORE_PATH);
    if(fileExists){
        console.log('Vector Exists');
        const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,new OpenAIEmbeddings({ maxConcurrency: 5 }));
        const res = processPrompt(model,vectorStore);
        console.log("this is response in if=>",res);
    }
    else{
        console.log("Creating Vector Store..");
        const compiledConvert = compile({wordwrap:130});
        const loader = new RecursiveUrlLoader(url,{
            extractor: compiledConvert,
            maxDepth:1,
            excludeDirs:["https://js.langchain.com/docs/api/"],
        });
        const docs = await loader.load();
        const vectorStore = await HNSWLib.fromDocuments(docs,new OpenAIEmbeddings({ maxConcurrency: 5 }));
        await vectorStore.save(VECTOR_STORE_PATH);
        const res = processPrompt(model,vectorStore);
        console.log("this is response in else =>",res);
    }

}
async function checkFileExists(filePath){
    try{
        await fs.access(filePath);
        console.log("in try... ")
        return true;
    }catch(error){
        console.log("in catch... "+error)
        return false;
    }
}

async function processPrompt(model,vectorStore){
    try{
        const chain = RetrievalQAChain.fromLLM(model,vectorStore.asRetriever());
        const response = await chain.call({
            query: "what is daywisai",
        })
        console.log('OPENAI Response :',response);
        return response;
    }catch(error){
        console.log("Unexpected error occur");
        return error;
    }
}

function removeProtocol(url) {
    // Remove "http://" or "https://", if present
    return url.replace(/^https?:\/\//, '');
}

async function chatBotPrompt(prompt){
    try{
        const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,new OpenAIEmbeddings());
        const chain = RetrievalQAChain.fromLLM(model,vectorStore.asRetriever());
        const response = await chain.call({
            query:prompt,
        })
        console.log(response);
    }catch{
        console.log("Unexpected error occur");
        //return error;
    }
}

function removeEmbeddings(path){
    fs.rm(path, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
        }
        console.log('File deleted successfully');
      });
}

async function updateEmbeddings(url,path){
    removeEmbeddings(path);
    createChatBot(url);
    console.log("Updated embeddings");
}
//createChatBot("https://daywiseai.com");
//chatBotPrompt("https://daywiseai.com","how can daywiseai can help me?");
//removeEmbeddings(VECTOR_STORE_PATH);
updateEmbeddings(url,VECTOR_STORE_PATH);
//export default createChatBot;