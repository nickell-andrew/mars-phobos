console.log("I rebuilt");
var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    gui.close();

    $(window).on('resize', resizeHandler);

    animate();
    

}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
// temp positions
    webgl.setMarsPosition({x:0, y:0, z:0});
    webgl.setMoonPosition({x:1, y:0, z:0});
    webgl.setCameraPosition({x:0, y:0, z:2});
}



