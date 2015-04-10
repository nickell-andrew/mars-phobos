import THREE from 'three';

var Mars = (function(){

    function Mars(){
        THREE.Object3D.call(this);

        var texture = new THREE.ImageUtils.loadTexture('marsmap2k.jpg');
        var bumpMap = new THREE.ImageUtils.loadTexture('marsbump2k.jpg');
        var geometry = new THREE.SphereGeometry(.2, 100, 100);
        var material = new THREE.MeshPhongMaterial({
          color: 0x552222, 
          map: texture,
          bumpMap: bumpMap,
          bumpScale: .02,
          shininess: .000000001
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
    }

    Mars.prototype = new THREE.Object3D;
    Mars.prototype.constructor = Mars;

    Mars.prototype.update = function() {
        this.mesh.rotation.y += 0.01;
    };

    return Mars;
})();

export default Mars;