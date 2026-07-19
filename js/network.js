let peer = null;
let connection = null;

function initializeNetworking(){

    peer = new Peer();

    peer.on("open", function(id){

        console.log("My Peer ID:", id);

    });

    peer.on("connection", function(conn){

        console.log("Incoming connection!");

        connection = conn;

        setupConnection();

    });

}

function connectToPeer(peerID){

    connection = peer.connect(peerID);

    setupConnection();

}

function setupConnection(){

    connection.on("open", function(){

        console.log("Connected!");

    });

    connection.on("data", function(data){

    console.log("Received:", data);

    receiveCommand(data);

});

}
function sendTestMessage(){

    if(!connection) return;

    connection.send("Hello!");

}

function getMyPeerID(){

    return peer.id;

}
function sendCommand(command){

    if(!connection)
        return;

    connection.send(command);

}
function receiveCommand(command){

    switch(command.type){

        case "hp":

            const card = findCard(command.uid);

            if(card){

                applyHP(card, command.delta);

            }

            break;

            case "play":

    const playCard = findCard(command.uid);

    if(playCard){

        applyPlay(playCard, command.lane);

    }

    break;
    case "addCard":

    getPlayerDeck(command.owner).push(

        createMatchCard(

            command.creatureID,

            command.owner,

            command.uid

        )

    );

    refreshUI();

    break;
    case "retreat":

    const retreatCard = findCard(command.uid);

    if(retreatCard){

        applyRetreat(retreatCard);

    }

    break;
    case "swap":

    const swapCard = findCard(command.uid);

    if(swapCard){

        applySwap(

            swapCard,

            command.lane

        );

    }

    break;
    case "removeCard":

    applyRemoveCard(command.uid);

    break;
    case "changeStat":

    applyStatChange(

        command.uid,

        command.stat,

        command.delta

    );

    break;
    case "selectMove":

    const moveCard = findCard(command.uid);

    if(moveCard){

        applySelectMove(

            moveCard,

            command.index

        );

    }

    break;
    case "moveCharges":

    const chargeCard = findCard(command.uid);

    if(chargeCard){

        applyMoveCharges(

            chargeCard,

            command.moveIndex,

            command.delta

        );

    }

    break;
    case "endTurn":

    applyEndTurn();

    break;
    case "temporaryEffect":

    const tempCard = findCard(command.uid);

    if(tempCard){

        applyTemporaryEffect(

            tempCard,

            command.effect,

            command.value,

            command.duration

        );

    }

    break;
    case "addStatus":

    const addCard = findCard(command.uid);

    if(addCard){

        applyAddStatus(

            addCard,

            command.status,

            command.value,

            command.duration

        );

    }

    break;

case "removeStatus":

    const removeCard = findCard(command.uid);

    if(removeCard){

        applyRemoveStatus(

            removeCard,

            command.status,

            command.index

        );

    }

    break;
    }

}