const urlSearchInput = document.getElementById("url-search");
urlSearchInput.oninput = args => {
    loadTokenTable(args.currentTarget.value);
}

const clearButtonContainerDiv = document.getElementById("clear-button-container");
clearButtonContainerDiv.onclick = () => {
    const tokens = {};
    chrome.storage.local.set({ tokens });

    urlSearchInput.value = "";
    loadTokenTable(null);
}

loadTokenTable(null);

function loadTokenTable(filterUrl) {
    chrome.storage.local.get(null, data => {
        const tokens = data.tokens;
        const tokenTable = document.getElementById("token-table");
        tokenTable.innerHTML = "";

        let tokensPresent = false;
        for (const url in tokens) {
            if (filterUrl && !url.includes(filterUrl)) {
                continue;
            }

            tokensPresent = true;

            const urlDiv = createUlrDiv(url);
            tokenTable.appendChild(urlDiv);

            const tokenDiv = createTokenDiv(tokens[url]);
            tokenTable.appendChild(tokenDiv);

            const copyButtonDiv = createCopyButtonDiv(tokenDiv);
            tokenTable.appendChild(copyButtonDiv);
        }

        toggleSearchContainer(filterUrl, tokensPresent);
        toggleNoDataPlaceholder(tokensPresent);
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

    function toggleSearchContainer(filterUrl, tokensPresent) {
        const searchContainer = document.getElementById("search-container");
        searchContainer.style.display = !filterUrl && !tokensPresent ? "none" : "contents";
    }

    function toggleNoDataPlaceholder(tokensPresent) {
        const noDataPlaceholder = document.getElementById("no-data-placeholder");
        noDataPlaceholder.style.display = tokensPresent ? "none" : "block";
    }
}