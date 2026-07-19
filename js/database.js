let creatureDatabase = [];

let moveDatabase = {};

let talentDatabase = {};

let statusDatabase = {};

async function loadDatabase(){

    const [

        creatures,

        moves,

        talents,

        statuses

    ] = await Promise.all([

        fetch("data/creatures.json"),

        fetch("data/moves.json"),

        fetch("data/talents.json"),

        fetch("data/statuses.json")

    ]);

    creatureDatabase = await creatures.json();

    moveDatabase = await moves.json();

    talentDatabase = await talents.json();

    statusDatabase = await statuses.json();

}

function getCreature(id){

    return creatureDatabase.find(c => c.id === id);

}
function getMove(id){

    return moveDatabase[id];

}

function getTalent(id){

    return talentDatabase[id];

}

function getStatus(id){

    return statusDatabase[id];

}