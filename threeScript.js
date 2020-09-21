import * as THREE from './three.js-master/build/three.module.js';


import {
    OrbitControls
} from './three.js-master/examples/jsm/controls/OrbitControls.js';

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

let onMouseMoveLogoRotation = true;

let getColorHex;

var clock = new THREE.Clock();

const colorChange = function (getColorTheme) {
    const colorTo = new THREE.Color(getColorTheme);
    // let colorTransition = 
    gsap.to(lightD.color, {
        r: colorTo.r,
        g: colorTo.g,
        b: colorTo.b,
        duration: 0.5
    });
    // colorTransition.play();
}

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
        x: 85,
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

const LeftLogoPosition = function () {
    gsap.to(camera, {
        duration: 4,
        ease: "sine.out",
        onUpdate: function () {
            camera.updateProjectionMatrix();
        }
    });

    gsap.to(camera.position, {
        duration: 4,
        x: 56,
        y: 212,
        z: 399,
        onUpdate: function () {
            update();
        }
    })

    gsap.to(controls.target, {
        duration: 4,
        x: 462,
        y: -69,
        z: -319,
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
    if (window.innerWidth <= 768) {
        camera.fov = 60;
    }
    camera.position.set(-49, 720, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111319);
    // scene.background.color = 0xccaacc;


    scene.fog = new THREE.Fog(0x111319, 300, 900);
    //responsywnosc z fog

    lightA = new THREE.AmbientLight(0xfffffe, 0.1);
    scene.add(lightA);

    lightH = new THREE.HemisphereLight(0xffffff, 0x111319);
    lightH.position.set(0, 200, 0);
    scene.add(lightH);

    lightD = new THREE.DirectionalLight(0x111319, 3);
    lightD.position.set(220, 150, -250);
    lightD.castShadow = true;
    lightD.shadow.mapSize.width = 4096;
    lightD.shadow.mapSize.height = 4096;
    lightD.shadow.camera.top = 180;
    lightD.shadow.camera.bottom = -200;
    lightD.shadow.camera.left = -200;
    lightD.shadow.camera.right = 300;
    scene.add(lightD);
    // var helperD = new THREE.DirectionalLightHelper(lightD, 5);
    // scene.add(helperD);

    // ground
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x111319,
        depthWrite: true
    }));
    //pi = 180 stopni
    mesh.rotation.x = -Math.PI / 2;
    // mesh.rotation.z = 0.5
    mesh.receiveShadow = true;
    scene.add(mesh);

    // var grid = new THREE.GridHelper(2000, 44, 0x000000, 0x000000);
    // grid.material.opacity = 0.15;
    // grid.material.transparent = true;
    // scene.add(grid);

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
    } else if (window.pageYOffset > window.innerHeight / 3 && window.pageYOffset < window.innerHeight) {
        DecreaseLogoSize();
        console.log('decrease no scroll');
    } else if (window.pageYOffset > window.innerHeight * 1.6) {
        LeftLogoPosition();
    }

    // LeftLogoPosition();

    $(window).scroll(function () {
        if (window.pageYOffset >= window.innerHeight * 1.6) {
            LeftLogoPosition();
            console.log("decrease");
        } else if (window.pageYOffset > window.innerHeight / 3 && window.pageYOffset < window.innerHeight) {
            DecreaseLogoSize();
            console.log('decrease no scroll');
        } else if (window.pageYOffset < window.innerHeight / 3) {
            IncreaseLogoSize();
        }
    });







    let colorTheme;
    //pos rot and scale go into local transform matrix which is by default automatically updated
    //Projection Matrix only needs update after FOV changes
    $(".projects__title").hover(
        function () {
            colorTheme = this.getAttribute("data-color");
            colorChange(colorTheme);
        }
    );
    $(".projects__title").mouseleave(
        function () {
            colorChange('#111319');
        }
    );
    $(".projects__title").scroll(
        function () {
            colorChange('#111319');
        }
    );


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
    // uncommenting will enable camera move on mouse move but disable controls target gui
    controls.update();
    // camera.lookAt(targetCamera);
    camera.updateProjectionMatrix();
}

function animate() {


    update();
    // targetCamera.x += (-mouseXpercent * 15 - targetCamera.x) / 10;
    if (window.innerWidth > 768) {
        // targetCamera.z += (-mouseYpercent * 15 - targetCamera.z) / 10;
        targetCamera.y += (-mouseXpercent * 55 - targetCamera.y) / 10;
        // camera.lookAt(targetCamera);
    }

    if (onMouseMoveLogoRotation == false) {
        controls.update();
    }
    // targetCamera.rotation += (-mouseXpercent * 55) / 10;
    // mesh.rotation.y += (-mouseYpercent * 0.13 - mesh.rotation.y);

    // mesh.rotateY(Math.random() * 360 * 0.01745327)
    // mesh.translateZ(0
    // targetCamera.y += (-(mouseYpercent * 15) + 1 - targetCamera.y) / 15;

    // camera.lookAt(mesh.position);
    requestAnimationFrame(animate, renderer.domElement);

    var delta = clock.getDelta();
    if (mixer !== undefined) mixer.update(delta);

    renderer.render(scene, camera);

};

$('#threeJSContainer').prependTo('body');