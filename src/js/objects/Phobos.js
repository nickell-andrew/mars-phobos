var Phobos = (function(){

    function Phobos(){
        THREE.Object3D.call(this);

        var texture = new THREE.ImageUtils.loadTexture('phobos2k.jpg');
        var bumpMap = new THREE.ImageUtils.loadTexture('phobosbump.jpg');
        var geometry = new THREE.SphereGeometry(150, 200, 200);
        var material = new THREE.MeshPhongMaterial({
          color: 0x888888, 
          map: texture,
          bumpMap: bumpMap,
          bumpScale: 10,
          shininess: .000000001
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
    }

    Phobos.prototype = new THREE.Object3D;
    Phobos.prototype.constructor = Phobos;

    Phobos.prototype.update = function() {
        this.mesh.rotation.y += 0.01;
    };

    return Phobos;
})();