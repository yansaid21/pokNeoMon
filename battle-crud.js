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
    return false;
}

/**
 * Busca batllas utilizando el criterio dado que puede incluir date, playerA, playerB o winner.
 * @param {object} query Objeto criterio de busqueda
 * @param {integer} limit el número de resultados a devolver, -1 indica que no hay límite
 * @param {integer} offset el número de elementos a omitir del principio de la lista de resultados
 * @returns la lista de batallas que coinciden con el criterio de búsqueda
 */
async function queryBattles(query, limit = -1, offset = 0) {
    return [SAMPLE_BATTLE];
}

exports.saveBattle = saveBattle;
exports.queryBattles = queryBattles;