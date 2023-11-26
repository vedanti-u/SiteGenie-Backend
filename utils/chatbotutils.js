//const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
var cors = require('cors')

dotenv.config();
const { compile } = require("html-to-text");
//const { HierarchicalNSW } = require("hnswlib-node");

const { RecursiveUrlLoader } = require("langchain/document_loaders/web/recursive_url");
//const { HNSWLib } = require('langchain/vectorstores/hnswlib');

const { RetrievalQAChain } = require('langchain/chains');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { OpenAI } = require('langchain/llms/openai');
//supabase imports
const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");
const { createClient } = require("@supabase/supabase-js");
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');


//const url = "https://daywiseai.com"
//const VECTOR_STORE_PATH = `vector/${removeProtocol(url)}.index`;
const privateKey = process.env.PUBLIC_SUPABASE_PRIVATE_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);
    const supabase_url = process.env.PUBLIC_SUPABASE_URL;
    if (!supabase_url) throw new Error(`Expected env var SUPABASE_URL`);
    const client = createClient(supabase_url, privateKey);

const model = new OpenAI({});


async function createChatBot(url,prompt){
    //let vectorStore;
    //supabase client
    // const privateKey = process.env.PUBLIC_SUPABASE_PRIVATE_KEY;
    // if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);
    // const supabase_url = process.env.PUBLIC_SUPABASE_URL;
    // if (!supabase_url) throw new Error(`Expected env var SUPABASE_URL`);
    // const client = createClient(supabase_url, privateKey);
   // console.log('In createChatBot func');
    const url_to_check = `${removeProtocol(url)}`;
    const fileExists = await checkFileExists(url_to_check);
    if(fileExists){
       // console.log('Vector Exists');
        const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings({ maxConcurrency: 5 }),{
            client,
            tableName: "documents",
          });
         // console.log("this is vectorStore",vectorStore)
        const res = processPrompt(model,vectorStore,prompt);
      //  console.log("this is response in if=>",res);
        return res;
    }
    else{
      //  console.log("Creating Vector Store..");
        const compiledConvert = compile({wordwrap:130});
        const loader = new RecursiveUrlLoader(url,{
            extractor: compiledConvert,
            maxDepth:1,
            excludeDirs:["https://js.langchain.com/docs/api/"],
        });
        const vecdocs = await loader.load();
        const vecdocsArray = [vecdocs[0].pageContent]
        //console.log("vecdocs..",vecdocs)
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
          });
          const docs = await textSplitter.createDocuments(vecdocsArray);

          
          const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings({ maxConcurrency: 5 }), {
            client,
            tableName: "documents",
          });
          const website_url = `${removeProtocol(url)}`;
       //   console.log("vectorstore...",vectorStore);
          docs[0].metadata={"url":website_url};
         const ids =  await vectorStore.addDocuments(docs);
         //console.log("This are ids: ",ids);
        const res = processPrompt(model,vectorStore,prompt);
        //console.log("this is response in else =>",res);
          return res;
    }
}

async function generateChatBot(url){
   // console.log('In generateChatBot func');
    const url_to_check = `${removeProtocol(url)}`;
    const fileExists = await checkFileExists(url_to_check);
    if(fileExists){
      //  console.log('Vector Store Exists..');
        const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings({ maxConcurrency: 5 }),{
            client,
            tableName: "documents",
          });
        //console.log("this is vectorStore",vectorStore)
        //const res = processPrompt(model,vectorStore,prompt);
        //console.log("this is response in if=>",res)
        return "Already created";

    }
    else{
       // console.log("Creating Vector Store..");
        const compiledConvert = compile({wordwrap:130});
        const loader = new RecursiveUrlLoader(url,{
            extractor: compiledConvert,
            maxDepth:1,
            excludeDirs:["https://js.langchain.com/docs/api/"],
        });
        const vecdocs = await loader.load();
        const vecdocsArray = [vecdocs[0].pageContent]
        //console.log("vecdocs..",vecdocs)
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
          });
          const docs = await textSplitter.createDocuments(vecdocsArray);
          const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings({ maxConcurrency: 5 }), {
            client,
            tableName: "documents",
          });
          const website_url = `${removeProtocol(url)}`;
          //console.log("vectorstore...",vectorStore);
          //console.log("this is docs...",docs);
          docs.forEach((entry, index) => {
            docs[index].metadata ={"url":website_url}          
            });
          docs[0].metadata={"url":website_url};
         const ids =  await vectorStore.addDocuments(docs);
         //console.log("This are ids: ",ids);
        //const res = processPrompt(model,vectorStore,prompt);
        //console.log("this is response in else =>",res);
        return "Succesfully created";
    }
}
// router.get('/', async (req, res) => {
//     try {
//       console.log(" Supabase query==>");
//       const { data: Shoes, error } = await sql.from('Shoes').select('*')
    
//       console.log("Data:", Shoes);
//       if (error) {
//         console.log("Error:", error);
//         return res.status(500).send({ error });
//       }
//       return res.send(Shoes);
//     } catch (error) {
//       console.log("Catch block error:", error);
//       return res.status(500).send({ error });
//     }
//   });
  

async function checkFileExists(urlToCheck){
    try{
       // console.log("in try... checking if file exist")
        //console.log("supabase query..",urlToCheck)
        var {data,error}=await client.from('documents').select('metadata');
       // console.log(data);

        data = data.filter(e=>e.metadata.url==urlToCheck);
       // console.log("SSS",data);

        if(error){
            console.error("supabase error to find..",error);
            return false;
        }
        const urlExists = data && data.length>0;
        //await fs.access(filePath);
      //console.log("this is urlExists",urlExists);
        return urlExists;
    }catch(error){
        console.log("in catch... no file found "+error)
        return false;
    }
}

async function processPrompt(model,vectorStore,prompt){
    try{
        console.log('In try... processing prompt');
        const chain = RetrievalQAChain.fromLLM(model,vectorStore.asRetriever());
        const response = await chain.call({
            query: prompt,
        })
       // console.log('OPENAI Response :',response);
        return response;
    }catch(error){
        console.log('In catch... processing prompt failed');
        console.log("Unexpected error occur in catch");
        return error;
    }
}

function removeProtocol(url) {
    // Remove "http://" or "https://", if present
    console.log('In remove protocol...');
    return url.replace(/^https?:\/\//, '');
}

// async function chatBotPrompt(prompt){
//     try{
//         const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH,new OpenAIEmbeddings());
//         const chain = RetrievalQAChain.fromLLM(model,vectorStore.asRetriever());
//         const response = await chain.call({
//             query:prompt,
//         })
//         console.log(response);
//     }catch{
//         console.log("Unexpected error occur");
//         //return error;
//     }
// }

async function removeEmbeddings(urlToCheck){
    try{
        console.log("in try... checking if vector exist to delete")
     //   console.log("supabase query to find..",urlToCheck)
        var {data,error}=await client.from('documents').select(`id,metadata->url`);
      //  console.log("total data",data);

        data = data.filter(e=>e.url==urlToCheck);
       // console.log("SSS",data);
        var indices = [];
        data.forEach(e=>{indices.push(e.id)})
      //  console.log("Indices of entries..",indices)
     //   console.log("this is final data..",data)
        

        if(error){
            console.error("supabase error to find..",error);
            return false;
        }
        const urlExists = indices.length>0;
        const noOfEmbeddings = indices.length;

        //await fs.access(filePath);
        if(!urlExists)return "No embeddings found";
      //console.log("this is urlExists",urlExists);
       
      const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings({ maxConcurrency: 5 }),{
        client,
        tableName: "documents",
      });
        // Convert indices to strings or numbers, depending on your use case
        //const stringIndices = indices.map(index => String(index));
        const numberIndices = indices.map(index => Number(index));

        await vectorStore.delete({ ids: numberIndices });
        // or await vectorStore.delete({ ids: numberIndices });
      //await vectorStore.delete({indices})
   //   console.log("deleted successfully",noOfEmbeddings);
      return ("Deleted Embeddings sucessfully");
        
    }catch(error){
        console.log("in catch... no vector to delete "+error)
        return "Unable to delete embeddings";
    }
      
}

async function updateEmbeddings(url){
  console.log("calling remove embeddings")  
  removeEmbeddings(url);
  console.log("calling generate chatbot")
    generateChatBot(url);
    console.log("Updated embeddings");
    return "Updated embeddings"
}
//createChatBot("https://daywiseai.com","How does daywiseai help us?");
//chatBotPrompt("https://daywiseai.com","how can daywiseai can help me?");
//removeEmbeddings("skippi.in/");
//updateEmbeddings(url,VECTOR_STORE_PATH);
module.exports={generateChatBot,createChatBot,removeEmbeddings,updateEmbeddings}


async function generateEmbeddings(text, project_id) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const documents = await textSplitter.createDocuments([text]);
   // console.log(documents);

    const content = documents.map((doc) => doc.pageContent).join('\n');
    const metadata = { project_id : project_id };
    const docs = [new Document({ pageContent: content, metadata })];
    
    let vectorStore = await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        client: SUPABASE_CLIENT,
        tableName: 'documents',
      }
    );
  }
  
const run = async () => {
    
    const embeddings = new OpenAIEmbeddings();
  
    const store = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
    });
  
    const docs = [
      { pageContent: "hello", metadata: { b: 1, c: 9, stuff: "right" } },
      { pageContent: "hello", metadata: { b: 1, c: 9, stuff: "wrong" } },
    ];
  
    // Also takes an additional {ids: []} parameter for upsertion
    const ids = await store.addDocuments(docs);
  
    const resultA = await store.similaritySearch("hello", 2);
   // console.log(resultA);
  
    /*
      [
        Document { pageContent: "hello", metadata: { b: 1, c: 9, stuff: "right" } },
        Document { pageContent: "hello", metadata: { b: 1, c: 9, stuff: "wrong" } },
      ]
    */
  
    await store.delete({ ids });
  
    const resultB = await store.similaritySearch("hello", 2);
    //console.log(resultB);
  
    /*
      []
    */
  };
  //run();