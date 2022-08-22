chrome.storage.local.get("tokens", ({ tokens }) => {
    const tokenTable = document.getElementById("token-table");

    for (const url in tokens) {
        const urlDiv = createUlrDiv(url);
        tokenTable.appendChild(urlDiv)

        const tokenDiv = createTokenDiv(tokens[url]);
        tokenTable.appendChild(tokenDiv)

        const buttonDiv = createButtonDiv(tokenDiv);
        tokenTable.appendChild(buttonDiv)
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
    tokenTextArea.setAttribute("cols", 20);
    tokenTextArea.setAttribute("rows", 4);
    tokenDiv.appendChild(tokenTextArea);

    return tokenDiv;
}

function createButtonDiv(tokenDiv) {
    const DefaultText = "copy";

    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "button-column");

    const copyButton = document.createElement("button");
    copyButton.innerText = DefaultText;
    copyButton.setAttribute("class", "copy-button");
    copyButton.setAttribute("type", "button");
    copyButton.onclick = function() {
        const tokenTextArea = tokenDiv.querySelector("textarea");
        navigator.clipboard.writeText(tokenTextArea.value)
            .then(
                () => {
                    this.innerText = "copied!";
                    setTimeout(() => { this.innerText = DefaultText; }, 750);
                },
                () => {
                    alert("Copy failed!");
                });
    };
    buttonDiv.appendChild(copyButton);

    return buttonDiv;
}