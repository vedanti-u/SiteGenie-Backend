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
async function createChatBot(url){
    //let vectorStore;
    const model = new OpenAI({});
    const VECTOR_STORE_PATH = `vector/${removeProtocol(url)}.index`;
    const fileExists = await checkFileExists(VECTOR_STORE_PATH);
    if(fileExists){
        console.log('Vector Exists');
        const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,new OpenAIEmbeddings());
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
        const vectorStore = await HNSWLib.fromDocuments(docs,new OpenAIEmbeddings());
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
createChatBot("https://daywiseai.com");
function removeProtocol(url) {
    // Remove "http://" or "https://", if present
    return url.replace(/^https?:\/\//, '');
}

export default createChatBot;