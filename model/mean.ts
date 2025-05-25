export const calculateMean = (narr: number[]): number => {
    let l = narr.length;
    let i;
    let sum = 0;
    for (i = 0; i < l; i++) {
        sum += narr[i]
    }
    return sum / l;
}
