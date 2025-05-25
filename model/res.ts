export class Res {
    succ!: boolean;
    message!: any;
}

export class GRes {
    static succ = (message: any = ""): Res => {
        return {succ: true, message} as Res;
    }

    static err = (message: any = ""): Res => {
        return {succ: false, message} as Res;
    }
}