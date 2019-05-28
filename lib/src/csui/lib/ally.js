/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/*! ally.js - v1.4.1 - https://allyjs.io/ - MIT License */
// This customized library was built from https://github.com/prantlf/ally.js/tree/1.4.1-readonly.

// [OT] Modifications done:
//
// * Replace UMD with csui AMD at the top and bottom of the file.
// * Rename the local "define" fuunction to "localDefine" to prevent r.js from
//   namespacing it to "csui.define".
// * Include only the "get", "is" and "query" APIs.
// * Remove the noConflict method.

// [OT] Declare a csui module
define([], function () {

    // [OT] Rename the local "define" function to "localDefine" to prevent
    //      r.js from namespacing it to "csui.define".
    var localDefine, module, exports;
    var ally_js = function() {
        function r(e, n, t) {
            function o(i, f) {
                if (!n[i]) {
                    if (!e[i]) {
                        var c = "function" == typeof require && require;
                        if (!f && c) return c(i, !0);
                        if (u) return u(i, !0);
                        var a = new Error("Cannot find module '" + i + "'");
                        throw a.code = "MODULE_NOT_FOUND", a;
                    }
                    var p = n[i] = {
                        exports: {}
                    };
                    e[i][0].call(p.exports, function(r) {
                        var n = e[i][1][r];
                        return o(n || r);
                    }, p, p.exports, r, e, n, t);
                }
                return n[i].exports;
            }
            for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
            return o;
        }
        return r;
    }()({
        1: [ function(require, module, exports) {
            "use strict";
            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _interopDefault(ex) {
                return ex && (typeof ex === "undefined" ? "undefined" : _typeof(ex)) === "object" && "default" in ex ? ex["default"] : ex;
            }
            var _platform = _interopDefault(require("platform"));
            var cssEscape = _interopDefault(require("css.escape"));
            var getDocument = function getDocument(node) {
                if (!node) {
                    return document;
                }
                if (node.nodeType === Node.DOCUMENT_NODE) {
                    return node;
                }
                return node.ownerDocument || document;
            };
            var activeElement = function activeElement() {
                var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref.context;
                var _document = getDocument(context);
                var activeElement = void 0;
                try {
                    activeElement = _document.activeElement;
                } catch (e) {}
                if (!activeElement || !activeElement.nodeType) {
                    activeElement = _document.body || _document.documentElement;
                }
                return activeElement;
            };
            var nodeArray = function nodeArray(input) {
                if (!input) {
                    return [];
                }
                if (Array.isArray(input)) {
                    return input;
                }
                if (input.nodeType !== undefined) {
                    return [ input ];
                }
                if (typeof input === "string") {
                    input = document.querySelectorAll(input);
                }
                if (input.length !== undefined) {
                    return [].slice.call(input, 0);
                }
                throw new TypeError("unexpected input " + String(input));
            };
            var contextToElement = function contextToElement(_ref2) {
                var context = _ref2.context, _ref2$label = _ref2.label, label = _ref2$label === undefined ? "context-to-element" : _ref2$label, resolveDocument = _ref2.resolveDocument, defaultToDocument = _ref2.defaultToDocument;
                var element = nodeArray(context)[0];
                if (resolveDocument && element && element.nodeType === Node.DOCUMENT_NODE) {
                    element = element.documentElement;
                }
                if (!element && defaultToDocument) {
                    return document.documentElement;
                }
                if (!element) {
                    throw new TypeError(label + " requires valid options.context");
                }
                if (element.nodeType !== Node.ELEMENT_NODE && element.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                    throw new TypeError(label + " requires options.context to be an Element");
                }
                return element;
            };
            var getShadowHost = function getShadowHost() {
                var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref3.context;
                var element = contextToElement({
                    label: "get/shadow-host",
                    context: context
                });
                var container = null;
                while (element) {
                    container = element;
                    element = element.parentNode;
                }
                if (container.nodeType === container.DOCUMENT_FRAGMENT_NODE && container.host) {
                    return container.host;
                }
                return null;
            };
            var shadowed = function shadowed(context) {
                var element = contextToElement({
                    label: "is/shadowed",
                    resolveDocument: true,
                    context: context
                });
                return Boolean(getShadowHost({
                    context: element
                }));
            };
            var getShadowHostParents = function getShadowHostParents() {
                var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref4.context;
                var list = [];
                var element = contextToElement({
                    label: "get/shadow-host-parents",
                    context: context
                });
                while (element) {
                    element = getShadowHost({
                        context: element
                    });
                    if (!element) {
                        break;
                    }
                    list.push(element);
                }
                return list;
            };
            function walkToShadowedElement() {
                var list = [ document.activeElement ];
                while (list[0] && list[0].shadowRoot) {
                    list.unshift(list[0].shadowRoot.activeElement);
                }
                return list;
            }
            function walkFromShadowedElement() {
                var hosts = getShadowHostParents({
                    context: document.activeElement
                });
                return [ document.activeElement ].concat(hosts);
            }
            var activeElements = function activeElements() {
                if (document.activeElement === null) {
                    document.body.focus();
                }
                if (shadowed(document.activeElement)) {
                    return walkFromShadowedElement();
                }
                return walkToShadowedElement();
            };
            var getParents = function getParents() {
                var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref5.context;
                var list = [];
                var element = contextToElement({
                    label: "get/parents",
                    context: context
                });
                while (element) {
                    list.push(element);
                    element = element.parentNode;
                    if (element && element.nodeType !== Node.ELEMENT_NODE) {
                        element = null;
                    }
                }
                return list;
            };
            var names = [ "matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector" ];
            var name = null;
            function findMethodName(element) {
                names.some(function(_name) {
                    if (!element[_name]) {
                        return false;
                    }
                    name = _name;
                    return true;
                });
            }
            function elementMatches(element, selector) {
                if (!name) {
                    findMethodName(element);
                }
                return element[name](selector);
            }
            var platform = JSON.parse(JSON.stringify(_platform));
            var os = platform.os.family || "";
            var ANDROID = os === "Android";
            var WINDOWS = os.slice(0, 7) === "Windows";
            var OSX = os === "OS X";
            var IOS = os === "iOS";
            var BLINK = platform.layout === "Blink";
            var GECKO = platform.layout === "Gecko";
            var TRIDENT = platform.layout === "Trident";
            var EDGE = platform.layout === "EdgeHTML";
            var WEBKIT = platform.layout === "WebKit";
            var version = parseFloat(platform.version);
            var majorVersion = Math.floor(version);
            platform.majorVersion = majorVersion;
            platform.is = {
                ANDROID: ANDROID,
                WINDOWS: WINDOWS,
                OSX: OSX,
                IOS: IOS,
                BLINK: BLINK,
                GECKO: GECKO,
                TRIDENT: TRIDENT,
                EDGE: EDGE,
                WEBKIT: WEBKIT,
                IE9: TRIDENT && majorVersion === 9,
                IE10: TRIDENT && majorVersion === 10,
                IE11: TRIDENT && majorVersion === 11
            };
            function before() {
                var data = {
                    activeElement: document.activeElement,
                    windowScrollTop: window.scrollTop,
                    windowScrollLeft: window.scrollLeft,
                    bodyScrollTop: document.body.scrollTop,
                    bodyScrollLeft: document.body.scrollLeft
                };
                var iframe = document.createElement("iframe");
                iframe.setAttribute("style", "position:absolute; position:fixed; top:0; left:-2px; width:1px; height:1px; overflow:hidden;");
                iframe.setAttribute("aria-live", "off");
                iframe.setAttribute("aria-busy", "true");
                iframe.setAttribute("aria-hidden", "true");
                document.body.appendChild(iframe);
                var _window = iframe.contentWindow;
                var _document = _window.document;
                _document.open();
                _document.close();
                var wrapper = _document.createElement("div");
                _document.body.appendChild(wrapper);
                data.iframe = iframe;
                data.wrapper = wrapper;
                data.window = _window;
                data.document = _document;
                return data;
            }
            function test(data, options) {
                data.wrapper.innerHTML = "";
                var element = typeof options.element === "string" ? data.document.createElement(options.element) : options.element(data.wrapper, data.document);
                var focus = options.mutate && options.mutate(element, data.wrapper, data.document);
                if (!focus && focus !== false) {
                    focus = element;
                }
                !element.parentNode && data.wrapper.appendChild(element);
                focus && focus.focus && focus.focus();
                return options.validate ? options.validate(element, focus, data.document) : data.document.activeElement === focus;
            }
            function after(data) {
                if (data.activeElement === document.body) {
                    document.activeElement && document.activeElement.blur && document.activeElement.blur();
                    if (platform.is.IE10) {
                        document.body.focus();
                    }
                } else {
                    data.activeElement && data.activeElement.focus && data.activeElement.focus();
                }
                document.body.removeChild(data.iframe);
                window.scrollTop = data.windowScrollTop;
                window.scrollLeft = data.windowScrollLeft;
                document.body.scrollTop = data.bodyScrollTop;
                document.body.scrollLeft = data.bodyScrollLeft;
            }
            var detectFocus = function detectFocus(tests) {
                var data = before();
                var results = {};
                Object.keys(tests).map(function(key) {
                    results[key] = test(data, tests[key]);
                });
                after(data);
                return results;
            };
            var version$1 = "1.4.1";
            function readLocalStorage(key) {
                var data = void 0;
                try {
                    data = window.localStorage && window.localStorage.getItem(key);
                    data = data ? JSON.parse(data) : {};
                } catch (e) {
                    data = {};
                }
                return data;
            }
            function writeLocalStorage(key, value) {
                if (!document.hasFocus()) {
                    try {
                        window.localStorage && window.localStorage.removeItem(key);
                    } catch (e) {}
                    return;
                }
                try {
                    window.localStorage && window.localStorage.setItem(key, JSON.stringify(value));
                } catch (e) {}
            }
            var userAgent = typeof window !== "undefined" && window.navigator.userAgent || "";
            var cacheKey = "ally-supports-cache";
            var cache = readLocalStorage(cacheKey);
            if (cache.userAgent !== userAgent || cache.version !== version$1) {
                cache = {};
            }
            cache.userAgent = userAgent;
            cache.version = version$1;
            var cache$1 = {
                get: function get() {
                    return cache;
                },
                set: function set(values) {
                    Object.keys(values).forEach(function(key) {
                        cache[key] = values[key];
                    });
                    cache.time = new Date().toISOString();
                    writeLocalStorage(cacheKey, cache);
                }
            };
            var cssShadowPiercingDeepCombinator = function cssShadowPiercingDeepCombinator() {
                var combinator = void 0;
                try {
                    document.querySelector("html >>> :first-child");
                    combinator = ">>>";
                } catch (noArrowArrowArrow) {
                    try {
                        document.querySelector("html /deep/ :first-child");
                        combinator = "/deep/";
                    } catch (noDeep) {
                        combinator = "";
                    }
                }
                return combinator;
            };
            var gif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            var focusAreaImgTabindex = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = '<map name="image-map-tabindex-test">' + '<area shape="rect" coords="63,19,144,45"></map>' + '<img usemap="#image-map-tabindex-test" tabindex="-1" alt="" src="' + gif + '">';
                    return element.querySelector("area");
                }
            };
            var focusAreaTabindex = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = '<map name="image-map-tabindex-test">' + '<area href="#void" tabindex="-1" shape="rect" coords="63,19,144,45"></map>' + '<img usemap="#image-map-tabindex-test" alt="" src="' + gif + '">';
                    return false;
                },
                validate: function validate(element, focusTarget, _document) {
                    if (platform.is.GECKO) {
                        return true;
                    }
                    var focus = element.querySelector("area");
                    focus.focus();
                    return _document.activeElement === focus;
                }
            };
            var focusAreaWithoutHref = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = '<map name="image-map-area-href-test">' + '<area shape="rect" coords="63,19,144,45"></map>' + '<img usemap="#image-map-area-href-test" alt="" src="' + gif + '">';
                    return element.querySelector("area");
                },
                validate: function validate(element, focusTarget, _document) {
                    if (platform.is.GECKO) {
                        return true;
                    }
                    return _document.activeElement === focusTarget;
                }
            };
            var focusAudioWithoutControls = {
                name: "can-focus-audio-without-controls",
                element: "audio",
                mutate: function mutate(element) {
                    try {
                        element.setAttribute("src", gif);
                    } catch (e) {}
                }
            };
            var invalidGif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ";
            var focusBrokenImageMap = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = '<map name="broken-image-map-test"><area href="#void" shape="rect" coords="63,19,144,45"></map>' + '<img usemap="#broken-image-map-test" alt="" src="' + invalidGif + '">';
                    return element.querySelector("area");
                }
            };
            var focusChildrenOfFocusableFlexbox = {
                element: "div",
                mutate: function mutate(element) {
                    element.setAttribute("tabindex", "-1");
                    element.setAttribute("style", "display: -webkit-flex; display: -ms-flexbox; display: flex;");
                    element.innerHTML = '<span style="display: block;">hello</span>';
                    return element.querySelector("span");
                }
            };
            var focusFieldsetDisabled = {
                element: "fieldset",
                mutate: function mutate(element) {
                    element.setAttribute("tabindex", 0);
                    element.setAttribute("disabled", "disabled");
                }
            };
            var focusFieldset = {
                element: "fieldset",
                mutate: function mutate(element) {
                    element.innerHTML = "<legend>legend</legend><p>content</p>";
                }
            };
            var focusFlexboxContainer = {
                element: "span",
                mutate: function mutate(element) {
                    element.setAttribute("style", "display: -webkit-flex; display: -ms-flexbox; display: flex;");
                    element.innerHTML = '<span style="display: block;">hello</span>';
                }
            };
            var focusFormDisabled = {
                element: "form",
                mutate: function mutate(element) {
                    element.setAttribute("tabindex", 0);
                    element.setAttribute("disabled", "disabled");
                }
            };
            var focusImgIsmap = {
                element: "a",
                mutate: function mutate(element) {
                    element.href = "#void";
                    element.innerHTML = '<img ismap src="' + gif + '" alt="">';
                    return element.querySelector("img");
                }
            };
            var focusImgUsemapTabindex = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = '<map name="image-map-tabindex-test"><area href="#void" shape="rect" coords="63,19,144,45"></map>' + '<img usemap="#image-map-tabindex-test" tabindex="-1" alt="" ' + 'src="' + gif + '">';
                    return element.querySelector("img");
                }
            };
            var focusInHiddenIframe = {
                element: function element(wrapper, _document) {
                    var iframe = _document.createElement("iframe");
                    wrapper.appendChild(iframe);
                    var iframeDocument = iframe.contentWindow.document;
                    iframeDocument.open();
                    iframeDocument.close();
                    return iframe;
                },
                mutate: function mutate(iframe) {
                    iframe.style.visibility = "hidden";
                    var iframeDocument = iframe.contentWindow.document;
                    var input = iframeDocument.createElement("input");
                    iframeDocument.body.appendChild(input);
                    return input;
                },
                validate: function validate(iframe) {
                    var iframeDocument = iframe.contentWindow.document;
                    var focus = iframeDocument.querySelector("input");
                    return iframeDocument.activeElement === focus;
                }
            };
            var result = !platform.is.WEBKIT;
            var focusInZeroDimensionObject = function focusInZeroDimensionObject() {
                return result;
            };
            var focusInvalidTabindex = {
                element: "div",
                mutate: function mutate(element) {
                    element.setAttribute("tabindex", "invalid-value");
                }
            };
            var focusLabelTabindex = {
                element: "label",
                mutate: function mutate(element) {
                    element.setAttribute("tabindex", "-1");
                },
                validate: function validate(element, focusTarget, _document) {
                    var variableToPreventDeadCodeElimination = element.offsetHeight;
                    element.focus();
                    return _document.activeElement === element;
                }
            };
            var svg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtb" + "G5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBpZD0ic3ZnIj48dGV4dCB4PSIxMCIgeT0iMjAiIGlkPSJ" + "zdmctbGluay10ZXh0Ij50ZXh0PC90ZXh0Pjwvc3ZnPg==";
            var focusObjectSvgHidden = {
                element: "object",
                mutate: function mutate(element) {
                    element.setAttribute("type", "image/svg+xml");
                    element.setAttribute("data", svg);
                    element.setAttribute("width", "200");
                    element.setAttribute("height", "50");
                    element.style.visibility = "hidden";
                }
            };
            var focusObjectSvg = {
                name: "can-focus-object-svg",
                element: "object",
                mutate: function mutate(element) {
                    element.setAttribute("type", "image/svg+xml");
                    element.setAttribute("data", svg);
                    element.setAttribute("width", "200");
                    element.setAttribute("height", "50");
                },
                validate: function validate(element, focusTarget, _document) {
                    if (platform.is.GECKO) {
                        return true;
                    }
                    return _document.activeElement === element;
                }
            };
            var result$1 = !platform.is.IE9;
            var focusObjectSwf = function focusObjectSwf() {
                return result$1;
            };
            var focusRedirectImgUsemap = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = '<map name="focus-redirect-img-usemap"><area href="#void" shape="rect" coords="63,19,144,45"></map>' + '<img usemap="#focus-redirect-img-usemap" alt="" ' + 'src="' + gif + '">';
                    return element.querySelector("img");
                },
                validate: function validate(element, focusTarget, _document) {
                    var target = element.querySelector("area");
                    return _document.activeElement === target;
                }
            };
            var focusRedirectLegend = {
                element: "fieldset",
                mutate: function mutate(element) {
                    element.innerHTML = '<legend>legend</legend><input tabindex="-1"><input tabindex="0">';
                    return false;
                },
                validate: function validate(element, focusTarget, _document) {
                    var focusable = element.querySelector('input[tabindex="-1"]');
                    var tabbable = element.querySelector('input[tabindex="0"]');
                    element.focus();
                    element.querySelector("legend").focus();
                    return _document.activeElement === focusable && "focusable" || _document.activeElement === tabbable && "tabbable" || "";
                }
            };
            var focusScrollBody = {
                element: "div",
                mutate: function mutate(element) {
                    element.setAttribute("style", "width: 100px; height: 50px; overflow: auto;");
                    element.innerHTML = '<div style="width: 500px; height: 40px;">scrollable content</div>';
                    return element.querySelector("div");
                }
            };
            var focusScrollContainerWithoutOverflow = {
                element: "div",
                mutate: function mutate(element) {
                    element.setAttribute("style", "width: 100px; height: 50px;");
                    element.innerHTML = '<div style="width: 500px; height: 40px;">scrollable content</div>';
                }
            };
            var focusScrollContainer = {
                element: "div",
                mutate: function mutate(element) {
                    element.setAttribute("style", "width: 100px; height: 50px; overflow: auto;");
                    element.innerHTML = '<div style="width: 500px; height: 40px;">scrollable content</div>';
                }
            };
            var focusSummary = {
                element: "details",
                mutate: function mutate(element) {
                    element.innerHTML = "<summary>foo</summary><p>content</p>";
                    return element.firstElementChild;
                }
            };
            function makeFocusableForeignObject() {
                var fragment = document.createElement("div");
                fragment.innerHTML = '<svg><foreignObject width="30" height="30">\n      <input type="text"/>\n  </foreignObject></svg>';
                return fragment.firstChild.firstChild;
            }
            var focusSvgForeignObjectHack = function focusSvgForeignObjectHack(element) {
                var isSvgElement = element.ownerSVGElement || element.nodeName.toLowerCase() === "svg";
                if (!isSvgElement) {
                    return false;
                }
                var foreignObject = makeFocusableForeignObject();
                element.appendChild(foreignObject);
                var input = foreignObject.querySelector("input");
                input.focus();
                input.disabled = true;
                element.removeChild(foreignObject);
                return true;
            };
            function generate(element) {
                return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + element + "</svg>";
            }
            function focus(element) {
                if (element.focus) {
                    return;
                }
                try {
                    HTMLElement.prototype.focus.call(element);
                } catch (e) {
                    focusSvgForeignObjectHack(element);
                }
            }
            function validate(element, focusTarget, _document) {
                focus(focusTarget);
                return _document.activeElement === focusTarget;
            }
            var focusSvgFocusableAttribute = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = generate('<text focusable="true">a</text>');
                    return element.querySelector("text");
                },
                validate: validate
            };
            var focusSvgTabindexAttribute = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = generate('<text tabindex="0">a</text>');
                    return element.querySelector("text");
                },
                validate: validate
            };
            var focusSvgNegativeTabindexAttribute = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = generate('<text tabindex="-1">a</text>');
                    return element.querySelector("text");
                },
                validate: validate
            };
            var focusSvgUseTabindex = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = generate([ '<g id="ally-test-target"><a xlink:href="#void"><text>link</text></a></g>', '<use xlink:href="#ally-test-target" x="0" y="0" tabindex="-1" />' ].join(""));
                    return element.querySelector("use");
                },
                validate: validate
            };
            var focusSvgForeignobjectTabindex = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = generate('<foreignObject tabindex="-1"><input type="text" /></foreignObject>');
                    return element.querySelector("foreignObject") || element.getElementsByTagName("foreignObject")[0];
                },
                validate: validate
            };
            var result$2 = Boolean(platform.is.GECKO && typeof SVGElement !== "undefined" && SVGElement.prototype.focus);
            var focusSvgInIframe = function focusSvgInIframe() {
                return result$2;
            };
            var focusSvg = {
                element: "div",
                mutate: function mutate(element) {
                    element.innerHTML = generate("");
                    return element.firstChild;
                },
                validate: validate
            };
            var focusTabindexTrailingCharacters = {
                element: "div",
                mutate: function mutate(element) {
                    element.setAttribute("tabindex", "3x");
                }
            };
            var focusTable = {
                element: "table",
                mutate: function mutate(element, wrapper, _document) {
                    var fragment = _document.createDocumentFragment();
                    fragment.innerHTML = "<tr><td>cell</td></tr>";
                    element.appendChild(fragment);
                }
            };
            var focusVideoWithoutControls = {
                element: "video",
                mutate: function mutate(element) {
                    try {
                        element.setAttribute("src", gif);
                    } catch (e) {}
                }
            };
            var result$3 = platform.is.GECKO || platform.is.TRIDENT || platform.is.EDGE;
            var tabsequenceAreaAtImgPosition = function tabsequenceAreaAtImgPosition() {
                return result$3;
            };
            var testCallbacks = {
                cssShadowPiercingDeepCombinator: cssShadowPiercingDeepCombinator,
                focusInZeroDimensionObject: focusInZeroDimensionObject,
                focusObjectSwf: focusObjectSwf,
                focusSvgInIframe: focusSvgInIframe,
                tabsequenceAreaAtImgPosition: tabsequenceAreaAtImgPosition
            };
            var testDescriptions = {
                focusAreaImgTabindex: focusAreaImgTabindex,
                focusAreaTabindex: focusAreaTabindex,
                focusAreaWithoutHref: focusAreaWithoutHref,
                focusAudioWithoutControls: focusAudioWithoutControls,
                focusBrokenImageMap: focusBrokenImageMap,
                focusChildrenOfFocusableFlexbox: focusChildrenOfFocusableFlexbox,
                focusFieldsetDisabled: focusFieldsetDisabled,
                focusFieldset: focusFieldset,
                focusFlexboxContainer: focusFlexboxContainer,
                focusFormDisabled: focusFormDisabled,
                focusImgIsmap: focusImgIsmap,
                focusImgUsemapTabindex: focusImgUsemapTabindex,
                focusInHiddenIframe: focusInHiddenIframe,
                focusInvalidTabindex: focusInvalidTabindex,
                focusLabelTabindex: focusLabelTabindex,
                focusObjectSvg: focusObjectSvg,
                focusObjectSvgHidden: focusObjectSvgHidden,
                focusRedirectImgUsemap: focusRedirectImgUsemap,
                focusRedirectLegend: focusRedirectLegend,
                focusScrollBody: focusScrollBody,
                focusScrollContainerWithoutOverflow: focusScrollContainerWithoutOverflow,
                focusScrollContainer: focusScrollContainer,
                focusSummary: focusSummary,
                focusSvgFocusableAttribute: focusSvgFocusableAttribute,
                focusSvgTabindexAttribute: focusSvgTabindexAttribute,
                focusSvgNegativeTabindexAttribute: focusSvgNegativeTabindexAttribute,
                focusSvgUseTabindex: focusSvgUseTabindex,
                focusSvgForeignobjectTabindex: focusSvgForeignobjectTabindex,
                focusSvg: focusSvg,
                focusTabindexTrailingCharacters: focusTabindexTrailingCharacters,
                focusTable: focusTable,
                focusVideoWithoutControls: focusVideoWithoutControls
            };
            function executeTests() {
                var results = detectFocus(testDescriptions);
                Object.keys(testCallbacks).forEach(function(key) {
                    results[key] = testCallbacks[key]();
                });
                return results;
            }
            var supportsCache = null;
            var _supports = function _supports() {
                if (supportsCache) {
                    return supportsCache;
                }
                supportsCache = cache$1.get();
                if (!supportsCache.time) {
                    cache$1.set(executeTests());
                    supportsCache = cache$1.get();
                }
                return supportsCache;
            };
            var supports$3 = void 0;
            var validIntegerPatternNoTrailing = /^\s*(-|\+)?[0-9]+\s*$/;
            var validIntegerPatternWithTrailing = /^\s*(-|\+)?[0-9]+.*$/;
            var validTabindex = function validTabindex(context) {
                if (!supports$3) {
                    supports$3 = _supports();
                }
                var validIntegerPattern = supports$3.focusTabindexTrailingCharacters ? validIntegerPatternWithTrailing : validIntegerPatternNoTrailing;
                var element = contextToElement({
                    label: "is/valid-tabindex",
                    resolveDocument: true,
                    context: context
                });
                var hasTabindex = element.hasAttribute("tabindex");
                var hasTabIndex = element.hasAttribute("tabIndex");
                if (!hasTabindex && !hasTabIndex) {
                    return false;
                }
                var isSvgElement = element.ownerSVGElement || element.nodeName.toLowerCase() === "svg";
                if (isSvgElement && !supports$3.focusSvgTabindexAttribute) {
                    return false;
                }
                if (supports$3.focusInvalidTabindex) {
                    return true;
                }
                var tabindex = element.getAttribute(hasTabindex ? "tabindex" : "tabIndex");
                if (tabindex === "-32768") {
                    return false;
                }
                return Boolean(tabindex && validIntegerPattern.test(tabindex));
            };
            var tabindexValue = function tabindexValue(element) {
                if (!validTabindex(element)) {
                    return null;
                }
                var hasTabindex = element.hasAttribute("tabindex");
                var attributeName = hasTabindex ? "tabindex" : "tabIndex";
                var tabindex = parseInt(element.getAttribute(attributeName), 10);
                return isNaN(tabindex) ? -1 : tabindex;
            };
            function isUserModifyWritable(style) {
                var userModify = style.webkitUserModify || "";
                return Boolean(userModify && userModify.indexOf("write") !== -1);
            }
            function hasCssOverflowScroll(style) {
                return [ style.getPropertyValue("overflow"), style.getPropertyValue("overflow-x"), style.getPropertyValue("overflow-y") ].some(function(overflow) {
                    return overflow === "auto" || overflow === "scroll";
                });
            }
            function hasCssDisplayFlex(style) {
                return style.display.indexOf("flex") > -1;
            }
            function isScrollableContainer(element, nodeName, parentNodeName, parentStyle) {
                if (nodeName !== "div" && nodeName !== "span") {
                    return false;
                }
                if (parentNodeName && parentNodeName !== "div" && parentNodeName !== "span" && !hasCssOverflowScroll(parentStyle)) {
                    return false;
                }
                return element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;
            }
            var supports$2 = void 0;
            function isFocusRelevantRules() {
                var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref6.context, _ref6$except = _ref6.except, except = _ref6$except === undefined ? {
                    flexbox: false,
                    scrollable: false,
                    shadow: false
                } : _ref6$except;
                if (!supports$2) {
                    supports$2 = _supports();
                }
                var element = contextToElement({
                    label: "is/focus-relevant",
                    resolveDocument: true,
                    context: context
                });
                if (!except.shadow && element.shadowRoot) {
                    return true;
                }
                var nodeName = element.nodeName.toLowerCase();
                if (nodeName === "input" && element.type === "hidden") {
                    return false;
                }
                if (nodeName === "input" || nodeName === "select" || nodeName === "button" || nodeName === "textarea") {
                    return true;
                }
                if (nodeName === "legend" && supports$2.focusRedirectLegend) {
                    return true;
                }
                if (nodeName === "label") {
                    return true;
                }
                if (nodeName === "area") {
                    return true;
                }
                if (nodeName === "a" && element.hasAttribute("href")) {
                    return true;
                }
                if (nodeName === "object" && element.hasAttribute("usemap")) {
                    return false;
                }
                if (nodeName === "object") {
                    var svgType = element.getAttribute("type");
                    if (!supports$2.focusObjectSvg && svgType === "image/svg+xml") {
                        return false;
                    } else if (!supports$2.focusObjectSwf && svgType === "application/x-shockwave-flash") {
                        return false;
                    }
                }
                if (nodeName === "iframe" || nodeName === "object") {
                    return true;
                }
                if (nodeName === "embed" || nodeName === "keygen") {
                    return true;
                }
                if (element.hasAttribute("contenteditable")) {
                    return true;
                }
                if (nodeName === "audio" && (supports$2.focusAudioWithoutControls || element.hasAttribute("controls"))) {
                    return true;
                }
                if (nodeName === "video" && (supports$2.focusVideoWithoutControls || element.hasAttribute("controls"))) {
                    return true;
                }
                if (supports$2.focusSummary && nodeName === "summary") {
                    return true;
                }
                var validTabindex$$1 = validTabindex(element);
                if (nodeName === "img" && element.hasAttribute("usemap")) {
                    return validTabindex$$1 && supports$2.focusImgUsemapTabindex || supports$2.focusRedirectImgUsemap;
                }
                if (supports$2.focusTable && (nodeName === "table" || nodeName === "td")) {
                    return true;
                }
                if (supports$2.focusFieldset && nodeName === "fieldset") {
                    return true;
                }
                var isSvgElement = nodeName === "svg";
                var isSvgContent = element.ownerSVGElement;
                var focusableAttribute = element.getAttribute("focusable");
                var tabindex = tabindexValue(element);
                if (nodeName === "use" && tabindex !== null && !supports$2.focusSvgUseTabindex) {
                    return false;
                }
                if (nodeName === "foreignobject") {
                    return tabindex !== null && supports$2.focusSvgForeignobjectTabindex;
                }
                if (elementMatches(element, "svg a") && element.hasAttribute("xlink:href")) {
                    return true;
                }
                if ((isSvgElement || isSvgContent) && element.focus && !supports$2.focusSvgNegativeTabindexAttribute && tabindex < 0) {
                    return false;
                }
                if (isSvgElement) {
                    return validTabindex$$1 || supports$2.focusSvg || supports$2.focusSvgInIframe || Boolean(supports$2.focusSvgFocusableAttribute && focusableAttribute && focusableAttribute === "true");
                }
                if (isSvgContent) {
                    if (supports$2.focusSvgTabindexAttribute && validTabindex$$1) {
                        return true;
                    }
                    if (supports$2.focusSvgFocusableAttribute) {
                        return focusableAttribute === "true";
                    }
                }
                if (validTabindex$$1) {
                    return true;
                }
                var style = window.getComputedStyle(element, null);
                if (isUserModifyWritable(style)) {
                    return true;
                }
                if (supports$2.focusImgIsmap && nodeName === "img" && element.hasAttribute("ismap")) {
                    var hasLinkParent = getParents({
                        context: element
                    }).some(function(parent) {
                        return parent.nodeName.toLowerCase() === "a" && parent.hasAttribute("href");
                    });
                    if (hasLinkParent) {
                        return true;
                    }
                }
                if (!except.scrollable && supports$2.focusScrollContainer) {
                    if (supports$2.focusScrollContainerWithoutOverflow) {
                        if (isScrollableContainer(element, nodeName)) {
                            return true;
                        }
                    } else if (hasCssOverflowScroll(style)) {
                        return true;
                    }
                }
                if (!except.flexbox && supports$2.focusFlexboxContainer && hasCssDisplayFlex(style)) {
                    return true;
                }
                var parent = element.parentElement;
                if (!except.scrollable && parent) {
                    var parentNodeName = parent.nodeName.toLowerCase();
                    var parentStyle = window.getComputedStyle(parent, null);
                    if (supports$2.focusScrollBody && isScrollableContainer(parent, nodeName, parentNodeName, parentStyle)) {
                        return true;
                    }
                    if (supports$2.focusChildrenOfFocusableFlexbox) {
                        if (hasCssDisplayFlex(parentStyle)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            isFocusRelevantRules.except = function() {
                var except = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var isFocusRelevant = function isFocusRelevant(context) {
                    return isFocusRelevantRules({
                        context: context,
                        except: except
                    });
                };
                isFocusRelevant.rules = isFocusRelevantRules;
                return isFocusRelevant;
            };
            var isFocusRelevant = isFocusRelevantRules.except({});
            function findIndex(array, callback) {
                if (array.findIndex) {
                    return array.findIndex(callback);
                }
                var length = array.length;
                if (length === 0) {
                    return -1;
                }
                for (var i = 0; i < length; i++) {
                    if (callback(array[i], i, array)) {
                        return i;
                    }
                }
                return -1;
            }
            var getContentDocument = function getContentDocument(node) {
                try {
                    return node.contentDocument || node.contentWindow && node.contentWindow.document || node.getSVGDocument && node.getSVGDocument() || null;
                } catch (e) {
                    return null;
                }
            };
            var getWindow = function getWindow(node) {
                var _document = getDocument(node);
                return _document.defaultView || window;
            };
            var shadowPrefix = void 0;
            var selectInShadows = function selectInShadows(selector) {
                if (typeof shadowPrefix !== "string") {
                    var operator = cssShadowPiercingDeepCombinator();
                    if (operator) {
                        shadowPrefix = ", html " + operator + " ";
                    }
                }
                if (!shadowPrefix) {
                    return selector;
                }
                return selector + shadowPrefix + selector.replace(/\s*,\s*/g, ",").split(",").join(shadowPrefix);
            };
            var selector = void 0;
            function findDocumentHostElement(_window) {
                if (!selector) {
                    selector = selectInShadows("object, iframe");
                }
                if (_window._frameElement !== undefined) {
                    return _window._frameElement;
                }
                _window._frameElement = null;
                var potentialHosts = _window.parent.document.querySelectorAll(selector);
                [].some.call(potentialHosts, function(element) {
                    var _document = getContentDocument(element);
                    if (_document !== _window.document) {
                        return false;
                    }
                    _window._frameElement = element;
                    return true;
                });
                return _window._frameElement;
            }
            function getFrameElement(element) {
                var _window = getWindow(element);
                if (!_window.parent || _window.parent === _window) {
                    return null;
                }
                try {
                    return _window.frameElement || findDocumentHostElement(_window);
                } catch (e) {
                    return null;
                }
            }
            var notRenderedElementsPattern = /^(area)$/;
            function computedStyle(element, property) {
                return window.getComputedStyle(element, null).getPropertyValue(property);
            }
            function notDisplayed(_path) {
                return _path.some(function(element) {
                    return computedStyle(element, "display") === "none";
                });
            }
            function notVisible(_path) {
                var hidden = findIndex(_path, function(element) {
                    var visibility = computedStyle(element, "visibility");
                    return visibility === "hidden" || visibility === "collapse";
                });
                if (hidden === -1) {
                    return false;
                }
                var visible = findIndex(_path, function(element) {
                    return computedStyle(element, "visibility") === "visible";
                });
                if (visible === -1) {
                    return true;
                }
                if (hidden < visible) {
                    return true;
                }
                return false;
            }
            function collapsedParent(_path) {
                var offset = 1;
                if (_path[0].nodeName.toLowerCase() === "summary") {
                    offset = 2;
                }
                return _path.slice(offset).some(function(element) {
                    return element.nodeName.toLowerCase() === "details" && element.open === false;
                });
            }
            function isVisibleRules() {
                var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref7.context, _ref7$except = _ref7.except, except = _ref7$except === undefined ? {
                    notRendered: false,
                    cssDisplay: false,
                    cssVisibility: false,
                    detailsElement: false,
                    browsingContext: false
                } : _ref7$except;
                var element = contextToElement({
                    label: "is/visible",
                    resolveDocument: true,
                    context: context
                });
                var nodeName = element.nodeName.toLowerCase();
                if (!except.notRendered && notRenderedElementsPattern.test(nodeName)) {
                    return true;
                }
                var _path = getParents({
                    context: element
                });
                var isAudioWithoutControls = nodeName === "audio" && !element.hasAttribute("controls");
                if (!except.cssDisplay && notDisplayed(isAudioWithoutControls ? _path.slice(1) : _path)) {
                    return false;
                }
                if (!except.cssVisibility && notVisible(_path)) {
                    return false;
                }
                if (!except.detailsElement && collapsedParent(_path)) {
                    return false;
                }
                if (!except.browsingContext) {
                    var frameElement = getFrameElement(element);
                    var _isVisible = isVisibleRules.except(except);
                    if (frameElement && !_isVisible(frameElement)) {
                        return false;
                    }
                }
                return true;
            }
            isVisibleRules.except = function() {
                var except = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var isVisible = function isVisible(context) {
                    return isVisibleRules({
                        context: context,
                        except: except
                    });
                };
                isVisible.rules = isVisibleRules;
                return isVisible;
            };
            var isVisible = isVisibleRules.except({});
            function getMapByName(name, _document) {
                var map = _document.querySelector('map[name="' + cssEscape(name) + '"]');
                return map || null;
            }
            function getMapOfImage(element) {
                var usemap = element.getAttribute("usemap");
                if (!usemap) {
                    return null;
                }
                var _document = getDocument(element);
                return getMapByName(usemap.slice(1), _document);
            }
            function getImageOfArea(element) {
                var map = element.parentElement;
                if (!map.name || map.nodeName.toLowerCase() !== "map") {
                    return null;
                }
                var _document = getDocument(element);
                return _document.querySelector('img[usemap="#' + cssEscape(map.name) + '"]') || null;
            }
            var supports$4 = void 0;
            var validArea = function validArea(context) {
                if (!supports$4) {
                    supports$4 = _supports();
                }
                var element = contextToElement({
                    label: "is/valid-area",
                    context: context
                });
                var nodeName = element.nodeName.toLowerCase();
                if (nodeName !== "area") {
                    return false;
                }
                var hasTabindex = element.hasAttribute("tabindex");
                if (!supports$4.focusAreaTabindex && hasTabindex) {
                    return false;
                }
                var img = getImageOfArea(element);
                if (!img || !isVisible(img)) {
                    return false;
                }
                if (!supports$4.focusBrokenImageMap && (!img.complete || !img.naturalHeight || img.offsetWidth <= 0 || img.offsetHeight <= 0)) {
                    return false;
                }
                if (!supports$4.focusAreaWithoutHref && !element.href) {
                    return supports$4.focusAreaTabindex && hasTabindex || supports$4.focusAreaImgTabindex && img.hasAttribute("tabindex");
                }
                var childOfInteractive = getParents({
                    context: img
                }).slice(1).some(function(_element) {
                    var name = _element.nodeName.toLowerCase();
                    return name === "button" || name === "a";
                });
                if (childOfInteractive) {
                    return false;
                }
                return true;
            };
            var supports$6 = void 0;
            var disabledElementsPattern = void 0;
            var disabledElements = {
                input: true,
                select: true,
                textarea: true,
                button: true,
                fieldset: true,
                form: true
            };
            var isNativeDisabledSupported = function isNativeDisabledSupported(context) {
                if (!supports$6) {
                    supports$6 = _supports();
                    if (supports$6.focusFieldsetDisabled) {
                        delete disabledElements.fieldset;
                    }
                    if (supports$6.focusFormDisabled) {
                        delete disabledElements.form;
                    }
                    disabledElementsPattern = new RegExp("^(" + Object.keys(disabledElements).join("|") + ")$");
                }
                var element = contextToElement({
                    label: "is/native-disabled-supported",
                    context: context
                });
                var nodeName = element.nodeName.toLowerCase();
                return Boolean(disabledElementsPattern.test(nodeName));
            };
            var supports$5 = void 0;
            function isDisabledFieldset(element) {
                var nodeName = element.nodeName.toLowerCase();
                return nodeName === "fieldset" && element.disabled;
            }
            function isDisabledForm(element) {
                var nodeName = element.nodeName.toLowerCase();
                return nodeName === "form" && element.disabled;
            }
            var disabled = function disabled(context) {
                if (!supports$5) {
                    supports$5 = _supports();
                }
                var element = contextToElement({
                    label: "is/disabled",
                    context: context
                });
                if (element.hasAttribute("data-ally-disabled")) {
                    return true;
                }
                if (!isNativeDisabledSupported(element)) {
                    return false;
                }
                if (element.disabled) {
                    return true;
                }
                var parents = getParents({
                    context: element
                });
                if (parents.some(isDisabledFieldset)) {
                    return true;
                }
                if (!supports$5.focusFormDisabled && parents.some(isDisabledForm)) {
                    return true;
                }
                return false;
            };
            function isOnlyTabbableRules() {
                var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref8.context, _ref8$except = _ref8.except, except = _ref8$except === undefined ? {
                    onlyFocusableBrowsingContext: false,
                    visible: false
                } : _ref8$except;
                var element = contextToElement({
                    label: "is/only-tabbable",
                    resolveDocument: true,
                    context: context
                });
                if (!except.visible && !isVisible(element)) {
                    return false;
                }
                if (!except.onlyFocusableBrowsingContext && (platform.is.GECKO || platform.is.TRIDENT || platform.is.EDGE)) {
                    var frameElement = getFrameElement(element);
                    if (frameElement) {
                        if (tabindexValue(frameElement) < 0) {
                            return false;
                        }
                    }
                }
                var nodeName = element.nodeName.toLowerCase();
                var tabindex = tabindexValue(element);
                if (nodeName === "label" && platform.is.GECKO) {
                    return tabindex !== null && tabindex >= 0;
                }
                if (platform.is.GECKO && element.ownerSVGElement && !element.focus) {
                    if (nodeName === "a" && element.hasAttribute("xlink:href")) {
                        if (platform.is.GECKO) {
                            return true;
                        }
                    }
                }
                return false;
            }
            isOnlyTabbableRules.except = function() {
                var except = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var isOnlyTabbable = function isOnlyTabbable(context) {
                    return isOnlyTabbableRules({
                        context: context,
                        except: except
                    });
                };
                isOnlyTabbable.rules = isOnlyTabbableRules;
                return isOnlyTabbable;
            };
            var isOnlyTabbable = isOnlyTabbableRules.except({});
            var supports$1 = void 0;
            function isOnlyFocusRelevant(element) {
                var nodeName = element.nodeName.toLowerCase();
                if (nodeName === "embed" || nodeName === "keygen") {
                    return true;
                }
                var _tabindex = tabindexValue(element);
                if (element.shadowRoot && _tabindex === null) {
                    return true;
                }
                if (nodeName === "label") {
                    return !supports$1.focusLabelTabindex || _tabindex === null;
                }
                if (nodeName === "legend") {
                    return _tabindex === null;
                }
                if (supports$1.focusSvgFocusableAttribute && (element.ownerSVGElement || nodeName === "svg")) {
                    var focusableAttribute = element.getAttribute("focusable");
                    return focusableAttribute && focusableAttribute === "false";
                }
                if (nodeName === "img" && element.hasAttribute("usemap")) {
                    return _tabindex === null || !supports$1.focusImgUsemapTabindex;
                }
                if (nodeName === "area") {
                    return !validArea(element);
                }
                return false;
            }
            function isFocusableRules() {
                var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref9.context, _ref9$except = _ref9.except, except = _ref9$except === undefined ? {
                    disabled: false,
                    visible: false,
                    onlyTabbable: false
                } : _ref9$except;
                if (!supports$1) {
                    supports$1 = _supports();
                }
                var _isOnlyTabbable = isOnlyTabbable.rules.except({
                    onlyFocusableBrowsingContext: true,
                    visible: except.visible
                });
                var element = contextToElement({
                    label: "is/focusable",
                    resolveDocument: true,
                    context: context
                });
                var focusRelevant = isFocusRelevant.rules({
                    context: element,
                    except: except
                });
                if (!focusRelevant || isOnlyFocusRelevant(element)) {
                    return false;
                }
                if (!except.disabled && disabled(element)) {
                    return false;
                }
                if (!except.onlyTabbable && _isOnlyTabbable(element)) {
                    return false;
                }
                if (!except.visible) {
                    var visibilityOptions = {
                        context: element,
                        except: {}
                    };
                    if (supports$1.focusInHiddenIframe) {
                        visibilityOptions.except.browsingContext = true;
                    }
                    if (supports$1.focusObjectSvgHidden) {
                        var _nodeName2 = element.nodeName.toLowerCase();
                        if (_nodeName2 === "object") {
                            visibilityOptions.except.cssVisibility = true;
                        }
                    }
                    if (!isVisible.rules(visibilityOptions)) {
                        return false;
                    }
                }
                var frameElement = getFrameElement(element);
                if (frameElement) {
                    var _nodeName = frameElement.nodeName.toLowerCase();
                    if (_nodeName === "object" && !supports$1.focusInZeroDimensionObject) {
                        if (!frameElement.offsetWidth || !frameElement.offsetHeight) {
                            return false;
                        }
                    }
                }
                var nodeName = element.nodeName.toLowerCase();
                if (nodeName === "svg" && supports$1.focusSvgInIframe && !frameElement && element.getAttribute("tabindex") === null) {
                    return false;
                }
                return true;
            }
            isFocusableRules.except = function() {
                var except = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var isFocusable = function isFocusable(context) {
                    return isFocusableRules({
                        context: context,
                        except: except
                    });
                };
                isFocusable.rules = isFocusableRules;
                return isFocusable;
            };
            var isFocusable = isFocusableRules.except({});
            function createFilter(condition) {
                var filter = function filter(node) {
                    if (node.shadowRoot) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    if (condition(node)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                };
                filter.acceptNode = filter;
                return filter;
            }
            var PossiblyFocusableFilter = createFilter(isFocusRelevant);
            function queryFocusableStrict() {
                var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref10.context, includeContext = _ref10.includeContext, includeOnlyTabbable = _ref10.includeOnlyTabbable, strategy = _ref10.strategy;
                if (!context) {
                    context = document.documentElement;
                }
                var _isFocusable = isFocusable.rules.except({
                    onlyTabbable: includeOnlyTabbable
                });
                var _document = getDocument(context);
                var walker = _document.createTreeWalker(context, NodeFilter.SHOW_ELEMENT, strategy === "all" ? PossiblyFocusableFilter : createFilter(_isFocusable), false);
                var list = [];
                while (walker.nextNode()) {
                    if (walker.currentNode.shadowRoot) {
                        if (_isFocusable(walker.currentNode)) {
                            list.push(walker.currentNode);
                        }
                        list = list.concat(queryFocusableStrict({
                            context: walker.currentNode.shadowRoot,
                            includeOnlyTabbable: includeOnlyTabbable,
                            strategy: strategy
                        }));
                    } else {
                        list.push(walker.currentNode);
                    }
                }
                if (includeContext) {
                    if (strategy === "all") {
                        if (isFocusRelevant(context)) {
                            list.unshift(context);
                        }
                    } else if (_isFocusable(context)) {
                        list.unshift(context);
                    }
                }
                return list;
            }
            var supports$7 = void 0;
            var selector$1 = void 0;
            var selector$2 = function selector$2() {
                if (!supports$7) {
                    supports$7 = _supports();
                }
                if (typeof selector$1 === "string") {
                    return selector$1;
                }
                selector$1 = "" + (supports$7.focusTable ? "table, td," : "") + (supports$7.focusFieldset ? "fieldset," : "") + "svg a," + "a[href]," + "area[href]," + "input, select, textarea, button," + "iframe, object, embed," + "keygen," + (supports$7.focusAudioWithoutControls ? "audio," : "audio[controls],") + (supports$7.focusVideoWithoutControls ? "video," : "video[controls],") + (supports$7.focusSummary ? "summary," : "") + "[tabindex]," + "[contenteditable]";
                selector$1 = selectInShadows(selector$1);
                return selector$1;
            };
            function queryFocusableQuick() {
                var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref11.context, includeContext = _ref11.includeContext, includeOnlyTabbable = _ref11.includeOnlyTabbable;
                var _selector = selector$2();
                var elements = context.querySelectorAll(_selector);
                var _isFocusable = isFocusable.rules.except({
                    onlyTabbable: includeOnlyTabbable
                });
                var result = [].filter.call(elements, _isFocusable);
                if (includeContext && _isFocusable(context)) {
                    result.unshift(context);
                }
                return result;
            }
            var focusable = function focusable() {
                var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref12.context, includeContext = _ref12.includeContext, includeOnlyTabbable = _ref12.includeOnlyTabbable, _ref12$strategy = _ref12.strategy, strategy = _ref12$strategy === undefined ? "quick" : _ref12$strategy;
                var element = contextToElement({
                    label: "query/focusable",
                    resolveDocument: true,
                    defaultToDocument: true,
                    context: context
                });
                var options = {
                    context: element,
                    includeContext: includeContext,
                    includeOnlyTabbable: includeOnlyTabbable,
                    strategy: strategy
                };
                if (strategy === "quick") {
                    return queryFocusableQuick(options);
                } else if (strategy === "strict" || strategy === "all") {
                    return queryFocusableStrict(options);
                }
                throw new TypeError('query/focusable requires option.strategy to be one of ["quick", "strict", "all"]');
            };
            var supports$8 = void 0;
            var focusableElementsPattern = /^(fieldset|table|td|body)$/;
            function isTabbableRules() {
                var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref13.context, _ref13$except = _ref13.except, except = _ref13$except === undefined ? {
                    flexbox: false,
                    scrollable: false,
                    shadow: false,
                    visible: false,
                    onlyTabbable: false
                } : _ref13$except;
                if (!supports$8) {
                    supports$8 = _supports();
                }
                var element = contextToElement({
                    label: "is/tabbable",
                    resolveDocument: true,
                    context: context
                });
                if (platform.is.BLINK && platform.is.ANDROID && platform.majorVersion > 42) {
                    return false;
                }
                var frameElement = getFrameElement(element);
                if (frameElement) {
                    if (platform.is.WEBKIT && platform.is.IOS) {
                        return false;
                    }
                    if (tabindexValue(frameElement) < 0) {
                        return false;
                    }
                    if (!except.visible && (platform.is.BLINK || platform.is.WEBKIT) && !isVisible(frameElement)) {
                        return false;
                    }
                    var frameNodeName = frameElement.nodeName.toLowerCase();
                    if (frameNodeName === "object") {
                        var isFixedBlink = platform.name === "Chrome" && platform.majorVersion >= 54 || platform.name === "Opera" && platform.majorVersion >= 41;
                        if (platform.is.WEBKIT || platform.is.BLINK && !isFixedBlink) {
                            return false;
                        }
                    }
                }
                var nodeName = element.nodeName.toLowerCase();
                var _tabindex = tabindexValue(element);
                var tabindex = _tabindex === null ? null : _tabindex >= 0;
                if (platform.is.EDGE && platform.majorVersion >= 14 && frameElement && element.ownerSVGElement && _tabindex < 0) {
                    return true;
                }
                var hasTabbableTabindexOrNone = tabindex !== false;
                var hasTabbableTabindex = _tabindex !== null && _tabindex >= 0;
                if (element.hasAttribute("contenteditable")) {
                    return hasTabbableTabindexOrNone;
                }
                if (focusableElementsPattern.test(nodeName) && tabindex !== true) {
                    return false;
                }
                if (platform.is.WEBKIT && platform.is.IOS) {
                    var potentiallyTabbable = nodeName === "input" && element.type === "text" || element.type === "password" || nodeName === "select" || nodeName === "textarea" || element.hasAttribute("contenteditable");
                    if (!potentiallyTabbable) {
                        var style = window.getComputedStyle(element, null);
                        potentiallyTabbable = isUserModifyWritable(style);
                    }
                    if (!potentiallyTabbable) {
                        return false;
                    }
                }
                if (nodeName === "use" && _tabindex !== null) {
                    if (platform.is.BLINK || platform.is.WEBKIT && platform.majorVersion === 9) {
                        return true;
                    }
                }
                if (elementMatches(element, "svg a") && element.hasAttribute("xlink:href")) {
                    if (hasTabbableTabindexOrNone) {
                        return true;
                    }
                    if (element.focus && !supports$8.focusSvgNegativeTabindexAttribute) {
                        return true;
                    }
                }
                if (nodeName === "svg" && supports$8.focusSvgInIframe && hasTabbableTabindexOrNone) {
                    return true;
                }
                if (platform.is.TRIDENT || platform.is.EDGE) {
                    if (nodeName === "svg") {
                        if (supports$8.focusSvg) {
                            return true;
                        }
                        return element.hasAttribute("focusable") || hasTabbableTabindex;
                    }
                    if (element.ownerSVGElement) {
                        if (supports$8.focusSvgTabindexAttribute && hasTabbableTabindex) {
                            return true;
                        }
                        return element.hasAttribute("focusable");
                    }
                }
                if (element.tabIndex === undefined) {
                    return Boolean(except.onlyTabbable);
                }
                if (nodeName === "audio") {
                    if (!element.hasAttribute("controls")) {
                        return false;
                    } else if (platform.is.BLINK) {
                        return true;
                    }
                }
                if (nodeName === "video") {
                    if (!element.hasAttribute("controls")) {
                        if (platform.is.TRIDENT || platform.is.EDGE) {
                            return false;
                        }
                    } else if (platform.is.BLINK || platform.is.GECKO) {
                        return true;
                    }
                }
                if (nodeName === "object") {
                    if (platform.is.BLINK || platform.is.WEBKIT) {
                        return false;
                    }
                }
                if (nodeName === "iframe") {
                    return false;
                }
                if (!except.scrollable && platform.is.GECKO) {
                    var _style = window.getComputedStyle(element, null);
                    if (hasCssOverflowScroll(_style)) {
                        return hasTabbableTabindexOrNone;
                    }
                }
                if (platform.is.TRIDENT || platform.is.EDGE) {
                    if (nodeName === "area") {
                        var img = getImageOfArea(element);
                        if (img && tabindexValue(img) < 0) {
                            return false;
                        }
                    }
                    var _style2 = window.getComputedStyle(element, null);
                    if (isUserModifyWritable(_style2)) {
                        return element.tabIndex >= 0;
                    }
                    if (!except.flexbox && hasCssDisplayFlex(_style2)) {
                        if (_tabindex !== null) {
                            return hasTabbableTabindex;
                        }
                        return isFocusRelevantWithoutFlexbox(element) && isTabbableWithoutFlexbox(element);
                    }
                    if (isScrollableContainer(element, nodeName)) {
                        return false;
                    }
                    var parent = element.parentElement;
                    if (parent) {
                        var parentNodeName = parent.nodeName.toLowerCase();
                        var parentStyle = window.getComputedStyle(parent, null);
                        if (isScrollableContainer(parent, nodeName, parentNodeName, parentStyle)) {
                            return false;
                        }
                        if (hasCssDisplayFlex(parentStyle)) {
                            return hasTabbableTabindex;
                        }
                    }
                }
                return element.tabIndex >= 0;
            }
            isTabbableRules.except = function() {
                var except = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var isTabbable = function isTabbable(context) {
                    return isTabbableRules({
                        context: context,
                        except: except
                    });
                };
                isTabbable.rules = isTabbableRules;
                return isTabbable;
            };
            var isFocusRelevantWithoutFlexbox = isFocusRelevant.rules.except({
                flexbox: true
            });
            var isTabbableWithoutFlexbox = isTabbableRules.except({
                flexbox: true
            });
            var isTabbable = isTabbableRules.except({});
            var queryTabbable = function queryTabbable() {
                var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref14.context, includeContext = _ref14.includeContext, includeOnlyTabbable = _ref14.includeOnlyTabbable, strategy = _ref14.strategy;
                var _isTabbable = isTabbable.rules.except({
                    onlyTabbable: includeOnlyTabbable
                });
                return focusable({
                    context: context,
                    includeContext: includeContext,
                    includeOnlyTabbable: includeOnlyTabbable,
                    strategy: strategy
                }).filter(_isTabbable);
            };
            function compareDomPosition(a, b) {
                return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            }
            var sortDomOrder = function sortDomOrder(elements) {
                return elements.sort(compareDomPosition);
            };
            function getFirstSuccessorOffset(list, target) {
                return findIndex(list, function(element) {
                    return target.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
                });
            }
            function findInsertionOffsets(list, elements, resolveElement) {
                var insertions = [];
                elements.forEach(function(element) {
                    var replace = true;
                    var offset = list.indexOf(element);
                    if (offset === -1) {
                        offset = getFirstSuccessorOffset(list, element);
                        replace = false;
                    }
                    if (offset === -1) {
                        offset = list.length;
                    }
                    var injections = nodeArray(resolveElement ? resolveElement(element) : element);
                    if (!injections.length) {
                        return;
                    }
                    insertions.push({
                        offset: offset,
                        replace: replace,
                        elements: injections
                    });
                });
                return insertions;
            }
            function insertElementsAtOffsets(list, insertions) {
                var inserted = 0;
                insertions.sort(function(a, b) {
                    return a.offset - b.offset;
                });
                insertions.forEach(function(insertion) {
                    var remove = insertion.replace ? 1 : 0;
                    var args = [ insertion.offset + inserted, remove ].concat(insertion.elements);
                    list.splice.apply(list, args);
                    inserted += insertion.elements.length - remove;
                });
            }
            var mergeInDomOrder = function mergeInDomOrder() {
                var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, list = _ref15.list, elements = _ref15.elements, resolveElement = _ref15.resolveElement;
                var _list = list.slice(0);
                var _elements = nodeArray(elements).slice(0);
                sortDomOrder(_elements);
                var insertions = findInsertionOffsets(_list, _elements, resolveElement);
                insertElementsAtOffsets(_list, insertions);
                return _list;
            };
            var supports = void 0;
            function formControlElement(element) {
                var nodeName = element.nodeName.toLowerCase();
                return nodeName === "input" || nodeName === "textarea" || nodeName === "select" || nodeName === "button";
            }
            function resolveLabelElement(element, _document) {
                var forId = element.getAttribute("for");
                if (forId) {
                    return _document.getElementById(forId);
                }
                return element.querySelector("input, select, textarea");
            }
            function resolveLegendWithinFieldset(element) {
                var fieldset = element.parentNode;
                var focusable$$1 = focusable({
                    context: fieldset,
                    strategy: "strict"
                });
                return focusable$$1.filter(formControlElement)[0] || null;
            }
            function resolveLegendWithinDocument(element, _document) {
                var tabbable = queryTabbable({
                    context: _document.body,
                    strategy: "strict"
                });
                if (!tabbable.length) {
                    return null;
                }
                var merged = mergeInDomOrder({
                    list: tabbable,
                    elements: [ element ]
                });
                var offset = merged.indexOf(element);
                if (offset === merged.length - 1) {
                    return null;
                }
                return merged[offset + 1];
            }
            function resolveLegendElement(element, _document) {
                if (!supports.focusRedirectLegend) {
                    return null;
                }
                var fieldset = element.parentNode;
                if (fieldset.nodeName.toLowerCase() !== "fieldset") {
                    return null;
                }
                if (supports.focusRedirectLegend === "tabbable") {
                    return resolveLegendWithinDocument(element, _document);
                }
                return resolveLegendWithinFieldset(element, _document);
            }
            function resolveImgElement(element) {
                if (!supports.focusRedirectImgUsemap) {
                    return null;
                }
                var map = getMapOfImage(element);
                return map && map.querySelector("area") || null;
            }
            var getFocusRedirectTarget = function getFocusRedirectTarget() {
                var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref16.context, skipFocusable = _ref16.skipFocusable;
                if (!supports) {
                    supports = _supports();
                }
                var element = contextToElement({
                    label: "get/focus-redirect-target",
                    context: context
                });
                if (!skipFocusable && isFocusable(element)) {
                    return null;
                }
                var nodeName = element.nodeName.toLowerCase();
                var _document = getDocument(element);
                if (nodeName === "label") {
                    return resolveLabelElement(element, _document);
                }
                if (nodeName === "legend") {
                    return resolveLegendElement(element, _document);
                }
                if (nodeName === "img") {
                    return resolveImgElement(element, _document);
                }
                return null;
            };
            var focusTarget = function focusTarget() {
                var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref17.context, except = _ref17.except;
                var element = contextToElement({
                    label: "get/focus-target",
                    context: context
                });
                var result = null;
                var getTarget = function getTarget(_element) {
                    var focusable = isFocusable.rules({
                        context: _element,
                        except: except
                    });
                    if (focusable) {
                        result = _element;
                        return true;
                    }
                    result = getFocusRedirectTarget({
                        context: _element,
                        skipFocusable: true
                    });
                    return Boolean(result);
                };
                if (getTarget(element)) {
                    return result;
                }
                getParents({
                    context: element
                }).slice(1).some(getTarget);
                return result;
            };
            function getParentComparator() {
                var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, parent = _ref18.parent, element = _ref18.element, includeSelf = _ref18.includeSelf;
                if (parent) {
                    return function isChildOf(node) {
                        return Boolean(includeSelf && node === parent || parent.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
                    };
                } else if (element) {
                    return function isParentOf(node) {
                        return Boolean(includeSelf && element === node || node.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_CONTAINED_BY);
                    };
                }
                throw new TypeError("util/compare-position#getParentComparator required either options.parent or options.element");
            }
            function queryInsignificantBranches(_ref19) {
                var context = _ref19.context, filter = _ref19.filter;
                var containsFilteredElement = function containsFilteredElement(node) {
                    var containsNode = getParentComparator({
                        parent: node
                    });
                    return filter.some(containsNode);
                };
                var insiginificantBranches = [];
                var CollectInsignificantBranchesFilter = function CollectInsignificantBranchesFilter(node) {
                    if (filter.some(function(element) {
                        return node === element;
                    })) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (containsFilteredElement(node)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    insiginificantBranches.push(node);
                    return NodeFilter.FILTER_REJECT;
                };
                CollectInsignificantBranchesFilter.acceptNode = CollectInsignificantBranchesFilter;
                var _document = getDocument(context);
                var walker = _document.createTreeWalker(context, NodeFilter.SHOW_ELEMENT, CollectInsignificantBranchesFilter, false);
                while (walker.nextNode()) {}
                return insiginificantBranches;
            }
            var insignificantBranches = function insignificantBranches() {
                var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref20.context, filter = _ref20.filter;
                context = contextToElement({
                    label: "get/insignificant-branches",
                    defaultToDocument: true,
                    context: context
                });
                filter = nodeArray(filter);
                if (!filter.length) {
                    throw new TypeError("get/insignificant-branches requires valid options.filter");
                }
                return queryInsignificantBranches({
                    context: context,
                    filter: filter
                });
            };
            var get = {
                activeElement: activeElement,
                activeElements: activeElements,
                focusRedirectTarget: getFocusRedirectTarget,
                focusTarget: focusTarget,
                insignificantBranches: insignificantBranches,
                parents: getParents,
                shadowHostParents: getShadowHostParents,
                shadowHost: getShadowHost
            };
            var activeElement$1 = function activeElement$1(context) {
                var element = contextToElement({
                    label: "is/active-element",
                    resolveDocument: true,
                    context: context
                });
                var _document = getDocument(element);
                if (_document.activeElement === element) {
                    return true;
                }
                var shadowHost = getShadowHost({
                    context: element
                });
                if (shadowHost && shadowHost.shadowRoot.activeElement === element) {
                    return true;
                }
                return false;
            };
            var is = {
                activeElement: activeElement$1,
                disabled: disabled,
                focusRelevant: isFocusRelevant,
                focusable: isFocusable,
                onlyTabbable: isOnlyTabbable,
                shadowed: shadowed,
                tabbable: isTabbable,
                validArea: validArea,
                validTabindex: validTabindex,
                visible: isVisible
            };
            function hasAutofocus(element) {
                return element.hasAttribute("autofocus");
            }
            function hasNoPositiveTabindex(element) {
                return element.tabIndex <= 0;
            }
            var firstTabbable = function firstTabbable() {
                var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref21.context, sequence = _ref21.sequence, strategy = _ref21.strategy, ignoreAutofocus = _ref21.ignoreAutofocus, defaultToContext = _ref21.defaultToContext, includeOnlyTabbable = _ref21.includeOnlyTabbable;
                var index = -1;
                if (!sequence) {
                    context = nodeArray(context || document.body)[0];
                    sequence = queryTabbable({
                        context: context,
                        includeOnlyTabbable: includeOnlyTabbable,
                        strategy: strategy
                    });
                }
                if (sequence.length && !ignoreAutofocus) {
                    index = findIndex(sequence, hasAutofocus);
                }
                if (sequence.length && index === -1) {
                    index = findIndex(sequence, hasNoPositiveTabindex);
                }
                var _isFocusable = isFocusable.rules.except({
                    onlyTabbable: includeOnlyTabbable
                });
                if (index === -1 && defaultToContext && context && _isFocusable(context)) {
                    return context;
                }
                return sequence[index] || null;
            };
            var filter = function filter(node) {
                if (node.shadowRoot) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            };
            filter.acceptNode = filter;
            function queryShadowHosts() {
                var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref22.context;
                var element = contextToElement({
                    label: "query/shadow-hosts",
                    resolveDocument: true,
                    defaultToDocument: true,
                    context: context
                });
                var _document = getDocument(context);
                var walker = _document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, filter, false);
                var list = [];
                if (element.shadowRoot) {
                    list.push(element);
                    list = list.concat(queryShadowHosts({
                        context: element.shadowRoot
                    }));
                }
                while (walker.nextNode()) {
                    list.push(walker.currentNode);
                    list = list.concat(queryShadowHosts({
                        context: walker.currentNode.shadowRoot
                    }));
                }
                return list;
            }
            var Maps = function() {
                function Maps(context) {
                    _classCallCheck(this, Maps);
                    this._document = getDocument(context);
                    this.maps = {};
                }
                _createClass(Maps, [ {
                    key: "getAreasFor",
                    value: function getAreasFor(name) {
                        if (!this.maps[name]) {
                            this.addMapByName(name);
                        }
                        return this.maps[name];
                    }
                }, {
                    key: "addMapByName",
                    value: function addMapByName(name) {
                        var map = getMapByName(name, this._document);
                        if (!map) {
                            return;
                        }
                        this.maps[map.name] = queryTabbable({
                            context: map
                        });
                    }
                }, {
                    key: "extractAreasFromList",
                    value: function extractAreasFromList(elements) {
                        return elements.filter(function(element) {
                            var nodeName = element.nodeName.toLowerCase();
                            if (nodeName !== "area") {
                                return true;
                            }
                            var map = element.parentNode;
                            if (!this.maps[map.name]) {
                                this.maps[map.name] = [];
                            }
                            this.maps[map.name].push(element);
                            return false;
                        }, this);
                    }
                } ]);
                return Maps;
            }();
            var sortArea = function sortArea(elements, context) {
                var usemaps = context.querySelectorAll("img[usemap]");
                var maps = new Maps(context);
                var _elements = maps.extractAreasFromList(elements);
                if (!usemaps.length) {
                    return _elements;
                }
                return mergeInDomOrder({
                    list: _elements,
                    elements: usemaps,
                    resolveElement: function resolveElement(image) {
                        var name = image.getAttribute("usemap").slice(1);
                        return maps.getAreasFor(name);
                    }
                });
            };
            var Shadows = function() {
                function Shadows(context, sortElements) {
                    _classCallCheck(this, Shadows);
                    this.context = context;
                    this.sortElements = sortElements;
                    this.hostCounter = 1;
                    this.inHost = {};
                    this.inDocument = [];
                    this.hosts = {};
                    this.elements = {};
                }
                _createClass(Shadows, [ {
                    key: "_registerHost",
                    value: function _registerHost(host) {
                        if (host._sortingId) {
                            return;
                        }
                        host._sortingId = "shadow-" + this.hostCounter++;
                        this.hosts[host._sortingId] = host;
                        var parentHost = getShadowHost({
                            context: host
                        });
                        if (parentHost) {
                            this._registerHost(parentHost);
                            this._registerHostParent(host, parentHost);
                        } else {
                            this.inDocument.push(host);
                        }
                    }
                }, {
                    key: "_registerHostParent",
                    value: function _registerHostParent(host, parent) {
                        if (!this.inHost[parent._sortingId]) {
                            this.inHost[parent._sortingId] = [];
                        }
                        this.inHost[parent._sortingId].push(host);
                    }
                }, {
                    key: "_registerElement",
                    value: function _registerElement(element, host) {
                        if (!this.elements[host._sortingId]) {
                            this.elements[host._sortingId] = [];
                        }
                        this.elements[host._sortingId].push(element);
                    }
                }, {
                    key: "extractElements",
                    value: function extractElements(elements) {
                        return elements.filter(function(element) {
                            var host = getShadowHost({
                                context: element
                            });
                            if (!host) {
                                return true;
                            }
                            this._registerHost(host);
                            this._registerElement(element, host);
                            return false;
                        }, this);
                    }
                }, {
                    key: "sort",
                    value: function sort(elements) {
                        var _elements = this._injectHosts(elements);
                        _elements = this._replaceHosts(_elements);
                        this._cleanup();
                        return _elements;
                    }
                }, {
                    key: "_injectHosts",
                    value: function _injectHosts(elements) {
                        Object.keys(this.hosts).forEach(function(_sortingId) {
                            var _list = this.elements[_sortingId];
                            var _elements = this.inHost[_sortingId];
                            var _context = this.hosts[_sortingId].shadowRoot;
                            this.elements[_sortingId] = this._merge(_list, _elements, _context);
                        }, this);
                        return this._merge(elements, this.inDocument, this.context);
                    }
                }, {
                    key: "_merge",
                    value: function _merge(list, elements, context) {
                        var merged = mergeInDomOrder({
                            list: list,
                            elements: elements
                        });
                        return this.sortElements(merged, context);
                    }
                }, {
                    key: "_replaceHosts",
                    value: function _replaceHosts(elements) {
                        return mergeInDomOrder({
                            list: elements,
                            elements: this.inDocument,
                            resolveElement: this._resolveHostElement.bind(this)
                        });
                    }
                }, {
                    key: "_resolveHostElement",
                    value: function _resolveHostElement(host) {
                        var merged = mergeInDomOrder({
                            list: this.elements[host._sortingId],
                            elements: this.inHost[host._sortingId],
                            resolveElement: this._resolveHostElement.bind(this)
                        });
                        var _tabindex = tabindexValue(host);
                        if (_tabindex !== null && _tabindex > -1) {
                            return [ host ].concat(merged);
                        }
                        return merged;
                    }
                }, {
                    key: "_cleanup",
                    value: function _cleanup() {
                        Object.keys(this.hosts).forEach(function(key) {
                            delete this.hosts[key]._sortingId;
                        }, this);
                    }
                } ]);
                return Shadows;
            }();
            var sortShadowed = function sortShadowed(elements, context, sortElements) {
                var shadows = new Shadows(context, sortElements);
                var _elements = shadows.extractElements(elements);
                if (_elements.length === elements.length) {
                    return sortElements(elements);
                }
                return shadows.sort(_elements);
            };
            var sortTabindex = function sortTabindex(elements) {
                var map = {};
                var indexes = [];
                var normal = elements.filter(function(element) {
                    var tabIndex = element.tabIndex;
                    if (tabIndex === undefined) {
                        tabIndex = tabindexValue(element);
                    }
                    if (tabIndex <= 0 || tabIndex === null || tabIndex === undefined) {
                        return true;
                    }
                    if (!map[tabIndex]) {
                        map[tabIndex] = [];
                        indexes.push(tabIndex);
                    }
                    map[tabIndex].push(element);
                    return false;
                });
                var _elements = indexes.sort().map(function(tabIndex) {
                    return map[tabIndex];
                }).reduceRight(function(previous, current) {
                    return current.concat(previous);
                }, normal);
                return _elements;
            };
            var supports$9 = void 0;
            function moveContextToBeginning(elements, context) {
                var pos = elements.indexOf(context);
                if (pos > 0) {
                    var tmp = elements.splice(pos, 1);
                    return tmp.concat(elements);
                }
                return elements;
            }
            function sortElements(elements, _context) {
                if (supports$9.tabsequenceAreaAtImgPosition) {
                    elements = sortArea(elements, _context);
                }
                elements = sortTabindex(elements);
                return elements;
            }
            var tabsequence = function tabsequence() {
                var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, context = _ref23.context, includeContext = _ref23.includeContext, includeOnlyTabbable = _ref23.includeOnlyTabbable, strategy = _ref23.strategy;
                if (!supports$9) {
                    supports$9 = _supports();
                }
                var _context = nodeArray(context)[0] || document.documentElement;
                var elements = queryTabbable({
                    context: _context,
                    includeContext: includeContext,
                    includeOnlyTabbable: includeOnlyTabbable,
                    strategy: strategy
                });
                if (document.body.createShadowRoot && platform.is.BLINK) {
                    elements = sortShadowed(elements, _context, sortElements);
                } else {
                    elements = sortElements(elements, _context);
                }
                if (includeContext) {
                    elements = moveContextToBeginning(elements, _context);
                }
                return elements;
            };
            var query = {
                firstTabbable: firstTabbable,
                focusable: focusable,
                shadowHosts: queryShadowHosts,
                tabbable: queryTabbable,
                tabsequence: tabsequence
            };
            var conflicted = typeof window !== "undefined" && window.ally;
            var ally_js = {
                get: get,
                is: is,
                query: query,
                noConflict: function noConflict() {
                    if (typeof window !== "undefined" && window.ally === this) {
                        window.ally = conflicted;
                    }
                    return this;
                }
            };
            module.exports = ally_js;
        }, {
            "css.escape": 2,
            platform: 3
        } ],
        2: [ function(require, module, exports) {
            (function(global) {
                (function(root, factory) {
                    if (typeof exports == "object") {
                        module.exports = factory(root);
                    // [OT] Rename the local "define" function to "localDefine"
                    //      to prevent r.js from namespacing it to "csui.define".
                    } else if (typeof localDefine == "function" && localDefine.amd) {
                        localDefine([], factory.bind(root, root));
                    } else {
                        factory(root);
                    }
                })(typeof global != "undefined" ? global : this, function(root) {
                    if (root.CSS && root.CSS.escape) {
                        return root.CSS.escape;
                    }
                    var cssEscape = function(value) {
                        if (arguments.length == 0) {
                            throw new TypeError("`CSS.escape` requires an argument.");
                        }
                        var string = String(value);
                        var length = string.length;
                        var index = -1;
                        var codeUnit;
                        var result = "";
                        var firstCodeUnit = string.charCodeAt(0);
                        while (++index < length) {
                            codeUnit = string.charCodeAt(index);
                            if (codeUnit == 0) {
                                result += "";
                                continue;
                            }
                            if (codeUnit >= 1 && codeUnit <= 31 || codeUnit == 127 || index == 0 && codeUnit >= 48 && codeUnit <= 57 || index == 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit == 45) {
                                result += "\\" + codeUnit.toString(16) + " ";
                                continue;
                            }
                            if (index == 0 && length == 1 && codeUnit == 45) {
                                result += "\\" + string.charAt(index);
                                continue;
                            }
                            if (codeUnit >= 128 || codeUnit == 45 || codeUnit == 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
                                result += string.charAt(index);
                                continue;
                            }
                            result += "\\" + string.charAt(index);
                        }
                        return result;
                    };
                    if (!root.CSS) {
                        root.CSS = {};
                    }
                    root.CSS.escape = cssEscape;
                    return cssEscape;
                });
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {} ],
        3: [ function(require, module, exports) {
            (function(global) {
                (function() {
                    "use strict";
                    var objectTypes = {
                        function: true,
                        object: true
                    };
                    var root = objectTypes[typeof window] && window || this;
                    var oldRoot = root;
                    var freeExports = objectTypes[typeof exports] && exports;
                    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
                    var freeGlobal = freeExports && freeModule && typeof global == "object" && global;
                    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
                        root = freeGlobal;
                    }
                    var maxSafeInteger = Math.pow(2, 53) - 1;
                    var reOpera = /\bOpera/;
                    var thisBinding = this;
                    var objectProto = Object.prototype;
                    var hasOwnProperty = objectProto.hasOwnProperty;
                    var toString = objectProto.toString;
                    function capitalize(string) {
                        string = String(string);
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    }
                    function cleanupOS(os, pattern, label) {
                        var data = {
                            "10.0": "10",
                            "6.4": "10 Technical Preview",
                            "6.3": "8.1",
                            "6.2": "8",
                            "6.1": "Server 2008 R2 / 7",
                            "6.0": "Server 2008 / Vista",
                            "5.2": "Server 2003 / XP 64-bit",
                            "5.1": "XP",
                            "5.01": "2000 SP1",
                            "5.0": "2000",
                            "4.0": "NT",
                            "4.90": "ME"
                        };
                        if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
                            os = "Windows " + data;
                        }
                        os = String(os);
                        if (pattern && label) {
                            os = os.replace(RegExp(pattern, "i"), label);
                        }
                        os = format(os.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0]);
                        return os;
                    }
                    function each(object, callback) {
                        var index = -1, length = object ? object.length : 0;
                        if (typeof length == "number" && length > -1 && length <= maxSafeInteger) {
                            while (++index < length) {
                                callback(object[index], index, object);
                            }
                        } else {
                            forOwn(object, callback);
                        }
                    }
                    function format(string) {
                        string = trim(string);
                        return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
                    }
                    function forOwn(object, callback) {
                        for (var key in object) {
                            if (hasOwnProperty.call(object, key)) {
                                callback(object[key], key, object);
                            }
                        }
                    }
                    function getClassOf(value) {
                        return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
                    }
                    function isHostType(object, property) {
                        var type = object != null ? typeof object[property] : "number";
                        return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == "object" ? !!object[property] : true);
                    }
                    function qualify(string) {
                        return String(string).replace(/([ -])(?!$)/g, "$1?");
                    }
                    function reduce(array, callback) {
                        var accumulator = null;
                        each(array, function(value, index) {
                            accumulator = callback(accumulator, value, index, array);
                        });
                        return accumulator;
                    }
                    function trim(string) {
                        return String(string).replace(/^ +| +$/g, "");
                    }
                    function parse(ua) {
                        var context = root;
                        var isCustomContext = ua && typeof ua == "object" && getClassOf(ua) != "String";
                        if (isCustomContext) {
                            context = ua;
                            ua = null;
                        }
                        var nav = context.navigator || {};
                        var userAgent = nav.userAgent || "";
                        ua || (ua = userAgent);
                        var isModuleScope = isCustomContext || thisBinding == oldRoot;
                        var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());
                        var objectClass = "Object", airRuntimeClass = isCustomContext ? objectClass : "ScriptBridgingProxyObject", enviroClass = isCustomContext ? objectClass : "Environment", javaClass = isCustomContext && context.java ? "JavaPackage" : getClassOf(context.java), phantomClass = isCustomContext ? objectClass : "RuntimeObject";
                        var java = /\bJava/.test(javaClass) && context.java;
                        var rhino = java && getClassOf(context.environment) == enviroClass;
                        var alpha = java ? "a" : "α";
                        var beta = java ? "b" : "β";
                        var doc = context.document || {};
                        var opera = context.operamini || context.opera;
                        var operaClass = reOpera.test(operaClass = isCustomContext && opera ? opera["[[Class]]"] : getClassOf(opera)) ? operaClass : opera = null;
                        var data;
                        var arch = ua;
                        var description = [];
                        var prerelease = null;
                        var useFeatures = ua == userAgent;
                        var version = useFeatures && opera && typeof opera.version == "function" && opera.version();
                        var isSpecialCasedOS;
                        var layout = getLayout([ {
                            label: "EdgeHTML",
                            pattern: "Edge"
                        }, "Trident", {
                            label: "WebKit",
                            pattern: "AppleWebKit"
                        }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko" ]);
                        var name = getName([ "Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
                            label: "Microsoft Edge",
                            pattern: "Edge"
                        }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", "SeaMonkey", {
                            label: "Silk",
                            pattern: "(?:Cloud9|Silk-Accelerated)"
                        }, "Sleipnir", "SlimBrowser", {
                            label: "SRWare Iron",
                            pattern: "Iron"
                        }, "Sunrise", "Swiftfox", "WebPositive", "Opera Mini", {
                            label: "Opera Mini",
                            pattern: "OPiOS"
                        }, "Opera", {
                            label: "Opera",
                            pattern: "OPR"
                        }, "Chrome", {
                            label: "Chrome Mobile",
                            pattern: "(?:CriOS|CrMo)"
                        }, {
                            label: "Firefox",
                            pattern: "(?:Firefox|Minefield)"
                        }, {
                            label: "Firefox for iOS",
                            pattern: "FxiOS"
                        }, {
                            label: "IE",
                            pattern: "IEMobile"
                        }, {
                            label: "IE",
                            pattern: "MSIE"
                        }, "Safari" ]);
                        var product = getProduct([ {
                            label: "BlackBerry",
                            pattern: "BB10"
                        }, "BlackBerry", {
                            label: "Galaxy S",
                            pattern: "GT-I9000"
                        }, {
                            label: "Galaxy S2",
                            pattern: "GT-I9100"
                        }, {
                            label: "Galaxy S3",
                            pattern: "GT-I9300"
                        }, {
                            label: "Galaxy S4",
                            pattern: "GT-I9500"
                        }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
                            label: "Kindle Fire",
                            pattern: "(?:Cloud9|Silk-Accelerated)"
                        }, "Nexus", "Nook", "PlayBook", "PlayStation 3", "PlayStation 4", "PlayStation Vita", "TouchPad", "Transformer", {
                            label: "Wii U",
                            pattern: "WiiU"
                        }, "Wii", "Xbox One", {
                            label: "Xbox 360",
                            pattern: "Xbox"
                        }, "Xoom" ]);
                        var manufacturer = getManufacturer({
                            Apple: {
                                iPad: 1,
                                iPhone: 1,
                                iPod: 1
                            },
                            Archos: {},
                            Amazon: {
                                Kindle: 1,
                                "Kindle Fire": 1
                            },
                            Asus: {
                                Transformer: 1
                            },
                            "Barnes & Noble": {
                                Nook: 1
                            },
                            BlackBerry: {
                                PlayBook: 1
                            },
                            Google: {
                                "Google TV": 1,
                                Nexus: 1
                            },
                            HP: {
                                TouchPad: 1
                            },
                            HTC: {},
                            LG: {},
                            Microsoft: {
                                Xbox: 1,
                                "Xbox One": 1
                            },
                            Motorola: {
                                Xoom: 1
                            },
                            Nintendo: {
                                "Wii U": 1,
                                Wii: 1
                            },
                            Nokia: {
                                Lumia: 1
                            },
                            Samsung: {
                                "Galaxy S": 1,
                                "Galaxy S2": 1,
                                "Galaxy S3": 1,
                                "Galaxy S4": 1
                            },
                            Sony: {
                                "PlayStation 4": 1,
                                "PlayStation 3": 1,
                                "PlayStation Vita": 1
                            }
                        });
                        var os = getOS([ "Windows Phone", "Android", "CentOS", {
                            label: "Chrome OS",
                            pattern: "CrOS"
                        }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows " ]);
                        function getLayout(guesses) {
                            return reduce(guesses, function(result, guess) {
                                return result || RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
                            });
                        }
                        function getManufacturer(guesses) {
                            return reduce(guesses, function(result, value, key) {
                                return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp("\\b" + qualify(key) + "(?:\\b|\\w*\\d)", "i").exec(ua)) && key;
                            });
                        }
                        function getName(guesses) {
                            return reduce(guesses, function(result, guess) {
                                return result || RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
                            });
                        }
                        function getOS(guesses) {
                            return reduce(guesses, function(result, guess) {
                                var pattern = guess.pattern || qualify(guess);
                                if (!result && (result = RegExp("\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(ua))) {
                                    result = cleanupOS(result, pattern, guess.label || guess);
                                }
                                return result;
                            });
                        }
                        function getProduct(guesses) {
                            return reduce(guesses, function(result, guess) {
                                var pattern = guess.pattern || qualify(guess);
                                if (!result && (result = RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(ua) || RegExp("\\b" + pattern + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(ua))) {
                                    if ((result = String(guess.label && !RegExp(pattern, "i").test(guess.label) ? guess.label : result).split("/"))[1] && !/[\d.]+/.test(result[0])) {
                                        result[0] += " " + result[1];
                                    }
                                    guess = guess.label || guess;
                                    result = format(result[0].replace(RegExp(pattern, "i"), guess).replace(RegExp("; *(?:" + guess + "[_-])?", "i"), " ").replace(RegExp("(" + guess + ")[-_.]?(\\w)", "i"), "$1 $2"));
                                }
                                return result;
                            });
                        }
                        function getVersion(patterns) {
                            return reduce(patterns, function(result, pattern) {
                                return result || (RegExp(pattern + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(ua) || 0)[1] || null;
                            });
                        }
                        function toStringPlatform() {
                            return this.description || "";
                        }
                        layout && (layout = [ layout ]);
                        if (manufacturer && !product) {
                            product = getProduct([ manufacturer ]);
                        }
                        if (data = /\bGoogle TV\b/.exec(product)) {
                            product = data[0];
                        }
                        if (/\bSimulator\b/i.test(ua)) {
                            product = (product ? product + " " : "") + "Simulator";
                        }
                        if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
                            description.push("running in Turbo/Uncompressed mode");
                        }
                        if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
                            data = parse(ua.replace(/like iPhone OS/, ""));
                            manufacturer = data.manufacturer;
                            product = data.product;
                        } else if (/^iP/.test(product)) {
                            name || (name = "Safari");
                            os = "iOS" + ((data = / OS ([\d_]+)/i.exec(ua)) ? " " + data[1].replace(/_/g, ".") : "");
                        } else if (name == "Konqueror" && !/buntu/i.test(os)) {
                            os = "Kubuntu";
                        } else if (manufacturer && manufacturer != "Google" && (/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua) || /\bVita\b/.test(product)) || /\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua)) {
                            name = "Android Browser";
                            os = /\bAndroid\b/.test(os) ? os : "Android";
                        } else if (name == "Silk") {
                            if (!/\bMobi/i.test(ua)) {
                                os = "Android";
                                description.unshift("desktop mode");
                            }
                            if (/Accelerated *= *true/i.test(ua)) {
                                description.unshift("accelerated");
                            }
                        } else if (name == "PaleMoon" && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
                            description.push("identifying as Firefox " + data[1]);
                        } else if (name == "Firefox" && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
                            os || (os = "Firefox OS");
                            product || (product = data[1]);
                        } else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
                            if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))) {
                                name = null;
                            }
                            if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
                                name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + " Browser";
                            }
                        }
                        if (!version) {
                            version = getVersion([ "(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))", "Version", qualify(name), "(?:Firefox|Minefield|NetFront)" ]);
                        }
                        if (data = layout == "iCab" && parseFloat(version) > 3 && "WebKit" || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && "WebKit" || !layout && /\bMSIE\b/i.test(ua) && (os == "Mac OS" ? "Tasman" : "Trident") || layout == "WebKit" && /\bPlayStation\b(?! Vita\b)/i.test(name) && "NetFront") {
                            layout = [ data ];
                        }
                        if (name == "IE" && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
                            name += " Mobile";
                            os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
                            description.unshift("desktop mode");
                        } else if (/\bWPDesktop\b/i.test(ua)) {
                            name = "IE Mobile";
                            os = "Windows Phone 8.x";
                            description.unshift("desktop mode");
                            version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
                        } else if (name != "IE" && layout == "Trident" && (data = /\brv:([\d.]+)/.exec(ua))) {
                            if (name) {
                                description.push("identifying as " + name + (version ? " " + version : ""));
                            }
                            name = "IE";
                            version = data[1];
                        }
                        if (useFeatures) {
                            if (isHostType(context, "global")) {
                                if (java) {
                                    data = java.lang.System;
                                    arch = data.getProperty("os.arch");
                                    os = os || data.getProperty("os.name") + " " + data.getProperty("os.version");
                                }
                                if (isModuleScope && isHostType(context, "system") && (data = [ context.system ])[0]) {
                                    os || (os = data[0].os || null);
                                    try {
                                        data[1] = context.require("ringo/engine").version;
                                        version = data[1].join(".");
                                        name = "RingoJS";
                                    } catch (e) {
                                        if (data[0].global.system == context.system) {
                                            name = "Narwhal";
                                        }
                                    }
                                } else if (typeof context.process == "object" && !context.process.browser && (data = context.process)) {
                                    name = "Node.js";
                                    arch = data.arch;
                                    os = data.platform;
                                    version = /[\d.]+/.exec(data.version)[0];
                                } else if (rhino) {
                                    name = "Rhino";
                                }
                            } else if (getClassOf(data = context.runtime) == airRuntimeClass) {
                                name = "Adobe AIR";
                                os = data.flash.system.Capabilities.os;
                            } else if (getClassOf(data = context.phantom) == phantomClass) {
                                name = "PhantomJS";
                                version = (data = data.version || null) && data.major + "." + data.minor + "." + data.patch;
                            } else if (typeof doc.documentMode == "number" && (data = /\bTrident\/(\d+)/i.exec(ua))) {
                                version = [ version, doc.documentMode ];
                                if ((data = +data[1] + 4) != version[1]) {
                                    description.push("IE " + version[1] + " mode");
                                    layout && (layout[1] = "");
                                    version[1] = data;
                                }
                                version = name == "IE" ? String(version[1].toFixed(1)) : version[0];
                            }
                            os = os && format(os);
                        }
                        if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ";" + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && "a")) {
                            prerelease = /b/i.test(data) ? "beta" : "alpha";
                            version = version.replace(RegExp(data + "\\+?$"), "") + (prerelease == "beta" ? beta : alpha) + (/\d+\+?/.exec(data) || "");
                        }
                        if (name == "Fennec" || name == "Firefox" && /\b(?:Android|Firefox OS)\b/.test(os)) {
                            name = "Firefox Mobile";
                        } else if (name == "Maxthon" && version) {
                            version = version.replace(/\.[\d.]+/, ".x");
                        } else if (/\bXbox\b/i.test(product)) {
                            os = null;
                            if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
                                description.unshift("mobile mode");
                            }
                        } else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == "Windows CE" || /Mobi/i.test(ua))) {
                            name += " Mobile";
                        } else if (name == "IE" && useFeatures && context.external === null) {
                            description.unshift("platform preview");
                        } else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(ua) || 0)[1] || version)) {
                            data = [ data, /BB10/.test(ua) ];
                            os = (data[1] ? (product = null, manufacturer = "BlackBerry") : "Device Software") + " " + data[0];
                            version = null;
                        } else if (this != forOwn && product != "Wii" && (useFeatures && opera || /Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua) || name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os) || name == "IE" && (os && !/^Win/.test(os) && version > 5.5 || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua))) && !reOpera.test(data = parse.call(forOwn, ua.replace(reOpera, "") + ";")) && data.name) {
                            data = "ing as " + data.name + ((data = data.version) ? " " + data : "");
                            if (reOpera.test(name)) {
                                if (/\bIE\b/.test(data) && os == "Mac OS") {
                                    os = null;
                                }
                                data = "identify" + data;
                            } else {
                                data = "mask" + data;
                                if (operaClass) {
                                    name = format(operaClass.replace(/([a-z])([A-Z])/g, "$1 $2"));
                                } else {
                                    name = "Opera";
                                }
                                if (/\bIE\b/.test(data)) {
                                    os = null;
                                }
                                if (!useFeatures) {
                                    version = null;
                                }
                            }
                            layout = [ "Presto" ];
                            description.push(data);
                        }
                        if (data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1]) {
                            data = [ parseFloat(data.replace(/\.(\d)$/, ".0$1")), data ];
                            if (name == "Safari" && data[1].slice(-1) == "+") {
                                name = "WebKit Nightly";
                                prerelease = "alpha";
                                version = data[1].slice(0, -1);
                            } else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
                                version = null;
                            }
                            data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
                            if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == "WebKit") {
                                layout = [ "Blink" ];
                            }
                            if (!useFeatures || !likeChrome && !data[1]) {
                                layout && (layout[1] = "like Safari");
                                data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? "4+" : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : "8");
                            } else {
                                layout && (layout[1] = "like Chrome");
                                data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.1 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.3 ? 11 : data < 535.01 ? 12 : data < 535.02 ? "13+" : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.1 ? 19 : data < 537.01 ? 20 : data < 537.11 ? "21+" : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != "Blink" ? "27" : "28");
                            }
                            layout && (layout[1] += " " + (data += typeof data == "number" ? ".x" : /[.+]/.test(data) ? "" : "+"));
                            if (name == "Safari" && (!version || parseInt(version) > 45)) {
                                version = data;
                            }
                        }
                        if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
                            name += " ";
                            description.unshift("desktop mode");
                            if (data == "zvav") {
                                name += "Mini";
                                version = null;
                            } else {
                                name += "Mobile";
                            }
                            os = os.replace(RegExp(" *" + data + "$"), "");
                        } else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
                            description.unshift("desktop mode");
                            name = "Chrome Mobile";
                            version = null;
                            if (/\bOS X\b/.test(os)) {
                                manufacturer = "Apple";
                                os = "iOS 4.3+";
                            } else {
                                os = null;
                            }
                        }
                        if (version && version.indexOf(data = /[\d.]+$/.exec(os)) == 0 && ua.indexOf("/" + data + "-") > -1) {
                            os = trim(os.replace(data, ""));
                        }
                        if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != "Safari" && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(name) && layout[1])) {
                            (data = layout[layout.length - 1]) && description.push(data);
                        }
                        if (description.length) {
                            description = [ "(" + description.join("; ") + ")" ];
                        }
                        if (manufacturer && product && product.indexOf(manufacturer) < 0) {
                            description.push("on " + manufacturer);
                        }
                        if (product) {
                            description.push((/^on /.test(description[description.length - 1]) ? "" : "on ") + product);
                        }
                        if (os) {
                            data = / ([\d.+]+)$/.exec(os);
                            isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == "/";
                            os = {
                                architecture: 32,
                                family: data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
                                version: data ? data[1] : null,
                                toString: function() {
                                    var version = this.version;
                                    return this.family + (version && !isSpecialCasedOS ? " " + version : "") + (this.architecture == 64 ? " 64-bit" : "");
                                }
                            };
                        }
                        if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
                            if (os) {
                                os.architecture = 64;
                                os.family = os.family.replace(RegExp(" *" + data), "");
                            }
                            if (name && (/\bWOW64\b/i.test(ua) || useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua))) {
                                description.unshift("32-bit");
                            }
                        } else if (os && /^OS X/.test(os.family) && name == "Chrome" && parseFloat(version) >= 39) {
                            os.architecture = 64;
                        }
                        ua || (ua = null);
                        var platform = {};
                        platform.description = ua;
                        platform.layout = layout && layout[0];
                        platform.manufacturer = manufacturer;
                        platform.name = name;
                        platform.prerelease = prerelease;
                        platform.product = product;
                        platform.ua = ua;
                        platform.version = name && version;
                        platform.os = os || {
                            architecture: null,
                            family: null,
                            version: null,
                            toString: function() {
                                return "null";
                            }
                        };
                        platform.parse = parse;
                        platform.toString = toStringPlatform;
                        if (platform.version) {
                            description.unshift(version);
                        }
                        if (platform.name) {
                            description.unshift(name);
                        }
                        if (os && name && !(os == String(os).split(" ")[0] && (os == name.split(" ")[0] || product))) {
                            description.push(product ? "(" + os + ")" : "on " + os);
                        }
                        if (description.length) {
                            platform.description = description.join(" ");
                        }
                        return platform;
                    }
                    var platform = parse();
                    // [OT] Rename the local "define" function to "localDefine"
                    //      to prevent r.js from namespacing it to "csui.define".
                    if (typeof localDefine == "function" && typeof localDefine.amd == "object" && localDefine.amd) {
                        root.platform = platform;
                        localDefine(function() {
                            return platform;
                        });
                    } else if (freeExports && freeModule) {
                        forOwn(platform, function(value, key) {
                            freeExports[key] = value;
                        });
                    } else {
                        root.platform = platform;
                    }
                }).call(this);
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {} ]
    }, {}, [ 1 ])(1);

  // [OT] Remove the noConflict method.
  delete ally_js.noConflict;
  return ally_js;
});
