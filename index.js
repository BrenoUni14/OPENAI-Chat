const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { Configuration, OpenAIApi } = require("openai")
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
const openai = new OpenAIApi(configuration);

app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function (req, res) {
  res.render("principal")
})

app.post("/", function (req, res) {
  async function runCompletion() {
    const body = req.body
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(body.prompt),
      max_tokens: 2048,
      temperature: 1
    });
    let response = completion.data.choices[0].text;
    response = response.split("\n")
    response = response.filter(elements => elements !== "");
    res.render("principal", {response})
  }
  runCompletion();
})

function generatePrompt(prompt) {
  const modelInput = `Summarize the following passage in one or two sentences: \n ${prompt}\n\nSummary:`;
  return modelInput;
}

app.listen(8081, function () {
  console.log("Rodando")
})
