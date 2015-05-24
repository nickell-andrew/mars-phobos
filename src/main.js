import Scene from './scene.js';
import THREE from 'three';

var V_PER_MS_SPACE_IS_PRESSED = 0.1;
var scene, gui;


$(document).ready(init);

function init(){
  scene = new Scene(window.innerWidth, window.innerHeight);
  $('.three').append(scene.renderer.domElement);
  window.dbg.scene = scene;
  window.dbg.launch = function (v) { scene.launchProbe(scene.planet, v) };
  
  //gui = new dat.GUI();
  //gui.close();

  $( "#controls" ).draggable().hide();
  $(window).on('resize', resizeHandler);
  
  var whenSpacebarPressed = null;
  $(window).keydown(function (e) {
    if (e.keyCode == 32 && whenSpacebarPressed === null) {
      whenSpacebarPressed = Date.now();
    }
  }).keyup(function (e) {
    if (e.keyCode == 32 && whenSpacebarPressed != null) {
      var timeElapsed = Date.now() - whenSpacebarPressed;
      whenSpacebarPressed = null;
      var launchVelocity = V_PER_MS_SPACE_IS_PRESSED * timeElapsed;
      scene.launchProbe(scene.planet, launchVelocity);
    }
  });
  
  animate();  
}


function resizeHandler() {
  scene.resize(window.innerWidth, window.innerHeight);
}

function animate(milliseconds) {
  requestAnimationFrame(animate);
  scene.render(milliseconds);

}