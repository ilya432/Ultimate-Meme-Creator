'use strict'

//Canvas
var gCanvas, gCtx, gImages = [], gNextImgID = -1;
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



function createImage(name, keywords) {
    var image = {
        id: gNextCanvasID++,
        url: './img/savedMemes/' + name + '.jpg',
        keywords: []
    }
    return image;
}
function createImages() {
    gImages.push(createImage('003'))
    gImages.push(createImage('004'))
    gImages.push(createImage('005'))
    gImages.push(createImage('5'))
    gImages.push(createImage('006'))
    gImages.push(createImage('8'))
    gImages.push(createImage('9'))
    gImages.push(createImage('12'))
    gImages.push(createImage('Ancient-Aliens'))
    gImages.push(createImage('img5'))
    gImages.push(createImage('img11'))
    gImages.push(createImage('img12'))
    gImages.push(createImage('leo'))
    gImages.push(createImage('meme1'))
    save();
}


init();

function init() {
    // debugger;
    gCanvas = document.querySelector('.canvas');
    // fitToContainer(gCanvas);
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
    gImages = loadFromStorage('gImages', []);
    gNextImgID = loadFromStorage('gNextImgID', 1);

    if (gImages.length === 0) {
        createImages();
    }
    console.log(gImages);
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




function onImgInputClicked(ev) {//image clicked
    loadImageFromInput(ev, drawImage)
}
function drawImage(elImg) {
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


function displayImage() {
    const dataURI = gCanvas.toDataURL();
    console.log(dataURI);
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}