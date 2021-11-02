import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {Theme} from "./config/theme"
import { planeGenerator } from './utils/planeGenerator'
import {getRandomIntInclusive} from './utils/randomNumberGenerator'
/** 
 * 
 * Debuggers
 * 
 * 
 *  */

const gui = new dat.GUI()
const debugObject = {}

// dat.GUI.toggleHide(); // <----- uncomment to hide debugger

/**
 * Loaders
 */
 const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
let objects = [];

/**
 * Update all materials
 */
 const updateAllMaterials = () =>
 {
     scene.traverse((child) =>
     {
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
             // child.material.envMap = environmentMap
             child.material.envMapIntensity = debugObject.envMapIntensity
             child.material.needsUpdate = true
             child.castShadow = true
             child.receiveShadow = true
         }
     })
 }

scene.background = new THREE.Color( 0xf0f0f0 );
/** 
 * 
 * Plane - Battle Scene
 * 
 * */

// const plane_size = {
//     width: 100,
//     height: 50,
//     depth: 100,
//     plygons:{
//         x: 10,
//         y: 10,
//         z: 10
//     }
// }
// const plane_geometry = new THREE.BoxGeometry(
//     plane_size.width, 
//     plane_size.height, 
//     plane_size.depth, 
//     plane_size.plygons.x, 
//     plane_size.plygons.y, 
//     plane_size.plygons.z
// )
// const plane_material = new THREE.MeshBasicMaterial({ 
//     color: Theme.planeColor,
//     wireframe: false
// })
// const plane = new THREE.Mesh( plane_geometry, plane_material );
// plane.castShadow = true
// plane.receiveShadow = true
// plane.position.y = -15

const random = getRandomIntInclusive(5, 10)
const generatedPlane = planeGenerator(random, random);

objects = [...generatedPlane]

//** Plane adjustment section */
// const ColorDebug = gui.addFolder("Color")
// ColorDebug
//     .addColor(Theme, 'planeColor')
//     .onChange(() =>
//     {
//         plane_material.color.set(Theme.planeColor)
//     })

// gui.add(plane_material, 'wireframe')

generatedPlane.forEach((tile) => scene.add( tile ))

const selector = new THREE.BoxGeometry( 100, 1, 100 );
const selectorMaterial = new THREE.MeshBasicMaterial( { color: Theme.selectorColor, opacity: 0.5, transparent: true } );
const selectorMesh = new THREE.Mesh( selector, selectorMaterial );
selectorMesh.position.y = -50;
scene.add( selectorMesh );

const SelectorDebug = gui.addFolder("Selector")
SelectorDebug
    .addColor(Theme, 'selectorColor')
    .onChange(() =>
    {
        selectorMaterial.color.set(Theme.selectorColor)
    })


/** Light */

const ambientLight = new THREE.AmbientLight( 0x606060 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
scene.add( directionalLight );

/** Grid */
// const geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 10, 10 );
// const material = new THREE.MeshBasicMaterial( { color: Theme.gridColor, wireframe: true, opacity: 0.9, transparent: true } );
// const grid = new THREE.Mesh( geometry, material );
// grid.rotation.order = 'YXZ';
// grid.rotation.y = - Math.PI / 2;
// grid.rotation.x = - Math.PI / 2;
// scene.add( grid );

/**
 * Raycaster
 */
 const raycaster = new THREE.Raycaster()
 const rayDirection = new THREE.Vector3(10, 0, 0)
 rayDirection.normalize()
 let isShiftDown = false;
const pointer = new THREE.Vector2();
 /** Mouse */

 const mouse = new THREE.Vector2()

 document.addEventListener( 'pointermove', onPointerMove );
 document.addEventListener( 'pointerdown', onPointerDown );
 document.addEventListener( 'keydown', onDocumentKeyDown );
 document.addEventListener( 'keyup', onDocumentKeyUp );


 window.addEventListener( 'resize', onWindowResize );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 500, 800, 1300 );
camera.lookAt( 0, 0, 0 );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderer_gui = gui.addFolder("Renderer")
renderer_gui
    .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
    })
    .onFinishChange(() =>
    {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })
renderer_gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function onPointerMove( event ) {

    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( objects, false );

    if ( intersects.length > 0 ) {

        const intersect = intersects[ 0 ];

        selectorMesh.position.copy( intersect.point ).add( intersect.face.normal );
        selectorMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

    }

    render();

}

function onPointerDown( event ) {

    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( objects, false );

    if ( intersects.length > 0 ) {

        const intersect = intersects[ 0 ];


        if ( isShiftDown ) {

            if ( intersect.object !== plane ) {

               

            }


        } else {

           

        }

        render();

    }

}

function onDocumentKeyDown( event ) {

    switch ( event.keyCode ) {

        case 16: isShiftDown = true; break;

    }

}

function onDocumentKeyUp( event ) {

    switch ( event.keyCode ) {

        case 16: isShiftDown = false; break;

    }

}


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    raycaster.setFromCamera(mouse, camera)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

function render() {

    renderer.render( scene, camera );

}

tick()