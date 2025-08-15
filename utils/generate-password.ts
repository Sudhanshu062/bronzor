export function generatePassword(length: number) {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    const select = () =>
        charset.charAt(Math.floor(Math.random() * charset.length));

    return Array.from({ length }, select).join("");
}