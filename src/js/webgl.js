var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10);
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000);

        // Directly add objects
        this.someObject = new Mars();
        this.someObject.position.set(-150, 0, 0);
        this.scene.add(this.someObject);
        
        var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
        var light1 = new THREE.PointLight( 0xffffff, 7, 500, 2 );
        light1.add( new THREE.Mesh( Moon , new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        light1.position.z = this.camera.position.z/2;
        light1.position.x = this.camera.position.x;
        light1.position.y = this.camera.position.y;
				this.scene.add( light1 );
        


        // Or create container classes for them to simplify your code
        this.someOtherObject = new Moon();
        this.someOtherObject.position.set(150, 0, 0);
        this.scene.add(this.someOtherObject);
        
        console.log('Webgl Run');
    }

    // New Methods

    Webgl.prototype.setMoonPosition = function(pos) {
      this.someOtherObject.position.set(pos.x, pos.y, pos.z);
      
    } 
    Webgl.prototype.setMarsPosition = function(pos) {
      this.someObject.position.set(pos.x, pos.y, pos.z);
      
    } 
    Webgl.prototype.setCameraPosition = function(pos) {
      this.camera.position.set(pos.x, pos.y, pos.z);
      
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