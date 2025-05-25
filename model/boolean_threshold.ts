export const booleanThreshold = (arr: boolean[], threshold: number = 0.5): boolean => {
    let n = arr.length;
    if(n == 0){
        return false;
    }
    let truths: number = 0;
    for(let i: number = 0; i < n; i ++){
        if(arr[i]){
            truths++;
        }
    }
    let truthRatio = truths / n;
    return truthRatio >= threshold;
}