let player1Deck = [];
let player2Deck = [];

const players = {

    1: player1Deck,

    2: player2Deck

};
function getPlayerDeck(player){

    return players[player];

}

function getOpponentDeck(player){

    return players[player === 1 ? 2 : 1];

}

let nextUID = 1;
function findCard(uid){

    for(const player in players){

        const card = players[player].find(c => c.uid == uid);

        if(card)
            return card;

    }

    return null;

}
function getCardCreature(card){

    return getCreature(card.creatureID);

}
function getTemporaryValue(card, status){

    return card[status].reduce(

        (total, effect) => total + effect.value,

        0

    );

}
function createMatchCard(creatureID, owner){

    const creature = getCreature(creatureID);

    return{

        uid: nextUID++,

        creatureID: creature.id,

        owner: owner,

        inPlay: false,

        lane: null,

        hp: creature.hp,

        armor: 0,

        strength: 0,

        weakness: 0,

        sturdy: 0,

        vulnerable: 0,

        swiftness: 0,

        slowness: 0,

        priority: false,

        tempStrength: [],
        tempWeakness: [],

        tempSturdy: [],
        tempVulnerable: [],

        tempSwiftness: [],
        tempSlowness: [],
        tempArmor: [],
        tempPoison: [],

        tempProtection: [],
        tempAsleep: [],
        tempMarked: [],
        tempTorpidity: [],

tempSwift: [],
tempSluggish: [],

        poison: 0,

        protection: 0,
        asleep: 0,
        torpidity: 0,
        marked: 0,
        swift: 0,
        sluggish: 0,

        moves: creature.moves.map(moveID => {

            const move = getMove(moveID);

            return{

                id: moveID,

                selected: false,

                charges: move.maxCharges ?? null

            };

        })

    };

}
function changeHP(amount){

    if(!selectedCard) return;

    selectedCard.hp += amount;

    if(selectedCard.hp < 0)
        selectedCard.hp = 0;

    refreshUI();

}

function changeArmor(amount){

    if(!selectedCard) return;

    selectedCard.armor += amount;

    if(selectedCard.armor < 0)
        selectedCard.armor = 0;

    refreshUI();

}

function changeStrength(amount){

    if(!selectedCard) return;

    selectedCard.strength += amount;

    if(selectedCard.strength < 0)
        selectedCard.strength = 0;

    refreshUI();

}

function changeWeakness(amount){

    if(!selectedCard) return;

    selectedCard.weakness += amount;

    if(selectedCard.weakness < 0)
        selectedCard.weakness = 0;

    refreshUI();

}
function changeSturdy(amount){

    if(!selectedCard) return;

    selectedCard.sturdy += amount;

    if(selectedCard.sturdy < 0)
        selectedCard.sturdy = 0;

    refreshUI();

}

function changeVulnerable(amount){

    if(!selectedCard) return;

    selectedCard.vulnerable += amount;

    if(selectedCard.vulnerable < 0)
        selectedCard.vulnerable = 0;

    refreshUI();

}

function changeSwiftness(amount){

    if(!selectedCard) return;

    selectedCard.swiftness += amount;

    if(selectedCard.swiftness < 0)
        selectedCard.swiftness = 0;

    refreshUI();

}

function changeSlowness(amount){

    if(!selectedCard) return;

    selectedCard.slowness += amount;

    if(selectedCard.slowness < 0)
        selectedCard.slowness = 0;

    refreshUI();

}
function changeProtection(amount){

    if(!selectedCard) return;

    selectedCard.protection = Math.max(
        0,
        selectedCard.protection + amount
    );

    refreshUI();

}

function changeAsleep(amount){

    if(!selectedCard) return;

    selectedCard.asleep = Math.max(
        0,
        selectedCard.asleep + amount
    );

    refreshUI();

}

function changeTorpidity(amount){

    if(!selectedCard) return;

    selectedCard.torpidity = Math.max(
        0,
        selectedCard.torpidity + amount
    );

    refreshUI();

}

function changeMarked(amount){

    if(!selectedCard) return;

    selectedCard.marked = Math.max(
        0,
        selectedCard.marked + amount
    );

    refreshUI();

}

function changeSwift(amount){

    if(!selectedCard) return;

    selectedCard.swift = Math.max(
        0,
        selectedCard.swift + amount
    );

    refreshUI();

}

function changeSluggish(amount){

    if(!selectedCard) return;

    selectedCard.sluggish = Math.max(
        0,
        selectedCard.sluggish + amount
    );

    refreshUI();

}
function playSelectedCard(){

    if(!selectedCard)
        return;

    if(selectedCard.inPlay)
        return;
    triggerTalent(selectedCard,"onPlay");

    choosingLane = true;

    refreshUI();

}
function placeSelectedCard(lane){

    if(swappingLane){

        swapSelectedCard(lane);
        return;

    }

    if(!choosingLane && !swappingLane)
        return;

    if(!selectedCard)
        return;

    const occupied = getPlayerDeck(selectedCard.owner).some(card =>

        card.inPlay &&
        card.lane === lane

    );

    if(occupied){

        alert("That lane is already occupied.");

        return;

    }

    selectedCard.lane = lane;

    if(choosingLane){

        selectedCard.inPlay = true;

    }

    choosingLane = false;
    swappingLane = false;

    refreshUI();

}
function retreatSelectedCard(){

    if(!selectedCard)
        return;

    selectedCard.inPlay = false;
    selectedCard.lane = null;

    // Permanent

    selectedCard.armor = 0;

    selectedCard.strength = 0;
    selectedCard.weakness = 0;

    selectedCard.sturdy = 0;
    selectedCard.vulnerable = 0;

    selectedCard.swiftness = 0;
    selectedCard.slowness = 0;

    // Temporary

    selectedCard.tempStrength = [];
    selectedCard.tempWeakness = [];

    selectedCard.tempSturdy = [];
    selectedCard.tempVulnerable = [];

    selectedCard.tempSwiftness = [];
    selectedCard.tempSlowness = [];

    selectedCard.tempProtection = [];
    selectedCard.tempAsleep = [];
    selectedCard.tempMarked = [];
    selectedCard.tempTorpidity = [];
    selectedCard.tempSwift = [];
    selectedCard.tempSluggish = [];

    // Other

    selectedCard.priority = false;

    selectedCard.protection = 0;
    selectedCard.asleep = 0;
    selectedCard.marked = 0;
    selectedCard.torpidity = 0;
    selectedCard.swift = 0;
    selectedCard.sluggish = 0;

    // Poison stays

    refreshUI();

}
function selectCard(uid){

    selectedCard = [

        ...getPlayerDeck(1),

        ...getPlayerDeck(2)

    ].find(card => card.uid === uid);

    refreshUI();

}
function getCurrentPower(card){

    return (

        card.strength
        + getTemporaryValue(card, "tempStrength")

    ) - (

        card.weakness
        + getTemporaryValue(card, "tempWeakness")

    );

}
function getCurrentDefense(card){

    return (

        card.sturdy
        + getTemporaryValue(card, "tempSturdy")

    ) - (

        card.vulnerable
        + getTemporaryValue(card, "tempVulnerable")

    );

}
function getCurrentSpeed(card){

    const creature = getCardCreature(card);

    const speed =

        creature.speed

        + card.swiftness
        + getTemporaryValue(card,"tempSwiftness")

        - card.slowness
        - getTemporaryValue(card,"tempSlowness");

    return Math.max(0, speed);

}
function getPowerIcon(card){

    return getCurrentPower(card) >= 0
        ? "strength.png"
        : "weakness.png";

}

function getDefenseIcon(card){

    return getCurrentDefense(card) >= 0
        ? "sturdy.png"
        : "vulnerable.png";

}
function getDisplayedPower(card){

    return Math.abs(getCurrentPower(card));

}

function getDisplayedDefense(card){

    return Math.abs(getCurrentDefense(card));

}
function swapLane(){

    if(!selectedCard) return;

    if(!selectedCard.inPlay) return;

    swappingLane = true;

    refreshUI();

}
function swapSelectedCard(newLane){

    if(!selectedCard)
        return;

    const deck = getPlayerDeck(selectedCard.owner);

    const otherCard = deck.find(card =>

        card.inPlay &&
        card.lane === newLane &&
        card.uid !== selectedCard.uid

    );

    if(otherCard){

        const oldLane = selectedCard.lane;

        selectedCard.lane = newLane;
        otherCard.lane = oldLane;

    }
    else{

        selectedCard.lane = newLane;

    }

    swappingLane = false;

    refreshUI();

}
function onBoardClick(lane, uid){

    if(swappingLane){

        swapSelectedCard(lane);

    }else{

        selectCard(uid);

    }

}
function addStatus(card,status,value,duration){

    card[status].push({

        value:value,

        duration:duration

    });

    refreshUI();

}

function removeStatus(card, status, index){

    if(index < 0 || index >= card[status].length)
        return;

    card[status].splice(index, 1);

    refreshUI();

}
function endTurn(){

    player1Deck.forEach(card => {

    countdownStatuses(card);

    deselectMoves(card);

});

    // Player 2 will be added later

    refreshUI();

}
function countdownStatuses(card){

    const temporaryStatuses = [

        "tempArmor",

        "tempStrength",
        "tempWeakness",

        "tempSturdy",
        "tempVulnerable",

        "tempSwiftness",
        "tempSlowness",

        "tempPoison",

        "tempMarked",
        "tempProtection",
        "tempTorpidity",
        "tempAsleep",

        "tempSwift",
        "tempSluggish"

    ];

    temporaryStatuses.forEach(status=>{

        card[status] = card[status]

            .map(effect=>{

                effect.duration--;

                return effect;

            })

            .filter(effect=>effect.duration>=0);

    });

    if(card.poison>0){

        card.poison--;

    }

}
function triggerTalent(card, trigger){

    const creature = getCardCreature(card);

    if(!creature.talent)
        return;

    console.log(

        creature.name,
        "triggered",
        creature.talent,
        trigger

    );

}
function changePoison(amount){

    if(!selectedCard) return;

    selectedCard.poison += amount;

    if(selectedCard.poison < 0)
        selectedCard.poison = 0;

    refreshUI();

}
function selectMove(card, moveIndex){

    card.moves.forEach(move => {

        move.selected = false;

    });

    card.moves[moveIndex].selected = true;

    refreshUI();

}
function deselectMoves(card){

    card.moves.forEach(move => {

        move.selected = false;

    });

}
function changeMoveCharges(moveIndex, amount){

    const move = selectedCard.moves[moveIndex];

    if(move.charges === null)
        return;

    const moveData = getMove(move.id);

    move.charges += amount;

    if(move.charges < 0)
        move.charges = 0;

    if(move.charges > moveData.maxCharges)
        move.charges = moveData.maxCharges;

    refreshUI();

}
function removeCardFromDeck(player, uid){

    const deck = getPlayerDeck(player);

    const index = deck.findIndex(card => card.uid === uid);

    if(index === -1)
        return;

    if(selectedCard && selectedCard.uid === uid){

        selectedCard = null;

    }

    deck.splice(index,1);

    refreshUI();

}