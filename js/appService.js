'use strict'

//Canvas
var gCanvas, gCtx, gImages = [], gNextImgID = -1;
//Images
var gCurrImage;
//Color
var gBorderColor, gFillColor;
//Pos
//move/drow
var gCurrX = 0, gPrevX = 0, gCurrY = 0, gPrevY = 0;
//pos for text
var gX = 0, gY = 100;
var gPoints = [], gScrollTop = 0, gIsDownOnText;
//keys
var isDown = false;
//Text
var gLineSize = 1, gFontSize = 40, gTextAlign;
var scrollTop = 0;
var gLines = [], nextLineId = 0, gIsFirstLineCreated = false;

init();

function init() {
    //Canvas
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext("2d");
    fitToContainer(gCanvas);
    gX = gCanvas.width / 2;
    gY = 100;
    gCtx.textAlign = "center";
    // drawRectangle();
    startupColorPickers();
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
                    gCurrY = touch.clientY - touch.target.offsetTop;
                }
            }
            e.preventDefault();
        } else {
            gCurrX = e.clientX - gCanvas.offsetLeft;
            gCurrY = e.clientY - gCanvas.offsetTop;
            //TODO
            // if (currX >= rect.x && currX <= rect.x + rect.w && currY >= rect.y && currY <= rect.y + rect.h) {
            //     ClickedInsideText = true;//inside
            //     break;
            // }
            // drawText(elTextBox, true)
        }
        if (isDown)
            drawLine();
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
                    gCurrY = touch.clientY - touch.target.offsetTop;
                }
            }
            e.preventDefault();
        } else {
            recordPoints(gCurrX, gCurrY, gCtx);

            gCurrX = e.clientX - gCanvas.offsetLeft;
            gCurrY = e.clientY - gCanvas.offsetTop;
            //TODO
            // if (currX >= rect.x && currX <= rect.x + rect.w && currY >= rect.y && currY <= rect.y + rect.h) {
            //     ClickedInsideText = true;//inside
            //     break;
            // }
            // drawText(elTextBox, true)
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
//Images
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
}
function getAllImagesToRender() {
    return gImages;
}
function getImagesToRenderByTag() {

    var filteredTodos = gTodos.filter(function (todo) {
        return ((gStatusFilter === 'all') ||
            (gStatusFilter === 'active' && !todo.isDone) ||
            (gStatusFilter === 'done' && todo.isDone))
    });
    return filteredTodos;
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
    borderColorPicker.addEventListener("input", updateStrokeColor, false);
    borderColorPicker.select();
}
function updateFillColor(event) {
    gFillColor = event.target.value;
    var textbox = document.querySelector('.input-text');
    drawText(textbox, false);
}
function updateStrokeColor(event) {
    gBorderColor = event.target.value;
    var textbox = document.querySelector('.input-text');
    drawText(textbox, false);
}
function colorPickerFillTextClicked() {
    document.querySelector(".color-picker-fill").click();
}
function colorPickersborderTextClicked() {
    document.querySelector(".color-picker-border").click();
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
}
//End Local storage


//Controls - Text
function CreateTextLineObj(x, y) {
    var line = {
        id: nextLineId++,
        posX: x,
        posY: y
    }
    return line;
}
function addTextLine() {
    gLines.push(CreateTextLineObj());
}
function drawText(elTextBox, isMoveText) {

    var text = elTextBox.value;
    if (text.length > 0) {
        clearCanvas();
        if (gCurrImage) {
            drawImageWithText(gCurrImage)
        } else {
            gCtx.fillStyle = gFillColor;
            gCtx.strokeStyle = gBorderColor;
            gCtx.font = `${gFontSize}px Arial`;

            gCtx.strokeText(text, gX, gY, gCanvas.width);
            gCtx.fillText(text, gX, gY, gCanvas.width);
        }
    } else {
        clearCanvas();
        drawImageWithText(gCurrImage);
    }
}
function increaseFontSize() {
    gFontSize += 4;
    var textbox = document.querySelector('.input-text');
    drawText(textbox, false);
}
function decreaseFontSize() {
    if (gFontSize != 0)
        gFontSize -= 4;
    var textbox = document.querySelector('.input-text');
    drawText(textbox, false);
}
function textAlignLeft() {
    var textbox = document.querySelector('.input-text');
    if (textbox.value !== '') {
        gX -= 10;
        drawText(textbox, false);
    }
}
function textAlignCenter() {
    gTextAlign = "center"
    gCtx.textAlign = gTextAlign;
    var textbox = document.querySelector('.input-text');
    if (textbox.value !== '') {
        gX = gCanvas.width / 2, gY = 100;
        drawText(textbox, false);
    }
}
function textAlignRight() {
    var textbox = document.querySelector('.input-text');
    if (textbox.value !== '') {
        gX += 10;
        drawText(textbox, gX, gY, false);
    }
}
function moveTextUp(params) {
    var textbox = document.querySelector('.input-text');
    if (textbox.value !== '') {
        gY += 10;
        drawText(textbox, gX, gY, false);
    }
}
function moveTextDown(params) {
    var textbox = document.querySelector('.input-text');
    if (textbox.value !== '') {
        gY -= 10;
        drawText(textbox, gX, gY, false);
    }
}
//End Text
//End Controls

//Images
function onImgInputClicked(ev) {//image clicked
    loadImageFromInput(ev, drawImage)
}
function drawImageWithText(elImg) {//draw to canvas
    if (elImg) {
        gCurrImage = elImg;
    }
    var image = new Image;
    image.onload = function () {
        var textbox = document.querySelector('.input-text');
        var text = textbox.value;
        if (text !== '') {
            gCtx.fillStyle = gFillColor;
            gCtx.font = `${gFontSize}px Arial`;
            gCtx.drawImage(image, 0, 0, gCanvas.height, gCanvas.width);

            gCtx.strokeText(text, gX, gY, gCanvas.width);
            gCtx.fillText(text, gX, gY, gCanvas.width)
        } else {
            gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.width);
        }
    };
    if (elImg.src)
        image.src = elImg.src;
}
//Download
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
//download End

// function convertBase64StringToImage() {
//     var image = new Image(),
//         var containerWidth = 100,
//         var containerHeight = 100;

//     image.onload = function () {
//         containerWidth = image.width;
//         containerHeight = image.height;
//     }
//     image.src = base64string;
// }

//End Images

function drawLine() {
    gCtx.save()
    gCtx.beginPath();
    gCtx.moveTo(gPrevX, gPrevY);
    gCtx.lineTo(gCurrX, gCurrY);
    gCtx.strokeStyle = gFillColor;

    gCtx.lineWidth = gLineSize;
    gCtx.stroke();
    gCtx.closePath();
    gCtx.restore();
}
function gallerySlideToggle() {
    var aside = document.querySelector('.aside-gallery-container');
    if (aside.classList.contains('slide-in')) {
        aside.classList.remove('slide-in');
        aside.classList.add('slide-out');
    }
    else {
        aside.classList.add('slide-in');
    }
}
