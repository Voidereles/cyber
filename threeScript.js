import * as THREE from './three.js-master/build/three.module.js';


import {
    OrbitControls
} from './three.js-master/examples/jsm/controls/OrbitControls.js';
import {
    GUI,
    gui
} from './three.js-master/examples/jsm/libs/dat.gui.module.js';
import {
    FBXLoader
} from './three.js-master/examples/jsm/loaders/FBXLoader.js';


let threeJSContainer;
var container, controls;
var camera, scene, renderer, light;
var helper;


let targetCamera;
let mouseX = 0;
let mouseY = 0;
let mouseXpercent = 0;
let mouseYpercent = 0;


var clock = new THREE.Clock();

const DecreaseLogoSize = function () {
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

//export because of module!!! big brain time https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
const IncreaseLogoSize = function () {
    gsap.to(camera, {
        duration: 4,
        zoom: 1,
        ease: "sine.out",
        onUpdate: function () {
            camera.updateProjectionMatrix();
        }
    });

    gsap.to(controls.target, {
        duration: 4,
        x: 245,
        y: -50,
        z: -100,
        ease: "sine.out",
        onUpdate: function () {
            controls.update();
        }
    });
}
window.DecreaseLogoSize = DecreaseLogoSize; //window, żeby móc odwołać się w konsoli. Tylko do debugowania!
window.IncreaseLogoSize = IncreaseLogoSize;


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
    scene.background = new THREE.Color(0x111111);

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

    //moving mouse
    targetCamera = new THREE.Vector3().copy(controls.target)

    container.addEventListener("mousemove", onDocumentMouseMove, false);
    // document.addEventListener( 'touchstart', onTouchStart, false );
    container.addEventListener("touchmove", onTouchMove, false);

    function onTouchMove(event) {
        event.preventDefault();
        onDocumentMouseMove(event.touches[0]);
    }

    function onDocumentMouseMove(event) {
        const windowHalfX = window.innerWidth >> 1;
        const windowHalfY = window.innerHeight >> 1;

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

        mouseXpercent = mouseX / (window.innerWidth / 2);
        mouseYpercent = mouseY / (window.innerHeight / 2);
    }












    window.addEventListener('resize', onWindowResize, false);

    gsap.registerPlugin(CustomEase);


    if (window.pageYOffset < window.innerHeight / 3) {
        IncreaseLogoSize();
        console.log("increase no scroll");
    } else {
        DecreaseLogoSize();
        console.log('decrease no scroll');
    }

    $(window).scroll(function () {
        if (window.pageYOffset >= window.innerHeight / 3) {
            DecreaseLogoSize();
            console.log("decrease");
        } else {
            IncreaseLogoSize();
            console.log("increase");
        }
    });

    const buttonDecreaseLogo = {
        add: function () {
            DecreaseLogoSize();
        }
    }

    const buttonIncreaseLogo = {
        add: function () {
            IncreaseLogoSize()
        }
    }

    var gui = new GUI();

    gui.add(buttonDecreaseLogo, "add").name('smaller logo gsap animation');
    gui.add(buttonIncreaseLogo, "add").name('bigger logo gsap animation');

    gui.add(camera.position, 'x', -720, 720).name('cameraPosition x');
    gui.add(camera.position, 'y', -720, 720).name('cameraPosition y');
    gui.add(camera.position, 'z', -720, 720).name('cameraPosition z');

    gui.add(controls.target, 'x', -720, 720).name('controlsTarget x');
    gui.add(controls.target, 'y', -720, 720).name('controlsTarget y');
    gui.add(controls.target, 'z', -720, 720).name('controlsTarget z');

    //pos rot and scale go into local transform matrix which is by default automatically updated
    //Projection Matrix only needs update after FOV changes

    gui.add(camera, 'fov', 1, 120).onChange(camera.updateProjectionMatrix());

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function render() {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    // camera.lookAt( scene.position );
}


function update() {
    controls.update();

    targetCamera.x += (-mouseXpercent * 35 - targetCamera.x) / 10;
    targetCamera.y += (-(mouseYpercent * 35) + 1 - targetCamera.y) / 15;

    camera.lookAt(targetCamera);
}

function animate() {


    update();

    requestAnimationFrame(animate, renderer.domElement);

    var delta = clock.getDelta();

    renderer.render(scene, camera);

};

$('#threeJSContainer').prependTo('body');