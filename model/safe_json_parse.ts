export const safeJSONParse = (data: string, isArr: boolean = false): any => {
    let obj: any = isArr ? [] : {};
    try {
        obj = JSON.parse(data);
    } catch (error) {
        // do nothing
    }
    finally{
        return obj;
    }
}