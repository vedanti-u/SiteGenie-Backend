# SiteGenie: Web based AI chatbot

Tired of providing the same answers to your questions over and over again? Introducing SiteGenie – Your Web-Based AI Chatbot. Elevate your online presence with the power of artificial intelligence at your fingertips. SiteGenie is not just a chatbot; it's your virtual assistant for creating engaging and personalized interactions on your website. Craft dynamic conversations, enhance user engagement, and streamline customer interactions effortlessly. Trained on user-provided links, this advanced chatbot seamlessly integrates with websites, delivering instant responses and boosting user engagement. It expedites interactions by eliminating time-consuming searches, significantly improving operational efficiency.

# Why SiteGenie:

•Tailored Data Training: Our chatbot receives specialized training from carefully selected web pages, nurturing a vast knowledge   base for GPT model proficiency.
•Effortless Integration: Easily embed the chatbot directly onto any website, enriching user satisfaction and engagement.
•Instantaneous Responses: The chatbot promptly addresses user queries regarding website content, eradicating the need for human    intervention.
•Time Optimization: Users experience significant time savings, as manual search efforts become a thing of the past. This chatbot   sets a new standard for website interactions, simplifying information retrieval with unmatched efficiency.
•Actionable Insights: SiteGenie provides valuable insights into user behaviour and preferences, empowering businesses to make      data-driven decisions that optimize their website and marketing strategies.
•Cost-Effective Solution: SiteGenie offers a cost-effective alternative to traditional customer support methods, saving            businesses time and money while delivering exceptional service with 24/7 availability.
•GPT model compatibility: The chatbot's knowledge base is designed to be compatible with GPT models like GPT-3.5, ensuring that    the chatbot can be trained on your custom knowledge base to provide informative and comprehensive responses to user queries. By   training the chatbot on a custom knowledge base of handpicked pages, we can improve the chatbot's performance and accuracy,       resulting in a more informative and engaging user experience.

# Flow of Implementation:

URL for data collection: (Frontend) React with Next.js/Nuxt.js
Data Preprocessing and Cleaning: (Backend) Node.js with Express.js, Libraries like Cheerio (for web-scrapping), LangChain(for creating embeddings).
Model Selection and Training: OpenAI API (model GPT-3.5)
User Interface Integration & Customization: React components for the chat interface with Tailwind CSS framework
Deployment: Vercel
Database: Supabase(to store chat history and customer feedback)

# Get Started by:

1.Visiting our website and sign-in or create account.
2.Then go to create chatbot page, click on add url.
3.After redirecting, enter the url for website for which chatbot is to be generated and click on generate chatbot.
4.After successful creation, you can see the preview of chatbot and after that your chatbot is ready for use.

Moreover, you can update or delete the chatbot as per your convenience. Hence, easy modifications and integrations with user-friendly environment.

# Site-Backend

this repo contains all the code of backend

---
# Installation

## Requirements
*For development, you will only need Node.js and a node global package, Yarn, installed in your environement.*

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.17.1

    $ npm --version
    9.7.1

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

---
###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn
      $ yarn -v
      1.22.19
---

## Install

    $ git clone https://github.com/vedanti-u/site-backend.git
    $ yarn install

## Nodemon Installation
    $ yarn global add nodemon

## Running the project

    $ yarn start
    OR
    $ nodemon app.js

## Simple build for production

    $ yarn build
