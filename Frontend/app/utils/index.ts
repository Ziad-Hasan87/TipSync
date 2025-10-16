export function generateRandomNumber(max: number): number {
    let array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}