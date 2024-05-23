function showList(pokemon, container) {
    if (!Array.isArray(pokemon) || pokemon.length == 0) {
        container.innerHTML = 'Nothing found';
        return;
    }
    const list = pokemon.map((p) => `
    <div class="col">
        <div class="card h-100">
            <img data-pid="${p.id.low}" src="${p.hires}" draggable="true" ondragstart="drag(event)" class="card-img-top rounded mx-auto d-block" style="width: 150px;" alt="${p.name}'s picture">
            <div class="card-body">
                <h5 class="card-title">${p.name}</h5>
                <p class="card-text">${p.species}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><small>${p.description}</small></li>
                <li class="list-group-item">${(p.type || ["none"]).join(', ')}</li>
            </ul>
            <div class="card-body">
                <button class="btn btn-secondary evo-btn" data-pid="${p.id.low}">Evolutions</button>
            </div>
        </div>
    </div>
    `);
    container.innerHTML = list.join("\n");
    // console.log(container.innerHTML);
}

function listEvolutions(pokemon) {
    console.log(pokemon);
    const body = pokemon.map((p) => `
        <tr>
            <td><img data-pid="${p.id}" src="${p.hires}" draggable="true" ondragstart="drag(event)" class="card-img-top rounded mx-auto d-block" style="width: 50px;" alt="${p.name}'s picture"></td>
            <td>${p.name}</td>
        </tr>
    `).join("\n");
    return `<table><tbody>${body}</tbody><table>`;
}

function showPokemon(pokemon, container) {
    const p = pokemon;
    const content = `
        <img src="${p.hires}" class="img-thumbnail rounded mx-auto d-block"/>
        <table>
            <tbody>
                <tr>
                    <th>Nombre:</th>
                    <td>${p.name}</td>
                </tr>
                <tr>
                    <th>Species:</th>
                    <td>${p.species}</td>
                </tr>
                <tr>
                    <th>Descripci&oacute;n:</th>
                    <td>${p.description}</td>
                </tr>
                <tr>
                    <th>Tipos:</th>
                    <td>${p.type.join(', ')}</td>
                </tr>
            </tbody>
        </table>
    `;
    container.innerHTML = content;  
}

function listBattles(battles) {
    return battles.map((b) =>
        `<tr>
            <td>${b.date}</td>
            <td>${b.playerA}</td>
            <td>${b.playerB}</td>
            <td>${b.teamA.join(',')}</td>
            <td>${b.teamB.join(',')}</td>
            <td>${b.resultado.join(',')}</td>
            <td>${b.winner}</td>
        </tr>`
    ).join("\n");
}