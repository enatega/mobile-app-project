export function handleTruncate(maxLength: number, input: string | number): string {
    const strInput: string = String(input);
    if (strInput.length > maxLength) {
        return strInput.slice(0, maxLength) + '...';
    }
    return strInput;
}