

export function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'CM'
    let code = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (i < 2) {
            code += '-';
        }
    }
    return `${prefix}-${code}`;
}

console.log(generateRandomCode()); // Example output: 'ABC-123'



// export function getTimestamp() {
//     let today = new Date();
//     let dateString = today.getFullYear() + "-" +
//         (today.getMonth() + 1).toString().padStart(2, '0') + "-" +
//         today.getDate().toString().padStart(2, '0') + "T" +
//         today.getHours().toString().padStart(2, '0') + ":" +
//         today.getMinutes().toString().padStart(2, '0') + ":" +
//         today.getSeconds().toString().padStart(2, '0') + "." +
//         today.getMilliseconds().toString().padStart(3, '0') + "+00:00";
//     return dateString
// }
export function getTimestamp() {
    let today = new Date();
    return today.toISOString();
}

export function isBeforeCertainHour(checkTimestamp: string, hour: number, minutes: number): boolean {
    const targetTime = new Date();
    targetTime.setHours(hour, minutes, 0, 0);
    const inputTime = new Date(Date.parse(checkTimestamp));
    return targetTime > inputTime;
}
export function isAfterCertainHour(checkTimestamp: string, hour: number, minutes: number): boolean {
    const targetTime = new Date();
    targetTime.setHours(hour, minutes, 0, 0);
    const inputTime = new Date(Date.parse(checkTimestamp));
    return inputTime > targetTime;
}


/**
 * 
 * @param str 
 * @description This function works by converting each character in the string to its Unicode value, adding the seed value, and then concatenating the results together. However, this is a very basic example and may not be suitable for all use cases due to its simplicity.
 * @returns 
 */
export function encodeString(str: string) {
    const seed = 619; // This seed value will ensure the same result for "home"
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i) + seed;
    }
    return result;
}