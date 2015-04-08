var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x770055);

        // Directly add objects
        this.someObject = new THREE.Mesh(
          new THREE.BoxGeometry(50, 50, 50), 
          new THREE.MeshPhongMaterial( { color: 0x55aa55, specular: 0x5555ff, shininess: 2 }  )
        );
        this.someObject.position.set(-60, 0, 0);
        this.scene.add(this.someObject);
        
        var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
        light1 = new THREE.PointLight( 0xffffff, 7, 500, 2 );
        light1.add( new THREE.Mesh( Phobos , new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        light1.position.z = this.camera.position.z/2;
        light1.position.x = this.camera.position.x;
        light1.position.y = this.camera.position.y;
				this.scene.add( light1 );

        // Or create container classes for them to simplify your code
        this.someOtherObject = new Phobos();
        this.someOtherObject.position.set(60, 0, 0);
        this.scene.add(this.someOtherObject);
        
        console.log('Webgl Run');
    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);

        this.someObject.rotation.y += 0.01;
        this.someObject.rotation.x += 0.01;

        this.someOtherObject.update();
    };
    
    return Webgl;

})();