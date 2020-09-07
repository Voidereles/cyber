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
let container, controls;
let camera, scene, renderer, mixer;
let lightA, lightH, lightD;
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

    gsap.to(camera.position, {
        duration: 4,
        x: 29,
        y: 263,
        z: 404,
        onUpdate: function () {
            update();
        }
    })

    gsap.to(controls.target, {
        duration: 4,
        x: -299,
        y: -252,
        z: -486,
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
        ease: "sine.out",
        onUpdate: function () {
            camera.updateProjectionMatrix();
        }
    });

    gsap.to(camera.position, {
        duration: 4,
        x: 107,
        y: 357,
        z: 91,
        onUpdate: function () {
            update();
        }
    })

    gsap.to(controls.target, {
        duration: 4,
        x: 85,
        y: -664,
        z: -143,
        ease: "sine.out",
        onUpdate: function () {
            controls.update();
        }
    });
}
// window.DecreaseLogoSize = DecreaseLogoSize; //window, żeby móc odwołać się w konsoli. Tylko do debugowania!
// window.IncreaseLogoSize = IncreaseLogoSize;


init();
animate();


function init() {

    container = document.createElement('div');
    container.id = "threeJSContainer";
    container.classList.add('threeJS__container');
    threeJSContainer = document.getElementById('threeJSContainer');


    const loadingManager = new THREE.LoadingManager(() => {

        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');

        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener('transitionend', onTransitionEnd);

    });

    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(-49, 720, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    scene.fog = new THREE.Fog(0x111111, 200, 1000);

    lightA = new THREE.AmbientLight(0xfffffe, 0.1);
    scene.add(lightA);

    lightH = new THREE.HemisphereLight(0xffffff, 0x444444);
    lightH.position.set(0, 200, 0);
    scene.add(lightH);

    lightD = new THREE.DirectionalLight(0x111111, 3);
    lightD.position.set(220, 150, -250);
    lightD.castShadow = true;
    lightD.shadow.mapSize.width = 4096;
    lightD.shadow.mapSize.height = 4096;
    lightD.shadow.camera.top = 180;
    lightD.shadow.camera.bottom = -200;
    lightD.shadow.camera.left = -200;
    lightD.shadow.camera.right = 300;
    // scene.add(lightD);
    var helperD = new THREE.DirectionalLightHelper(lightD, 5);
    scene.add(helperD);

    // ground
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x333333,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    var grid = new THREE.GridHelper(2000, 44, 0x000000, 0x000000);
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    scene.add(grid);

    // model
    var loader = new FBXLoader(loadingManager);
    loader.load('phlgroup.FBX', function (object) {


        mixer = new THREE.AnimationMixer(object);
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

    var data = {
        color: lightA.color.getHex(),
        groundColor: lightH.groundColor.getHex(),
        skyColor: lightH.color.getHex(),
        color: lightD.color.getHex(),
        shadowMapSizeWidth: 4096,
        shadowMapSizeHeight: 4096,

        mapsEnabled: true
        //pobieramy tu te informacje co już są
    };



    //ambient//
    const lightFolder = gui.addFolder('THREE.Light');
    // gui.add(light, 'intensity', 0, 2, 0.01);
    lightFolder.addColor(data, 'color').onChange(() => {
        lightA.color.setHex(Number(data.color.toString().replace('#', '0x')));
    });
    lightFolder.add(lightA, 'intensity', 0, 4, 0.01);
    //ambient//


    //hemisphere
    const hemisphereLightFolder = gui.addFolder('THREE.HemisphereLight');
    hemisphereLightFolder.addColor(data, 'groundColor').onChange(() => {
        lightH.groundColor.setHex(Number(data.groundColor.toString().replace('#', '0x')));
    });
    hemisphereLightFolder.addColor(data, 'color').onChange(() => {
        lightH.color.setHex(Number(data.color.toString().replace('#', '0x')));
    });
    hemisphereLightFolder.add(lightH.position, "x", -200, 200, 1);
    hemisphereLightFolder.add(lightH.position, "y", -200, 200, 1);
    hemisphereLightFolder.add(lightH.position, "z", -200, 200, 1);
    hemisphereLightFolder.add(lightH, 'intensity', 0, 4, 0.01);
    //hemisphere




    //directionalLight
    const directionalLightFolder = gui.addFolder('THREE.DirectionalLight');
    directionalLightFolder.add(lightD.position, "x", -500, 500, 1);
    directionalLightFolder.add(lightD.position, "y", -500, 500, 1);
    directionalLightFolder.add(lightD.position, "z", -500, 500, 1);
    directionalLightFolder.add(lightD, 'intensity', 0, 4, 0.01)
    directionalLightFolder.addColor(data, 'color').onChange(() => {
        lightD.color.setHex(Number(data.color.toString().replace('#', '0x')));
    });
    directionalLightFolder.add(lightD.shadow.camera, "left", -300, 300, 1).onChange(() => light.shadow.camera.updateProjectionMatrix())
    directionalLightFolder.add(lightD.shadow.camera, "right", -300, 300, 1).onChange(() => light.shadow.camera.updateProjectionMatrix())
    directionalLightFolder.add(lightD.shadow.camera, "top", -300, 300, 1).onChange(() => light.shadow.camera.updateProjectionMatrix())
    directionalLightFolder.add(lightD.shadow.camera, "bottom", -300, 300, 1).onChange(() => light.shadow.camera.updateProjectionMatrix())
    directionalLightFolder.add(lightD.shadow.camera, "near", 0.1, 300).onChange(() => light.shadow.camera.updateProjectionMatrix())
    directionalLightFolder.add(lightD.shadow.camera, "far", 0.1, 300).onChange(() => light.shadow.camera.updateProjectionMatrix())
    directionalLightFolder.add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096]).onChange(() => updateShadowMapSize())
    directionalLightFolder.add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096]).onChange(() => updateShadowMapSize())
    //directionalLight














    gui.add(buttonDecreaseLogo, "add").name('smaller logo gsap animation');
    gui.add(buttonIncreaseLogo, "add").name('bigger logo gsap animation');

    gui.add(camera.position, 'x', -720, 720).name('cameraPosition x');
    gui.add(camera.position, 'y', -720, 720).name('cameraPosition y');
    gui.add(camera.position, 'z', -720, 720).name('cameraPosition z');

    gui.add(camera, 'fov', 1, 120).onChange(camera.updateProjectionMatrix());

    gui.add(controls.target, 'x', -720, 720).name('controlsTarget x');
    gui.add(controls.target, 'y', -720, 720).name('controlsTarget y');
    gui.add(controls.target, 'z', -720, 720).name('controlsTarget z');
    gui.closed = true;

    //pos rot and scale go into local transform matrix which is by default automatically updated
    //Projection Matrix only needs update after FOV changes


}


function onTransitionEnd(event) {

    event.target.remove();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function update() {
    // camera.lookAt(targetCamera); uncommenting will enable camera move on mouse move but disable controls target gui
    controls.update();
    camera.updateProjectionMatrix();
}

function animate() {


    update();
    targetCamera.x += (-mouseXpercent * 135 - targetCamera.x) / 10;
    targetCamera.y += (-(mouseYpercent * 135) + 1 - targetCamera.y) / 15;

    requestAnimationFrame(animate, renderer.domElement);

    var delta = clock.getDelta();
    if (mixer !== undefined) mixer.update(delta);

    renderer.render(scene, camera);

};

$('#threeJSContainer').prependTo('body');