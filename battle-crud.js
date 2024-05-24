const { match } = require('assert');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { type } = require('os');
const uri = "mongodb://127.0.0.1:27017/?directConnection=true";

//
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const SAMPLE_BATTLE = {
    date: new Date(),
    playerA: "Brent",
    playerB: "Sam",
    teamA: [1,2,3], //ids de los pokemon del equipo A
    teamB: [4,5,6], //ids de los pokemon del equipo A
    resultado: [-1,-1,-1], //resultado de las batallas individuales de Pokemon
    winner: "B"
};

/**
 * Guarda una batalla en la base de datos
 * @param {object} battle La batalla a guardar
 * @returns true si la batalla fue guardada
 */
async function saveBattle(battle) {
    console.log("saving battle", battle);
    try {
        await client.connect();
        const db = client.db("pokemonBattle");
        const battles = db.collection("battles");
        const result = await battles.insertOne(battle);
        return result.acknowledged;
    } catch (error) {
        console.error("Error saving battle:", error);
        return false;
    } finally {
        await client.close();
    }
}

/**
 * Busca batllas utilizando el criterio dado que puede incluir date, playerA, playerB o winner.
 * @param {object} query Objeto criterio de busqueda
 * @param {integer} limit el número de resultados a devolver, -1 indica que no hay límite
 * @param {integer} offset el número de elementos a omitir del principio de la lista de resultados
 * @returns la lista de batallas que coinciden con el criterio de búsqueda
 */
async function queryBattles(query, limit , offset) {
    try {
        await client.connect();
        console.log("query battle, looking for");
        const db = client.db("pokemonBattle");
        const battles = db.collection("battles");
        const options = {};

        if (limit > 0) {
            options.limit = limit;
        }
        if (offset > 0) {
            options.skip = offset;
        }

        const results = await battles.find(query, options).toArray();
        return results;
    } catch (error) {
        console.error("Error querying battles:", error);
        return [];
    } finally {
        await client.close();
    }
}

exports.saveBattle = saveBattle;
exports.queryBattles = queryBattles;