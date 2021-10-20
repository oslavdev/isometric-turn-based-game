import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Theme
let theme = {
    planeColor: 0x9b8ed7
};

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
    color: theme.planeColor,
    wireframe: true
})
const plane = new THREE.Mesh( plane_geometry, plane_material );

//** Plane adjustment section */
const ColorDebug = gui.addFolder("Color")
ColorDebug
    .addColor(theme, 'planeColor')
    .onChange(() =>
    {
        plane_material.color.set(theme.planeColor)
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()