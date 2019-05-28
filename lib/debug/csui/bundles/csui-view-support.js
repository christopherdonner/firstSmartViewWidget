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
csui.define('csui/lib/ally',[], function () {

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
                                result += "�";
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

/* =============================================================
 * bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2014 Bass Jobsen @bassjobsen
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

/* =============================================================
 * Changes:
 *  - changed 'jquery' constant to 'csui/lib/jquery'.
 *  - changed 'worker' to handle 'source' functions returning a promise.
 *  - changed 'show' to support perfect-scrollbar in case the plugin is
 *    available and it is configured to use. Therefore additional library
 *    options are introduced
 *     - prettyScrolling: Flag whether to render a perfect-scrollbar or not.
 *     - scrollContainer: The perfect-scrollbar container element.
 *     - scrollContainerHeight: The maximum height of the scroll container.
 *     - currentHighlighter : to handle actions on current active element.
 *     - nextHighlighter : to handle actions on next active element.
 */

(function (root, factory) {

  'use strict';

  // CommonJS module is defined
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('csui/lib/jquery'));
  }
  // AMD module is defined
  else if (typeof csui.define === 'function' && csui.define.amd) {
    csui.define('csui/lib/bootstrap3-typeahead',['csui/lib/jquery'], function ($) {
      return factory($);
    });
  } else {
    factory(root.jQuery);
  }

}(this, function ($) {

  'use strict';
  // jshint laxcomma: true

  /* TYPEAHEAD PUBLIC CLASS DEFINITION
   * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.select = this.options.select || this.select;
    this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.render = this.options.render || this.render;
    this.updater = this.options.updater || this.updater;
    this.displayText = this.options.displayText || this.displayText;
    this.source = this.options.source;
    this.delay = this.options.delay;
    this.$menu = $(this.options.menu);
    this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
    this.shown = false;
    this.listen();
    this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' ?
                           this.options.showHintOnFocus : false;
    this.afterSelect = this.options.afterSelect;
    this.currentHighlighter = this.options.currentHighlighter;
    this.nextHighlighter = this.options.nextHighlighter;
    this.accessbility = this.options.accessbility;
    this.addItem = false;
    // perfect-scrollbar support
    this.prettyScrolling = ($.isFunction($.fn.perfectScrollbar) && this.options.prettyScrolling);
    this.$scrollContainer = this.options.scrollContainer ? $(this.options.scrollContainer) : null;
    this.scrollContainerHeight = this.options.scrollContainerHeight;
    this.handleNoResults = !!this.options.handleNoResults;
    this.emptyTemplate = (!!this.handleNoResults && !!this.options.emptyTemplate) ?
                         this.options.emptyTemplate : "";
    if (this.handleNoResults) {
      this.dataFound = false;
    }
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
      var val = this.$menu.find('.binf-active').data('value');
      this.$element.data('active', val);
      if (this.autoSelect || val) {
        var newVal = this.updater(val);
        this.$element
            .val(this.displayText(newVal) || newVal)
            .change();
        this.afterSelect(newVal);
      }
      return this.hide();
    },

    updater: function (item) {
      return item;
    },

    setSource: function (source) {
      this.source = source;
    },

    show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      }), scrollHeight;

      scrollHeight = typeof this.options.scrollHeight == 'function' ?
                     this.options.scrollHeight.call() :
                     this.options.scrollHeight;

      // perfect-scrollbar support
      if (this.prettyScrolling) {
        this.$appendTo = this.$appendTo
            ? this.$scrollContainer.appendTo(this.$appendTo)
            : this.$scrollContainer.insertAfter(this.$element);
      }

      if (this.options.beforeShow) {
        this.options.beforeShow(this);
      }

      (this.$appendTo ? this.$menu.appendTo(this.$appendTo) : this.$menu.insertAfter(this.$element))
          .css({
            top: pos.top + pos.height + scrollHeight
            , left: pos.left
          })
          .show();

      // perfect-scrollbar support
      if (this.prettyScrolling) {
        this.$scrollContainer
            .show()
            .css({
              height: (this.$menu[0].offsetHeight > this.scrollContainerHeight)
                  ? this.scrollContainerHeight
                  : this.$menu[0].offsetHeight
            })
            .perfectScrollbar({
              suppressScrollX: true,
              scrollYMarginOffset: 15
            })
            .scrollTop(0);
      }

      this.shown = true;

      if (this.options.afterShow) {
        this.options.afterShow(this);
      }

      return this;
    },

    hide: function () {

      // perfect-scrollbar support
      if (this.prettyScrolling) {
        this.$scrollContainer
            .hide();
      }
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function (query) {
      var items;
      if (typeof(query) != 'undefined' && query !== null) {
        this.query = query;
      } else {
        this.query = this.$element.val() || '';
      }

      if (this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      var worker = $.proxy(function () {
        var that = this;

        if ($.isFunction(this.source)) {
          $.when(this.source(this.query, $.proxy(this.process, this))).done(function (items) {
            that.process(items);
          });
        } else if (this.source) {
          this.process(this.source);
        }
      }, this);

      clearTimeout(this.lookupWorker);
      this.lookupWorker = setTimeout(worker, this.delay);
    },

    process: function (items) {
      if (items.length === 0 && this.handleNoResults) {
        this.dataFound = false;
        return this.renderNoResults().show();
      }
      this.dataFound = true;
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length && !this.options.addItem) {
        return this.shown ? this.hide() : this;
      }

      if (items.length > 0) {
        this.$element.data('active', items[0]);
      } else {
        this.$element.data('active', null);
      }

      // Add item
      if (this.options.addItem) {
        items.push(this.options.addItem);
      }

      if (this.options.items == 'all') {
        return this.render(items).show();
      } else {
        return this.render(items.slice(0, this.options.items)).show();
      }
    },

    matcher: function (item) {
      var it = this.displayText(item);
      return ~it.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter: function (items) {
      var beginswith        = []
          , caseSensitive   = []
          , caseInsensitive = []
          , item;

      while ((item = items.shift())) {
        var it = this.displayText(item);
        if (!it.toLowerCase().indexOf(this.query.toLowerCase())) {
          beginswith.push(item);
        } else if (~it.indexOf(this.query)) {
          caseSensitive.push(item);
        } else {
          caseInsensitive.push(item);
        }
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function (item) {
      var html = $('<div></div>');
      var query = this.query;
      var i = item.toLowerCase().indexOf(query.toLowerCase());
      var len, leftPart, middlePart, rightPart, strong;
      len = query.length;
      if (len === 0) {
        return html.text(item).html();
      }
      while (i > -1) {
        leftPart = item.substr(0, i);
        middlePart = item.substr(i, len);
        rightPart = item.substr(i + len);
        strong = $('<strong></strong>').text(middlePart);
        html
            .append(document.createTextNode(leftPart))
            .append(strong);
        item = rightPart;
        i = item.toLowerCase().indexOf(query.toLowerCase());
      }
      return html.append(document.createTextNode(item)).html();
    },

    render: function (items) {
      var that = this;
      var self = this;
      var activeFound = false;
      items = $(items).map(function (i, item) {
        var text = self.displayText(item);
        i = $(that.options.item).data('value', item);
        i.find('a').html(that.highlighter(text));
        i.attr("id", "user-item" + item.cid);
        if (text == self.$element.val()) {
          i.addClass('binf-active');
          self.$element.data('active', item);
          activeFound = true;
        }
        return i[0];
      });

      if (this.autoSelect && !activeFound) {
        items.first().addClass('binf-active');
        this.$element.data('active', items.first().data('value'));
      }
      this.$menu.html(items);
      this.nextHighlighter(items.first());
      return this;
    },

    renderNoResults: function () {
      this.$menu.html(this.emptyTemplate).addClass("csui-no-results-wrapper");
      return this;
    },

    displayText: function (item) {
      return item.name || item;
    },

    next: function (event) {
      var active = this.$menu.find('.binf-active').removeClass('binf-active')
          , next = active.next();
      this.currentHighlighter(active);

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }
      this.accessbility(next);
      next.addClass('binf-active');
      this._scrollIntoView(next[0]);
      this.nextHighlighter(next);
    },

    prev: function (event) {
      var active = this.$menu.find('.binf-active').removeClass('binf-active')
          , prev = active.prev();
      this.currentHighlighter(active);
      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }
      this.accessbility(prev);
      prev.addClass('binf-active');
      this._scrollIntoView(prev[0]);
      this.nextHighlighter(prev);
    },

    listen: function () {
      this.$element
          .on('focus', $.proxy(this.focus, this))
          .on('blur', $.proxy(this.blur, this))
          .on('keypress', $.proxy(this.keypress, this))
          .on('keyup', $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
          .on('click', $.proxy(this.click, this))
          .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
          .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },

    destroy: function () {
      this.$element.data('typeahead', null);
      this.$element.data('active', null);
      this.$element
          .off('focus')
          .off('blur')
          .off('keypress')
          .off('keyup');

      if (this.eventSupported('keydown')) {
        this.$element.off('keydown');
      }

      this.$menu.remove();
    },

    eventSupported: function (eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function (e) {
      if (!this.shown) {
        return;
      }

      switch (e.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // escape
        e.preventDefault();
        break;

      case 38: // up arrow
        // with the shiftKey (this is actually the left parenthesis)
        if (this.handleNoResults && !this.dataFound) {
          return;
        }
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        this.prev();
        break;

      case 40: // down arrow
        // with the shiftKey (this is actually the right parenthesis)
        if (this.handleNoResults && !this.dataFound) {
          return;
        }
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        this.next();
        break;
      }
    },

    keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
      if (!this.shown && e.keyCode == 40) {
        this.lookup();
      } else {
        this.move(e);
      }
    },

    keypress: function (e) {
      if (this.suppressKeyPressRepeat) {
        return;
      }
      this.move(e);
    },

    keyup: function (e) {
      switch (e.keyCode) {
      case 40: // down arrow
      case 38: // up arrow
      case 16: // shift
      case 17: // ctrl
      case 18: // alt
        break;

      case 9: // tab
      case 13: // enter
        if (!this.shown) {
          return;
        }
        if (this.handleNoResults && !this.dataFound) {
          return;
        }
        this.select();
        break;

      case 27: // escape
        if (!this.shown) {
          return;
        }
        this.hide();
        break;
      case 113: //f2 restricts to open dropdown
        return;
      default:
        this.lookup();
      }

      e.preventDefault();
    },

    focus: function (e) {
      if (!this.focused) {
        this.focused = true;
        if (this.options.showHintOnFocus) {
          this.lookup('');
        }
      }
    },

    blur: function (e) {
      this.focused = false;
      if (!this.mousedover && this.shown) {
        this.hide();
      }
    },

    click: function (e) {
      e.preventDefault();
      if(!!this.dataFound) {
        this.select();
        this.$element.focus();
      } else {
        this.hide();
      }
    },

    mouseenter: function (e) {
      this.mousedover = true;
      this.currentHighlighter(this.$menu.find('.binf-active'));
      this.$menu.find('.binf-active').removeClass('binf-active');
      $(e.currentTarget).addClass('binf-active');
      this.nextHighlighter(this.$menu.find('.binf-active'));
    },

    mouseleave: function (e) {
      this.mousedover = false;
      if (!this.focused && this.shown) {
        this.hide();
      }
    },

    _scrollIntoView: function (item) {
      var currentItem         = this.$menu.find(item),
          parentScrollElement = this.$menu.parent(),
          currentItemHeight   = currentItem.height(),
          offSetVariation     = currentItem.offset().top - parentScrollElement.offset().top,
          menuScrollTop       = parentScrollElement.scrollTop(),
          menuScrollHeight    = parentScrollElement.height();

      if (offSetVariation < 0) {
        parentScrollElement.scrollTop(menuScrollTop + offSetVariation);
      } else if (offSetVariation + currentItemHeight > menuScrollHeight) {
        parentScrollElement.scrollTop(
            menuScrollTop + offSetVariation + 2 * currentItemHeight - menuScrollHeight
        );
      }
    }

  };

  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
    var arg = arguments;
    if (typeof option == 'string' && option == 'getActive') {
      return this.data('active');
    }
    return this.each(function () {
      var $this     = $(this)
          , data    = $this.data('typeahead')
          , options = typeof option == 'object' && option;
      if (!data) {
        $this.data('typeahead', (data = new Typeahead(this, options)));
      }
      if (typeof option == 'string') {
        if (arg.length > 1) {
          data[option].apply(data, Array.prototype.slice.call(arg, 1));
        } else {
          data[option]();
        }
      }
    });
  };

  $.fn.typeahead.defaults = {
    source: []
    , items: 8
    , menu: '<ul class="typeahead binf-dropdown-menu" role="listbox" id="user-picker-ul"></ul>'
    , item: '<li role="option"><a href="#"></a></li>'
    , minLength: 1
    , scrollHeight: 0
    , autoSelect: true
    , afterSelect: $.noop
    , currentHighlighter: $.noop
    , nextHighlighter: $.noop
    , addItem: false
    , delay: 0
    // implement perfect-scrollbar support
    , prettyScrolling: false
    , scrollContainer: '<div class="typeahead scroll-container"></div>'
    , scrollContainerHeight: 320
  };

  $.fn.typeahead.Constructor = Typeahead;

  /* TYPEAHEAD NO CONFLICT
   * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };

  /* TYPEAHEAD DATA-API
   * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) {
      return;
    }
    $this.typeahead($this.data());
  });

}));

/*
 * jquery.mousehover 0.2.1
 * https://github.com/prantlf/jquery.mousehover
 *
 * Copyright (c) 2017 Ferdinand Prantl
 * Licensed under the MIT license.
 */

// [OT] Modifications done:
//
// * Replace UMD with csui AMD at the top and bottom of the file
// * Return the .fn function
// * Disclose iPad and iPhone from mousehover checks

// [OT] Declare a csui module
csui.define('csui/lib/jquery.mousehover',['csui/lib/jquery'], function($) {
  'use strict';

  // Remember the existing mousehover plugin, if there is any, to be able
  // to restore it by calling noConflict.
  var oldMousehover = $.fn.mousehover,
      eventTimeProperty;

  // Convert any combination of input parametrs to the parameters object,
  // which has the same structure and all values available.
  // Arguments:
  // .mousehover(handlerIn)
  // .mousehover(handlerIn, handlerOut)
  // .mousehover(handlerIn, options)
  // .mousehover(handlerIn, handlerOut, options)
  // .mousehover({handlerIn, handlerOut, options})
  // .mousehover('off')
  // .mousehover('off', options)
  // Result:
  // .handlerIn:  function
  // .handlerOut: function
  // .namespace:  string (empty or starting with '.')
  function normalizeParameters(handlerIn, handlerOut, options) {
    var namespace;
    if (typeof handlerIn === 'object') {
      return handlerIn;
    }
    // The first parameter has to be always present. Function handler,
    // string method name, or an object literal.
    if (!handlerIn) {
      throw new Error('Missing event handler or method.');
    }
    if (!options) {
      options = typeof handlerOut === 'object' ? handlerOut : {};
    }
    // Prepend '.' to allow simple concatenation of the namespace.
    namespace = options.namespace;
    namespace = namespace ? '.' + namespace : '';
    // There is just one method supported right now - "off". It will be
    // detected by the missing "handlerIn"" parameter.
    if (typeof handlerIn === 'string') {
      if (handlerIn !== 'off') {
        throw new Error('Unsupported method.')
      }
      return {
        namespace: namespace
      };
    }
    return {
      handlerIn: handlerIn,
      handlerOut: typeof handlerOut === 'function' ? handlerOut : handlerIn,
      namespace: namespace
    };
  }

  // [OT] Some taps on iPad were not detected as emulated. Not clear why.
  // There i no mouse on iPad today, avoid any mouse detection.
  if (navigator.userAgent.indexOf('iPad') > 0 ||
      navigator.userAgent.indexOf('iPhone') > 0) {
    // Do nothing on iOS.
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      return this;
    };
  // If the browser supports pointer events, we can detect mouse reliably.
  // } else if ('onpointerenter' in window ) {
  // [OT] Pointer events are not detected properly in BCW.
  // navigator.pointerEnabled is undefined in browsers where as in SAP BCW it is false.
  // Adding extra check to bypass pointer event binding in SAP BCW.
  } else if ('onpointerenter' in window && navigator.pointerEnabled !== false) {
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      var parameters = normalizeParameters(handlerIn, handlerOut, options),
          namespace = parameters.namespace;
      handlerIn = parameters.handlerIn;
      // Missing "handlerIn" parameter means, that existing event handlers
      // should be unregistered.
      if (!handlerIn) {
        return this.off('pointerenter' + namespace +
                        ' pointerleave' + namespace);
      }
      handlerOut = parameters.handlerOut;
      return this.on('pointerenter' + namespace, function (event) {
                   if (event.originalEvent.pointerType === 'mouse') {
                     handlerIn.call(this, event);
                   }
                 })
                 .on('pointerleave' + namespace, function (event) {
                   if (event.originalEvent.pointerType === 'mouse') {
                     handlerOut.call(this, event);
                   }
                 });
    };

  // If the browser has support for touch events, the mouseenter and
  // mouseleave events can be emulated on tapping the display.
  } else if ('ontouchstart' in window) {
    eventTimeProperty = 'mousehover-start';
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      var parameters = normalizeParameters(handlerIn, handlerOut, options),
          namespace = parameters.namespace;
      handlerIn = parameters.handlerIn;
      // Missing "handlerIn" parameter means, that existing event handlers
      // should be unregistered.
      if (!handlerIn) {
        return this.off('touchend' + namespace +
                        ' mouseenter' + namespace +
                        ' mouseleave' + namespace);
      }
      handlerOut = parameters.handlerOut;
      // Store the time of the event, which would shortly preceed the
      // mouseenter event on touch-capable devices, if it were an emulated
      // mouse event caused by tapping the display.
      return this.on('touchend' + namespace, function () {
                   $(this).data(eventTimeProperty, new Date().getTime());
                 })
                 // If the first event handler remembered its time and the
                 // mouseenter event comes too soon, it was triggered by
                 // tapping and should be ignored.
                 .on('mouseenter' + namespace, function (event) {
                   var $this = $(this),
                       once = $this.data(eventTimeProperty),
                       now;
                   if (once) {
                     now = new Date().getTime();
                     // The time interval between the touchend event, which
                     // can identify, that the mouseenter event was emulated,
                     // and the mouseenter event itself can vary.
                     if (now - once < 50) {
                       return $(this).removeData(eventTimeProperty);
                     }
                   }
                   // Enable handling of the complementary mouseleave event.
                   $(this).data(eventTimeProperty, true);
                   handlerIn.call(this, event);
                 })
                 // The mouseleave event should call the hover event handler
                 // only if it was triggered by the mouseenter event earlier.
                 .on('mouseleave' + namespace, function (event) {
                   var $this = $(this);
                   if ($this.data(eventTimeProperty)) {
                     $this.removeData(eventTimeProperty);
                     handlerOut.call(this, event);
                   }
                 });
    };

  // If the browser has no support for touch events, we can assume, that
  // the only device, which can trigger the mouseenter eveny, is the mouse.
  } else {
    // Default to jQuery.hover behaviour on devices without touch capability.
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      var parameters = normalizeParameters(handlerIn, handlerOut, options),
          namespace = parameters.namespace;
      handlerIn = parameters.handlerIn;
      // Missing "handlerIn" parameter means, that existing event handlers
      // should be unregistered.
      if (!handlerIn) {
        return this.off('mouseenter' + namespace +
                        ' mouseleave' + namespace);
      }
      handlerOut = parameters.handlerOut;
      return this.on('mouseenter' + namespace, handlerIn)
                 .on('mouseleave' + namespace, handlerOut);
    };
  }

  // Restores the earlier mousehover plugin, which had been registered in
  // jQuery before this one. This plugin is returned for explicit usage.
  $.fn.mousehover.noConflict = function () {
    $.fn.mousehover = oldMousehover;
    return this;
  };

  // [OT] Return the .fn function
  return $.fn.mousehover;
});

csui.define('csui/lib/jsonpath',[],function () {
  /* JSONPath 0.8.0 - XPath for JSON
   *
   * Copyright (c) 2007 Stefan Goessner (goessner.net)
   * Licensed under the MIT (MIT-LICENSE.txt) licence.
   */
  function jsonPath(obj, expr, arg) {
    var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function (expr) {
        var subx = [];
        return expr.replace(/[\['](\??\(.*?\))[\]']/g,
            function ($0, $1) {return "[#" + (subx.push($1) - 1) + "]";})
            .replace(/'?\.'?|\['?/g, ";")
            .replace(/;;;|;;/g, ";..;")
            .replace(/;$|'?\]|'$/g, "")
            .replace(/#([0-9]+)/g, function ($0, $1) {return subx[$1];});
      },
      asPath: function (path) {
        var x = path.split(";"), p = "$";
        for (var i = 1, n = x.length; i < n; i++) {
          p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
        }
        return p;
      },
      store: function (p, v) {
        if (p) {
          P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
        }
        return !!p;
      },
      trace: function (expr, val, path) {
        if (expr) {
          var x = expr.split(";"), loc = x.shift();
          x = x.join(";");
          if (val && val.hasOwnProperty(loc)) {
            P.trace(x, val[loc], path + ";" + loc);
          } else if (loc === "*") {
            P.walk(loc, x, val, path, function (m, l, x, v, p) { P.trace(m + ";" + x, v, p); });
          } else if (loc === "..") {
            P.trace(x, val, path);
            P.walk(loc, x, val, path, function (m, l, x, v, p) {
              typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m);
            });
          }
          else if (/,/.test(loc)) { // [name1,name2,...]
            for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) {
              P.trace(s[i] + ";" + x, val, path);
            }
          }
          else if (/^\(.*?\)$/.test(loc)) // [(expr)]
          {
            P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val,
                path);
          } else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
          {
            P.walk(loc, x, val, path, function (m, l, x, v, p) {
              if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) {
                P.trace(m + ";" + x, v, p);
              }
            });
          } else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
          {
            P.slice(loc, x, val, path);
          }
        }
        else {
          P.store(path, val);
        }
      },
      walk: function (loc, expr, val, path, f) {
        if (val instanceof Array) {
          for (var i = 0, n = val.length; i < n; i++) {
            if (i in val) {
              f(i, loc, expr, val, path);
            }
          }
        }
        else if (typeof val === "object") {
          for (var m in val) {
            if (val.hasOwnProperty(m)) {
              f(m, loc, expr, val, path);
            }
          }
        }
      },
      slice: function (loc, expr, val, path) {
        if (val instanceof Array) {
          var len = val.length, start = 0, end = len, step = 1;
          loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {
            start = parseInt($1 || start);
            end = parseInt($2 || end);
            step = parseInt($3 || step);
          });
          start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
          end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
          for (var i = start; i < end; i += step) {
            P.trace(i + ";" + expr, val, path);
          }
        }
      },
      eval: function (x, _v, _vname) {
        try { return $ && _v && eval(x.replace(/@/g, "_v")); }
        catch (e) {
          throw new SyntaxError("jsonPath: " + e.message + ": " +
                                x.replace(/@/g, "_v").replace(/\^/g, "_a"));
        }
      }
    };

    var $ = obj;
    if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/, ""), obj, "$");
      return P.result.length ? P.result : false;
    }
  }

  return jsonPath;
});
csui.define('csui/behaviors/collection.error/collection.error.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/error/error.view'
], function (_, Backbone, Marionette, ErrorView) {
  'use strict';

  var CollectionErrorBehavior = Marionette.Behavior.extend({

    constructor: function CollectionErrorBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the collection is stored in the view
      var collection = getBehaviorOption.call(this, 'collection') ||
                       view.collection || view.options.collection;

      // Disable the view's empty view, if fetching the collection
      // failed and the error view shoudl be shown
      var getEmptyView = view.getEmptyView;
      view.getEmptyView = function () {
        return collection.error ? ErrorView :
               getEmptyView.apply(view, arguments);
      };
      var emptyViewOptions = view.emptyViewOptions;
      view.emptyViewOptions = function () {
        var error = collection.error;
        if (error) {
          return {
            model: new Backbone.Model({
              message: error.message
            })
          };
        }
        return _.isFunction(emptyViewOptions) ?
               emptyViewOptions.apply(view, arguments) :
               emptyViewOptions;
      };

      // Re-render the view, if fetching the data failed
      this.listenTo(collection, 'error', function () {
        view.collection.reset();
      });
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return CollectionErrorBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/behaviors/collection.state/impl/collection.state',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<p>"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>";
}});
Handlebars.registerPartial('csui_behaviors_collection.state_impl_collection.state', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/behaviors/collection.state/collection.state.view',[
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/behaviors/collection.state/impl/collection.state'
], function (_, Marionette, template) {
  'use strict';

  var CollectionStateView = Marionette.ItemView.extend({

    className: 'csui-collection-state',

    template: template,

    constructor: function CollectionStateView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change:state', this.render)
          .listenTo(this, 'render', this._updateClasses);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), {
        // empty, loading, failed
        message: this.options.stateMessages[this.model.get('state')]
      });
    },

    _updateClasses: function () {
      this.$el
          .removeClass('csui-state-empty csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.model.get('state'));
    }

  });

  return CollectionStateView;
});

csui.define('csui/behaviors/collection.state/collection.state.behavior',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/collection.state/collection.state.view'
], function (_, Backbone, Marionette, CollectionStateView) {
  'use strict';

  var CollectionStateBehavior = Marionette.Behavior.extend({

    constructor: function CollectionStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the collection is stored in the view
      var viewCollection = view.collection || view.options.collection,
          collection = getBehaviorOption.call(this, 'collection') ||
                       viewCollection;
      this.listenTo(collection, 'request', this._fetchingCollectionStarted)
          .listenTo(collection, 'sync', this._fetchingCollectionSucceeded)
          .listenTo(collection, 'error', this._fetchingCollectionFailed)
          .listenTo(viewCollection, 'reset', this._collectionReset);

      this.collectionState = new Backbone.Model({
        state: collection.fetching ? 'loading' :
               collection.error ? 'failed' :
               collection.length ? 'full' : 'empty'
      });

      var stateView = this.getOption('stateView');
      if (_.isFunction(stateView) &&
          !(stateView.prototype instanceof Backbone.View)) {
        stateView = stateView.call(view);
      }
      view.emptyView = stateView || CollectionStateView;

      var self = this;
      view.emptyViewOptions = function () {
        return _.extend({
          model: self.collectionState,
          stateMessages: getBehaviorOption.call(self, 'stateMessages') || {}
        }, getBehaviorOption.call(self, 'stateViewOptions'));
      };
    },

    _collectionReset: function (collection) {
      var state = this.collectionState.get('state');
      if (state !== 'loading' && state !== 'error') {
        this.collectionState.set('state', collection.length ? 'full' : 'empty');
      }
    },

    _fetchingCollectionStarted: function () {
      // show loading message only if there were already models in the collection
      if (this.view.collection.length === 0) {
        this.collectionState.set('state', 'loading');
        this.view.collection.reset();
        this.view.blockWithoutIndicator && this.view.blockWithoutIndicator();
      }
    },

    _fetchingCollectionSucceeded: function () {
      this.collectionState.set('state',
          this.view.collection.length ? 'full' : 'empty');
      this.view.unblockActions && this.view.unblockActions();
    },

    _fetchingCollectionFailed: function () {
      this.collectionState.set('state', 'failed');
      this.view.unblockActions && this.view.unblockActions();
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return CollectionStateBehavior;
});

csui.define('csui/models/facettopic',[
  'csui/lib/backbone'
], function (Backbone) {
  'use strict';

  var FacetTopicModel = Backbone.Model.extend({
    idAttribute: 'value',

    constructor: function FacetTopicModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });

  return FacetTopicModel;
});

csui.define('csui/models/facettopics',[
  'csui/lib/backbone', 'csui/models/facettopic'
], function (Backbone, FacetTopicModel) {
  'use strict';

  var FacetTopicCollection = Backbone.Collection.extend({
    model: FacetTopicModel,

    constructor: function FacetTopicCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  return FacetTopicCollection;
});

csui.define('csui/models/facet',[
  'csui/lib/backbone', 'csui/models/facettopics'
], function (Backbone, FacetTopicCollection) {
  'use strict';

  var FacetModel = Backbone.Model.extend({
    constructor: function FacetModel(attributes) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.topics = new FacetTopicCollection(attributes && attributes.topics);
    },

    parse: function (response, options) {
      if (this.topics) {
        this.topics.reset(response.topics);
      }
      return response;
    }
  });

  return FacetModel;
});

csui.define('csui/models/facets',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/models/facet',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, FacetModel) {
  'use strict';

  var FacetCollection = Backbone.Collection.extend({
    model: FacetModel,

    constructor: function FacetCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.filters = options && options.filters || [];
    },

    clone: function () {
      return new this.constructor(this.models, {
        filters: _.deepClone(this.filters)
      });
    },

    setFilter: function (filters, fetch, options) {
      if (!_.isEqual(this.filters, filters)) {
        this.filters = filters;
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    addFilter: function (filters, fetch, options) {
      var existingFilters = this.filters,
          newFilters = [],
          modified;
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      filters.forEach(function (filter) {
        var existingFilter = _.findWhere(existingFilters, {id: filter.id});
        if (existingFilter) {
          var existingValues = existingFilter.values,
              newValues = filter.values.filter(function (value) {
                return !_.findWhere(existingValues, {id: value.id});
              });
          if (newValues.length) {
            existingValues.push.apply(existingValues, newValues);
            modified = true;
          }
        } else {
          if (filter.values.length) {
            newFilters.push(filter);
          }
        }
      });
      if (newFilters.length) {
        existingFilters.push.apply(existingFilters, newFilters);
        modified = true;
      }
      if (modified) {
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    removeFilter: function (filters, fetch, options) {
      var modified;
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      this.filters = _.reject(this.filters, function (existingFilter) {
        var filter = _.findWhere(filters, {id: existingFilter.id});
        if (filter) {
          var values = filter.values,
              newValues = _.reject(existingFilter.values, function (existingValue) {
                if (_.findWhere(values, {id: existingValue.id})) {
                  modified = true;
                  return true;
                }
              });
          if (!newValues.length) {
            modified = true;
            return true;
          }
          existingFilter.values = newValues;
        }
      });
      if (modified) {
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    clearFilter: function (fetch, options) {
      if (this.filters.length > 0) {
        this.filters = [];
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    getAvailableFacets: function () {
      return getSomeFacets(this, false);
    },

    getSelectedFacets: function () {
      return getSomeFacets(this, true);
    }
  });

  function areFacetsFetchable(facets) {
    return facets.isFetchable && facets.isFetchable();
  }

  function getSomeFacets(facets, selected) {
    selected = !!selected;
    return facets
      // Take only facets with at least one selected/available topic.
      .filter(function (facet) {
        return facet.topics.some(function (topic) {
          var isSelected = !!topic.get('selected');
          return selected === isSelected;
        });
      })
      // Clone facets with selected/available topics.
      .map(function (facet) {
        facet = facet.toJSON();
        facet.topics = facet.topics.filter(function (topic) {
          var isSelected = !!topic.selected;
          return selected === isSelected;
        });
        return facet;
      });
  }

  return FacetCollection;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/facet.bar/impl/facet.bar.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a href=\"#\" role=\"button\" class=\"csui-facet-item-content\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.facetItemAria || (depth0 != null ? depth0.facetItemAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"facetItemAria","hash":{}}) : helper)))
    + "\">\r\n  <div>\r\n    <span class=\"csui-label\">\r\n      <span class=\"csui-facet-item-facet-name\">"
    + this.escapeExpression(((helper = (helper = helpers.facetName || (depth0 != null ? depth0.facetName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"facetName","hash":{}}) : helper)))
    + ":</span>\r\n      <span class=\"csui-facet-item-topic-name\">"
    + this.escapeExpression(((helper = (helper = helpers.topicName || (depth0 != null ? depth0.topicName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"topicName","hash":{}}) : helper)))
    + "</span>\r\n    </span>\r\n    <span class=\"csui-icon binf-close\" data-csui-facet=\""
    + this.escapeExpression(((helper = (helper = helpers.facetId || (depth0 != null ? depth0.facetId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"facetId","hash":{}}) : helper)))
    + "\"\r\n          data-csui-topic=\""
    + this.escapeExpression(((helper = (helper = helpers.topicId || (depth0 != null ? depth0.topicId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"topicId","hash":{}}) : helper)))
    + "\"></span>\r\n  </div>\r\n</a>\r\n";
}});
Handlebars.registerPartial('csui_controls_facet.bar_impl_facet.bar.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/facet.bar/impl/facet.bar.item.view',["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/marionette",
  "hbs!csui/controls/facet.bar/impl/facet.bar.item"
], function (module, $, _, Marionette, template) {

  var FacetBarItemView = Marionette.ItemView.extend({

    className: 'csui-facet-item',

    tagName: 'li',

    template: template,

    ui: {
      'item': '.csui-facet-item',
      'content': '.csui-facet-item-content'
    },

    events: {
      'click @ui.item': 'cancelClick',
      'click @ui.content': 'cancelClick'
    },

    constructor: function FacetBarItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    cancelClick: function (event) {
      // there is a href="#" set on the a-tag to let the browser make the facet item accessible
      // by keyboard. Don't let the event do anything, because it would let the browser to
      // navigate to the landing page.
      if (!$(event.target).hasClass('binf-close')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });

  return FacetBarItemView;
});


csui.define('css!csui/controls/facet.bar/impl/facet.bar',[],function(){});
csui.define('csui/controls/facet.bar/facet.bar.items.view',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/marionette",
  'csui/controls/facet.bar/impl/facet.bar.item.view',
  'css!csui/controls/facet.bar/impl/facet.bar'
], function (_, $, Marionette,
    FacetBarItemView) {

  var FacetBarItemsView = Marionette.CollectionView.extend({

    childView: FacetBarItemView,
    tagName: "ol",
    className: 'csui-facet-list',

    constructor: function FacetBarItemsView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, 'reset', this._checkOverflow);
      this.listenTo(this.collection, 'change', this._checkOverflow);
      this.listenTo(this.collection, 'add', this._checkOverflow);
      this.listenTo(this.collection, 'remove', this._checkOverflow);
      this.listenTo(this, 'dom:refresh', this._calcScrollSteps);
      this.listenTo(this, 'dom:refresh', this._checkOverflow);
    },

    _calcScrollSteps: function () {
      var el = this.$el[0];
      var ow = el.offsetWidth;
      var sw = el.scrollWidth;
      this.scrollStepPx = (ow / 3) * 2;
      if (sw > ow) {
        this.maxScrollLeft = sw - ow + 8; // add a few pixel to let it scroll enough to the left
      } else {
        this.maxScrollLeft = 0;
      }
    },

    _checkOverflow: function () {
      if (this.$el.length) {
        var el = this.$el[0];
        var ow = el.offsetWidth;
        var sw = el.scrollWidth;
        // list of facet bar items is overflowing or not -> others might do something depending
        // on it
        this.trigger('overflow', ow < sw);
        this.trigger('scrolled',
            {currentScrollLeft: this.$el.scrollLeft(), maxScrollLeft: this.maxScrollLeft});
      }
    },

    scrollLeft: function () {
      var el = this.$el;
      var currentScrollLeft = el.scrollLeft();
      var newScrollLeft = currentScrollLeft;
      if (currentScrollLeft < this.maxScrollLeft) {
        newScrollLeft = currentScrollLeft + this.scrollStepPx;
        if (newScrollLeft > this.maxScrollLeft) {
          newScrollLeft = this.maxScrollLeft;
        }
        el.animate({scrollLeft: newScrollLeft}, 500);
      }
      this.trigger('scrolled',
          {currentScrollLeft: newScrollLeft, maxScrollLeft: this.maxScrollLeft});
      return newScrollLeft;
    },

    scrollRight: function () {
      var el = this.$el;
      var currentScrollLeft = el.scrollLeft();
      var newScrollLeft = 0;
      if (currentScrollLeft > this.scrollStepPx) {
        newScrollLeft = currentScrollLeft - this.scrollStepPx;
      }
      el.animate({scrollLeft: newScrollLeft}, 500);
      this.trigger('scrolled',
          {currentScrollLeft: newScrollLeft, maxScrollLeft: this.maxScrollLeft});
      return el.scrollLeft();
    }
  });

  return FacetBarItemsView;
});

csui.define('csui/behaviors/keyboard.navigation/tabables.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base'
], function (module, _, $, Marionette, log, base) {
  'use strict';

  log = log(module.id);

  // Default static options for the behaviour object
  var config = module.config();

  var accessibilityRegionClass = 'csui-acc-tab-region';
  var accessibilityActiveRegionClass = 'csui-acc-tab-region-active';

  // This behavior implements a controller for one or more views with the tabable.region.behavior
  // applied.

  var TabablesBehavior = Marionette.Behavior.extend({

        constructor: function TabablesBehavior(options, view) {
          Marionette.Behavior.prototype.constructor.apply(this, arguments);

          var self = this;

          this.view = view;
          this._pushTabableHandler();

          this.tabableRegions = [];
          this.mustSortTabableRegions = false;

          // Backbone/Marionette events (are removed in destroy)
          this.listenTo(view, 'render', this._registerEventHandlers);
          this.listenTo(view, 'destroy', this._popTabableHandler);
          this.listenTo(view, 'dom:refresh', this.setFocusInActiveTabableRegion);

          //In order to prevent tab from going outside a contained area (i.e. dialog),
          //keydown is monitored on the behavioral view. The event listener will only prevent
          //tab outside the behavior view if paramater "containTabFocus' is set to true.
          // LPAD-54770, Make sure that keydown event is registered only once after view creation
          setTimeout(function () {
            view.$el.on('keydown.csui-tabables', function (event) {
              if (event.keyCode === 9 && getOption.call(self, 'containTabFocus')) {
                return self._maintainTabFocus(event);
              }
            });
          });

          //Used for cases where focus should be removed from the active behavior region
          //and placed in the text focusable region. For example when 'escape' is used to
          //to move focus outside of a textbox area to the next tabable region.
          this.listenTo(view, 'changed:focus', this._setFocusToNextRegion);
        }, // constructor

        registerTabableRegion: function (tabableRegion) {
          if ($.contains(this.view.el, tabableRegion.view.el)) {
            this.unregisterTabableRegionBehavior(tabableRegion);
            this.tabableRegions.push(tabableRegion);
            this.mustSortTabableRegions = true;
            return true;
          } else {
            log.debug('registerTabableRegion: not registering non descendant view ' +
                      tabableRegion.view.constructor.name) &&
            console.log(log.last);
            return false;
          }
        },

        unregisterTabableRegionBehavior: function (tabableRegion) {
          if (tabableRegion) {
            if (_.contains(this.tabableRegions, tabableRegion)) {
              // remove that tabableRegionBehavior from the tabableRegions array
              log.debug('unregisterTabableRegion ' + tabableRegion.view.constructor.name) &&
              console.log(log.last);

              this.tabableRegions = _.reject(this.tabableRegions,
                  function (trb) { return trb === tabableRegion; });

              // log.debug("Unsorted tabable regions:") && console.log(log.last);
              // _.each(this.tabableRegions, function (tabableRegionBehavior) {
              //   log.debug(" " + tabableRegionBehavior.view.constructor.name) &&
              //   console.log(log.last);
              // });

            }
          }
        },

        _pushTabableHandler: function () {
          log.debug('_pushTabableHandler in view ' + this.view.constructor.name) &&
          console.log(log.last);
          if (TabablesBehavior.tabablesHandlers.length > 0) {
            var topTabablesHandler = _.last(TabablesBehavior.tabablesHandlers);

            /*
                        var activeIdx = this._getActiveIndex();
                        if (activeIdx !== undefined) {
                          this.activeTabableRegionIndexBeforePush = activeIdx;
                          var activeTabableRegion = this.tabableRegions[activeIdx];
                          this.focusedElementBeforePush = activeTabableRegion.getCurrentlyFocusedElementFromView();
                        } else {
                          delete this.focusedElementBeforePush;
                          delete this.activeTabableRegionIndexBeforePush;
                        }
            */

            // invalidate all tabindexes in the current tabable regions before adding the new
            // "layer" of tabable regions at the top of the stack.
            // This prevents navigating by tab to any of this tabable regions.
            _.each(topTabablesHandler.tabableRegions, function (tabableRegion) {
              tabableRegion._unregisterEventHandlers.call(tabableRegion);
              topTabablesHandler._clearTabIndexes.call(topTabablesHandler, tabableRegion.view);
            }, this);

          }
          TabablesBehavior.tabablesHandlers.push(this);

          // log.debug("Tabables after Push:");
          // _.each(TabablesBehavior.tabablesHandlers, function (tabableHandler) {
          //   log.debug("    TabablesBehavior of view " + tabableHandler.view.constructor.name);
          // });
        },

        _popTabableHandler: function () {
          if (TabablesBehavior.tabablesHandlers.length > 0) {

            var tabableHandlerToPop = _.last(TabablesBehavior.tabablesHandlers);

            log.debug('_popTabableHandler in view ' + tabableHandlerToPop.view.constructor.name) &&
            console.log(log.last);

            _.each(tabableHandlerToPop.tabableRegions, function (tabableRegion) {
              tabableRegion._unregisterEventHandlers.call(tabableRegion);
            });

            // LPAD-54770. Remove keydown listener
            tabableHandlerToPop.view.$el.off('keydown.csui-tabables');

            tabableHandlerToPop.stopListening(tabableHandlerToPop.view);
            TabablesBehavior.tabablesHandlers.pop();

            // after removing the tabables handler from the stack let the tabable regions, that
            // are now on top of the stack re-set its tabindex values to make it keyboard
            // navigable again
            if (TabablesBehavior.tabablesHandlers.length > 0) {
              var topTabableHandler = _.last(TabablesBehavior.tabablesHandlers);
              _.each(topTabableHandler.tabableRegions, function (tabableRegion) {
                tabableRegion.setInitialTabIndex.call(tabableRegion);
                tabableRegion._registerEventHandlers.call(tabableRegion);
              });

              topTabableHandler._setFocusInActiveTabableRegion();
            }
          }
          // log.debug("Tabables after Pop:") && console.log(log.last);
          // _.each(TabablesBehavior.tabablesHandlers, function (tabableHandler) {
          //   log.debug("    TabablesBehavior of view " + tabableHandler.view.constructor.name) &&
          //   console.log(log.last);
          // });
        },

        _sortTabableRegions: function () {
          var tabableRegions = this.tabableRegions;
          var sortedTabableRegions = [];
          var tabableRegionElements = this.view.$el.find('.' + accessibilityRegionClass);
          tabableRegionElements.each(function (index, el) {
            var trb = _.find(tabableRegions, function (tabableRegion) {
              return tabableRegion.view.el === el;
            });
            if (trb) {
              sortedTabableRegions.push(trb);
            }
          });
          this.tabableRegions = sortedTabableRegions;
          this.mustSortTabableRegions = false;

          // log.debug("Sorted tabable regions:") && console.log(log.last);
          // _.each(this.tabableRegions, function (tabableRegion) {
          //   log.debug("    " + tabableRegion.view.constructor.name) && console.log(log.last);
          // });
        },

        //Get the next tabable region with an accessible focusable element.
        _getNextActiveRegion: function (shiftTab, recursiveNavigate) {
          var regions = this.tabableRegions, i, tabableRegion;

          // don't select regions for tabable which are hidden.
          regions = _.filter(regions, function (region) {
            return !region.$el.hasClass('binf-hidden');
          });

          var lastIndex   = regions.length - 1,
              activeIndex = this._getActiveIndex(regions);

          if (recursiveNavigate) {
            i = shiftTab ? (activeIndex === 0 ? lastIndex : activeIndex - 1) :
                (activeIndex === lastIndex ? 0 : activeIndex + 1);
          } else {
            i = shiftTab ? (activeIndex === 0 ? 0 : activeIndex - 1) :
                (activeIndex === lastIndex ? lastIndex : activeIndex + 1);
          }

          // return tabableRegion if it has only one tabable element.
          if (regions.length === 1) {
            tabableRegion = regions[0];
            return tabableRegion;
          }

          while (i != activeIndex) {
            tabableRegion = regions[i];
            var elToFocus = tabableRegion.getCurrentlyFocusedElementFromView(shiftTab);
            if (tabableRegion.view.isTabable() && elToFocus &&
                base.isVisibleInWindowViewport(elToFocus)) {
              // Do not focus elements out of the visible viewport rectangle;
              // it brings them to the visible screen, ignoring the absolute
              // positioning or transforms, if they were applied earlier
              return tabableRegion;
            }

            if (shiftTab) {
              if (i === 0) {
                i = recursiveNavigate ? lastIndex : activeIndex;
              }
              else if (i > 0) {
                --i;
              }
            }
            else {
              if (i === lastIndex) {
                i = recursiveNavigate ? 0 : activeIndex;
              }
              else if (i < lastIndex) {
                ++i;
              }
            }
          }
        },
        //Due to cases (like the target browser where regions are added and removed throughout a dialog
        //display) where regions may be placed out of order due to views being dynamically added and removed
        //throughout the life cycle of the parent container, sort order is reset on every index request.
        _getActiveIndex: function (regions) {
          if (this.currentlyActiveTabableRegion) {
            this._sortTabableRegions();
            var currentlyActive = this.currentlyActiveTabableRegion,
              tabableRegions  = this.tabableRegions;
            if (!!regions) {
              tabableRegions = regions;
            }
            for (var i = 0; i < tabableRegions.length; i++) {
              if (currentlyActive.view.cid === tabableRegions[i].view.cid) {
                return i;
              }
            }
          }
        },

        _deactivateCurrentActiveTabableRegion: function () {
          var activeIdx = this._getActiveIndex();

          if (activeIdx !== undefined && !!this.tabableRegions[activeIdx]) {
            var activeView = this.tabableRegions[activeIdx].view;
            var tabRegionEl = activeView.$el;

            tabRegionEl.removeClass(accessibilityActiveRegionClass);
            delete this.currentlyActiveTabableRegion;
            if (activeView.accDeactivateTabableRegion) {
              log.debug('deactivating tabable region ' + activeView.constructor.name) &&
              console.log(log.last);

              this.tabableRegions[activeIdx].ignoreFocusEvents = true;
              activeView.accDeactivateTabableRegion.call(activeView);
              this.tabableRegions[activeIdx].ignoreFocusEvents = false;
            }
          }
          return activeIdx;
        },

        _setTabableRegionActive: function (tabableRegion, shiftTab) {
          log.debug('activating ' + tabableRegion.view.constructor.name + ' as active tabable' +
                    ' region') && console.log(log.last);

          this._deactivateCurrentActiveTabableRegion();
          tabableRegion.view.$el.addClass(accessibilityActiveRegionClass);
          this.currentlyActiveTabableRegion = tabableRegion;
          if (tabableRegion.view.accActivateTabableRegion) {
            tabableRegion.ignoreFocusEvents = true;
            tabableRegion.view.accActivateTabableRegion.call(tabableRegion.view, shiftTab);
            tabableRegion.ignoreFocusEvents = false;
          }
        },

        _setFocusInActiveTabableRegion: function (shiftTab) {
          if (this.currentlyActiveTabableRegion) {
            // this._setTabableRegionActive(this.currentlyActiveTabableRegion);
            this.currentlyActiveTabableRegion.setFocus(shiftTab);
          } else {
            // try to focus on a preferred region if no one is known as the active region, but
            // don't store it as the currently active one. This must be actively done by a
            // tabable region.
            var tabableRegionsByWeight = _.sortBy(this.tabableRegions, function (tabableRegion) {
              return tabableRegion.view.options.initialActivationWeight;
            });
            var preferredRegion = _.last(tabableRegionsByWeight);
            if (preferredRegion && preferredRegion.view.options.initialActivationWeight > 0) {
              log.debug("setFocus: " + preferredRegion.view.constructor.name) &&
              console.log(log.last);
              preferredRegion.setFocus(shiftTab);
            }
          }
        },

        _clearTabIndexes: function (view) {
          // log.debug('_clearTabIndexes in view ' + view.constructor.name) && console.log(log.last);
          // find tabable/focusable elements including the view.$el element
          var focusables = view.$el.find(TabablesBehavior.focusablesSelector).addBack(
              TabablesBehavior.focusablesSelector);
          if (focusables.length) {
            focusables.prop('tabindex', -1);
          } else {
            log.debug('_clearTabIndexes: no focusables found in ' + view.constructor.name) &&
            console.log(log.last);
          }
        },

        _maintainTabFocus: function (event) {
          var shiftTab    = event.shiftKey,
              activeIndex = this._getActiveIndex();
          //If an activeIndex is not available it is because regional focus has not
          //been set yet and this is the first tab request.
          if (activeIndex !== undefined) {
            var activeRegion = this.tabableRegions[activeIndex];
            var recursiveNavigate = getOption.call(this, 'recursiveNavigation');
            if (!!activeRegion && activeRegion.onlastTabElement(shiftTab, event)) {
              var nextActiveRegion = this._getNextActiveRegion(shiftTab, false);
              if (!nextActiveRegion) {
                nextActiveRegion = this._getNextActiveRegion(shiftTab, recursiveNavigate);

              }
              if (nextActiveRegion) {
                this._setTabableRegionActive(nextActiveRegion, shiftTab);
                this._setFocusInActiveTabableRegion(shiftTab);
              }
              return false;
            }
          }
          return true;
        },

        _setFocusToNextRegion: function setFocusToNextRegion(shiftTab) {
          var recursiveNavigate = getOption.call(this, 'recursiveNavigation');
          var nextActiveRegion = this._getNextActiveRegion(shiftTab, recursiveNavigate);
          if (nextActiveRegion) {
            this._setTabableRegionActive(nextActiveRegion);
            this._setFocusInActiveTabableRegion();
          }
        }
      },
      {
        // array with all TabablesBehavior instances
        tabablesHandlers: [],

        focusablesSelector: 'a[href], area[href], input, select, textarea, button,' +
                            ' iframe, object, embed, *[tabindex], *[contenteditable]',

        clearTabIndexes: function (view) {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior && $.contains(tabablesBehavior.view.el, view.el)) {
            tabablesBehavior._clearTabIndexes.call(tabablesBehavior, view);
          }
        },

        setTabableRegionActive: function (tabableRegion) {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior && $.contains(tabablesBehavior.view.el, tabableRegion.view.el)) {
            tabablesBehavior._setTabableRegionActive.call(tabablesBehavior, tabableRegion);
          }
        },

        registerTabableRegion: function (tabableRegion) {
          log.debug('registerTabableRegion for view ' + tabableRegion.view.constructor.name) &&
          console.log(log.last);

          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            return tabablesBehavior.registerTabableRegion.call(tabablesBehavior, tabableRegion);
          }
        },

        unregisterTabableRegion: function (tabableRegion) {
          if (tabableRegion) {
            // make it simple: don't search for the tabables behavior instance. Just remove it
            // from everyone.
            _.each(TabablesBehavior.tabablesHandlers, function (tabablesBehavior) {
              tabablesBehavior.unregisterTabableRegionBehavior.call(tabablesBehavior,
                  tabableRegion);
            });
          }
        },

        // Activate (set focus) of the region that has the highest weight value in the tabable
        // region behavior options.
        //  This should be called when regions are actually shown in the dom.
        //  If a region is already active, skip initial activation.

        setFocusInActiveTabableRegion: function activateInitialTabableRegion() {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            tabablesBehavior._setFocusInActiveTabableRegion.call(tabablesBehavior);
          }
        },

        popTabableHandler: function () {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            tabablesBehavior._popTabableHandler();
          }
        }

      });

  // TODO: Expose this functionality and make it generic for other behaviors
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return TabablesBehavior;
});

csui.define('csui/behaviors/keyboard.navigation/tabable.region.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/behaviors/keyboard.navigation/tabables.behavior'
], function (module, _, $, Marionette, log, base, TabablesBehavior) {
  'use strict';

  var TabableRegionBehavior = Marionette.Behavior.extend({

      defaults: {
        initialActivationWeight: 0
      },

      constructor: function TabableRegionBehavior(options, view) {
        Marionette.Behavior.prototype.constructor.apply(this, arguments);

        this.view = view;
        view.tabableRegionBehavior = this;

        // merge behavior defaults into view
        _.extend(view, this.defaults);

        // add default implementation to view if it does not have one
        _.defaults(view, {
            // TODO remove use of isTabable because there is no code that gets called when the user
            // presses the tab key
            isTabable: function () {
              return true;  // default: this view can be reached by tab
            },
            onLastTabElement: function () {
              return true;  //most regions will only have one tab, with further navigation handled through arrow keys
            }
          }
        );

        if (view.options && !view.options.initialActivationWeight) {
          view.options.initialActivationWeight = this.options.initialActivationWeight;
        }

        this._registerEventHandlers();

      },

      _registerEventHandlers: function () {
        if (!this._eventsRegistered) {
          var view = this.view;
          var self = this;

          // log.debug('_registerEventHandlers ' + view.constructor.name) && console.log(log.last);

          this.listenTo(view, 'render', this._applyClasses);
          this.listenTo(view, 'dom:refresh', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (TabablesBehavior.registerTabableRegion(this)) {
              self.isRegistered = true;
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });
          this.listenTo(view, 'refresh:tabindexes', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (self.isRegistered) {
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });

          this.listenTo(view, 'destroy', function () {
            TabablesBehavior.unregisterTabableRegion(this);
            TabablesBehavior.clearTabIndexes(view);
            self.isRegistered = false;
          });
          this.listenTo(view, 'tabable', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (TabablesBehavior.registerTabableRegion(this)) {
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });
          this.listenTo(view, 'tabable:not', function () {
            TabablesBehavior.unregisterTabableRegion(this);
            TabablesBehavior.clearTabIndexes(view);
            this.isRegistered = false;
          });

          this.listenTo(view, 'changed:focus', function () {
            if (self.isRegistered) {
              this.moveTabIndex();
            }
          });

          this.listenTo(view, 'escaped:focus', function () {
            TabablesBehavior.setFocusInActiveTabableRegion();
          });
          this._eventsRegistered = true;
        }
      },

      _unregisterEventHandlers: function () {
        var view = this.view;
        // log.debug('_unregisterEventHandlers ' + view.constructor.name) && console.log(log.last);

        this.stopListening(view);
        this._eventsRegistered = false;
      },

      getCurrentlyFocusedElementFromView: function (shiftTab) {
        if (_.isFunction(this.view.currentlyFocusedElement)) {
          var focusEl = this.view.currentlyFocusedElement({shiftKey: shiftTab});
          return (focusEl instanceof $ ? focusEl : $(focusEl));
        } else {
          if (_.isString(this.view.currentlyFocusedElement)) {
            return this.view.$(this.view.currentlyFocusedElement);
          } else {
            log.debug('setInitialTabIndex: ' + this.view.constructor.name + ' does not have' +
              ' currentlyFocusedElement -> not setting tabindex in that view ') &&
            console.log(log.last);
            return $();
          }
        }
      },

      onlastTabElement: function (shiftTab, event) {
        return this.view.onLastTabElement(shiftTab, event);
      },

      setFocus: function (shiftTab) {
        // Not set focus if the view is requested so that the behavior is not stealing the focus.
        // After rendering, the view is setting focus on element at same location by itself.
        if (this.options.notSetFocus) {
          return;
        }

        var elToFocus = this.getCurrentlyFocusedElementFromView(shiftTab);
        // Do not focus elements out of the visible viewport rectangle;
        // it brings them to the visible screen, ignoring the absolute
        // positioning or transforms, if they were applied earlier
        if (elToFocus && base.isVisibleInWindowViewport(elToFocus)) {
          this.ignoreFocusEvents = true;
          elToFocus.focus();
          this.ignoreFocusEvents = false;
        }
      },

      setInitialTabIndex: function () {
        // TabablesBehavior.clearTabIndexes(this.view);
        if (this.currentlyFocusedElement) {
          this.currentlyFocusedElement.off('focus.' + this.view.cid);
        }
        if (this.view.isTabable()) {
          try {
            this.currentlyFocusedElement = this.getCurrentlyFocusedElementFromView();
            if (this.currentlyFocusedElement && this.currentlyFocusedElement.length > 0) {
              var self = this;
              this.currentlyFocusedElement.prop('tabindex', 0);
              this.currentlyFocusedElement.addClass(
                TabableRegionBehavior.accessibilityActiveElementClass);
              this.currentlyFocusedElement.on('focus.' + this.view.cid, function () {
                if (!self.ignoreFocusEvents) {
                  TabablesBehavior.setTabableRegionActive(self);
                }
              });
            }
          } catch (e) {
            console.warn('Could not set as active element: ', this.view.cid, e.message);
          }

        } else {
          this.currentlyFocusedElement = $();
        }
      },

      moveTabIndex: function () {
        var self = this;
        if (this.currentlyFocusedElement) {
          this.currentlyFocusedElement.off('focus.' + this.view.cid);
          this.currentlyFocusedElement.prop('tabindex', -1);
          this.currentlyFocusedElement.removeClass(
            TabableRegionBehavior.accessibilityActiveElementClass);
          this.currentlyFocusedElement = $();

        }
        var newlyFocusedElement = this.getCurrentlyFocusedElementFromView();
        newlyFocusedElement.prop('tabindex', 0);
        this.currentlyFocusedElement = newlyFocusedElement;
        this.currentlyFocusedElement.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.currentlyFocusedElement.on('focus.' + this.view.cid, function () {
          if (!self.ignoreFocusEvents) {
            TabablesBehavior.setTabableRegionActive(self);
          }
        });
      },

      _applyClasses: function () {
        this.$el.addClass(TabableRegionBehavior.accessibilityRegionClass);
      }
    },
    {
      accessibilityRegionClass: 'csui-acc-tab-region',
      accessibilityActiveRegionClass: 'csui-acc-tab-region-active',
      accessibilityFocusableClass: 'csui-acc-focusable',
      accessibilityActiveElementClass: 'csui-acc-focusable-active'
    }
  );

  return TabableRegionBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/facet.bar/impl/facet.bar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "<button class=\"binf-btn binf-btn-primary csui-filter-save binf-hidden\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.saveAsAria || (depth0 != null ? depth0.saveAsAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveAsAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.saveas || (depth0 != null ? depth0.saveas : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"saveas","hash":{}}) : helper)))
    + "</button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-facet-list-bar\">\r\n  <div class=\"csui-mover csui-overflow-left binf-hidden\">\r\n    <a href=\"#\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.previous || (depth0 != null ? depth0.previous : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"previous","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.previous || (depth0 != null ? depth0.previous : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"previous","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"csui-icon goto_previous_page\"  ></span>\r\n    </a>\r\n    <span class=\"csui-facet-list-fade csui-facet-list-fadein\"></span>\r\n  </div>\r\n\r\n  <div class=\"csui-facet-list-area\"></div>\r\n\r\n  <div class=\"csui-mover csui-overflow-right binf-hidden\">\r\n    <span class=\"csui-facet-list-fade csui-facet-list-fadeout\"></span>\r\n    <a href=\"#\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.next || (depth0 != null ? depth0.next : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"next","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.next || (depth0 != null ? depth0.next : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"next","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"csui-icon goto_next_page\" ></span>\r\n    </a>\r\n  </div>\r\n</div>\r\n\r\n<a href=\"#\" class=\"csui-clear-all binf-hidden\" role=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearAllAria || (depth0 != null ? depth0.clearAllAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearAllAria","hash":{}}) : helper)))
    + "\">\r\n  <div class='cs-icon binf-close'></div>\r\n  <div class='clear-label'>"
    + this.escapeExpression(((helper = (helper = helpers.clearAll || (depth0 != null ? depth0.clearAll : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearAll","hash":{}}) : helper)))
    + "</div>\r\n</a>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showSaveFilter : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_facet.bar_impl_facet.bar', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/facet.bar/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/facet.bar/impl/nls/root/lang',{
  clearAll: 'Clear all',
  saveAs: 'Save As',
  saveAsAria: 'Save as Virtual Folder',
  previous:'Show previous filter(s)',
  next:'Show next filter(s)',
  clearAllAria: 'Clear all filters',
  facetItemAria: 'Selected filter {0}:{1}, press to clear.'
});


csui.define('csui/controls/facet.bar/facet.bar.view',[
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/models/facets",
  "csui/models/facettopics",
  "csui/controls/facet.bar/facet.bar.items.view",
  "csui/behaviors/keyboard.navigation/tabable.region.behavior",
  "hbs!csui/controls/facet.bar/impl/facet.bar",
  "i18n!csui/controls/facet.bar/impl/nls/lang",
  "csui/utils/commands",
  "css!csui/controls/facet.bar/impl/facet.bar"
], function ($, _, Backbone, Marionette, FacetCollection,
    FacetTopicCollection, FacetBarItemsView, TabableRegionBehavior,
    template, lang, commands) {
  'use strict';

  var FacetBarView = Marionette.LayoutView.extend({
    className: 'csui-facet-bar csui-facet-bar-hidden',

    template: template,

    ui: {
      facetListArea: '> .csui-facet-list-bar > .csui-facet-list-area',
      facetList: '> .csui-facet-list-bar > .div.csui-facet-list-area > .csui-facet-list',
      clearAll: '.csui-clear-all',
      moveLeft: '.csui-overflow-left',
      moveRight: '.csui-overflow-right',
      movers: '.csui-mover',
      leftFader: '.csui-mover.csui-overflow-left > .csui-facet-list-fade',
      rightFader: '.csui-mover.csui-overflow-right > .csui-facet-list-fade',
      saveFilter: '.csui-filter-save'
    },

    regions: {
      facetBarItemsRegion: '.csui-facet-list-area',
      clearAllRegion: '.csui-clear-all'
    },

    triggers: {
      'click .csui-clear-all': 'clear:all'
    },

    events: {
      'click @ui.moveLeft': 'onMoveLeft',
      'click @ui.moveRight': 'onMoveRight',
      'click .csui-facet-item .binf-close': 'onRemoveFilter',
      'click @ui.saveFilter': 'onClickSaveFilter',
      'keydown': 'onKeyInView'
    },

    constructor: function FacetBarView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.allTopicsCollection = new Backbone.Collection(this._getAllTopics(
          this.collection.filters));
      this.listenTo(this.collection, 'reset', this._filtersUpdated, this);
      this.onWinResize = _.bind(function () {
        this.render();
        this._filtersUpdated();
      }, this);
      $(window).bind("resize.facetview", this.onWinResize);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode,
          retVal  = true,
          $target = $(event.target);

      switch (keyCode) {
        //delete key
      case 46:
        if ($target.parent().hasClass('csui-facet-item')) {
          this._triggerRemoveFilter($target.find('.binf-close'));
          retVal = false;
        }
        break;
        //enter and space bar
      case 13:
        if ($target.parent().hasClass('csui-facet-item')) {
          this._triggerRemoveFilter($target.find('.binf-close'));
          retVal = false;
        }
        if ($target.hasClass('csui-clear-all')) {
          if (this.ui.saveFilter && this.ui.saveFilter.length > 0) {
            this.ui.saveFilter.addClass('binf-hidden');
          }
          this.trigger('remove:all');
          retVal = false;
        }
        break;
        //ignore space bar but return false as it appears to affect the facet panel scrolling
      case 32:
        retVal = false;
        break;
      }
      return retVal;
    },

    onDestroy: function () {
      $(window).unbind("resize.facetview", this.onWinResize);
    },

    onRender: function () {
      this.visibleItemIndex = 0;
      this.facetBarItemsView = new FacetBarItemsView({collection: this.allTopicsCollection});
      this.listenTo(this.facetBarItemsView, 'overflow', this._makeSlideable);
      this.listenTo(this.facetBarItemsView, 'scrolled', this._updateFading);
      this.facetBarItemsRegion.show(this.facetBarItemsView);
    },

    onMoveLeft: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.facetBarItemsView.scrollRight();
    },

    onMoveRight: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.facetBarItemsView.scrollLeft();
    },

    _makeSlideable: function (hasOverflow) {
      if (hasOverflow) {
        this.ui.facetListArea.addClass('csui-facet-list-overflowed');
        this.ui.movers.removeClass('binf-hidden');
      } else {
        this.ui.facetListArea.removeClass('csui-facet-list-overflowed');
        this.ui.movers.addClass('binf-hidden');
      }
    },

    _updateFading: function (options) {
      if (options.currentScrollLeft === 0) {
        this.ui.leftFader.addClass('binf-hidden');
        this.ui.rightFader.removeClass('binf-hidden');
      } else {
        if (options.currentScrollLeft === options.maxScrollLeft) {
          this.ui.leftFader.removeClass('binf-hidden');
          this.ui.rightFader.addClass('binf-hidden');
        } else {
          this.ui.leftFader.removeClass('binf-hidden');
          this.ui.rightFader.removeClass('binf-hidden');
        }
      }

    },

    _getAllTopics: function () {
      var allTopics = [];
      var filters = this.collection.filters;
      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i],
            values = filter.values,
            facetId = filter.id,
            facet = this.collection.get(facetId),
            facetName = facet.get('name');
        for (var j = 0; j < values.length; j++) {
          var value = values[j],
              topicId = value.id,
              topic = facet.topics.get(topicId),
              topicName = topic.get('name');
          allTopics.push({
            facetName: facetName,
            topicName: topicName,
            facetId: facetId,
            topicId: topicId,
            facetItemAria: _.str.sformat(lang.facetItemAria, facetName, topicName)
          });
        }
      }
      return allTopics;
    },

    _filtersUpdated: function () {
      this.allTopicsCollection.reset(this._getAllTopics(this.collection.filters));
      if (this.allTopicsCollection.length > 0) {
        // this.$el.show();
        // this.$el.removeClass('binf-hidden');
        // this.$el.height('100%');
        this.$el.removeClass('csui-facet-bar-hidden');
        this.$el.find('.csui-clear-all').removeClass('binf-hidden');
        this.trigger('facet:bar:visible');
        // this.$el.parent().removeClass('csui-facet-bar-hidden');
      }
      else {
        // this.$el.hide();
        // this.$el.addClass('binf-hidden');
        // this.$el.height('0px');
        this.$el.addClass('csui-facet-bar-hidden');
        this.$el.find('.csui-clear-all').addClass('binf-hidden');
        this.$el.find('.csui-filter-save').addClass('binf-hidden');
        this.trigger('facet:bar:hidden');
        // this.$el.parent().addClass('csui-facet-bar-hidden');
      }
      if (this.options.showSaveFilter && this.allTopicsCollection.length > 0) {
        if (this.ui.saveFilter && this.ui.saveFilter.length > 0) {
          this.ui.saveFilter.removeClass('binf-hidden');
        }
      }
    },

    templateHelpers: function () {
      return {
        clearAll: lang.clearAll,
        saveas: lang.saveAs,
        saveAsAria: lang.saveAsAria,
        showSaveFilter: this.options.showSaveFilter,
        previous: lang.previous,
        next: lang.next,
        clearAllAria: lang.clearAllAria
      };
    },

    onClearAll: function () {
      if (this.ui.saveFilter && this.ui.saveFilter.length > 0) {
        this.ui.saveFilter.addClass('binf-hidden');
      }
      this.trigger('remove:all');
    },

    onRemoveFilter: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this._triggerRemoveFilter($(e.target));
    },

    applyFilter: function (facet) {
      this.trigger('apply:filter', facet.newFilter);
    },

    onClickSaveFilter: function (event) {
      var context         = this.options.context,
          connector       = this.collection.connector,
          node            = this.collection.node,
          facetCollection = this.collection,
          // Get the SaveFilter command and execute it for the specific node
          saveFilter      = commands.get('SaveFilter'),
          promise         = saveFilter.execute({
            context: context,
            nodes: new Backbone.Collection(node),
            facets: facetCollection,
            container: node,
            connector: connector
          });
      // Wait until the deletion is done and log the result on the console
      promise.always(function () {
        var succeeded = promise.state() === 'resolved';
      });
    },

    _triggerRemoveFilter: function ($target) {
      this.trigger('remove:filter', {
        id: $target.attr('data-csui-facet'),
        values: [
          {id: $target.attr('data-csui-topic')}
        ]
      });
    }
  });

  return FacetBarView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/listitem/impl/listitemstandard',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "<a class=\"csui-tileview-contains-more-btn\"> ";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-type-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\"></span>";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\""
    + this.escapeExpression(((helper = (helper = helpers['end-icon-class'] || (depth0 != null ? depth0['end-icon-class'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"end-icon-class","hash":{}}) : helper)))
    + "\"></span>";
},"7":function(depth0,helpers,partials,data) {
    return "</a>";
},"9":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-tileview-more-btn\"></div>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showInlineActionBar : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableIcon : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<span title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" class=\"list-item-title\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0['end-icon'] : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showInlineActionBar : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showInlineActionBar : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n";
}});
Handlebars.registerPartial('csui_controls_listitem_impl_listitemstandard', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/listitem/impl/listitemstandard',[],function(){});
// Shows a list of links
csui.define('csui/controls/listitem/listitemstandard.view',['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior', 'csui/utils/node.links/node.links',
  'hbs!csui/controls/listitem/impl/listitemstandard',
  'css!csui/controls/listitem/impl/listitemstandard'
], function (require, _, $, Marionette, DefaultActionBehavior, nodeLinks, itemTemplate) {
  'use strict';

  var StandardListItem = Marionette.ItemView.extend({

    tagName: function () {
      return this.showInlineActionBar ? 'div' : 'a';
    },
    className: 'csui-item-standard binf-list-group-item',

    triggers: {
      'click': 'click:item'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    template: itemTemplate,
    templateHelpers: function () {
      return _.reduce(this.options, function (result, name, key) {
        if (typeof name === 'string') {
          var value = this._getValue(name);
          if (key === 'icon') {
            value = 'csui-icon ' + value;
            result.enableIcon = true;
          }
          result[key] = value;
        }
        return result;
      }, {}, this);
    },

    constructor: function StandardListItem(options) {

      if (options.toolbarData) {
        this._setInlineActions(options);
      }

      this.context = options.context;
      Marionette.ItemView.call(this, options);
    },

    _setInlineActions: function (options) {
      this.tileViewToolbarItems = options.toolbarData.toolbaritems || {};
      this.showInlineActionBar = true;
      this.collection = options.toolbarData.collection || {};
      this.triggers = {
        'click @ui.titleName': 'click:item',
        'click @ui.icon': 'click:item'
      };
      this.ui = {
        titleName: '.list-item-title',
        icon: '.csui-icon-group'
      };
      this.events = {
        'mouseenter': 'onShowCommands',
        'mouseleave': 'onDestroyCommands',
        'keydown': 'onKeyDown'
      };

    },

    setElementData: function () {
      var elementData;
      if (this.showInlineActionBar) {
        elementData = this.$el.find("a");

      } else {
        elementData = this.$el;
        elementData.prop('tabindex', '-1');
      }
      return elementData;
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      this.eleData = this.setElementData();
      if (id != null) {
        this.eleData.attr('href', nodeLinks.getUrl(this.model));
      }

      if (this.model && this.options && this.options.checkDefaultAction) {
        var disabled = this.model.fetched === false ||
                       !this.defaultActionController.hasAction(this.model);
        this.$el[disabled ? 'addClass' : 'removeClass']('inactive');
      }
      // console.log("removing a role: " + this.$el.attr('role'));
      this.$el.removeAttr('role'); // these roles on the <a are not valid html
    },

    _getValue: function (name) {
      if (name.indexOf('{') === 0) {
        var names = name.substring(1, name.length - 1).split('.'),
            value = this.model.attributes;
        _.find(names, function (name) {
          value = value[name];
          if (value === undefined) {
            return true;
          }
        });
        return value;
      }
      return name;
    },

    onShowCommands: function (event) {
      if (this.showInlineActionBar) {
        this._showInlineBar(event);
      } else {
        return false;
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger("click:item", {target: this.model});
      }
    },

    _showInlineBar: function (event) {
      this.showInlineActionsLock = true;
      this.$el.addClass('csui-tile-with-more-btn');
      event.preventDefault();
      event.stopPropagation();
      var self            = this,
          requiredModules = ['csui/controls/tableactionbar/tableactionbar.view',
            this.tileViewToolbarItems];

      require(requiredModules, function (TableActionBarView, TileViewToolbarItems) {
        self.inlineBarView = new TableActionBarView(_.extend({
          context: self.options.context,
          originatingView: self,
          commands: self.defaultActionController.commands,
          model: self.model,
          collection: TileViewToolbarItems.inlineActionbar,
          containerCollection: self.collection,
          status: {originatingView: self}
        }, TileViewToolbarItems.inlineActionbar.options));
        if (self.showInlineActionsLock) {
          var inlineBarDiv = self.$el.find('.csui-tileview-more-btn');
          var inlineBarRegion = new Marionette.Region({el: inlineBarDiv});
          inlineBarRegion.show(self.inlineBarView);
        }

      });

    },
    onDestroyCommands: function () {
      this.showInlineActionsLock = false;
      if (this.showInlineActionBar) {
        this.inlineBarView && this.inlineBarView.destroy();
        this.$el.removeClass('csui-tile-with-more-btn');
      } else {
        return false;
      }
    }
  });

  return StandardListItem;
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/list/impl/simplelist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"cs-header binf-panel-heading cs-header-with-go-back\" tabindex=\"0\" role=\"link\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackAria || (depth0 != null ? depth0.goBackAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackAria","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"icon circular arrow_back cs-go-back\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.goBackTooltip || (depth0 != null ? depth0.goBackTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"goBackTooltip","hash":{}}) : helper)))
    + "\"></span>\r\n    <span class=\"cs-title cs-title-with-go-back\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"cs-header binf-panel-heading\" tabindex=\"0\">\r\n    <span class=\"cs-title\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.back_button : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n<div class=\"cs-content\">\r\n  <div class=\"cs-list-group\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_list_impl_simplelist', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/list/impl/simplelistitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-type-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\"></span>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"binf-list-group-item\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.nameTitleAria || (depth0 != null ? depth0.nameTitleAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"nameTitleAria","hash":{}}) : helper)))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableIcon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<span title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\" class=\"list-item-title\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_list_impl_simplelistitem', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/list/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/list/impl/nls/root/lang',{
  goBackTooltip: 'Go back',
  goBackAria: 'Go back to {0}',
  goBackTitleForEmptyTitle: 'Back',
  emptyViewDefaultText: 'No items.',
  clearAll: 'Clear all',
  clearAllAria: 'Clear search',
  expandView: 'Expand',
  expandAria: 'Expand widget',
  searchView: 'Search',
  searchAria: 'Search widget',
  collapseSearch: 'Close search',
  collapseAria: 'Clear all and close search',
  elementsVisibleAria: '{0} Elements are visible',
  nameTitleAria: '{0} of type {1}'
});



csui.define('css!csui/controls/list/impl/simplelist',[],function(){});
// Shows a simply list of items with scrollbar
csui.define('csui/controls/list/simplelist.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/list/impl/simplelist',
  'hbs!csui/controls/list/impl/simplelistitem',
  'csui/utils/nodesprites',
  'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/simplelist'
], function (_, $, Backbone, Marionette, base, ListItemStandardView,
    PerfectScrollingBehavior, nodeLinks, listTemplate, listItemTemplate,
    nodeSpriteCollection, lang) {
  'use strict';

  var SimpleListItemView = Marionette.ItemView.extend({
    constructor: function SimpleListItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'a',

    template: listItemTemplate,

    // a configured icon will only be displayed, if data.enableIcon is set to true
    serializeData: function () {
      var data = Marionette.ItemView.prototype.serializeData.apply(this, arguments);
      if (data) {
        var icon = data.icon;
        if (icon) {
          data.icon = 'csui-icon ' + icon;
        }
      }
      return data;
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      if (id != null) {
        this.$el.attr('href', nodeLinks.getUrl(this.model));
      }
      var exactNodeSprite = nodeSpriteCollection.findByNode(this.model) || {},
          mimeTypeFromNodeSprite;
      if (exactNodeSprite.attributes) {
        mimeTypeFromNodeSprite = exactNodeSprite.get('mimeType');
      }
      var title = mimeTypeFromNodeSprite || this.model.get("type_name") || this.model.get("type");
      if (this.model.get("name") && title) {
        var nameTitleAria = _.str.sformat(lang.nameTitleAria, this.model.get("name"), title);
        this.$el.attr("aria-label", nameTitleAria);
      }
    },

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:item'
    }

  });

  var SimpleListView = Marionette.CompositeView.extend({

    constructor: function SimpleListView(options) {
      options || (options = {});
      options.data || (options.data = {});

      // Provide the perfect scrollbar to every list view by default
      // (Behaviors cannot be inherited; add the PerfectScrolling
      //  to the local clone of the descendant's behaviors.)
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
            return behavior.behaviorClass === PerfectScrollingBehavior;
          }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '> .cs-content',
            suppressScrollX: true,
            // like bottom padding of container, otherwise scrollbar is shown always
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.call(this, options);

      // TODO: Deprecate this, or fix it, so that a collection can be created
      // without breaking the client
      // Passing a collection without knowing its model schema and identifier
      // is not possible in Backbone, where the collections should be indexed
      if (this.options.data && this.options.data.items) {
        if (!this.collection) {
          var ViewCollection = Backbone.Collection.extend({
            model: Backbone.Model.extend({
              idAttribute: null
            })
          });
          this.collection = new ViewCollection();
        }
        this.collection.add(this.options.data.items);
      }
    },

    ui: {
      header: '.cs-header',
      headerGoBack: '.cs-header-with-go-back',
      back: '.cs-go-back',
      backTitle: '.cs-title-with-go-back'
    },

    events: {
      'click @ui.back': 'onClickBack',
      'click @ui.backTitle': 'onClickBack',
      'click @ui.headerGoBack': 'onClickBack'
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': '_onChildRender'
    },

    className: 'cs-simplelist binf-panel binf-panel-default',
    template: listTemplate,

    templateHelpers: function () {
      var backButton = this.options.data.back_button;
      var title = this.options.data.title;
      if (backButton && (title === undefined || title.length === 0)) {
        title = lang.goBackTitleForEmptyTitle;
      }
      return {
        back_button: backButton,
        goBackTooltip: lang.goBackTooltip,
        title: title,
        goBackAria: _.str.sformat(lang.goBackAria, title)
      };
    },

    childViewContainer: '.cs-list-group',

    childView: SimpleListItemView,

    childViewOptions: function () {
      return {
        template: this.options.childViewTemplate
      };
    },

    _onChildRender: function (childView) {
      var $item = childView.$el;
      if ($item.is('[data-csui-active]')) {
        $item.append($('<div>').addClass('arrow-overlay'));
        $item.addClass('binf-active');
      }
    },

    /**
     * Get the selected item's view
     * @returns {Marionette.ItemView}
     */
    getSelectedItem: function () {
      var selectedIndex = this.getSelectedIndex();
      var selectedItem = this.children.findByIndex(selectedIndex);
      return selectedItem;
    },

    /**
     * Get the index of the selected item
     * @returns {Number}
     */
    getSelectedIndex: function () {
      var $selectedItem = this.$el.find('[data-csui-active]');
      var selectedIndex = this.$el.find('.cs-list-group>a').index($selectedItem);
      return selectedIndex;
    },

    /**
     * Set the item with the given index selected
     * @param index
     */
    setSelectedIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return;
      }
      var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1); // index is zero-based
      var $item = this.$(nthChildSel);
      this._setCssItemSelected($item);
      $($item[0]).focus();

      //console.log( 'inview', this._isScrolledIntoView($item));
      var $contentView = this.$('.cs-content');
      if (!this._isScrolledIntoView($item)) {

        var itemPosTop = $item.position().top;
        var deltaScroll = (itemPosTop > 0) ?
                          ($item.height() - $contentView.height()) + itemPosTop : itemPosTop;

        $contentView.animate({
          scrollTop: $contentView.scrollTop() + deltaScroll
        }, 500);
      }

      return;
    },

    selectedIndexElem: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1); // index is zero-based
      var $item = this.$(nthChildSel);
      return $($item[0]);
    },

    selectNext: function () {
      var nSelected = this.getSelectedIndex();
      var nNext = Math.min(nSelected + 1, this.collection.models.length);
      this.setSelectedIndex(nNext);
      return;
    },

    selectPrevious: function () {
      var nSelected = this.getSelectedIndex();
      var nNext = Math.max(nSelected - 1, 0);
      this.setSelectedIndex(nNext);
      return;

    },

    onClickItem: function (src) {
      src.cancelClick = false;
      this.trigger('click:item', src);
      if (src.cancelClick === false) {
        this._setCssItemSelected(src.$el);
      }
      return;
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.clickBack();
    },

    clickBack: function () {
      this.trigger('click:back');
    },

    _setCssItemSelected: function ($item) {
      if (!($item instanceof $)) {
        return;
      }
      // unmark old
      var $active = $item.siblings('[data-csui-active]');
      $active.removeClass('binf-active').removeAttr('data-csui-active');
      $active.find('.arrow-overlay').remove();
      // mark new
      $item.append($('<div>').addClass('arrow-overlay'));
      $item.addClass('binf-active').attr('data-csui-active', '');

      // for keyboard navigation, set tabindex=-1
      $item.siblings().prop('tabindex', '-1');

      return;
    },

    _isScrolledIntoView: function ($item) {
      var $contentWindow = this.$('.cs-content');
      var elemTop = $item.position().top;
      var elemBottom = elemTop + $item.height();
      return ((elemTop >= 0) && (elemBottom <= $contentWindow.height()));
    }
  });

  return SimpleListView;
});

csui.define('csui/controls/facet.panel/impl/facet/facet.key.navigation',['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var KeyEventNavigation = {

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      var retVal = false;

      switch (keyCode) {
        //escape
      case 27:
        this.trigger('escape:focus');
        if (this.activeChild) {
          this.activeChild.removeClass('csui-focus');
        }
        break;
        //Enter and space
      case 32:
      case 13:
        this.execute(this.activeChild);
        break;
        //up arrow, page up
        //down arrow, page down
      case 38:
      case 33:
      case 40:
      case 34:
        //ignore up/down arrow keys for sub-facet. Up/down arrow keys is only relevant
        //on the facet panel or with in the individual filter lists.
        if (this.activeChild && this.activeChild.hasClass('csui-focus')) {
          break;
        }
        retVal = true;
        break;
        //tab/shift-tab
      case 9:
        if (this.activeChild && this.$el.hasClass('csui-focus')) {
          retVal = this.tab(event.shiftKey);
          break;
        }
        retVal = true;
        break;
      default:
        retVal = true;
      }
      return retVal;
    },

    execute: function (activeChild) {
      //If this facet is disabled for selection, then on execution expand or collapse
      //the facet group
      this.$el.addClass('csui-focus');
      if (this.$el.find('.facet-disabled').length) {
        this.onShowFacet();
      }
      else {
        this.setfocus(activeChild);
      }
    },
    setfocus: function (activeChild) {
      (activeChild && activeChild.is(':visible')) || (activeChild = this.getActiveChild());

      if (activeChild.hasClass('csui-focus')) {

        switch (activeChild) {
        case this.ui.facetHeaderIcon:
          if (this.ui.facetHeader.hasClass('binf-disabled')) {
            break;
          }
          activeChild.trigger('click');
          if (this.ui.facetHeaderIcon.hasClass('icon-expandArrowDown')) {
            this.trigger('escape:focus');
            this.activeChild = this.getActiveChild();
          } else {
            activeChild.addClass('csui-focus');
          }
          break;

        case this.ui.apply:
        case this.ui.cancel:
          activeChild.trigger('click');
          this.trigger('escape:focus');
          this.activeChild = undefined;
          break;

        case this.ui.facetMore:
          //reset focus to "show more/less" so that
          //scrolled focus is still on the "show more/less" after the
          //default action
          activeChild.trigger('click');
          if (activeChild === this.ui.facetMore) {
            this.activateChild(activeChild);
          }
        }
      }
      else {
        this.activateChild(activeChild);
      }
    },

    tab: function (shiftTab) {
      var facets = this.$el.find('.csui-facet-item:not(.binf-hidden)');

      if (this.activeChild.hasClass('csui-focus')) {
        if (shiftTab) {
          this.activeChild = this._getPrevActiveChild(facets);
        }
        else {
          this.activeChild = this._getNextActiveChild(facets);
        }

        this.activateChild(this.activeChild);
        return false;
      }

      return true;
    },

    activateChild: function (activeChild) {
      activeChild || (activeChild = this.getActiveChild());
      if (this.prevChild) {
        this.prevChild.removeClass('csui-focus');
      }
      activeChild.addClass('csui-focus');
      activeChild.focus();
      this.prevChild = this.activeChild;
    },

    getActiveChild: function () {
      var childViewContainers = this.$el.find('.csui-facet-item:not(.binf-hidden)');
      if (!this.activeChild || !this.activeChild.is(':visible')) {
        if (this.ui.facetHeaderIcon.hasClass('icon-expandArrowDown')) {
          this.activeChild = this.ui.facetHeaderIcon;
        }
        else {
          this.activeChild = $(childViewContainers[0]).find('span');
          if (this.activeChild.length === 0) {
            this.activeChild = $(childViewContainers[0]).find('div[tabindex]');
          }
          this.activeChildIndex = 0;
        }
      }
      return this.activeChild;
    },

    cursorNextFilter: function (view, keyUp, target) {
      var childViewContainers = this.$el.find('.csui-facet-item:not(.binf-hidden)'),
          numViews            = childViewContainers.length - 1;

      if (keyUp) {
        this.activeChildIndex = this.activeChildIndex === 0 ? numViews : --this.activeChildIndex;
      }
      else {
        this.activeChildIndex = this.activeChildIndex === numViews ? 0 : ++this.activeChildIndex;
      }

      if (target.hasClass('icon')) {
        this.activeChild = $(childViewContainers[this.activeChildIndex]).find('span');
      }
      else {
        this.activeChild = $(childViewContainers[this.activeChildIndex]).find('.csui-filter-name');
      }

      this.children.findByIndex(this.activeChildIndex).activeChild = this.activeChild;
      this.activateChild(this.activeChild);
    },

    _getLastFilterFocus: function (facets) {
      var childIndex = this.activeChildIndex;
      this.activeChildIndex = childIndex && childIndex < facets.length ? childIndex : 0;
      return this.children.findByIndex(this.activeChildIndex).activeChild;
    },

    _getNextActiveChild: function (facets) {
      var nextChild = this.activeChild;

      switch (this.activeChild) {
      case this.ui.facetHeaderIcon:
        if (this.ui.facetHeaderIcon.hasClass('icon-expandArrowUp')) {
          nextChild = this._getLastFilterFocus(facets);
        }
        break;
      case this.ui.facetMore:
        if (this.$el.find('.csui-multi-select').length > 0) {
          nextChild = this.ui.apply;
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetHeaderIcon.hasClass('icon-expandArrowUp')) {
          nextChild = this.ui.facetHeaderIcon;
        }
        break;
      case this.ui.cancel:
        if (this.$el.find('.csui-multi-select').length > 0 &&
            !this.ui.facetHeader.hasClass('binf-disabled') &&
            this.ui.facetHeaderIcon.hasClass('icon-expandArrowUp')) {
          nextChild = this.ui.facetHeaderIcon;
        } else if (this.ui.facetHeader.hasClass('binf-disabled')) {
          nextChild = this._getLastFilterFocus(facets);
        }
        break;
      case this.ui.apply:
        nextChild = this.ui.cancel;
        break;
      default:
        if (this.ui.facetMore.length > 0) {
          nextChild = this.ui.facetMore;
        } else if (this.$el.find('.csui-multi-select').length > 0) {
          nextChild = this.ui.apply;
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetMore.length === 0) {
          nextChild = this.ui.facetHeaderIcon;
        }
      }

      return nextChild;
    },

    _getPrevActiveChild: function (facets) {
      var nextChild = this.activeChild;

      switch (this.activeChild) {
      case this.ui.facetHeaderIcon:
        if (this.$el.find('.csui-multi-select').length > 0) {
          nextChild = this.ui.cancel;
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetMore.length === 0) {
          nextChild = this._getLastFilterFocus(facets);
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetMore.length > 0) {
          nextChild = this.ui.facetMore;
        }
        break;
      case this.ui.facetMore:
        nextChild = this._getLastFilterFocus(facets);
        break;
      case this.ui.cancel:
        nextChild = this.ui.apply;
        break;
      case this.ui.apply:
        if (this.ui.facetMore.length > 0) {
          nextChild = this.ui.facetMore;
        }
        else {
          nextChild = this._getLastFilterFocus(facets);
        }
        break;
      default:
        if (this.ui.facetHeader.hasClass('binf-disabled')) {
          nextChild = this.ui.cancel;
          break;
        }
        nextChild = this.ui.facetHeaderIcon;
      }

      return nextChild;
    }

  };

  return KeyEventNavigation;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/facet.panel/impl/facet/facet.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <span class=\"icon icon-checkbox "
    + this.escapeExpression(((helper = (helper = helpers.showOnHover || (depth0 != null ? depth0.showOnHover : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showOnHover","hash":{}}) : helper)))
    + "\" role=\"checkbox\" aria-checked=\"false\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.filterCheckboxAria || (depth0 != null ? depth0.filterCheckboxAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"filterCheckboxAria","hash":{}}) : helper)))
    + "\" tabindex=\"-1\">\r\n    <input type=\"checkbox\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.filterCheckboxAria || (depth0 != null ? depth0.filterCheckboxAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"filterCheckboxAria","hash":{}}) : helper)))
    + "\"/>\r\n  </span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableCheckBox : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<div class=\"csui-filter-name\" tabindex=\"-1\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.filterTitleAria || (depth0 != null ? depth0.filterTitleAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"filterTitleAria","hash":{}}) : helper)))
    + "\">\r\n  <div class=\"csui-name\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</div>\r\n  <div class=\"csui-total\">"
    + this.escapeExpression(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"total","hash":{}}) : helper)))
    + "</div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_facet.panel_impl_facet_facet.item', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/facet.panel/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/facet.panel/impl/nls/root/lang',{
  facetsTitle: 'Refine by',
  facetTitleAria: 'Refine by {0}',
  searchIconTooltip: 'Search by {0}',
  filterTitleAria: 'Filter {0} with {1} items',
  filterCheckboxAria: 'Filter {0} with {1} items',
  searchClearIconTooltip: 'Clear all',
  emptyFacetMessage: 'No filters available.',
  emptyFilteredFacetMessage: 'No more filters available.',
  loadingFacetMessage: 'Loading filters...',
  failedFacetMessage: 'Loading filters failed.',
  noFiles: 'No drop files were provided.',
  addTypeDenied: 'Cannot add documents to {0}.',
  showMore: 'Show more',
  showMoreAria: 'Show more filters',
  showLess: 'Show less',
  showLessAria: 'Show less filters',
  apply: 'Apply',
  applyFiltersAria: 'Apply selected filters',
  clear: 'Cancel',
  clearFiltersAria: 'Clear selected filters',
  showFacetAria: 'Show facet',
  hideFacetAria: 'Hide facet',
  filterOptions: 'Filter options'
});



csui.define('css!csui/controls/facet.panel/impl/facet/facet.item',[],function(){});
csui.define('csui/controls/facet.panel/impl/facet/facet.item.view',["csui/lib/jquery", "csui/utils/base", "csui/lib/underscore", "csui/lib/marionette",
  "hbs!csui/controls/facet.panel/impl/facet/facet.item",
  'i18n!csui/controls/facet.panel/impl/nls/lang',
  "css!csui/controls/facet.panel/impl/facet/facet.item"
], function ($, base, _, Marionette, template, lang) {

  var FacetItemView = Marionette.ItemView.extend({

    template: template,
    className: 'csui-facet-item',

    constructor: function FacetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.showInputOnHover =  !base.isTouchBrowser();
    },

    triggers: {
      'click .csui-filter-name': 'single:filter:select'
    },

    events: {
      'click input': 'onCheckBoxSelect',
      'change input': 'onChangeValue',
      'keydown > span': 'onKeyInView',
      'keydown .csui-filter-name': 'onKeyInView'
    },

    ui: {
      icon: '> span',
      checkbox: '> span input',
      filterName: '> .csui-filter-name'
    },

    templateHelpers: function(){
      var showOnHover = this.showInputOnHover? '' : 'csui-showAlways';
      var filterTitleAria = _.str.sformat(lang.filterTitleAria, this.options.model.get('name'), this.options.model.get('total'));
      var filterCheckboxAria = _.str.sformat(lang.filterCheckboxAria, this.options.model.get('name'), this.options.model.get('total'));

      return {
        showOnHover: showOnHover,
        enableCheckBox: this.options.enableCheckBoxes,
        filterTitleAria: filterTitleAria,
        filterCheckboxAria: filterCheckboxAria
      };
    },

    onRender: function () {
      this.$el.attr('role', 'menuitem');
    },

    onKeyInView: function(event){
      var keyCode = event.keyCode,
        target = $(event.target);
      switch (keyCode) {
        //Enter and space
        case 32:
        case 13:
          if(target.hasClass('icon')){
            this.ui.checkbox.trigger('click');
          }
          else{
            this.trigger('single:filter:select', this);
          }
          break;
        //right/left arrow
        case 39:
        case 37:
          // moving right/left is of no use as the two locations do not differ in functionality
          // this.trigger('keyleftright', targetElem);
          // this.activeChild = target.hasClass('icon')? this.ui.filterName: this.ui.icon;
          // this.activeChild.focus();
          break;
        case 38:
        case 40:
          this.trigger('keyupdown', keyCode === 38, target);
          break;
        default:
          return true;
      }
      return false;
    },

    onCheckBoxSelect: function(event){
      this.trigger('multi:filter:select', this);
    },

    onChangeValue: function (event) {
      // TODO: Create some interface for checking/unchecking and
      // enabling/disabling the checkbox.  The parent view does
      // it by jquery and has to trigger the change event to get
      // the UI updated.
      var checkbox = event.target;
      if (checkbox.disabled) {
        this.ui.icon
            .removeClass('icon-checkbox icon-checkbox-selected')
            .addClass('icon-checkbox-disabled');
      } else if (checkbox.checked) {
        this.ui.icon
            .removeClass('icon-checkbox icon-checkbox-disabled')
            .addClass('icon-checkbox-selected');
          this.ui.icon[0].setAttribute('aria-checked', 'true');
      } else { // unchecked
        this.ui.icon
            .removeClass('icon-checkbox-selected icon-checkbox-disabled')
            .addClass('icon-checkbox');
        this.ui.icon[0].setAttribute('aria-checked', 'false');
      }
    },

    getIndex: function(){
      return this._index;
    }

  });

  return FacetItemView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/facet.panel/impl/facet/facet',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"csui-filter-more\" role=\"button\" tabindex=\"-1\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.moreFiltersAria || (depth0 != null ? depth0.moreFiltersAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"moreFiltersAria","hash":{}}) : helper)))
    + "\">\r\n        <div class=\"csui-more-text\">"
    + this.escapeExpression(((helper = (helper = helpers.more || (depth0 != null ? depth0.more : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"more","hash":{}}) : helper)))
    + "</div>\r\n        <div class=\"cs-icon "
    + this.escapeExpression(((helper = (helper = helpers['more-icon'] || (depth0 != null ? depth0['more-icon'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"more-icon","hash":{}}) : helper)))
    + "\"></div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"csui-facet-header\">\r\n  <div class=\"header-label\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</div>\r\n  <div class=\"header-count\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"count","hash":{}}) : helper)))
    + "\"> ("
    + this.escapeExpression(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"count","hash":{}}) : helper)))
    + ")</div>\r\n  <div class=\"cs-icon csui-button-icon icon-expandArrowUp\" role=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.showFacetAria || (depth0 != null ? depth0.showFacetAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showFacetAria","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.showFacetAria || (depth0 != null ? depth0.showFacetAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"showFacetAria","hash":{}}) : helper)))
    + "\" tabindex=\"-1\"></div>\r\n</div>\r\n\r\n<div class=\"csui-facet-content "
    + this.escapeExpression(((helper = (helper = helpers['show-content'] || (depth0 != null ? depth0['show-content'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"show-content","hash":{}}) : helper)))
    + "\" role=\"presentation\">\r\n  <div class=\"cs-filter-group\" role=\"presentation\"></div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.more : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <div class=\"csui-facet-controls "
    + this.escapeExpression(((helper = (helper = helpers['show-controls'] || (depth0 != null ? depth0['show-controls'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"show-controls","hash":{}}) : helper)))
    + "\">\r\n      <button class=\"csui-btn binf-btn binf-btn-primary csui-apply\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.applyFiltersAria || (depth0 != null ? depth0.applyFiltersAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"applyFiltersAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.apply || (depth0 != null ? depth0.apply : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"apply","hash":{}}) : helper)))
    + "</button>\r\n      <button class=\"csui-btn binf-btn binf-btn-secondary csui-clear\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearFiltersAria || (depth0 != null ? depth0.clearFiltersAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearFiltersAria","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.clear || (depth0 != null ? depth0.clear : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clear","hash":{}}) : helper)))
    + "</button>\r\n  </div>\r\n\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_facet.panel_impl_facet_facet', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/facet.panel/impl/facet/facet',[],function(){});
csui.define('csui/controls/facet.panel/impl/facet/facet.view',["module",
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/marionette",
  "csui/models/facettopics",
  'csui/controls/facet.panel/impl/facet/facet.key.navigation',
  "csui/utils/log",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  "csui/controls/facet.panel/impl/facet/facet.item.view",
  "hbs!csui/controls/facet.panel/impl/facet/facet",
  "i18n!csui/controls/facet.panel/impl/nls/lang",
  "css!csui/controls/facet.panel/impl/facet/facet"
], function (module, _, $, Marionette, FacetTopicCollection, KeyEventNavigation, log, TabableRegionBehavior,
             FacetItemView, template, lang) {

  var FacetView = Marionette.CompositeView.extend({

    childView: FacetItemView,
    template: template,
    className: 'csui-facet',

    childViewContainer: '.cs-filter-group',

    ui: {
      facetContent: '.csui-facet-content',
      facetHeader: '.csui-facet-header',
      facetHeaderIcon: '.csui-facet-header > .cs-icon',
      facetSubmitControls: '.csui-facet-controls',
      facetCollapseControls: '.csui-facet-collapse-controls',
      facetMoreText: '.csui-more-text',
      facetMoreIcon: '.csui-filter-more .cs-icon',
      facetMore: '.csui-filter-more',
      apply: '.csui-facet-controls .csui-apply',
      cancel: '.csui-facet-controls .csui-clear',
      selectCount: '.header-count'
    },

    childEvents: {
      'single:filter:select': 'onSingleFilterSelect',
      'multi:filter:select': 'onMultiFilterSelect',
      'keyupdown': 'cursorNextFilter',
      'keyleftright': 'cursorInsideFilter'
    },

    events: {
      'click .csui-filter-more:not(.binf-disabled)': 'onShowMore',
      'click .csui-facet-header': 'onShowFacet',
      'mouseleave': 'onMouseLeave',
      'keydown':  'onKeyInView'
    },

    triggers: {
      'click .csui-clear': 'clear:all',
      'click .csui-apply': 'apply:all'
    },

    templateHelpers: function () {
      var moreLabel = this.showAll ? lang.showLess : lang.showMore,
      moreFiltersAria = this.showAll ? lang.showLessAria : lang.showMoreAria;
      return {
        'more': this.collection.length > this.itemsToShow ? moreLabel : undefined,
        'moreFiltersAria': moreFiltersAria,
        'more-icon': this.showAll ? 'icon-expandArrowUp' : 'icon-expandArrowDown',
        'apply': lang.apply,
        'applyFiltersAria': lang.applyFiltersAria,
        'clear': lang.clear,
        'clearFiltersAria': lang.clearFiltersAria,
        'show-controls': this.selectItems.length > 0 ? 'csui-multi-select' : '',
        'show-content': this.showFacet ? '' : 'binf-hidden',
        'showFacetAria': this.showFacet ? lang.hideFacetAria : lang.showFacetAria
      };
    },

    childViewOptions: function () {
      return {
        enableCheckBoxes: this.model.get('select_multiple')
      };
    },

    constructor: function FacetView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.$el.attr('tabindex', 0);
      this.options = options || {};
      this.collection = this.model.topics;
      this.itemsToShow = this.model.get('items_to_show');
      this.showAll = false;
      this.showFacet = true;
      this.selectItems = [];
    },

    onClearAll: function () {
      var checkboxes = this.$el.find('input:checkbox');
      this.selectItems = [];
      this.ui.facetCollapseControls.removeClass('multi-select');
      // Trigger change to inform the facet item view,
      // that the look of the checkbox should change.
      checkboxes.prop('checked', false).trigger('change');
      this._setDisabledFilters(0);
      this.$el.removeClass('multi-select');
      this._updateFacetSubmitControls();
      this.ui.facetHeader.removeClass('binf-disabled');
      this.trigger('activate:facet', this);
    },

    onApplyAll: function () {
      var facet = this.model,
        filters = this._getFilterArray();

      this.newFilter = {
        id: facet.get('id'),
        values: filters
      };
      this.trigger('apply:filter');
    },

    onAddChild: function (childView) {
      //Hide all children with index greater than the set number of items to show from server
      if (childView.getIndex() >= this.itemsToShow) {
        var className = this.showAll ? 'more' : 'more binf-hidden';
        childView.$el.addClass(className);
      }
    },

    onRender: function () {
      if (this.collection.length === 0) {
        this.$el.hide();
      }
      this.$el.attr('role', 'menu');
      this.$el.attr('aria-label', _.str.sformat(lang.facetTitleAria, this.model.get('name')));
    },

    onSingleFilterSelect: function (filter) {
      if (!filter.$el.hasClass('binf-disabled')) {
        if (this.$el.hasClass('multi-select')) {
          filter.$el.find('input:checkbox').click();
        }
        else {
          var facet = this.model;
          this.newFilter = {
            id: facet.get('id'),
            values: [{
              id: filter.model.get('value')
            }]
          };
          this.trigger('apply:filter');
        }
      }
    },

    onShowMore: function (event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.showAll = !this.showAll;
      this._setMoreLabel(this.showAll);
      this.trigger('facet:size:change');
    },

    onShowFacet: function (event) {
      if (event) {
      event.preventDefault();
      event.stopPropagation();
      }
      this.showFacet = !this.showFacet;
      if (this.showFacet) {
        this.ui.facetContent.removeClass('binf-hidden');
        this.ui.facetCollapseControls.removeClass('multi-select');
        this.ui.facetHeaderIcon[0].className = 'cs-icon csui-button-icon icon-expandArrowUp';
        this.ui.facetHeaderIcon[0].setAttribute('aria-label', lang.hideFacetAria);
        this.ui.facetHeaderIcon[0].setAttribute('title', lang.hideFacetAria);
      }
      else {
        var numCheckedItems = this.$el.find("input:checked").length;
        this.ui.facetContent.addClass('binf-hidden');
        this.ui.facetHeaderIcon[0].className = 'cs-icon csui-button-icon icon-expandArrowDown';
        this.ui.facetHeaderIcon[0].setAttribute('aria-label', lang.showFacetAria);
        this.ui.facetHeaderIcon[0].setAttribute('title', lang.showFacetAria);
        if (numCheckedItems) {
          this.ui.facetCollapseControls.addClass('multi-select');
        }
      }
      this.trigger('facet:size:change');
    },

    onMouseLeave: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    getIndex: function () {
      return this._index;
    },

    onMultiFilterSelect: function (childView) {
      var numCheckedItems = this.$el.find("input:checked").length;
      this._updateSelectList(childView);
      this._updateFacetSubmitControls(numCheckedItems);
      this._setDisabledFilters(numCheckedItems);
      this.selectItems = (numCheckedItems === 0) ? [] : this.selectItems;
      this.trigger('activate:facet', this);
    },

    _updateFacetSubmitControls: function () {
      var numCheckedItems = this.$el.find("input:checked").length;

      if (numCheckedItems > 0) {
        this.ui.facetSubmitControls.addClass('csui-multi-select');
        this.$el.addClass('multi-select');
        this.ui.facetHeader.addClass('binf-disabled');
      }
      else {
        this.ui.facetSubmitControls.removeClass('csui-multi-select');
        this.$el.removeClass('multi-select');
        this.ui.facetHeader.removeClass('binf-disabled');
      }
    },

    _updateSelectList: function (childView) {
      var childIndex = childView.getIndex();
      if (this.selectItems[childIndex]) {
        delete this.selectItems[childIndex];
      }
      else {
        this.selectItems[childIndex] = childView;
      }
    },

    _setDisabledFilters: function (numCheckedItems) {
      var unselectedItems = this.$el.find("input:not(:checked)");

      if (numCheckedItems < 5) {
        // Trigger change to inform the facet item view,
        // that the look of the checkbox should change.
        unselectedItems.prop('disabled', false).trigger('change');
        unselectedItems.parent().parent().removeClass('binf-disabled');
      }
      else {
        unselectedItems.prop('disabled', true).trigger('change');
        unselectedItems.parent().parent().addClass('binf-disabled');
      }

      this.ui.selectCount.text(numCheckedItems);
    },

    _setMoreLabel: function (showAll) {
      var moreItems = this.$el.find('.csui-facet-item.more');
      if ( this.ui.facetMoreIcon[0]){
      if (showAll) {
        moreItems.removeClass('binf-hidden');
        this.ui.facetMoreIcon[0].className = 'cs-icon icon-expandArrowUp';
        this.ui.facetMoreText.text(lang.showLess);
        this.ui.facetMore[0].setAttribute('aria-label', lang.showLessAria);
        this.ui.facetMoreText[0].setAttribute('aria-expanded', 'true');
      }
      else {
        moreItems.addClass('binf-hidden');
        this.ui.facetMoreIcon[0].className = 'cs-icon icon-expandArrowDown';
        this.ui.facetMoreText.text(lang.showMore);
        this.ui.facetMore[0].setAttribute('aria-label', lang.showMoreAria);
        this.ui.facetMoreText[0].setAttribute('aria-expanded', 'false');
      }
      }
      this.trigger('facet:size:change');
    },

    _getFilterArray: function () {
      var filters = [];
      _.each(this.selectItems, function (item) {
        if (item) {
          filters.push({
            id: item.model.get('value')
          });
        }
      });
      return filters;
    }

  });

  _.extend(FacetView.prototype, KeyEventNavigation);

  return FacetView;
});

csui.define('csui/controls/facet.panel/impl/facet.panel.key.navigation',['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var KeyEventNavigation = {

    currentlyFocusedElement: function () {
      //change facet group items back to tabindex = 0. Tabable behavior sets all tabindex to -1, which doesn't work for
      //this scenario
      var focusables = this.$('.cs-list-group .csui-facet[tabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
      }
      return this.getActiveChild();
    },
    onSetNextChildFocus: function(childView){
      this.activeChildIndex = childView.getIndex();
    },
    accActivateTabableRegion: function () {
      $(document).unbind('mousedown', this._onRemoveKeyboardFocus);
      $(document).bind('mousedown', this._onRemoveKeyboardFocus);

    },

    _removeKeyboardFocus: function () {
      this.$el.find('.csui-focus').removeClass('csui-focus');
      $(document).unbind('mousedown', this._onRemoveKeyboardFocus);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      var retVal = false;

      switch (keyCode) {
        case 38:
        case 33:
          var prevChild = this._getPrevActiveChild();
          prevChild.focus();
          break;
        //down arrow, page down
        case 40:
        case 34:
          var nextChild = this._getNextActiveChild();
          nextChild.focus();
          break;
        default:
          return true;
      }
      return retVal;
    },

    resetFacetFocus: function(childView){

        childView.$el.focus();
    },



    getActiveChild: function () {
      // FIXMWE: How is it possible, that $childViewContainer is undefined,
      // but somebody called this method?
      if (!this.$childViewContainer) {
        return $();
      }
      if (!this.activeChild){
      var childViewContainer = this.$childViewContainer[0];
        if (childViewContainer && childViewContainer.childNodes[0]) {
        this.activeChild = $(childViewContainer.childNodes[0]);
        this.activeChildIndex = 0;
      }


      }
      return this.activeChild;
    },

    _getNextActiveChild: function(){
      var childNodes = this.$childViewContainer[0].childNodes;
      if(childNodes.length - 1 > this.activeChildIndex){
        this.activeChildIndex++;
      }
      else{
        this.activeChildIndex = 0;
      }

      return $(childNodes[this.activeChildIndex]);
    },

    _getPrevActiveChild: function(){
      var childNodes = this.$childViewContainer[0].childNodes;
      if(this.activeChildIndex > 0){
        this.activeChildIndex--;
      }
      else {
        this.activeChildIndex = childNodes.length - 1;
      }

      return $(childNodes[this.activeChildIndex]);
    }


  };

  return KeyEventNavigation;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/facet.panel/impl/facet.panel',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"cs-header binf-panel-heading\">\r\n    <span class=\"cs-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showTitle : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<!--<div class=\"csui-horizontal-separator\"></div>-->\r\n<div class=\"cs-content\" tabindex=\"-1\">\r\n  <div class=\"cs-list-group\" role=\"region\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\"></div>\r\n</div>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('csui_controls_facet.panel_impl_facet.panel', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/facet.panel/impl/facet.panel',[],function(){});
csui.define('csui/controls/facet.panel/facet.panel.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/facets',
  'csui/controls/list/simplelist.view',
  'csui/controls/facet.panel/impl/facet/facet.view',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/facet.panel/impl/facet.panel.key.navigation',
  'csui/controls/progressblocker/blocker',
  'hbs!csui/controls/facet.panel/impl/facet.panel',
  'i18n!csui/controls/facet.panel/impl/nls/lang',
  'css!csui/controls/facet.panel/impl/facet.panel'
], function (_, $, FacetCollection, SimpleListView, FacetView,
    CollectionStateBehavior, TabableRegionBehavior, KeyEventNavigation,
    BlockingView, template, lang) {
  'use strict';

  var FacetPanelView = SimpleListView.extend({

    template: template,

    className: 'cs-simplelist csui-facet-panel',

    behaviors: {

      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        stateMessages: function () {
          return {
            empty: _.isEmpty(this.facets.filters) ?
                   lang.emptyFacetMessage :
                   lang.emptyFilteredFacetMessage,
            loading: lang.loadingFacetMessage,
            failed: lang.failedFacetMessage
          };
        }
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }

    },

    childView: FacetView,

    childEvents: {
      'apply:filter': 'applyFilter',
      'activate:facet': 'setActiveFacet',
      'facet:size:change': '_updateScrollbar',
      'escape:focus': 'resetFacetFocus'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    templateHelpers: function () {
      var showTitle = this.options.data.showTitle;
      var title = this.options.data.title;
      return {
        showTitle: showTitle,
        title: title
      };
    },

    onAddChild: function (childView) {
      var $child = childView.$el,
          self = this;
      //Hide all children with index greater than the set number of items to show from server
      if (childView.getIndex() === (this.collection.length - 1)) {
        $child.css('border-bottom', '0px');
      }
      $child.on('focus', function () {
        self.onSetNextChildFocus(childView);
      });
    },

    constructor: function FacetPanelView(options) {
      this.facets = options.collection;
      options.collection = this._getAvailableFacets();

      SimpleListView.prototype.constructor.apply(this, arguments);

      this.options.data.title = lang.facetsTitle;
      /* Show title by default if not specified in options*/
      this.options.data.showTitle = this.options.showTitle === undefined ? true :
                                    this.options.showTitle;
      //This function is used in the keyevent.navigation to remove focus from a facet group once focus
      //falls outside the Facet Filter. Within keyevent.navigation 'onRemoveKeyboardFocus' is bound to the
      //browser Documents 'mousedown' event at the time of Tab entry.
      this._onRemoveKeyboardFocus = _.bind(this._removeKeyboardFocus, this);
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue({
          parent: this,
          local: this.options.blockingLocal
        });
      }
    },

    _getAvailableFacets: function () {
      var availableFacets = this.facets.getAvailableFacets();
      this.listenTo(this.facets, 'reset', function () {
        var availableFacets = this.facets.getAvailableFacets();
        this.collection.reset(availableFacets);
      });
      return new FacetCollection(availableFacets);
    },

    isTabable: function () {
      return !(this.$el.parent().hasClass('binf-hidden') || this.$el.parent().hasClass('csui-facetview-hidden'));
    },

    onRenderCollection: function () {
      this.trigger('refresh:tabindexes');
    },

    onBeforeDestroy: function () {
      $(document).unbind('mousedown', this._onRemoveKeyboardFocus);
    },

    applyFilter: function (facet) {
      this.trigger('apply:filter', facet.newFilter);
    },

    //Set active facet and disable all others.
    setActiveFacet: function (facet) {
      if (facet.selectItems.length > 0) {
        this.children.each(function (view) {
          if (view.getIndex() !== facet.getIndex()) {
            view.$el.find('.csui-facet-content').addClass('facet-disabled');
          }
        });
      }
      else {
        this.$el.find('.csui-facet-content').removeClass('facet-disabled');
      }
    },

    _updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    }

  });

  _.extend(FacetPanelView.prototype, KeyEventNavigation);
  return FacetPanelView;

});

csui.define('csui/controls/list/behaviors/list.view.keyboard.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  //
  // This behavior implements a default keyboard navigation for the ListView.
  // Include this behavior in your view (if derived from ListView) to enable keyboard navigation.
  //

  // keep the numbers in sequence for value increment/decrement computation
  var TabPosition = {
    none: -1,
    header: 0,
    list: 1,
    footer: 2
  };

  var ListViewKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function ListViewKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'show', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'childview:click:item childview:click:tree:header', function (item) {
        // clear the currently focused element
        var selIndex = view.selectedIndex;
        var selectedElem = view.getElementByIndex(selIndex);
        selectedElem && selectedElem.prop('tabindex', '-1');
        // set the new element tabindex
        view.currentTabPosition = TabPosition.list;
        view.selectedIndex = view.collection.indexOf(item.model);
        selectedElem = view.getElementByIndex(view.selectedIndex);
        selectedElem && selectedElem.prop('tabindex', '0');
      });
      this.listenTo(view, 'change:filterValue', function () {
        // when search filter changes, reset the focus element to the first item
        // change this if UX has a different design
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'before:collection:scroll:fetch', function () {
        view._beforeCollectionScrollFetch();
      });
      this.listenTo(view, 'collection:scroll:fetch', function () {
        view._afterCollectionScrollFetch();
      });

      _.extend(view, {

        _focusHeader: function (event) {
          this.currentTabPosition = TabPosition.header;
          var shiftTab = event && event.shiftKey;
          if (shiftTab) {
            return $(this.ui.searchIcon);
          } else if (this.ui.searchInput.css && this.ui.searchInput.css('display') !== 'none') {
            return $(this.ui.searchInput);
          } else {
            return $(this.ui.searchIcon);
          }
        },

        _focusList: function (event) {
          // set focus back to the last focused element
          this.currentTabPosition = TabPosition.list;
          if (this.selectedIndex < 0 || this.selectedIndex > this.collection.length - 1) {
            // safety check: set to the first item if selectedIndex is out-of-range
            this.selectedIndex = 0;
          }
          return this.getElementByIndex(this.selectedIndex, event);
        },

        _focusFooter: function () {
          this.currentTabPosition = TabPosition.footer;
          return $(this.ui.tileExpand);
        },

        currentlyFocusedElement: function (event) {
          if (event && event.shiftTab) {
            if (this._footerIsVisible()) {
              return this._focusFooter();
            } else {
              return this._focusList();
            }
          } else {
            if (this._headerIsVisible()) {
              return this._focusHeader();
            } else {
              return this._focusList();
            }
          }
        },

        _footerIsInFocus: function () {
          if (this.currentTabPosition === TabPosition.footer || this.ui.tileExpand.is(":focus")) {
            return true;
          } else {
            return false;
          }
        },

        _footerIsVisible: function () {
          if (!this.ui.tileExpand.css || this.ui.tileExpand.css('display') === 'none' ||
              this.ui.tileExpand.hasClass('binf-hidden')) {
            return false;
          } else {
            return true;
          }
        },

        isMoreActionsDropdownOpen: function () {
          return this.$el.find('.csui-table-cell-name-appendix .csui-table-actionbar' +
                               ' .binf-dropdown-menu').is(':visible') ? true : false;
        },

        _headerIsInFocus: function () {
          if (this.currentTabPosition === TabPosition.header || this.ui.searchIcon.is(":focus") ||
              this.ui.searchInput.is(":focus") || this.ui.clearer.is(":focus")) {
            return true;
          } else {
            return false;
          }
        },

        _headerIsVisible: function () {
          if (!this.ui.searchIcon.css || this.ui.searchIcon.css('display') === 'none' ||
              this.ui.searchIcon.hasClass('binf-hidden')) {
            return false;
          } else {
            return true;
          }
        },

        _beforeCollectionScrollFetch: function () {
          this.selectedIndexInFocus = false;
          if (this.selectedIndex >= 0 && this.selectedIndex < this.collection.length) {
            var $elem = this.getElementByIndex(this.selectedIndex);
            if ($elem && $elem.is(":focus")) {
              $elem.prop('tabindex', '-1');
              this.selectedIndexInFocus = true;
            }
          }
        },

        _afterCollectionScrollFetch: function () {
          if (this.selectedIndexInFocus === true && this.selectedIndex >= 0 &&
              this.selectedIndex < this.collection.length) {
            setTimeout(_.bind(function () {
              var $elem = this.getElementByIndex(this.selectedIndex);
              if ($elem) {
                $elem.prop('tabindex', '0');
                $elem.focus();
              }
            }, this), 100);
          }
        },

        _onKeyInSearchArea: function (event) {
          if (this.ui.searchIcon.is(":focus") || this.ui.clearer.is(":focus")) {
            event.preventDefault();
            event.stopPropagation();
            $(event.target).click();
          } else if (this.ui.searchInput.is(":focus") && event.keyCode === 13) {  // Enter (13)
            event.preventDefault();
            event.stopPropagation();
            this.filterChanged(event);
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();
          // this.trigger('changed:focus', this);
          setTimeout(_.bind(function () {
            this.trigger('before:keyboard:change:focus');
            $preElem && $preElem.prop('tabindex', '-1');
            $elem && $elem.prop('tabindex', '0');
            $elem && $elem.focus();
            this.trigger('after:keyboard:change:focus');
          }, this), 50);
        },

        onKeyInView: function (event) {
          if (event.keyCode === 9) {  // tab (9)
            var curPos = this.currentTabPosition;
            if (this._headerIsInFocus() && !this.ui.searchIcon.is(":focus")) {
              return;
            }
            if (this._headerIsInFocus()) {
              curPos = this.currentTabPosition = TabPosition.header;
            }
            if (this._footerIsInFocus()) {
              curPos = this.currentTabPosition = TabPosition.footer;
            }

            if (event.shiftKey) {  // shift tab -> activate previous region
              curPos -= this.collection.length === 0 ? 2 : 1;
            } else {
              curPos += this.collection.length === 0 ? 2 : 1;
            }
            if (curPos === TabPosition.header && !this._headerIsVisible()) {
              curPos -= 1;
            }
            if (curPos === TabPosition.footer && !this._footerIsVisible()) {
              curPos += 1;
            }

            switch (curPos) {
            case TabPosition.header:
              this._moveTo(event, this._focusHeader(event));
              break;
            case TabPosition.list:
              this._moveTo(event, this._focusList());
              break;
            case TabPosition.footer:
              this._moveTo(event, this._focusFooter());
              break;
            default:
              this.currentTabPosition = TabPosition.none;
              break;
            }
          } else if (event.keyCode === 32 || event.keyCode === 13) {  // space (32) or enter (13)
            if (this._headerIsInFocus()) {
              this.currentTabPosition = TabPosition.header;
              this._onKeyInSearchArea(event);
            } else {
              event.preventDefault();
              event.stopPropagation();
              $(event.target).click();
            }
          } else if (event.keyCode === 27) {  // escape (27)
            if (this.isMoreActionsDropdownOpen()) {
              return false;
            } else if (this._headerIsInFocus()) {
              event.preventDefault();
              event.stopPropagation();
              var bIsSearchVisible = this.ui.searchInput.is(":visible");
              if (bIsSearchVisible) {
                this.searchClicked(event);
                setTimeout(_.bind(function () {
                  this.ui.searchIcon.prop('tabindex', '0');
                  this.ui.searchIcon.focus();
                }, this), 250);
              }
            }
          }
        },

        onKeyDown: function (event) {
          if (this._headerIsInFocus() || this._footerIsInFocus()) {
            this.onKeyInView(event);
            return;
          }

          var $preElem;  // get this $preElem before any _select*() method call
          switch (event.which) {
          case 33: // page up (30)
          case 36: // home (36)
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectFirst(), $preElem);
            break;
          case 34: // page down (34)
          case 35: // end (35)
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectLast(event), $preElem);
            break;
          case 38: // arrow up (38)
            if (this.selectedIndex > 0) {
              $preElem = this.getElementByIndex(this.selectedIndex);
              this._moveTo(event, this._selectPrevious(event), $preElem);
            } else {
              // do not get $preElem because it would change the internal position index
              event.preventDefault();
              event.stopPropagation();
            }
            break;
          case 40: // arrow down (40)
            if (this.selectedIndex < this.collection.length - 1) {
              $preElem = this.getElementByIndex(this.selectedIndex);
              this._moveTo(event, this._selectNext(), $preElem);
            } else {
              // do not get $preElem because it would change the internal position index
              event.preventDefault();
              event.stopPropagation();
            }
            break;
          default:
            this.onKeyInView(event);
            return; // exit this handler for other keys
          }
        },

        _selectFirst: function () {
          this.selectedIndex = 0;
          return this.getElementByIndex(this.selectedIndex);
        },

        _selectLast: function (event) {
          // try from the last item to find the last focusable item
          var focusableItem;
          var currentIndex = this.selectedIndex;
          if (currentIndex < 0 || currentIndex >= this.collection.length) {
            currentIndex = 0;
          }
          var focusableIndex = this.collection.length;
          while (focusableIndex > currentIndex && !focusableItem) {
            focusableIndex--;
            focusableItem = this.getElementByIndex(focusableIndex, event);
          }
          if (focusableItem) {
            this.selectedIndex = focusableIndex;
            return focusableItem;
          }
          return this.getElementByIndex(this.selectedIndex);  // no change of focus
        },

        _selectNext: function () {
          // keep trying next item until find a focusable item
          var focusableItem;
          var focusableIndex = this.selectedIndex;
          if (focusableIndex < 0 || focusableIndex >= this.collection.length) {
            focusableIndex = -1;
          }
          while (focusableIndex < this.collection.length - 1 && !focusableItem) {
            focusableIndex++;
            focusableItem = this.getElementByIndex(focusableIndex);
          }
          if (focusableItem) {
            this.selectedIndex = focusableIndex;
            return focusableItem;
          }
          return this.getElementByIndex(this.selectedIndex);  // no change of focus
        },

        _selectPrevious: function (event) {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.getElementByIndex(this.selectedIndex, event);
        }

      });

    }, // constructor

    refreshTabableElements: function (view) {
      log.debug('ListViewKeyboardBehavior::refreshTabableElements ' + view.constructor.name) &&
      console.log(log.last);
      this.view.currentTabPosition = TabPosition.none;
      this.view.selectedIndex = -1;
    }

  });

  return ListViewKeyboardBehavior;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/list/impl/emptylist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"cs-emptylist-placeholder\"></div>\r\n<div class=\"cs-emptylist-text\"><p class=\"csui-no-result-message\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"text","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"text","hash":{}}) : helper)))
    + "</p></div>\r\n<div class=\"cs-emptylist-placeholder\"></div>\r\n";
}});
Handlebars.registerPartial('csui_controls_list_impl_emptylist', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/list/impl/emptylist',[],function(){});
// Shows a list of items
csui.define('csui/controls/list/emptylist.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/list/impl/emptylist',
  'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/emptylist'
], function (_, $, Marionette, emptyListTemplate, lang) {


  var EmptyListView = Marionette.ItemView.extend({

    constructor: function EmptyListView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    className: 'cs-emptylist-container',

    template: emptyListTemplate,

    templateHelpers: function() {
      return {
        text: this.options.text || lang.emptyViewDefaultText
      };
    }

  });

  return EmptyListView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/list/impl/list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"tile-type-icon\">\r\n      <span class=\"icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expandAria || (depth0 != null ? depth0.expandAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandAria","hash":{}}) : helper)))
    + "\"></span>\r\n    </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageUrl : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"tile-type-image "
    + this.escapeExpression(((helper = (helper = helpers.imageClass || (depth0 != null ? depth0.imageClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageClass","hash":{}}) : helper)))
    + "\">\r\n        <span class=\"tile-type-icon tile-type-icon-img\"><img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageUrl || (depth0 != null ? depth0.imageUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageUrl","hash":{}}) : helper)))
    + "\"\r\n                                                             alt=\""
    + this.escapeExpression(((helper = (helper = helpers.expandAria || (depth0 != null ? depth0.expandAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandAria","hash":{}}) : helper)))
    + "\"></span>\r\n      </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"search-box\">\r\n        <input class=\"search\" type=\"search\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.searchPlaceholder || (depth0 != null ? depth0.searchPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchPlaceholder","hash":{}}) : helper)))
    + "\"\r\n               title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchPlaceholder || (depth0 != null ? depth0.searchPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchPlaceholder","hash":{}}) : helper)))
    + "\">\r\n        <span class=\"clearer csui-icon formfield_clear\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.clearAll || (depth0 != null ? depth0.clearAll : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearAll","hash":{}}) : helper)))
    + "\"\r\n              aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.clearAllAria || (depth0 != null ? depth0.clearAllAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clearAllAria","hash":{}}) : helper)))
    + "\" role=\"button\"></span>\r\n        <span class=\"fadeout csui-icon\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchPlaceholder || (depth0 != null ? depth0.searchPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchPlaceholder","hash":{}}) : helper)))
    + "\"></span>\r\n      </div>\r\n      <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.searchTooltip || (depth0 != null ? depth0.searchTooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchTooltip","hash":{}}) : helper)))
    + "\" class=\"cs-search-icon icon icon-search\" role=\"button\"\r\n            aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.searchAria || (depth0 != null ? depth0.searchAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"searchAria","hash":{}}) : helper)))
    + "\" aria-expanded=\"false\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"tile-header\">\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\r\n  <div class=\"tile-title\">\r\n    <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n\r\n  <div class=\"tile-controls\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hideSearch : depth0),{"name":"if","hash":{},"fn":this.noop,"inverse":this.program(6, data, 0)})) != null ? stack1 : "")
    + "  </div>\r\n\r\n</div>\r\n<div class=\"tile-content\" role=\"listbox\">\r\n  <div class=\"binf-list-group\"></div>\r\n  <div class=\"binf-sr-only\" aria-live=\"off\"></div>\r\n</div>\r\n\r\n<div class=\"tile-footer\">\r\n  <div class=\"cs-more tile-expand\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expandTitle || (depth0 != null ? depth0.expandTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandTitle","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expandAria || (depth0 != null ? depth0.expandAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandAria","hash":{}}) : helper)))
    + "\"\r\n       role=\"button\">\r\n    <div class=\"icon circular icon-tileExpand\"></div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_list_impl_list', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/list/impl/list',[],function(){});
// Shows a list of items
csui.define('csui/controls/list/list.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior', 'i18n',
  'hbs!csui/controls/list/impl/list', 'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/list', 'csui/lib/jquery.ui/js/jquery-ui'
], function (_, $, Marionette, base, EmptyListView,
    PerfectScrollingBehavior, i18n, listTemplate, lang) {

  var ListItemView = Marionette.ItemView.extend({

    constructor: function ListItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  var ListView = Marionette.CompositeView.extend({

    direction: !!i18n.settings.rtl ? 'left' : 'right',

    constructor: function ListView(options) {
      options || (options = {});
      _.defaults(options, {
        filterValue: ''
      });

      // Provide the perfect scrollbar to every list view by default
      // (Behaviors cannot be inherited; add the PerfectScrolling
      //  to the local clone of the descendant's behaviors.)
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
        return behavior.behaviorClass === PerfectScrollingBehavior;
      }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '> .tile-content',
            suppressScrollX: true,
            // like bottom padding of container, otherwise scrollbar is shown always
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.prototype.constructor.call(this, options);

      // let's child view decide the key's values, if not, master view provides the default values.
      var currentListTitle = !!this.templateHelpers() && !!this.templateHelpers().title ?
                             ' ' + this.templateHelpers().title.toLowerCase() : '',
          messages         = {
            'expandTitle': _.str.sformat(lang.expandView, currentListTitle),
            'expandAria': lang.expandAria,
            'searchTooltip': _.str.sformat(lang.searchView, currentListTitle),
            'collapseSearchTooltip': lang.collapseSearch
          };
      this.templateHelpers = _.defaults(this.templateHelpers(), lang, messages);
    },

    templateHelpers: function () {
    },

    setValidator: function () {
      this.validator = setInterval(_.bind(this.validateInput, this), 10);
    },

    unsetValidator: function () {
      clearInterval(this.validator);
    },

    className: 'cs-list tile content-tile',
    template: listTemplate,

    childViewContainer: '.binf-list-group',
    childView: ListItemView,
    childViewOptions: function () {
      return {
        template: this.options.childViewTemplate
      };
    },

    emptyView: EmptyListView,

    ui: {
      headerTitle: '.tile-title',
      searchIcon: '.cs-search-icon',
      searchBox: '.search-box',
      searchInput: '.search',
      clearer: '.clearer',
      tileExpand: '.tile-expand',
      fadeout: '.fadeout'
    },

    events: {
      'keydown': 'onKeyDown'
    },

    triggers: {
      'click .tile-header': 'click:header'
    },

    // empty base method to be overridden by derived class for keyboard navigation if needed
    onKeyDown: function (event) {
      // don't add any code here
    },

    onRender: function () {
      this.ui.searchInput.hide();
      this.ui.clearer.toggle(false);

      this.ui.searchIcon.on('click', _.bind(this.searchClicked, this));
      this.ui.searchBox.on('click', _.bind(this.searchBoxClicked, this));
      this.ui.clearer.on('click', _.bind(this.searchFieldClearerClicked, this));
      this.ui.searchInput.on('input', _.bind(this.searchInput, this));

      this.srOnly = this.$el.find('.tile-content .binf-sr-only');
      this.tileHeader = this.$el.find('.tile-header');

      this.titleId = _.uniqueId("dlgTitle");
      this.$(this.ui.headerTitle).find('.csui-heading').attr('id', this.titleId);
      this.$(this.tileHeader).parent().attr('role', 'region').attr('aria-labelledby', this.titleId);

      // activate the screen reader summary in the content when the header is focused
      this.tileHeader.focusin(_.bind(this.focusinAria, this));

      // deactivate the screen reader summary when the header looses focus
      this.tileHeader.focusout(_.bind(this.focusoutAria, this));
    },

    focusinAria: function () {
      this.srOnly.attr('aria-live', 'polite');
      this.setElementsVisibleAria();
    },

    focusoutAria: function () {
      this.srOnly.attr('aria-live', 'off');
      this.srOnly.html('');
    },

    searchBoxClicked: function (event) {
      event.stopPropagation();
    },

    searchFieldClearerClicked: function () {
      this.ui.searchInput.val('');
      this.filterChanged();
      this.ui.searchInput.focus();
    },

    isSearchOpen: function () {
      return this.ui.searchInput.is && this.ui.searchInput.is(":visible");
    },

    searchClicked: function (event) {
      this.ui.searchInput.val('');
      this.ui.clearer.toggle(false);

      this.ui.headerTitle.toggle('fade', _.bind(function () {
        this._resetFilter();
      }, this));

      this.ui.searchInput.toggle('blind', {direction: this.direction}, 200, _.bind(function () {
        if (this.isSearchOpen()) {
          this.setValidator();
          this.ui.searchInput.prop('tabindex', '0');
          this.ui.searchInput.focus();
          this.ui.fadeout.show();
          this.iconsAriaLabel = this.$(this.ui.searchIcon).attr("aria-label");
          this.$(this.ui.searchIcon).attr("title", lang.collapseSearch).attr("aria-expanded",
              "true").attr("aria-label", lang.collapseAria);
          this.$(this.ui.searchIcon).addClass('icon-search-hide');
        } else {
          this.unsetValidator();
          this.ui.fadeout.hide();
          this.$(this.ui.searchIcon).attr("title", this.templateHelpers.searchTooltip).attr(
              "aria-expanded", "false").attr("aria-label", this.iconsAriaLabel);
          this.$(this.ui.searchIcon).removeClass('icon-search-hide');
        }
        return;
      }, this));

      event && event.stopPropagation();

      return;
    },

    validateInput: function () {
      if (!this.ui.searchInput.val) {
        return;
      }
      var bIsFilled = this.ui.searchInput.val && !!this.ui.searchInput.val().length;
      this.ui.clearer.toggle(bIsFilled);
      this.ui.clearer.prop('tabindex', bIsFilled ? '0' : '-1');
    },

    searchInput: function (event) {
      // performance enhancement: queue key input and change filter when user slows down typing
      if (this.keyInputTimer) {
        clearTimeout(this.keyInputTimer);
      }
      this.keyInputTimer = setTimeout(_.bind(function () {
        this.keyInputTimer = undefined;
        this.filterChanged();
      }, this), 300);
    },

    filterChanged: function () {
      this.options.filterValue = this.ui.searchInput.val();
      this.trigger('change:filterValue');
      this.setElementsVisibleAria();
    },

    setElementsVisibleAria: function () {
      // provide the number of visible elements to the screenreader
      var numElements = this.collection ? this.collection.size() : '0';
      this.srOnly.html(_.str.sformat(lang.elementsVisibleAria, numElements));
    },

    _resetFilter: function () {
      this.ui.searchInput.val('');
      // Filter changing event is triggered only by keyboard and mouse
      this.filterChanged();
    },

    // return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var targetEle   = this.showInlineActionBar ? 'div.csui-item-standard:nth-child({0})' :
                        'div a:nth-child({0})',
          nthChildSel = _.str.sformat(targetEle, index + 1),
          $item       = this.$(nthChildSel);
      return $($item[0]);
    }

  });

  return ListView;

});

csui.define('csui/controls/list/list.state.view',[
  'csui/behaviors/collection.state/collection.state.view',
  'hbs!csui/controls/list/impl/emptylist',
  'css!csui/controls/list/impl/emptylist'
], function (CollectionStateView, emptyListTemplate) {
  'use strict';

  var ListStateView = CollectionStateView.extend({

    constructor: function ListStateView() {
      CollectionStateView.prototype.constructor.apply(this, arguments);
    },

    className: 'cs-emptylist-container ' + CollectionStateView.prototype.className,

    template: emptyListTemplate,

    serializeData: function () {
      var data = CollectionStateView.prototype.serializeData.apply(this, arguments);
      return {
        text: data.message
      };
    }

  });

  return ListStateView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/listitem/impl/simpletreelistitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"csui-button-icon container-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)));
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)));
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"csui-button-icon dropdown-icon icon-expandArrowUp\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.collapseLabel || (depth0 != null ? depth0.collapseLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"collapseLabel","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"csui-button-icon dropdown-icon icon-expandArrowDown\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expandLabel || (depth0 != null ? depth0.expandLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandLabel","hash":{}}) : helper)))
    + "\"></span>\r\n";
},"11":function(depth0,helpers,partials,data) {
    return " binf-hidden";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"cs-header binf-panel-heading\" tabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaName || (depth0 != null ? depth0.ariaName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaName","hash":{}}) : helper)))
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <span class=\"cs-title\" title=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.tooltip : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0)})) != null ? stack1 : "")
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.expand : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0)})) != null ? stack1 : "")
    + "</div>\r\n\r\n<div class=\"cs-content"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.expand : depth0),{"name":"unless","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\">\r\n  <div role=\"group\" class=\"cs-list-group\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_listitem_impl_simpletreelistitem', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/controls/listitem/impl/simpletreelistleaf',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.tooltip || (depth0 != null ? depth0.tooltip : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"tooltip","hash":{}}) : helper)));
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)));
},"5":function(depth0,helpers,partials,data) {
    return "<span class=\"csui-tileview-more-btn\"></span>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"binf-list-group-item\">\r\n  <span class=\"csui-type-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\"></span>\r\n  <span title=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.tooltip : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "\"\r\n        class=\"list-item-title\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n  "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showInlineActionBar : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_listitem_impl_simpletreelistleaf', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/listitem/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/listitem/impl/nls/root/lang',{
  treeListExpandTooltip: 'Expand',
  treeListCollapseTooltip: 'Collapse'
});



csui.define('css!csui/controls/listitem/impl/simpletreelistitem',[],function(){});
// Shows a simply tree list of items with scrollbar
csui.define('csui/controls/listitem/simpletreelistitem.view',['require',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/list/emptylist.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/node.links/node.links', 'csui/behaviors/default.action/default.action.behavior',
  'hbs!csui/controls/listitem/impl/simpletreelistitem',
  'hbs!csui/controls/listitem/impl/simpletreelistleaf',
  'i18n!csui/controls/listitem/impl/nls/lang',
  'css!csui/controls/listitem/impl/simpletreelistitem'
], function (require, _, $, Backbone, Marionette, base, EmptyListView, NodeTypeIconView,
    PerfectScrollingBehavior, nodeLinks, DefaultActionBehavior, treeListItemTemplate,
    treeListLeafTemplate, lang) {
  'use strict';

  // keep the numbers in sequence for value increment/decrement computation
  var TabPosition = {
    none: -1,
    header: 0,
    list: 1
  };

  var SimpleTreeListLeafView = Marionette.ItemView.extend({

    tagName: 'a',

    attributes: function () {
      return {
        role: 'treeitem'
      };
    },

    template: treeListLeafTemplate,

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:item'
    },
    events: function () {
      var evts = {
        'keydown': 'onKeyDown'
      };

      if (!!this.options.toolbarData) {
        evts = _.extend(evts, {
          'click': 'onExecuteClick',
          'mouseenter': 'onShowCommands',
          'mouseleave': 'onDestroyCommands'
        });
      }

      return evts;
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    onExecuteClick: function (event) {
      if (($(event.target).closest('.csui-tileview-more-btn').length === 1)) {
        // let's open the drop-down.
        return true;
      }
      else {
        // let's execute the default action.
        event.stopPropagation();
        event.preventDefault();
        this.trigger('click:item', {target: this.model});
      }
    },

    constructor: function SimpleTreeListLeafView(options) {
      this.showInlineActionBar = !!options.toolbarData;
      if (this.showInlineActionBar) {
        this.triggers = {};
        this._setInlineActions(options);
      }
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.context = options.context;

    },
    _setInlineActions: function (options) {

      this.tileViewToolbarItems = options.toolbarData.toolbaritems || {};
      this.collection = options.toolbarData.collection || {};
    },

    onShowCommands: function (event) {
      this.$el.addClass('csui-tile-with-more-btn');
      this._showInlineBar(event);
    },

    _showInlineBar: function (event) {
      this.showInlineActionsLock = true;
      event.preventDefault();
      event.stopPropagation();
      var requiredModules = ['csui/controls/tableactionbar/tableactionbar.view',
        this.tileViewToolbarItems];

      require(requiredModules, _.bind(function (TableActionBarView, TileViewToolbarItems) {
        this.inlineBarView = new TableActionBarView(_.extend({
          context: this.options.context,
          originatingView: this,
          commands: this.defaultActionController.commands,
          model: this.model,
          collection: TileViewToolbarItems.inlineActionbar,
          containerCollection: this.collection,
          status: {originatingView: this}
        }, TileViewToolbarItems.inlineActionbar.options));
        if (this.showInlineActionsLock) {
          var inlineBarDiv    = this.$el.find('.csui-tileview-more-btn'),
              inlineBarRegion = new Marionette.Region({el: inlineBarDiv});
          inlineBarRegion.show(this.inlineBarView);
        }

      }, this));

    },

    onDestroyCommands: function () {
      this.showInlineActionsLock = false;
      if (this.showInlineActionBar) {
        this.inlineBarView && this.inlineBarView.destroy();
        this.$el.removeClass('csui-tile-with-more-btn');
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger("click:item", {target: this.model});
      }
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      if (id != null) {
        this.$el.attr('href', nodeLinks.getUrl(this.model));
      }
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();

      if (this.model && this.options && this.options.checkDefaultAction) {
        var disabled = this.model.fetched === false ||
                       !this.defaultActionController.hasAction(this.model);
        this.$el[disabled ? 'addClass' : 'removeClass']('inactive');
      }
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
    }

  });

  var SimpleTreeListItemView = Marionette.CompositeView.extend({

    className: 'cs-simpletreelistitem binf-panel binf-panel-default',

    attributes: function () {
      return {
        role: 'treeitem'
      };
    },
    // behaviors: {
    //   DefaultAction: {
    //     behaviorClass: DefaultActionBehavior
    //   }
    // },

    template: treeListItemTemplate,
    templateHelpers: function () {
      return {
        icon: this.options.model && this.options.model.get('icon'),
        name: this.options.model && this.options.model.get('name'),
        expandLabel: lang.treeListExpandTooltip,
        collapseLabel: lang.treeListCollapseTooltip
      };
    },

    ui: {
      header: '.cs-header',
      headerDropdownIcon: '.cs-header .dropdown-icon',
      content: '> .cs-content',
      contentList: '> .cs-content > .cs-list-group'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': '_onChildRender'
    },

    childViewContainer: '.cs-list-group',

    childView: SimpleTreeListLeafView,

    childViewOptions: function () {
      return {
        text: this.options.emptyViewDefaultText,
        checkDefaultAction: this.options.checkDefaultAction,
        template: this.options.childViewTemplate,
        templateHelpers: this.options.childViewTemplateHelpers,
        toolbarData: this.options.toolbarData,
        context: this.options.context

      };
    },

    emptyView: EmptyListView,

    _onChildRender: function (childView) {
      var $item = childView.$el;
      if ($item.is('[data-csui-active]')) {
        $item.addClass('binf-active');
      }
    },

    constructor: function SimpleTreeListItemView(options) {
      options || (options = {});
      if (options.model && options.model.childrenCollection) {
        options.collection = options.model.childrenCollection;
      } else {
        options.collection = new Backbone.Collection();
      }
      Marionette.CompositeView.call(this, options);
    },

    onRender: function () {
      // if the tree model was specified 'flatten'
      if (this.model && this.model.get('flatten') === true) {
        this.$el.addClass('flatten-tree');
        this.ui.header.addClass('binf-hidden');
        // when the list is empty, don't show the empty list text
        if (this.collection.length > 0) {
          this.ui.content.removeClass('binf-hidden');
        }
        // suppress role=treeitem for the flattened treeitem and role=group for group container
        // this will trick screen readers to see children treeitems as their parent's siblings
        this.$el.removeAttr('role');
        this.ui.contentList.removeAttr('role');
      }

      this.ui.header.on('click', _.bind(this.onClickHeader, this));
      this._setDropdownIconClass();
      this.tabPosition = TabPosition.none;
      this.selectedIndex = -1;
    },

    onClickHeader: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.ui.content.toggleClass('binf-hidden');
      this._setDropdownIconClass();

      this.ui.header.focus();
      this.tabPosition = TabPosition.header;
      this.selectedIndex = -1;

      this.triggerMethod('click:tree:header', this);
    },

    _setDropdownIconClass: function () {
      if (this.ui.content.hasClass('binf-hidden')) {
        this.ui.headerDropdownIcon.removeClass('icon-expandArrowUp');
        this.ui.headerDropdownIcon.addClass('icon-expandArrowDown');
        this.ui.headerDropdownIcon.attr('title', lang.treeListExpandTooltip);
        // set aria-expanded for normal favorite tabs, but not for the ungrouped favorite tab
        if (this.model && this.model.get('flatten') !== true) {
          this.$el.attr('aria-expanded', 'false');
        }
      } else {
        this.ui.headerDropdownIcon.addClass('icon-expandArrowUp');
        this.ui.headerDropdownIcon.removeClass('icon-expandArrowDown');
        this.ui.headerDropdownIcon.attr('title', lang.treeListCollapseTooltip);
        // set aria-expanded for normal favorite tabs, but not for the ungrouped favorite tab
        if (this.model && this.model.get('flatten') !== true) {
          this.$el.attr('aria-expanded', 'true');
        }
      }
    },

    onClickItem: function (src) {
      src.cancelClick = false;
      this.triggerMethod('click:tree:item', src);
      if (src.cancelClick === false) {
        this._setCssItemSelected(src.$el);
        src.$el.focus();
      }
      this.tabPosition = TabPosition.list;
      this.selectedIndex = src._index ? src._index : -1;
    },

    _setCssItemSelected: function ($item) {
      if (!($item instanceof $)) {
        return;
      }
      // unmark old
      var $active = $item.siblings('[data-csui-active]');
      $active.removeClass('binf-active').removeAttr('data-csui-active');
      // mark new
      $item.addClass('binf-active').attr('data-csui-active', '');

      // for keyboard navigation, set tabindex=-1
      $item.siblings().prop('tabindex', '-1');
    },

    currentlyFocusedElement: function (event) {
      var $elem;
      if (event && !this.ui.content.hasClass('binf-hidden') &&
          (event.keyCode === 34 || event.keyCode === 35 || event.keyCode === 38 ||
           (event.keyCode === 9 && event.shiftKey))) {
        // page down (34), end (35), arrow up (38), or shift-tab(9+shift):
        // return last tree leaf item if found
        var lastIndex = this.collection.length - 1;
        $elem = this.getElementByIndex(lastIndex);
        if ($elem) {
          this.tabPosition = TabPosition.list;
          this.selectedIndex = lastIndex;
          return $elem;
        }
      }

      // if the tree model was specified 'flatten'
      if (this.model && this.model.get('flatten') === true) {
        // return the first tree leaf if there is one
        if (this.collection.length > 0) {
          var index = 0;
          (event && event.keyCode === 38 /* arrow up */) && (index = this.collection.length - 1);
          $elem = this.getElementByIndex(index);
          if ($elem) {
            this.tabPosition = TabPosition.list;
            this.selectedIndex = index;
            return $elem;
          }
        }
      } else {  // normal non-flattened tree, return the tree header
        this.tabPosition = TabPosition.header;
        this.selectedIndex = -1;
        return this.ui.header;
      }

      // nothing found
      this.tabPosition = TabPosition.none;
      this.selectedIndex = -1;
      return undefined;
    },

    _moveTo: function (event, $elem, $preElem) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('before:keyboard:change:focus');
      $preElem && $preElem.prop('tabindex', '-1');
      $elem.prop('tabindex', '0');
      $elem.focus();
      this.trigger('after:keyboard:change:focus');
    },

    onKeyInView: function (event) {
      var $preElem;
      switch (event.keyCode) {
      case 38: // arrow up
        if (this.tabPosition === TabPosition.list && this.selectedIndex === 0) {
          // if the tree model was specified 'flatten' and the focus is at first element
          if (this.model && this.model.get('flatten') === true) {
            this.tabPosition = TabPosition.none;
            this.selectedIndex = -1;
          } else {  // normal non-flattened tree, return the tree header
            $preElem = this.getElementByIndex(this.selectedIndex);
            this.tabPosition = TabPosition.header;
            this.selectedIndex = -1;
            this._moveTo(event, this.ui.header, $preElem);
          }
        } else if (this.tabPosition === TabPosition.list && this.selectedIndex > 0) {
          $preElem = this.getElementByIndex(this.selectedIndex);
          this._moveTo(event, this._selectPrevious(), $preElem);
        }
        break;
      case 40: // arrow down
        if (!this.ui.content.hasClass('binf-hidden')) {
          if (this.selectedIndex < this.collection.length - 1) {
            this.tabPosition = TabPosition.list;
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectNext(), $preElem);
          }
        }
        break;
      case 33:  // page up
      case 34:  // page down
        this.tabPosition = TabPosition.none;
        this.selectedIndex = -1;
        break;
      case 13:  // enter
      case 32:  // space
        this._clickTargetByKeyboard(event);
        break;
      case 37:  // left arrow
        if (this.tabPosition === TabPosition.header && !this.ui.content.hasClass('binf-hidden')) {
          // left arrow while focus is on the tree header and subtree is open: close the subtree
          this._clickTargetByKeyboard(event);
        } else if (this.tabPosition === TabPosition.list) {
          var flattenTree = this.model && this.model.get('flatten');
          if (!flattenTree) {
            // left arrow while focus is on a tree leaf: move to the tree header
            $preElem = this.getElementByIndex(this.selectedIndex);
            this.tabPosition = TabPosition.header;
            this.selectedIndex = -1;
            this._moveTo(event, this.ui.header, $preElem);
          }
        }
        break;
      case 39:  // right arrow
        if (this.tabPosition === TabPosition.header) {
          if (this.ui.content.hasClass('binf-hidden')) {
            // right arrow while focus is on the tree header and subtree is close: open the subtree
            this._clickTargetByKeyboard(event);
          } else {
            // right arrow while focus is on tree header and subtree is open: move to 1st tree leaf
            if (this.collection.length > 0) {
              this.tabPosition = TabPosition.list;
              this.selectedIndex = 0;
              this._moveTo(event, this.getElementByIndex(this.selectedIndex), this.ui.header);
            }
          }
        }
        break;
      }
      return true;
    },

    _clickTargetByKeyboard: function (event) {
      event.preventDefault();
      event.stopPropagation();
      $(event.target).click();
    },

    _selectNext: function () {
      if (this.selectedIndex < this.collection.length - 1) {
        this.selectedIndex++;
      }
      return this.getElementByIndex(this.selectedIndex);
    },

    _selectPrevious: function () {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return this.getElementByIndex(this.selectedIndex);
    },

    // return the jQuery list item element by index for keyboard navigation use
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1); // index is zero-based
      var $item = this.$(nthChildSel);
      return $($item[0]);
    }
  });

  return SimpleTreeListItemView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/list/impl/simpletreelist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"cs-list-group\"></div>\r\n";
}});
Handlebars.registerPartial('csui_controls_list_impl_simpletreelist', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/list/impl/simpletreelist',[],function(){});
// Shows a simply tree list of items with scrollbar
csui.define('csui/controls/list/simpletreelist.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/listitem/simpletreelistitem.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'hbs!csui/controls/list/impl/simpletreelist',
  'css!csui/controls/list/impl/simpletreelist'
], function (_, $, Backbone, Marionette, base, SimpleTreeListItemView,
    PerfectScrollingBehavior, DefaultActionBehavior,
    treeListTemplate) {

  var SimpleTreeListView = Marionette.CollectionView.extend({

    constructor: function SimpleTreeListView(options) {
      options || (options = {});

      // Provide the perfect scrollbar to every list view by default
      // (Behaviors cannot be inherited; add the PerfectScrolling
      //  to the local clone of the descendant's behaviors.)
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
            return behavior.behaviorClass === PerfectScrollingBehavior;
          }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '> .cs-content',
            suppressScrollX: true,
            // like bottom padding of container, otherwise scrollbar is shown always
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CollectionView.call(this, options);
    },

    ui: {},

    events: {},

    childEvents: {
      'click:item': 'onClickItem',
      'render': '_onChildRender'
    },

    className: 'cs-simpletreelist binf-panel binf-panel-default',
    template: treeListTemplate,

    childViewContainer: '.cs-list-group',
    childView: SimpleTreeListItemView,

    childViewOptions: function () {
      return {
        template: this.options.childViewTemplate
      };
    },

    _onChildRender: function (childView) {
      var $item = childView.$el;
      if ($item.is('[data-csui-active]')) {
        $item.addClass('binf-active');
      }
    },

    onClickItem: function (src) {
      src.cancelClick = false;
      this.trigger('click:item', src);
      if (src.cancelClick === false) {
        this._setCssItemSelected(src.$el);
      }
    },

    _setCssItemSelected: function ($item) {
      if (!($item instanceof $)) {
        return;
      }
      // unmark old
      var $active = $item.siblings('[data-csui-active]');
      $active.removeClass('binf-active').removeAttr('data-csui-active');

      // mark new
      $item.addClass('binf-active').attr('data-csui-active', '');

      // for keyboard navigation, set tabindex=-1
//      $item.siblings().prop('tabindex', '-1');
    }

  });

  return SimpleTreeListView;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/listitem/impl/listitemobject',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <img class=\"cs-icon\" src=\""
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" alt=\"\">\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"cs-key\">"
    + this.escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{}}) : helper)))
    + "</div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"cs-size\"> ("
    + this.escapeExpression(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"size","hash":{}}) : helper)))
    + ")</span>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"cs-stage\">\r\n      <span class=\"cs-label\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.label : stack1),{"name":"csui-l10n","hash":{}}))
    + "</span>\r\n      <span class=\"cs-value\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1), depth0))
    + "</span>\r\n    </div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"cs-price "
    + this.escapeExpression(((helper = (helper = helpers.priceClass || (depth0 != null ? depth0.priceClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"priceClass","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"price","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"cs-currency\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.currency : depth0),{"name":"csui-l10n","hash":{}}))
    + "</div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"cs-date\">\r\n      <div class=\"cs-label\">"
    + this.escapeExpression((helpers['csui-l10n'] || (depth0 && depth0['csui-l10n']) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.date : depth0)) != null ? stack1.label : stack1),{"name":"csui-l10n","hash":{}}))
    + "</div>\r\n      <div class=\"cs-value "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.date : depth0)) != null ? stack1['class'] : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.date : depth0)) != null ? stack1.value : stack1), depth0))
    + "</div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n<div class=\"cs-left\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.key : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  <div class=\"cs-title\">\r\n    <span class=\"cs-name\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.size : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.stage : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n\r\n<div class=\"cs-right\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.price : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.date : depth0)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_listitem_impl_listitemobject', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/listitem/impl/listitemobject',[],function(){});
// Shows a list of workspaces related to the current one
csui.define('csui/controls/listitem/listitemobject.view',[
  'csui/lib/underscore', 'csui/lib/marionette', 'csui/lib/numeral',
  'csui/lib/moment', 'csui/lib/handlebars', 'csui/utils/base',
  'hbs!csui/controls/listitem/impl/listitemobject',
  'csui/utils/handlebars/l10n', // support {{csui-l10n ...}}
  'css!csui/controls/listitem/impl/listitemobject'
], function (_, Marionette, numeral, moment, Handlebars, base, itemTemplate) {

  var ObjectListItem = Marionette.ItemView.extend({

    constructor: function ObjectListItem() {
      Marionette.ItemView.apply(this, arguments);
    },

    triggers: {
      'click': 'click:item'
    },

    className: 'cs-item-object list-group-item binf-clearfix',
    template: itemTemplate,

    templateHelpers: function () {
      // options.data contain a map of property names pointing to expressions
      // computing the property values; evaluate the expressions here
      return this._getObject(this.options.data || {});
    },

    _getObject: function (object) {
      return _.reduce(object, function (result, expression, name) {
        // Primitive values come from string (simple) expressions or objects
        // with the expression property (complex expressions)
        if (typeof expression === 'string') {
          expression = this._getValue(expression);
        } else if (typeof expression === 'object') {
          if (expression.expression !== undefined) {
            expression = this._getValue(expression);
          } else {
            expression = this._getObject(expression);
          }
        }
        result[name] = expression;
        return result;
      }, {}, this);
    },

    _getValue: function (expression) {
      var complexExpression;
      // If the value needs more computing after the placeholder resolution,
      // replace the placeholders with their values first
      if (typeof expression !== 'string') {
        complexExpression = expression;
        expression = expression.expression;
      }
      // Replace the {} parameter placeholders
      expression = this._replacePlaceholders(expression);
      // Update the value if there is a complex expression
      if (complexExpression) {
        expression = this._applyValueRanges(expression, complexExpression);
        expression = this._applyValueMap(expression, complexExpression);
      }
      return expression;
    },

    _replacePlaceholders: function (expression) {
      var parameterPlaceholder = /{([^}]+)}/g,
          match, names, value;
      // Go over every parameter placeholder found
      while ((match = parameterPlaceholder.exec(expression))) {
        names = match[1].split('.');
        value = this.model.attributes;
        // Nested object property names are separated by dots
        _.find(names, function (name) {
          value = value[name];
          if (value == null) {
            value = '';
            return true;
          }
        });
        // Replace the placeholder with the value found
        expression = expression.substring(0, match.index) + value +
                     expression.substring(match.index + match[0].length);
      }
      return expression;
    },

    // Map computed result to one of the specified values
    _applyValueMap: function (value, complexExpression) {
      var valueMap = complexExpression.valueMap;
      if (valueMap) {
        value = valueMap[value];
        if (value == null) {
          value = valueMap['*'];
        }
      }
      return value;
    },

    // Choose a specific value from the result ranges
    _applyValueRanges: function (value, complexExpression) {
      var valueRanges = complexExpression.valueRanges;
      if (valueRanges) {
        var convertValue;
        if (complexExpression.type === 'Date') {
          convertValue = function converDate(value) {
            return base.parseDate(value);
          };
        } else {
          convertValue = function convertNumber(value) {
            return numeral(value).value();
          };
        }
        value = convertValue(value);
        // Find the first range which contains the expression value
        _.find(valueRanges, function (range) {
          var greaterOrEqual = range.greaterOrEqual;
          if (greaterOrEqual !== undefined) {
            greaterOrEqual = convertValue(greaterOrEqual);
            if (greaterOrEqual > value) {
              return false;
            }
          }
          var lessThan = range.lessThan;
          if (lessThan !== undefined) {
            lessThan = convertValue(lessThan);
            if (lessThan <= value) {
              return false;
            }
          }
          value = range.value;
          return true;
        });
      }
      return value;
    }

  });

  return ObjectListItem;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/listitem/impl/listitemstateful',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"csui-type-icon "
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\"></span>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"SLIIcon\">\r\n      "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.enableIcon : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n</div>\r\n<div class=\"SLIRightDiv\">\r\n  <div class=\"SLITitleDiv\">\r\n    <div class=\"SLITitle\">\r\n      <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n    <div class=\"SLIDescription\">\r\n      <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\">"
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"SLIInfo SLIInfo"
    + this.escapeExpression(((helper = (helper = helpers.infoState || (depth0 != null ? depth0.infoState : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"infoState","hash":{}}) : helper)))
    + "\">\r\n    <span title=\""
    + this.escapeExpression(((helper = (helper = helpers.info || (depth0 != null ? depth0.info : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"info","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\">"
    + this.escapeExpression(((helper = (helper = helpers.info || (depth0 != null ? depth0.info : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"info","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_listitem_impl_listitemstateful', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/listitem/impl/listitemstateful',[],function(){});
// Shows a list of links
csui.define('csui/controls/listitem/listitemstateful.view',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/listitem/listitemstandard.view',
  'hbs!csui/controls/listitem/impl/listitemstateful',
  'css!csui/controls/listitem/impl/listitemstateful'
], function (_, $, Marionette, StandardListItem, itemTemplate) {

  var StatefulListItem = StandardListItem.extend({

    className: 'SLI binf-list-group-item',

    template: itemTemplate,

    constructor: function StatefulListItem() {
      StandardListItem.apply(this, arguments);
    }

  });

  return StatefulListItem;

});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/toolbar/toolitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(18, data, 0)})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.renderIconAndText : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0)})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "      <a title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" href=\"#\" class=\"csui-toolitem\" tabindex=\"-1\" data-cstabindex=\"-1\">\r\n        <span class=\""
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" data-cstabindex=\"-1\"></span>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n      </a>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.renderTextOnly : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(11, data, 0)})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <a href=\"#\" class=\"csui-toolitem\" data-cstabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.menuWithMoreOptions : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        </a>\r\n";
},"9":function(depth0,helpers,partials,data) {
    return "            <span class=\"csui-button-icon csui-icon-rightArrow icon-expandArrowUp\" data-cstabindex=\"-1\"></span>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <a href=\"#\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" class=\"csui-toolitem\"\r\n           data-cstabindex=\"-1\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.toolItemAria : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.program(14, data, 0)})) != null ? stack1 : "")
    + "\r\n          "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasToolItemAriaExpand : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">\r\n          <span class=\""
    + this.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"icon","hash":{}}) : helper)))
    + "\" data-cstabindex=\"-1\"></span>\r\n        </a>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.toolItemAria || (depth0 != null ? depth0.toolItemAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toolItemAria","hash":{}}) : helper)))
    + "\" ";
},"14":function(depth0,helpers,partials,data) {
    var helper;

  return "\r\n           aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" ";
},"16":function(depth0,helpers,partials,data) {
    var helper;

  return "aria-expanded=\""
    + this.escapeExpression(((helper = (helper = helpers.toolItemAriaExpand || (depth0 != null ? depth0.toolItemAriaExpand : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toolItemAriaExpand","hash":{}}) : helper)))
    + "\" ";
},"18":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "    <a href=\"#\" class=\"csui-toolitem\" data-cstabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.menuWithMoreOptions : depth0),{"name":"if","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </a>\r\n";
},"19":function(depth0,helpers,partials,data) {
    return "        <span class=\"csui-button-icon csui-icon-rightArrow icon-expandArrowUp\" data-cstabindex=\"-1\"></span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isSeparator : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('csui_controls_toolbar_toolitem', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/toolbar/toolitem.view',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/toolbar/toolitem', 'csui/lib/binf/js/binf'
], function ($, _, Marionette, template) {
  'use strict';

  var ToolItemView = Marionette.ItemView.extend({
    tagName: 'li',

    className: function () {
      var className = this.model.get('className') || '';
      if (this.model.isSeparator()) {
        className += ' binf-divider';
      }
      return className;
    },

    attributes: function () {
      var attrs = {};
      if (this.model.isSeparator()) {
        attrs['aria-hidden'] = 'true';
      } else {
        var signature = this.model.get('signature') || '';
        //'data-csui-command' if changed must be updated in toolbar.view._setUnblocked()
        attrs['data-csui-command'] = signature.toLowerCase();
      }
      if (this.options.role) {
        attrs['role'] = this.options.role;
      } else {
        attrs['role'] = 'menuitem';
      }
      return attrs;
    },

    template: template,

    templateHelpers: function () {
      var data = {
        renderIconAndText: this.options.renderIconAndText === true,
        renderTextOnly: this.options.renderTextOnly === true,
        isSeparator: this.model.isSeparator(),
        toolItemAria: this.model.get("toolItemAria"),
        hasToolItemAriaExpand: this.model.get("toolItemAriaExpand") !== undefined,
        toolItemAriaExpand : this.model.get("toolItemAriaExpand")
      };
      data.title = !!this.model.get('title') ? this.model.get('title') : this.model.get('name');
      return data;
    },

    events: {
      'click a': '_handleClick',
      'keydown': 'onKeyInView'
    },

    constructor: function ToolItemView(options) {
      this.options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13 || event.keyCode === 32) {  // enter(13) and space(32)
        this._handleClick(event);
        return false;
      }
    },

    renderIconAndText: function () {
      this.options.renderIconAndText = true;
      this.render();  // re-render
      this.options.renderIconAndText = false;
    },

    renderTextOnly: function () {
      this.options.renderTextOnly = true;
      this.render();  // re-render
      this.options.renderTextOnly = false;
    },

    // TODO: Deprecate and remove this method. This information
    // is carried by the model.
    isSeparator: function () {
      return this.model.isSeparator();
    },

    closeDropdown: function () {
      var dropdownEl = this.$el.closest('li.binf-dropdown.binf-open');
      var dropdownToggleEl = dropdownEl.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');
    },

    _handleClick: function (event) {
      event.preventDefault();

      // when the dropdown menu command runs with more options, keep the menu open
      if (this.model.get('menuWithMoreOptions') === true) {
        event.stopPropagation();
      } else {
        // close the dropdown menu before triggering the event
        this.closeDropdown();
      }

      var args = {toolItem: this.model};
      this.triggerMethod('before:toolitem:action', args);
      if (!args.cancel) {
        this.triggerMethod('toolitem:action', args);
      }
    }
  });

  return ToolItemView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/toolbar/impl/flyout.toolitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <a href=\"#\" class=\"csui-toolitem "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\" title ="
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " data-cstabindex=\"-1\">\r\n    <span>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n  </a>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "binf-disabled";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "  <a href=\"#\" class=\"csui-toolitem csui-flyout-arrow\" title="
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + " data-binf-toggle=\"dropdown\" role=\"button\"\r\n     aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.expandTitle || (depth0 != null ? depth0.expandTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandTitle","hash":{}}) : helper)))
    + "\" aria-expanded=\"false\" data-cstabindex=\"-1\">\r\n    <span>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</span>\r\n    <span class=\"csui-button-icon icon-expandArrowDown\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.expandTitle || (depth0 != null ? depth0.expandTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandTitle","hash":{}}) : helper)))
    + "\"></span>\r\n  </a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.flyoutArrowDisabled : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(4, data, 0)})) != null ? stack1 : "")
    + "<ul class=\"binf-dropdown-menu\" role=\"menu\"></ul>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('csui_controls_toolbar_impl_flyout.toolitem', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/toolbar/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/toolbar/impl/nls/root/localized.strings',{

  // toolbar.state.view
  loadingActionsMessage: 'Loading actions...',
  failedActionsMessage: 'Loading actions failed.',
  showMoreLabel: 'show more actions'

});


csui.define('csui/controls/toolbar/flyout.toolitem.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/toolbar/toolitem.view',
  'hbs!csui/controls/toolbar/impl/flyout.toolitem',
  'i18n!csui/controls/toolbar/impl/nls/localized.strings'
], function (_, $, Marionette, ToolItemView, template, lang) {
  'use strict';

  var FlyoutMenuItemView = ToolItemView.extend({
    constructor: function FlyoutMenuItemView() {
      ToolItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._promote);
    },

    _promote: function () {
      var method = this.model.get('promoted') ? 'addClass' : 'removeClass';
      this.$el[method]('csui-promoted');
    }
  });

  var FlyoutToolItemView = Marionette.CompositeView.extend({
    tagName: 'li',
    className: 'csui-flyout binf-dropdown',
    attributes: function () {
      var signature = this.model.get('signature') || '';
      return {
        'data-csui-command': signature.toLowerCase()
      };
    },

    template: template,
    templateHelpers: function () {
      var name                = this.model.get('name'),
          promoted            = this.model.get('promoted') || this.model.toolItems.findWhere({
            promoted: true
          }),
          flyoutArrowDisabled = this.model.toolItems.length <= 1;
      if (!name) {
        name = (promoted || this.model.toolItems.first()).get('name');
      }
      return {
        name: name,
        disabled: !promoted,
        expandTitle: lang.showMoreLabel,
        flyoutArrowDisabled: flyoutArrowDisabled
      };
    },

    childViewContainer: '.binf-dropdown-menu',
    childView: FlyoutMenuItemView,
    childEvents: {
      'toolitem:action': function (childView, args) {
        this.triggerMethod('toolitem:action', args);
      }
    },

    events: {
      'click > a': function (event) {
        event.preventDefault();
        if (this.model.toolItems.length <= 1) {
          if(this.model.get('promoted')) {
            var args = {toolItem: this.model};
            this.triggerMethod('toolitem:action', args);
          } else {
            var promoted = this.model.toolItems.findWhere({
              promoted: true
            });
            if (promoted) {
              this.triggerMethod('toolitem:action');
            }
          }
        }
      }
    },

    constructor: function FlyoutToolItemView() {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, 'add change reset', function (models) {
        this.render();
      });
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13) {
        this._handleClick(event);
        return false;
      }
    },
  });

  return FlyoutToolItemView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/toolbar/impl/toolitem.custom',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='custom-view-region'></div>\r\n";
}});
Handlebars.registerPartial('csui_controls_toolbar_impl_toolitem.custom', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/toolbar/toolitem.custom.view',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/commandhelper',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!csui/controls/toolbar/impl/toolitem.custom',
  'csui/lib/binf/js/binf'
], function ($, _, Marionette, CommandHelper, LayoutViewEventsPropagationMixin, template) {

  //
  // Special ToolItemCustomView that shows a dynamic custom view (not a regular toolbar icon)
  //
  var ToolItemCustomView = Marionette.LayoutView.extend({

    tagName: 'li',

    attributes: function () {
      return {id: this.model.get("signature")};
    },

    template: template,

    regions: {
      customViewRegion: '.custom-view-region'
    },

    ui: {
      customViewDiv: '.custom-view-region'
    },

    events: {
      'keydown': 'onKeyInView',
      'click': '_clickToolItem'
    },

    constructor: function ToolItemCustomView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    className: function () {
      var className = this.model.get("className") || '';
      return className;
    },

    _disable: function () {
      this.$el.addClass('binf-hidden');
      this.ui.customViewDiv.removeClass('csui-acc-focusable');
    },

    onRender: function () {
      var customViewClass = this.model.get('viewClass');
      if (customViewClass) {
        var model;
        var status = this.model.status;
        var commandData = this.model.get('commandData');
        if (commandData && commandData.useContainer === true) {
          model = status && status.container;
        } else {
          model = status && CommandHelper.getJustOneNode(status);
        }
        var context = this.options.context || (status && status.context);
        var options = {
          model: model,
          context: context,
          status: status,
          toolbarCommandController: this.options.toolbarCommandController,
          toolbarItemsMask: this.options.toolbarItemsMask,
          originatingView: this.options.originatingView,
          blockingParentView: this.options.blockingParentView
        };
        if (commandData && commandData.viewOptions) {
          _.extend(options, commandData.viewOptions);
        }
        this.customView = new customViewClass(options);
        if (this.customView.enabled) {
          // cutomView has the enabled() method, call it first to check
          if (this.customView.enabled()) {
            this.customView.render();
            this.customViewRegion.show(this.customView);
          } else {
            this._disable();
          }
        } else {
          // customView does not implement the enabled() method
          this.customView.render();
          this.customViewRegion.show(this.customView);
        }
      } else {
        this._disable();
      }
    },

    onShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('show');
        }
      });
    },

    onAfterShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('after:show');
        }
      });
    },

    _clickToolItem: function (e) {
      e.preventDefault();
      this.ui.customViewDiv.prop('tabindex', '0');
      this.ui.customViewDiv.focus();
      this._closeDropdownToggleOnClick();
      // only trigger click on customView if the event was not propagated from customView
      if (this.customView.el !== e.target && this.customView.$el.find(e.target).length === 0) {
        this.customView.$el.click();
      }
    },

    _closeDropdownToggleOnClick: function () {
      var dropdownEl = this.$el.closest('li.binf-dropdown.binf-open');
      var dropdownToggleEl = dropdownEl.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event
    },

    onKeyInView: function (event) {
      var $target = $(event.target);
      if (event.keyCode === 32 || event.keyCode === 13) {  // space (32) or enter (13)
        this._clickToolItem(event);
      }
    }

  });

  _.extend(ToolItemCustomView.prototype, LayoutViewEventsPropagationMixin);

  return ToolItemCustomView;

});

csui.define('csui/controls/toolbar/toolitem.model',[
  'csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  var ToolItemModel = Backbone.Model.extend({
    idAttribute: null,

    isSeparator: function () {
      return this.get('signature') == ToolItemModel.separator_signature;
    }
  });

  ToolItemModel.createSeparator = function () {
    return new ToolItemModel({signature: ToolItemModel.separator_signature});
  };

  ToolItemModel.separator_signature = '-';

  return ToolItemModel;
});

csui.define('csui/controls/toolbar/toolitems.factory',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/toolbar/toolitem.model'
], function (_, Backbone, Marionette, base, ToolItemModel) {
  'use strict';

  // ToolItemCollection to be filled on the first usage, preventing circular
  // dependency between ToolItemCollection and ToolItemModel.
  var ToolItemsFactory = Marionette.Object.extend({
    constructor: function ToolItemsFactory(toolItemDefinitions, options) {
      this.collection = new Backbone.Collection([], {model: ToolItemModel});
      this.runsInTouchBrowser = options && options.runsInTouchBrowser !== undefined ?
                                options.runsInTouchBrowser : base.isTouchBrowser();

      this.set(toolItemDefinitions);
      Marionette.Object.prototype.constructor.call(this, options);
    },

    set: function (tooItemDefinitions) {
      if (_.isArray(tooItemDefinitions)) {
        _.each(tooItemDefinitions, function (toolItemDefinition) {
          this._setToolItemDefinition(toolItemDefinition);
        }, this);
      } else {
        this._setToolItemDefinition(tooItemDefinitions);
      }
    },

    addItem: function (newToolItem) {
      var group = newToolItem.get('group');
      var foundGroup = false;
      var prevToolItemIndex;

      if (newToolItem.get('onlyInTouchBrowser')) {
        // toolbar item is marked to be enabled only if running in touch browser ->
        if (this.runsInTouchBrowser) {
          // not adding the toolbar item, because running in touch browser
          return;
        }
      }

      this.collection.find(function (toolItem, index) {
        if (toolItem.get('group') === group) {
          //prevToolItemIndex = index;
          foundGroup = true;
        } else {
          if (foundGroup) {
            prevToolItemIndex = index;
            return true;  // stop loop because we found it and now it's different again
          }
        }
      });

      if (foundGroup && prevToolItemIndex) {
        this.collection.add(newToolItem, {at: prevToolItemIndex});
      } else {
        this.collection.add(newToolItem);
      }
    },

    reset: function (models) {
      this.collection.reset(models);
      //_.each(models, function(model){
      //  this.collection.add(model);
      //}, this);
    },

    getCollection: function () {
      return this.collection;
    },

    // merge with existing items by group
    _setToolItemDefinition: function (toolItemDefinition) {
      var runsInTouchBrowser = this.runsInTouchBrowser;
      if (this.collection.length === 0) {
        var toolItemsFlat = [];
        _.each(toolItemDefinition, function (toolItems, key) {
          // TODO: Pin the toll item group to its position without an
          // arttificial disabled tool item.
          // Start the group with an invisible (always disabled) item. If it
          // is empty, or no item will be added below, its order among other
          // groups would not be preserved.
          toolItemsFlat.push({
            signature: 'disabled',
            group: key
          });
          _.each(toolItems, function (toolItem) {
            if (!toolItem.onlyInTouchBrowser || runsInTouchBrowser) {
              // toolbar item is marked to be enabled only if running in touch browser ->
              // adding the toolbar item, because NOT running in touch browser
              _.extend(toolItem, {group: key});
              toolItemsFlat.push(toolItem);
            }
          });
        });
        this.collection.reset(toolItemsFlat);
      } else {
        // todo: merge with existing collecton
      }
    }
  });

  return ToolItemsFactory;
});

csui.define('csui/controls/toolbar/toolitems.filtered.model',[
  'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/controls/toolbar/toolitem.model',
  'csui/controls/toolbar/toolitems.factory', 'csui/utils/commands'
], function (require, _, $, Backbone, ToolItemModel, ToolItemsFactory,
    commands) {
  'use strict';

  var FilteredToolItemsCollection = Backbone.Collection.extend({
    constructor: function FilteredToolItemsCollection(models, options) {
      if (_.isArray(models)) {
        this.unfilteredModels = models; // save for re-filter
      } else {
        if (models instanceof ToolItemsFactory) {
          this.addTrailingDivider = models.options.addTrailingDivider;
          this.addGroupSeparators = models.options.addGroupSeparators !== false;
          this.suppressGroupSeparators = models.options.suppressGroupSeparators;
          var collection = models.getCollection();
          this.unfilteredModels = collection.models;
          this.listenTo(collection, 'add', this.refilter, this)
              .listenTo(collection, 'remove', this.refilter, this)
              .listenTo(collection, 'reset', function () {
                this.unfilteredModels = collection.models;
                this.refilter();
              }, this);
        } else {
          if (models instanceof Backbone.Collection &&
              models.model instanceof ToolItemModel) {
            this.unfilteredModels = models.models;
          }
        }
      }

      options || (options = {});
      this.commands = options.commands || commands;
      this.setStatus(options.status);
      this.delayedActions = options.delayedActions;
      this.mask = options.mask;
      this._filtering = 0;

      Backbone.Collection.prototype.constructor.call(this,
          this.unfilteredModels, options);

      if (this.delayedActions) {
        this.listenTo(this.delayedActions, 'sync', this.refilter)
            .listenTo(this.delayedActions, 'error', this.refilter);
      }
      if (this.mask) {
        this.listenTo(this.mask, 'update', this.refilter);
      }
    },

    sort: function(options) {
      options || (options = {});
      var array = this.models,
          comparator = function (leftIndex, rightIndex) {
            var thisLazy = !!array[leftIndex].get('csuiNonPromotedItem'),
              otherLazy = !!array[rightIndex].get('csuiNonPromotedItem');
            if (!thisLazy && otherLazy) {
              return -1;
            } else if (thisLazy && !otherLazy) {
              return 1;
            }
            return (leftIndex - rightIndex);
          };
      this.models = array
                      .map(function (item, index) {
                        return index;
                      })
                      .sort(comparator)
                      .map(function (index) {
                        return array[index];
                      });
      if (!options.silent) {
        this.trigger('sort', this, options);
      }
      return this;
    },

    destroy: function () {
      this.stopListening();
    },

    refilter: function () {
      // A tool item can be changed during collection filtering;
      if (!this._filtering) {
        ++this._filtering;
        // Make sure, that custom view classes have been resolved,
        // before the tool items are added to the collection
        var resolving = this._resolveCustomViews();
        if (resolving) {
          resolving.always(updateCollection.bind(this));
        } else {
          updateCollection.call(this);
        }
      }

      function updateCollection() {
        var filteredModels = this.filterModels(this.unfilteredModels);
        this.reset(filteredModels, {silent: !!this.silentFetch});
        this.silentFetch = false;
        --this._filtering;
      }
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function (models, options) {
      if (!this._filtering) {
        models = this.filterModels(models);
      }
      // call the original set with the filtered list of models
      return Backbone.Collection.prototype.set.call(this, models, options);
    },

    setStatus: function (status) {
      if (status) {
        if (this.status) {
          if (this.status.nodes) {
            this.status.nodes.remove(this.status.container);
            this.stopListening(this.status.nodes);
          }
          this.status.container && this.stopListening(this.status.container);
        }
        this.status = status;

        if (status.nodes) {
          var listenEvents = ['change', 'reset'];
          listenEvents = _.union(listenEvents, status.listenEvents);
          var events = listenEvents.join(' ');

          this.listenTo(status.nodes, events, this.refilter);
        }
        if (status.container) {
          this.listenTo(status.container, 'change', this.refilter);
        }
      }
    },

    filterModels: function (models) {
      // SAkip filtering if delayed actions have not been fetched yet
      if (this.delayedActions && (this.delayedActions.fetching ||
                                  this.delayedActions.error) ||
          !this.status) {
        return [];
      }
      // Prevent re-entering of the tool item filtering code
      ++this._filtering;
      // FIlter and adapt tool item models to back up a toolbar view
      var filteredModels = this._filterToolItems(models);
      // Remove empty flyouts
      filteredModels = _.reject(filteredModels, function (model) {
        return model.get('flyout') && model.get('promoted') === false && !model.toolItems.length;
      });
      // Expand single-action flyouts to regular buttons
      _.each(filteredModels, function (model) {
        if (model.get('flyout') && model.toolItems.length === 1 &&
            model.toolItems.first().get('promoted')) {
          var name = model.get('name');
          model.set(model.toolItems.first().attributes);
          if (name) {
            model.set('name', name);
          }
        }
      });
      // Allow the tool item filtering be entered again
      --this._filtering;
      return filteredModels;
    },

    _filterToolItems: function (models) {
      var filteredModels = new Backbone.Collection(undefined,
          {model: ToolItemModel});
      _.each(models, function (model) {
        if (this.mask && !this.mask.passItem(model)) {
          return;
        }
        model = model.clone();
        var flyout = model.get('flyout'),
            toolItems = filteredModels;
        // Redirect flyout items
        if (flyout) {
          var flyoutItem = filteredModels.findWhere({flyout: flyout});
          if (!flyoutItem) {
            // Initialize sub-actions of the first encountered flyout
            model.toolItems = new Backbone.Collection(undefined,
                {model: ToolItemModel}); 
          } else {
            // Continue filling sub-actions into an existing flyout
            toolItems = flyoutItem.toolItems;
          }
        }
        var command = this.commands.get(model.get('signature')),
            // TODO: Remove this. Custom views should be either non-enablable,
            // or support a static enabling method, or use always a command for it.
            forceEnabled = model.get('enabled');
        if (command) {
          var data = _.extend({}, this.status.data, model.get('commandData')),
              status = _.defaults({
                toolItem: model,
                data: data
              }, this.status);
          if (command.isNonPromoted && !!command.isNonPromoted(status)) {
            model.set('csuiNonPromotedItem', true);
          }
          if (command.enabled && !command.enabled(status, {data: model.get('commandData')}) && !forceEnabled) {
            // Reject the action if the command is disabled
            model = null;
          } else if (flyout) {
            // Populate sub-actions of dynamic flyouts
            var actions = model.get('actions');
            if (actions) {
              actions = new Backbone.Collection(actions,
                  {model: ToolItemModel});
              actions = this._filterToolItems(actions.models);
              model.toolItems.reset(actions);
            }
          }
        } else if (!model.toolItems && !forceEnabled) {
          // Reject the action without an command. If this item is the main
          // flyout item, do not reject it; it may be populated later.
          model = null;
        }
        if (model) {
          // Place the item correctly to its group
          var group = model.get('group'),
              index = toolItems.findLastIndex(function (model) {
                return model.get('group') === group;
              });
          if (index < 0) {
            if (toolItems.length > 0 && this.addGroupSeparators &&
                (!this.suppressGroupSeparators || this.suppressGroupSeparators.indexOf(group) === -1)) {
              toolItems.push(ToolItemModel.createSeparator());
            }
            toolItems.push(model);
          } else {
            toolItems.add(model, {at: index + 1});
          }
          // TODO: Remove this as soon as custom views tool items are improved.
          model.status = this.status;
        }
      }, this);
      return filteredModels.models;
    },

    _resolveCustomViews: function () {
      var customToolItems = this.unfilteredModels.filter(function (toolItem) {
        return typeof toolItem.get('customView') === 'string';
      });
      if (!customToolItems.length) {
        return;
      }
      var customModules = customToolItems.map(function (toolItem) {
            return toolItem.get('customView');
          }),
          deferred      = $.Deferred();
      require(customModules,
          function () {
            for (var i = 0, count = customModules.length; i < count; ++i) {
              customToolItems[i].set('customView', arguments[i]);
            }
            deferred.resolve();
          }, function (error) {
            for (var i = 0, count = customModules.length; i < count; ++i) {
              customToolItems[i].set('customView', error);
            }
            deferred.reject(error);
          });
      return deferred.promise();
    }
  });

  return FilteredToolItemsCollection;
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/toolbar/impl/lazy.loading.template',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li role=\"menuitem\" class=\"csui-loading-parent-wrapper binf-disabled csui-disbaled\">\r\n  <span class=\"csui-loading-dots-wrapper\">\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n    <span class=\"csui-loading-dot\"></span>\r\n  </span>\r\n</li>";
}});
Handlebars.registerPartial('csui_controls_toolbar_impl_lazy.loading.template', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/toolbar/impl/toolbar',[],function(){});
csui.define('csui/controls/toolbar/toolbar.view',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/toolbar/toolitem.view',
  'csui/controls/toolbar/flyout.toolitem.view',
  'csui/controls/toolbar/toolitem.custom.view',
  'csui/models/nodes',
  'csui/controls/toolbar/toolitems.filtered.model',
  'hbs!csui/controls/toolbar/impl/lazy.loading.template',
  'css!csui/controls/toolbar/impl/toolbar'
], function (_, $, Backbone, Marionette, ToolItemView, FlyoutToolItemView,
    ToolItemCustomView, NodeCollection, FilteredToolItemsCollection, lazyloadingTemplate) {
  'use strict';

  var ToolBarView = Marionette.CollectionView.extend({
    tagName: "ul",
    parentScrollElement: '.csui-metadata-myattachments',
    className: function () {
      var cssClassForNavigationBar = "binf-nav binf-nav-pills ";
      var cssClassForAlignment = "csui-align-left";
      if (this.options.hAlign) {
        if (this.options.hAlign === "right") {
          cssClassForAlignment = "csui-align-right";
        }
        else if (this.options.hAlign === "none") {
          cssClassForAlignment = '';
        }
      }
      return "csui-toolbar " + cssClassForNavigationBar + cssClassForAlignment;
    },

    attributes: function () {
      var attrs = {};
      if (this.options.role) {
        attrs['role'] = this.options.role;
      }
      return attrs;
    },

    events: {"keydown": "onKeyInView"},

    getChildView: function (item) {
      // Choose which view class to render, depending on the properties of the item model
      var customView = item.get('customView');

      // dynamic user-defined custom view
      var viewClass = item.get('viewClass');
      if (customView === true && viewClass && viewClass.prototype instanceof Backbone.View) {
        return ToolItemCustomView;
      }

      if (customView) {
        if (customView === true) {
          // TODO: Deprecate this. Commands cannot resolve view modules
          // sychronously in the enable method.
          return item.get('commandData').customView || ToolItemView;
        }
        if (customView.prototype instanceof Backbone.View) {
          return customView;
        }
        if (typeof customView === 'string') {
          // TODO: handle unresolvable tool item
        }
      }

      return item.get('flyout') ? FlyoutToolItemView : ToolItemView;
    },

    childViewOptions: function (model) {
      return {
        collection: model.toolItems,
        toolbarCommandController: this.options.toolbarCommandController,
        toolbarItemsMask: this.options.toolbarItemsMask,
        originatingView: this.options.originatingView,
        blockingParentView: this.options.blockingParentView
      };
    },

    constructor: function ToolBarView(options) {
      options || (options = {});
      this.parentScrollElement = options.parentScrollElement || this.parentScrollElement;

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);

      // Passing the el to the ctor prevents creating an own el, including
      // setting its attributes.  The caller must ensure the right tag.
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }
      this.listenTo(this, 'dom:refresh', this._onDomRefresh)
          .listenTo(this, 'before:execute:command', this._setBlocked)
          .listenTo(this, 'after:execute:command', this._setUnblocked);

      if (options.keyboardNavigationEnabled) {
        this._keyboardNavigationEnabled = true;

        this.listenTo(this.collection, 'remove', function () {
          if (this._accFocusedToolbarItemIndex > this.collection.length - 1) {
            this._accFocusedToolbarItemIndex = this.collection.length - 1;
          }
        });
        this.listenTo(this.collection, 'reset', function () {
          this._accFocusedToolbarItemIndex = this.collection.length > 0 ? 0 : -1;
        });

        this._accFocusedToolbarItemIndex = this.collection.length > 0 ? 0 : -1;
      }

      this.fetchingNonPromotedActions = false;

      $(window).on('resize.' + this.cid, this._handleWindowResize.bind(this));
    },

    filter: function (model) {
      return !model.isSeparator();
    },

    _onDomRefresh: function () {
      if (!this._adjusting) {
        this._adjustToFit();
      }
    },

    onBeforeRender: function () {
      this._unwrapDropDown();
    },

    onRender: function () {
      if (this._toolbarBlocked) {
        this.$el.addClass('binf-disabled');
      }
    },

    onDestroy: function () {
      $(window).off('resize.' + this.cid);
    },

    _getFocusedElementByIndex: function (index) {
      var nth = index + 1;
      var el = this.$el.find('>li:nth-child(' + nth + ')>a.csui-acc-focusable');
      return el;
    },

    getVisibleToolitemsCount: function () {
      var el = this.$el.find('>li>a.csui-acc-focusable');
      return el.length;
    },

    currentlyFocusedElement: function () {
      if (this._keyboardNavigationEnabled && this._accFocusedToolbarItemIndex >= 0) {
        return this._getFocusedElementByIndex(this._accFocusedToolbarItemIndex);
      } else {
        return $();
      }
    },

    /* set the foucs to a childview identified by its index */
    setFocusByIndex: function (index) {
      this._getFocusedElementByIndex(index).focus();
    },

    letRightmostItemGetFocus: function () {
      this._accFocusedToolbarItemIndex = this.collection.length - 1;
    },

    closeDropdown: function () {
      this.children.call('closeDropdown');
    },

    onKeyInView: function (event) {
      if (!this._keyboardNavigationEnabled) {
        return; // skip keyboard navigation (to prevent interference with tabletoolbar
      }
      if (this.collection.length === 0) {
        return; // skip keyboard if no toolbar items are here
      }
      switch (event.keyCode) {
      case 37:
        // left arrow

        event.stopPropagation();

        if (this._accFocusedToolbarItemIndex > 0) {
          this._accFocusedToolbarItemIndex = this._accFocusedToolbarItemIndex - 1;
          this.triggerMethod('changed:focus');
        } else {
          this._accFocusedToolbarItemIndex = 0; // stay at first item
          this.triggerMethod('focusout', {direction: 'left'});
        }
        break;
      case 39:
        // right arrow:

        event.stopPropagation();

        if (this._accFocusedToolbarItemIndex < this.collection.length - 1) {
          this._accFocusedToolbarItemIndex = this._accFocusedToolbarItemIndex + 1;
          this.triggerMethod('changed:focus');
        }
        else {
          this._accFocusedToolbarItemIndex = this.collection.length - 1; // stay at last item
          this.triggerMethod('focusout', {direction: 'right'});
        }
        break;
      }
    },

    _handleWindowResize: function () {
      if (this._handleWindowResizeTimeout) {
        clearTimeout(this._handleWindowResizeTimeout);
      }
      if (!this.isDestroyed) {
        var self = this;
        this._handleWindowResizeTimeout = setTimeout(function () {
          self._handleWindowResizeTimeout = undefined;
          var checkNodesTableVisibility = self.options.originatingView === undefined ? true :
                                          self.options.originatingView.isDisplayed;
          if (!self.isDestroyed && checkNodesTableVisibility) {
            self.render(); // note: _adjustToFit is called from onDomRefresh
          }
        }, 100);
        this._adjustToFit();
      }
    },

    _setBlocked: function () {
      var self = this;
      this._blockedTimer = setTimeout(function () {
        // if in the meanwhile _setUnblock was called, then do the unblocking now after the delay
        if (self._toolbarBlocked === false) {
          self.$el.removeClass('binf-disabled');
        }
        self._blockedTimer = undefined;
      }, 500);

      this._toolbarBlocked = true;
      this.$el.addClass('binf-disabled');
    },

    _setUnblocked: function (eventArgs) {
      this._toolbarBlocked = false;
      if (!this._blockedTimer) {
        // unblock immediately if delay is already over
        this.$el.removeClass('binf-disabled');
        if (eventArgs && eventArgs.cancelled) {
          //tool item
          var targetToolItem  = this.$el.find('[data-csui-command=' +
                                              eventArgs.commandSignature.toLowerCase() + '] a'),
              //check if the tool item is inside drop down
              isUnderDropDown = targetToolItem.length ?
                                targetToolItem.closest('ul.csui-more-dropdown-menu') : {};
          if (isUnderDropDown.length) {
            //focus on drop down icon
            isUnderDropDown.siblings('a.binf-dropdown-toggle').focus();
          } else {
            //focus on tool item
            targetToolItem.focus();
          }
        }
      }
    },

    _adjustToFit: function () {
      // What it does:
      // Iterate through all toolbar items and compare the vertical position with the vertical
      // position of the first item. If it changes it is the toolbar item the browser wrapped
      // into the next line because of lack of horizontal width.
      // The toolbar item before, which is still rendered correctly and all following toolbar
      // items are moved into an inserted dropdown menu.

      if (this.$el.is(':visible')) {
        this._unwrapDropDown(); // revert already wrapped toolbar items
        this._adjusting = true;
        this.$el.addClass('csui-measuring');  // makes ul to overflow:hidden
        if (this.children.length > 0) {
          //In IE11 the iteration order for this.children.each is always in descending order. This is the
          //due to the native Object.keys functionality set by the browser. In order to keep the toolbar
          //display order consistent between browser, the sort order is set using underscore sortBy.
          var itemViews    = _.sortBy(this.children.toArray(), 'cid'),
              firstOffsetY = itemViews[0].$el.offset().top,
              //getBoundingClientRect: To get width in floating points
              rightMost    = this.$el[0].getBoundingClientRect() ?
                             this.$el[0].getBoundingClientRect().width : this.$el.width();
          this.options.toolbarItemViewOptions = {
            toolItemCounter: 0,
            pEl: undefined,
            pIsSeparator: undefined,
            ppEl: undefined,
            dropDownMenuEl: undefined,
            currentRight: 0,
            rightMost: rightMost,
            firstOffsetY: firstOffsetY,
            index: 0
          };

          _.chain(itemViews)
          // Skip empty (state) view
              .filter(function (view) {
                return view instanceof ToolItemView || view instanceof FlyoutToolItemView;
              })
              .each(function (toolItemView, index) {
                this.options.toolbarItemViewOptions.index = index;
                this._wrapToolItemView(toolItemView);
              }, this);
          // todo: the following is wrong, because the toolbar.view must not differentiate where
          // it is used:
          //To differentiate "tableHeader" with other table toolbars like filter, add, captions
          // etc, Declared option as "lazyActions" in toolbarItems.js(nodestable, favorites,
          // search results)
          if (this.options.lazyActions && itemViews.length && _.filter(itemViews, function (view) {
            return view instanceof ToolItemView || view instanceof FlyoutToolItemView;
          }).length) {
            var lazyActionsRetrieved = true;
            var isLocallyCreatedNode = true;
            var nonPromotedActionCommands = [];

            // 1. lazy actions fetched or not for selected nodes from tableView,
            // 2. is selected node gets created locally ,
            // 3. at least one of the selected nodes have nonPromoted commands(nonPromoted
            // commands set to model in delayed commandable mixin).

            var selectedNodes;
            if (this.collection.status.nodes instanceof NodeCollection) {
              selectedNodes = this.collection.status.nodes;
            } else {
              if (this.collection.status.nodes instanceof Backbone.Collection) {
                selectedNodes = new NodeCollection(this.collection.status.nodes.models);
              } else {
                if (_.isArray(this.collection.status.nodes)) {
                  selectedNodes = new NodeCollection(this.collection.status.nodes);
                } else {
                  selectedNodes = new NodeCollection();
                }
              }
            }
            if (!selectedNodes.connector) {
              selectedNodes.connector = this.collection.status.collection.connector;
            }

            selectedNodes.each(function (selectedNode) {
              lazyActionsRetrieved = lazyActionsRetrieved &&
                                     selectedNode.get('csuiLazyActionsRetrieved');
              isLocallyCreatedNode = isLocallyCreatedNode && selectedNode.isLocallyCreated;
              nonPromotedActionCommands = nonPromotedActionCommands.length ?
                                          nonPromotedActionCommands :
                                          selectedNode.nonPromotedActionCommands;
            });

            selectedNodes.nonPromotedActionCommands = nonPromotedActionCommands;
            selectedNodes.lazyActionsRetrieved = lazyActionsRetrieved;

            if (!lazyActionsRetrieved && !isLocallyCreatedNode &&
                nonPromotedActionCommands.length) { //Lazy actions are not
              // retrieved for at-leasst one of the selected nodes and
              if (!this.fetchingNonPromotedActions) { //fetching nonpromoted actions not yet started
                this._renderLazyActions(selectedNodes);
              }
              if (!this.$el.find('.csui-loading-parent-wrapper').length) {
                if (this.$el.find('.csui-more-dropdown-menu').length) {//hide dropdown with loading
                  this.$el.find('.binf-dropdown.csui-more-dropdown-wrapper').addClass(
                      'csui-toolbar-hide-child');
                } else { //no 3 dots dropdown
                  var loadingAnimationWidth = 46,
                      loadingAnimationRight = this.options.toolbarItemViewOptions.currentRight +
                                              10 + loadingAnimationWidth;
                  if (this.options.toolbarItemViewOptions.toolItemCounter ===
                      this.options.maxItemsShown || loadingAnimationRight >
                      this.options.toolbarItemViewOptions.rightMost) {
                    this.$el.find('li:last').addClass('csui-toolbar-hide-child');
                  }
                }
                this.$el.append(lazyloadingTemplate);
              }

            }

          }

        }
        this.$el.removeClass('csui-measuring'); // use overflow style only during measuring
        this._adjusting = false;
      }
    },

    _wrapToolItemView: function (toolItemView) {
      var isSeparator = toolItemView.model.isSeparator();
      if (!isSeparator) {
        this.options.toolbarItemViewOptions.toolItemCounter++;
      }
      if (this.options.toolbarItemViewOptions.dropDownMenuEl) {
        // move the remaining toolbar items into the ul of the dropdown menu
        // but not the last item if it is a separator
        if (!(isSeparator &&
              this.options.toolbarItemViewOptions.index + 1 === this.children.length)) {
          toolItemView.$el.attr('role', 'menuitem');
          toolItemView.$el.find('.csui-flyout-arrow').addClass('binf-hidden');
          toolItemView.$el.find('.csui-flyout-arrow-enabled').removeClass(
              'csui-flyout-arrow-enabled');
          this.options.toolbarItemViewOptions.dropDownMenuEl.append(toolItemView.$el);
        }
      } else {
        if (!isSeparator) {
          var currentOffsetY   = toolItemView.$el.offset().top,
              currElementWidth = toolItemView.$el[0].getBoundingClientRect() ?
                                 toolItemView.$el[0].getBoundingClientRect().width :
                                 toolItemView.$el.width();
          this.options.toolbarItemViewOptions.currentRight = this.options.toolbarItemViewOptions.currentRight +
                                                             parseInt(currElementWidth, 10);
          // check if element already wrapped because not enough space to render it in one line
          if (currentOffsetY !== this.options.toolbarItemViewOptions.firstOffsetY ||
              this.options.toolbarItemViewOptions.currentRight >
              this.options.toolbarItemViewOptions.rightMost ||
              (this.options.toolbarItemViewOptions.toolItemCounter > this.options.maxItemsShown)) {
            // the previous toolbar item will be replaced by dropdown menu and moved into it
            if (this.options.toolbarItemViewOptions.pIsSeparator) {
              if (this.options.toolbarItemViewOptions.ppEl) {
                // Move pre-previous element and the current element to the dropdown
                this.options.toolbarItemViewOptions.ppEl.attr('role', 'menuitem');
                this.options.toolbarItemViewOptions.dropDownMenuEl = this._wrapWithDropDown(
                    this.options.toolbarItemViewOptions.ppEl, toolItemView);
                // Insert the previous separator between the pre-previous element
                // and the current element in the dropdown
                this.options.toolbarItemViewOptions.dropDownMenuEl.children().first().after(
                    this.options.toolbarItemViewOptions.pEl);
              }
            } else {
              if (this.options.toolbarItemViewOptions.pEl) {
                // Move the previous element to the dropdown
                this.options.toolbarItemViewOptions.pEl.attr('role', 'menuitem');
                this.options.toolbarItemViewOptions.dropDownMenuEl = this._wrapWithDropDown(
                    this.options.toolbarItemViewOptions.pEl, toolItemView);
              } else {
                // there is no previous toolbar item -> wrap the current toolbar item into a
                // dropdown menu at the beginning of the toolbar
                this.options.toolbarItemViewOptions.dropDownMenuEl = this._wrapWithDropDown(
                    toolItemView.$el, toolItemView);
              }
            }
          } else {
            var focusableElement = toolItemView.$el.find('a.csui-toolitem');
            focusableElement.addClass("csui-acc-focusable");
          }
        }
        this.options.toolbarItemViewOptions.ppEl = this.options.toolbarItemViewOptions.pEl;
        this.options.toolbarItemViewOptions.pEl = toolItemView.$el;
        this.options.toolbarItemViewOptions.pIsSeparator = isSeparator;
      }
    },

    _wrapWithDropDown: function (pEl, toolItemView) {
      pEl.wrap(
          '<li class="binf-dropdown csui-wrapper csui-more-dropdown-wrapper"><ul class="binf-dropdown-menu csui-more-dropdown-menu" role="menu"></ul></li>');
      var e = this._makeDropDown();
      var dropDownEl = this.$('li.csui-wrapper');
      dropDownEl.prepend(e);
      var dropDownMenuEl = dropDownEl.find('> ul.binf-dropdown-menu');
      toolItemView.$el.attr('role', 'menuitem');
      toolItemView.$el.find('.csui-flyout-arrow').addClass('binf-hidden');
      toolItemView.$el.find('.csui-flyout-arrow-enabled').removeClass('csui-flyout-arrow-enabled');
      dropDownMenuEl.append(toolItemView.$el); // move current toolitem into dropdown

      var that = this;
      this.$el.on({
        "show.binf.dropdown": _.bind(function () {

          var scrollableParent = dropDownMenuEl.closest(that.parentScrollElement);
          if (!!scrollableParent && scrollableParent.length > 0) {
            var scrollableParentHeight = scrollableParent.height(),
                elementSetBacks        = parseInt(scrollableParent.css("margin-top")) +
                                         parseInt(scrollableParent.css("margin-bottom"));
            // check whether dropdown menu overlaps on it's parent scrollable element.
            if (dropDownMenuEl.height() + elementSetBacks > scrollableParentHeight) {
              var heightOfDD = scrollableParentHeight - elementSetBacks;
              dropDownMenuEl.css({
                "overflow": "hidden",
                "padding": "0",
                "max-height": heightOfDD + "px"
              });
              //bug with perfect-scrollbar that does not show bar for the first time
              setTimeout(function () {
                dropDownMenuEl.perfectScrollbar({suppressScrollX: true});
                dropDownMenuEl.perfectScrollbar("update");
              }, 1);
            }
          }
        }, that)
      });

      return dropDownMenuEl;
    },

    _unwrapDropDown: function () {
      // remove dropdown menu
      var dropDownEl     = this.$('li.csui-wrapper'),
          dropDownMenuEl = dropDownEl.find('> ul.binf-dropdown-menu'),
          loadDotsElem   = this.$el.find('.csui-loading-parent-wrapper');
      loadDotsElem && loadDotsElem.remove();
      if (dropDownMenuEl.length > 0) {
        var menuItems = dropDownMenuEl.children();
        menuItems.each(function (index, menuitem) {
          $(menuitem).removeAttr('role');
          dropDownEl.before(menuitem);
        });
        dropDownEl.remove();
      }
    },

    _makeDropDown: function () {
      var e = '<a href="#" class="binf-dropdown-toggle csui-acc-focusable"' +
              ' data-binf-toggle="dropdown" aria-expanded="false" aria-haspopup="true"';
      // TODO handle the aria-expanded state
      if (this.options.dropDownText) {
        e += ' title="' + this.options.dropDownText + '" aria-label="' + this.options.dropDownText +
             '">';
      } else {
        e += '>';
      }
      if (this.options.dropDownIcon) {
        e += '<span class="' + this.options.dropDownIcon + '"></span>';
      } else {
        if (this.options.dropDownText) {
          e += this.options.dropDownText;
          // TODO might be duplicate with the aria-label above?
        }
      }
      e += "</a>";
      return e;
    },

    _renderLazyActions: function (selectedNodes) {
      if (!selectedNodes.lazyActionsRetrieved) {
        var self = this;
        this.fetchingNonPromotedActions = true;

        selectedNodes.setEnabledLazyActionCommands(
            true).done(_.bind(function () {
          self.fetchingNonPromotedActions = false;
          //Validate lazy actions are  permitted actions or not
          var blockingEle = self.$el.find('.csui-loading-parent-wrapper');
          //As per UX review comments, 300 ms given before rendering lazy actions
          blockingEle.animate("width: 0", 300, function () {
            blockingEle.remove();
            self.$el.find('.csui-toolbar-hide-child').removeClass('csui-toolbar-hide-child');
            self.collection.silentFetch = true; //to stop re-rendering tableheader-toolbar
            self.collection.refilter();
            var index = 0;//local variable to find out rendered promoted item from collection , since collection get change after fetching nonpromoted action
            _.each(self.collection.models, function (model) {
              var existingchildViews = _.sortBy(self.children.toArray(), 'cid'),
                  existingChildView  = existingchildViews[index],
                  signature          = model.get('signature');
              if (existingChildView && existingChildView instanceof FlyoutToolItemView) { //re-render flyout toolitem view, if child flyout toolitems count is differnt
                if (model.get('flyout') && model.toolItems.length !==
                    existingChildView.model.toolItems.length) {
                  existingChildView.collection.reset(model.toolItems.models);
                }
                index++;
              } else if (existingChildView && existingChildView.model.get('signature') ===
                         signature) {
                index++;
              } else {
                self.options.toolbarItemViewOptions.index++;
                var childViewClass   = model.get('flyout') ? FlyoutToolItemView : ToolItemView,
                    lazyToolItemView = self.addChild(model, childViewClass,
                        self.options.toolbarItemViewOptions.index);
                self._wrapToolItemView(lazyToolItemView);
              }
            });
            self.triggerMethod('dom:refresh');
            self.trigger('render:lazy:actions');
          });

        }), this);
      }
    }

  });

  return ToolBarView;
});

csui.define('csui/controls/toolbar/toolbar.command.controller',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/commandhelper', 'csui/utils/commands'
], function (_, $, Backbone, CommandHelper, commands) {
  'use strict';

  function ToolbarCommandController(options) {
    options || (options = {});
    this.commands = options.commands || commands;
    this.nameAttribute = options.nameAttribute;
  }

  _.extend(ToolbarCommandController.prototype, Backbone.Events, {

    toolitemClicked: function (toolItem, status) {
      var signature = toolItem.get("signature");
      var command = this.commands.findWhere({
        signature: signature
      });

      var addableTypeName = toolItem.get("name");
      var addableType = toolItem.get("type");

      // Special toolbars, like the "Add" toolbar pre-populate
      // the command data with additional information; addable types,
      // for example. The data from the tool item have to be merged
      // with them. One level should be enough; the same property
      // should be better replaced, than deeply merged without knowing
      // its semantics on this code level.
      var data = _.extend({}, status.data, toolItem.get('commandData'));
      status = _.defaults({
        toolItem: toolItem,
        data: data
      }, status);

      var eventArgs = {
        status: status,
        commandSignature: signature,
        addableType: addableType,
        addableTypeName: addableTypeName,
        command: command
      };
      this.trigger('before:execute:command', eventArgs);
      Backbone.trigger('closeToggleAction');  // don't copy this to newer code! This is ugly
      // code. Better solution would be to let click events propagate so that binf get's the
      // event and closes open dropdown lists without using a global Backbone event.
      // It would be good to refactor this.

      var self = this;
      self.commandSignature = signature;
      try {

        var executeOptions = {
          context: status.context,
          // TODO: Move all this single command specific attributes
          // to the data above
          addableType: addableType,
          addableTypeName: addableTypeName,
          nameAttribute: self.nameAttribute
        };

        // command could defer resolving until something is done (like a modal dialog,...)
        var promiseFromCommand = command.execute(status, executeOptions);

        // the command execution was responsible to set status.formwardToTable = true in case of
        // inline forms should handle further processing

        CommandHelper.handleExecutionResults(
            promiseFromCommand, {
              command: command,
              suppressSuccessMessage: status.forwardToTable || status.suppressSuccessMessage,
              suppressFailMessage: status.suppressFailMessage
            })
            .done(function (nodes) {
              if (nodes && !nodes[0].cancelled) {
                // allow any listeners to continue with something after the command was executed
                // for example the nodestable.view would create an inline form for newly created nodes
                eventArgs.newNodes = nodes;
                self.trigger('after:execute:command', eventArgs);
              }
            })
            .fail(function (error) {
              // in case the command was cancelled, error is undefined
              if (error === undefined) {
                error = {
                  cancelled: true,
                  commandSignature: self.commandSignature
                };
              }
              self.trigger('after:execute:command', error);
            });
      }
          //If command.execute throws and error during execute, let the listeners handle execution.
      catch (e) {
        self.trigger('after:execute:command', eventArgs);
      }

    }
  });

  ToolbarCommandController.extend = Backbone.View.extend;

  return ToolbarCommandController;
});

csui.define('csui/controls/toolbar/toolitems.mask',['csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  // Masks tool items.
  // mask: {blacklist, whitelist}
  // simple by signatures: ['Copy', 'Delete']
  // complex by other properties: [
  //   {signature: 'AddVersion'},
  //   {signature: 'Add', commandData: {type: 144}}
  // ]
  function ToolItemsMask(mask, options) {
    options || (options = {});
    if (options.normalize !== false) {
      mask = this._normalizeMask(mask);
    }
    this.blacklist = mask.blacklist;
    this.whitelist = mask.whitelist;
    this.storeMask();
  }

  _.extend(ToolItemsMask.prototype, Backbone.Events, {

    toJSON: function () {
      return {
        blacklist: _.clone(this.blacklist),
        whitelist: _.clone(this.whitelist)
      };
    },

    clone: function () {
      return new this.constructor(this);
    },

    clearMask: function (options) {
      var modified = this.blacklist.length || this.whitelist.length;
      this.blacklist.splice(0);
      this.whitelist.splice(0);
      if (modified && !(options && options.silent)) {
        this.trigger('update', this);
      }
      return modified;
    },

    extendMask: function (mask, options) {
      options || (options = {});
      if (options.normalize !== false) {
        mask = this._normalizeMask(mask);
      }
      var modified = this._extendList(this.blacklist, mask.blacklist);
      modified = this._extendList(this.whitelist, mask.whitelist) || modified;
      if (modified && !options.silent) {
        this.trigger('update', this);
      }
      return modified;
    },

    resetMask: function (mask, options) {
      options || (options = {});
      if (options.normalize !== false) {
        mask = this._normalizeMask(mask);
      }
      var modified = this._replaceList(this.blacklist, mask.blacklist);
      modified = this._replaceList(this.whitelist, mask.whitelist) || modified;
      if (modified && !options.silent) {
        this.trigger('update', this);
      }
      return modified;
    },

    storeMask: function () {
      this.originalBlacklist = _.clone(this.blacklist);
      this.originalWhitelist = _.clone(this.whitelist);
    },

    restoreMask: function (options) {
      options || (options = {});
      return this.resetMask({
        blacklist: this.originalBlacklist,
        whitelist: this.originalWhitelist
      }, {
        silent: options.silent,
        normalize: false
      });
    },

    restoreAndResetMask: function (mask, options) {
      options || (options = {});
      if (options.normalize !== false) {
        mask = this._normalizeMask(mask);
      }
      var modified = this.restoreMask({silent: true});
      modified = this.extendMask(mask, {
        silent: true,
        normalize: false
      }) || modified;
      if (modified && !options.silent) {
        this.trigger('update', this);
      }
      return modified;
    },

    maskItems: function (items) {
      if (items instanceof Backbone.Collection) {
        items = items.models;
      }
      return _.filter(items, this.passItem, this);
    },

    passItem: function (item) {
      if (item instanceof Backbone.Model) {
        item = item.attributes;
      }
      // Never pass blacklisted items. If there is a whitelist,
      // pass only whitelisted items.
      return !this._containsRule(item, this.blacklist) &&
          (!this.whitelist.length || this._containsRule(item, this.whitelist));
    },

    _containsRule: function (item, rules) {
      return _.any(rules, _.bind(this._matchesRule, this, item));
    },

    _matchesRule: function (item, rule) {
      if (item.signature != rule.signature) {
        return false;
      }
      var commandData = item.commandData || {};
      return _.all(rule.commandData, function (value, name) {
        return value == commandData[name];
      });
    },

    _extendList: function (target, source) {
      return _.reduce(source, function (modified, sourceRule) {
        if (!_.any(target, function (targetRule) {
          return _.isEqual(sourceRule, targetRule);
        })) {
          target.push(sourceRule);
          modified = true;
        }
        return modified;
      }, false);
    },

    _reduceList: function (target, source) {
      var indexes = _
              .chain(target)
              .map(function (targetRule, index) {
                return !_.any(source, function (sourceRule) {
                  return _.isEqual(targetRule, sourceRule);
                }) ? index : undefined;
              })
              .compact()
              .value(),
          shift = 0;
      _.each(indexes, function (index) {
        target.splice(index - shift++, 1);
      });
      return !!indexes.length;
    },

    _replaceList: function (target, source) {
      var modified = this._reduceList(target, source);
      return this._extendList(target, source) || modified;
    },

    _normalizeMask: function (mask) {
      mask || (mask = {});
      return {
        blacklist: this._normalizeList(mask.blacklist),
        whitelist: this._normalizeList(mask.whitelist)
      };
    },

    _normalizeList: function (rules) {
      return rules ? _.map(rules, this._normalizeRule, this) : [];
    },

    // Possible inputs:
    //   'signature'             (signature as string)
    //   {signature: '...', ...} (object with 'signature' and other properties)
    // Output:
    //   {signature: '...', ...} (object with 'signature' and other properties)
    _normalizeRule: function (rule) {
      if (_.isObject(rule)) {
        return rule;
      }
      return {signature: rule};
    }

  });

  ToolItemsMask.extend = Backbone.Model.extend;

  return ToolItemsMask;

});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/toolbar/impl/toolbar.state',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<p>"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{}}) : helper)))
    + "</p>\r\n";
}});
Handlebars.registerPartial('csui_controls_toolbar_impl_toolbar.state', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/toolbar/toolbar.state.view',['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/toolbar/impl/toolbar.state',
  'i18n!csui/controls/toolbar/impl/nls/localized.strings'
], function (_, Marionette, template, lang) {
  'use strict';

  var ToolbarStateView = Marionette.ItemView.extend({

    tagName: 'li',

    className: 'csui-toolbar-state',

    template: template,

    constructor: function ToolbarStateView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', function () {
        // TODO: Find out, why a destroyed inline action bar still
        // get this event triggered on the action state model
        if (!this.isDestroyed) {
          this.render();
        }
      });
      this.statusMessages = {
        loading: lang.loadingActionsMessage,
        failed: lang.failedActionsMessage
      };
    },

    serializeData: function () {
      // Show the message only if there are items to handle by actions
      var message = this.model.get('showMessage') ? // empty, loading, failed
                    this.statusMessages[this.model.get('state')] : undefined;
      return _.extend(this.model.toJSON(), {
        message: message
      });
    }

  });

  return ToolbarStateView;

});

csui.define('csui/controls/toolbar/toolbar.state.behavior',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/toolbar/toolbar.state.view'
], function (_, Backbone, Marionette, ToolbarStateView) {
  'use strict';

  var ToolbarStateBehavior = Marionette.Behavior.extend({

    constructor: function ToolbarStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;

      // Behaviors are created before the collection is stored in view
      var collection     = view.collection || view.options.collection,
          delayedActions = this.getOption('delayedActions');
      if (_.isFunction(delayedActions) &&
          !(delayedActions instanceof Backbone.Collection)) {
        delayedActions = delayedActions.call(view);
      }
      if (!delayedActions && collection) {
        delayedActions = collection.delayedActions;
      }
      if (delayedActions) {
        this
            .listenTo(delayedActions, 'request', this._fetchingActionsStarted)
            .listenTo(delayedActions, 'sync', this._fetchingActionsSucceeded)
            .listenTo(delayedActions, 'error', this._fetchingActionsFailed);
      }
      this.listenTo(collection, 'reset change', this._fetchingActionsSucceeded);

      view.actionState = new Backbone.Model({
        state: delayedActions && (delayedActions.fetching ? 'loading' :
                                  delayedActions.error ? 'failed' :
                                  collection.length ? 'full' : 'empty'),
        showMessage: true
      });

      view.emptyView = ToolbarStateView;
      view.emptyViewOptions = {
        model: view.actionState,
        toolbarView: view
      };

      this.listenTo(view, 'render', this._updateClasses);
    },

    _fetchingActionsStarted: function () {
      this.view.actionState.set('state', 'loading');
      this._updateClasses();
    },

    _fetchingActionsSucceeded: function (collection) {
      this.view.actionState.set('state', collection.length ? '' : 'emptyfull');
      this._updateClasses();
    },

    _fetchingActionsFailed: function () {
      this.view.actionState.set('state', 'failed');
      this._updateClasses();
    },

    _updateClasses: function () {
      this.view.$el
          .removeClass('csui-state-empty csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.view.actionState.get('state'));
    }

  });

  return ToolbarStateBehavior;

});

csui.define('csui/controls/toolbar/delayed.toolbar.view',['csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/toolbar.state.behavior',
], function (ToolbarView, ToolbarStateBehavior) {
  'use strict';

  var DelayedToolbarView = ToolbarView.extend({

    behaviors: {

      ToolbarState: {
        behaviorClass: ToolbarStateBehavior,
        delayedActions: function () {
          return this.options.delayedActions;
        }
      }

    },

    constructor: function DelayedToolbarView(options) {
      ToolbarView.prototype.constructor.apply(this, arguments);
    }

  });

  return DelayedToolbarView;

});

csui.define('csui/utils/taskqueue',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, $, _, Backbone, log) {
  'use strict';

  log = log(module.id);

  var Task = Backbone.Model.extend({

    constructor: function Task(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.deferred = $.Deferred();
    },

    promise: function () {
      return this.deferred.promise();
    }

  });

  var TaskCollection = Backbone.Collection.extend({model: Task});

  function TaskQueue(options) {
    this.parallelism = options && options.parallelism || Infinity;
    this.pending = new TaskCollection(undefined, {model: Task});
    this.pending.on("add", this.dequeue, this);
    this.active = new TaskCollection(undefined, {model: Task});
  }

  _.extend(TaskQueue.prototype, {

    dequeue: function () {
      var task;
      log.debug(
          'Pending queue {0} contains {1} tasks, active queue {0} contains {1} tasks.',
          this.pending.cid, this.pending.length, this.active.cid, this.active.length)
      && console.log(log.last);
      if (this.active.length < this.parallelism &&
          (task = this.pending.shift())) {
        this.execute(task);
        this.dequeue();
      }
    },

    execute: function (task) {
      log.debug('Executing task {0}...', task.cid)
      && console.log(log.last);
      this.active.add(task);
      task.get("worker")()
          .done(task.deferred.done)
          .fail(task.deferred.fail)
          .always(_.bind(function () {
            this.active.remove(task);
            this.dequeue();
          }, this));
    }

  });

  TaskQueue.Task = Task;
  TaskQueue.TaskCollection = TaskCollection;
  TaskQueue.version = "1.0";

  return TaskQueue;

});

csui.define('csui/controls/fileupload/impl/upload.controller',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/taskqueue', 'csui/models/version',
  'csui/utils/commandhelper', 'csui/lib/underscore.deepExtend'
], function (module, _, $, Backbone, base, TaskQueue, VersionModel, CommandHelper) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  function UploadController(options) {
    options || (options = {});
    this.container = options.container? options.container.clone(): null;
    this.queue = new TaskQueue({
      parallelism: options.parallelism || config.parallelism
    });
  }

  _.extend(UploadController.prototype, Backbone.Events, {

    scheduleFileForUpload: function (fileUpload) {
      this.queue.pending.add({
        worker: _.bind(this._uploadFile, this, fileUpload)
      });
    },

    _uploadFile: function (fileUpload) {
      var container    = fileUpload.container || this.container,
          deferred     = fileUpload.deferred,
          node         = fileUpload.node,
          // TODO: Enable switching between newName and newVersion during
          // the life of this model by some better interface
          version      = fileUpload.version || fileUpload.get('newVersion'),
          file         = fileUpload.get("file"),
          extendedData = fileUpload.get('extended_data'),
          data;

      if (_.isArray(node.get('versions'))) {
        !!node.attributes && !!node.attributes.versions &&
        node.attributes.versions.push(version.attributes);

      }
      // Enable switching among new node and new version modes during
      // the lifetime of this model; an interface would be better, not
      // no have upload.controller knowing the difference
      if (version) {
        if (!node.has('id')) {
          node.set('id', fileUpload.get('id'));
        }
        if (!(version instanceof VersionModel)) {
          version = new VersionModel({
            id: node.get('id')
          });
        }
        data = {};
      } else {
        if (!container) {
          throw new Error('Container node is missing.');
        }
        data = {
          name: fileUpload.get('newName') || file.name,
          type: fileUpload.get('type') || 144,
          parent_id: container && container.get('id')
        };
      }

      // additional attributes may come from metadata entered by the user
      if (extendedData) {
        _.deepExtend(data, extendedData);
      }

      // FileUploadModel should be created with a container or connector
      // to make its node cloneable right away and other components could
      // refer to it.  But if not needed, use the default container of the
      // upload controller to provide the connector.
      if (!node.connector) {
        if (!container) {
          throw new Error('Either node or container have to be connected.');
        }
        container.connector.assignTo(node);
      }
      if (version && !version.connector) {
        node.connector.assignTo(version);
      }

      // Send the creation data in the extra options instead of setting
      // them to the module attributes.  Node URL is computed according
      // to its attributes - missing ID means trying a volume by its type.
      // This may be changed to use different initialization parameters
      // than the node properties for decreased convenience.  When you
      // change this, code, check out the controller/createobject too.
      // The attributes should be set correctly anyways when the server
      // returns the attributes of the new node, they'll be merged into
      // the node model.
      var jqxhr = (version || node).save(data, {
        data: data,
        files: {file: file}
      });
      jqxhr.progress(function (event, request) {
            deferred.notify(fileUpload, event);
          })
          .then(function (data, result, request) {
            if (node) {
              node.setFields('versions.element(0)');
              return node.fetch({refreshCache:true});
            }
          })
          .done(function (data, result, request) {
            deferred.resolve(fileUpload);
          })
          .fail(function (request, message, statusText) {
            var error = new base.RequestErrorMessage(request);
            deferred.reject(fileUpload, error);
          });
      deferred.fail(function (model, error) {
        // we interpret a reject called without an error object as an abort.
        if (!error) {
          jqxhr.abort();
        }
      });
      return fileUpload.promise();
    }

  });

  UploadController.extend = Backbone.View.extend;

  return UploadController;

});

csui.define('csui/controls/checkbox/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/checkbox/impl/nls/root/lang',{
  ariaLabel: 'Item selection',
  title: 'Item selection'
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/checkbox/impl/checkbox.view',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<button type=\"button\" role=\"checkbox\" class=\"csui-control csui-checkbox\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaLabel || (depth0 != null ? depth0.ariaLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaLabel","hash":{}}) : helper)))
    + "\"\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.disabled || (depth0 != null ? depth0.disabled : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"disabled","hash":{}}) : helper)))
    + "\r\n        title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\" aria-checked=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaChecked || (depth0 != null ? depth0.ariaChecked : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaChecked","hash":{}}) : helper)))
    + "\" >\r\n  <span class=\"csui-icon\"></span>\r\n</button>";
}});
Handlebars.registerPartial('csui_controls_checkbox_impl_checkbox.view', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/control/impl/control',[],function(){});

csui.define('css!csui/controls/checkbox/impl/checkbox.view',[],function(){});
csui.define('csui/controls/checkbox/checkbox.view',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'i18n!csui/controls/checkbox/impl/nls/lang',
  'hbs!csui/controls/checkbox/impl/checkbox.view',
  'css!csui/controls/control/impl/control',
  'css!csui/controls/checkbox/impl/checkbox.view'
], function ($, _, Backbone, Marionette, lang, template) {
  'use strict';

  return Marionette.ItemView.extend({

    // all controls should have csui-control-view for applying common css */
    className: 'csui-control-view csui-checkbox-view',
    template: template,

    templateHelpers: function () {
      var checked = this.model.get("checked");
      return {
        disabled: this.model.get('disabled') ? 'disabled' : '',
        ariaChecked: checked,
        title: this.title ? this.title : lang.title,
        ariaLabel: this.ariaLabel ? this.ariaLabel : lang.ariaLabel
      };
    },

    modelEvents: {
      'change:disabled': '_handleDisableChanged',
      'change:checked': '_handleCheckedChanged'
    },

    ui: {
      cb: 'button.csui-control.csui-checkbox'
    },

    events: {
      'click': '_toggleChecked'
    },

    constructor: function Checkbox(options) {
      options || (options = {});

      this.ariaLabel = options.ariaLabel;
      this.title = options.title;

      if (!options.model) {

        options.model = new Backbone.Model(
            {disabled: options.disabled === undefined ? false : options.disabled}
        );

      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._setChecked(options.checked, {silent: true});
    },

    setDisabled: function (d) {
      this.model.set('disabled', !!d);
    },

    setChecked: function (state) {
      var options = {silent: false};
      if (this.model.get('disabled')) {
        options.silent = true;
      }
      this._setChecked(state, options);
    },

    _handleDisableChanged: function () {
      this.ui.cb.prop('disabled', this.model.get('disabled'));
    },

    _handleCheckedChanged: function () {
      var checked = this.model.get("checked");
      this.ui.cb.attr('aria-checked', checked);
    },

    _setChecked: function (state, options) {
      switch (state) {
      case 'true':
      case true:
        this.model.set('checked', 'true', options);
        break;
      case 'mixed':
        this.model.set('checked', 'mixed', options);
        break;
      default:
        this.model.set('checked', 'false', options);
        break;
      }
    },

    _toggleChecked: function () {
      if (this.model.get('disabled')) {
        return; // don't change checkbox and don't fire events, because it's disabled
      }

      // first trigger a clicked event and if no listener set cancel=true on the event args toggle
      // the checked state
      var currentState = this.model.get('checked');
      var args = {sender: this, model: this.model};
      this.triggerMethod('clicked', args);

      if (!args.cancel) {
        if (!currentState || currentState === 'false' || currentState === 'mixed') {
          this.model.set('checked', 'true');
        } else {
          this.model.set('checked', 'false');
        }
      }
    }

  });
});
csui.define('csui/behaviors/keyboard.navigation/retainfocus.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/log',
  'csui/lib/marionette'
], function (module, _, $,
    log,
    Marionette) {
  'use strict';

  var RetainFocusBehavior = Marionette.Behavior.extend({

        ui: {
          control: '.csui-control'
        },

        events: {
          'mousedown @ui.control': '_startActive',
          'focusout @ui.control': '_stopActive',
          'keydown @ui.control': '_stopActive'
        },

        constructor: function RetainFocusBehavior(options, view) {
          Marionette.Behavior.prototype.constructor.apply(this, arguments);

          this._isFocused = false;

          this.listenTo(view, 'before:render', function () {
            this._isRendering = true;
            if (view.isRendered) {
              // check focus only when re-rendered
              var controlEl = this.ui.control[0];
              this._isFocused = document.activeElement === controlEl;
            }
          });

          this.listenTo(view, 'render', function () {
            this._isRendering = false;
          });

          this.listenTo(view, 'dom:refresh', function () {
            this._reApplyFocus();
          });

        },

        _reApplyFocus: function () {
          if (this._isActive) {
            this.ui.control.addClass('csui-control-active');
          } else {
            this.ui.control.removeClass('csui-control-active');
          }
          if (this._isFocused) {
            this.ui.control.focus();
          }
        },

        _startActive: function () {
          this._isActive = true;
          this.ui.control.addClass('csui-control-active');
        },

        _stopActive: function () {
          if (!this._isRendering) {
            this.ui.control.removeClass('csui-control-active');
            this._isActive = false;
          }
        }

      },
      {
        // static methods:
      }
  );

  return RetainFocusBehavior;
});

csui.define('csui/controls/disclosure/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/disclosure/impl/nls/root/lang',{
  ariaLabel: 'Information disclosure',
  titleDisclosed: 'See all',
  titleExpanded: 'See less'
});



/* START_TEMPLATE */
csui.define('hbs!csui/controls/disclosure/impl/disclosure.view',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<button class=\"csui-control csui-disclosure\" aria-expanded=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaExpanded || (depth0 != null ? depth0.ariaExpanded : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaExpanded","hash":{}}) : helper)))
    + "\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaLabel || (depth0 != null ? depth0.ariaLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaLabel","hash":{}}) : helper)))
    + "\" "
    + this.escapeExpression(((helper = (helper = helpers.disabled || (depth0 != null ? depth0.disabled : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"disabled","hash":{}}) : helper)))
    + " title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">\r\n  <span class=\"csui-icon\"></span>\r\n</button>";
}});
Handlebars.registerPartial('csui_controls_disclosure_impl_disclosure.view', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/controls/disclosure/impl/disclosure.view',[],function(){});
csui.define('csui/controls/disclosure/disclosure.view',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/retainfocus.behavior',
  'i18n!csui/controls/disclosure/impl/nls/lang',
  'hbs!csui/controls/disclosure/impl/disclosure.view',
  'css!csui/controls/control/impl/control',
  'css!csui/controls/disclosure/impl/disclosure.view'
], function ($, _, Backbone, Marionette, RetainFocusBehavior, lang, template) {
  'use strict';

  return Marionette.ItemView.extend({

    // all controls should have csui-control-view for applying common css */
    className: 'csui-control-view csui-disclosure-view',
    template: template,

    templateHelpers: function () {
      var expanded = this.model.get("expanded");
      return {
        disabled: this.model.get('disabled') ? 'disabled' : '',
        ariaExpanded: expanded,
        title: expanded ? (this.titleExpanded ? this.titleExpanded : lang.titleExpanded) :
               (this.titleDisclosed ? this.titleDisclosed : lang.titleDisclosed),
        ariaLabel: this.ariaLabel ? this.ariaLabel : lang.ariaLabel
      };
    },

    modelEvents: {
      'change:disabled': 'render',
      'change:expanded': 'render'
    },

    events: {
      'click': '_toggleExpanded'
    },

    behaviors: {
      RetainFocusBehavior: {behaviorClass: RetainFocusBehavior}
    },

    constructor: function Disclosure(options) {
      options || (options = {});

      this.ariaLabel = options.ariaLabel;
      this.titleDisclosed = options.titleDisclosed;
      this.titleExpanded = options.titleExpanded;

      if (!options.model) {

        options.model = new Backbone.Model(
            {
              disabled: options.disabled === undefined ? false : options.disabled
            });

      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.setExpanded(options.expanded);
    },

    setDisabled: function (d) {
      this.model.set('disabled', !!d);
    },

    setExpanded: function (expanded) {
      var options = {silent: false};
      if (this.model.get('disabled')) {
        options.silent = true;
      }
      switch (expanded) {
      case 'true':
      case true:
        this.model.set('expanded', true, options);
        break;
      default:
        this.model.set('expanded', false, options);
        break;
      }
    },

    _toggleExpanded: function () {
      if (this.model.get('disabled')) {
        return; // don't change checkbox and don't fire events, because it's disabled
      }

      // first trigger a clicked event and if no listener set cancel=true on the event args toggle
      // the expanded state
      var currentState = this.model.get('expanded');
      var args = {sender: this, model: this.model};
      this.triggerMethod('clicked', args);

      if (!args.cancel) {
        this.model.set('expanded', !currentState);  // toggle expanded state
      }
    }

  });
});
csui.define('csui/models/appliedcategory',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin'
], function (_, Backbone, ConnectableMixin, UploadableMixin) {

  var AppliedCategoryModel = Backbone.Model.extend({

    constructor: function AppliedCategoryModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options)
          .makeUploadable(options);
    },

    isNew: function () {
      // New category is assigned by POSTing the object with 'category_id';
      // when fetched in the collection, the identifier comes in 'id'.
      return !!this.get('category_id');
    },

    parse: function (response, options) {
      // POST returns no attributes now.  If it did, there'd be 'id', 'name'
      // etc.  Ensure that at least the 'id' is set correctly to indicate that
      // the category assignment is not new anymore.  (Creating a new category
      // assignment is done by POSTing the object with 'category_id'; when
      // fetched in the collection, the identifier comes in 'id'.)
      var attributes = this.attributes;
      if (attributes.category_id) {
        response.id = attributes.category_id;
        delete attributes.category_id;
      }
      return response;
    }

  });

  UploadableMixin.mixin(AppliedCategoryModel.prototype);
  ConnectableMixin.mixin(AppliedCategoryModel.prototype);

  return AppliedCategoryModel;

});

csui.define('csui/models/appliedcategories',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/appliedcategory'
], function (_, Backbone, Url, NodeResourceMixin, AppliedCategoryModel) {
  'use strict';

  var AppliedCategoryCollection = Backbone.Collection.extend({

    model: AppliedCategoryModel,

    constructor: function AppliedCategoryCollection(models, options) {
      options || {};

      //let the caller override default sorting.
      this.sortInitially = !!options.sortInitially ? options.sortInitially :
                           this.sortInitially;

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options);
    },

    clone: function () {
      return new this.constructor(this.models, {node: this.node});
    },

    url: function () {
      return Url.combine(this.node.urlBase(), 'categories');
    },

    parse: function (response, options) {
      return this.sortInitially(response.data);
    },

    sortInitially: function (data) {
      //default initial sort (only on arrays) is based on `name`.
      return _.isArray(data) ? _.sortBy(data, function (ele) {return ele.name.toLowerCase()}) :
             data;
    }

  });

  NodeResourceMixin.mixin(AppliedCategoryCollection.prototype);

  return AppliedCategoryCollection;

});

csui.define('csui/models/fileupload',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/log', 'csui/models/node/node.model', 'csui/models/version'
], function (module, _, $, Backbone, log, NodeModel, VersionModel) {
  'use strict';

  var config = _.extend({
    idAttribute: null
  }, module.config());

  // {
  //   file:       File object to upload
  //   state:      upload progress state: pending, processing, resolved, rejected
  //   newName:    Overrides file name if new document is to be created
  //   newVersion: Forces a new version to be created instead of a new document
  //   id:         Provide node ID for new version creation if the existing node
  //               was not specified in the constructor
  // }

  // TODO: Enable switching from upload renamed file to upload new version
  // by some interface, so that the version property can be used and not
  // the additional boolean

  var FileUploadModel = Backbone.Model.extend({

    defaults: {
      state: "pending",
      count: 0,
      total: 0,
      errorMessage: ""
    },

    idAttribute: config.idAttribute,

    constructor: function FileUploadModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      options || (options = {});

      this.node = options.node;
      // Uploading a file as a new version takes place on an existing
      // node, otherwise a new document will be created
      if (this.node) {
        // Stay compatible with conflict resolution, which controls
        // this model by newName and newVersion attributes
        this.set('newVersion', true, {silent: true});
        this.version = new VersionModel({
          id: this.node.get('id')
        }, {
          connector: options.connector || this.node.connector
        });
      } else {
        this.container = options.container;
        this.node = new NodeModel(undefined, _.extend({
          connector: options.connector ||
                     this.container && this.container.connector
        }, options, {
          collection: this.get('collection')
        }));
      }

      this.deferred = $.Deferred();
      this.deferred
          .progress(_.bind(this.onStateChange, this))
          .done(_.bind(this.onStateChange, this))
          .fail(_.bind(this.onStateChange, this));

      this._updateFileAttributes(true);
      this.listenTo(this, 'change:file',
          _.bind(this._updateFileAttributes, this, false));
    },

    abort: function (reason) {
      this.deferred.reject(this, reason);
    },

    promise: function () {
      return this.deferred.promise();
    },

    onStateChange: function (fileUpload, options) {
      var state = this.deferred.state();
      // A promise can be in the states: pending, resolved or rejected.  A file
      // upload defined an additional state - processing.
      if (state == "pending") {
        state = "processing";
      } else if (state === "rejected") {
        // Rejecting without error means aborting
        if (options) {
          this.set("errorMessage", options.message);
        } else {
          state = "aborted";
        }
      }
      // we get progress events with loaded larger than the total file size
      // also we get a progress event at the end with a very small number for loaded
      var values = {state: state};
      if (options && options.type === "progress") {
        var loaded = options.loaded,
            total = this.get("total");
        if (options.lengthComputable && options.total > total) {
          total = options.total;
          values.total = total;
        }
        if (this.get("count") < loaded && loaded <= total) {
          values.count = loaded;
        }
      }
      this.set(values);
    },

    _updateFileAttributes: function (silent) {
      var file = this.get("file");
      if (file) {
        this.set({
          name: file.name,
          total: file.size
        }, silent ? {silent: true} : {});
      }
    }

  });

  return FileUploadModel;

});

csui.define('csui/models/fileuploads',["module", "csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/log",
  "csui/models/fileupload"
], function (module, _, $, Backbone, log, FileUploadModel) {

  var FileUploadCollection = Backbone.Collection.extend({

    model: FileUploadModel,

    constructor: function FileUploadCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    state: function () {
      var failed = false,
          processing = false,
          processed = this.all(function (fileUpload) {
            var state = fileUpload.get("state"),
                rejected = state == "rejected";
            failed = failed || rejected;
            processing = processing || state == "processing";
            return rejected || state == "resolved";
          });
      return processed ?
             failed ? "rejected" : "resolved" :
             processing ? "processing" : "pending";
    }

  });

  FileUploadCollection.version = '1.0';

  return FileUploadCollection;

});

csui.define('csui/models/namequery',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/url', 'csui/models/fileupload',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin'
], function (module, $, _, Backbone, URL, FileUploadModel,
    ConnectableMixin, UploadableMixin) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    filesPerQuery: 10
  });

  var NameQuery = Backbone.Model.extend({

    constructor: function NameQuery(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.conflictFiles = [];
      this.cleanFiles = [];

      this.makeConnectable(options)
          .makeUploadable(options);
    },

    idAttribute: null,

    url: function () {
      return URL.combine(this.connector.connection.url, 'validation/nodes');
    },

    queryNames: function (files) {
      var containerId = this.get('containerId'),
        deferred = $.Deferred();
      this.fileGroups = this._getFileNameGroups(files);

      if (this.fileGroups.length === 0) {
        deferred.reject();
      }
      else {
        this._runQuery(0, containerId, deferred);
      }

      return deferred.promise();
    },

    runQuery: function(parentId, queryName) {
      var data = {
        'parent_id': parentId,
        'names': queryName
      };

      return this._jqxhr(data);
    },

    _jqxhr: function(data) {
      var deferred = $.Deferred();

      this.save(data, {data: data})
          .done(deferred.resolve)
          .fail(deferred.reject);

      return deferred.promise();
    },

    _runQuery: function (index, parentId, deferred) {
      var self = this,
          fileGroups = this.fileGroups;

      //run separate queries for each group of files.
      if (fileGroups && fileGroups[index]) {
        var data = {
          'parent_id': parentId,
          'names': this._getFileNames(fileGroups[index])
        };

        this._jqxhr(data)
          .done(function (data, result, request) {
            self._addResults(data, fileGroups[index]);
            //Run query on next file grouping
            if (fileGroups[++index]) {
              self._runQuery(index, parentId, deferred);
            }
            else {
              deferred.resolve(self.cleanFiles, self.conflictFiles);
            }
          })
          .fail(function (request, message, statusText) {
            deferred.reject(request);
          });

      }

    },

    _addResults: function (data, fileGroup) {
      _.each(fileGroup, function (groupFile) {
        var name = groupFile.newName || groupFile.name ||
                   groupFile.get('newName') || groupFile.get('name'),
            item = _.find(data.results, function (item) {
                  return item.name === name;
                }) || {}; // Old API did not send anything in case of no conflict
        updateGroupFile.call(this, groupFile, item);
        if (item.id) {
          this.conflictFiles.push(groupFile);
        } else {
          this.cleanFiles.push(groupFile);
        }
      }, this);

      function updateGroupFile(groupFile, item) {
        if (groupFile instanceof FileUploadModel) {
          groupFile.set({
            type: groupFile.get('subType') || item.type,
            versioned: item.versioned
          });
          item.id && groupFile.set('id', item.id);
        } else {
          _.extend(groupFile, {
            id: item.id,
            type: item.type,
            versioned: item.versioned
          });
        }
      }
    },

    _getFileNames: function (files) {
      var names = [];
      _.each(files, function (file) {
        var name = '';
        if (file instanceof FileUploadModel) {
          name = file.get('newName') || file.get('name');
        }
        else {
          name = file.newName || file.name;
        }
        names.push(name);
      });
      return names;
    },

    _getFileNameGroups: function (files) {
      var fileArray = $.isArray(files) ? files : files.models,
          i = 0, counter = 1,
          numFiles = fileArray.length,
          fileQueryGroups = [];

      while (i < numFiles) {
        var group = [],
            limit = config.filesPerQuery * counter++;

        for (; i < numFiles && i < limit; i++) {
          fileArray[i].index = i;
          group.push(fileArray[i]);
        }
        fileQueryGroups.push(group);
      }

      return fileQueryGroups;
    }

  });

  UploadableMixin.mixin(NameQuery.prototype);
  ConnectableMixin.mixin(NameQuery.prototype);

  return NameQuery;

});

csui.define('csui/models/versions',["module", "csui/lib/backbone", "csui/utils/log", "csui/models/version"
], function (module, Backbone, log, VersionModel) {
  'use strict';

  var VersionCollection = Backbone.Collection.extend({

    model: VersionModel,

    constructor: function VersionCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
      if (this.options.connector) {
        this.options.connector.assignTo(this);
      }
    },

    setOrder: function (attributes, fetch) {
      if (this.orderBy !== attributes) {
        this.orderBy = attributes;
        //this._runAllOperations();
        return true;
      }
    },

    resetOrder: function (fetch) {
      if (this.orderBy) {
        this.orderBy = undefined;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    setLimit: function (skip, top, fetch) {
      if (this.skipCount !== skip || this.topCount !== top) {
        this.skipCount = skip;
        this.topCount = top;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    resetLimit: function (fetch) {
      if (this.skipCount) {
        this.skipCount = 0;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    }

  });
  VersionCollection.version = '1.0';

  return VersionCollection;

});

csui.define('csui/models/server.adaptors/nodeversions.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var query = Url.combineQueryString(
            this.getExpandableResourcesUrlQuery(),
            {
              extra: false,
              commands: this.options.commands || []
            }
          );
          return Url.combine(this.node.urlBase(), '/versions?' + query);
        },

        parse: function (response) {
          // parse column data
          var definitions = response.definitions;
          var columnKeys = _.keys(definitions);  // use all columns not only those in definitions_order

          if (!this.options.onlyClientSideDefinedColumns) {
            // merge definitions_order into definitions as definitions_order attribute
            if (response.definitions_order) {
              for (var idx = 0; idx < response.definitions_order.length; idx++) {
                var column_key = response.definitions_order[idx];
                definitions[column_key].definitions_order = 500 + idx;
              }
            }
          }

          this.columns.reset(this.getColumnModels(columnKeys, definitions));

          if (response.data) {
            _.each(response.data, function (version) {
              // Instead of fetch extra node type info for version collection, assign it here from node
              version.id_expand = {};
              version.id_expand.type = this.node.get('type');
              // TODO: Remove this, as soon as the version REST API returns actions
              if (!(version.commands || version.actions)) {
                fakeActions(this.node, version);
              }
            }, this);
          }

          return response.data;
        },

        getColumnModels: function (columnKeys, definitions) {
          var columns = _.reduce(columnKeys, function (colArray, column) {
            if (column.indexOf('_formatted') >= 0) {
              var shortColumnName = column.replace(/_formatted$/, '');
              if (definitions[shortColumnName]) {
                // there is also the column without the trailing _formatted: skip this and use this
                // instead
                return colArray;
              }
            } else {
              // copy the definitions_order from the *_formatted column to the non-formatted column
              // because it is assumed that the attributes form *_formatted column are more important
              var definition_short = definitions[column];
              if (!definition_short.definitions_order) {
                var definition_formatted = definitions[column + '_formatted'];
                if (definition_formatted && definition_formatted.definitions_order) {
                  definition_short.definitions_order = definition_formatted.definitions_order;
                }
              }
            }
            var definition = definitions[column];

            switch (column) {
              case "name":
                definition = _.extend(definition, {
                  default_action: true,
                  contextual_menu: false,
                  editable: true,
                  filter_key: "name"
                });
                break;
            }

            definition.sort = true;

            colArray.push(_.extend({column_key: column}, definition));
            return colArray;
          }, []);
          return columns;
        }

      });
    }
  };

  // TODO: Remove this, as soon as the version REST API returns actions
  // (Another workaround could be loading all versions anew)
  function fakeActions(node, version) {
    var actions = [];
    if (node.actions.findRecursively('download') || node.actions.findRecursively('Download')) {
      actions.push({signature: 'versions_download'}, {signature: 'versions_open'});
    }
    if (node.actions.findRecursively('delete') || node.actions.findRecursively('Delete')) {
      actions.push({signature: 'versions_delete'});
    }
    if (node.actions.findRecursively('properties') || node.actions.findRecursively('Properties')) {
      actions.push({signature: 'versions_properties'});
    }
    version.actions = actions;
  }

  return ServerAdaptorMixin;
});

csui.define('csui/models/nodeversions',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/log', 'csui/utils/url',
  'csui/models/versions', 'csui/models/actions', 'csui/models/columns',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/browsable/client-side.mixin',
  'csui/models/server.adaptors/nodeversions.mixin',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, base, log, Url,
    VersionCollection, ActionCollection,
    NodeColumnCollection, NodeResourceMixin,
    ExpandableMixin, ClientSideBrowsableMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeVersionCollection = VersionCollection.extend({

    // TODO: Once MetadataNavigation allows setting title, you are free
    // to modify the name of the constructor.  For the time being, it
    // is used as an interface to recognize object of this class.
    constructor: function NodeVersionCollection(models, options) {
      VersionCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options)
          .makeExpandable(options)
          .makeClientSideBrowsable(options)
          .makeServerAdaptor(options);

      this.columns = new NodeColumnCollection();
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: _.clone(this.orderBy),
        expand: _.clone(this.expand),
        // TODO: Use commandable mixin.
        commands: _.clone(this.options.commands)
      });
    }

  });

  ClientSideBrowsableMixin.mixin(NodeVersionCollection.prototype);
  ExpandableMixin.mixin(NodeVersionCollection.prototype);
  NodeResourceMixin.mixin(NodeVersionCollection.prototype);
  ServerAdaptorMixin.mixin(NodeVersionCollection.prototype);

  // override setOrder function of mixin to replace version_number_name by version_number for
  // ordering with this column
  var originalSetOrder = NodeVersionCollection.prototype.setOrder;
  NodeVersionCollection.prototype.setOrder = function (attributes, fetch) {
    if (attributes) {
      // attributes = attributes.replace(/version_number_name/, 'version_number');
    }
    return originalSetOrder.call(this, attributes, fetch);
  };

  return NodeVersionCollection;

});

csui.define('csui/models/node.facets/facet.query.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var FacetQueryMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeFacetQuery: function (options) {
          return this;
        },

        getFilterQuery: function (filters) {
          return getFilterQuery(filters || this.filters,
              this.filterQueryParameterName);
        },

        getFilterQueryValue: function (filters) {
          return getFilterQueryValue(filters || this.filters);
        }
      });
    }
  };

  function getFilterQuery(filters, parameterName) {
    var value = getFilterQueryValue(filters);
    if (value.length) {
      var parameters = {};
      parameters[parameterName] = value;
      return $.param(parameters, true);
    }
    return '';
  }

  function getFilterQueryValue(filters) {
    return filters && _.map(filters, getFilterValue) || [];
  }

  function getFilterValue(filter) {
    return filter.id + ':' +
        _.reduce(filter.values, function (result, value) {
         if (result) {
           result += '|';
         }
         return result + value.id.toString();
        }, '');
  }

  return FacetQueryMixin;
});

csui.define('csui/models/node.facets/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/models/node.facets/facet.query.mixin'
], function (_, $, Url, FacetQueryMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var originalFetch = prototype.fetch;

      FacetQueryMixin.mixin(prototype);

      return _.extend(prototype, {
        filterQueryParameterName: 'where_facet',

        makeServerAdaptor: function (options) {
          return this.makeFacetQuery(options);
        },

        isFetchable: function () {
          var node = this.node,
              type = node.get('type'),
              locationId = node.get('location_id');
          //Location id === 0 means the VF is empty, and in the eyes of CS invalid, so
          //no need to burden server with a request that will only return an error result.
          if (type === 899 && locationId === 0) {
            return false;
          }
          return true;
        },

        url: function () {
          var nodeId = this.node.get(this.node.get('type') === 899 ? 'location_id' : 'id'),
              filters = _.union(getNodeFilters(this.node), this.filters),
              filter = this.getFilterQuery(filters),
              url = Url.combine(this.connector.connection.url, 'nodes', nodeId, '/facets');
          if (filter) {
            url += '?' + filter;
          }
          return url;
        },

        parse: function (response, options) {
          var topics = response.facets || {},
              facets = topics.properties || {},
              selected = topics.selected_values || [],
              available = topics.available_values || [];
          selected.forEach(markSelectedTopics.bind(null, true));
          available.forEach(markSelectedTopics.bind(null, false));
          if (this.node.get('type') === 899) {
            var nodeFacets = this.node.get('selected_facets') || [];
            nodeFacets = nodeFacets.map(function (facet) {
              return facet[0];
            });
            selected = selected.filter(function (facet) {
              var id = _.keys(facet)[0];
              return !_.contains(nodeFacets, id);
            });
          }
          return selected
              .concat(available)
              .map(mergeFacetTopics.bind(null, facets));
        }
      });
    }
  };

  function markSelectedTopics(selected, facet) {
    // topics are nested by the facet id as the key property
    var id = _.keys(facet)[0],
        topics = facet[id];
    _.each(topics, function (topic) {
      // Convert the ID always to string to be able to use Backbone
      // searching methods like where(), which compare by ===.
      topic.value = topic.value.toString();
      topic.selected = selected;
    });
  }

  function mergeFacetTopics(facets, facet) {
    // topics are nested by the facet id as the single key property
    var id = _.keys(facet)[0],
        topics = facet[id],
        properties = facets[id] || {};
    // merge topics with the facet information
    return _.extend({
      items_to_show: 5,
      select_multiple: true,
      topics: topics
    }, properties, {
      // Convert the ID always to string to be able to use Backbone
      // searching methods like where(), which compare by ===.
      id: id.toString()
    });
  }

  function getNodeFilters(node) {
    var selectedFacets = [];
    if (node.get('type') === 899) {
      //selected_facets format = [['61033', [140]], ['61032', ['1000', '64039']]];
      var virtualFacets = node.get('selected_facets');
      selectedFacets = _.map(virtualFacets, function (item) {
        var facetGroup = {'id': item[0], 'values': []};
        item[1].forEach(function (id) {
          facetGroup.values.push({'id': id});
        });
        return facetGroup;
      });
    }
    return selectedFacets;
  }

  return ServerAdaptorMixin;
});

csui.define('csui/models/nodefacets',[
  'csui/lib/underscore', 'csui/models/facets',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.facets/server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, FacetCollection, NodeResourceMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeFacetCollection = FacetCollection.extend({
    constructor: function NodeFacetCollection(models, options) {
      FacetCollection.prototype.constructor.apply(this, arguments);
      this.makeNodeResource(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        filters: _.deepClone(this.filters)
      });
    }
  });

  NodeResourceMixin.mixin(NodeFacetCollection.prototype);
  ServerAdaptorMixin.mixin(NodeFacetCollection.prototype);

  return NodeFacetCollection;
});

csui.define('csui/models/node/node.facet.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodefacets'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeFacetCollection) {

  var FacetCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'facets',

    constructor: function FacetCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var facets = this.options.facets || {};
      if (!(facets instanceof Backbone.Collection)) {
        var node = facets.options && facets.options.node ||
                   context.getModel(NodeModelFactory, options),
            config = module.config();
        facets = new NodeFacetCollection(facets.models, _.defaults(
            config.options,
          facets.options,
            {
              // Prefer refreshing the entire collection after re-fetching it
              // to improve rendering performance
              autoreset: true
            },
            // node is intentionally listed at the end to give previous options preference
            {node: node}
        ));
      }
      this.property = facets;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return FacetCollectionFactory;

});

csui.define('csui/models/widget/search.results/search.response.mixin',[
    'csui/lib/underscore', 'csui/utils/base',
    'csui/models/ancestor', 'csui/models/node/node.model'
], function (_, base, AncestorModel, NodeModel) {
  'use strict';

  var SearchResponseMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSearchResponse: function (options) {
          return this;
        },

        /**
         * This method update the response data for the following fields....
         * creation date, modification date, file sizes, previousquery etc.,
         * @param resp
         * @param options
         */
        parseSearchResponse: function (resp, options) {
          var sorting = resp.collection.sorting;
          if (sorting) {
            this.previousQuery = this.options.query.attributes.where;
          }
          this.previousOrderBy = this.orderBy;
          this.excludeSelectedAndInvalidFacets(resp);
          var jsonResponse = resp.results;
          if (jsonResponse) {
            for (var response in jsonResponse) {
              if (jsonResponse.hasOwnProperty(response)) {
                if (!!jsonResponse[response].data && !!jsonResponse[response].data.properties) {
                  if (!!jsonResponse[response].data.versions &&
                      !!jsonResponse[response].data.versions.file_size) {
                    jsonResponse[response].data.properties.size = jsonResponse[response].data.versions.file_size;
                  }
                  if (!!jsonResponse[response].data.versions &&
                      !!jsonResponse[response].data.versions.version_id) {
                    jsonResponse[response].data.properties.version_id = jsonResponse[response].data.versions.version_id;
                  }
                  if (!!jsonResponse[response].data.properties &&
                      !!jsonResponse[response].data.properties.container &&
                      jsonResponse[response].data.properties.container) {
                    jsonResponse[response].data.properties.size = jsonResponse[response].data.properties.container_size;
                  }
                  if (!!jsonResponse[response].data.properties.summary) {
                    jsonResponse[response].data.properties.summary = this.jsonToStringTokenizer(
                        jsonResponse[response].data.properties.summary);
                  }
                  if (!!jsonResponse[response].data.properties.reserved_user_id_expand) {
                    jsonResponse[response].data.properties.reserved_user_id = jsonResponse[response].data.properties.reserved_user_id_expand;
                  }
                }

                if (!!jsonResponse[response].links && !!jsonResponse[response].links.ancestors) {
                  var breadcrumbsObj = [],
                      ancestors      = jsonResponse[response].links.ancestors,
                      ancestorIds    = [];
                  if (ancestors) {
                    for (var breadcrumbIdx in ancestors) {
                      if (ancestors.hasOwnProperty(breadcrumbIdx)) {
                        var ancestorModel = new AncestorModel();
                        var breadcrumbIndex = parseInt(breadcrumbIdx, 10),
                            breadcrumbItem  = {};
                        var currentObject = ancestors[breadcrumbIndex];
                        breadcrumbItem.id = currentObject.href.substring(
                            currentObject.href.lastIndexOf("/") + 1,
                            currentObject.href.length);
                        breadcrumbItem.volume_id = breadcrumbIndex === 0 ?
                                                   breadcrumbItem.id : ancestorIds[0];
                        breadcrumbItem.parent_id = breadcrumbIndex === 0 ? '-1' :
                                                   ancestorIds[breadcrumbIndex - 1];
                        if (NodeModel.usesIntegerId) {
                          breadcrumbItem.id = parseInt( breadcrumbItem.id );
                          breadcrumbItem.volume_id = parseInt(breadcrumbItem.volume_id);
                          breadcrumbItem.parent_id = parseInt(breadcrumbItem.parent_id);
                        }
                        ancestorIds.push(breadcrumbItem.id);
                        breadcrumbItem.name = currentObject.name;
                        breadcrumbItem.showAsLink = true;
                        ancestorModel.attributes = breadcrumbItem;
                        breadcrumbsObj.push(ancestorModel);
                      }
                    }
                  }
                  jsonResponse[response].data.properties.ancestors = breadcrumbsObj;
                }
                // copy version details to properties
                if (!!jsonResponse[response].search_result_metadata) {
                  jsonResponse[response].data.properties.search_result_metadata = jsonResponse[response].search_result_metadata;
                }
              }
            }
          }
        },

        jsonToStringTokenizer: function (jsonSummary) {
          var highlightedSummary = "";
          for (var summary in jsonSummary) {
            if (jsonSummary.hasOwnProperty(summary)) {
              highlightedSummary += !!jsonSummary[summary].type ?
                                    " <HH>" + jsonSummary[summary].text + "</HH> " :
                                    jsonSummary[summary];
            }
          }
          return highlightedSummary;
        },

        parseBrowsedItems: function (response, options) {
          return response.results;
        },

        /* This function will exclude size facet and all selected facets and sub facets that are
         already selected */
        excludeSelectedAndInvalidFacets: function (response) {
          var searching = response.collection.searching;
          if (!!searching && !!searching.facets && !!searching.facets.available) {
            var availableFacets = searching.facets.available;
            if (!!searching.facets.selected) {
              var selectedFacets = searching.facets.selected;
              var len1 = selectedFacets.length;
              for (var i = 0; i < len1; i++) {
                var len2 = availableFacets.length;
                for (var j = 0; j < len2; j++) {
                  var availableName = availableFacets[j].name;
                  if (availableName === 'OTObjectSize') {
                    availableFacets.splice(j, 1);
                    len2 = availableFacets.length;
                    j--;
                  } else if (availableName === selectedFacets[i].name) {
                    var len3 = selectedFacets[i].facet_items.length;
                    for (var k = 0; k < len3; k++) {
                      var len4 = availableFacets[j].facet_items.length;
                      for (var l = 0; l < len4; l++) {
                        if (availableFacets[j].facet_items[l].display_name ===
                            selectedFacets[i].facet_items[k].display_name) {
                          availableFacets[j].facet_items.splice(l, 1);
                          l--;
                          len4 = availableFacets[j].facet_items.length;
                        }

                      }
                    }
                  } else if (availableFacets[j].facet_items.length === 0) {
                    availableFacets.splice(j, 1);
                    len2 = availableFacets.length;
                    j--;
                  }

                }
              }
            }
          }
        }
      });
    }
  };

  return SearchResponseMixin;
});

csui.define('csui/models/widget/search.results/search.facets',[
  'csui/models/facets'
], function (FacetCollection) {
  'use strict';

  var SearchFacetCollection = FacetCollection.extend({
    constructor: function SearchFacetCollection(models, options) {
      FacetCollection.prototype.constructor.apply(this, arguments);
    }
  });

  return SearchFacetCollection;
});

csui.define('csui/models/widget/search.results/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/node.facets/facet.query.mixin'
], function (_, Url, FacetQueryMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      FacetQueryMixin.mixin(prototype);

      return _.extend(prototype, {
        filterQueryParameterName: 'filter',

        makeServerAdaptor: function (options) {
          return this.makeFacetQuery(options);
        },

        cacheId: '',

        url: function () {
          var url   = this.connector.connection.url.replace('/v1', '/v2'),
            query = this.options.query.toJSON();
          //Global Search
          if (!!this.options.query.resetDefaults) {
            this.orderBy = "";
            this.skipCount = 0;
            this.options.query.resetDefaults = false;
          } else {
            this.orderBy = ((this.orderBy) &&
              (this.previousQuery !== this.options.query.attributes.where)) ? "" :
              this.orderBy;
            this.skipCount = (this.previousOrderBy !== this.orderBy) ? 0 : this.skipCount;
          }
          query = Url.combineQueryString(
            this.getBrowsableUrlQuery(),
            this.getFilterQuery(this.searchFacets.filters),
            {
              expand: 'properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}',
              options: '{\'highlight_summaries\',\'facets\'}'
            },
            this.getRequestedCommandsUrlQuery(),
            query
          );

          // consider cache_id only while sorting and pagination.
          if ((!!this.orderBy || !!this.pagination) && !!this.cacheId) {
            query = Url.combineQueryString(query, "cache_id=" + this.cacheId);
            this.pagination = false; // reset pagination to default.
          }
          return Url.combine(url, 'search?' + query);
        },

        parse: function (response, options) {
          this.parseBrowsedState(response.collection, options);
          this.parseSearchResponse(response, options);
          //Create search facets
          this._parseFacets(response.collection.searching.facets);
          response.results.sorting = response.collection.sorting;
          this.cacheId = (!!response.collection && !!response.collection.searching &&
            !!response.collection.searching.cache_id) ?
            response.collection.searching.cache_id : "";
          return this.parseBrowsedItems(response, options);
        },

        _parseFacets: function (facets) {
          var topics;
          if (facets) {
            topics = convertFacets(facets.selected, true)
                .concat(convertFacets(facets.available, false));
          }
          this.searchFacets.reset(topics);
        }
      });
    }
  };

  function convertFacets (facets, selected) {
    return _.map(facets, function (facet) {
      var topics = _.map(facet.facet_items, function (topic) {
        return {
          name: topic.display_name,
          total: topic.count,
          value: topic.value,
          selected: selected
        };
      });
      return {
        id: facet.name,
        name: facet.display_name,
        type: facet.type,
        topics: topics,
        items_to_show: 5
      };
    });
  }

  return ServerAdaptorMixin;
});

csui.define('csui/models/widget/search.results/search.results.model',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v1.request.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/widget/search.results/search.response.mixin',
  'csui/models/widget/search.results/search.facets',
  'csui/models/widget/search.results/server.adaptor.mixin',
  'i18n!csui/models/widget/nls/lang', 'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, Url, NodeModel, ConnectableMixin, FetchableMixin, BrowsableMixin,
    BrowsableV1RequestMixin, BrowsableV2ResponseMixin, DelayedCommandableV2Mixin,
    AdditionalResourcesV2Mixin, SearchResponseMixin, SearchFacetCollection, ServerAdaptorMixin,
    lang) {
  'use strict';

  var SearchResultCollection = Backbone.Collection.extend({
    model: NodeModel,

    constructor: function SearchResultCollection(models, options) {
      this.options = options || (options = {});
      this.expand = options.expand || {properties: 'reserved_user_id'};
      Backbone.Collection.prototype.constructor.call(this, models, options);

      // LPAD-48413: Adding only proposed inline actions for search results.
      this.includeCommands = options.commands || [];

      this.title = lang.searchResults;

      this.searchFacets = new SearchFacetCollection();

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeBrowsable(options)
          .makeBrowsableV1Request(options)
          .makeBrowsableV2Response(options)
          .makeDelayedCommandableV2(options)
          .makeSearchResponse(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: _.clone(this.orderBy),
        expand: _.clone(this.expand),
        includeActions: this.includeActions,
        commands: _.clone(this.includeCommands),
        includeCommands: _.clone(this.includeCommands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
        // TODO: Use expandable and commandable mixins
      });
    },

    isFetchable: function () {
      return (!!this.options.query.get('where') || !!this.options.query.get('query_id'));
    },

    setDefaultPageNum: function () {
      this.skipCount = 0;
    },

    getResourceScope: function () {
      return _.deepClone({
        includeResources: this._additionalResources,
        includeCommands: this.includeCommands,
        commands: this.includeCommands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      scope.includeCommands && (this.includeCommands = scope.includeCommands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    }
  });

  BrowsableMixin.mixin(SearchResultCollection.prototype);
  BrowsableV1RequestMixin.mixin(SearchResultCollection.prototype);
  BrowsableV2ResponseMixin.mixin(SearchResultCollection.prototype);
  ConnectableMixin.mixin(SearchResultCollection.prototype);
  FetchableMixin.mixin(SearchResultCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(SearchResultCollection.prototype);
  SearchResponseMixin.mixin(SearchResultCollection.prototype);
  ServerAdaptorMixin.mixin(SearchResultCollection.prototype);
  DelayedCommandableV2Mixin.mixin(SearchResultCollection.prototype);

  return SearchResultCollection;
});

csui.define('csui/models/permission/permission.table.columns.model',['csui/lib/underscore', "csui/lib/backbone"
], function (_, Backbone, lang, extraTableColumns) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  return TableColumnModel;
});

csui.define('csui/utils/non-emptying.region/non-emptying.region',['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var NonEmptyingRegion = Marionette.Region.extend({

    constructor: function NonEmptyingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {
      if (this.options.prependChild) {
        this.el.insertBefore(view.el, this.el.childNodes[0]);
      } else {
        this.el.appendChild(view.el);
      }
    },

    empty: function (options) {
      var view = this.currentView;
      if (view) {
        view.off('destroy', this.empty, this);
        this.triggerMethod('before:empty', view);
        if (!(options && options.preventDestroy)) {
          this._destroyView();
        }
        this.triggerMethod('empty', view);
        delete this.currentView;
      }
      return this;
    },

    _destroyView: function () {
      var view = this.currentView;
      if (view.isDestroyed === true || view._isDestroyed) {
        return;
      }

      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'before:destroy', view);
      }
      if (view.destroy) {
        view.destroy();
      } else {
        view.remove();
        if (typeof view.isDestroyed === 'function') {
          view._isDestroyed = true;
        } else {
          view.isDestroyed = true;
        }
      }
      if (!view.supportsDestroyLifecycle) {
        Marionette.triggerMethodOn(view, 'destroy', view);
      }
    }

  });

  return NonEmptyingRegion;

});


/* START_TEMPLATE */
csui.define('hbs!csui/utils/commands/impl/full.page.modal/full.page.modal',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"binf-modal-dialog\">\r\n  <div class=\"binf-modal-content\">\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_utils_commands_impl_full.page.modal_full.page.modal', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/utils/commands/impl/full.page.modal/full.page.modal',[],function(){});
csui.define('csui/utils/commands/impl/full.page.modal/full.page.modal.view',['csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region',
  'hbs!csui/utils/commands/impl/full.page.modal/full.page.modal',
  'css!csui/utils/commands/impl/full.page.modal/full.page.modal',
  'csui/lib/binf/js/binf'
], function ($, Marionette, NonEmptyingRegion, template) {
  'use strict';

  // Shows a view inside a modal overlay, which stretches over the entire body

  var FullPageModal = Marionette.LayoutView.extend({

    className: 'csui-full-page-modal binf-modal binf-fade',

    template: template,

    regions: {
      content: '.binf-modal-content',
    },

    events: {
      'shown.binf.modal': '_refresh',
      'hidden.binf.modal': 'destroy'
    },

    constructor: function FullPageModal(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.view = this.options.view;
    },

    show: function () {
      var container = $.fn.binf_modal.getDefaultContainer(),
          region = new NonEmptyingRegion({el: container});
      region.show(this);
      return this;
    },

    onRender: function () {
      this.listenTo(this.view, 'destroy', function () {
        this.$el.binf_modal('hide');
      });
      this.content.show(this.options.view);
      // Make sure, that we show the top of the page, before
      // the scrollbars are suppressed; the dialog is absolutely
      // positioned on the top of the page
      $(window).scrollTop(0);
      this.$el.binf_modal({
        backdrop: 'static',
        keyboard: false
      });
    },

    _refresh: function () {
      this.view.triggerMethod('dom:refresh');
    }

  });

  return FullPageModal;

});

csui.define('csui/utils/commands/impl/thumbnail/thumbnail.object',['csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/url', 'csui/utils/base'
], function ($, Marionette, Url, base) {
  'use strict';

  // Loads document thumbnail to a local object URL
  // * needs node model of the document
  // * has to be loaded to set the URL
  // * url property:
  //   - is undefined - not loaded yet
  //   - is null      - tried to load, but failed
  //   - is string    - loaded
  // * has to be destroyed when not need any more

  var Thumbnail = Marionette.Object.extend({

    constructor: function Thumbnail(options) {
      Marionette.Object.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.node, 'change:id', this.load)
          .listenTo(this, 'destroy', this._release);
    },

    load: function () {
      var node         = this.options.node,
          nodeId       = node.get('id'),
          version      = node.get('version_number'), /*Assuming version number is available only
          with VersionModel*/
          versionParam = !!version ? '&version_number=' + version : '',
          self         = this;
      this._release();
      return nodeId &&
             $.ajax(node.connector.extendAjaxOptions({
                   url: Url.combine(node.connector.connection.url, '/nodes', nodeId,
                       '/thumbnails/medium/content?suppress_response_codes' + versionParam),
                   dataType: 'binary'
                 })
             ).then(function (response) {
                   if (!!response.type && !!response.type.match(/application\/json/i)) {
                     var reader = new window.FileReader();
                     reader.readAsText(response);
                     reader.onload = function (event) {
                       var jsonObject = JSON.parse(event.target.result);
                       if (jsonObject.statusCode === 404) {
                         self._failureHandler(jsonObject.error);
                       }
                     };
                   }
                   else {
                     self.url = URL.createObjectURL(response);
                     self.triggerMethod('load', self, self.url);
                     return self.url;
                   }
                 }, function (jqxhr) {
                   self._failureHandler(jqxhr);
                 }
             );
    },

    _release: function () {
      if (this.url) {
        URL.revokeObjectURL(this.url);
        this.url = undefined;
      }
    },

    _failureHandler: function (jqxhr) {
      var error = new base.Error(jqxhr);
      this.url = null;
      this.triggerMethod('error', this, error);
      return $.Deferred().reject(error).promise();
    }

  });

  return Thumbnail;

});


/* START_TEMPLATE */
csui.define('hbs!csui/utils/commands/impl/thumbnail/loading.thumbnail',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<p>Loading...</p>\r\n";
}});
Handlebars.registerPartial('csui_utils_commands_impl_thumbnail_loading.thumbnail', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/utils/commands/impl/thumbnail/no.thumbnail',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<p>Not available.</p>\r\n";
}});
Handlebars.registerPartial('csui_utils_commands_impl_thumbnail_no.thumbnail', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!csui/utils/commands/impl/thumbnail/thumbnail',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<img src=\""
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{}}) : helper)))
    + "\" alt=\"\">\r\n";
}});
Handlebars.registerPartial('csui_utils_commands_impl_thumbnail_thumbnail', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/utils/commands/impl/thumbnail/thumbnail',[],function(){});
csui.define('csui/utils/commands/impl/thumbnail/thumbnail.view',['csui/lib/marionette',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'hbs!csui/utils/commands/impl/thumbnail/loading.thumbnail',
  'hbs!csui/utils/commands/impl/thumbnail/no.thumbnail',
  'hbs!csui/utils/commands/impl/thumbnail/thumbnail',
  'css!csui/utils/commands/impl/thumbnail/thumbnail'
], function (Marionette, Thumbnail,
    loadingThumbnail, noThumbnail, thumbnail) {
  'use strict';

  // TODO: Make it public:
  // * move to controls
  // * implement final versions of "loading" and "no" templates
  // * localize

  // Shows document thumbnail
  // * either accepts thumbnail object in options
  // * or creates its own thumbnail object using node model from options
  // * width and hetght should be set for the parent container,
  //   which would be proportionally filled up to 100%
  // * or the root element should be sized rxplicitly

  var ThumbnailView = Marionette.ItemView.extend({

    className: 'csui-thumbnail',

    getTemplate: function () {
      var url = this.thumbnail.url;
      return url === undefined ? loadingThumbnail :
             url ? thumbnail : noThumbnail;
    },

    constructor: function ThumbnailView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.thumbnail = this.options.thumbnail || new Thumbnail({
        node: this.options.node
      });
      this.listenTo(this.thumbnail, 'load', this.render)
          .listenTo(this.thumbnail, 'error', this.render)
          .listenTo(this, 'render', function () {
            this.thumbnail.url === undefined && this.thumbnail.load();
          })
          .listenTo(this, 'destroy', function () {
            this.thumbnail.destroy();
          });
    },

    serializeData: function () {
      return {
        url: this.thumbnail.url
      };
    }

  });

  return ThumbnailView;

});


csui.define('json!csui/utils/commands/open.types.json',{
  "mimeTypesForOpen": [
    "application/atom+xml",
    "application/font-woff",
    "application/javascript",
    "application/json",
    "application/mathml+xml",
    "application/ogg",
    "application/pdf",
    "application/postscript",
    "application/rdf+xml",
    "application/rss+xml",
    "application/vnd.mozilla.xul+xml",
    "application/xhtml+xml",
    "application/xml",
    "application/x-shockwave-flash",
    "audio/3gpp",
    "audio/3gpp2",
    "audio/aac",
    "audio/aiff",
    "audio/amr",
    "audio/basic",
    "audio/flac",
    "audio/midi",
    "audio/mp3",
    "audio/mp4",
    "audio/mpeg",
    "audio/mpeg3",
    "audio/ogg",
    "audio/vorbis",
    "audio/wav",
    "audio/webm",
    "audio/x-m4a",
    "audio/x-ms-wma",
    "audio/x-wav",
    "audio/vnd.rn-realaudio",
    "audio/vnd.wave",
    "image/bmp",
    "image/cis-cod",
    "image/gif",
    "image/ief",
    "image/jpeg",
    "image/webp",
    "image/pict",
    "image/pipeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/vnd.microsoft.icon",
    "image/webp",
    "image/x-cmu-raster",
    "image/x-cmx",
    "image/x-icon",
    "image/x-portable-anymap",
    "image/x-portable-bitmap",
    "image/x-portable-graymap",
    "image/x-portable-pixmap",
    "image/x-rgb",
    "image/x-xbitmap",
    "image/x-xpixmap",
    "image/x-xwindowdump",
    "message/rfc822",
    "multipart/related",
    "multipart/x-mixed-replace",
    "text/css",
    "text/html",
    "text/plain",
    "text/xml",
    "video/3gpp",
    "video/3gpp2",
    "video/avi",
    "video/divx",
    "video/flc",
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/quicktime",
    "video/sd-video",
    "video/webm",
    "video/x-dv",
    "video/x-m4v",
    "video/x-mpeg",
    "video/x-ms-asf",
    "video/x-ms-wmv",
    "video/x-msvideo"
  ],
  "officeMimeTypes": [
    "application/msword",
    "application/vnd.ms-word",
    "application/vnd.msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.wordprocessing-openxml",
    "application/vnd.ces-quickword",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.ms-word.document.12",
    "application/mspowerpoint",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ces-quickpoint",
    "application/vnd.presentation-openxml",
    "application/vnd.presentation-openxmlm",
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    "application/msexcel",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ces-quicksheet",
    "application/vnd.spreadsheet-openxml",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "text/csv"
  ]
}
);

csui.define('csui/utils/commands/open.plugins/impl/brava.plugin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/version'
], function (_, $, VersionModel) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/commands/open'] || {};

  config = _.extend({
    isBravaViewerAvailable: false,
    supportedBravaViewerMimeTypes: [],
    bravaView: 'brava/widgets/bravaviewer/bravaviewer.view'
  }, config);

  config.supportedBravaViewerMimeTypes = _.invoke(
      config.supportedBravaViewerMimeTypes, 'toLowerCase');

  function BravaPlugin() {
  }

  BravaPlugin.prototype.widgetView = config.bravaView;

  BravaPlugin.prototype.getUrlQuery = function (node) {
    var query = {
      func: 'doc.ViewDoc',
      nodeid: node.get('id')
    };
    if (node instanceof VersionModel) {
      query.vernum = node.get('version_number');
    }
    return $.Deferred()
            .resolve(query)
            .promise();
  };

  BravaPlugin.prototype.needsAuthentication = function (node) {
    return true;
  };

  BravaPlugin.isSupported = function (node) {
    var mimeType = node.get('mime_type');
    return mimeType && config.isBravaViewerAvailable &&
           config.supportedBravaViewerMimeTypes.indexOf(mimeType.toLowerCase()) >= 0;
  };

  return BravaPlugin;
});

csui.define('csui/utils/commands/open.plugins/impl/csv.plugin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/version'
], function (_, $, VersionModel) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/commands/open'] || {};

  config = _.extend({
    CSViewerIsAvailable: false,
    CSViewerSupportedMimeTypes: [],
    csViewerView: 'csv/widgets/csviewer/csviewer.view'
  }, config);

  config.CSViewerSupportedMimeTypes = _.invoke(
      config.CSViewerSupportedMimeTypes, 'toLowerCase');

  function ContentSuiteViewerPlugin() {
  }

  ContentSuiteViewerPlugin.prototype.widgetView = config.csViewerView;

  ContentSuiteViewerPlugin.prototype.getUrlQuery = function (node) {
    var query = {
      func: 'doc.ViewDoc',
      nodeid: node.get('id')
    };
    if (node instanceof VersionModel) {
      query.vernum = node.get('version_number');
    }
    return $.Deferred()
            .resolve(query)
            .promise();
  };

  ContentSuiteViewerPlugin.prototype.needsAuthentication = function (node) {
    return true;
  };

  ContentSuiteViewerPlugin.isSupported = function (node) {
    var mimeType = node.get('mime_type');
    return mimeType && config.CSViewerIsAvailable &&
           config.CSViewerSupportedMimeTypes.indexOf(mimeType.toLowerCase()) >= 0;
  };

  return ContentSuiteViewerPlugin;
});

csui.define('csui/utils/commands/open.plugins/impl/browser.plugin',[
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/url', 'csui/utils/base',
  'csui/utils/command.error', 'csui/models/version',
  'json!csui/utils/commands/open.types.json', 'csui/utils/content.helper'
], function (_, $, Url, base, CommandError, VersionModel, openMimeTypes,
    contentHelper) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/commands/open'] || {},
      mimeTypesFromPlugins = _.chain(navigator.plugins || [])
                              .map(function (plugin) {
                                return _.chain(plugin)
                                        .map(function (mimeType) {
                                          return mimeType.type;
                                        })
                                        .value();
                              })
                              .flatten()
                              .compact()
                              .invoke('toLowerCase')
                              .value();

  config = _.extend({
    // from https://code.google.com/p/chromium/codesearch#chromium/src/net/base/mime_util.cc
    // and https://tools.ietf.org/html/rfc3023
    // and https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
    mimeTypesForOpen: openMimeTypes.mimeTypesForOpen,

    // from chrome-extension://gbkeegbaiigmenfmjfclcdgdpimamgkj/manifest.json
    officeMimeTypes: openMimeTypes.officeMimeTypes,

    // Opening HTML and XML documents can be considered a security risk.
    forceDownloadForMimeTypes: [],

    // Open a page capable of relative links and not needing the content
    // authentication token
    useContentPage: false
  }, config);

  config.mimeTypesForOpen = _.invoke(config.mimeTypesForOpen, 'toLowerCase');
  config.officeMimeTypes = _.invoke(config.officeMimeTypes, 'toLowerCase');
  config.forceDownloadForMimeTypes = _.invoke(
      config.forceDownloadForMimeTypes, 'toLowerCase');

  // Extend the openable MIME types by plugins installed in the browser
  config.mimeTypesForOpen = _.chain(config.mimeTypesForOpen)
                             .concat(mimeTypesFromPlugins)
                             .unique()
                             .invoke('toLowerCase')
                             .value();

  function BrowserPlugin() {
  }

  BrowserPlugin.prototype.getUrl = function (node) {
    return config.useContentPage ? getPageUrl(node) : getRestApiUrl(node);
  };

  BrowserPlugin.isSupported = function (node) {
    var mimeType = node.get('mime_type');
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      // Downloading does not work on iOS; only opening does.
      return base.isAppleMobile() ||
             config.mimeTypesForOpen.indexOf(mimeType) >= 0 &&
             config.forceDownloadForMimeTypes.indexOf(mimeType) < 0;
    }
  };

  BrowserPlugin.prototype.needsAuthentication = function (node) {
    return config.useContentPage;
  };

  function getPageUrl(node) {
    var contentUrl = contentHelper.getContentPageUrl(node);
    return $.Deferred().resolve(contentUrl).promise();
  }

  function getRestApiUrl(node) {
    return node.connector.requestContentAuthToken(node)
               .then(function (data) {
                 var url = Url.combine(
                     new Url(node.connector.connection.url).getApiBase(),
                     'nodes', node.get('id'));
                 if (node instanceof VersionModel) {
                   url = Url.combine(url, 'versions',
                       node.get('version_number'), 'content');
                 } else if (node.get('version_number')) {
                   url = Url.combine(url, 'versions',
                       node.get('version_number'), 'content');
                 } else {
                   url = Url.combine(url, 'content');
                 }
                 // IE sends the URL to the Office application, which loads it
                 // on its own. However, it ignores the Content-Disposition
                 // header and would need the file name on the URL path to
                 // offer it in the "Save As" dialog. Word offers "content"
                 // and Powerpoint the last URL parameter. There were other
                 // problems too. It is better to let the browser download
                 // the Office document always to its cache. Recent browsers
                 // do not disable the "Open" selection in the Open/Save/Cancel
                 // dialog anymore, which makes the "open" and "download"
                 // actions behave the same for documents, which the browser
                 // cannot open natively or in a plugin.
                 var mimeType = (node.get('mime_type') || '').toLowerCase(),
                     action = !base.isAppleMobile() &&
                              config.officeMimeTypes.indexOf(mimeType) >= 0 ?
                              'download' : 'open',
                     query = Url.combineQueryString({
                       action: action,
                       token: data.token
                     });
                 return Url.appendQuery(url, query);
               }, function (error) {
                 return $.Deferred()
                         .reject(new CommandError(error))
                         .promise();
               });
  }

    return BrowserPlugin;
});

csui.define('csui/utils/commands/open.plugins/impl/core.open.plugins',[
  'csui/utils/commands/open.plugins/impl/brava.plugin',
  'csui/utils/commands/open.plugins/impl/csv.plugin',
  'csui/utils/commands/open.plugins/impl/browser.plugin'
], function (BravaPlugin, CSViewerPlugin, BrowserPlugin) {
  'use strict';

  return [
    {
      sequence: 200,
      plugin: BravaPlugin,
      decides: BravaPlugin.isSupported
    },
    {
      sequence: 400,
      plugin: CSViewerPlugin,
      decides: CSViewerPlugin.isSupported
    },
    {
      sequence: 600,
      plugin: BrowserPlugin,
      decides: BrowserPlugin.isSupported
    }
  ];
});

csui.define('csui/utils/contexts/factories/search.results.factory',['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/models/widget/search.results/search.results.model',
  'csui/utils/commands',
  'csui/utils/base'
], function (require, module, _, Backbone, CollectionFactory, ConnectorFactory,
    SearchQueryModelFactory, SearchResultCollection, commands, base) {

  var SearchResultCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'searchResults',

    constructor: function SearchResultCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchResults = this.options.searchResults || {};
      if (!(searchResults instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            query     = options.searchResults.query,
            config    = module.config();
        searchResults = new SearchResultCollection(searchResults.models, _.extend({
          connector: connector,
          query: query,
          // Ask the server to check for permitted actions V2
          commands: commands.getAllSignatures()
        }, searchResults.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = searchResults;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      this.property.fetch({
        success: _.bind(this._onSearchResultsFetched, this, options),
        error: _.bind(this._onSearchResultsFailed, this, options)
      });
    },

    _onSearchResultsFetched: function (options) {
      //nothing to-do for now upon success.
      return true;
    },

    _onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      csui.require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        commands: commands.getAllSignatures()
      });
    }

  });

  return SearchResultCollectionFactory;

});

csui.define('csui/utils/high.contrast/detector',[],function () {
  'use strict';

  var highContrast;

  function detectHighContrast() {
    // See https://github.com/hanshillen/HCMDS
    var div = document.createElement('div');
    var style = div.style;
    style.borderWidth = '1px';
    style.borderStyle = 'solid';
    style.borderTopColor = '#F00';
    style.borderRightColor = '#0FF';
    style.position = 'absolute';
    style.left = '-9999px';
    style.width = div.style.height = '2px';
    var body = document.body;
    body.appendChild(div);
    style = window.getComputedStyle(div);
    highContrast = style.borderTopColor === style.borderRightColor;
    body.removeChild(div);
    var method = highContrast ? 'add' : 'remove';
    document.documentElement.classList[method]('csui-highcontrast');
  }

  return {
    load: function (name, _require, onLoad, config) {
      function ensureHighContrastDetection() {
        if (document.readyState === 'complete') {
            if (highContrast === undefined) {
            detectHighContrast();
          }
          onLoad(highContrast);
          return true;
        }
      }

      if (config.isBuild) {
        onLoad(null);
      } else {
        if (!ensureHighContrastDetection()) {
          document.addEventListener('readystatechange',
              ensureHighContrastDetection);
        }
      }
    }
  };
});


/* START_TEMPLATE */
csui.define('hbs!csui/controls/signin/impl/signin',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"login-container\">\r\n  <div class=\"login-controls\">\r\n    <div class=\"branding\"><span role=\"presentation\" class=\"ot-logo\">&nbsp;</span></div>\r\n    <div class=\"login-error\" id=\"loginError\"></div>\r\n    <div class=\"login-form-wrapper\">\r\n      <form>\r\n        <div class=\"binf-form-group binf-has-feedback\">\r\n          <div class=\"col-md-20\">\r\n            <input id=\"inputUsername\" type=\"text\" class=\"binf-form-control binf-input-lg textbox hasclear\"\r\n                   placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.placeholderusername || (depth0 != null ? depth0.placeholderusername : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholderusername","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.userNameAria || (depth0 != null ? depth0.userNameAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"userNameAria","hash":{}}) : helper)))
    + "\">\r\n              <span id=\"usernameclearer\" class=\"clearer clear-icon binf-form-control-feedback\"></span>\r\n\r\n          </div>\r\n        </div>\r\n        <div class=\"binf-form-group binf-has-feedback\">\r\n          <div class=\"col-md-20\">\r\n            <input id=\"inputPassword\" type=\"password\"\r\n                   class=\"binf-form-control binf-input-lg textbox hasclear\"\r\n                   placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.placeholderpassword || (depth0 != null ? depth0.placeholderpassword : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholderpassword","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.passwordAria || (depth0 != null ? depth0.passwordAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"passwordAria","hash":{}}) : helper)))
    + "\">\r\n              <span id=\"passwordclearer\" class=\"clearer clear-icon binf-form-control-feedback\"></span>\r\n          </div>\r\n        </div>\r\n        <button id=\"buttonSubmit\" type=\"button\" class=\"login-btn\">"
    + this.escapeExpression(((helper = (helper = helpers.buttontext || (depth0 != null ? depth0.buttontext : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"buttontext","hash":{}}) : helper)))
    + "</button>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('csui_controls_signin_impl_signin', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('csui/controls/signin/impl/nls/localized.strings',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/controls/signin/impl/nls/root/localized.strings',{
  signinButtonText: "Sign in",
  signinForgotPassword: "Forgot password?",
  signinPlaceholderUsername: "User name",
  usernameAria: 'Enter user name',
  signinPlaceholderPassword: "Password",
  passwordAria: 'Enter password',
  signinInvalidUsernameOrPassword: "You have entered an invalid user name or password. Please try again."
});



csui.define('css!csui/controls/signin/impl/css/signin',[],function(){});
csui.define('csui/controls/signin/signin.view',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/authenticators/basic.authenticator',
  'csui/utils/authenticators/credentials.authenticator',
  'csui/utils/contexts/page/page.context',
  'csui/utils/connector', 'csui/utils/contexts/factories/connector',
  'csui/lib/marionette', 'hbs!csui/controls/signin/impl/signin',
  'i18n!csui/controls/signin/impl/nls/localized.strings',
  'css!csui/controls/signin/impl/css/signin'
], function (module, _, $, BasicAuthenticator, CredentialsAuthenticator,
    PageContext, Connector, ConnectorFactory, Marionette, template, lang) {
  'use strict';

  var config = _.extend({
    useBasicAuthentication: false
  }, module.config());

  var SignInView = Marionette.ItemView.extend({
    constructor: function SignInView() {
      Marionette.ItemView.apply(this, arguments);
    },

    className: 'cs-signin',

    template: template,

    triggers: {
      'click button': 'click:button',
      //'click @ui.usernameclearer': 'click:usernameclearer',
      //'click @ui.passwordclearer': 'click:passwordclearer',
      'mousedown @ui.usernameclearer': 'click:usernameclearer',
      'mousedown @ui.passwordclearer': 'click:passwordclearer',
      'focus @ui.username': 'focus:username',
      'focus @ui.password': 'focus:password',
      'change @ui.password': 'change:password',
      'change @ui.username': 'change:username'
    },

    ui: {
      username: '#inputUsername',
      password: '#inputPassword',
      button: '#buttonSubmit',
      passwordclearer: '#passwordclearer',
      usernameclearer: '#usernameclearer',
      loginerror: '#loginError'
    },

    onRender: function () {
      this.ui.usernameclearer.toggle(false);
      this.ui.passwordclearer.toggle(false);
      //if (window.navigator.userAgent.indexOf("MSIE") === -1) {
        this.ui.username.prop('autofocus', true);
      //}
    },

    onClickPasswordclearer: function (event) {
      this.ui.password.val('').focus();
      this._unsetErrorStyle();
      this.ui.passwordclearer.hide();
    },

    onClickUsernameclearer: function (event) {
      this.ui.username.val('').focus();
      this._unsetErrorStyle();
      this.ui.usernameclearer.hide();
    },

    onFocusUsername: function () {
        this.validate();
    },

    onFocusPassword: function () {
        this.validate();
    },

    onChangeUsername: function () {
        this.validate();
    },

    onChangePassword: function () {
        this.validate();
    },

    templateHelpers: function () {
      return {
        buttontext: lang.signinButtonText,
        copyright: lang.signinCopyright,
        forgotpassword: lang.signinForgotPassword,
        placeholderusername: lang.signinPlaceholderUsername,
        usernameAria: lang.usernameAria,
        placeholderpassword: lang.signinPlaceholderPassword,
        passwordAria: lang.passwordAria
      };
    },

    events: {
      'keyup .binf-form-control': 'validate',
      'keydown button': 'onKeyPress'
    },

    onKeyPress: function (event) {
      var isButtonDisabled = this.ui.button.prop("disabled");

      // handle enter -> enable button
      if (!isButtonDisabled && event.which === 13) {
        this.ui.button.toggleClass('login-btn-enabled');
      }
    },

    validate: function (event) {
      this._unsetErrorStyle();

      var bIsUserNameSet = !!this.ui.username.val().length,
        bIsPasswordSet = true, //!!this.ui.password.val().length, // allow for empty pw
        bIsValidInput = bIsUserNameSet && bIsPasswordSet,
        bUserNameHasFocus = $(document.activeElement).is(this.ui.username),
        bPasswordHasFocus = $(document.activeElement).is(this.ui.password);

      // show/hide clearers
      this.ui.usernameclearer.toggle(bIsUserNameSet && bUserNameHasFocus);
      this.ui.passwordclearer.toggle(bIsPasswordSet && bPasswordHasFocus);

      // en/disable button
      this.ui.button.prop("disabled", !bIsValidInput);
      this.ui.button.toggleClass('login-btn-enabled', bIsValidInput);

      // submit on enter
      if (bIsValidInput && event && event.which === 13) {
        event.preventDefault();
        this.ui.button.click();
      }
    },

    onClickButton: function () {
      // disable button during login
      this.ui.button.toggleClass('login-btn-enabled', false);

      // Credentials always come from the form fields, while the rest
      // of the connection was specified in the constructor options
      var credentials = {
            username: this.ui.username.val(),
            password: this.ui.password.val()
          },
          useBasicAuthentication = config.useBasicAuthentication;

      if (!this.authenticator) {
        var connection = _.defaults({
              credentials: credentials
            }, this.options.connection),
            Authenticator = useBasicAuthentication ? BasicAuthenticator :
                            CredentialsAuthenticator,
            authenticator = new Authenticator({
              connection: connection
            }).on('loggedIn', _.bind(function () {
              this.ui.button.toggleClass('login-btn-enabled', true);
              this.trigger('success', {
                username: credentials.username,
                session: connection.session
              });
            }, this));
        this.authenticator = authenticator;
      }

      // authenticate
      var successHandler = _.bind(function () {
            // authentication succeeded -> update the shared connector used on the page
            var context = new PageContext(),
                connector = context.getObject(ConnectorFactory),
                session = this.authenticator.connection.session;
            connector.authenticator.updateAuthenticatedSession(session);
          }, this),
          errorHandler = _.bind(function (error, connection) {
            // authentication failed -> raise event, show error
            this.ui.button.toggleClass('login-btn-enabled', true);
            this._setErrorStyle();
            this.trigger('failure', {
              username: credentials.username,
              error: error
            });
          }, this);
      if (useBasicAuthentication) {
        this.authenticator.check({
          credentials: credentials,
        }, successHandler, errorHandler);
      } else {
        this.authenticator.login({
          data: credentials
        }, successHandler, errorHandler);
      }
    },

    _setErrorStyle: function () {
      this.ui.username.focus().select();
      this.ui.password.val('');
      this.ui.usernameclearer.toggle(true);
      this.ui.passwordclearer.toggle(true);
      this.ui.loginerror.html(lang.signinInvalidUsernameOrPassword);
      // TODO Force the error message through the screenreader

      this.$('.binf-form-group').addClass('binf-has-error');
      this.$('.clearer').removeClass('clear-icon').addClass('error-icon');
    },

    _unsetErrorStyle: function () {
      this.ui.loginerror.html('');
      this.$('.binf-form-group').removeClass('binf-has-error');
      this.$('.clearer').removeClass('error-icon').addClass('clear-icon');
    }
  });

  return SignInView;
});


/* START_TEMPLATE */
csui.define('hbs!csui/utils/impl/signin.dialog/signin',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"csui-signin binf-modal\">\r\n  <div class=\"binf-modal-dialog\">\r\n    <div class=\"binf-modal-content\"></div>\r\n  </div>\r\n</div>";
}});
Handlebars.registerPartial('csui_utils_impl_signin.dialog_signin', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!csui/utils/impl/signin.dialog/signin',[],function(){});
csui.define('csui/utils/impl/signin.dialog/signin.dialog',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/signin/signin.view',
  'hbs!csui/utils/impl/signin.dialog/signin',
  'css!csui/utils/impl/signin.dialog/signin',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, SignInView, wrapperTemplate) {
  'use strict';

  function SignInDialog(options) {
    this.connection = options.connection;
  }

  _.extend(SignInDialog.prototype, {

    show: function () {
      var deferred = $.Deferred(),
          container = $.fn.binf_modal.getDefaultContainer(),
          wrapper = $(wrapperTemplate()).appendTo(container),
          region = new Marionette.Region({
            el: wrapper.find('.binf-modal-content')[0]
          }),
          view = new SignInView({
            connection: this.connection
          });
      view.on('success', function (args) {
        wrapper.binf_modal('hide');
        deferred.resolve(args);
      });
      region.show(view);
      wrapper
          .on('shown.binf.modal', function () {
            view.triggerMethod('dom:refresh');
          })
          .on('hidden.binf.modal', function () {
            view.destroy();
          })
          .binf_modal({
            backdrop: 'static',
            keyboard: false
          });
      return deferred.promise();
    }

  });

  return SignInDialog;

});

csui.define('csui/utils/non-attaching.region/non-attaching.region',['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var NonAttachingRegion = Marionette.Region.extend({

    constructor: function NonAttachingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {}

  });

  return NonAttachingRegion;

});

csui.define('csui/utils/script-executing.region/script-executing.region',['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var ScriptExecutingRegion = Marionette.Region.extend({

    constructor: function ScriptExecutingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function(view) {
      this.$el
          .html('')
          .append(view.el);
    }

  });

  return ScriptExecutingRegion;

});

csui.define('csui/utils/toolitem.masks/global.toolitems.mask',['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask'
], function (module, _, ToolItemMask) {
  'use strict';

  // Masks tool items in amy toolbar or menu by blacklist and whitelist
  var GlobalToolItemsMask = ToolItemMask.extend({

    constructor: function GlobalToolItemsMask() {
      ToolItemMask.prototype.constructor.apply(this);
      var config = module.config();
      // Masks passed in by separate require.config calls are sub-objects
      // stored in the outer object be different keys
      _.each(config, function (source, key) {
        this.extendMask(source);
      }, this);
      // Enable restoring the mask to its initial state
      this.storeMask();
    }

  });

  return GlobalToolItemsMask;

});

csui.define('csui/behaviors/keyboard.navigation/tabkey.behavior',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/log',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabables.behavior'
], function (module, _, $,
    log,
    Marionette,
    TabablesBehavior) {
  'use strict';

  var TabKeyBehavior = TabablesBehavior.extend({

        constructor: function TabKeyBehavior(options, view) {
          TabablesBehavior.prototype.constructor.apply(this, arguments);

        },
    
        _clearTabIndexes: function (view) {
          log.debug('_clearTabIndexes of TabKeyBehavior for view ' + view.constructor.name) &&
          console.log(log.last);
        }

      },
      {}
  );

  return TabKeyBehavior;
});


csui.define('json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',{
  "type": "grid",
  "options": {
    "rows": [
      {
        "columns": [
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "half"
            },
            "widget": {
              "type": "csui/widgets/placeholder",
              "options": {
                "label": "Saved Query",
                "color": "#fff",
                "bgcolor": "#cccc88"
              }
            }
          },
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "full"
            },
            "widget": {
              "type": "csui/widgets/search.results",
              "options": {
              }
            }
          }
        ]
      }
    ]
  }
}
);


csui.define('css!csui/controls/form/impl/form',[],function(){});
csui.define('csui/models/form',['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/jsonpath'
], function (_, Backbone, jsonPath) {
  'use strict';

  var FormModel = Backbone.Model.extend({

    constructor: function FormModel(attributes, options) {
      this.options = options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    getValue: function (path) {
      var data = this.get('data');
      if (data && path) {
        data = FormModel.getValueOnPath(data, path);
      } else {
        data = null;
      }
      return data;
    },

    setValue: function (path, value) {
      var data = this.get('data');
      if (data && path) {
        data = FormModel.setValueOnPath(data, path, value);
      } else {
        data = null;
      }
      return data;
    }

  }, {

    // Gets a value (generally a sub-object of an object) at the XPath-like
    // location in the provided data.  The path is in the HTML forms format,
    // which Alpaca uses to identify a field value
    getValueOnPath: function (data, path) {
      if (path) {
        // Convert the XPath-like path to the JSON path format
        path = path
            .replace(/^\//, '$.')
            .replace(/\//, '.');
        data = jsonPath(data, path);
        // jsonPath returns always an array with results or `false`
        data = data ? data[0] : null;
      }
      return data;
    },

    // Sets a value (generally a sub-object of an object) at the XPath-like
    // location in the provided data.  The path is in the HTML forms format,
    // which Alpaca uses to identify a field value
    setValueOnPath: function (data, path, value) {
      if (path) {
        // The field name is at the end of path and it could be an array with
        // the index in square brackets
        var name = path.replace(/^.*\/([^\/]+)$/, '$1'),
            index = name.indexOf('[') > 0 ?
                    name.replace(/^.*\[(\d+)\]$/, '$1') : undefined;
        if (index !== undefined) {
          // Get the parent array path by cutting the index - the last part
          // of the path and convert the XPath-like path to the JSON path format
          path = path
              .replace(/^(.*)\[[^\]]\]+$/, '$1')
              .replace(/^\//, '$.')
              .replace(/\//, '.');
          data = jsonPath(data, path);
          // If the parent array of the original value was not found,
          // do not set anything, otherwise return the modified parent
          if (data) {
            // jsonPath returns an array with found nodes
            data = data[0];
            data[parseInt(index, 10)] = value;
          } else {
            data = null;
          }
        } else {
          // Get the parent object path by cutting the name - the last item of
          // the path - and convert the XPath-like path to the JSON path format
          path = path
              .replace(/^(.*)\/[^\/]+$/, '$1')
              .replace(/^\//, '$.')
              .replace(/\//, '.');
          // If the parent object is the root, no need to traverse the data
          if (path && path !== '/') {
            data = jsonPath(data, path);
            if (data) {
              // jsonPath returns an array with found nodes
              data = data[0];
            }
          }
          // If the parent object of the original value was not found,
          // do not set anything, otherwise return the modified parent
          if (data) {
            data[name] = value;
          } else {
            data = null;
          }
        }
      }
      return data;
    },

    pluckPrimitiveFields: function (data) {
      function flattenObject(data, result) {
        return _.reduce(_.keys(data), function (result, key) {
          var value = data[key];
          if (_.isArray(value)) {
            result[key] = flattenArray(value);
          } else if (_.isObject(value)) {
            result = flattenObject(value, result);
          } else {
            result[key] = value;
          }
          return result;
        }, result || {}, this);
      }

      function flattenArray(array) {
        return _.map(array, function (item) {
          if (_.isArray(item)) {
            return flattenArray(item);
          } else if (_.isObject(item)) {
            return flattenObject(item);
          } else {
            return item;
          }
        });
      }

      return flattenObject(data);
    }

  });

  return FormModel;

});

csui.define('csui/models/appliedcategoryform',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/form', 'csui/models/mixins/node.connectable/node.connectable.mixin'
], function (_, Backbone, Url, FormModel, NodeConnectableMixin) {
  'use strict';

  var AppliedCategoryFormModel = FormModel.extend({

    constructor: function AppliedCategoryFormModel(attributes, options) {
      FormModel.prototype.constructor.call(this, attributes, options);

      this.makeNodeConnectable(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {node: this.node});
    },

    url: function () {
      var url = _.str.sformat('forms/nodes/categories/{0}?id={1}&category_id={2}',
          this.options.action, this.options.node.get('id'), this.options.categoryId);
      return Url.combine(this.connector.connection.url, url);
    },

    parse: function (response, options) {
      // Some views may fail if one of the three properties was missing
      var form = _.extend({
            data: {},
            schema: {},
            options: {}
            // The server returns an array pf forms, although only one category
            // was requested.  Normalize the response to be just a single form.
          }, response.form || response.forms && response.forms[0] || response),
      // Title usually does not come from the server
          title = form.title || this.get('title');

      form.options = _.omit(form.options, 'form');
      if (form.schema.title === undefined) {
        form.schema.title = title;
      }
      if (!form.title) {
        form.title = title;
      }
      if (form.role_name === undefined) {
        form.role_name = "categories";
      }

      return form;
    }

  });

  NodeConnectableMixin.mixin(AppliedCategoryFormModel.prototype);

  return AppliedCategoryFormModel;

});

csui.define('csui/widgets/metadata/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/widgets/metadata/impl/nls/root/lang',{

  // tab title
  properties: 'Properties',
  versions: 'Versions',
  general: 'General',

  // Dropdown menu items
  MenuItemRename: 'Rename',
  MenuItemEdit: 'Edit',
  MenuItemCopy: 'Copy',
  MenuItemMove: 'Move',
  MenuItemDownload: 'Download',
  MenuItemEmailLink: 'Email Link',
  MenuItemShare: 'Share',
  MenuItemReserve: 'Reserve',
  MenuItemUnreserve: 'Unreserve',
  MenuItemAddVersion: 'Add version',
  MenuItemDelete: 'Delete',

  // add item metadata
  addItemMetadataDialogButtonAddTitle: 'Add',
  addItemMetadataDialogButtonCancelTitle: 'Cancel',
  addItemMetadataDialogTitle1: 'New {0}',
  addItemMetadataDialogTitleGeneric: 'Item',
  addDocumentMetadataDialogTitle: 'Upload file',
  addDocumentMetadataDialogAddButtonTitle: 'Upload',
  addItemPlaceHolderName: 'Enter name',
  emptyObjectNameAria: 'Object name',

  // other messages
  editNameTooltip: 'Edit name',
  cancelEditNameTooltip: 'Cancel name edit',
  failedToSaveName: 'Failed to save name.',
  failedToCreateItem: 'Failed to create the new item.',
  failedToValidateForms: 'Failed to validate all Forms.  Please check that all required fields are entered.',
  switchLanguageTooltip: 'Switch language',
  gotoPreviousCategoryTooltip: 'Show previous Category',
  gotoNextCategoryTooltip: 'Show next Category',
  addNewProperties: 'Add properties',
  addNewCategory: 'Add a new Category',
  addNewCategoryDialogTitle: 'Add Category',
  addNewCategoryDialogAddButtonTitle: 'Add',
  removeCategoryTooltip: 'Remove this Category',
  removeCategoryWarningTitle: 'Remove Category',
  removeCategoryWarningMessage: 'Do you want to remove Category "{0}"?',
  removeCategoryFailMessageTitle: 'Remove Category Failed',
  removeCategoryFailMessage: 'Failed to remove Category "{0}". \n\n{1}',
  getPropertyPanelsFailTitle: 'Error Loading Properties',
  getCategoryActionsFailTitle: 'Get Category Actions',
  getCategoryActionsFailMessage: 'Failed to get Category actions for node "{0}". \n\n{1}',
  getActionsForACategoryFailMessage: 'Failed to get actions for Category "{0}" of node "{1}". \n\n{2}',
  addNewCategoryFailTitle: 'Add Category to node',
  addNewCategoryFailMessage: 'Failed to add Category "{0}" to node "{1}" with node ID "{2}". \n\n{3}',
  categoryExistsMessage: 'Error: Category "{0}" already exists.',
  loadNewCategoryFailTitle: 'Get new Category Form',
  loadNewCategoryFailMessage: 'Failed to get Form for Category "{0}" on node "{1}" with node ID "{2}". \n\n{3}',
  selectCategoryTitle: 'Select a Category to add',
  selectCategoryButtonLabel: 'Add',
  viewShortcutMessage: 'View shortcut',
  viewOriginalMessage: 'View original',
  shortcutLocationLabel: 'Original location',
  closeMetadataButtonTooltip: 'Close metadata',
  formValidationErrorMessage: 'Required fields must be filled',
  hideValidationErrorMessageIconTooltip: 'Hide validation error',
  missingRequiredMetadataForDocuments: 'Missing required metadata for some document(s).',
  goBackTooltip: 'Go back',
  onlyRequiredFieldsLabel: 'Only required fields (*)',
  defaultDialogTitle: 'Metadata',
  defaultDialogOkButtonTitle: 'OK',
  defaultDialogCancelButtonTitle: 'Cancel',
  moveOneItemMetadataDialogTitle: 'Move item',
  moveMultipleItemsMetadataDialogTitle: 'Move {0} items',
  moveItemsMetadataDialogButtonTitle: 'Move',
  copyOneItemMetadataDialogTitle: 'Copy item',
  copyMultipleItemsMetadataDialogTitle: 'Copy {0} items',
  copyItemsMetadataDialogButtonTitle: 'Copy',
  missingRequiredMetadataForObjects: 'Missing required metadata for some object(s).',
  inheritanceOriginalProperties: 'with original properties',
  inheritanceDestinationProperties: 'with destination properties',
  inheritanceMergedProperties: 'with combined properties',
  requiredTooltip: 'Required',
  requiredPassedTooltip: 'Required fields satisfied.',

  // Versions
  ToolbarItemVersionInfo: 'Properties',
  ToolbarItemVersionDelete: 'Delete',
  ToolbarItemVersionPurgeAll: 'Purge all previous Versions',
  ToolbarItemVersionDownload: 'Download',
  versionColumnSizeTitle: 'Size',
  versionColumnVersionNumberTitle: 'Versions',
  openDoc: 'Open {0}',
  openDocAria: 'Open {0} {1}',
  versionNumInBrowserTitle: 'Version {0}',
  docPreviewAlt: 'Document Preview',

  // properties: general
  formFieldItemIdLabel: 'Item ID',
  formFieldSizeLabel: 'Size',
  formFieldTypeLabel: 'Type',
  formFieldReservedStatusLabel: 'Status',
  formFieldReservedByLabel: 'Reserved by',

  UrlLabel: "Web address",
  UrlTitle: "Web address",

  // alplaca placeholder
  alpacaPlaceholderNotAvailable: 'n/a',
  alpacaPlaceholderUrl: 'Add web address',
  alpacaPlaceholderOTNodePicker: 'Select object',
  alpacaPlaceholderDescription: 'Add description',
  NoOwner: '<No Owner>',
  showMore: 'Show more',
  showMoreAria: 'Show more actions',
  collapse: 'Hide item list',
  expand: 'Show item list',
  permissionPage: "Permission Page of {0}"
});


csui.define('csui/models/forms',['csui/lib/backbone', 'csui/models/form'
], function (Backbone, FormModel) {
  'use strict';

  var FormCollection = Backbone.Collection.extend({

    model: FormModel,

    constructor: function FormCollection(models, options) {
      this.options = options || (options = {});

      Backbone.Collection.prototype.constructor.call(this, models, options);
    }

  });

  return FormCollection;

});

csui.define('csui/models/nodeforms',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log', 'csui/utils/base',
  'csui/models/forms',
  'csui/models/mixins/node.resource/node.resource.mixin'
], function (module, $, _, Backbone, log, base, FormCollection,
    NodeResourceMixin) {
  'use strict';

  var NodeFormCollection = FormCollection.extend({

    constructor: function NodeFormCollection(models, options) {
      FormCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options);
    },

    parse: function (response) {
      return response.forms;
    }

  });

  NodeResourceMixin.mixin(NodeFormCollection.prototype);

  return NodeFormCollection;

});

csui.define('csui/models/nodecreateforms',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/nodeforms"
], function (module, $, _, Backbone, log, base, NodeFormCollection) {
  "use strict";

  // NodeCreateFormCollection
  // ------------------------

  var NodeCreateFormCollection = NodeFormCollection.extend({

      constructor: function NodeCreateFormCollection(models, options) {
        NodeFormCollection.prototype.constructor.apply(this, arguments);
        this.type = options.type;
        this.docParentId = options.docParentId;
        if (this.type === undefined) {
          throw new Error(this.ERR_CONSTRUCTOR_NO_TYPE_GIVEN);
        }
      },

      clone: function () {
        return new this.constructor(this.models, {
          node: this.node,
          type: this.type
        });
      },

      url: function () {
        var path = 'forms/nodes/create',
            params = {
              parent_id: this.docParentId ? this.docParentId : this.node.get("id"),
              type: this.type
            },
          resource = path + '?' + $.param(params);
        return base.Url.combine(this.node.connector.connection.url, resource);
      },

      parse: function (response) {
        var forms = response.forms;

        // TODO this should be sent by server, remove when possible
        _.each(forms, function (form) {
          form.id = form.schema.title;
        });
        forms.length && (forms[0].id = "general");

        return forms;
      }

    },
    // statics
    {
      // errors
      ERR_CONSTRUCTOR_NO_TYPE_GIVEN: "No creation type given in constructor"
    });

  // Module
  // ------

  _.extend(NodeCreateFormCollection, {
    version: '1.0'
  });

  return NodeCreateFormCollection;

});


csui.define('csui/models/nodeupdateforms',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/nodeforms", "csui/models/form"
], function (module, $, _, Backbone, log, base, NodeFormCollection, FormModel) {
  "use strict";

  // NodeUpdateFormCollection
  // ------------------------

  var NodeUpdateFormCollection = NodeFormCollection.extend({

      constructor: function NodeUpdateFormCollection(models, options) {
        NodeFormCollection.prototype.constructor.apply(this, arguments);
        this.makeNodeResource(options);
      },

      model: FormModel,

      clone: function () {
        return new this.constructor(this.models, {
          node: this.node
        });
      },

      url: function () {
        return _.str.sformat('{0}/forms/nodes/update?id={1}', this.connector.connection.url,
          this.node.get('id'));       
      },

      parse: function (response) {
        if (response.forms) {
          var forms = [];
          _.each(response.forms, function (form) {
            if (form.role_name === 'categories') {
              forms = forms.concat(Object.keys(form.schema.properties).map(function (categoryId) {
                categoryId = Number(categoryId); // convert to number for unselectable node in nodepicker            
                form.data[categoryId] && delete form.data[categoryId][categoryId + '_1'];
                form.options.fields[categoryId] &&
                delete form.options.fields[categoryId][categoryId + '_1'];
                form.schema.properties[categoryId] &&
                delete form.schema.properties[categoryId][categoryId + '_1'];
                return {
                  id: categoryId,                  
                  name: form.schema.properties[categoryId]['title'],
                  title: form.schema.properties[categoryId]['title'],
                  data: form.data[categoryId],
                  role_name: "categories",
                  allow_delete: true,
                  categoryId: categoryId,
                  options: form.options.fields[categoryId],
                  schema: form.schema.properties[categoryId]
                };
              })); 
            } else {
              forms.push(form);
            }           
          });

          return forms;            
        } else {
          // for actions call
          return response.data;
        }        
      }
    });

  _.extend(NodeUpdateFormCollection, {
    version: '1.0'
  });
  return NodeUpdateFormCollection;

});


csui.define('csui/widgets/metadata/metadata.forms/server.adaptor.mixin',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/base', 'csui/utils/url',
  'csui/models/appliedcategories', 'csui/models/form',
  'csui/models/appliedcategoryform', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/models/nodecreateforms','csui/models/nodeupdateforms',
  'csui/models/node/node.model', 'csui/models/version'
], function ($, _, Backbone, log, base, Url,
    AppliedCategoryCollection, FormModel, AppliedCategoryFormModel, lang,
    NodeCreateFormCollection, NodeUpdateFormCollection, NodeModel,
    VersionModel) {
  'use strict';

  var prototypeExt = {

    makeServerAdaptor: function (options) {
      return this;
    },

    sync: function (method, model, options) {

      if (method === 'read') {

        // branch off for different metadata form calls
        if (this.action === 'copy' || this.action === 'move') {
          return this._getMetadataCopyMoveItemForms(method, model, options);
        } else if (this.action === 'create' || this.node.get("id") === undefined) {
          return this._getMetadataAddItemForms(method, model, options);
        } else {  // the main metadata case
          if (this.node instanceof VersionModel) {
            return this._getMetadataVersionsForms(method, model, options);
          } else {
            return this._getMetadataForms(method, model, options);
          }
        }

      } else {
        // create/delete/update
        return Backbone.Collection.prototype.sync.apply(this, arguments);
      }

    },

    // Get metadata forms for an existing node
    _getMetadataForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      // fetch categories
      // if this is for a shortcut, fetch categories for original node
      var node       = this.node,
          type       = node.get('type'),
          categories = new NodeUpdateFormCollection(undefined, {node: node});
      return categories
          .fetch()
          .then(_.bind(function (data, status, jqXHR) {
            this.options = options;
            this.forms = categories.models;
            if (options.success) {
              options.success(this.forms, 'success');
            }            
          }, this))
          .fail(function (request, message, statusText) {
            if (options.error) {
              options.error(request, message, statusText);
            }
          });
    },

    // Get metadata forms for a document version
    _getMetadataVersionsForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      var deferred = $.Deferred();

      var version = this.node;
      var nodeId = version.get('id');
      var verNum = version.get('version_number');
      var connector = version.connector;

      var versionCatsUrl = Url.combine(connector.connection.url, 'forms/nodes/versions/categories');
      var getCategoriesOptions = connector.extendAjaxOptions({
        url: versionCatsUrl + '?' +
             $.param({
               id: nodeId,
               version_number: verNum
             })
      });

      $.ajax(getCategoriesOptions)
          .done(_.bind(function (response, statusText, jqxhr) {

            var forms = [];

            // category form models
            var allCategoriesForm = response.forms[0];
            if (allCategoriesForm) {
              var roleName = "categories";
              if (this.roles === undefined) {
                this.roles = {};
              }
              if (this.roles[roleName] === undefined) {
                this.roles[roleName] = {};
              }

              var catIds = _.keys(allCategoriesForm.options.fields);
              _.each(catIds, function (catId) {
                var catName = allCategoriesForm.schema.properties[catId].title;
                var catData = allCategoriesForm.data[catId];
                var catOptions = allCategoriesForm.options.fields[catId];
                var catSchema = allCategoriesForm.schema.properties[catId];
                if (NodeModel.usesIntegerId) {
                  catId = parseInt(catId);
                }
                var catModel = new AppliedCategoryFormModel({
                  id: catId,
                  title: catName,
                  allow_delete: false
                }, {
                  node: this.node,
                  categoryId: catId,
                  action: 'none'
                });
                forms.push(catModel);

                catModel.set({
                  data: catData,
                  options: catOptions,
                  schema: _.omit(catSchema, ['description']),
                  role_name: roleName,
                  removeable: false
                });
              }, this);
            }

            if (options.success) {
              options.success(forms, 'success');
            }
            deferred.resolve();

          }, this))
          .fail(function () {
            deferred.reject.apply(deferred, arguments);
          });

      return deferred.promise();
    },

    // Get Metadata forms for Add Item
    _getMetadataAddItemForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      var nData       = this.node.get('data'),
          createForms = this.formCollection ||
                        new NodeCreateFormCollection(undefined, {
                          node: this.container,
                          docParentId: this.node.get('docParentId'),
                          type: this.node.get('type')
                        }),
          data        = this.node.get('forms') || undefined,
          xhr         = this.node.get('xhr') || undefined,
          pushresp    = {};

      if (!!data && !!xhr) {
        data.forms[0].id = 'general';

        this._pushForms(data, nData, options);
        this.fetching = false;
        this.fetched = true;
        return $.Deferred().resolve();
      }
      else {
        return createForms
            .fetch()
            .then(_.bind(function (data, status, jqXHR) {

              this._pushForms(data, nData, options);
            }, this))
            .fail(function (jqXHR, textStatus, errorThrown) {
              if (options.error) {
                options.error(jqXHR, textStatus, errorThrown);
              }
            });
      }

    },

    _pushForms: function (data, nData, options) {
      var forms = [];

      // set data from inline form if entered
      var name = this.node.get('name');
      if (name !== undefined) {
        data.forms[0].data.name = name;
      }
      var addableType = this.node.get('type');
      if (addableType === 1) {  // Shortcut
        var original_id = this.node.get('original_id');
        if (original_id !== undefined) {
          data.forms[0].data.original_id = original_id;
        }
      } else if (addableType === 140) {  // URL
        var url = this.node.get('url');
        if (url && url.length > 0) {
          data.forms[0].data.url = url;
        }
      } else if (addableType === 144) {  // Document
        if (name !== undefined) {
          data.forms[0].data.file = name;
        }
        if (nData) {
          var fData = data.forms[0].data;
          nData.name && (fData.name = nData.name);
          nData.description && (fData.description = nData.description);
          nData.advanced_versioning &&
          (fData.advanced_versioning = nData.advanced_versioning);
        }
      }

      _.each(data.forms, function (form) {
        if (form.role_name === 'categories') {
          this._pushCategoryForms(form, forms, options);
        } else {
          forms.push(new FormModel(form));
        }
      }, this);

      if (options.success) {
        options.success(forms, 'success');
      }
    },

    _pushCategoryForms: function (multiForm, targetForms, options) {
      var nData  = this.node.get('data'),
          catIds = _.keys(multiForm.options.fields);
      _.each(catIds, function (catId) {
        if (_.indexOf(this.node.removedCategories, catId) === -1) {
          var catName = multiForm.schema.properties[catId].title,
              catData = multiForm.data[catId];
          if (nData && nData.roles && nData.roles.categories &&
              nData.roles.categories[catId]) {
            catData = _.extend(catData, nData.roles.categories[catId]);
          }
          var catOptions = multiForm.options.fields[catId];
          var catSchema = _.omit(multiForm.schema.properties[catId], 'description');
          if (NodeModel.usesIntegerId) {
            catId = parseInt(catId);
          }
          var catModel = new AppliedCategoryFormModel({
            id: catId,
            title: catName,
            data: catData,
            options: catOptions,
            schema: catSchema,
            role_name: 'categories',
            allow_delete: (catOptions && catOptions.removeable === false) ? false : true,
            removeable: (catOptions && catOptions.removeable === false) ? false : true
          }, {
            node: this.node,
            categoryId: catId,
            action: 'none'
          });
          if (options.reset) {
            targetForms.push(catModel);
          } else {
            this.add(catModel);
          }
        }
      }, this);
    },

    // Get Metadata forms for Copy/Move Item
    _getMetadataCopyMoveItemForms: function (method, model, options) {

      model.trigger('request', model, undefined, options);

      var deferred    = $.Deferred(),
          self        = this,
          nodeId      = this.node.get('id'),
          connector   = this.container.connector,
          inheritance = {original: 0, destination: 1, merged: 2},
          formUrl;

      if (self.action === 'copy') {
        formUrl = '/forms/nodes/copy';
      } else if (self.action === 'move') {
        formUrl = '/forms/nodes/move';
      }
      var getCategoriesOptions = connector.extendAjaxOptions({
        url: connector.connection.url + formUrl + '?' +
             $.param({
               id: nodeId,
               parent_id: self.container.get('id'),
               inheritance: inheritance[self.inheritance]
             })
      });

      $.ajax(getCategoriesOptions)
          .done(function (response, statusText, jqxhr) {

            var forms = [];

            // category form models
            var allCategoriesForm;
            if (response.forms.length > 1) {
              allCategoriesForm = _.find(response.forms, function (form) {
                return form.role_name === "categories";
              });
            }
            if (allCategoriesForm) {
              var roleName = allCategoriesForm.role_name;
              if (self.roles === undefined) {
                self.roles = {};
              }
              if (self.roles[roleName] === undefined) {
                self.roles[roleName] = {};
              }

              var prevDataOnNode = self.node.get('data');
              var prevCatDataOnNode = {};
              if (prevDataOnNode && prevDataOnNode.roles && prevDataOnNode.roles[roleName]) {
                prevCatDataOnNode = prevDataOnNode.roles[roleName];
              }

              var catIds = _.keys(allCategoriesForm.options.fields);
              _.each(catIds, function (catId) {
                if (_.indexOf(self.node.removedCategories, catId) === -1) { //don't show
                  // previously deleted categories
                  var catName      = allCategoriesForm.schema.properties[catId].title,
                      catData      = allCategoriesForm.data[catId],
                      catOptions   = allCategoriesForm.options.fields[catId],
                      catSchema    = allCategoriesForm.schema.properties[catId],
                      correctCatId = NodeModel.usesIntegerId ? parseInt(catId) : catId,
                      catModel     = new AppliedCategoryFormModel({
                        id: correctCatId,
                        title: catName,
                        allow_delete: true
                      }, {
                        node: self.node,
                        categoryId: correctCatId,
                        action: 'none'
                      });

                  forms.push(catModel);

                  //restore previous set values if available
                  if (_.isEmpty(prevCatDataOnNode[catId]) === false) {
                    _.each(catData, function (iValue, iKey) {
                      if (_.has(prevCatDataOnNode[catId], iKey)) {
                        catData[iKey] = prevCatDataOnNode[catId][iKey];
                      }
                    });
                  }
                  catModel.set({
                    data: catData,
                    options: catOptions,
                    schema: _.omit(catSchema, ['description']),
                    role_name: roleName,
                    removeable: true
                  });
                }
              });
            }

            if (options.success) {
              options.success(forms, 'success');
            }
            deferred.resolve();

          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            if (options.error) {
              options.error(jqXHR, textStatus, errorThrown);
            }
            deferred.reject.apply(deferred, arguments);
          });

      return deferred.promise();
    }
  };

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, prototypeExt);
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/widgets/metadata/metadata.forms',[
  'csui/lib/backbone', 'csui/utils/log',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/widgets/metadata/metadata.forms/server.adaptor.mixin'
], function (Backbone, log, NodeConnectableMixin,
    FetchableMixin,  ServerAdaptorMixin) {
  'use strict';

  // TODO: Let the scenario owner create the specific a collection and pass
  // it down to the metadata view.  The "collection guidepost should not be
  // needed.  It tightly couples all metadata scenarios

  var MetadataFormCollection = Backbone.Collection.extend({
    constructor: function MetadataFormCollection(models, options) {
      options || (options = {});
      this.action = options.action;
      this.inheritance = options.inheritance;
      this.container = options.container;
      this.formCollection = options.formCollection;

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeNodeConnectable(options)
          .makeFetchable(options)
          .makeServerAdaptor(options);
    }
  });

  NodeConnectableMixin.mixin(MetadataFormCollection.prototype);
  FetchableMixin.mixin(MetadataFormCollection.prototype);
  ServerAdaptorMixin.mixin(MetadataFormCollection.prototype);

  return MetadataFormCollection;
});

// TODO: Deprecate this module and endorse the public one.
csui.define('csui/widgets/metadata/impl/metadata.forms',[
  'csui/widgets/metadata/metadata.forms'
], function (MetadataFormCollection) {
   return MetadataFormCollection;
});

csui.define('csui/widgets/metadata/impl/metadata.utils',["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/url",
  "csui/widgets/metadata/impl/metadata.forms"
], function (_, $, Backbone, Url, MetadataFormCollection) {

  function MetadataUtils() {
  }

  _.extend(MetadataUtils.prototype, Backbone.Events, {

    //
    // Public: check the container for enforced required metadata
    // Parameters:
    // - <object> options: {action, id|addableType, container [,inheritance, enforcedRequiredAttrs]}
    // Return:
    // - jquery deferred that is always resolved with resp.hasRequiredMetadata = true/false
    //
    ContainerHasEnforcedEmptyRequiredMetadata: function (options) {
      var deferred = $.Deferred();
      var tempNode = new Backbone.Model({
        name: options.name,
        id: options.id,
        docParentId: options.docParentId,
        type: options.addableType
      });
      if (options.enforcedRequiredAttrs) {
        tempNode.options || (tempNode.options = {});
        tempNode.options.enforcedRequiredAttrs = true;
      }

      var allForms = new MetadataFormCollection(undefined, {
        node: tempNode,
        action: options.action,
        connector: options.container.connector,
        container: options.container,
        inheritance: options.inheritance,
        autofetch: true,
        autoreset: true
      });

      allForms.fetch()
          .done(_.bind(function () {
            if (allForms.models.length === 0) {
              deferred.resolve({hasRequiredMetadata: false});
            } else {
              var formsValid = this.FormsCollectionHasRequiredAttributes(allForms);
              deferred.resolve({hasRequiredMetadata: !formsValid, initialFormData: allForms});
            }
          }, this));

      return deferred.promise();
    },

    // Public: check the forms collection for required attributes
    // Parameters:
    // - <object> allForms: collection of all forms
    // Return:
    // - has required attributes: true/false
    FormsCollectionHasRequiredAttributes: function (allForms) {
      var formsValid = true;
      _.each(allForms.models, _.bind(function (form) {
        var valid = this._checkForAlpacaRequiredFields(form);
        formsValid = formsValid && valid;
      }, this));
      return formsValid;
    },

    jsonObjTraverse: function (jsonObj, stack, key, val, res, prop) {
      for (var property in jsonObj) {
        if (jsonObj.hasOwnProperty(property)) {
          if (jsonObj[key] && jsonObj[key] === val && _.indexOf(res, prop) === -1) {
            res.push(prop);
          }
          if (typeof jsonObj[property] == "object") {
            this.jsonObjTraverse(jsonObj[property], stack + '.' + property, key, val, res,
                property);
          }
        }
      }
    },

    // private
    _checkForAlpacaRequiredFields: function (form) {
      var valid                = true,
          data                 = form.get('data'),
          options              = form.get('options'),
          schema               = form.get('schema'),
          reqArray             = [],
          reqFieldId           = [],
          nonValidateFieldsIds = [];

      // getting field id for Required Fields.
      this.jsonObjTraverse(schema, '', 'required', true, reqFieldId, 'properties');

      // getting field id for validate is false.
      this.jsonObjTraverse(options, '', 'validate', false, nonValidateFieldsIds, 'fields');

      // eliminating non validating fields from required field ids.
      var removeNonValidateFields = function (nvFields, rFields) {
        var rFields_ = nvFields.filter(function (n) {
          return rFields.indexOf(n) != -1;
        });
        return rFields_.length > 0 ? rFields_ : rFields;
      };

      var filteredRequiredFieldsIds = removeNonValidateFields(nonValidateFieldsIds, reqFieldId),
          getReqArray               = function (jsonObj, stack, ele, res) {
            for (var property in jsonObj) {
              if (jsonObj.hasOwnProperty(property)) {
                if (property === ele) {
                  res.push(jsonObj[ele]);
                }
                if (typeof jsonObj[property] == "object") {
                  getReqArray(jsonObj[property], stack + '.' + property, ele, res);
                }
              }
            }
          };

      if (!!filteredRequiredFieldsIds) {
        var nullCount = false;
        _.each(filteredRequiredFieldsIds, function (arrayElement) {
          reqArray = [];
          getReqArray(data, '', arrayElement.toString(), reqArray);
          _.each(reqArray, function (arrayElement) {
            var checkNull = function (element) {
              if (element instanceof Array && (element !== null || element !== "")) {
                _.each(element, function (childElement) {
                  checkNull(childElement);
                });
              } else if (element === null || element === "") {
                nullCount = true;
                return;
              }
            };
            if (!nullCount) {
              checkNull(arrayElement);
            } else {
              valid = false;
              return;
            }
          });
          if (nullCount) {
            valid = false;
            return;
          }
        });
      }

      return valid;
    },

    //
    // Public: check the Alpaca options and schema for required field
    // Parameters:
    // - <object> options: Alpaca form's options
    // - <object> schema: Alpaca form's schema
    // Return:
    // - true/false
    //
    AlpacaFormOptionsSchemaHaveRequiredFields: function (formOptions, formSchema, metadataTab) {
      var required  = false,
          reqFields = [];
      if (!!metadataTab && metadataTab === 'general') { //for 'general' traverse all the properties.
        if (formSchema && formSchema.properties) {
          if (!!formSchema.properties.name) {
            formSchema.properties.name.required = false;
          }
          if (!!formSchema.properties.advanced_versioning) {
            formSchema.properties.advanced_versioning.required = false;
          }
          if (!!formSchema.properties.file) {
            formSchema.properties.file.required = false;
          }

          for (var key in formSchema.properties) {
            // required true, only when the current property is required and it's hidden is false.
            if (formSchema.properties.hasOwnProperty(key) && formSchema.properties[key].required &&
                !formOptions.fields[key].hidden) {
              required = true;
            }
          }
        }
      } else { // other than 'general' tab, search for required property.
        if (formSchema && required === false) {
          this.jsonObjTraverse(formSchema, '', 'required', true, reqFields, 'properties');
          if (reqFields.length > 0) {
            required = true;
          }
        }
      }
      return required;
    },

    //
    // Public: check the server to see if the nodes being performed by the action (copy/move, etc.)
    //         are enforced to fill in required metadata
    // Parameters:
    // - <object> options: {items, container}
    // Return:
    // - jquery deferred object containing following response when done:
    //   - response.requiredMetadata: true/false
    //   - response.enforcedItems: array of the node ids that are enforced to fill required metadata
    //
    ContainerHasEnforcedEmptyRequiredMetadataOnNodes: function (options) {
      if (!options.items || options.items.length < 1 || !options.container) {
        return $.Deferred().reject({});
      }

      var deferred = $.Deferred();
      var ids = _.map(options.items, function (item) { return item.id });

      // FormData available (IE10+, WebKit)
      var formData = new FormData();
      formData.append('body', JSON.stringify({'ids': ids}));

      var connector = options.container.connector;
      var ajaxOptions = {
        type: 'POST',
        url: Url.combine(connector.connection.url, "validation/nodes/categories/enforcement"),
        data: formData,
        contentType: false,
        processData: false
      };
      connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            if (options.inheritance === 'original') {
              deferred.resolve({requiredMetadata: false, enforcedItems: resp.results});
            } else {  // inheritance == 'destination' or 'merged'
              if (resp.results && resp.results.length > 0) {
                // only need to get the categories forms for just one item and check required fields
                var utilOptions = {
                  action: options.action,
                  id: resp.results[0].id,
                  inheritance: options.inheritance,
                  container: options.container,
                  enforcedRequiredAttrs: true
                };
                this.ContainerHasEnforcedEmptyRequiredMetadata(utilOptions)
                    .done(function (resp2) {
                      if (resp2.hasRequiredMetadata === true) {
                        deferred.resolve({requiredMetadata: true, enforcedItems: resp.results});
                      } else {
                        deferred.resolve({requiredMetadata: false, enforcedItems: resp.results});
                      }
                    })
                    .fail(function (error) {
                      deferred.reject(error);
                    });
              } else {
                deferred.resolve({requiredMetadata: false, enforcedItems: resp.results});
              }
            }
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    }

  });

  MetadataUtils.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataUtils, {version: "1.0"});

  return MetadataUtils;
});

csui.define('csui/controls/form/pub.sub',['csui/lib/underscore', 'csui/lib/backbone'], function (_, Backbone) {
  'use strict';
  //const PubSub = _.extend({}, Backbone.Events);
  return _.extend({}, Backbone.Events);
});
csui.define('csui/temporary/cop/commands/defaultactionitems',[],function () {
  'use strict';

  return [
    // Blog, Blog Entry
    {
      equals: {type: [356, 357]},
      signature: 'OpenBlog',
      sequence: 30
    },
    {
      // FAQ, FAQ Entry
      equals: {type: [123475, 123476]},
      signature: 'OpenFAQ',
      sequence: 30
    },
    // Forum, Forum Topic
    {
      equals: {type: [123469, 123470]},
      signature: 'OpenForum',
      sequence: 30
    },
    // Wiki, Wiki Page
    {
      equals: {type: [5573, 5574]},
      signature: 'OpenWiki',
      sequence: 30
    },
    // MailStore
    {
      equals: {type: 3030331},
      signature: 'OpenMailStore',
      sequence: 30
    }
  ];

});

csui.define('csui/temporary/activeviews/commands/defaultactionitems',[],function () {
  'use strict';

  return [
    // ActiveView
    {
      equals: {type: 30309},
      signature: 'Disabled',
      sequence: 30
    }
  ];

});

csui.define('csui/temporary/appearances/commands/defaultactionitems',[],function () {
  'use strict';

  return [
    // Appearance
    {
      equals: {type: 480},
      signature: 'Disabled',
      sequence: 30
    }
  ];

});

csui.define('csui/utils/letter-avatar-random-color/letter-avatar-colors',['module'], function (module) {

    var config = {

        colors: ["#414979", "#2e3d98", "#4f3690", "#e00051", "#006353", "#007599", "#147bbc",
            "#a0006b", "#ba004C"]
    };

    var LetterAvatarColor = {

        getLetterAvatarColor: function (initials) {
            if (!initials) {
                return "";
            }
            var charIndex = 0,
                    colourIndex = 0,
                    initialsLen = initials.length;
            initials = initials.toUpperCase();
            for (var i = 0; i < initialsLen; i++) {
                charIndex += initials.charCodeAt(i);
            }
            colourIndex = parseInt(charIndex.toString().split('').pop());
            colourIndex = (colourIndex === 9) ? colourIndex - 1 : colourIndex;
            return config.colors[colourIndex];
        }
    };

    return LetterAvatarColor;

});

csui.define('csui/utils/user.avatar.color',['csui/lib/underscore',
    'csui/utils/letter-avatar-random-color/letter-avatar-colors'
], function (_, LetterAvatarColor) {

    var UserAvatarColor = {

        getUserAvatarColor: function (user) {
            if (!user || _.isEmpty(user)) {
                return "";
            }
            var initials = (user.initials && user.initials.length > 1) ? user.initials : (user.name ? user.name.substring(0, 2) : "");
            return LetterAvatarColor.getLetterAvatarColor(initials);
        }

    };
    return UserAvatarColor;
});

csui.define('bundles/csui-view-support',[
  // 3rd-party libraries
  'csui/lib/ally',
  'csui/lib/bootstrap3-typeahead',
  'csui/lib/jquery.mousehover',
  'csui/lib/jsonpath',

  // Behaviors
  'csui/behaviors/collection.error/collection.error.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/behaviors/collection.state/collection.state.view',

  //Controls
  'csui/controls/facet.bar/facet.bar.view',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/controls/list/emptylist.view',
  'csui/controls/list/list.view',
  'csui/controls/list/list.state.view',
  // FIXME: Some controls like tile or nodelist require this file,
  // although it is private in list
  'css!csui/controls/list/impl/list',
  'csui/controls/list/simplelist.view',
  'csui/controls/list/simpletreelist.view',
  'csui/controls/listitem/listitemobject.view',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/listitem/listitemstateful.view',
  'csui/controls/listitem/simpletreelistitem.view',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/toolbar/toolitem.model',
  'csui/controls/toolbar/toolitem.custom.view',
  'csui/controls/toolbar/toolitem.view',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolitems.mask',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/toolbar/toolbar.state.behavior',
  'hbs!csui/controls/toolbar/toolitem',
  'csui/controls/fileupload/impl/upload.controller',
  'csui/controls/checkbox/checkbox.view',
  'csui/controls/disclosure/disclosure.view',

  //Models
  'csui/models/appliedcategories',
  'csui/models/appliedcategory',
  'csui/models/fileupload',
  'csui/models/fileuploads',
  'csui/models/namequery',
  'csui/models/nodeversions',
  'csui/models/versions',
  'csui/models/facet',
  'csui/models/facets',
  'csui/models/facettopic',
  'csui/models/facettopics',
  'csui/models/node.facets/facet.query.mixin',
  'csui/models/node/node.facet.factory',
  'csui/models/nodefacets',
  'csui/models/widget/search.results/search.results.model',
  'csui/models/permission/permission.table.columns.model',

  //Utilities
  // TODO: Make public modules out of these.
  'csui/utils/commands/impl/full.page.modal/full.page.modal.view',
  'csui/utils/commands/impl/thumbnail/thumbnail.object',
  'csui/utils/commands/impl/thumbnail/thumbnail.view',
  // TODO: Why is this module public?
  'json!csui/utils/commands/open.types.json',
  'csui/utils/commands/open.plugins/impl/core.open.plugins',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/utils/high.contrast/detector',
  'csui/utils/impl/signin.dialog/signin.dialog',
  'csui/utils/non-attaching.region/non-attaching.region',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/script-executing.region/script-executing.region',
  'csui/utils/taskqueue',
  'csui/utils/toolitem.masks/global.toolitems.mask',
  'csui/behaviors/keyboard.navigation/retainfocus.behavior',
  'csui/behaviors/keyboard.navigation/tabkey.behavior',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',

  // Client-side perspectives
  'json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',

  //Form
  'css!csui/controls/form/impl/form',

  //widget components
  'csui/widgets/metadata/metadata.forms',
  // TODO: Remove these private modules from here.
  'csui/widgets/metadata/impl/metadata.forms',
  'csui/widgets/metadata/impl/metadata.utils',
  'i18n!csui/widgets/metadata/impl/nls/lang',

  //Forms
  'csui/models/appliedcategoryform',
  'csui/models/form',
  'csui/models/forms',
  'csui/models/nodeforms',

  // TODO: Remove this module. Radio channel should be used for messaging.
  'csui/controls/form/pub.sub',

  // TODO: Remove this, as long as the module owners take over
  // the commands and default action rules
  'csui/temporary/cop/commands/defaultactionitems',
  'csui/temporary/activeviews/commands/defaultactionitems',
  'csui/temporary/appearances/commands/defaultactionitems',

  // Server Adaptors
  // TODO: Move them to the csui-server-adaptors bundle.
  'csui/models/node.facets/server.adaptor.mixin',
  'csui/widgets/metadata/metadata.forms/server.adaptor.mixin',

  // User Avatar Color
  'csui/utils/user.avatar.color',
  'csui/utils/letter-avatar-random-color/letter-avatar-colors'
], {});

csui.require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-view-support', true);
});

