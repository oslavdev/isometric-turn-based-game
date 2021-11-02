import * as THREE from 'three'
import * as Configuration from "../config"
import {Theme} from "../config/theme"


/** Generate a single tile */
function tileGenerator(tileSize){
    const tile_geometry = new THREE.BoxGeometry(
        tileSize.width, 
        tileSize.height, 
        tileSize.depth, 
        tileSize.plygons.x, 
        tileSize.plygons.y, 
        tileSize.plygons.z
    )
    const tile_material = new THREE.MeshBasicMaterial({ 
        color: Theme.planeColor
    })
    const tile = new THREE.Mesh( tile_geometry, tile_material );
    tile.castShadow = true
    tile.receiveShadow = true

    return tile;
}

/** Generate playground, by default it is 5 rows on 5 columns  
 * 
 * TODO make the size of the playground random
 * 
*/
export function planeGenerator(
    rows = 5,
    columns = 5,
    tileSize = Configuration.tileSize
){

    const tiles = []
    const y = -15

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            const tile = tileGenerator(tileSize)
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