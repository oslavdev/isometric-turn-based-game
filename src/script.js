import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {Theme} from "./config/theme"

/** 
 * 
 * Debuggers
 * 
 * 
 *  */

const gui = new dat.GUI()
// dat.GUI.toggleHide();



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/** 
 * 
 * Plane - Battle Scene
 * 
 * */

const plane_geometry = new THREE.BoxGeometry(3, 0.27, 3, 10, 10, 10)
const plane_material = new THREE.MeshBasicMaterial({ 
    color: Theme.planeColor,
    wireframe: true
})
const plane = new THREE.Mesh( plane_geometry, plane_material );

//** Plane adjustment section */
const ColorDebug = gui.addFolder("Color")
ColorDebug
    .addColor(Theme, 'planeColor')
    .onChange(() =>
    {
        plane_material.color.set(Theme.planeColor)
    })

const MeshDebug = gui.addFolder("Mesh Size/Position")
MeshDebug
    .add(plane.scale, 'x')
    .min(0)
    .max(10)
    .step(0.01)
    .name('width')

MeshDebug
    .add(plane.scale, 'y')
    .min(0)
    .max(10)
    .step(0.01)
    .name('height')

MeshDebug
    .add(plane.scale, 'z')
    .min(0)
    .max(10)
    .step(0.01)
    .name('depth')

MeshDebug
    .add(plane.position, 'y')
    .min(- 5)
    .max(5)
    .step(0.01)
    .name('vertical plane position')

MeshDebug
    .add(plane.position, 'x')
    .min(- 5)
    .max(5)
    .step(0.01)
    .name('horizontal plane position')


MeshDebug
    .add(plane.geometry.parameters, 'widthSegments')
    .min(0)
    .max(1000)
    .step(1)
    .name('number of width segments')

MeshDebug    
    .add(plane.geometry.parameters, 'heightSegments')
    .min(0)
    .max(1000)
    .step(1)
    .name('number of height segments')

MeshDebug
    .add(plane.geometry.parameters, 'depthSegments')
    .min(0)
    .max(1000)
    .step(1)
    .name('number of depth segments')

gui.add(plane_material, 'wireframe')

scene.add( plane );

/** Ambient */
scene.add( new THREE.AmbientLight( 0x444444 ) );

/** Point light */
const light = new THREE.PointLight( 0xffffff, 0.8 );
light.position.set( 0, 50, 50 );
scene.add( light );

/** Grid */
const geometry = new THREE.PlaneBufferGeometry( 100, 100, 10, 10 );
const material = new THREE.MeshBasicMaterial( { wireframe: true, opacity: 0.5, transparent: true } );
const grid = new THREE.Mesh( geometry, material );
grid.rotation.order = 'YXZ';
grid.rotation.y = - Math.PI / 2;
grid.rotation.x = - Math.PI / 2;
scene.add( grid );

/**
 * Raycaster
 */
 const raycaster = new THREE.Raycaster()
 let currentIntersect = null
 const rayDirection = new THREE.Vector3(10, 0, 0)
 rayDirection.normalize()


 /** Mouse */

 const mouse = new THREE.Vector2()

 window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () =>
{
    if(currentIntersect)
    {
        switch(currentIntersect.object)
        {
            case plane:
                console.log('click on plane')
                break
        }
    }
})

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
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.z = 3
// scene.add(camera)
const aspect = window.innerWidth / window.innerHeight;
const d = 20;
const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );

camera.position.set( 100, 100, 100 ); 
camera.lookAt( scene.position );

// adjust camera position
const cameraPosition = gui.addFolder("Camera")
cameraPosition
    .add(camera.position, "x")
    .min(-20)
    .max(20)
    .step(0.1)
    .name("X position")

cameraPosition
    .add(camera.position, "y")
    .min(-20)
    .max(20)
    .step(0.1)
    .name("Y position")

cameraPosition
    .add(camera.position, "z")
    .min(-20)
    .max(20)
    .step(0.1)
    .name("Z position")

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [plane]
    const intersects = raycaster.intersectObjects(objectsToTest)
    
    if(intersects.length)
    {
        if(!currentIntersect)
        {
            console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    }
    else
    {
        if(currentIntersect)
        {
            console.log('mouse leave')
        }
        
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()