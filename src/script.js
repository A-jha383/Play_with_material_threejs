import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//npm install --save dat.gui
import * as dat from 'dat.gui'

/*
debug
*/
const gui = new dat.GUI()

/**
 * Base
 */
/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()
//const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture =  textureLoader.load('/textures/matcaps/1.png')
const gradirentTexture = textureLoader.load('/textures/gradients/3.jpg')
// gradirentTexture.minFilter=THREE.NearestFilter
// gradirentTexture.generateMipmaps=false

// const environmentMapTexture =cubeTextureLoader.load([
//     'textures/environmentMaps/0/px.jpg',
//     'textures/environmentMaps/0/nx.jpg',
//     'textures/environmentMaps/0/py.jpg',
//     'textures/environmentMaps/0/ny.jpg',
//     'textures/environmentMaps/0/pz.jpg',
//     'textures/environmentMaps/0/nz.jpg'
// ])

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * object
 */
// const material = new THREE.MeshBasicMaterial()
// material.map =doorColorTexture
// //material.color = new THREE.Color('#7020cc')
// //
// material.color.set('#7020cc')
// material.transparent = true
// //material.opacity=0.5
// material.alphaMap=doorAlphaTexture
// material.side = THREE.DoubleSide
// 2nd material type
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true
// 3rd material illusion
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
//const material = new THREE.MeshDepthMaterial()

//reflecting material
// const material = new THREE.MeshLambertMaterial()
// const material = new THREE.MeshPhongMaterial()
// material.shininess=100
// material.specular = new THREE.Color(0x7020cc)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap=gradirentTexture

const material = new THREE.MeshStandardMaterial()
 material.metalness=0.7
material.roughness=0.2
 material.map=doorColorTexture
material.aoMap = doorAmbTexture
material.aoMapIntensity=4
material.displacementMap=doorHeightTexture
material.displacementScale = 0.1
material.metalnessMap = doorMetalTexture
material.roughnessMap = doorRoughTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5,0.5)
material.transparent = true
material.alphaMap = doorAlphaTexture
//material.envMap = environmentMapTexture

gui.add(material,'aoMapIntensity').max(10).min(0).step(0.1)
gui.add(material,'metalness').min(0).max(1).step(0.0001)
gui.add(material,'roughness').min(0).max(1).step(0.0001)
gui.add(material,'displacementScale').min(0).max(1).step(0.0001)
gui.add(material,'transparent')

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,62,62),
    material
)
sphere.geometry.setAttribute('uv2',new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))
sphere.position.x=-1.5
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,100,100),
    material
)
plane.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
const torus =  new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3,0.2,64,128),
    material
)
torus.geometry.setAttribute('uv2',new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2))

torus.position.x = 1.5
scene.add(sphere,plane,torus)

//light
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
//update objects
sphere.rotation.y = 0.2*elapsedTime
plane.rotation.y = 0.2*elapsedTime
torus.rotation.y = 0.2*elapsedTime

sphere.rotation.x = 0.2*elapsedTime
plane.rotation.x = 0.2*elapsedTime
torus.rotation.x = 0.2*elapsedTime

// sphere.rotation.z = 0.2*elapsedTime
// plane.rotation.z = 0.2*elapsedTime
// torus.rotation.z = 0.2*elapsedTime


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()