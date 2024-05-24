const JUST_BULBASAUR = {
    id: 1,
    name: "Bulbasaur",
    species: "Seed Pokémon",
    description: "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun’s rays, the seed grows progressively larger.",
    hires: "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/001.png",
    thumbnail: "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/thumbnails/001.png",
    sprite: "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/sprites/001.png",
    types: ["Grass", "Poison"]
};
var neo4j = require('neo4j-driver');
const URI = 'neo4j://localhost:7687';
const USER = 'neo4j';
const PASSWORD = '12345678';
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
async function runQuery(query, params = {}) {
    let session = driver.session();
    try {
        const result = await session.run(query, params);
        /* console.log("result",result); */
        return result.records;
    } catch (error) {
        console.error("Query error", error);
        throw error;
    } finally {
        await session.close();
    }
}

/**
 * Devuelve una lista con todos los pokemon
 * @param {integer} limit el número de resultados a devolver, -1 indica que no hay límite
 * @param {integer} offset el número de elementos a omitir del principio de la lista de resultados
 * @returns
 */
async function listPokemon(limit, offset ) {
    /* console.log("listando pokemones"); */

    limit = neo4j.int(limit);
    offset = neo4j.int(offset);
/*     console.log("este es limit",limit);
    console.log("este es offset",offset);
    console.log(typeof(limit));
    console.log(typeof(offset)); 
 */

    const query = `MATCH (p:Pokemon) RETURN p SKIP $offset ${limit > -1 ? 'LIMIT $limit' : ''}`;
    const params = { limit, offset };
    /* console.log("esto es params", params); */
    const records = await runQuery(query, params);
    /* console.log("records",records); */
    return records.map(record => record.get('p').properties);
}

/**
 * Busca pokemon utilizando el criterio dado
 * @param {string|object} query Una cadena que debe buscarse dentro del nombre, especie o descripcion del pokemon. 
 * También puede ser un objeto con los campos id, name, species, description o types con criterios de búsqueda para 
 * encontrar pokemon
 * @param {integer} limit el número de resultados a devolver, -1 indica que no hay límite
 * @param {integer} offset el número de elementos a omitir del principio de la lista de resultados
 * @returns la lista de pokemon que coinciden con el criterio de búsqueda
 */
async function queryPokemon(query, limit, offset) {
    let queryStr = 'MATCH (p:Pokemon) ';
    limit = neo4j.int(limit);
    offset = neo4j.int(offset);
    const params = { limit, offset };
    if (typeof query === 'string') {
      queryStr += 'WHERE p.name CONTAINS $query OR p.species CONTAINS $query OR p.description CONTAINS $query';
      params.query = query;
    } else if (typeof query === 'object') {
      const conditions = [];

        if(query.name){
            conditions.push(`p.name CONTAINS $name`);
            params['name'] = query['name'];
        }
        if(query.id){
            conditions.push(`p.id = $id`);
            params['id'] = neo4j.int(query['id']);
        }
        if(query.types){
            conditions.push(`(p)-[:HAS]->(:Type{name: $types})`);
            params['types'] = query['types'];
        }
        if(query.species){
            conditions.push(`p.species CONTAINS $species`);
            params['species'] = query['species'];
        }
        if(query.description){
            conditions.push(`p.description CONTAINS $description`);
            params['description'] = query['description'];
        }
        if (conditions.length > 0){
            queryStr += "WHERE " + conditions.join(' AND ');
        }
    }
    queryStr += ' RETURN p SKIP $offset' + (limit > -1 ? ' LIMIT $limit' : '');
    console.log("queryStr: ",queryStr);
    console.log("params", params);
    const records = await runQuery(queryStr, params);
   /*  console.log(">>>>>",records); */
    return records.map(record => record.get('p').properties);
  }

/**
 * Devuelve las evoluciones del pokemon dado
 * @param {string} pid 
 * @returns la lista de pokemon que son evoluciones del pokemon dado.
 */
async function getEvolutions(pid) {
    const query = 'MATCH (p:Pokemon)-[:EVOLVES]->(e:Pokemon) WHERE p.id = $pid RETURN e';
    const params = { pid: neo4j.int(pid) };
    const records = await runQuery(query, params);
    console.log("log evolutions",records.map(record => record.get('e').properties));
    return records.map(record => record.get('e').properties);
  }

/**
 * Determina el resultado de una batalla entre dos equipos de pokemon segun sus tipos.
 * @param {string[]} teamA lista de ids de los pokemon en el equipo A
 * @param {string[]} teamB lista de ids de los pokemon en el equipo B
 * @returns Resultado de una batalla uno a uno entre los pokemon con los id especificados en
 * cada equipo, donde 1 indica que gana el pokemon del equipo A, -1 que el ganador es el pokemon del equipo B
 * y 0 que hay un empate.
 */
async function simulateBattle(teamA, teamB) {
    const results = [];
    for (let i = 0; i < teamA.length; i++) {
        const a = teamA[i];
        const b = teamB[i];

        let query = `
        MATCH (p:Pokemon {id: ${a}})-[:HAS]->(:Type)-[:EFFECTIVE]->(effectiveType)<-[:HAS]-(e:Pokemon {id: ${b}})
        RETURN COUNT(e) > 0 AS isEffective
        `;
        const params = { a, b };
        
        try {
            let result = await runQuery(query, params);
            let finalResult = result[0]._fields[result[0]._fieldLookup['isEffective']];
            if (finalResult == true) {
                finalResult = 1;
            } else if (finalResult == false) {
                query = `
                MATCH (p:Pokemon {id: ${b}})-[:HAS]->(:Type)-[:EFFECTIVE]->(effectiveType)<-[:HAS]-(e:Pokemon {id: ${a}})
                RETURN COUNT(e) > 0 AS isEffective
                `;
                result = await runQuery(query, params); 
                finalResult = result[0]._fields[result[0]._fieldLookup['isEffective']];
                if (finalResult == true) {
                    finalResult = -1;
                } else if (finalResult == false) {
                    finalResult = 0;
                }
            }
            results.push(finalResult);
        } catch (error) {
            console.error("Query error", error);
        }
    }
    return results;
}

/**
 * Encuentra pokemon que son fuertes contra todos los pokemon dados
 * @param {string|string[]} pid the id of the pokemon 
 * @returns Un pokemon que es fuerte contra todos los pokemon dados
 */
async function findStrongAgainst(pid) {
/*     MATCH (p:Pokemon)-[:HAS]->(t:Type)-[:EFFECTIVE]->(strongType:Type)<-[:HAS]-(strong:Pokemon)
    WHERE p.id = $pid
    RETURN strong */
    const query = `MATCH (p:Pokemon)-[:HAS]->(:Type)-[:EFFECTIVE]->(:Type)<-[:HAS]-(e:Pokemon {id: $pida})
WITH p
MATCH (p)-[:HAS]->(:Type)-[:EFFECTIVE]->(:Type)<-[:HAS]-(i:Pokemon {id: $pidb})
WITH p
MATCH (p)-[:HAS]->(:Type)-[:EFFECTIVE]->(:Type)<-[:HAS]-(o:Pokemon {id: $pidc})
RETURN p
    `;
    pids=[]
    pids= pid.split(',');
    console.log(pid);
        const params = { pida: neo4j.int(pids[0]),
            pidb: neo4j.int(pids[1]),
            pidc: neo4j.int(pids[2]),
         };
         console.log(params);
         console.log(query);
        const records = await runQuery(query, params);
        console.log(records[0].get('p').properties);
        return records.length ? records[0].get('p').properties : null;

    
  }

exports.listPokemon = listPokemon;
exports.queryPokemon = queryPokemon;
exports.getEvolutions = getEvolutions;
exports.simulateBattle = simulateBattle;
exports.findStrongAgainst = findStrongAgainst;