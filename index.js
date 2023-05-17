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

function generatePrompt() {
  return `Resuma isso para um aluno da segunda série:

  Em química e física, um átomo é a menor unidade indivisível de um elemento químico que mantém suas propriedades químicas distintivas. Ele consiste em um núcleo denso e um envoltório eletrônico. O núcleo contém partículas subatômicas chamadas prótons e nêutrons, enquanto o envoltório eletrônico é composto por elétrons em órbita ao redor do núcleo.

Os prótons têm uma carga elétrica positiva, enquanto os elétrons têm uma carga negativa. Os nêutrons não possuem carga elétrica e são neutros. A carga elétrica positiva dos prótons é equilibrada pela carga negativa dos elétrons, tornando o átomo eletricamente neutro em sua forma estável.

O número de prótons em um átomo determina seu número atômico, que por sua vez identifica o elemento químico. Por exemplo, um átomo com 6 prótons é um átomo de carbono, independentemente do número de nêutrons ou elétrons.

Os elétrons estão distribuídos em camadas ou órbitas ao redor do núcleo. A camada mais próxima do núcleo pode conter até 2 elétrons, a segunda camada até 8 elétrons e assim por diante, seguindo um padrão de preenchimento específico. Essas camadas são chamadas de níveis de energia.

A interação eletromagnética entre os elétrons e o núcleo é governada pela mecânica quântica. A teoria quântica descreve a natureza probabilística da posição e do movimento dos elétrons. Em vez de traçar trajetórias definidas, a teoria quântica usa uma função de onda para descrever a distribuição de probabilidade dos elétrons ao redor do núcleo.

Além dos prótons, elétrons e nêutrons, os átomos também podem conter outras partículas subatômicas, como múons, quarks e léptons, dependendo do tipo de átomo e das condições específicas. Essas partículas subatômicas são estudadas em física de partículas e estão além do escopo de uma explicação geral sobre átomos.

Em resumo, átomos são as unidades fundamentais que compõem a matéria. Eles consistem em um núcleo contendo prótons e nêutrons, cercado por elétrons em órbita. A estrutura dos átomos e o comportamento de seus elétrons são governados pelas leis da física quântica. A compreensão dos átomos é essencial para entender a química e muitos outros aspectos da ciência. `
}


app.listen(8081, function () {
  console.log("Rodando")
})
