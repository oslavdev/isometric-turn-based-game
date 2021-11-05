import * as THREE from 'three'


export function loadTextureFromPath(url){

    const textureLoader = new THREE.TextureLoader()

    const texture = {
        // colorTexture: textureLoader.load(url("Base_Color")),
        ambientOcclusionTexture: textureLoader.load(url("AO")),
        heightTexture: textureLoader.load(url("Height")),
        normalTexture: textureLoader.load(url("Normal")),
        displacementTexture: textureLoader.load(url("Displacement")),
        glossinessTexture: textureLoader.load(url("Glossiness")),
        reflectionTexture: textureLoader.load(url("Reflection")),
        diffuseTexture: textureLoader.load(url("Diffuse")),
        // roughnessTexture: textureLoader.load(url("Roughness")),
    }
    
    
    // texture.colorTexture.wrapS = THREE.RepeatWrapping
    texture.ambientOcclusionTexture.wrapS = THREE.RepeatWrapping
    texture.normalTexture.wrapS = THREE.RepeatWrapping
    // texture.roughnessTexture.wrapS = THREE.RepeatWrapping
    texture.heightTexture.wrapS = THREE.RepeatWrapping
    texture.displacementTexture.wrapS = THREE.RepeatWrapping
    texture.glossinessTexture.wrapS = THREE.RepeatWrapping
    texture.reflectionTexture.wrapS = THREE.RepeatWrapping
    texture.diffuseTexture.wrapS = THREE.RepeatWrapping
    
    // texture.colorTexture.wrapT = THREE.RepeatWrapping
    texture.ambientOcclusionTexture.wrapT = THREE.RepeatWrapping
    texture.normalTexture.wrapT = THREE.RepeatWrapping
    // texture.roughnessTexture.wrapT = THREE.RepeatWrapping
    texture.heightTexture.wrapT = THREE.RepeatWrapping
    texture.heightTexture.wrapT = THREE.RepeatWrapping
    texture.displacementTexture.wrapT = THREE.RepeatWrapping
    texture.glossinessTexture.wrapT = THREE.RepeatWrapping
    texture.reflectionTexture.wrapT = THREE.RepeatWrapping
    texture.diffuseTexture.wrapT = THREE.RepeatWrapping

    return texture;
}