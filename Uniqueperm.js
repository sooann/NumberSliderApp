var posit = new Array();
var hgh = 3;            //height of board; 2-maxhgh
var wid = 3;            //width of board; 2-maxwid
var siz = 8;           //Number of tiles, = wid*hgh-1. Only have provision for 2-digit numbers on display
var blnkx,blnky;        //position of blank space
var mode = 0;           //0=normal  1=solving scrambled  2=edit  3=solving
var boardCount = 0;
var timeStart = 0;
var boardStore = new Array();

function mix(){
    var i, j, c = 0;
    var pcs = new Array();
    for (i = 0; i <= siz; i++) pcs[i] = i;
    pcs[siz - 1] = -1; pcs[siz - 2] = -1;
    for (i = 0; i < hgh; i++) {
        for (j = 0; j < wid; j++) {
            k = Math.floor(Math.random() * pcs.length);
            posit[c] = pcs[k];
            if (pcs[k] == siz) { blnkx = j; blnky = i; }
            pcs[k] = pcs[pcs.length - 1];
            pcs.length--;
            c++;
        }
    }
    //mode = 1;
    filltwo();
}

function filltwo() {
    //First fill in last two tiles.
    var s1 = -1;
    var s2 = -1;
    for (var i = 0; i <= siz; i++) {
        if (posit[i] == -1) {
            if (s1 < 0) {
                s1 = i;
                posit[s1] = siz - 1;
            } else {
                s2 = i;
                posit[s2] = siz - 2;
                break;
            }
        }
    }
    //check permutation parity
    var c = 0;
    for (var i = 1; i <= siz; i++) {
        for (var j = 0; j < i; j++) {
            if (posit[j] > posit[i]) c++;
        }
    }
    //Check position of blank space; move to bottom right
    c += (wid - 1) - blnkx + (hgh - 1) - blnky;

    //if parity odd then swap
    if (c & 1) {
        posit[s1] = siz - 2;
        posit[s2] = siz - 1;
    }
}

function GenerateBoard() {

    var boardFound = false;
    boardCount++;
    mix();
    
    //check duplicate
    if (boardStore.length>0) {
        for (var i=0; i<=boardStore.length; i++) {
            if(posit.toString()==boardStore[i]) {
                boardFound=true;
            }   
        }
    } 

    if (!boardFound) {
        boardStore.push(posit.toString());
        //displayBoard();
        if ((boardCount % 1000)==0) {
            displayBoard();
        }
    } else {
        //displayBoard("divDup");
    }

    if (mode>=3) {
        //GenerateBoardTimer = setTimeout("GenerateBoard();",10);
    }
}

function displayBoard(divId) {
    if (divId==undefined) {
        divId = "divContentRunning";
    }
    var timeElapse = new Date() - timeStart;
    var htmlText = boardCount + " - ";
    htmlText += "["+posit.toString()+"]\n";
    htmlText += "Time: " + timeElapse + ", Unique: "+boardStore.length+"\n";
    console.log(htmlText);
}

var GenerateBoardTimer;
function start() {
    boardCount=0;  
    timeStart = new Date();
    boardStore = new Array();
    mode=3; //start random block
    while (true) {
        GenerateBoard();
    }
    GenerateBoardTimer = setTimeout("GenerateBoard();",10);
}

function stop() {
    mode=0;
    clearTimeout(GenerateBoardTimer);
}

start();