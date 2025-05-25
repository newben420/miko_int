
export const convertSubscriptTags = (input: string) => {
    // Unicode subscript mapping for digits
    const subscriptMap: any = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };

    return input.replace(/<sub>(\d+)<\/sub>/g, (match, p1) => {
        // Convert each digit to its Unicode subscript equivalent
        return p1.split('').map((digit: string) => subscriptMap[digit] || digit).join('');
    });
}
