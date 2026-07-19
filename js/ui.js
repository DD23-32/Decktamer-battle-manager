// ======================================================
// ======================================================



// ------------------------------------------------------
// Small Helpers
// ------------------------------------------------------

function getSelectedMove(card){

    return card.moves.find(move => move.selected);

}

function getSelectedMoveName(card){

    const move = getSelectedMove(card);

    if(!move)
        return "";

    return getMove(move.id).name;

}

function getOwnerName(card){

    return `Player ${card.owner}`;

}
function updateSearchResults(player){

    const input = document.getElementById(

        player === 1
            ? "player1Search"
            : "player2Search"

    );

    const results = document.getElementById(

        player === 1
            ? "player1SearchResults"
            : "player2SearchResults"

    );

    const search = input.value.trim().toLowerCase();

    results.innerHTML = "";

    if(search.length === 0)
        return;

    const matches = creatureDatabase.filter(creature =>

        creature.name.toLowerCase().includes(search)

    ).slice(0,10);

    matches.forEach(creature=>{

        const div = document.createElement("div");

        div.className = "searchResult";

        div.textContent = creature.name;

        div.onclick = ()=>{

            getPlayerDeck(player).push(

                createMatchCard(
                    creature.id,
                    player
                )

            );

            input.value = "";

            results.innerHTML = "";

            refreshUI();

        };

        results.appendChild(div);

    });

}


// ------------------------------------------------------
// Deck Panels
// ------------------------------------------------------

function drawDeck(player){

    const panel = document.getElementById(

    player===1
        ? "player1DeckCards"
        : "player2DeckCards"

);

panel.innerHTML = "";




    getPlayerDeck(player).forEach(card=>{

        if(card.inPlay)
            return;

        const creature = getCardCreature(card);

        const div = document.createElement("div");

        div.className = "creature";

        if(selectedCard && selectedCard.uid === card.uid){

            div.classList.add("selected");

        }

        div.onclick = ()=>{

            selectedCard = card;

            refreshUI();

        };



        div.innerHTML = `
    <div class="deckCardHeader">

        <h2>${creature.name}</h2>

        <button
            class="removeCardButton"
            onclick="event.stopPropagation(); removeCardFromDeck(${player}, ${card.uid})">
            ✕
        </button>

    </div>

    <div class="deckStat">

        <img src="assets/icons/Health.png" class="deckIcon">

        <span>${card.hp}/${creature.hp}</span>

    </div>

    <div class="deckStat">

        <img src="assets/icons/Speed.png" class="deckIcon">

        <span>${creature.speed}</span>

    </div>
`;

        panel.appendChild(div);

    });

}



// ------------------------------------------------------
// Board Helpers
// ------------------------------------------------------

function createBoardStat(icon,value){

    return `

        <div class="boardStat">

            <img
                src="assets/icons/${icon}.png"
                class="boardIcon">

            <span class="boardValue">

                ${value}

            </span>

        </div>

    `;

}



function createBoardStatus(icon,duration=null){

    return `

        <div class="boardStatus">

            <img
                src="assets/icons/${icon}.png"
                class="boardStatusIcon">

            ${
                duration !== null
                    ? `<span>${duration}</span>`
                    : ""
            }

        </div>

    `;

}



// ------------------------------------------------------
// Numeric Inspector Row
// ------------------------------------------------------

function drawNumericStat(

    icon,
    label,
    value,
    minusFunction,
    plusFunction

){

    return `

        <div class="statRow">

            <div class="statInfo">

                <img
                    src="assets/icons/${icon}.png"
                    class="inspectorIcon">

                <span class="statLabel">

                    ${label}

                </span>

            </div>

            <div class="statControls">

                <button onclick="${minusFunction}">

                    −

                </button>

                <span class="statValue">

                    ${value}

                </span>

                <button onclick="${plusFunction}">

                    +

                </button>

            </div>

        </div>

    `;

}



// ------------------------------------------------------
// Temporary Effects
// ------------------------------------------------------

function drawTemporaryStatus(

    card,
    statusName,
    title

){

    let html = `

        <div class="statusSection">

            <h4>${title}</h4>

    `;

    const effects = card[statusName] ?? [];



    effects.forEach((effect,index)=>{

        html += `

            <div class="statusStack">

                <span>

                    +${effect.value}

                    (${effect.duration})

                </span>

                <button

                    onclick="removeStatus(
                        selectedCard,
                        '${statusName}',
                        ${index}
                    )">

                    −

                </button>

            </div>

        `;

    });



    html += `

        <button

            onclick="addStatusPrompt('${statusName}')">

            +

        </button>

        </div>

    `;

    return html;

}
// ======================================================
// Battlefield
// ======================================================

function drawBoard(){

    const board = document.getElementById("board");

    let html = "";

    html += drawBoardSide(2);

    html += `

        <hr style="width:100%;margin:20px 0;">

    `;

    html += drawBoardSide(1);

    board.innerHTML = html;

}



function drawBoardSide(player){

    let html = `

        <h2>Player ${player}</h2>

        <div class="boardRow">

    `;

    for(let lane = 1; lane <= 3; lane++){

        const card = getPlayerDeck(player).find(card =>

            card.inPlay &&
            card.lane === lane

        );

        html += `

            <div class="lane"

                onclick="${
    selectedCard && selectedCard.owner === player
        ? `placeSelectedCard(${lane})`
        : ""
}">

                ${
                    card
                        ? drawBoardCard(card, lane)
                        : `<div class="laneLabel">Lane ${lane}</div>`
                }

            </div>

        `;

    }

    html += `

        </div>

    `;

    return html;

}
function drawBoardStats(card,power,defense,speed){

    let html = `<div class="boardStats">`;

    html += createBoardStat(
        "Health",
        `${card.hp}/${getCardCreature(card).hp}`
    );

    html += createBoardStat(
        "Armor",
        card.armor
    );

    html += createBoardStat(
        power >= 0 ? "Strength" : "Weakness",
        Math.abs(power)
    );

    html += createBoardStat(
        defense >= 0 ? "Sturdy" : "Vulnerable",
        Math.abs(defense)
    );

    html += createBoardStat(
        "Speed",
        speed
    );

    if(card.poison > 0){

        html += createBoardStat(
            "Poison",
            card.poison
        );

    }

    html += `</div>`;

    return html;

}
function drawBoardStatuses(card){

    let html = `<div class="boardStatuses">`;

    if(card.protection)
        html += createBoardStatus("Protection");

    if(card.asleep)
        html += createBoardStatus("Asleep",card.asleep);

    if(card.marked)
        html += createBoardStatus("Marked",card.marked);

    if(card.torpidity)
        html += createBoardStatus("Torpidity",card.torpidity);

    if(card.swift)
        html += createBoardStatus("Swift",card.swift);

    if(card.sluggish)
        html += createBoardStatus("Sluggish",card.sluggish);

    html += `</div>`;

    return html;

}

function drawBoardCard(card,lane){

    const creature = getCardCreature(card);

    const power = getCurrentPower(card);

    const defense = getCurrentDefense(card);

    const speed = getCurrentSpeed(card);

    const moveName = getSelectedMoveName(card);

    return `

        <div class="lane occupied"

            onclick="

                ${
                    card.owner===1
                    ?

                    `

                    if(swappingLane){

                        swapSelectedCard(${lane});

                    }

                    else{

                        selectCard(${card.uid});

                    }

                    `

                    :

                    `selectCard(${card.uid});`

                }

            ">

            <div class="boardCard">

                <div class="boardName">

                    ${creature.name}

                </div>

                ${drawBoardStats(card,power,defense,speed)}

                ${drawBoardStatuses(card)}

                <div class="selectedMove">

                    ${moveName}

                </div>

            </div>

        </div>

    `;

}
function drawInspector() {

    const panel = document.getElementById("inspectorContent");

    if (!selectedCard) {
        panel.innerHTML = "<p>No creature selected.</p>";
        return;
    }

    const creature = getCardCreature(selectedCard);

    let html = `
        <h2>${creature.name}</h2>
        <div class="ownerLabel">
            Player ${selectedCard.owner}
        </div>
    `;
    if(selectedCard.owner === currentPlayer){

    html += `

        <div class="actionButtonsTop">

    `;

    if(selectedCard.inPlay){

        html += `

            <button onclick="retreatSelectedCard()">
                Retreat
            </button>

            <button onclick="swapLane()">
                Swap Lane
            </button>

        `;

    }

    else{

        html += `

            <button onclick="playSelectedCard()">
                Play
            </button>

        `;

    }

    html += `

        </div>

        <hr>

    `;

}

    // --------------------------
    // Permanent Stats
    // --------------------------

    html += drawNumericStat("Health","HP",selectedCard.hp,"changeHP(-1)","changeHP(1)");

    html += drawNumericStat("Armor","Armor",selectedCard.armor,"changeArmor(-1)","changeArmor(1)");

    html += drawNumericStat("Strength","Strength",selectedCard.strength,"changeStrength(-1)","changeStrength(1)");

    html += drawNumericStat("Weakness","Weakness",selectedCard.weakness,"changeWeakness(-1)","changeWeakness(1)");

    html += drawNumericStat("Sturdy","Sturdy",selectedCard.sturdy,"changeSturdy(-1)","changeSturdy(1)");

    html += drawNumericStat("Vulnerable","Vulnerable",selectedCard.vulnerable,"changeVulnerable(-1)","changeVulnerable(1)");

    html += drawNumericStat("Swiftness","Swiftness",selectedCard.swiftness,"changeSwiftness(-1)","changeSwiftness(1)");

    html += drawNumericStat("Slowness","Slowness",selectedCard.slowness,"changeSlowness(-1)","changeSlowness(1)");

    html += drawNumericStat("Poison","Poison",selectedCard.poison,"changePoison(-1)","changePoison(1)");

    html += drawNumericStat("Protection","Protection",selectedCard.protection,"changeProtection(-1)","changeProtection(1)");

    html += drawNumericStat("Asleep","Asleep",selectedCard.asleep,"changeAsleep(-1)","changeAsleep(1)");

    html += drawNumericStat("Marked","Marked",selectedCard.marked,"changeMarked(-1)","changeMarked(1)");

    html += drawNumericStat("Torpidity","Torpidity",selectedCard.torpidity,"changeTorpidity(-1)","changeTorpidity(1)");

    html += drawNumericStat("Swift","Swift",selectedCard.swift,"changeSwift(-1)","changeSwift(1)");

    html += drawNumericStat("Sluggish","Sluggish",selectedCard.sluggish,"changeSluggish(-1)","changeSluggish(1)");

    html += `
        <div class="statRow">

            <div class="statInfo">

                <img src="assets/icons/Speed.png" class="inspectorIcon">

                <span class="statLabel">
                    Speed
                </span>

            </div>

            <span class="statValue">
                ${getCurrentSpeed(selectedCard)}
            </span>

        </div>

        <div class="statRow">

            <div class="statInfo">

                <img src="assets/icons/Charm.png" class="inspectorIcon">

                <span class="statLabel">
                    Talent
                </span>

            </div>

            <span>
                ${creature.talent ?? "None"}
            </span>

        </div>

        <hr>

        <h3>Moves</h3>
    `;

    // --------------------------
    // Moves
    // --------------------------

    selectedCard.moves.forEach((move,index)=>{

        const moveData = getMove(move.id);

        html += `

            <div class="moveCard">

                <div class="moveHeader">

                    <b>${moveData.name}</b>

                    <input
                        type="radio"
                        name="selectedMove"
                        ${move.selected ? "checked" : ""}
                        onclick="selectMove(selectedCard,${index})">

                </div>

                <div class="moveDescription">
                    ${moveData.description}
                </div>
        `;

        if(move.charges !== null){

            html += `

                <div class="statRow">

                    <span>Charges</span>

                    <div>

                        <button onclick="changeMoveCharges(${index},-1)">−</button>

                        <span>${move.charges}/${moveData.maxCharges}</span>

                        <button onclick="changeMoveCharges(${index},1)">+</button>

                    </div>

                </div>
            `;

        }else{

            html += `

                <div class="statRow">

                    <span>Charges</span>

                    <span>∞</span>

                </div>
            `;

        }

        html += `

            </div>

            <br>

        `;

    });

    html += `<hr><h3>Temporary Effects</h3>`;
    html += drawTemporaryStatus(
    selectedCard,
    "tempStrength",
    "Temporary Strength"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempWeakness",
    "Temporary Weakness"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempSturdy",
    "Temporary Sturdy"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempVulnerable",
    "Temporary Vulnerable"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempSwiftness",
    "Temporary Swiftness"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempSlowness",
    "Temporary Slowness"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempProtection",
    "Temporary Protection"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempAsleep",
    "Temporary Asleep"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempMarked",
    "Temporary Marked"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempTorpidity",
    "Temporary Torpidity"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempSwift",
    "Temporary Swift"
);

html += drawTemporaryStatus(
    selectedCard,
    "tempSluggish",
    "Temporary Sluggish"
);

}
function refreshUI(){

    drawDeck(1);

    drawBoard();

    drawDeck(2);

    drawInspector();

}

function createBoardStat(icon,value){

    return `

        <div class="boardStat">

            <img
                src="assets/icons/${icon}.png"
                class="boardIcon">

            <span class="boardValue">

                ${value}

            </span>

        </div>

    `;

}

function createBoardStatus(icon,duration=null){

    return `

        <div class="boardStatus">

            <img
                src="assets/icons/${icon}.png"
                class="boardStatusIcon">

            ${
                duration !== null
                ? `<span>${duration}</span>`
                : ""
            }

        </div>

    `;

}

function addStatusPrompt(status){

    const value = Number(

        prompt("Value?")

    );

    if(isNaN(value))
        return;

    const duration = Number(

        prompt("Duration?")

    );

    if(isNaN(duration))
        return;

    addStatus(

        selectedCard,

        status,

        value,

        duration

    );

}

function drawNumericStat(icon,label,value,minusFunction,plusFunction){

    return `

        <div class="statRow">

            <div class="statInfo">

                <img
                    src="assets/icons/${icon}.png"
                    class="inspectorIcon">

                <span class="statLabel">

                    ${label}

                </span>

            </div>

            <div class="statControls">

                <button onclick="${minusFunction}">

                    −

                </button>

                <span class="statValue">

                    ${value}

                </span>

                <button onclick="${plusFunction}">

                    +

                </button>

            </div>

        </div>

    `;

}

function drawTemporaryStatus(card,statusName,title){

    let html = `

        <div class="statusSection">

            <h4>${title}</h4>

    `;

    card[statusName].forEach((effect,index)=>{

        html += `

            <div class="statusStack">

                <span>

                    +${effect.value}

                    (${effect.duration})

                </span>

                <button

                    onclick="removeStatus(selectedCard,'${statusName}',${index})">

                    −

                </button>

            </div>

        `;

    });

    html += `

        <button

            onclick="addStatusPrompt('${statusName}')">

            +

        </button>

        </div>

    `;

    return html;

}