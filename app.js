const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const router = require('./api/chatbot')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})
