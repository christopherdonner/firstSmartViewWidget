/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

(function() {
    function a(a, b ,c) {
	 if (c)
		 {
            a.config.save.onFailure(a, c.status, c);
            return true;
		 }
         else
         {
    	    !CKEDITOR.dialog.getCurrent() && a.showNotification && a.plugins.notification ? a.showNotification(b.replace(/\r\n/, "\x3cbr\x3e"), "warning") : alert(b);
         }      
    }
    function g(a) {
        a = a.data;
        if (/\.bmp$/.test(a.name)) {
            var b = a.image
                , c = document.createElement("canvas");
            c.width = b.width;
            c.height = b.height;
            c.getContext("2d").drawImage(b, 0, 0);
            a.file = c.toDataURL("image/png");
            a.name = a.name.replace(/\.bmp$/, ".png")
        }
    }
    function c(b) {
        var c = b.editor
            , d = c.config.custcsuiimage_maximumDimensions
            , e = b.data.image;
        d.width && e.width > d.width ? (a(c, c.lang.custcsuiimage.imageTooWide),
            b.cancel()) : d.height && e.height > d.height && (a(c, c.lang.custcsuiimage.imageTooTall),
            b.cancel())
    }
    function e(a) {
        var b = "span.custcsuiimageTmpWrapper\x3espan { top: 50%; margin-top: -0.5em; width: 100%; text-align: center; color: #fff; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 50px; font-family: Calibri,Arial,Sans-serif; pointer-events: none; position: absolute; display: inline-block;}";
        a.custcsuiimage_hideImageProgress && (b = "span.custcsuiimageTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}");
        return ".custcsuiimageOverEditor { " + (a.custcsuiimage_editorover || "box-shadow: 0 0 10px 1px #999999 inset !important;") + " }a.custcsuiimageTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}.custcsuiimageTmpWrapper { display: inline-block; position: relative; pointer-events: none;}" + b + ".uploadRect {display: inline-block;height: 0.9em;vertical-align: middle;width: 20px;}.uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;}.custcsuiimageTmpWrapper .uploadCancel { background-color: #333333;border-radius: 0.5em;color: #FFFFFF;cursor: pointer !important;display: inline-block;height: 1em;line-height: 0.8em;margin-left: 4px;padding-left: 0.18em;pointer-events: auto;position: relative; text-decoration:none; top: -2px;width: 0.7em;}.custcsuiimageTmpWrapper span .uploadCancel { width:1em; padding-left:0}"
    }
    function f(a, b, c, d) {
        var wikiBody;
        H = !b;
        C = a;
        E || (E = document.createElement("input"),
            E.type = "file",
            E.style.overflow = "hidden",
            E.style.width = "0px",
            E.style.height = "0px",
            E.style.opacity = .1,
           /* E.multiple = "multiple",*/
            E.position = "absolute",
            E.zIndex = 1E3,
            wikiBody = document.querySelector(".cs-wiki-body"),
            (wikiBody && wikiBody.appendChild(E)) || document.body.appendChild(E),
            E.addEventListener("change", function() {
                var a = E.files.length;
                if (a) {
                    C.fire("saveSnapshot");
                    for (var b = 0; b < a; b++) {
                        var c = E.files[b]
                            , d = CKEDITOR.tools.extend({}, E.custcsuiimageData);
                        d.file = c;
                        d.name = c.name;
                        d.originalName = d.name;
                        d.id = CKEDITOR.plugins.custcsuiimage.getTimeStampId();
                        d.forceLink = H;
                        d.mode = {
                            type: "selectedFile",
                            i: b,
                            count: a
                        };
                        CKEDITOR.plugins.custcsuiimage.insertSelectedFile(C, d)
                    }
                }
            }));
        E.accept = b ? "image/*" : "";
        E.value = "";
        E.custcsuiimageData = {
            context: c,
            callback: d,
            requiresImage: b
        };
        if (CKEDITOR.env.webkit) {
            var e = a.focusManager;
            e && e.lock && (e.lock(),
                setTimeout(function() {
                    e.unlock()
                }, 500))
        }
        E.click()
    }
    function l(a, b, c) {
        c = c ? a.config.addimage.url() : a.config.addimage.url();
        return c;
        //return "base64" == c ? c : m(c, {
        //    CKEditor: a.name,
        //    CKEditorFuncNum: b,
        //    langCode: a.langCode
        //})
    }
    function m(a, b) {
        var c = [];
        if (!b || !a)
            return a;
        for (var d in b)
            c.push(d + "\x3d" + encodeURIComponent(b[d]));
        return a + (-1 != a.indexOf("?") ? "\x26" : "?") + c.join("\x26")
    }
    function k(a) {
        return (a = a.data.$.dataTransfer) && a.types ? a.types.contains && a.types.contains("Files") && !a.types.contains("text/html") || a.types.indexOf && -1 != a.types.indexOf("Files") ? !0 : !1 : !1
    }
    // Adds suffix before extension (if exist)
    function addSuffixToName(name) {
        var suffix   = new Date().getTime(),
            dotIndex = name.lastIndexOf(".");
        if (dotIndex == -1) {
            // No extension
            return name + '_' + suffix;
        }
        return name.substring(0, dotIndex) + '_'  + suffix + name.substring(dotIndex);
    }
	function b64toBlob(dataURI, callback) {
		
		var byteString = atob(dataURI.split(',')[1]);

		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var bb = new Blob([ab]);
		return bb;
   }

    function b(a, b, c, d, e) {
        var url = a;
        if ("span" == d.$.nodeName.toLowerCase()) {
            var f = new CKEDITOR.dom.element("img",c.document);
            if (b.originalNode) {
                e = b.originalNode;
                for (var g = 0; g < e.attributes.length; g++) {
                    var k = e.attributes[g];
                    k.specified && "src" != k.name && "width" != k.name && "height" != k.name && f.setAttribute(k.name, k.value)
                }
                f.$.style.width = "";
                f.$.style.height = ""
            }
            f.on("load", function(a) {
                a.removeListener();
                f.removeListener("error", h);
                n(f, c, d, b.name, url);
            });
            f.on("error", function(a) {
                f.replace(d);
            }, null , {
                editor: c,
                element: d
            });
            f.data("cke-saved-src", a);
            f.setAttribute("src", a);
            f.setAttribute("alt", "undefined" == typeof b.originalName ? b.name: b.originalName);
            d.data("cke-real-element-type", "img");
            d.data("cke-realelement", encodeURIComponent(f.getOuterHtml()));
            d.data("cke-real-node-type", CKEDITOR.NODE_ELEMENT);
            /\.svg$/.test(b.name) && (f.removeAllListeners(),
                f.replace(d),
                c.fire("custcsuiimage.finishedUpload", {
                    name: name,
                    element: f
                }),
                c.fire("updateSnapshot"))
        } else
            b.originalNode ? (g = b.originalNode.cloneNode(!0),
                d.$.parentNode.replaceChild(g, d.$),
                d = new CKEDITOR.dom.element(g)) : (d.removeAttribute("id"),
                d.removeAttribute("class"),
                d.removeAttribute("contentEditable"),
                d.setHtml(d.getFirst().getHtml())),
                d.data("cke-saved-" + e, a),
                d.setAttribute(e, a),
                c.fire("custcsuiimage.finishedUpload", {
                    name: b.name,
                    element: d
                })
    }
    function d(a) {
        var b = document.createElement("div");
        b.textContent = a;
        return b.innerHTML
    }
    function h(b) {
        var c = b.listenerData
            , d = c.editor
            , c = c.element;
        b.removeListener();
        a(d, d.lang.custcsuiimage.badUrl + ': "' + b.sender.data("cke-saved-src") + '"');
        c.remove()
    }
    function n(a, b, c, d,f) {
        0 === a.$.naturalWidth ? window.setTimeout(function() {
            n(a, b, c, d,f)
        }, 50) : (a.replace(c),
            a.setAttribute("width", a.$.naturalWidth),
            a.setAttribute("height", a.$.naturalHeight),
            b.fire("custcsuiimage.finishedUpload", {
                name: d,
                element: a
            }),
            b.fire("updateSnapshot")),
            b.fire('doubleclick', {
                name: d,
                element: a
            })
    }
    function r(c, d) {
        var e = CKEDITOR.plugins.custcsuiimage.isImageExtension(c, d.name)
            , f = "href"
            , g = !1;
        !d.forceLink && e && (f = "src",
            g = !0);
        d.callback && d.callback.setup(d);
        d.url || (d.url = l(c, 2, g));
        if (d.requiresImage && !e)
            return a(c, c.lang.custcsuiimage.nonImageExtension),
                null ;
        if ("boolean" == typeof c.fire("custcsuiimage.startUpload", d) || !d.url)
            return null ;
        if ("base64" == d.url) {
            if ("string" == typeof d.file)
                return setTimeout(function() {
                    var a = d.file
                        , e = c.document.getById(d.id);
                    b(a, d, c, e, f)
                }, 100),
                {};
            var h = new FileReader;
            h.onload = function() {
                setTimeout(function() {
                    var a = h.result
                        , e = c.document.getById(d.id);
                    b(a, d, c, e, f)
                }, 100)
            }
            ;
            h.readAsDataURL(d.file);
            return {}
        }
        var k = new XMLHttpRequest;
        if (e = k.upload)
            e.onprogress = function(a) {
                z(c, d.id, a)
            }
            ;
        d.xhr = k;
        k.open("POST", c.config.addimage.url());
        k.onload = function() {
            var e = d.id, g = c.document.getById(e), h, l;
            z(c, e, null );
            c.fire("updateSnapshot");
            e = {
                xhr: k,
                data: d,
                element: g
            };
            if ("boolean" != typeof c.fire("custcsuiimage.serverResponse", e)) {
                if ("undefined" == typeof e.url) {
                    try {
                        var m = JSON.parse(k.responseText);

                        h = c.config.image.url+"?func=doc.fetch&nodeId="+m.id+"&viewType=1";
                        //m && m.url && (h = m.url);
                        //m && m.error && m.error.message && (l = m.error.message)
                    } catch (n) {}
                    if (!h && !l) {
                        h = (m = k.responseText.match(/\((?:"|')?\d+(?:"|')?,\s*("|')(.*?[^\\]?)\1(?:,\s*(.*?))?\s*\)\s*;?/)) && m[2];
                        l = m && m[3];
                        if (h) {
                            h = h.replace(/\\'/g, "'");
                            try {
                                var u = JSON.parse('{"url":"' + h + '"}');
                                u && u.url && (h = u.url)
                            } catch (p) {}
                        }
                        if (l)
                            if (u = l.match(/function\(\)\s*\{(.*)\}/))
                                l = new Function(u[1]);
                            else if (u = l.substring(0, 1),
                                "'" == u || '"' == u)
                                l = l.substring(1, l.length - 1);
                        m || (l = "Error posting the file to " + d.url + "\r\nInvalid data returned (check console)",
                        window.console && console.log(k.responseText))
                    }
                } else
                    h = e.url,
                        l = "";
                c.fire("custcsuiimage.endUpload", {
                    name: d.name,
                    ok: !!h,
                    xhr: k,
                    data: d
                });

                var t = false;
                200 != k.status && (413 == k.status ? a(c, c.lang.custcsuiimage.fileTooBig) : (u = c.lang.custcsuiimage["httpStatus" + k.status],
                u || (u = c.lang.custcsuiimage.errorPostFile,
                    u += " " + k.status),
                 t = a(c, u.replace("%0", d.url), k)),
                window.console && console.log(k));
                if(t)
                	return;
                d.callback ? (!h && l && a(c, l),
                    d.callback.upload(h, l, d)) : g && (h ? b(h, d, c, g, f) : (d.originalNode ? g.$.parentNode.replaceChild(d.originalNode, g.$) : g.remove(),
                l && a(c, l)),
                    c.fire("updateSnapshot"))
            }
        }
        ;
        k.onerror = function(b) {
            a(c, c.lang.custcsuiimage.xhrError.replace("%0", d.url));
            window.console && console.log(b);
            (b = c.document.getById(d.id)) && (d.originalNode ? b.$.parentNode.replaceChild(d.originalNode, b.$) : b.remove());
            c.fire("updateSnapshot")
        }
        ;
        k.onabort = function() {
            if (d.callback)
                d.callback.upload(null , null , d);
            else {
                var a = c.document.getById(d.id);
                a && (d.originalNode ? a.$.parentNode.replaceChild(d.originalNode, a.$) : a.remove());
                c.fire("updateSnapshot")
            }
        }
        ;
        k.withCredentials = !0;
        return k
    }
    function v(a, b) {
        if (!b.callback) {
            var c = CKEDITOR.plugins.custcsuiimage.isImageExtension(a, b.name)
                , e = !a.config.custcsuiimage_hideImageProgress;
            !b.forceLink && c && e ? c = t(b.file, b.id, a) : (c = c && !b.forceLink ? new CKEDITOR.dom.element("span",a.document) : new CKEDITOR.dom.element("a",a.document),
                c.setAttribute("id", b.id),
                c.setAttribute("class", "custcsuiimageTmpWrapper"),
                e = '\x3cspan class\x3d"uploadName"\x3e' + d(b.name) + '\x3c/span\x3e \x3cspan class\x3d"uploadRect"\x3e\x3cspan id\x3d"rect' + b.id + '"\x3e\x3c/span\x3e\x3c/span\x3e \x3cspan id\x3d"text' + b.id + '" class\x3d"uploadText"\x3e \x3c/span\x3e\x3cspan class\x3d"uploadCancel"\x3ex\x3c/span\x3e',
                c.setHtml(e));
            c.setAttribute("contentEditable", !1);
            b.element = c
        }
        c = r(a, b);
        if (!c)
            return b.result = b.result || "",
                !1;
        if (!c.send)
            return !0;
        b.callback && b.callback.start && b.callback.start(b);
        e = b.inputName || a.config.custcsuiimage_inputname || "upload";
        e = "file";
		var contentType = 'image/png';
		
        if(CKEDITOR.env.ie && "string" == typeof b.file)
			b.file = b64toBlob(b.file,contentType);
		else if("undefined" != typeof b.name)
			b.name = addSuffixToName(b.name);
        h = new FormData;
        h.append(e, b.file, b.name);
        h.append("type",a.config.addimage.documentType);
        h.append("parent_id",a.config.addimage.parent_id);
        h.append("name",b.name);
        c.setRequestHeader("OTCSTicket",a.config.addimage.ticket);
        c.send(h);
        return !0
    }
    function z(a, b, c) {
        if (a.document && a.document.$) {
            var d = (CKEDITOR.dialog.getCurrent() ? CKEDITOR : a).document.$
                , e = d.getElementById("rect" + b);
            b = d.getElementById("text" + b);
            if (c) {
                if (!c.lengthComputable)
                    return;
                d = (100 * c.loaded / c.total).toFixed(2) + "%";
                a = (100 * c.loaded / c.total).toFixed() + "%"
            } else
                a = a.lang.custcsuiimage.processing,
                    d = "100%";
            e && (e.setAttribute("width", d),
                e.style.width = d,
            c || (e = e.parentNode) && "uploadRect" == e.className && e.parentNode.removeChild(e));
            b && (b.firstChild.nodeValue = a,
            c || (c = b.nextSibling) && "a" == c.nodeName.toLowerCase() && c.parentNode.removeChild(c))
        }
    }
    function t(a, b, c) {
        var d = new CKEDITOR.dom.element("span",c.document), e = d.$, f, g = c.document.$;
        c = g.createElement("span");
        d.setAttribute("id", b);
        d.setAttribute("class", "custcsuiimageTmpWrapper");
        var h = g.createElement("span");
        h.setAttribute("id", "text" + b);
        h.appendChild(g.createTextNode("0 %"));
        e.appendChild(c);
        c.appendChild(h);
        h = g.createElement("span");
        h.appendChild(g.createTextNode("x"));
        c.appendChild(h);
        if ("string" != typeof a) {
            if (!J || !J.revokeObjectURL)
                return d;
            f = !0
        }
        c = g.createElementNS("http://www.w3.org/2000/svg", "svg");
        c.setAttribute("id", "svg" + b);
        h = g.createElement("img");
        f ? (h.onload = function() {
            this.onload && (J.revokeObjectURL(this.src),
                this.onload = null );
            var a = g.getElementById("svg" + b);
            a && (a.setAttribute("width", this.width + "px"),
                a.setAttribute("height", this.height + "px"));
            if (a = g.getElementById(b))
                a.style.width = this.width + "px"
        }
            ,
            h.src = J.createObjectURL(a)) : (h.src = a,
            h.onload = function() {
                this.onload = null ;
                var a = g.getElementById("svg" + b);
                a && (a.setAttribute("width", this.width + "px"),
                    a.setAttribute("height", this.height + "px"))
            }
            ,
            c.setAttribute("width", h.width + "px"),
            c.setAttribute("height", h.height + "px"));
        e.appendChild(c);
        e = g.createElementNS("http://www.w3.org/2000/svg", "filter");
        e.setAttribute("id", "SVGdesaturate");
        c.appendChild(e);
        h = g.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        h.setAttribute("type", "saturate");
        h.setAttribute("values", "0");
        e.appendChild(h);
        e = g.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        e.setAttribute("id", "SVGprogress" + b);
        c.appendChild(e);
        h = g.createElementNS("http://www.w3.org/2000/svg", "rect");
        h.setAttribute("id", "rect" + b);
        h.setAttribute("width", "0");
        h.setAttribute("height", "100%");
        e.appendChild(h);
        var k = g.createElementNS("http://www.w3.org/2000/svg", "image");
        k.setAttribute("width", "100%");
        k.setAttribute("height", "100%");
        if (f) {
            k.setAttributeNS("http://www.w3.org/1999/xlink", "href", J.createObjectURL(a));
            var l = function() {
                J.revokeObjectURL(k.getAttributeNS("http://www.w3.org/1999/xlink", "href"));
                k.removeEventListener("load", l, !1)
            };
            k.addEventListener("load", l, !1)
        } else
            k.setAttributeNS("http://www.w3.org/1999/xlink", "href", a);
        a = k.cloneNode(!0);
        k.setAttribute("filter", "url(#SVGdesaturate)");
        k.style.opacity = "0.5";
        c.appendChild(k);
        a.setAttribute("clip-path", "url(#SVGprogress" + b + ")");
        c.appendChild(a);
        return d
    }
    function p(a, b, c, e) {
        if ("file" != e.type) {
            var g = e.filebrowser
                , h = "custimage" == b.substr(0, 9) || g.requiresImage
                , k = g.target && g.target.split(":")
                , l = {
                targetField: k,
                multiple: g.multiple,
                setup: function(b) {
                    c.uploadUrl && (h && (b.requiresImage = !0),
                        b.url = m(c.uploadUrl, {
                            CKEditor: a.name,
                            CKEditorFuncNum: 2,
                            langCode: a.langCode
                        }))
                },
                start: function(a) {
                    var b = CKEDITOR.dialog.getCurrent()
                        , c = a.throbber = b.showThrobber();
                    if (a.xhr) {
                        var e = '\x3cspan class\x3d"uploadName"\x3e' + d(a.name) + '\x3c/span\x3e \x3cspan class\x3d"uploadRect"\x3e\x3cspan id\x3d"rect' + a.id + '"\x3e\x3c/span\x3e\x3c/span\x3e \x3cspan id\x3d"text' + a.id + '" class\x3d"uploadText"\x3e \x3c/span\x3e\x3ca\x3ex\x3c/a\x3e';
                        c.throbberTitle.setHtml(e);
                        var f = a.xhr;
                        c.timer && (clearInterval(c.timer),
                            c.timer = null );
                        c.throbberParent.setStyle("display", "none");
                        c.throbberTitle.getLast().on("click", function() {
                            f.abort()
                        });
                        b.on("hide", function() {
                            1 == f.readyState && f.abort()
                        })
                    }
                    c.center()
                },
                upload: function(a, b, c) {
                    var d = CKEDITOR.dialog.getCurrent();
                    var str = d.getContentElement(k[0], "imagename").html;
                    var re = new RegExp('<div id="(.*?)"><\/div>', 'g');
                    var myArray = re.exec(str);
                    var element = CKEDITOR.document.getById(myArray[1]);
                    if (element) {
                        element.setHtml('<div role="presentation" id="cke_611_uiElement" class="cke_dialog_ui_text" style="margin-left: 30px;"><label class="cke_dialog_ui_labeled_label" id="cke_610_label" for="cke_609_textInput">Image</label><div class="cke_dialog_ui_labeled_content" role="presentation"><div class="imageNameContent" title="'+c.originalName+'"  role="presentation">'+c.originalName+'</div></div></div>');
                    }
                    c.throbber.hide();
                    "function" == typeof b && !1 === b.call(c.context.sender) || g.onSelect && !1 === g.onSelect(a, b, c) || !a || (d.getContentElement(k[0], k[1]).setValue(a),
                        d.getContentElement(k[0], "txtAlt").setValue(c.originalName),

                        d.selectPage(k[0]))
                }
            };
            if ("QuickUpload" == g.action)
                c.hasQuickUpload = !0,
                    c.onFileSelect = null ,
                a.config.custcsuiimage_respectDialogUploads || (e.label = h ? a.lang.custcsuiimage.addImageDialog : a.lang.custcsuiimage.addFile,
                    e.onClick = function(b) {
                        f(a, h, b, l);
                        return !1
                    }
                    ,
                    c.getContents(e["for"][0]).get(e["for"][1]).hidden = !0);
            else {
                if (c.hasQuickUpload)
                    return;
                g.onSelect && (c.onFileSelect = g.onSelect)
            }
            a.plugins.fileDropHandler && ("QuickUpload" == g.action && (c.uploadUrl = g.url),
                c.onShow = CKEDITOR.tools.override(c.onShow || function() {}
                    , function(a) {
                        return function(b) {
                            c.onShow = a;
                            "function" == typeof a && a.call(this, b);
                            "QuickUpload" != g.action && c.hasQuickUpload || this.handleFileDrop || (this.handleFileDrop = !0,
                                this.getParentEditor().plugins.fileDropHandler.addTarget(this.parts.contents, l))
                        }
                    }))
        }
    }
    function x(a, b, c, d) {
        for (var e in d) {
            var f = d[e];
            f && ("hbox" != f.type && "vbox" != f.type && "fieldset" != f.type || x(a, b, c, f.children),
            f.filebrowser && f.filebrowser.url && p(a, b, c, f))
        }
    }
    function y(a, b) {
        var c = a.document.getById(b.id);
        if (c) {
            var d = c.$.getElementsByTagName("a");
            if (!d || !d.length)
                if (d = c.$.getElementsByTagName("span"),
                    !d || !d.length)
                    return;
            for (c = 0; c < d.length; c++) {
                var e = d[c];
                "x" == e.innerHTML && (e.className = "uploadCancel",
                        e.onclick = function() {
                            b.xhr && b.xhr.abort()
                        }
                )
            }
        }
    }
    function A(a) {
        var b = a.listenerData.editor, c = a.listenerData.dialog, d, e;
        if (d = a.data && a.data.$.clipboardData || b.config.forcePasteAsPlainText && window.clipboardData)
            if (CKEDITOR.env.gecko && b.config.forcePasteAsPlainText && 0 === d.types.length)
                b.on("beforePaste", function(a) {
                    a.removeListener();
                    a.data.type = "html"
                });
            else {
                var f = d.items || d.files;
                if (f && f.length) {
                    if (f[0].kind)
                        for (d = 0; d < f.length; d++)
                            if (e = f[d],
                                "string" == e.kind && ("text/html" == e.type || "text/plain" == e.type))
                                return;
                    for (d = 0; d < f.length; d++)
                        if (e = f[d],
                            !e.kind || "file" == e.kind) {
                            a.data.preventDefault();
                            var g = e.getAsFile ? e.getAsFile() : e;
                            CKEDITOR.env.ie || b.config.forcePasteAsPlainText ? setTimeout(function() {
                                q(g, a)
                            }, 100) : q(g, a)
                        }
                    c && a.data.$.defaultPrevented && c.hide()
                }
            }
    }
    function q(a, b) {
        var c = b.listenerData.editor
            , d = b.listenerData.dialog
            , e = CKEDITOR.plugins.custcsuiimage.getTimeStampId();
        CKEDITOR.plugins.custcsuiimage.insertPastedFile(c, {
            context: b.data.$,
            name: a.name || e + ".png",
            file: a,
            forceLink: !1,
            id: e,
            mode: {
                type: "pastedFile",
                dialog: d
            }
        })
    }
    function w(a) {
        var b = a.getFrameDocument()
            , c = b.getBody();
        !c || !c.$ || "true" != c.$.contentEditable && "on" != b.$.designMode ? setTimeout(function() {
            w(a)
        }, 100) : (c = CKEDITOR.dialog.getCurrent(),
            b.on("paste", A, null , {
                dialog: c,
                editor: c.getParentEditor()
            }))
    }
    var B = {
        elements: {
            $: function(a) {
                a = a.attributes;
                if ("custcsuiimageTmpWrapper" == (a && a["class"]))
                    return !1
            }
        }
    }, E, C, H, J = window.URL || window.webkitURL;

    CKEDITOR.plugins.add("custcsuiimage", {
        requires: ["filebrowser"],
        lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',
        icons : 'addImage',
        onLoad: function() {
            CKEDITOR.addCss(e(CKEDITOR.config));
            var a = CKEDITOR.document.getHead().append("style");
            a.setAttribute("type", "text/css");
            var b = ".custcsuiimageOverContainer {" + (CKEDITOR.config.custcsuiimage_containerover || "box-shadow: 0 0 10px 1px #99DD99 !important;") + "} .custcsuiimageOverDialog {" + (CKEDITOR.config.custcsuiimage_dialogover || "box-shadow: 0 0 10px 4px #999999 inset !important;") + "} .custcsuiimageOverCover {" + (CKEDITOR.config.custcsuiimage_coverover || "box-shadow: 0 0 10px 4px #99DD99 !important;") + "} "
                , b = b + ".cke_throbber {margin: 0 auto; width: 100px;} .cke_throbber div {float: left; width: 8px; height: 9px; margin-left: 2px; margin-right: 2px; font-size: 1px;} .cke_throbber .cke_throbber_1 {background-color: #737357;} .cke_throbber .cke_throbber_2 {background-color: #8f8f73;} .cke_throbber .cke_throbber_3 {background-color: #abab8f;} .cke_throbber .cke_throbber_4 {background-color: #c7c7ab;} .cke_throbber .cke_throbber_5 {background-color: #e3e3c7;} .uploadRect {display: inline-block;height: 11px;vertical-align: middle;width: 50px;} .uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;} .uploadName {display: inline-block;max-width: 180px;overflow: hidden;text-overflow: ellipsis;vertical-align: top;white-space: pre;} .uploadText {font-size:80%;} .cke_throbberMain a {cursor: pointer; font-size: 14px; font-weight:bold; padding: 4px 5px;position: absolute;right:0; text-decoration:none; top: -2px;} .cke_throbberMain {background-color: #FFF; border:1px solid #e5e5e5; padding:4px 14px 4px 4px; min-width:250px; position:absolute;}";
            CKEDITOR.env.ie && 11 > CKEDITOR.env.version ? a.$.styleSheet.cssText = b : a.$.innerHTML = b
        },
        init: function(b) {
            var d = b.config;
            if ("undefined" != typeof FormData)
                if (("undefined" == typeof d.custcsuiimage_imageExtensions && (d.custcsuiimage_imageExtensions = "jpe?g|gif|png") && d.addimage.url()) ||
                     !b.config.addimage.imageBrowseEnabled())
                    window.console && console.log && (console.log('The editor is missing the required permission hence disabling image plugin'),
                        console[console.warn ? "warn" : "log"]('The "custcsuiimage" plugin now is disabled.'));
                else if ("base64" != d.addimage.url() || "undefined" != typeof FormData) {
                    b.addFeature({
                        allowedContent: "img[!src,width,height];a[!href];span[id](custcsuiimageTmpWrapper);"
                    });
                    CKEDITOR.dialog.prototype.showThrobber = function() {
                        this.throbbers || (this.throbbers = []);
                        var a = {
                            update: function() {
                                for (var a = this.throbberParent.$, b = a.childNodes, a = a.lastChild.className, c = b.length - 1; 0 < c; c--)
                                    b[c].className = b[c - 1].className;
                                b[0].className = a
                            },
                            create: function(a) {
                                var b = a.throbberCover;
                                b || (b = CKEDITOR.dom.element.createFromHtml('\x3cdiv style\x3d"background-color:rgba(255,255,255,0.95);width:100%;height:100%;top:0;left:0; position:absolute; visibility:none;z-index:100;"\x3e\x3c/div\x3e'),
                                    a.parts.close.setStyle("z-index", 101),
                                    b.appendTo(a.parts.dialog),
                                    a.throbberCover = b);
                                this.dialog = a;
                                var c = new CKEDITOR.dom.element("div");
                                this.mainThrobber = c;
                                var d = new CKEDITOR.dom.element("div");
                                this.throbberParent = d;
                                var e = new CKEDITOR.dom.element("div");
                                this.throbberTitle = e;
                                b.append(c).addClass("cke_throbberMain");
                                c.append(e).addClass("cke_throbberTitle");
                                c.append(d).addClass("cke_throbber");
                                for (b = [1, 2, 3, 4, 5, 4, 3, 2]; 0 < b.length; )
                                    d.append(new CKEDITOR.dom.element("div")).addClass("cke_throbber_" + b.shift());
                                this.center();
                                a.on("hide", this.hide, this)
                            },
                            center: function() {
                                var a = this.mainThrobber;
                                a.setStyle("left", ((this.dialog.throbberCover.$.offsetWidth - a.$.offsetWidth) / 2).toFixed() + "px");
                                this.centerVertical(this.dialog)
                            },
                            centerVertical: function(a) {
                                var b = a.throbberCover;
                                a = a.throbbers;
                                var c = 0, d;
                                for (d = 0; d < a.length; d++)
                                    c += a[d].mainThrobber.$.offsetHeight;
                                b = (b.$.offsetHeight - c) / 2;
                                for (d = 0; d < a.length; d++)
                                    a[d].mainThrobber.setStyle("top", b.toFixed() + "px"),
                                        b += a[d].mainThrobber.$.offsetHeight
                            },
                            show: function() {
                                this.create(CKEDITOR.dialog.getCurrent());
                                this.dialog.throbberCover.setStyle("visibility", "");
                                this.timer = setInterval(CKEDITOR.tools.bind(this.update, this), 100)
                            },
                            hide: function() {
                                this.timer && (clearInterval(this.timer),
                                    this.timer = null );
                                var a = this.dialog;
                                if (a) {
                                    this.dialog = null ;
                                    this.mainThrobber.remove();
                                    for (var b = 0; b < a.throbbers.length; b++)
                                        if (a.throbbers[b] == this) {
                                            a.throbbers.splice(b, 1);
                                            break
                                        }
                                    a.throbberCover && (0 < a.throbbers.length ? this.centerVertical(a) : a.throbberCover.setStyle("visibility", "hidden"))
                                }
                            }
                        };
                        this.throbbers.push(a);
                        a.show();
                        return a
                    }
                    ;
                    b.on("custcsuiimage.startUpload", function(b) {
                        var c = b.editor
                            , d = c.config
                            , e = b.data && b.data.file;
                        d.custcsuiimage_maxFileSize && e && e.size && e.size > d.custcsuiimage_maxFileSize ? (a(c, c.lang.custcsuiimage.fileTooBig),
                            b.cancel()) : (e = b.data.name,
                            d.custcsuiimage_invalidExtensions && (new RegExp(".(?:" + d.custcsuiimage_invalidExtensions + ")$","i")).test(e) ? (a(c, c.lang.custcsuiimage.invalidExtension),
                                b.cancel()) : d.custcsuiimage_acceptedExtensions && !(new RegExp(".(?:" + d.custcsuiimage_acceptedExtensions + ")$","i")).test(e) ? (d = c.lang.custcsuiimage.nonAcceptedExtension.replace("%0", d.custcsuiimage_acceptedExtensions),
                                a(c, d),
                                b.cancel()) : CKEDITOR.tools.getCsrfToken && (c = b.data.extraFields || {},
                                c.ckCsrfToken = CKEDITOR.tools.getCsrfToken(),
                                b.data.extraFields = c))
                    });
                    b.on("custcsuiimage.startUpload", function(a) {
                        var b = a.data
                            , c = a.editor;
                        if (!b.image && !b.forceLink && CKEDITOR.plugins.custcsuiimage.isImageExtension(c, b.name) && b.mode && b.mode.type && c.hasListeners("custcsuiimage.localImageReady")) {
                            a.cancel();
                            "base64paste" == b.mode.type && (a = CKEDITOR.plugins.custcsuiimage.getTimeStampId(),
                                b.result = '\x3cspan id\x3d"' + a + '" class\x3d"custcsuiimageTmpWrapper" style\x3d"display:none"\x3e\x26nbsp;\x3c/span\x3e',
                                b.mode.id = a);
                            var d = new Image;
                            d.onload = function() {
                                var a = CKEDITOR.tools.extend({}, b);
                                a.image = d;
                                "boolean" != typeof c.fire("custcsuiimage.localImageReady", a) && CKEDITOR.plugins.custcsuiimage.insertProcessedFile(c, a)
                            }
                            ;
                            d.src = "string" == typeof b.file ? b.file : J.createObjectURL(b.file)
                        }
                    });
                    if (d.custcsuiimage_convertBmp)
                        b.on("custcsuiimage.localImageReady", g);
                    if (d.custcsuiimage_maximumDimensions)
                        b.on("custcsuiimage.localImageReady", c);
                    b.on("custcsuiimage.finishedUpload", function(a) {
                        b.getSelection().selectElement(a.data.element);
                        if (b.widgets && b.plugins.image2 && (a = a.data.element,
                            "img" == a.getName())) {
                            var c = b.widgets.getByElement(a);
                            c ? (c.data.src = a.data("cke-saved-src"),
                                c.data.width = a.$.width,
                                c.data.height = a.$.height) : b.widgets.initOn(a, "custimage")
                        }
                    });

                    b.on("paste", function(c) {
                        var d = c.data;
                        if (d = d.html || d.type && "html" == d.type && d.dataValue)
                            CKEDITOR.env.webkit && 0 < d.indexOf("webkit-fake-url") && (a(b, b.lang.custcsuiimage.uselessSafari),
                                window.open("https://bugs.webkit.org/show_bug.cgi?id\x3d49141"),
                                d = d.replace(/<img src="webkit-fake-url:.*?">/g, "")),
                                d = d.replace(/<img(.*?) src="data:image\/.{3,4};base64,.*?"(.*?)>/g, function(a) {
                                    if (!b.config.addimage.url())
                                        return "";
                                    var c = a.match(/"(data:image\/(.{3,4});base64,.*?)"/)
                                        , d = c[1]
                                        , c = c[2].toLowerCase()
                                        , e = CKEDITOR.plugins.custcsuiimage.getTimeStampId();
                                    if (128 > d.length)
                                        return a;
                                    "jpeg" == c && (c = "jpg");
                                    var f = {
                                        context: "pastedimage",
                                        name: e + "." + c,
                                        id: e,
                                        forceLink: !1,
                                        file: d,
                                        mode: {
                                            type: "base64paste"
                                        }
                                    };
                                    if (!v(b, f))
                                        return f.result;
                                    a = f.element;
                                    var g = a.$.innerHTML;
                                    a.$.innerHTML = "\x26nbsp;";
                                    b.on("afterPaste", function(a) {
                                        a.removeListener();
                                        if (a = b.document.$.getElementById(e))
                                            a.innerHTML = g,
                                                y(b, f)
                                    });
                                    return a.getOuterHtml()
                                }),
                                c.data.html ? c.data.html = d : c.data.dataValue = d
                    });
                    var d = function(a) {
                        "wysiwyg" == b.mode && b.editable().$.querySelector(".custcsuiimageTmpWrapper") && (a = a.name.substr(5).toLowerCase(),
                        "redo" == a && b.getCommand(a).state == CKEDITOR.TRISTATE_DISABLED && (a = "undo"),
                            b.execCommand(a))
                    }
                        , e = b.getCommand("undo");
                    if (e)
                        e.on("afterUndo", d);
                    if (e = b.getCommand("redo"))
                        b.getCommand("redo").on("afterRedo", d);
                    b.on("afterUndo", d);
                    b.on("afterRedo", d);
                    b.addCommand("addImage", {
                        exec: function(a) {
                            f(a, !0, this)
                        }
                    });
                    b.ui.addButton("addImage", {
                        label: b.lang.custcsuiimage.addImage,
                        command: "addImage",
                        toolbar: "insert",
                        allowedContent: "img[!src,width,height];span[id](custcsuiimageTmpWrapper);",
                        requiredContent: "img[src]"

                    });
                    var h, l, m, n = -1, p, q, r, t = -1, w, x, z, B = function() {
                        var a = CKEDITOR.dialog.getCurrent();
                        a ? a.parts.title.getParent().removeClass("custcsuiimageOverCover") : b.container.removeClass("custcsuiimageOverContainer")
                    };
                    b.on("destroy", function() {
                        CKEDITOR.removeListener("custcsuiimage.droppedFile", B);
                        CKEDITOR.document.removeListener("dragenter", E);
                        CKEDITOR.document.removeListener("dragleave", H);
                        C()
                    });
                    var C = function() {
                        h && h.removeListener && (m.removeListener("paste", A),
                            h.removeListener("dragenter", S),
                            h.removeListener("dragleave", X),
                            h.removeListener("dragover", Y),
                            h.removeListener("drop", W),
                            l = h = m = null )
                    };
                    CKEDITOR.on("custcsuiimage.droppedFile", B);
                    var E = function(a) {
                        if (-1 == t && k(a)) {
                            if (a = CKEDITOR.dialog.getCurrent()) {
                                if (!a.handleFileDrop)
                                    return;
                                a.parts.title.getParent().addClass("custcsuiimageOverCover")
                            } else
                                b.readOnly || b.container.addClass("custcsuiimageOverContainer");
                            w = t = 0;
                            x = CKEDITOR.document.$.body.parentNode.clientWidth;
                            z = CKEDITOR.document.$.body.parentNode.clientHeight
                        }
                    }
                        , H = function(a) {
                        -1 != t && (a = a.data.$,
                        a.clientX <= t || a.clientY <= w || a.clientX >= x || a.clientY >= z) && (B(),
                            t = -1)
                    };
                    CKEDITOR.document.on("dragenter", E);
                    CKEDITOR.document.on("dragleave", H);
                    CKEDITOR.document.on("dragover", function(a) {
                        if (!b.config.custcsuiimage_allowDropOutside && k(a) && "copy" != a.data.$.dataTransfer.dropEffect)
                            return a.data.$.dataTransfer.dropEffect = "none",
                                a.data.preventDefault(),
                                !1
                    });
                    var W = function(a) {
                        l.removeClass("custcsuiimageOverEditor");
                        n = -1;
                        CKEDITOR.fire("custcsuiimage.droppedFile");
                        t = -1;
                        if (b.readOnly)
                            return a.data.preventDefault(),
                                !1;
                        var c = a.data.$
                            , d = c.dataTransfer;
                        if (d && d.files && 0 < d.files.length) {
                            b.fire("saveSnapshot");
                            a.data.preventDefault();
                            a = {
                                ev: c,
                                range: !1,
                                count: d.files.length,
                                rangeParent: c.rangeParent,
                                rangeOffset: c.rangeOffset
                            };
                            if (!a.rangeParent && !document.caretRangeFromPoint && "img" != c.target.nodeName.toLowerCase()) {
                                var e = b.document.$;
                                if (e.body.createTextRange) {
                                    e = e.body.createTextRange();
                                    try {
                                        e.moveToPoint(c.clientX, c.clientY),
                                            a.range = e
                                    } catch (f) {}
                                }
                            }
                            for (e = 0; e < d.files.length; e++) {
                                var g = d.files[e]
                                    , h = CKEDITOR.tools.getNextId();
                                CKEDITOR.plugins.custcsuiimage.insertDroppedFile(b, {
                                    context: c,
                                    name: g.name,
                                    file: g,
                                    forceLink: c.shiftKey,
                                    id: h,
                                    mode: {
                                        type: "droppedFile",
                                        dropLocation: a
                                    }
                                })
                            }
                        }
                    }
                        , S = function(a) {
                        -1 == n && k(a) && (b.readOnly || l.addClass("custcsuiimageOverEditor"),
                            a = l.$.getBoundingClientRect(),
                            n = a.left,
                            p = a.top,
                            q = n + l.$.clientWidth,
                            r = p + l.$.clientHeight)
                    }
                        , X = function(a) {
                        -1 != n && (a = a.data.$,
                        a.clientX <= n || a.clientY <= p || a.clientX >= q || a.clientY >= r) && (l.removeClass("custcsuiimageOverEditor"),
                            n = -1)
                    }
                        , Y = function(a) {
                        if (-1 != n) {
                            if (b.readOnly)
                                return a.data.$.dataTransfer.dropEffect = "none",
                                    a.data.preventDefault(),
                                    !1;
                            a.data.$.dataTransfer.dropEffect = "copy";
                            CKEDITOR.env.gecko || a.data.preventDefault()
                        }
                    };
                    b.on("contentDom", function() {
                        h = b.document;
                        l = h.getBody().getParent();
                        3 == b.elementMode && (l = h = b.editable());
                        1 == b.elementMode && "divarea"in b.plugins && (l = h = b.editable());
                        m = b.editable();
                        if (CKEDITOR.env.ie && 11 <= CKEDITOR.env.version && b.config.forcePasteAsPlainText && b.editable().isInline())
                            m.attachListener(m, "beforepaste", function() {
                                b.document.on("paste", function(a) {
                                    a.removeListener();
                                    A(a)
                                }, null , {
                                    editor: b
                                })
                            });
                        else
                            m.on("paste", A, null , {
                                editor: b
                            }, 8);
                        h.on("dragenter", S);
                        h.on("dragleave", X);
                        h.on("dragover", Y);
                        h.on("drop", W)
                    });
                    b.on("contentDomUnload", C);
                    b.plugins.fileDropHandler = {
                        addTarget: function(a, c) {
                            a.on("dragenter", function(b) {
                                -1 == n && k(b) && (a.addClass("custcsuiimageOverDialog"),
                                    b = a.$.getBoundingClientRect(),
                                    n = b.left,
                                    p = b.top,
                                    q = n + a.$.clientWidth,
                                    r = p + a.$.clientHeight)
                            });
                            a.on("dragleave", function(b) {
                                -1 != n && (b = b.data.$,
                                b.clientX <= n || b.clientY <= p || b.clientX >= q || b.clientY >= r) && (a.removeClass("custcsuiimageOverDialog"),
                                    n = -1)
                            });
                            a.on("dragover", function(a) {
                                -1 != n && (a.data.$.dataTransfer.dropEffect = "copy",
                                    a.data.preventDefault(!0))
                            });
                            a.on("drop", function(d) {
                                a.removeClass("custcsuiimageOverDialog");
                                n = -1;
                                CKEDITOR.fire("custcsuiimage.droppedFile");
                                t = -1;
                                var e = d.data.$
                                    , f = e.dataTransfer;
                                if (f && f.files && 0 < f.files.length) {
                                    d.data.preventDefault();
                                    d = 1;
                                    c.multiple && (d = f.files.length);
                                    for (var g = 0; g < d; g++) {
                                        var h = f.files[g]
                                            , h = {
                                            context: e,
                                            name: h.name,
                                            file: h,
                                            id: CKEDITOR.tools.getNextId(),
                                            forceLink: !1,
                                            callback: c,
                                            mode: {
                                                type: "callback"
                                            }
                                        };
                                        CKEDITOR.plugins.custcsuiimage.processFileWithCallback(b, h)
                                    }
                                }
                            })
                        }
                    }
                }
        },
        afterInit: function(a) {
            (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(B, {
                applyToAll: !0
            })
        }
    });
    "undefined" != typeof FormData && (CKEDITOR.plugins.custcsuiimage = {
        getTimeStampId: function() {
            var a = 0;
            return function() {
                a++;
                return (new Date).toISOString().replace(/\..*/, "").replace(/\D/g, "_") + a
            }
        }(),
        isImageExtension: function(a, b) {
            return a.config.custcsuiimage_imageExtensions ? (new RegExp(".(?:" + a.config.custcsuiimage_imageExtensions + ")$","i")).test(b) : !1
        },
        insertProcessedFile: function(b, c) {
            c.element = null ;
            c.id = this.getTimeStampId();
            var d = this;
            switch (c.mode.type) {
                case "selectedFile":
                    window.setTimeout(function() {
                        d.insertSelectedFile(b, c)
                    }, 50);
                    break;
                case "pastedFile":
                    this.insertPastedFile(b, c);
                    break;
                case "callback":
                    window.setTimeout(function() {
                        d.processFileWithCallback(b, c)
                    }, 50);
                    break;
                case "droppedFile":
                    this.insertDroppedFile(b, c);
                    break;
                default:
                    a(b, "Error, no valid type in callback " + c.mode)
            }
        },
        insertSelectedFile: function(a, b) {
            var c = b.mode
                , d = c.i
                , e = c.count;
            if (v(a, b) && (c = b.element)) {
                if (1 == e) {
                    var f = a.getSelection(), e = f.getSelectedElement(), g;
                    e && "img" == e.getName() && "span" == c.getName() && (g = e.$);
                    if (a.widgets) {
                        var h = a.widgets.focused;
                        h && h.wrapper.equals(e) && (g = e.$.querySelector("img"))
                    }
                    if ("a" == c.getName()) {
                        var h = e
                            , k = f.getRanges()
                            , f = k && k[0];
                        !h && k && 1 == k.length && (h = f.startContainer.$,
                        h.nodeType == document.TEXT_NODE && (h = h.parentNode));
                        for (; h && h.nodeType == document.ELEMENT_NODE && "a" != h.nodeName.toLowerCase(); )
                            h = h.parentNode;
                        h && h.nodeName && "a" == h.nodeName.toLowerCase() && (g = h);
                        g || !f || !e && f.collapsed || (g = new CKEDITOR.style({
                            element: "a",
                            attributes: {
                                href: "#"
                            }
                        }),
                            g.type = CKEDITOR.STYLE_INLINE,
                            g.applyToRange(f),
                            h = f.startContainer.$,
                        h.nodeType == document.TEXT_NODE && (h = h.parentNode),
                            g = h)
                    }
                    if (g) {
                        g.parentNode.replaceChild(c.$, g);
                        b.originalNode = g;
                        a.fire("saveSnapshot");
                        return
                    }
                }
                0 < d && "a" == c.getName() && a.insertHtml("\x26nbsp;");
                a.insertElement(c);
                y(a, b)
            }
        },
        insertPastedFile: function(a, b) {
            if (v(a, b)) {
                var c = b.element;
                if (b.mode.dialog)
                    a.fire("updateSnapshot"),
                        a.insertElement(c),
                        a.fire("updateSnapshot");
                else {
					a.insertElement(c);
                    var d = function() {
                        a.getSelection().getRanges().length ? a.editable().$.querySelector("#cke_pastebin") ? window.setTimeout(d, 0) : (a.fire("updateSnapshot"),
                            a.insertElement(c),
                            a.fire("updateSnapshot"),
                            y(a, b)) : window.setTimeout(d, 0)
                    };
                    window.setTimeout(d, 0)
                }
            }
        },
        processFileWithCallback: function(a, b) {
            v(a, b)
        },
        insertDroppedFile: function(a, b) {
            if (v(a, b)) {
                var c = b.element
                    , d = b.mode.dropLocation
                    , e = d.range
                    , f = d.ev
                    , g = d.count;
                e && "a" == c.getName() && (e.pasteHTML ? e.pasteHTML("\x26nbsp;") : e.insertNode(a.document.$.createTextNode(" ")));
                var h = f.target;
                if (!e) {
                    var k = a.document.$;
                    if (d.rangeParent) {
                        var f = d.rangeParent
                            , l = d.rangeOffset
                            , e = k.createRange();
                        e.setStart(f, l);
                        e.collapse(!0)
                    } else if (document.caretRangeFromPoint)
                        e = k.caretRangeFromPoint(f.clientX, f.clientY);
                    else if ("img" == h.nodeName.toLowerCase())
                        e = k.createRange(),
                            e.selectNode(h);
                    else if (document.body.createTextRange) {
                        l = k.body.createTextRange();
                        try {
                            l.moveToPoint(f.clientX, f.clientY),
                                e = l
                        } catch (m) {
                            e = k.createRange(),
                                e.setStartAfter(k.body.lastChild),
                                e.collapse(!0)
                        }
                    }
                    d.range = e
                }
                k = c.getName();
                d = !1;
                if (1 == g && ("img" == h.nodeName.toLowerCase() && "span" == k && (h.parentNode.replaceChild(c.$, h),
                        b.originalNode = h,
                        d = !0),
                    "a" == k)) {
                    e.startContainer ? (g = e.startContainer,
                        g.nodeType == document.TEXT_NODE ? g = g.parentNode : e.startOffset < g.childNodes.length && (g = g.childNodes[e.startOffset])) : g = e.parentElement();
                    g && "img" != h.nodeName.toLowerCase() || (g = h);
                    for (h = g; h && h.nodeType == document.ELEMENT_NODE && "a" != h.nodeName.toLowerCase(); )
                        h = h.parentNode;
                    h && h.nodeName && "a" == h.nodeName.toLowerCase() && (h.parentNode.replaceChild(c.$, h),
                        b.originalNode = h,
                        d = !0);
                    d || "img" != g.nodeName.toLowerCase() || (h = g.ownerDocument.createElement("a"),
                        h.href = "#",
                        g.parentNode.replaceChild(h, g),
                        h.appendChild(g),
                        h.parentNode.replaceChild(c.$, h),
                        b.originalNode = h,
                        d = !0)
                }
                d || (e ? e.pasteHTML ? e.pasteHTML(c.$.outerHTML) : e.insertNode(c.$) : a.insertElement(c));
                y(a, b);
                a.fire("saveSnapshot")
            }
        }
    },
        CKEDITOR.on("dialogDefinition", function(a) {
            if (a.editor.plugins.custcsuiimage) {
                var b = a.data.definition, c;
                for (c in b.contents) {
                    var d = b.contents[c];
                    d && x(a.editor, a.data.name, b, d.elements)
                }
                "paste" == a.data.name && (b.onShow = CKEDITOR.tools.override(b.onShow, function(a) {
                    return function() {
                        "function" == typeof a && a.call(this);
                        w(this.getContentElement("general", "editing_area").getInputElement())
                    }
                }))
            }
        }, null , null , 30))
})()