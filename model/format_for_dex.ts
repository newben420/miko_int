export const formatForDEX = (num: number, sigFigs: number = 3) => {
    if (num === 0) return "0";

    const absNum = Math.abs(num);

    // Large number formatting (K, M, B, T)
    const suffixes = ["", "K", "M", "B", "T", "Q"];
    let magnitude = Math.floor(Math.log10(absNum) / 3);
    
    if (magnitude > 0) {
        magnitude = Math.min(magnitude, suffixes.length - 1); // Prevent exceeding suffixes
        const shortNum = (num / Math.pow(10, magnitude * 3)).toPrecision(sigFigs);
        return `${parseFloat(shortNum)}${suffixes[magnitude]}`;
    }

    // Small number formatting with subscript notation (0.0<sub>6</sub>2.73)
    if (absNum < 0.001) {
        let exponent = Math.floor(Math.log10(absNum));
        let mantissa = (num / Math.pow(10, exponent)).toPrecision(sigFigs).replace(".", "");
        let subscript = `<sub>${Math.abs(exponent)}</sub>`;
        return `0.0${subscript}${mantissa}`.includes("-") ? ("-" + (`0.0${subscript}${mantissa}`.replace("-",""))) : `0.0${subscript}${mantissa}`;
    }

    // Standard decimal notation for normal numbers
    return `${parseFloat(num.toPrecision(sigFigs))}`;
}