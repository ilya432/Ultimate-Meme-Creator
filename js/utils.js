'use strict'

function fitToContainer(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
function point(x, y, hex) {
    this.x = x;
    this.y = y;
    this.hex = hex;
}
function recordPoints(currentX, currentY, ctx) {
    // debugger
    var p = ctx.getImageData(currentX, currentY, 1, 1).data;
    var hex = rgbToHex(p[0], p[1], p[2]);
    gPoints.push(new point(currentX, currentY, hex));
    console.log(gPoints);
}
function fitToContainer(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function measureText(ctx, text) {
    var text = ctx.measureText(text);
    console.log('text width: ' + text.width + ' px');
}