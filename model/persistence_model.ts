export class Pair {
    base!: string;
    quote!: string;
    status?: boolean;
    buy?: boolean;
    sell?: boolean;
    lu?: number;
}

export class PModel {
    pairs?: Pair[];
};
