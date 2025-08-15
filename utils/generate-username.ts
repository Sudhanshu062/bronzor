import { FIRST_NAMES } from "@/data/first-names";

export function generateUsername(digitCount: number) {
    const randomName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

    const min = Math.pow(10, digitCount - 1);
    const max = Math.pow(10, digitCount) - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return `${randomName}${randomNumber}`;
}