const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Centralized fetch wrapper for the VeriTrust API.
 * - Prepends the API base URL
 * - Auto-attaches JWT from localStorage as Bearer token
 * - Auto-parses JSON response
 *
 * @param {string} path  – API path, e.g. "/login"
 * @param {object} opts  – Standard fetch options (method, body, headers, etc.)
 * @returns {{ ok: boolean, status: number, data: any }}
 */
export async function apiFetch(path, opts = {}) {
    const token = localStorage.getItem("veritrust_token");

    const headers = {
        "Content-Type": "application/json",
        ...opts.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers,
    });

    const data = await response.json();

    return { ok: response.ok, status: response.status, data };
}

export default apiFetch;
