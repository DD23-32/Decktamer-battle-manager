let player1Deck = [];
let player2Deck = [];
let currentTurn = 1;

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
function createMatchCard(creatureID, owner, forcedUID = null){

    const creature = getCreature(creatureID);

    return{

       uid: forcedUID ?? nextUID++,

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

    if(!selectedCard)
        return;

    applyStatChange(

        selectedCard.uid,

        "hp",

        amount

    );

    sendCommand({

        type: "changeStat",

        uid: selectedCard.uid,

        stat: "hp",

        delta: amount

    });

}
function applyHP(card, amount){

    card.hp += amount;

    if(card.hp < 0)
        card.hp = 0;

    refreshUI();

}
function changeArmor(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "armor", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "armor",
        delta: amount
    });

}

function changeStrength(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "strength", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "strength",
        delta: amount
    });

}

function changeWeakness(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "weakness", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "weakness",
        delta: amount
    });

}

function changeSturdy(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "sturdy", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "sturdy",
        delta: amount
    });

}

function changeVulnerable(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "vulnerable", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "vulnerable",
        delta: amount
    });

}

function changeSwiftness(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "swiftness", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "swiftness",
        delta: amount
    });

}

function changeSlowness(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "slowness", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "slowness",
        delta: amount
    });

}

function changePoison(amount){

    console.log("changePoison called");

    if(!selectedCard)
        return;

    applyStatChange(

        selectedCard.uid,

        "poison",

        amount

    );
console.log("Sending poison:", amount);
    sendCommand({

        type: "changeStat",

        uid: selectedCard.uid,

        stat: "poison",

        delta: amount

    });

}
function changeProtection(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "protection", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "protection",
        delta: amount
    });

}

function changeAsleep(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "asleep", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "asleep",
        delta: amount
    });

}

function changeMarked(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "marked", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "marked",
        delta: amount
    });

}

function changeTorpidity(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "torpidity", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "torpidity",
        delta: amount
    });

}

function changeSwift(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "swift", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "swift",
        delta: amount
    });

}

function changeSluggish(amount){

    if(!selectedCard)
        return;

    applyStatChange(selectedCard.uid, "sluggish", amount);

    sendCommand({
        type: "changeStat",
        uid: selectedCard.uid,
        stat: "sluggish",
        delta: amount
    });

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
function applyPlay(card, lane){

    card.lane = lane;

    card.inPlay = true;

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

    applyPlay(selectedCard, lane);

sendCommand({

    type: "play",

    uid: selectedCard.uid,

    lane: lane

});

choosingLane = false;

swappingLane = false;

}
function applyRetreat(card){

    card.inPlay = false;

    card.lane = null;

    // Permanent combat stats

    card.armor = 0;

    card.strength = 0;
    card.weakness = 0;

    card.sturdy = 0;
    card.vulnerable = 0;

    card.swiftness = 0;
    card.slowness = 0;

    // Temporary combat stats

    card.tempStrength = [];
    card.tempWeakness = [];

    card.tempSturdy = [];
    card.tempVulnerable = [];

    card.tempSwiftness = [];
    card.tempSlowness = [];

    // Other effects

    card.priority = false;

    card.swift = [];
    card.sluggish = [];

    card.protection = [];
    card.asleep = [];
    card.torpidity = [];
    card.marked = [];

    // Poison stays

    refreshUI();

}
function retreatSelectedCard(){

    if(!selectedCard)
        return;

    applyRetreat(selectedCard);

    sendCommand({

        type: "retreat",

        uid: selectedCard.uid

    });

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
function applySwap(card, newLane){

    const otherCard = getPlayerDeck(card.owner).find(other =>

        other.inPlay &&
        other.lane === newLane &&
        other.uid !== card.uid

    );

    if(otherCard){

        const oldLane = card.lane;

        card.lane = newLane;

        otherCard.lane = oldLane;

    }
    else{

        card.lane = newLane;

    }

    refreshUI();

}
function swapSelectedCard(newLane){

    if(!selectedCard)
        return;

    applySwap(selectedCard, newLane);

    sendCommand({

        type: "swap",

        uid: selectedCard.uid,

        lane: newLane

    });

    swappingLane = false;

}
function onBoardClick(lane, uid){

    if(swappingLane){

        swapSelectedCard(lane);

    }else{

        selectCard(uid);

    }

}
function applyAddStatus(card, status, value, duration){

    card[status].push({

        value: value,

        duration: duration

    });

    refreshUI();

}
function applyRemoveStatus(card, status, index){

    if(index < 0 || index >= card[status].length)
        return;

    card[status].splice(index,1);

    refreshUI();

}
function endTurn(){

    applyEndTurn();

    sendCommand({

        type: "endTurn"

    });

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

function selectMove(card, index){

    applySelectMove(card, index);

    sendCommand({

        type: "selectMove",

        uid: card.uid,

        index: index

    });

}
function deselectMoves(card){

    card.moves.forEach(move => {

        move.selected = false;

    });

}
function changeMoveCharges(moveIndex, amount){

    if(!selectedCard)
        return;

    applyMoveCharges(

        selectedCard,

        moveIndex,

        amount

    );

    sendCommand({

        type: "moveCharges",

        uid: selectedCard.uid,

        moveIndex: moveIndex,

        delta: amount

    });

}
function removeCardFromDeck(player, uid){

    const deck = getPlayerDeck(player);

    const index = deck.findIndex(card => card.uid === uid);

    if(index === -1)
        return;

    applyRemoveCard(uid);

    sendCommand({

        type: "removeCard",

        uid: uid

    });

}
function applyRemoveCard(uid){

    for(const player of [1,2]){

        const deck = getPlayerDeck(player);

        const index = deck.findIndex(card => card.uid === uid);

        if(index !== -1){

            deck.splice(index,1);

            break;

        }

    }

    if(selectedCard && selectedCard.uid === uid){

        selectedCard = null;

    }

    refreshUI();

}
function applyStatChange(uid, stat, delta){

    const card = findCard(uid);

    if(!card)
        return;

    card[stat] += delta;

    if(card[stat] < 0){

        card[stat] = 0;

    }

    refreshUI();

}
function applySelectMove(card, index){

    card.moves.forEach(move =>

        move.selected = false

    );

    card.moves[index].selected = true;

    refreshUI();

}
function applyMoveCharges(card, moveIndex, amount){

    const move = card.moves[moveIndex];

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
function applyEndTurn(){

    currentTurn = currentTurn === 1 ? 2 : 1;

    updateTemporaryEffects();

    refreshUI();

}
function applyTemporaryEffect(card, effectName, value, duration){

    card[effectName].push({

        value: value,

        duration: duration

    });

    refreshUI();

}
function updateTemporaryEffects(){

    const cards = [

        ...getPlayerDeck(1),

        ...getPlayerDeck(2)

    ];

    const effects = [

        "tempStrength",
        "tempWeakness",
        "tempSturdy",
        "tempVulnerable",
        "tempSwiftness",
        "tempSlowness",
        "tempProtection",
        "tempAsleep",
        "tempMarked",
        "tempTorpidity",
        "tempSwift",
        "tempSluggish"

    ];

    cards.forEach(card=>{

        // Temporary effects
        effects.forEach(effect=>{

            card[effect].forEach(entry=>{

                entry.duration--;

            });

            card[effect] = card[effect].filter(entry=>

                entry.duration > 0

            );

        });

        // Poison
        if(card.poison > 0){

    card.poison--;

}

    });

}
function addStatus(card, status, value, duration){

    applyAddStatus(

        card,

        status,

        value,

        duration

    );

    sendCommand({

        type: "addStatus",

        uid: card.uid,

        status: status,

        value: value,

        duration: duration

    });

}
function removeStatus(card, status, index){

    applyRemoveStatus(

        card,

        status,

        index

    );

    sendCommand({

        type: "removeStatus",

        uid: card.uid,

        status: status,

        index: index

    });

}