export const hasDuplicates = (strings: string[]): boolean => {
    const seen = new Set<string>();

    for(const str of strings){
        if(str === ""){
            continue;
        }
        if(seen.has(str)){
            return true;
        }
        seen.add(str);
    }

    return false;
}