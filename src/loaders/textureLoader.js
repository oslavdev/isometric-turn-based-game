import * as THREE from 'three'

export function loadTextureFromPath(url){
    const textureLoader = new THREE.TextureLoader()

    const texture = {
        colorTexture: textureLoader.load(url("Base_Color")),
        ambientOcclusionTexture: textureLoader.load(url("Ambient_Occlusion")),
        heightTexture: textureLoader.load(url("Height")),
        normalTexture: textureLoader.load(url("Normal")),
        roughnessTexture: textureLoader.load(url("Roughness")),
    }
    
    
    texture.colorTexture.wrapS = THREE.RepeatWrapping
    texture.ambientOcclusionTexture.wrapS = THREE.RepeatWrapping
    texture.normalTexture.wrapS = THREE.RepeatWrapping
    texture.roughnessTexture.wrapS = THREE.RepeatWrapping
    texture.heightTexture.wrapS = THREE.RepeatWrapping
    
    texture.colorTexture.wrapT = THREE.RepeatWrapping
    texture.ambientOcclusionTexture.wrapT = THREE.RepeatWrapping
    texture.normalTexture.wrapT = THREE.RepeatWrapping
    texture.roughnessTexture.wrapT = THREE.RepeatWrapping
    texture.heightTexture.wrapT = THREE.RepeatWrapping

    return texture;
}