const BearerPrefix = "Bearer ";

let tokens;
chrome.storage.local.get("tokens", ({ storageTokens }) => {
    tokens = storageTokens || {};
});

// HACK: workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=1024211
chrome.webNavigation.onBeforeNavigate.addListener(() => {});

chrome.webRequest.onSendHeaders.addListener(
    details => {
        if (details.type !== "xmlhttprequest") {
            return;
        }

        if (!details || !details.requestHeaders) {
            return;
        }

        var authHeader = details.requestHeaders.find(x => x.name === "Authorization")
        if (!authHeader) {
            return;
        }

        if (authHeader.value.indexOf(BearerPrefix) !== 0) {
            return;
        }

        tokens[details.url] = authHeader.value.substring(BearerPrefix.length);
        chrome.storage.local.set({ tokens });
    },
    {
        urls: ["<all_urls>"]
    },
    ["requestHeaders"]);
