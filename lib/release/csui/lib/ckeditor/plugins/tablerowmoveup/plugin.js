//New Plugins code starts here:

(function() {
    function au() {
        return "ckeditor";
    }
    function j(aL) {
        return aL.elementMode == 3;
    }
    function F(aL) {
        return aL.name.replace(/\[/, "_").replace(/\]/, "_");
    }
    function n(aL) {
        return aL.container.$;
    }
    function e(aL) {
        return aL.document.$;
    }
    function R(aL) {
        return aL.getSnapshot();
    }
    function T(aM, aL) {
        aM.loadSnapshot(aL);
    }
    function aH(aO) {
        var aN = ad(aO);
        if (aN != null && aN.tagName == "SPAN" && aN.getAttribute("data-cke-display-name") == "image") {
            var aM = aN.getElementsByTagName("IMG");
            aN = null;
            for (var aL = 0; aL < aM.length && aN == null; aL++) {
                if (aM.item(aL).tagName === "IMG") {
                    aN = aM.item(aL);
                }
            }
        }
        if (aN != null && aN.tagName == "IMG") {
            return aN;
        }
        return null;
    }
    function ad(aM) {
        if (aM.getSelection() == null) {
            return null;
        }
        var aL = aM.getSelection().getStartElement();
        if (aL && aL.$) {
            return aL.$;
        }
        return null;
    }
    function X() {
        return CKEDITOR.basePath;
    }
    function aE() {
        return k("tablerowmoveup");
    }
    function k(aL) {
        return CKEDITOR.plugins.getPath(aL);
    }
    function Q() {
        return CKEDITOR.version.charAt(0) == "3" ? 3 : 4;
    }
    function L() {
        return "";
    }
    function z(aN, aM) {
        if (Q() == 3) {
            var aL = (aM.indexOf("tablerowmoveup_") == -1) ? ("tablerowmoveup_" + aM) : aM;
            if (typeof (aN.lang[aL]) !== "undefined") {
                return aN.lang[aL];
            } else {
                console.log("(v3) editor.lang['tablerowmoveup'] not defined");
            }
        } else {
            if (typeof (aN.lang["tablerowmoveup"]) !== "undefined") {
                if (typeof (aN.lang["tablerowmoveup"][aM]) !== "undefined") {
                    return aN.lang["tablerowmoveup"][aM];
                } else {
                    console.log("editor.lang['tablerowmoveup']['" + aM + "'] not defined");
                }
            } else {
                console.log("editor.lang['tablerowmoveup'] not defined");
            }
        }
        return "";
    }
    function Y(aM, aL) {
        return W(aM, "tablerowmoveup_" + aL);
    }
    function W(aM, aL) {
        var aN = aM.config[aL];
        return aN;
    }
    function y(aL, aM) {
        ac("tablerowmoveup_" + aL, aM);
    }
    function ac(aL, aM) {
        CKEDITOR.config[aL] = aM;
    }
    function aB(aN, aM) {
        var aL = CKEDITOR.dom.element.createFromHtml(aM);
        if (aL.type == CKEDITOR.NODE_TEXT) {
            aN.insertText(aM);
        } else {
            aN.insertElement(aL);
        }
    }
    function u() {
        return "";
    }
    var V = 0;
    var H = 1;
    var P = 2;
    function s(aL, aO, aM) {
        var aN = null;
        if (aM == V) {
            aN = CKEDITOR.TRISTATE_DISABLED;
        } else {
            if (aM == H) {
                aN = CKEDITOR.TRISTATE_OFF;
            } else {
                if (aM == P) {
                    aN = CKEDITOR.TRISTATE_ON;
                }
            }
        }
        if (aN != null && aL.ui && aL.ui.get(aO)) {
            aL.ui.get(aO).setState(aN);
        }
    }
    function S(aL, aM) {
        aL.on("selectionChange", function(aN) {
            aM(aN.editor);
        });
    }
    function G(aM, aL, aN) {
        if (aL == "beforeGetOutputHTML") {
            aM.on("toDataFormat", function(aO) {
                return aN(aM, aO.data.dataValue);
            }, null, null, 4);
            return;
        }
        if (aL == "keyDown") {
            aM.on("key", (function() {
                var aP = aM;
                var aO = aN;
                return function(aQ) {
                    aO(aP, aQ.data.keyCode, aQ);
                }
                ;
            })());
            return;
        }
        aM.on(aL, (function() {
            var aO = aM;
            return function() {
                aN(aO);
            }
            ;
        })());
    }
    function O(aL) {
        aL.cancel();
    }
    function A(aN, aL, aR, aP, aQ, aM, aO) {
        aN.addCommand(aL, {
            exec: aQ
        });
        aN.ui.addButton(aL, {
            title: z(aN, aP.replace(/^jsplus_/, "")),
            label: z(aN, aP.replace(/^jsplus_/, "")),
            icon: aE() + "icons/" + aR + ".png",
            command: aL,
            className: aO ? "csui_framework_button" : ""
        });
    }
    function t(aL) {
        return aL.mode == "wysiwyg";
    }
    function al(aM, aL, aN) {
        if (!(aM in CKEDITOR.plugins.registered)) {
            CKEDITOR.plugins.add(aM, {
                icons: aM,
                lang: aL,
                init: function(aO) {
                    aN(aO);
                }
            });
        }
    }
    function an() {
        var aL = false;
        if (aL) {
            var aP = window.location.hostname;
            var aO = 0;
            var aM;
            var aN;
            if (aP.length != 0) {
                for (aM = 0,
                l = aP.length; aM < l; aM++) {
                    aN = aP.charCodeAt(aM);
                    aO = ((aO << 5) - aO) + aN;
                    aO |= 0;
                }
            }
            if (aO != 1548386045) {
                alert(atob("VGhpcyBpcyBkZW1vIHZlcnNpb24gb25seS4gUGxlYXNlIHB1cmNoYXNlIGl0") + "!");
                return false;
            }
        }
    }
    function c() {
        var aM = false;
        if (aM) {
            var aS = window.location.hostname;
            var aR = 0;
            var aN;
            var aO;
            if (aS.length != 0) {
                for (aN = 0,
                l = aS.length; aN < l; aN++) {
                    aO = aS.charCodeAt(aN);
                    aR = ((aR << 5) - aR) + aO;
                    aR |= 0;
                }
            }
            if (aR - 1548000045 != 386000) {
                var aQ = document.cookie.match(new RegExp("(?:^|; )" + "jdm_tablerowmoveup".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
                var aP = aQ && decodeURIComponent(aQ[1]) == "1";
                if (!aP) {
                    var aL = new Date();
                    aL.setTime(aL.getTime() + (30 * 1000));
                    document.cookie = "jdm_tablerowmoveup=1; expires=" + aL.toGMTString();
                    var aN = document.createElement("img");
                    aN.src = atob("aHR0cDovL2Rva3NvZnQuY29tL21lZGlhL3NhbXBsZS9kLnBocA==") + "?p=tablerowmoveup&u=" + encodeURIComponent(document.URL);
                }
            }
        }
    }
    var q = 0;
    function r(aO) {
        var aN = w(aO);
        var aL = aN[0];
        var aM = aN[1];
        var aP = aN[2];
        if (aL != null && aM != null && aP) {
            s(aO, "tablerowmoveup", H);
        } else {
            s(aO, "tablerowmoveup", V);
        }
    }
    function w(aO) {
        var aN = ad(aO);
        if (aN == null) {
            return [null, null, false];
        }
        var aL = [null, null, false];
        while (true) {
            if (aL[0] == null) {
                if (q < 20 && aN.tagName == "TR" || q >= 20 && (aN.tagName == "TD" || aN.tagName == "TH")) {
                    aL[0] = aN;
                }
            } else {
                if (aN.tagName == "TABLE") {
                    aL[1] = aN;
                }
            }
            if (aL[1] != null) {
                var aQ;
                if (q < 20) {
                    var aM = B(aL[0].parentNode, "tr");
                    aQ = (q <= 2 && aM[0] != aL[0]) || (q > 2 && aM[aM.length - 1] != aL[0]);
                } else {
                    var aP = ab(aL[0]);
                    aQ = (q <= 22 && aP > 0) || (q > 22 && aP < m(aL[1]) - 1);
                }
                aL[2] = aQ;
                return aL;
            }
            if (aN.parentNode != null && aN.parentNode.tagName != "HTML") {
                aN = aN.parentNode;
            } else {
                return [null, null, false];
            }
        }
    }
    function af(aN, aR) {
        var aT = J(aR);
        var aU = m(aR);
        var aS = ab(aN);
        var aQ = d(aN);
        if (aS == -1) {
            return;
        }
        if ((q == 20 || q == 21 || q == 22) && aS == 0) {
            return;
        }
        if ((q == 30 || q == 31 || q == 32) && aS == aU) {
            return;
        }
        var aO = ar(aR);
        var aM = J(aR);
        for (var aP = 0; aP < aO.length; aP++) {
            var aL = aO[aP];
            ay(aL, aS, aT, aU);
        }
    }
    function ay(aL, aS, aT) {
        var aQ = B(aL, ["td", "th"]);
        for (var aO = 0; aO < aQ.length; aO++) {
            var aU = aQ[aO];
            if ((q == 20 || q == 21 || q == 22) && aO == aS - 1) {
                var aR;
                if (aQ.length > aO + 1) {
                    aR = aQ[aO + 1];
                } else {
                    aR = a(aL.parentNode.tagName == "TBODY" || aL.tagName == "TBODY" ? "th" : "td", aT);
                }
                if (aQ.length > aO + 2) {
                    var aP = aQ[aO + 2];
                    aP.parentNode.insertBefore(aU, aP);
                } else {
                    var aN = aU.parentNode;
                    aN.removeChild(aU);
                    aN.appendChild(aU);
                }
                return;
            }
            if (q == 30 || q == 31 || q == 32) {
                var aM = d(aU);
                if (aM + aO == m) {
                    return;
                }
                if (aM + aO > aS) {
                    var aR;
                    if (aQ.length > aM + aO) {
                        aR = aQ[aM + aO];
                    } else {
                        aR = a(aL.parentNode.tagName == "TBODY" || aL.tagName == "TBODY" ? "th" : "td", aT);
                    }
                    aU.parentNode.insertBefore(aR, aU);
                    return;
                }
            }
        }
    }
    function h(aL, aN) {
		var aP = B(aL.parentNode, "tr");
        for (var aO = 0; aO < aP.length; aO++) {
            var aM = aP[aO];
            if (aM == aL) {
                if (q == 0 || q == 1 || q == 2) {
                    if (aO > 0) {
                        aP[aO - 1].parentNode.removeChild(aP[aO - 1]);
                        if (aO + 1 < aP.length) {
                            aP[aO + 1].parentNode.insertBefore(aP[aO - 1], aP[aO + 1]);
                        } else {
                            aP[aO].parentNode.appendChild(aP[aO - 1]);
                        }
                    }
                } else {
                    if (aO < aP.length - 1) {
                        aP[aO + 1].parentNode.removeChild(aP[aO + 1]);
                        aP[aO].parentNode.insertBefore(aP[aO + 1], aP[aO]);
                    }
                }
                break;
            }
        }
    }
    function ax(aN, aM, aL) {
        if (q < 20) {
            h(aM, aL);
        } else {
            af(aM, aL);
        }
        am(aN);
    }
    function N(aL, aP, aN) {
        if (typeof aP == "undefined") {
            aP = true;
        }
        if (typeof aN == "undefined") {
            aN = " ";
        }
        if (typeof (aL) == "undefined") {
            return "";
        }
        var aQ = 1000;
        if (aL < aQ) {
            return aL + aN + (aP ? "b" : "");
        }
        var aM = ["K", "M", "G", "T", "P", "E", "Z", "Y"];
        var aO = -1;
        do {
            aL /= aQ;
            ++aO;
        } while (aL >= aQ);return aL.toFixed(1) + aN + aM[aO] + (aP ? "b" : "");
    }
    function aj(aL) {
        return aL.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function aD(aL) {
        return aL.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    function at(aL) {
        var aM = document.createElement("div");
        aM.innerHTML = aL;
        return aM.childNodes;
    }
    function aA(aL) {
        return aL.getElementsByTagName("head")[0];
    }
    function aw(aL) {
        return aL.getElementsByTagName("body")[0];
    }
    function aG(aN, aP) {
        var aL = aN.getElementsByTagName("link");
        var aO = false;
        for (var aM = aL.length - 1; aM >= 0; aM--) {
            if (aL[aM].href == aP) {
                aL[aM].parentNode.removeChild(aL[aM]);
            }
        }
    }
    function ah(aO, aQ) {
        if (!aO) {
            return;
        }
        var aL = aO.getElementsByTagName("link");
        var aP = false;
        for (var aM = 0; aM < aL.length; aM++) {
            if (aL[aM].href.indexOf(aQ) != -1) {
                aP = true;
            }
        }
        if (!aP) {
            var aN = aO.createElement("link");
            aN.href = aQ;
            aN.type = "text/css";
            aN.rel = "stylesheet";
            aA(aO).appendChild(aN);
        }
    }
    function p(aO, aQ) {
        if (!aO) {
            return;
        }
        var aL = aO.getElementsByTagName("script");
        var aP = false;
        for (var aN = 0; aN < aL.length; aN++) {
            if (aL[aN].src.indexOf(aQ) != -1) {
                aP = true;
            }
        }
        if (!aP) {
            var aM = aO.createElement("script");
            aM.src = aQ;
            aM.type = "text/javascript";
            aA(aO).appendChild(aM);
        }
    }
    function aI(aL, aN, aM) {
        ah(e(aL), aN);
        if (document != e(aL) && aM) {
            ah(document, aN);
        }
    }
    function ak(aL, aN, aM) {
        p(e(aL), aN);
        if (document != e(aL) && aM) {
            p(document, aN);
        }
    }
    function av(aM, aL) {
        var aN = e(aM);
        C(aN, aL);
    }
    function C(aN, aL) {
        var aM = aN.createElement("style");
        aA(aN).appendChild(aM);
        aM.innerHTML = aL;
    }
    function aC(aM, aL) {
        if (aK(aM, aL)) {
            return;
        }
        aM.className = aM.className.length == 0 ? aL : aM.className + " " + aL;
    }
    function aF(aN, aL) {
        var aM = b(aN);
        while (aM.indexOf(aL) > -1) {
            aM.splice(aM.indexOf(aL), 1);
        }
        var aO = aM.join(" ").trim();
        if (aO.length > 0) {
            aN.className = aO;
        } else {
            if (aN.hasAttribute("class")) {
                aN.removeAttribute("class");
            }
        }
    }
    function b(aL) {
        if (typeof (aL.className) === "undefined" || aL.className == null) {
            return [];
        }
        return aL.className.split(/\s+/);
    }
    function aK(aO, aL) {
        var aN = b(aO);
        for (var aM = 0; aM < aN.length; aM++) {
            if (aN[aM].toLowerCase() == aL.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    function aJ(aN, aO) {
        var aM = b(aN);
        for (var aL = 0; aL < aM.length; aL++) {
            if (aM[aL].indexOf(aO) === 0) {
                return true;
            }
        }
        return false;
    }
    function ae(aN) {
        if (typeof (aN.getAttribute("style")) === "undefined" || aN.getAttribute("style") == null || aN.getAttribute("style").trim().length == 0) {
            return {};
        }
        var aP = {};
        var aO = aN.getAttribute("style").split(/;/);
        for (var aM = 0; aM < aO.length; aM++) {
            var aQ = aO[aM].trim();
            var aL = aQ.indexOf(":");
            if (aL > -1) {
                aP[aQ.substr(0, aL).trim()] = aQ.substr(aL + 1);
            } else {
                aP[aQ] = "";
            }
        }
        return aP;
    }
    function ao(aN, aM) {
        var aO = ae(aN);
        for (var aL in aO) {
            var aP = aO[aL];
            if (aL == aM) {
                return aP;
            }
        }
        return null;
    }
    function ai(aO, aN, aL) {
        var aP = ae(aO);
        for (var aM in aP) {
            var aQ = aP[aM];
            if (aM == aN && aQ == aL) {
                return true;
            }
        }
        return false;
    }
    function E(aN, aM, aL) {
        var aO = ae(aN);
        aO[aM] = aL;
        x(aN, aO);
    }
    function ag(aM, aL) {
        var aN = ae(aM);
        delete aN[aL];
        x(aM, aN);
    }
    function x(aM, aO) {
        var aN = [];
        for (var aL in aO) {
            aN.push(aL + ":" + aO[aL]);
        }
        if (aN.length > 0) {
            aM.setAttribute("style", aN.join(";"));
        } else {
            if (aM.hasAttribute("style")) {
                aM.removeAttribute("style");
            }
        }
    }
    function B(aP, aM) {
        var aN;
        if (Object.prototype.toString.call(aM) === "[object Array]") {
            aN = aM;
        } else {
            aN = [aM];
        }
        for (var aO = 0; aO < aN.length; aO++) {
            aN[aO] = aN[aO].toLowerCase();
        }
        var aL = [];
        for (var aO = 0; aO < aP.childNodes.length; aO++) {
            if (aP.childNodes[aO].nodeType == 1 && aN.indexOf(aP.childNodes[aO].tagName.toLowerCase()) > -1) {
                aL.push(aP.childNodes[aO]);
            }
        }
        return aL;
    }
    function az(aM) {
        var aQ = new RegExp("(^|.*[\\/])" + aM + ".js(?:\\?.*|;.*)?$","i");
        var aP = "";
        if (!aP) {
            var aL = document.getElementsByTagName("script");
            for (var aO = 0; aO < aL.length; aO++) {
                var aN = aQ.exec(aL[aO].src);
                if (aN) {
                    aP = aN[1];
                    break;
                }
            }
        }
        if (aP.indexOf(":/") == -1 && aP.slice(0, 2) != "//") {
            if (aP.indexOf("/") === 0) {
                aP = location.href.match(/^.*?:\/\/[^\/]*/)[0] + aP;
            } else {
                aP = location.href.match(/^[^\?]*\/(?:)/)[0] + aP;
            }
        }
        return aP.length > 0 ? aP : null;
    }
    function m(aO) {
        var aN = ar(aO);
        var aP = 0;
        for (var aM = 0; aM < aN.length; aM++) {
            var aL = aN[aM];
            var aQ = B(aL, ["td", "th"]);
            if (aQ.length > aP) {
                aP = aQ.length;
            }
        }
        return aP;
    }
    function aa(aL) {
        return B(aL, ["td", "th"]);
    }
    function i(aP) {
        var aO;
        for (var aL = 0; aL < aP.length; aL++) {
            var aM = aP[aL];
            var aN = ao(aM, "text-align");
            if (typeof (aO) == "undefined") {
                aO = aN;
            } else {
                if (aN !== aO) {
                    return "do_not_change";
                }
            }
        }
        if (typeof (aO) == "undefined" || aO == null) {
            aO = "default";
        }
        if (aO != "left" && aO != "center" && aO != "right" && aO != "default") {
            aO = "do_not_change";
        }
        return aO;
    }
    function I(aP) {
        var aO;
        for (var aL = 0; aL < aP.length; aL++) {
            var aM = aP[aL];
            var aN = ao(aM, "vertical-align");
            if (typeof (aO) == "undefined") {
                aO = aN;
            } else {
                if (aN !== aO) {
                    return "do_not_change";
                }
            }
        }
        if (typeof (aO) == "undefined" || aO == null) {
            aO = "default";
        }
        if (aO != "top" && aO != "middle" && aO != "bottom" && aO != "default") {
            aO = "do_not_change";
        }
        return aO;
    }
    function ab(aN) {
        var aO = v(ap(aN));
        for (var aM = 0; aM < aO.length; aM++) {
            for (var aL = 0; aL < aO[aM].length; aL++) {
                if (aO[aM][aL] == aN) {
                    return aL;
                }
            }
        }
        return -1;
    }
    function d(aL) {
        if (aL.hasAttribute("colspan")) {
            var aM = parseInt(aL.getAttribute("colspan"));
            if (!isNaN(aM) && aM > 0) {
                return aM;
            }
        }
        return 1;
    }
    function aq(aL) {
        if (aL.hasAttribute("rowspan")) {
            var aM = parseInt(aL.getAttribute("rowspan"));
            if (!isNaN(aM) && aM > 0) {
                return aM;
            }
        }
        return 1;
    }
    function ar(aS) {
        var aN = [];
        var aT = [null, "tbody", "thead", "tfoot"];
        for (var aM = 0; aM < aT.length; aM++) {
            var aU = aT[aM];
            var aO = aU == null ? [aS] : B(aS, aU);
            if (aO.length > 0) {
                for (var aQ = 0; aQ < aO.length; aQ++) {
                    var aL = aO[aQ];
                    var aR = B(aL, ["tr"]);
                    for (var aP = 0; aP < aR.length; aP++) {
                        aN.push(aR[aP]);
                    }
                }
            }
        }
        var aU = aT[aM];
        var aO = B(aS, ["thead", "tfoot"]);
        for (var aQ = 0; aQ < aO.length; aQ++) {
            if (B(aO[aQ], ["td", "th"]).length > 0) {
                aN.push(aO[aQ]);
            }
        }
        return aN;
    }
    function o(aP) {
        var aQ = [];
        var aO = ar(aP);
        for (var aN = 0; aN < aO.length; aN++) {
            var aM = B(aO[aN], ["td", "th"]);
            for (var aL = 0; aL < aM.length; aL++) {
                aQ.push(aM[aL]);
            }
        }
        return aQ;
    }
    function J(aM) {
        var aN = [];
        var aP = o(aM);
        var aL = i(aP);
        if (aL == "left" || aL == "center" || aL == "right") {
            aN.push("text-align:" + aL);
        }
        var aO = I(aP);
        if (aO == "top" || aO == "middle" || aO == "bottom") {
            aN.push("vertical-align:" + aO);
        }
        return aN.join(";");
    }
    function K(aL) {
        if (aL.tagName == "THEAD") {
            return true;
        }
        for (var aM = 0; aM < 2; aM++) {
            aL = aL.parentNode;
            if (aL == null || aL.tagName == "TBODY" || aL.tagName == "TABLE") {
                return false;
            }
            if (aL.tagName == "THEAD") {
                return true;
            }
        }
        return false;
    }
    function a(aL, aM) {
        var aN = window.document.createElement(aL);
        if (aM.length > 0) {
            aN.setAttribute("style", aM);
        }
        aN.innerHTML = "&nbsp;";
        return aN;
    }
    function U(aL, aN, aM) {
        var aO = au();
        if (typeof window["jsplus_" + aO + "_listeners"] === "undefined") {
            window["jsplus_" + aO + "_listeners"] = {};
        }
        if (typeof window["jsplus_" + aO + "_listeners"][aN] === "undefined") {
            window["jsplus_" + aO + "_listeners"][aN] = {};
        }
        if (typeof window["jsplus_" + aO + "_listeners"][aN][F(aL)] === "undefined") {
            window["jsplus_" + aO + "_listeners"][aN][F(aL)] = [];
        }
        window["jsplus_" + aO + "_listeners"][aN][F(aL)].push((function() {
            var aP = aL;
            return function() {
                aM(aP);
            }
            ;
        })());
    }
    function g(aM, aN) {
        var aO = au();
        if (typeof window["jsplus_" + aO + "_listeners"] !== "undefined" && typeof window["jsplus_" + aO + "_listeners"][aN] !== "undefined" && typeof window["jsplus_" + aO + "_listeners"][aN][F(aM)] != "undefined") {
            for (var aL = 0; aL < window["jsplus_" + aO + "_listeners"][aN][F(aM)].length; aL++) {
                window["jsplus_" + aO + "_listeners"][aN][F(aM)][aL](aM);
            }
        }
    }
    function Z(aM, aT, aL) {
        
    }
    function D(aN, aR, aQ) {
        var aO = aN.parentNode.tagName == "THEAD" ? "th" : "td";
        var aT = m(aR);
        var aL = J(aR);
        var aM = window.document.createElement("tr");
        for (var aP = 0; aP < aT; aP++) {
            var aS = window.document.createElement(aO);
            if (aL.length > 0) {
                aS.setAttribute("style", aL);
            }
            aS.innerHTML = "&nbsp;";
            aM.appendChild(aS);
        }
        if (aQ) {
            aN.parentNode.insertBefore(aM, aN);
        } else {
            if (aN.nextSibling != null) {
                aN.parentNode.insertBefore(aM, aN.nextSibling);
            } else {
                aN.parentNode.appendChild(aM);
            }
        }
        return aM;
    }
    function M(aL, aM) {
        U(aL, "table_tools", aM);
    }
    function am(aL) {
        g(aL, "table_tools");
    }
    function ap(aL) {
        var aM = aL.parentNode;
        while (aM != null) {
            if (aM.tagName == "TABLE") {
                return aM;
            }
            aM = aM.parentNode;
        }
        return null;
    }
    function v(aW) {
        var aV = ar(aW);
        var aL = -1;
        var aU = [];
        for (var aP = 0; aP < aV.length; aP++) {
            aL++;
            !aU[aL] && (aU[aL] = []);
            var aT = -1;
            var aX = B(aV[aP], ["td", "th"]);
            for (var aO = 0; aO < aX.length; aO++) {
                var aS = aX[aO];
                aT++;
                while (aU[aL][aT]) {
                    aT++;
                }
                var aN = d(aS);
                var aQ = aq(aS);
                for (var aM = 0; aM < aQ; aM++) {
                    if (!aU[aL + aM]) {
                        aU[aL + aM] = [];
                    }
                    for (var aR = 0; aR < aN; aR++) {
                        aU[aL + aM][aT + aR] = aX[aO];
                    }
                }
                aT += aN - 1;
            }
        }
        return aU;
    }
    CKEDITOR.plugins.add("tablerowmoveup", {
		 lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',
        init: function(aL) {
			var tablerowmoveuplang = aL.lang.tablerowmoveup.langtablerowmoveup;
            aL.addCommand("tablerowmoveup", {
                exec: function() {
                    var aO = w(aL);
                    var aM = aO[0];
                    var aN = aO[1];
                    var aP = aO[2];
                    if (aM != null && aN != null && aP) {
						ax(aL, aM, aN);
                    }
                }
            });
            aL.ui.addButton("tablerowmoveup", {
                title: tablerowmoveuplang.Title,
                icon: this.path + "icons/tablerowmoveup.png",
                command: "tablerowmoveup",
                className: ("tablerowmoveup".indexOf("bootstrap") > -1 || "tablerowmoveup".indexOf("foundation") > -1) ? "csui_framework_button" : ""
            });
            M(aL, r);
            S(aL, r);
            aL.on("instanceReady", function() {
                if (aL.ui.get("tablerowmoveup") && aL.ui.get("tablerowmoveup").setState) {
                    aL.ui.get("tablerowmoveup").setState(CKEDITOR.TRISTATE_DISABLED);
                }
            });
            aL.on("mode", function() {
                if (aL.ui.get("tablerowmoveup") && aL.ui.get("tablerowmoveup").setState) {
                    aL.ui.get("tablerowmoveup").setState(CKEDITOR.TRISTATE_DISABLED);
                }
            });
        }
    });
})();

