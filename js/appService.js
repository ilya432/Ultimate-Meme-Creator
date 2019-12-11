'use strict'

//Canvas
var gCanvas, gCtx, gCanvases = [], gNextCanvasID = -1;
//Images
var gCurrImageName;
//Colors
var gBorderColor, gFillColor, gLineSize = 1;
//Pos
var gCurrX = 0, gPrevX = 0, gCurrY = 0, gPrevY = 0;
var gPoints = [], gScrollTop = 0;
//keys
var isDown = false;

var gFillColorWell, gBorderColorWell;







init();

function init() {
    // debugger;
    gCanvas = document.querySelector('.canvas');
    fitToContainer(gCanvas);
    gCtx = gCanvas.getContext("2d");
    gCanvas.addEventListener("mousemove", function (e) {
        move('move', e)
    }, false);
    gCanvas.addEventListener("mousedown", function (e) {
        down('down', e)
    }, false);
    gCanvas.addEventListener("mouseup", function (e) {
        up('up', e)
    }, false);
    gCanvas.addEventListener("mouseout", function (e) {
        out('out', e)
    }, false);
    //Touch
    gCanvas.addEventListener("touchstart", function (e) {
        down('touchstart', e)
    }, false);
    gCanvas.addEventListener("touchend", function (e) {
        up('touchend', e)
    }, false);
    gCanvas.addEventListener("touchcancel", function (e) {
        touchcancel('touchcancel', e)
    }, false);
    gCanvas.addEventListener("touchmove", function (e) {
        move('touchmove', e)
    }, false);
}

function move(res, e) {
    if (res == 'move' || res == 'touchmove') {
        gPrevX = gCurrX;
        gPrevY = gCurrY;
        if (res == 'touchmove') {
            if (e.touches) {
                if (e.touches.length == 1) { // Only deal with one finger
                    var touch = e.touches[0]; // Get the information for finger #1
                    gCurrX = touch.clientX - touch.target.offsetLeft;
                    gCurrY = touch.clientY - touch.target.offsetLeft;
                }
            }
            e.preventDefault();
        } else {
            gCurrX = e.clientX - gCanvas.offsetLeft;
            gCurrY = e.clientY - gCanvas.offsetLeft;
        }
        // recordPoints(gCurrX, gCurrY, gCtx);
        if (isDown)
            drawShape();
    }
}
function out(res, e) {
    if (res == 'out') {
        //todo ?
    }
}
function down(res, e) {
    if (res == 'down' || res == 'touchstart') {
        isDown = true;
        gPrevX = gCurrX;
        gPrevY = gCurrY;
        gPoints = [];
        gPoints.length = 0;
        if (res == 'touchstart') {
            if (e.touches) {
                if (e.touches.length == 1) { // Only deal with one finger
                    var touch = e.touches[0]; // Get the information for finger #1
                    gCurrX = touch.clientX - touch.target.offsetLeft;
                    gCurrY = touch.clientY - touch.target.offsetLeft;
                }
            }
            e.preventDefault();
        } else {
            gCurrX = e.clientX - gCanvas.offsetLeft;
            gCurrY = e.clientY - gCanvas.offsetLeft;
        }
    }
}
function up(res, e) {
    if (res == 'up' || res == 'touchend') {
        isDown = false;
        if (res == 'touchend') { e.preventDefault(); }
        else {
        }
    }
}



window.addEventListener("load", startup, false);
function startup() {
    gFillColorWell = document.querySelector(".color-picker-fill");
    gFillColor = getRandomColor();
    gFillColorWell.value = gFillColor;
    gFillColorWell.addEventListener("input", updateFillColor, false);
    gFillColorWell.select();

    gBorderColorWell = document.querySelector(".color-picker-border");
    gBorderColor = getRandomColor();
    gBorderColorWell.value = gBorderColor;
    gBorderColorWell.addEventListener("input", updateBorderColor, false);
    gBorderColorWell.select();
}
function updateFillColor(event) {
    gFillColor = event.target.value;
    isRandomColors = false;
}
function updateBorderColor(event) {
    gBorderColor = event.target.value;
    isRandomColors = false;
}


// window.onscroll = function () {
//     gScrollTop = document.body.scrollTop;
// };

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}
function saveCanvasImage() {
    debugger;
    var imgAsDataURL = gCanvas.toDataURL("image/jpg");
    // saveToStorage(gImageName, imgAsDataURL);

    try {
        // localStorage.setItem("elephant", imgAsDataURL);
        saveToStorage(gCurrImageName, imgAsDataURL);
    }
    catch (e) {
        console.log("Storage failed: " + e);
    }
}
function loadCanvases() {
    gBooks = loadFromStorage('Canvases', []);
    gNextCanvasID = loadFromStorage('gNextCanvasID', 1);

    if (gBooks.length === 0) {
        createBooks();
    }
    console.log(gBooks);
}

function increaseLineSize() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
    gLineSize = value;
}
function decreaseLineSize() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
    gLineSize = value;
}







function drawImage(elImg) {
    var fullPath = elImg.src;
    var filename = fullPath.replace(/^.*[\\\/]/, '');
    gCurrImageName = filename;//get name for later 
    clearCanvas();
    gCtx.drawImage(elImg, 10, 10);
}

function drawText(elTextBox) {
    var text = elTextBox.value;
    gCtx.font = "30px Arial";
    if (text.length > 0) {
        clearCanvas();
        gCtx.fillText(text, 100, 100)
        measureText(gCtx, text)
    } else {
        clearCanvas();
    }
}


function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/png');
    elLink.href = imgContent
}