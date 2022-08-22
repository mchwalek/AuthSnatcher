const BearerPrefix = "Bearer ";

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

        chrome.storage.local.get("tokens", ({ tokens }) => {
            if (!tokens) {
                tokens = {};
            }

            tokens[details.url] = authHeader.value.substring(BearerPrefix.length);
            chrome.storage.local.set({ tokens });
        });
    },
    {
        urls: ["<all_urls>"]
    },
    ["requestHeaders"]);