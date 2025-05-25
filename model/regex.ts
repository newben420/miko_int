export class LocalRegex {
    static storageKey = /^[a-zA-Z\s0-9\-_]+$/;
    static general = /^.+$/;
    static url = new RegExp(
        `^(ht|f)tp(s?):\\/\\/[0-9a-zA-Z]([\\-\\.\\w]*[0-9a-zA-Z])?(:[0-9]+)?(\\/)?([a-zA-Z0-9\\-\\.\\?,'\\/\\+&%\\$#_]*)?$`,
        'i'
    );
    static generalEmpty = /[.\n\t\s]*/;
    static password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*\-]).{8,30}$/;
    static token = /^[A-Z0-9\s_\-]{1,100}$/;
    static flt = /^(-)?([\d]{1,})(\.([\d]{1,}))?$/;
    static integer = /^(-)?[\d]+$/;
    static mint = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
}