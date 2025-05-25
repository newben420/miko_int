export function deepEqual<T>(obj1: T, obj2: T): boolean {
    if (obj1 === obj2) {
        return true; // Handle same reference or primitive values
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false; // Handle non-object or null values
    }

    const keys1 = Object.keys(obj1 as object);
    const keys2 = Object.keys(obj2 as object);

    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every(key => {
        const keyTyped = key as keyof T;
        return deepEqual(obj1[keyTyped], obj2[keyTyped]);
    });
}