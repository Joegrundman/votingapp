// encode spaces, question marks and exclamation marks to make compatible as css selector
function cssEnc(name) {
    if(!name) {return}
    return name.replace(/\s/g, "__sp__").replace(/'/g, "__apos__").replace(/,/g, "__comma__").replace(/\./g, "__stop__").replace(/[\?]/g, "__q__").replace(/[\!]/g, "__ex__")
}

//decodes from css compatibiliity
function cssDec(name) {
    if(!name) {return}
    return name.replace(/__sp__/g, " ").replace(/__apos__/, "'").replace(/__comma__/, ",").replace(/__stop__/, ".").replace(/__q__/g, "?").replace(/__ex__/g, "!")
}

function uriEnc (name) {
    if(!name) {return}
    return encodeURIComponent(cssDec(name))
}