
module.exports = Renderer;

function Renderer(canvas,bounds){
  this.canvas = canvas;
  this.bounds = bounds;
  this.pointMasses = [];
  this.forces = [];
  this.create();
}

Renderer.prototype = {

  create: function(){
    var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 100, 4000 );
    camera.position.z = this.bounds.b - this.bounds.t;
    camera.position.y = 30;
    camera.lookAt( new THREE.Vector3(0,0,0) );

    var scene = new THREE.Scene();

    var gameContainer = new THREE.Object3D();
    scene.add(gameContainer);

    var renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    renderer.sortElements = false;
    renderer.setSize( window.innerWidth, window.innerHeight );
    window.addEventListener( 'resize', function(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.gameContainer = gameContainer;

    this.surfaceY = -50;

    this.createBall(15);
    this.createPaddles(150,30);
    this.createLights();
    this.createArena(15);
  },

  createBall: function(radius){
    var ballGeo = new THREE.CubeGeometry( radius*2, radius*2, radius*2 )
      , ballMat = new THREE.MeshPhongMaterial( { color: 0xffffff })
      , ballMesh = new THREE.Mesh( ballGeo, ballMat );
    ballMesh.position.y = this.surfaceY;
    this.gameContainer.add(ballMesh);

    var ballGuideXGeo = new THREE.PlaneGeometry(this.bounds.b-this.bounds.t,radius/3)
      , ballGuideXMat = new THREE.MeshPhongMaterial({color:0xffffff,wireframe:false,opacity:0.4,transparent:false,side:THREE.DoubleSide})
      , ballGuideX = new THREE.Mesh( ballGuideXGeo, ballGuideXMat);
    ballGuideX.rotation.x = -Math.PI*.5;
    ballGuideX.position.y = this.surfaceY-radius/2;
    this.gameContainer.add(ballGuideX);

    var ballGuideYGeo = new THREE.PlaneGeometry(radius/3,this.bounds.b-this.bounds.t)
      , ballGuideYMat = new THREE.MeshPhongMaterial({color:0xffffff,wireframe:false,opacity:0.4,transparent:false,side:THREE.DoubleSide})
      , ballGuideY = new THREE.Mesh( ballGuideYGeo, ballGuideYMat );
    ballGuideY.rotation.x = -Math.PI*.5;
    ballGuideY.position.y = this.surfaceY-radius/2;
    this.gameContainer.add(ballGuideY);

    this.ballMesh = ballMesh;
    this.ballGuideX = ballGuideX;
    this.ballGuideY = ballGuideY;
  },

  createPaddles: function(width, height){
    var halfDepth = (this.bounds.b-this.bounds.t)/2;

    var userPaddleGeo = new THREE.CubeGeometry( width, height, 3 )
      , userPaddleMat = new THREE.MeshPhongMaterial( { color:0xffffff, transparent:false })
      , userPaddle = new THREE.Mesh( userPaddleGeo, userPaddleMat );
    userPaddle.position.z = this.bounds.t-halfDepth + 10;
    userPaddle.position.y = this.surfaceY;
    this.gameContainer.add(userPaddle);

    var opponentPaddleGeo = new THREE.CubeGeometry( width, height, 3 )
      , opponentPaddleMat = new THREE.MeshPhongMaterial( { color:0xffffff, transparent:false })
      , opponentPaddle = new THREE.Mesh( opponentPaddleGeo, opponentPaddleMat );
    opponentPaddle.position.z = this.bounds.b-halfDepth;
    opponentPaddle.position.y = this.surfaceY;
    this.gameContainer.add(opponentPaddle);

    this.userPaddle = userPaddle;
    this.opponentPaddle = opponentPaddle;
  },

  createLights: function(){
    var spotLight = new THREE.SpotLight( 0xFFFFFF );
    spotLight.intensity = 1;
    spotLight.position.set( 0, 300, 0 );
    this.gameContainer.add(spotLight);

    var pointLight = new THREE.PointLight( 0xFFFFFF );
    pointLight.intensity = 1;
    pointLight.position.set( 0, 0, this.bounds.b+150 );
    this.gameContainer.add(pointLight);

    var dirLight = new THREE.DirectionalLight( 0xFFFFFF );
    dirLight.position.set( -200, -200, 0 );
    dirLight.lookAt(this.gameContainer.position);
    this.gameContainer.add(dirLight);
  },

  createArena: function(radius){
    var w = this.bounds.r-this.bounds.l+radius*2
      , h = this.bounds.b-this.bounds.t+radius*2
      , d = 1000; // NOTE: adjusting depth requires moving the camera

    var arenaGeo = new THREE.CubeGeometry(w,h,d)
      , arenaMat = new THREE.MeshPhongMaterial({wireframe:false, color:0xeeeeee, side: THREE.DoubleSide})
      , arena = new THREE.Mesh( arenaGeo, arenaMat );
    this.gameContainer.add(arena);

    var tableGeo = new THREE.PlaneGeometry(w,h,10,10)
      , tableMat = new THREE.MeshPhongMaterial({color:0xff0000, opacity:0.2,transparent:true})
      , table = new THREE.Mesh( tableGeo, tableMat );
    table.rotation.x = -Math.PI*.5
    table.position.y = this.surfaceY-radius;
    this.gameContainer.add(table);
  },

  render: function(alpha){
    // TODO Interpolate positions: x += (newX-x) * alpha

    // Update ball/puck
    var puck = this.pointMasses[0];
    this.ballMesh.position.x = puck.current.x-(this.bounds.r-this.bounds.l)/2;
    this.ballMesh.position.z = puck.current.y-(this.bounds.b-this.bounds.t)/2;
    this.ballGuideY.position.x = this.ballMesh.position.x;
    this.ballGuideX.position.z = this.ballMesh.position.z;


    // TODO Update paddles (requires collision detection)

    this.renderer.render( this.scene, this.camera );
  }


}