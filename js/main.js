let selectedCard = null;

let choosingLane = false;

let swappingLane = false;

async function initialize(){

    await loadDatabase();

    selectedCard = null;

    refreshUI();

}

initialize();