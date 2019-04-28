export function getHostName(): string {
    const hostName = 'localhost' || window.location.hostname;
    const port = 53599 || window.location.port;
    return hostName + ':' + port;
}
export const headers = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};
