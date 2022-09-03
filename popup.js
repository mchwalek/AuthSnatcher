const urlSearchInput = document.getElementById("url-search");
urlSearchInput.oninput = args => {
    refreshTokenTable(args.currentTarget.value);
}

const clearButtonContainerDiv = document.getElementById("clear-button-container");
clearButtonContainerDiv.onclick = () => {
    const tokens = {};
    chrome.storage.local.set({ tokens });

    urlSearchInput.value = "";
    refreshTokenTable(null);
}

refreshTokenTable(null);

function refreshTokenTable(filterUrl) {
    chrome.storage.local.get(null, data => {
        const tokens = data.tokens;
        const tokenTable = document.getElementById("token-table");
        tokenTable.innerHTML = "";

        for (const url in tokens) {
            if (filterUrl && !url.includes(filterUrl)) {
                continue;
            }

            const urlDiv = createUlrDiv(url);
            tokenTable.appendChild(urlDiv)

            const tokenDiv = createTokenDiv(tokens[url]);
            tokenTable.appendChild(tokenDiv)

            const copyButtonDiv = createCopyButtonDiv(tokenDiv);
            tokenTable.appendChild(copyButtonDiv)
        }
    });

    function createUlrDiv(url) {
        const urlDiv = document.createElement("div");
        urlDiv.innerText = url;
        urlDiv.setAttribute("class", "url-column");

        return urlDiv;
    }

    function createTokenDiv(token) {
        const tokenDiv = document.createElement("div");
        tokenDiv.setAttribute("class", "token-column");

        const tokenTextArea = document.createElement("textarea");
        tokenTextArea.value = token;
        tokenTextArea.setAttribute("class", "token");
        tokenTextArea.setAttribute("readonly", "");
        tokenTextArea.setAttribute("rows", 4);
        tokenDiv.appendChild(tokenTextArea);

        return tokenDiv;
    }

    function createCopyButtonDiv(tokenDiv) {
        const defaultText = "copy";

        const buttonDiv = document.createElement("div");
        buttonDiv.setAttribute("class", "button-column");

        const copyButton = document.createElement("button");
        copyButton.innerText = defaultText;
        copyButton.setAttribute("class", "copy-button");
        copyButton.setAttribute("type", "button");
        copyButton.onclick = args => {
            const button = args.currentTarget;
            const tokenTextArea = tokenDiv.querySelector("textarea");
            navigator.clipboard.writeText(tokenTextArea.value)
                .then(
                    () => {
                        button.innerText = "copied!";
                        setTimeout(() => { button.innerText = defaultText; }, 750);
                    },
                    () => {
                        alert("Copy failed!");
                    });
        };
        buttonDiv.appendChild(copyButton);

        return buttonDiv;
    }
}