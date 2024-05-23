const ENDPOINT = 'http://localhost:3000/api/pokemon';

async function listPokemon(limit = -1, offset = 0) {
    return await get(ENDPOINT + '/list', {"limit": limit, "offset": offset});
}

async function queryPokemon(query, limit = -1, offset = 0) {
    return await post(ENDPOINT + '/query', {"limit": limit, "offset": offset}, {"query": query});
}

async function getEvolutions(pid) {
    console.log("en function pid", pid);
    return await get(ENDPOINT + '/evolutions', {"pid": pid});
}

async function simulateBattle(teamA, teamB) {
    return await post(ENDPOINT + '/simulate-battle', {}, {"teamA": teamA, "teamB": teamB});
}

async function findStrongAgainst(pid) {
    return await get(ENDPOINT + '/find-strong-against', {"pid": pid});
}

async function saveBattle(battle) {
    return await post(ENDPOINT + '/save-battle', {}, {"battle": battle});
}

async function queryBattles(query, limit = -1, offset = 0) {
    return await post(ENDPOINT + '/query-battle', {"limit": limit, "offset": offset}, {"query": query});
}

async function post(url = "", query = {}, body = {}) {
    // Default options are marked with *
    const response = await fetch(url + '?' + queryToString(query), {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        //mode: "no-cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: "follow", // manual, *follow, error
        //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function get(url = "", query = {}) {
    // Default options are marked with *
    console.log("entrando a get");
    const response = await fetch(url + '?' + queryToString(query));
    return response.json(); // parses JSON response into native JavaScript objects
}

function queryToString(query) {
    return new URLSearchParams(query).toString();
}