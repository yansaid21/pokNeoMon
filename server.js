const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pokeCrud = require('./pokemon-crud.js');
const battleCrud = require('./battle-crud.js');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/pokemon/list', async (req, res) => {
    console.log(req.query);
    let defaults = {
        limit: -1,
        offset: 0
    };
    let params = Object.assign({}, defaults, req.query);
    const list = await pokeCrud.listPokemon(parseInt(params.limit), parseInt(params.offset));
    res.json(list);
});
app.post('/api/pokemon/query', async (req, res) => {
    console.log("Request: " + req.originalUrl);
    console.log(req.query);
    console.log(req.body);
    let defaults = {
        limit: -1,
        offset: 0
    };
    let params = Object.assign({}, defaults, req.query);
    const query = req.body.query;
    const list = await pokeCrud.queryPokemon(query, parseInt(params.limit), parseInt(params.offset));
    console.log('Responding with: ');
    console.log(list);
    res.json(list);
});
app.get('/api/pokemon/evolutions', async (req, res) => {
    console.log("Request: " + req.originalUrl);
    console.log(req.query);
    const evo = await pokeCrud.getEvolutions(req.query.pid);
    res.json(evo);
});
app.post('/api/pokemon/simulate-battle', async (req, res) => {
    console.log("Request: " + req.originalUrl);
    console.log(req.body);
    const result = await pokeCrud.simulateBattle(req.body.teamA, req.body.teamB);
    res.json(result);
});
app.get('/api/pokemon/find-strong-against', async (req, res) => {
    console.log("Request: " + req.originalUrl);
    console.log(req.query);
    const result = await pokeCrud.findStrongAgainst(req.query.pid);
    res.json(result);
});

app.post('/api/pokemon/save-battle', async (req, res) => {
    console.log("Request: " + req.originalUrl);
    console.log(req.body);
    const result = await battleCrud.saveBattle(req.body.battle);
    res.json(result);
});
app.post('/api/pokemon/query-battle', async (req, res) => {
    console.log("Request: " + req.originalUrl);
    console.log(req.body);
    let defaults = {
        limit: -1,
        offset: 0
    };
    let params = Object.assign({}, defaults, req.query);
    const list = await battleCrud.queryBattles(req.body.query, parseInt(params.limit), parseInt(params.offset));
    res.json(list);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});