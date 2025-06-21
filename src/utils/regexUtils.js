export function escapeRegExp(string) {
    const re = /[.*+?^${}()|[\]\\]/g
    return string.replace(re, '\\$&')
}

