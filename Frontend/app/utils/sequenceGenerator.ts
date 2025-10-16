import { generateRandomNumber } from ".";

export function generateSequence(length: number = 1000, maxNumber: number = 7): number[] {
    const sequence: number[] = [];
    for (let i = 0; i < length/4; i++) {
        const randomNum1 = generateRandomNumber(maxNumber);
        let randomNum2 = generateRandomNumber(maxNumber);
        while (randomNum2 === randomNum1) {
            randomNum2 = generateRandomNumber(maxNumber);
        }
        sequence.push(randomNum1);
        sequence.push(randomNum2);
        sequence.push(randomNum1);
        sequence.push(randomNum2);
    }
    return sequence;
}