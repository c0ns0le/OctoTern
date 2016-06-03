var $ = require("jquery")
var GithubCodeBlock = require("./github-code-block")
var getLinksFromTern = require("./get-links-from-tern")

const DEBUG = true;

init()

function init(){
    $("body").append("<style>" +
        ".octo-tern-definition { background: red; transition: 1s all }" +
        ".octo-tern-definition-selected { background: yellow; box-shadow: 0px 0px 10px yellow;}" +
        ".octo-tern-link {background: lime; cursor: pointer } " +
        ".octo-tern-link:hover {text-decoration: underline} " +
    "</style>")
    processCodeOnPage()
}
window.processCodeOnPage = processCodeOnPage
function processCodeOnPage(){
    time("OctoTern")
    console.profile()

    time("OctoTern Init GithubCodeBlock")
    var codeBlock = new GithubCodeBlock($(".blob-wrapper").first(0))
    timeEnd("OctoTern Init GithubCodeBlock")

    time("OctoTern getLinksFromTern")
    var ternLinks = getLinksFromTern(codeBlock.getCode(), function processTernLinks(ternLinks){
        timeEnd("OctoTern getLinksFromTern")

        time("OctoTern Display links")
        ternLinks.map(function processTernLink(link){
            codeBlock.enforceCleanDomSplitBetween(link.fromStart, link.fromEnd)
            codeBlock.enforceCleanDomSplitBetween(link.toStart, link.toEnd)

            var fromCodeParts = codeBlock.getCodePartsBetween(link.fromStart, link.fromEnd)
            var toCodeParts = codeBlock.getCodePartsBetween(link.toStart, link.toEnd)

            codeBlock.enforceCodePartsUseElementNodes(fromCodeParts)
            codeBlock.enforceCodePartsUseElementNodes(toCodeParts)

            var declarationElements = $(toCodeParts.map((codePart) => codePart.el));

            if (link.isDeclaration) {
                declarationElements.addClass("octo-tern-definition")
            } else {
                fromCodeParts.forEach(function linkifyCodePart(codePart){
                    $(codePart.el).addClass("octo-tern-link")

                    $(codePart.el).click(function(){
                        console.log("toCodeParts", toCodeParts, "link", link)
                        var firstToCodePart = toCodeParts[0]

                        declarationElements.addClass("octo-tern-definition-selected")
                        setTimeout(function(){
                            declarationElements.removeClass("octo-tern-definition-selected")
                        }, 2000)

                        var heightOfTwoLines = 18 * 2;
                        $(document.body).animate({
                            scrollTop: $(firstToCodePart.el).offset().top - heightOfTwoLines
                        });
                    })
                })
            }
        })

        timeEnd("OctoTern Display links")
        timeEnd("OctoTern")

        console.profileEnd()
    })
}

function time(label){
    if (!DEBUG) return
    console.time(label)
}
function timeEnd(label){
    if (!DEBUG) return
    console.timeEnd(label)
}
