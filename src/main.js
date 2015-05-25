import Scene from './scene.js';
import THREE from 'three';

var E_PER_MS_SPACE_IS_PRESSED = 3e-7;
var MIN_E = 0.001;
var scene, gui;


$(document).ready(init);

function init(){
  scene = new Scene(window.innerWidth, window.innerHeight);
  $('.three').append(scene.renderer.domElement);
  window.dbg.scene = scene;
  window.dbg.launch = function (e) { scene.launchProbe(scene.planet, e) };
  
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
      var launchEnergy = E_PER_MS_SPACE_IS_PRESSED * timeElapsed + MIN_E;
      scene.launchProbe(scene.planet, launchEnergy);
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