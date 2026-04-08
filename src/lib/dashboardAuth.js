const STORAGE_KEY = 'credit-hackr-dashboard-basic-auth';

export function getStoredDashboardAuth() {
    try {
        return sessionStorage.getItem(STORAGE_KEY) || '';
    } catch {
        return '';
    }
}

export function setStoredDashboardAuth(authHeader) {
    try {
        sessionStorage.setItem(STORAGE_KEY, authHeader);
    } catch {
        /* ignore */
    }
}

export function clearStoredDashboardAuth() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        /* ignore */
    }
}

export function buildBasicAuthHeader(username, password) {
    return `Basic ${btoa(`${username}:${password}`)}`;
}
