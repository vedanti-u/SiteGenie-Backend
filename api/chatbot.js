var express = require('express')
var router = express.Router();

const createChatBot = require('../utils/chatbotutils.js');
router.get('/chatbot', (req, res) => {
    res.send('Hello World! im chatbot')
  })
router.post('/chatbot',async(req,res)=>{
    console.log("In POST")
    if(this.url === undefined) {return}
    const fetchedurl = req.body.url;
    const fetchedprompt = req.body.prompt;
    
    if(!fetchedurl){
        res.json("Url required");
    }
    try{
        const answer = await createChatBot(fetchedurl,fetchedprompt);
        res.json(answer);
        
    }catch(error){
        console.log("Catch block error:",error);
        return res.status(500).send({error});
    }
});

module.exports=router;