var Moon = (function(){

    function Moon(){
        THREE.Object3D.call(this);

        var texture = new THREE.ImageUtils.loadTexture('moonmap2k.jpg');
        var bumpMap = new THREE.ImageUtils.loadTexture('moonbump2k.jpg');
        var geometry = new THREE.SphereGeometry(.05, 100, 100);
        var material = new THREE.MeshPhongMaterial({
          color: 0x444444, 
          map: texture,
          bumpMap: bumpMap,
          bumpScale: .000001,
          shininess: .000000000001
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
    }

    Moon.prototype = new THREE.Object3D;
    Moon.prototype.constructor = Moon;
   
    Moon.prototype.update = function() {
        this.mesh.rotation.y += 0.01;
    };

    return Moon;
})();