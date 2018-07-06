var app = new PIXI.Application(1900, 600, {backgroundColor : 0xffffff,forceCanvas: true, padding:0, margin:0});
document.body.appendChild(app.view);
var container, scale;
var img = new Image();
img.onload = function(){
    var w = img.width;
    var h = img.height;
    scale = 1;
    if(w/h < 1900/600) {
        scale = h/600;
    } else {
        scale = w/1900;
    }
    container = new PIXI.Container();
    app.stage.addChild(container);
    var bunny = PIXI.Sprite.fromImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524917351762&di=6176807d88f529a49d45fe8b39e56726&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201210%2F2012102917583547.jpg', false);
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    container.addChild(bunny);
    app.renderer.plugins.interaction.on("pointerdown", onAddPoint);
}
img.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524917351762&di=6176807d88f529a49d45fe8b39e56726&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201210%2F2012102917583547.jpg';



function onAddPoint (event) {
    if (event.target && event.target.type === "point"){
        console.log('已经有点了');
    } else {
        // var graphics = new PIXI.Graphics();
        // graphics.drawCircle(event.data.originalEvent.clientX, event.data.originalEvent.clientY,2);
        // // var point = new PIXI.Circle();
        // // var bunny = new PIXI.Sprite(point);
        // // container.addChild(point);
        // container.addChild(graphics);
        var graphics = new PIXI.Graphics();

        // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphics.lineStyle(0);
        graphics.beginFill(0xFF0000, 1);
        graphics.drawCircle(event.data.originalEvent.clientX-10, event.data.originalEvent.clientY-10,10);
        graphics.endFill();
        container.addChild(graphics);
    }
}

// create a texture from an image path
// 
// sprite.x = app.screen.width/2;
// sprite.y = app.screen.height/2;
// // Scale mode for pixelation
// // texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
// app.renderer.plugins.interaction.on("pointerdown", onAddBunny);

function onAddBunny (event) {
    console.log(event.data.originalEvent.clientX);
    if (event.target && event.target.type === "person"){
        console.log('点到小人了');
    } else {
        createBunny(event.data.originalEvent.clientX, event.data.originalEvent.clientY);
    }
}
// for (var i = 0; i < 10; i++) {
//     createBunny(
//         Math.floor(Math.random() * app.screen.width),
//         Math.floor(Math.random() * app.screen.height)
//     );
// }

function createBunny(x, y) {

    // create our little bunny friend..
    var bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(1);
    bunny.type = "person";
    // setup events for mouse + touch using
    // the pointer events
    bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        // For mouse-only events
        // .on('mousedown', onDragStart)
        // .on('mouseup', onDragEnd)
        // .on('mouseupoutside', onDragEnd)
        // .on('mousemove', onDragMove);

        // For touch-only events
        // .on('touchstart', onDragStart)
        // .on('touchend', onDragEnd)
        // .on('touchendoutside', onDragEnd)
        // .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    // add it to the stage
    app.stage.addChild(bunny);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    console.log(this);
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    // this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}
