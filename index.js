import express from 'express'
import cors from 'cors'
import { Configuration, OpenAIApi } from "openai";
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'

dotenv.config()

const configuration = new Configuration({
    organization: "org-BkBV1Ulgpvlap1DCOeBu5ZbC",
    apiKey: process.env.OPENAI_API_KEY,
});

// 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

const openai = new OpenAIApi(configuration);

// async function callOpenAi(){
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: "Say this is a test",
//         max_tokens: 7,
//         temperature: 0,
//     });
//     console.log(response.data.choices[0].text);
// }

// callOpenAi();


const app = express()
app.use(cors())
app.use(express.json())
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from OpenAI!'
  })
})

app.post('/', async (req, res) => {

  try {
    const {message, currentModel} = req.body;
    // console.log(req.body)

    const response = await openai.createCompletion({
        model: `${currentModel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0,
    });
    res.status(200).send({
      message: response.data.choices[0].text
    });
  } catch (err) {
   
    
    res.status(500).send({ message: err });
  }

  
   

})

app.get('/models', async(req, res) => {
  try {
    const response = await openai.listModels();
    res.status(200).send({
      models: response.data.data
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }

 
})


app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //console.log("my errors",err);

  // render the error page
  res.status(err.status || 500);
  res.status(500).send({
    errors: err
  });
});
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))