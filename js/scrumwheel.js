const wheelCanvas = document.getElementById("wheel-canvas");
const bannerCanvas = document.getElementById("banner-canvas");
const banner = document.getElementById("banner");
const colors = ["#009da7", "#a331c4", "#f7921d", "#76787b"];

let userParam = getParameterByName('users');
let users = [];
if (userParam?.length > 0) {
    users = userParam.split(",")
} else {
    users = [ "Ricky", "Bubbles", "Jullian", "Randy", "Mr. Lahey"];
}

let selectedCount = 0;
let segments = [];
for (let i = 0; i < users.length; i++) {
    segments.push({ "fillStyle": colors[i % colors.length], "text": users[i], "id": i });
}

let scrumWheel = new Winwheel({
    "canvasId": "wheel-canvas",
    "outerRadius": 250,
    "numSegments": segments.length,
    "segments": segments
    ,
    'animation':
    {
        'type': 'spinToStop',
        'duration': 5,
        'spins': 3,
        'callbackFinished': 'alertSelection()',
        'callbackAfter': 'drawPointer()',
    },
    'pointerAngle': 45,
    'pointerGuide':
    {
        'display': false,
        'strokeStyle': 'red',
        'lineWidth': 3
    }
});


let pointerImage = new Image();

function drawPointer() {
    let ctx = wheelCanvas.getContext("2d");

    if (ctx) {
        ctx.save();
        ctx.rotate(scrumWheel.degToRad(-45));
        ctx.drawImage(pointerImage, 225, 405);
        ctx.restore();
    }
}

pointerImage.onload = function () {
    drawPointer();
};

pointerImage.src = "img/hand.png";

function startSpin(elem) {
    bannerCanvas.style.visibility="hidden";
    banner.style.visibility = "hidden";
    scrumWheel.startAnimation();
    elem.disabled = true;
}

function alertSelection() {
    let selectedSegment = scrumWheel.getIndicatedSegment();
    selectedCount++;
    
    bannerCanvas.style.visibility="visible"
    banner.innerHTML = selectedSegment.text;
    banner.style.visibility="visible"

    let userPos = segments.map(function (x) { return x.id; }).indexOf(selectedSegment.id);
    segments[userPos].done = true;

    let pos = scrumWheel.segments.map(function (x) { return x?.id; }).indexOf(selectedSegment.id);
    scrumWheel.deleteSegment(pos);
    scrumWheel.stopAnimation(false);
    scrumWheel.rotationAngle = 0;
    
    if (selectedCount == segments.length) {
        // done;
        document.getElementById("spin-button").innerHTML = "Done!";
    } else {
        document.getElementById("spin-button").disabled = false;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}