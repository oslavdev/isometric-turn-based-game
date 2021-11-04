import * as THREE from 'three'
import {getRandomIntInclusive} from '../utils/randomNumberGenerator'

/** Generate a single tile */
function tileGenerator(tileSize, textures){

    const numberOfAvailableTextures = textures.length;
    const getARandomTextureForThisIteration  =  getRandomIntInclusive(0, numberOfAvailableTextures-1)

    console.log(getARandomTextureForThisIteration)

    const texture = textures[getARandomTextureForThisIteration]

    const tile_geometry = new THREE.BoxGeometry(
        tileSize.width, 
        tileSize.height, 
        tileSize.depth, 
        tileSize.plygons.x, 
        tileSize.plygons.y, 
        tileSize.plygons.z
    )
    const tile_material = new THREE.MeshStandardMaterial({
        map: texture.grassColorTexture,
        aoMap: texture.grassAmbientOcclusionTexture,
        normalMap: texture.grassNormalTexture,
        roughnessMap: texture.grassRoughnessTexture
    })
    const tile = new THREE.Mesh( tile_geometry, tile_material );
    tile.castShadow = true
    tile.receiveShadow = true
    tile.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(tile.geometry.attributes.uv.array, 2))

    return tile;
}

/**
 *  Generate playground of a random size
 * 
 * 
*/
export function planeGenerator(
    rows,
    columns,
    tileSize,
    options
){

    const tiles = []
    const y = -15

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            const tile = tileGenerator(tileSize, options.textures)
            tile.position.y = y
            tile.position.x = r * tileSize.width
            tile.position.z = c * tileSize.depth

            tile.castShadow = true
            tile.receiveShadow = true
            
            tiles.push(tile)
        }
    }


    return tiles;
}

