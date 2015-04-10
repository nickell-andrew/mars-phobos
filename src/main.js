import Scene from './scene.js';
import THREE from 'three';

var scene, gui;

$(document).ready(init);

function init(){
  scene = new Scene(window.innerWidth, window.innerHeight);
  $('.three').append(scene.renderer.domElement);

  gui = new dat.GUI();
  gui.close();

  $(window).on('resize', resizeHandler);

  animate();
}


function resizeHandler() {
  scene.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  scene.render();
    
}
