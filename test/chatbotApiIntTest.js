const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const chai = require('chai');
const app = express();
const router = require('../api/chatbot');

app.use(bodyParser.json());
app.use('/api', router);

const expect = chai.expect;
console.log(process.argv);
const url = process.argv[3] || null;

let request;
if (url === null) {
  request = supertest(app);
} else {
  request = supertest(url);
}

describe('Chatbot API', () => {
  const baseRoute = url === null ? '/api' : ''; // Modify the base route based on the url
  beforeEach(async () => {
    // Any setup code you want to run before each test
    console.log("HIIIII")
  });

  it('should respond with "Hello World! im chatbot" for GET ' + baseRoute + '/chatbot', async () => {
    const response = await request.get(baseRoute + '/chatbot');
    expect(response.status).to.equal(200);
    expect(response.text).to.equal('Hello World! im chatbot');
  });

  it('should respond with chatbot answer for POST ' + baseRoute + '/chatbot', async () => {
    const response = await request
      .post(baseRoute + '/chatbot')
      .send({ url: 'https://skippi.in/' });

    expect(response.status).to.equal(200);
    // Add more assertions based on your expected response
  }).timeout(5000);

  it('should respond with chatbot answer for POST ' + baseRoute + '/chatbotprompt', async () => {
    const response = await request
      .post(baseRoute + '/chatbotprompt')
      .send({ url: 'https://skippi.in/', prompt: 'your-prompt-here' });

    expect(response.status).to.equal(200);
    // Add more assertions based on your expected response
  }).timeout(5000);

  it('should respond with success for PUT ' + baseRoute + '/chatbot', async () => {
    const response = await request
      .put(baseRoute + '/chatbot')
      .send({ url: 'https://skippi.in/' });

    expect(response.status).to.equal(200);
    // Add more assertions based on your expected response
  }).timeout(10000);

  it('should respond with success for DELETE ' + baseRoute + '/chatbot', async () => {
    const response = await request
      .delete(baseRoute + '/chatbot')
      .send({ url: 'https://skippi.in/' });

    expect(response.status).to.equal(200);
    // Add more assertions based on your expected response
  });

});
