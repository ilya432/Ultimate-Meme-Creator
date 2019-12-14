'use strict'

var black = "rgb(12, 5, 0)";//changed 
var RectBorderColor = black;
var currX = 0, prevX = 0;
var currY = 0, prevY = 0;

var lines = [];
var black = "rgb(0, 0, 0)";
var lineOne = document.querySelector('.line-1');
var lineTwo = document.querySelector('.line-2');

function Shape(x, y, w, h, fill) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
}



//invisible text Rectangle
function drawRectangle() {
    // debugger;
    var x = 20
    var y = 20;
    var canvasW = +gCanvas.width;
    var canvasH = +gCanvas.height;
    var h = 60;
    if (gCtx) {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);//clear

        lines.push(new Shape(x, y, canvasW - (x * 2), h, black));
        lines.push(new Shape(x, canvasH - (h + x), canvasW - (x * 2), h, black));

        for (var i in lines) {
            var rect = lines[i];
            gCtx.lineWidth = 1;
            gCtx.strokeStyle = RectBorderColor;
            gCtx.strokeRect(rect.x, rect.y, rect.w, rect.h, rect.fill);
        }

        var rect = lines[i];
        gCtx.lineWidth = 1;
        gCtx.strokeStyle = RectBorderColor;
        gCtx.strokeRect(rect.x, rect.y, rect.w, rect.h, rect.fill);

    } else {
        console.log("no gCtx!");
    }
}








