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

/**
 * Environment map
 */
 const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

/** 
 * 
 * Plane - Battle Scene
 * 
 * */

const plane_geometry = new THREE.BoxGeometry(30, 10, 30, 10, 10, 10)
const plane_material = new THREE.MeshBasicMaterial({ 
    color: Theme.planeColor,
    wireframe: false
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
    .max(100)
    .step(1)
    .name('width')

MeshDebug
    .add(plane.scale, 'y')
    .min(0)
    .max(100)
    .step(1)
    .name('height')

MeshDebug
    .add(plane.scale, 'z')
    .min(0)
    .max(100)
    .step(1)
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

/** Directional light */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

const Light = gui.addFolder('Directional Light')
Light.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
Light.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
Light.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
Light.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

/** Grid */
const geometry = new THREE.PlaneBufferGeometry( 100, 100, 10, 10 );
const material = new THREE.MeshBasicMaterial( { color: Theme.gridColor, wireframe: true, opacity: 0.9, transparent: true } );
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
    .min(-120)
    .max(120)
    .step(0.1)
    .name("X position")

cameraPosition
    .add(camera.position, "y")
    .min(-210)
    .max(120)
    .step(0.1)
    .name("Y position")

cameraPosition
    .add(camera.position, "z")
    .min(-120)
    .max(120)
    .step(0.1)
    .name("Z position")

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