/**
 * CMS Content Loader
 * Loads dynamic content from Google Sheets via GAS API
 * Falls back gracefully to HTML original content when API unavailable
 *
 * Usage: Add data-cms="pageId.sectionId" to any HTML element
 * Example: <h1 data-cms="index.hero-title">Original Title</h1>
 */
(function () {
    'use strict';

    // Only run if API is configured
    if (typeof GAS_API_URL === 'undefined' || typeof API_ENABLED === 'undefined' || !API_ENABLED) return;
    if (GAS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL') return;

    // Determine current page from filename
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '') || 'index';

    // Find all CMS-managed elements on this page
    const elements = document.querySelectorAll('[data-cms]');
    if (elements.length === 0) return;

    // Fetch CMS content for this page
    fetch(GAS_API_URL + '?action=getCmsContent&page=' + encodeURIComponent(filename))
        .then(function (res) { return res.json(); })
        .then(function (result) {
            if (!result.success || !result.data) return;

            // Build lookup map: sectionId -> content
            var contentMap = {};
            result.data.forEach(function (item) {
                contentMap[item.sectionId] = item.content;
            });

            // Apply content to matching elements
            elements.forEach(function (el) {
                var key = el.dataset.cms;
                // data-cms format: "pageId.sectionId" or just "sectionId"
                var sectionId = key.includes('.') ? key.split('.')[1] : key;

                if (contentMap[sectionId]) {
                    el.textContent = contentMap[sectionId];
                }
            });
        })
        .catch(function () {
            // Silently fail — keep original HTML content
        });
})();
