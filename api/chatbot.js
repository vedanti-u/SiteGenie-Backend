var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')

const chatBotUtils = require('../utils/chatbotutils.js');
//const generateChatBot = require('../utils/chatbotutils.js')

// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({extended:true})

router.get('/chatbot', (req, res) => {
    res.send('Hello World! im chatbot')
  })
router.post('/chatbot',async(req,res)=>{
    // console.log("In POST")
    // console.log(req.body);
    const fetchedUrl = req.body.url;
    // console.log(fetchedUrl)
    if(!fetchedUrl){
        res.json("Url required");
    }
    try{
        console.log("trying to send response")
        const answer = await chatBotUtils.generateChatBot(fetchedUrl);
        //res.json(answer);
        res.send(answer);
    }catch(error){
        console.log("Catch block error:",error);
        return res.status(500).send({error});
    }
});
router.post('/chatbotprompt',async(req,res)=>{
    console.log("In /chatbotprompt")
    const fetchedUrl = req.body.url; 
    const fetchedPrompt = req.body.prompt;
    if(!fetchedUrl){
        res.json("Url required")
    }
    if(!fetchedPrompt){
        res.json("Prompt required")
    }
    try{
        console.log("trying to send response")
        const answer = await chatBotUtils.createChatBot(fetchedUrl,fetchedPrompt);
        res.send(answer)
    }catch(error){
        console.log("Catch block error :",error);
        return res.status(500).send({error});
    }
});
router.delete('/chatbot',async(req,res)=>{
    console.log("In Delete")
    // console.log(req.body);
    const fetchedUrl = req.body.url;
  //  console.log(fetchedUrl)
    if(!fetchedUrl){
        res.json("Url required");
    }
    try{
        console.log("trying to delete")
        const answer = await chatBotUtils.removeEmbeddings(fetchedUrl);
        res.send(answer);
    }catch(error){
        console.log("Catch block error:",error);
        return res.status(500).send({error});
    }
});
router.put('/chatbot',async(req,res)=>{
    console.log("In IN PUT")
    // console.log(req.body);
    const fetchedUrl = req.body.url;
   // console.log(fetchedUrl)
    if(!fetchedUrl){
        res.json("Url required");
    }
    try{
        console.log("trying to send response")
        const answer = await chatBotUtils.updateEmbeddings(fetchedUrl);
        //res.json(answer);
        res.status(200).send(answer);
    }catch(error){
        console.log("Catch block error:",error);
        return res.status(500).send({error});
    }
});
module.exports=router;