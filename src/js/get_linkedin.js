// Source https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension

function DOMtoString(document_root) {
var html = document_root.documentElement.outerHTML;
var name = html.match(/<h1 class="pv-top-card-section__name inline t-24 t-black t-normal">(.+)<\/h1>/g);
var name = html.match(/<h1 class="pv-top-card-section__name inline t-24 t-black t-normal">\n(.+)/);
console.log(name);
return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});