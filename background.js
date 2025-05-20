// Service worker for FPL Insights
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "viewInsights") {
        // Handle analytics event
        console.log('Analytics event: viewInsights clicked');
    }
    return true;
});