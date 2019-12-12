'use strict'

//Canvas
var gCanvas, gCtx, gImages = [], gNextImgID = -1;
//Images
var gCurrImageName;
//Colors
var gBorderColor, gFillColor;
window.addEventListener("load", startupColorPickers, false);
//Pos
var gCurrX = 0, gPrevX = 0, gCurrY = 0, gPrevY = 0;
var gPoints = [], gScrollTop = 0;
//keys
var isDown = false;
//Text
var gLineSize = 1, gFontSize = 40;





init();

function init() {
    //Canvas
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext("2d");
    //Events
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
    //Touch events
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

    //Images
    loadCanvasImages();
}

//Mouse/Touch events
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


function createImage(name, keywords) {
    var image = {
        name: name,
        id: gNextImgID++,
        DataUTI: gCanvas.toDataURL(),
        keywords: keywords
    }
    saveToStorage('gNextImageID', gNextImgID);
    return image;
}
function createImages() {
    gImages.push(createImage('003', ['funny']));
    gImages.push(createImage('004', ['fail', 'lol']));
    gImages.push(createImage('005', ['funny', 'awesome']));
    gImages.push(createImage('5', ['lol']));
    gImages.push(createImage('006', ['funny']));
    gImages.push(createImage('8', ['lol']));
    gImages.push(createImage('9', ['fail']));
    saveCanvasImages();
    console.log(gImages);
}


//Colors
function startupColorPickers() {
    var fillColorPicker = document.querySelector(".color-picker-fill");
    gFillColor = getRandomColor();
    fillColorPicker.value = gFillColor;
    fillColorPicker.addEventListener("input", updateFillColor, false);
    fillColorPicker.select();

    var borderColorPicker = document.querySelector(".color-picker-border");
    gBorderColor = getRandomColor();
    borderColorPicker.value = gBorderColor;
    borderColorPicker.addEventListener("input", updateBorderColor, false);
    borderColorPicker.select();
}
function updateFillColor(event) {
    gFillColor = event.target.value;
    isRandomColors = false;
}
function updateBorderColor(event) {
    gBorderColor = event.target.value;
    isRandomColors = false;
}

//Canvas
function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}
//End Canvas

//Local storage
function saveCanvasImages() {
    saveToStorage('Images', gImages);
}
function loadCanvasImages() {
    gImages = loadFromStorage('Images', []);
    gNextImgID = loadFromStorage('gNextImgID', 1);

    if (gImages.length === 0) {
        createImages();
    }
    else
        console.log(gImages);
}
//End Local storage

//Controls
//Text
function increaseFontSize() {
    gFontSize++;
    var textbox = document.querySelector('.input-line-text');
    drawText(textbox);
    console.log('font' + gFontSize);
}
function decreaseFontSize() {
    if (gFontSize != 0)
        gFontSize--;
    var textbox = document.querySelector('.input-line-text');
    drawText(textbox);
    console.log('font' + gFontSize);
}
function drawText(elTextBox) {
    var text = elTextBox.value;
    gCtx.font = `${gFontSize}px Arial`;

    if (text.length > 0) {
        clearCanvas();
        gCtx.fillText(text, 100, 100)
        measureText(gCtx, text)
    } else {
        clearCanvas();
    }
}
//End Text
//End Controls

//Images
function onImgInputClicked(ev) {//image clicked
    loadImageFromInput(ev, drawImage)
}
function drawImage(elImg) {//draw to canvas
    gCtx.drawImage(elImg, 0, 0, gCanvas.height, gCanvas.width);
}
function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = () => {
            clearCanvas();
            onImageReady(img)
        };
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}
function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}
//End Images



