import { randomBytes } from 'crypto';

export const  generateClientIds = (number: number) => {
  const ids = new Set<string>();

  while (ids.size < number) {
    const randomValue = randomBytes(4).readUInt32BE(0);
    const id = (randomValue % 9000000 + 1000000).toString(); 

    ids.add(id); 
  }

  return Array.from(ids);
}

export const generateRandomNumber = (digits: number): number => {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};