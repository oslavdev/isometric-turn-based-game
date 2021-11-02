
export function getRandomIntInclusive (start, size) {
    let min = Math.ceil(start);
    let max = Math.floor(size);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}