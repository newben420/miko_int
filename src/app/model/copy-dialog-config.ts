export class CopyDialogItem {
    label!: string;
    value!: any;
    copied?: boolean;
}

export class CopyDialogConfig {
    title!: string;
    subtitle?: string;
    items!: CopyDialogItem[];
    callback?: Function;
}