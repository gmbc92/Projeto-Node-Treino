const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");


connection.authenticate().then(() => { //autenticacao do banco e conexao
    console.log("Conexão com o Banco de Dados feita com sucesso!")
}).catch((msgErro) => {
    console.log(msgErro);
});

app.set('view engine', 'ejs'); //uso do ejs
app.use(express.static('public')); //configuraçao express para css

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => { //parametros express, findAll do sequelizer, query procura todas as perguntas e ordena por id descendente
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => { //entao mostra tudo na pagina main index
        res.render("index", {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) => { //redireciona para a pagina perguntar
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    //res.send("Formulário Recebido de Titulo: " + titulo + " " + " e descricao: " + descricao );
    // funcao do sequelizer create = 'INSERT INTO perguntas... passa via POST labem titulo variavel correspondente e descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => { //pega o id do front e busca uma pergunta equivalente com sua resposta
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect("/");
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        // usa o model Resposta pegando as variaveis do front respondendo o corpo e o id da tabela
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        // redireciona para a pagina da pergunta
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(8080, () => { //verificacao da conexao com localhost
    console.log("app rodando!");
});