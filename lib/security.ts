export function normalizeDirectoryPath(path: string): string {
    try {
        path = decodeURIComponent(path);
    } catch {}

    path = path
        .trim()
        .split('?')[0]
        .split('#')[0]
        .replace(/\/+/g, '/')
        .replace(/[^A-Za-z0-9_./-]/g, '');

    return path.startsWith('/') ? path : '/' + path;
}
