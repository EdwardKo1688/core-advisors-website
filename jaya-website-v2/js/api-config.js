/**
 * Jaya Website — API Configuration
 * Replace GAS_WEB_APP_URL with your deployed Google Apps Script Web App URL
 */

const JAYA_API = {
    // Google Apps Script Web App URL (deploy as web app and paste URL here)
    BASE_URL: '',

    // Cache duration in milliseconds (10 minutes)
    CACHE_DURATION: 10 * 60 * 1000,

    // Enable API (set to true after deploying GAS)
    ENABLED: false
};

/**
 * Fetch data with caching
 */
async function jayaFetch(action) {
    if (!JAYA_API.ENABLED || !JAYA_API.BASE_URL) {
        return null;
    }

    const cacheKey = `jaya_${action}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < JAYA_API.CACHE_DURATION) {
            return data;
        }
    }

    try {
        const response = await fetch(`${JAYA_API.BASE_URL}?action=${action}`);
        const result = await response.json();

        if (result.data) {
            sessionStorage.setItem(cacheKey, JSON.stringify({
                data: result.data,
                timestamp: Date.now()
            }));
        }

        return result.data || [];
    } catch (error) {
        console.warn(`API fetch failed for ${action}:`, error);
        return null;
    }
}

/**
 * Submit inquiry form
 */
async function submitInquiry(formData) {
    if (!JAYA_API.ENABLED || !JAYA_API.BASE_URL) {
        // Simulate success in demo mode
        return { success: true };
    }

    const response = await fetch(JAYA_API.BASE_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    return { success: true };
}

// Expose to global
window.JAYA_API_URL = JAYA_API.BASE_URL;
