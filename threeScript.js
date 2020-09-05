import * as THREE from './three.js-master/build/three.module.js';


import {
    OrbitControls
} from './three.js-master/examples/jsm/controls/OrbitControls.js';
import {
    FBXLoader
} from './three.js-master/examples/jsm/loaders/FBXLoader.js';

let threeJSContainer;
var container, controls;
var camera, scene, renderer, light;
var helper;
// const cc = Config.controls;
// 	const targetCamera = new THREE.Vector3().copy(controls.target);
// let mouseX = 0;
// let mouseY = 0;
// let mouseXpercent = 0;
// let mouseYpercent = 0;
// 		var mouseX = 0, mouseY = 0;

// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;
// const mouse = new THREE.Vector2();
// const target = new THREE.Vector2();
// const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);


var clock = new THREE.Clock();

var mixer;

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "threeJSContainer";
    container.classList.add('threeJS__container');
    threeJSContainer = document.getElementById('threeJSContainer');

    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(250, 300, 300);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xa0a0a0 );
    scene.background = new THREE.Color(0x111111);

    // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
    scene.fog = new THREE.Fog(0x111111, 200, 1000);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0x111111, 3);
    light.position.set(220, 150, -250);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -200;
    light.shadow.camera.left = -200;
    light.shadow.camera.right = 300;
    scene.add(light);
    helper = new THREE.SpotLightHelper(light);
    scene.add(helper);

    // ground
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x333333,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // scene.add( grid );

    // model
    var loader = new FBXLoader();
    loader.load('phlgroup.FBX', function (object) {

        mixer = new THREE.AnimationMixer(object);

        // var action = mixer.clipAction( object.animations[ 0 ] );
        // action.play();

        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        scene.add(object);

    });



    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);



    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(85, 20, 20);
    controls.update();
    controls.enabled = false; //blocking orbit controls

    // container.addEventListener("mousemove", onDocumentMouseMove, false);
    // 		document.addEventListener( 'mousemove', onMouseMove, false );
    // document.addEventListener( 'wheel', onMouseWheel, false );
    // 	window.addEventListener( 'resize', onResize, false );

    window.addEventListener('resize', onWindowResize, false);

    gsap.registerPlugin(CustomEase);


    // CustomEase.create("sine.out", "sine.out");

    function IncreaseLogoSize() {
        gsap.to(camera, {
            duration: 3,
            zoom: 1.7,
            ease: "sine.out",
            onUpdate: function () {

                camera.updateProjectionMatrix();

            }
        });

        gsap.to(controls.target, {
            duration: 3,
            x: 45,
            y: -75,
            z: -75,
            ease: "sine.out",
            onUpdate: function () {
                controls.update();
            }
        });
    }

    function DecreaseLogoSize() {

        gsap.to(camera, {
            duration: 4,
            zoom: 0.7,
            ease: "sine.out",
            onUpdate: function () {

                camera.updateProjectionMatrix();

            }
        });

        gsap.to(controls.target, {
            duration: 4,
            x: -250,
            y: -(window.innerHeight / 2) - 200,
            z: 75,
            ease: "sine.out",
            onUpdate: function () {

                controls.update();

            }
        });
    }

    if (window.pageYOffset < window.innerHeight / 3) {
        IncreaseLogoSize();
    } else {
        DecreaseLogoSize();
    }

    $(window).scroll(function () {
        if (window.pageYOffset >= window.innerHeight / 3) {
            DecreaseLogoSize();
        } else {
            IncreaseLogoSize()
        }
    });


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


// function onResize( event ) {

// const width = window.innerWidth;
// const height = window.innerHeight;

// windowHalf.set( width / 2, height / 2 );

// camera.aspect = width / height;
// camera.updateProjectionMatrix();
// renderer.setSize( width, height );

// }

// 		function onDocumentMouseMove( event ) {

// mouseX = event.clientX - windowHalfX;
// mouseY = event.clientY - windowHalfY;
// console.log('dasdasd')

// }

//  function onDocumentMouseMove(event) {
//       const windowHalfX = window.innerWidth >> 1;
//       const windowHalfY = window.innerHeight >> 1;

//       mouseX = event.clientX - windowHalfX;
//       mouseY = event.clientY - windowHalfY;

//       mouseXpercent = mouseX / (window.innerWidth / 2);
//       mouseYpercent = mouseY / (window.innerHeight / 2);
//     }

//    controls.update = function () {
//       // if (upIsDown && camy < 1.5) {camy++};
//       // if (downIsDown && camy > 2.2) {camy--};

//       // if (leftIsDown && angle > -0.4) {angle-= 0.01};
//       // if (rightIsDown && angle < 0.4) {angle+= 0.01};
//       // toangle += (angle - toangle)/20;

//       // camera.position.x = Math.sin(toangle) * distance;
//       // camera.position.z = Math.cos(toangle) * distance;
//       // camera.position.y += (camy - camera.position.y) / 10;

//       targetCamera.x += (-mouseXpercent * 5 - targetCamera.x) / 10;
//       targetCamera.y += (-(mouseYpercent * 5) + 1 - targetCamera.y) / 50;

//       camera.lookAt(targetCamera);
//     };



// function onMouseMove( event ) {

// mouse.x = ( event.clientX - windowHalf.x );
// mouse.y = ( event.clientY - windowHalf.x );
// console.log('dasdas');
// }


// function onMouseWheel( event ) {

// camera.position.z += event.deltaY * 0.1; // move camera along z-axis
// console.log('dasdas11');

// }

function render() {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();


    // camera.position.x += ( mouseX - camera.position.x ) * 5.36;
    // 	camera.position.y += ( - ( mouseY ) - camera.position.y ) * 5.36;


    // camera.lookAt( scene.position );
}
//

function animate() {



    // 	target.x = ( 1 - mouse.x ) * 0.000002;
    //   target.y = ( 1 - mouse.y ) * 0.000002;

    //   camera.rotation.x += 0.005 * ( target.y - camera.rotation.x );
    //   camera.rotation.y += 0.005 * ( target.x - camera.rotation.y );

    requestAnimationFrame(animate, renderer.domElement);

    var delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

};

$('#threeJSContainer').prependTo('body');