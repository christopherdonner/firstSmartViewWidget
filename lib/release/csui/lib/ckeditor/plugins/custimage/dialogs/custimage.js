/*
 Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
 */
(function () {
    var v = function (d, l) {
        function v() {
            var a = arguments, b = this.getContentElement("advanced", "txtdlgGenStyle");
            b && b.commit.apply(b, a);
            this.foreach(function (b) {
                b.commit && "txtdlgGenStyle" != b.id && b.commit.apply(b, a)
            })
        }

        function k(a) {
            if (!w) {
                w = 1;
                var b = this.getDialog(), c = b.imageElement;
                if (c) {
                    this.commit(1, c);
                    a = [].concat(a);
                    for (var d = a.length, f, g = 0; g < d; g++)(f = b.getContentElement.apply(b, a[g].split(":"))) && f.setup(1, c)
                }
                w = 0
            }
        }
        function getParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        var m = /^\s*(\d+)((px)|\%)?\s*$/i, z = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i, r = /^\d+px$/,
            A = function () {
                var a = this.getValue(), b = this.getDialog(), c = a.match(m);
                c && ("%" == c[2] && n(b, !1), a = c[1]);
                b.lockRatio && (c = b.originalElement, "true" == c.getCustomData("isReady") && ("txtHeight" == this.id ? (a && "0" != a && (a = Math.round(a / c.$.height * c.$.width)), isNaN(a) || b.setValueOf("info", "txtWidth", a)) : (a && "0" != a && (a = Math.round(a / c.$.width * c.$.height)), isNaN(a) || b.setValueOf("info", "txtHeight", a))));
                e(b)
            }, e = function (a) {
                if (!a.originalElement || !a.preview)return 1;
                a.commitContent(4, a.preview);
                return 0
            }, w, n = function (a,
                                b) {
                if (!a.getContentElement("info", "ratioLock"))return null;
                var c = a.originalElement;
                if (!c)return null;
                if ("check" == b) {
                    if (!a.userlockRatio && "true" == c.getCustomData("isReady")) {
                        var d = a.getValueOf("info", "txtWidth"), f = a.getValueOf("info", "txtHeight"), c = 1E3 * c.$.width / c.$.height, g = 1E3 * d / f;
                        a.lockRatio = !1;
                        d || f ? isNaN(c) || isNaN(g) || Math.round(c) != Math.round(g) || (a.lockRatio = !0) : a.lockRatio = !0
                    }
                } else void 0 !== b ? a.lockRatio = b : (a.userlockRatio = 1, a.lockRatio = !a.lockRatio);
                d = CKEDITOR.document.getById(t);
                a.lockRatio ?
                    d.removeClass("cke_btn_unlocked") : d.addClass("cke_btn_unlocked");
                d.setAttribute("aria-checked", a.lockRatio);
                CKEDITOR.env.hc && d.getChild(0).setHtml(a.lockRatio ? CKEDITOR.env.ie ? "■" : "▣" : CKEDITOR.env.ie ? "□" : "▢");
                return a.lockRatio
            }, B = function (a, b) {
                var c = a.originalElement;
                if ("true" == c.getCustomData("isReady")) {
                    var d = a.getContentElement("info", "txtWidth"), f = a.getContentElement("info", "txtHeight"), g;
                    b ? c = g = 0 : (g = c.$.width, c = c.$.height);
                    d && d.setValue(g);
                    f && f.setValue(c)
                }
                e(a)
            }, C = function (a, b) {
                function c(a, b) {
                    var c =
                        a.match(m);
                    return c ? ("%" == c[2] && (c[1] += "%", n(d, !1)), c[1]) : b
                }

                if (1 == a) {
                    var d = this.getDialog(), f = "", g = "txtWidth" == this.id ? "width" : "height", e = b.getAttribute(g);
                    e && (f = c(e, f));
                    f = c(b.getStyle(g), f);
                    this.setValue(f)
                }
            }, x, u = function () {
                var a = this.originalElement, b = CKEDITOR.document.getById(p);
                a.setCustomData("isReady", "true");
                a.removeListener("load", u);
                a.removeListener("error", h);
                a.removeListener("abort", h);
                b && b.setStyle("display", "none");
                this.dontResetSize || B(this, !1 === d.config.image_prefillDimensions);
                this.firstLoad &&
                CKEDITOR.tools.setTimeout(function () {
                    n(this, "check")
                }, 0, this);
                this.dontResetSize = this.firstLoad = !1;
                e(this)
            }, h = function () {
                var a = this.originalElement, b = CKEDITOR.document.getById(p);
                a.removeListener("load", u);
                a.removeListener("error", h);
                a.removeListener("abort", h);
                a = CKEDITOR.getUrl(CKEDITOR.plugins.get("custimage").path + "images/noimage.png");
                this.preview && this.preview.setAttribute("src", a);
                b && b.setStyle("display", "none");
                n(this, !1)
            }, q = function (a) {
                return CKEDITOR.tools.getNextId() + "_" + a
            }, t = q("btnLockSizes"),
            y = q("btnResetSize"), p = q("ImagePreviewLoader"), E = q("previewLink"), D = q("previewImage"),imgdiv = q("imagename");
        return {
            title: d.lang.custimage["custimage" == l ? "title" : "titleButton"],
            minWidth: 500,
            minHeight: 350,
            resizable : CKEDITOR.DIALOG_RESIZE_NONE,
            onShow: function () {
                this.linkEditMode = this.imageEditMode = this.linkElement = this.imageElement = !1;
                this.lockRatio = !0;
                this.userlockRatio = 0;
                this.dontResetSize = !1;
                this.firstLoad = !0;
                this.addLink = !1;
                var a = this.getParentEditor(), b = a.getSelection(), c = (b = b && b.getSelectedElement()) && a.elementPath(b).contains("a", 1), d = CKEDITOR.document.getById(p);
                d && d.setStyle("display", "none");
                x = new CKEDITOR.dom.element("img", a.document);
                this.preview = CKEDITOR.document.getById(D);
                this.originalElement = a.document.createElement("img");
                this.originalElement.setAttribute("alt", "");
                this.originalElement.setCustomData("isReady", "false");
                c && (this.linkElement = c, this.addLink = this.linkEditMode = !0, a = c.getChildren(), 1 == a.count() && (d = a.getItem(0), d.type == CKEDITOR.NODE_ELEMENT && (d.is("img") || d.is("input")) && (this.imageElement = a.getItem(0), this.imageElement.is("img") ? this.imageEditMode =
                    "img" : this.imageElement.is("input") && (this.imageEditMode = "input"))), "custimage" == l && this.setupContent(2, c));
                if (this.customImageElement)this.imageEditMode = "img", this.imageElement = this.customImageElement, delete this.customImageElement; else if (b && "img" == b.getName() && !b.data("cke-realelement") || b && "input" == b.getName() && "custimage" == b.getAttribute("type"))this.imageEditMode = b.getName(), this.imageElement = b;
                this.imageEditMode && (this.cleanImageElement = this.imageElement, this.imageElement = this.cleanImageElement.clone(!0,
                    !0), this.setupContent(1, this.imageElement));
                var imageName = CKEDITOR.tools.trim(this.getValueOf("info", "txtAlt"));
                if("undefined" == typeof imageName || !imageName.trim()){
					var imgurl = b.$.src;
					imageName = getParameterByName('nodeId',imgurl);
                }
                var imageLabel=a.lang.custimage.label;
				var document = this.getElement().getDocument();
					var element = CKEDITOR.document.getById(imgdiv);
					if (element) {
                        element.setHtml('<div role="presentation" id="cke_611_uiElement" class="cke_dialog_ui_text cs-wiki-dialog-image-name-div"><label class="cke_dialog_ui_labeled_label" id="cke_610_label" for="cke_609_textInput">'+imageLabel+'</label><div class="cke_dialog_ui_labeled_content" role="presentation"><div class="imageNameContent" title="'+imageName+'" role="presentation">'+imageName+'</div></div></div>');
                    }
                n(this, !0);
                CKEDITOR.tools.trim(this.getValueOf("info", "txtUrl")) || (this.preview.removeAttribute("src"), this.preview.setStyle("display", "none"))
            },
            onOk: function () {
                if (this.imageEditMode) {
                    var a = this.imageEditMode;
                    "custimage" == l && "input" == a && confirm(d.lang.custimage.button2Img) ? (this.imageElement = d.document.createElement("img"), this.imageElement.setAttribute("alt", ""), d.insertElement(this.imageElement)) : "custimage" != l && "img" == a && confirm(d.lang.custimage.img2Button) ? (this.imageElement =
                        d.document.createElement("input"), this.imageElement.setAttributes({
                        type: "image",
                        alt: ""
                    }), d.insertElement(this.imageElement)) : (this.imageElement = this.cleanImageElement, delete this.cleanImageElement)
                } else "custimage" == l ? this.imageElement = d.document.createElement("img") : (this.imageElement = d.document.createElement("input"), this.imageElement.setAttribute("type", "image")), this.imageElement.setAttribute("alt", "");
                this.linkEditMode || (this.linkElement = d.document.createElement("a"));
                this.commitContent(1, this.imageElement);
                this.commitContent(2, this.linkElement);
                this.imageElement.getAttribute("style") || this.imageElement.removeAttribute("style");
                this.imageEditMode ? !this.linkEditMode && this.addLink ? (d.insertElement(this.linkElement), this.imageElement.appendTo(this.linkElement)) : this.linkEditMode && !this.addLink && (d.getSelection().selectElement(this.linkElement), d.insertElement(this.imageElement)) : this.addLink ? this.linkEditMode ? this.linkElement.equals(d.getSelection().getSelectedElement()) ? (this.linkElement.setHtml(""), this.linkElement.append(this.imageElement,
                    !1)) : d.insertElement(this.imageElement) : (d.insertElement(this.linkElement), this.linkElement.append(this.imageElement, !1)) : d.insertElement(this.imageElement)
            },
            onLoad: function () {
                "custimage" != l && this.hidePage("Link");
                var a = this._.element.getDocument();
                this.getContentElement("info", "ratioLock") && (this.addFocusable(a.getById(y), 5), this.addFocusable(a.getById(t), 5));
                this.getElement().getFirst().removeClass('cke_single_page');
                this.getElement().getFirst().addClass('cs-wiki-dialog-body');
                this.commitContent = v
            },
            onHide: function () {
                this.preview && this.commitContent(8, this.preview);
                this.originalElement && (this.originalElement.removeListener("load",
                    u), this.originalElement.removeListener("error", h), this.originalElement.removeListener("abort", h), this.originalElement.remove(), this.originalElement = !1);
                delete this.imageElement
            },
            contents: [{
                id: "info", label: d.lang.custimage.infoTab, accessKey: "I", elements: [
                    {type: "vbox", padding: 0, children: [{
                        type: "hbox", align: "left",widths: ["70%", "0%","30%"], children: [{
                            id: "imagename", type: "html",className:"cs-wiki-dialog-imagename-field", label: "Image",
                            onLoad: function () {

                            },

                            html: '\x3cdiv id\x3d"' + imgdiv + '"\x3e\x3c/div\x3e'
                        },{
                            type: "file",
                            hidden: true,
                            id: "upload",
                            label: d.lang.custimage.btnUpload,
                            size: 38
                        }, {
                            type: "fileButton",
                            id: "uploadButton",
                            style: "vertical-align:middle;",
                            className: "cs-wiki-button",
                            filebrowser: "info:txtUrl",
                            label: d.lang.custimage.btnUpload,
                            "for": ["info",
                                "upload"]
                        }]


                    }]
                    },
                    {type: "vbox", padding: 0, children: [{
                        type: "hbox", align: "left", widths: ["100%"], children: [{
                            id: "txtUrl", type: "text",style:"display:none;",className:"cs-wiki-dialog-url-field", label: "URL", required: !0, onChange: function () {
                                var a = this.getDialog(), b = this.getValue();
                                if (0 < b.length) {
                                    var a = this.getDialog(),
                                        c = a.originalElement;
                                    a.preview && a.preview.removeStyle("display");
                                    c.setCustomData("isReady", "false");
                                    var d = CKEDITOR.document.getById(p);
                                    d && d.setStyle("display", "");
                                    c.on("load", u, a);
                                    c.on("error", h, a);
                                    c.on("abort", h, a);
                                    c.setAttribute("src", b);
                                    a.preview && (x.setAttribute("src", b), a.preview.setAttribute("src", x.$.src), e(a))
                                } else a.preview && (a.preview.removeAttribute("src"), a.preview.setStyle("display", "none"))
                            }, setup: function (a, b) {
                                if (1 == a) {
                                    var c = b.data("cke-saved-src") || b.getAttribute("src");
                                    this.getDialog().dontResetSize = !0;
                                    this.setValue(c);
                                    this.setInitValue()
                                }
                            }, commit: function (a, b) {
                                1 == a && (this.getValue() || this.isChanged()) ? (b.data("cke-saved-src", this.getValue()), b.setAttribute("src", this.getValue())) : 8 == a && (b.setAttribute("src", ""), b.removeAttribute("src"))
                            }, validate: CKEDITOR.dialog.validate.notEmpty(d.lang.custimage.urlMissing)
                        }]
                    }]
                },


				
				{
                    id: "txtAlt", type: "text", label: d.lang.custimage.alt,className: "cs-wiki-body-dialog-image-altfield",
                    accessKey: "T", "default": "", onChange: function () {
                        e(this.getDialog())
                    }, setup: function (a, b) {
                        1 == a && this.setValue(b.getAttribute("alt"))
                    }, commit: function (a, b) {
                        1 == a ? (this.getValue() || this.isChanged()) && b.setAttribute("alt", this.getValue()) : 4 == a ? b.setAttribute("alt", this.getValue()) : 8 == a && b.removeAttribute("alt")
                    }
                }, {
                    type: "hbox", children: [{
                        id: "basic", type: "vbox", children: [{
                            type: "hbox", requiredContent: "img{width,height}", widths: ["50%", "50%"], children: [{
                                type: "vbox", children: [{
                                    type: "text", width: "80px",className: "cs-wiki-dialog-width-field",
                                    id: "txtWidth", label: d.lang.common.width, onKeyUp: A, onChange: function () {
                                        k.call(this, "advanced:txtdlgGenStyle")
                                    }, validate: function () {
                                        var a = this.getValue().match(z);
                                        (a = !(!a || 0 === parseInt(a[1], 10))) || alert(d.lang.common.invalidWidth);
                                        return a
                                    }, setup: C, commit: function (a, b) {
                                        var c = this.getValue();
                                        1 == a ? (c && d.activeFilter.check("img{width,height}") ? b.setStyle("width", CKEDITOR.tools.cssLength(c)) : b.removeStyle("width"), b.removeAttribute("width")) : 4 == a ? c.match(m) ? b.setStyle("width", CKEDITOR.tools.cssLength(c)) :
                                            (c = this.getDialog().originalElement, "true" == c.getCustomData("isReady") && b.setStyle("width", c.$.width + "px")) : 8 == a && (b.removeAttribute("width"), b.removeStyle("width"))
                                    }
                                }, {
                                    type: "text",
                                    id: "txtHeight",
                                    className: "cs-wiki-dialog-width-field",
                                    width: "80px",
                                    label: d.lang.common.height,
                                    onKeyUp: A,
                                    onChange: function () {
                                        k.call(this, "advanced:txtdlgGenStyle")
                                    },
                                    validate: function () {
                                        var a = this.getValue().match(z);
                                        (a = !(!a || 0 === parseInt(a[1], 10))) || alert(d.lang.common.invalidHeight);
                                        return a
                                    },
                                    setup: C,
                                    commit: function (a, b) {
                                        var c = this.getValue();
                                        1 == a ? (c && d.activeFilter.check("img{width,height}") ?
                                            b.setStyle("height", CKEDITOR.tools.cssLength(c)) : b.removeStyle("height"), b.removeAttribute("height")) : 4 == a ? c.match(m) ? b.setStyle("height", CKEDITOR.tools.cssLength(c)) : (c = this.getDialog().originalElement, "true" == c.getCustomData("isReady") && b.setStyle("height", c.$.height + "px")) : 8 == a && (b.removeAttribute("height"), b.removeStyle("height"))
                                    }
                                }]
                            }, {
                                id: "ratioLock",
                                type: "html",
                                className: "cs-wiki-dialog-image-icons",
                                onLoad: function () {
                                    var a = CKEDITOR.document.getById(y), b = CKEDITOR.document.getById(t);
                                    a && (a.on("click", function (a) {
                                        B(this);
                                        a.data && a.data.preventDefault()
                                    }, this.getDialog()), a.on("mouseover", function () {
                                        this.addClass("cke_btn_over")
                                    }, a), a.on("mouseout", function () {
                                        this.removeClass("cke_btn_over")
                                    }, a));
                                    b && (b.on("click", function (a) {
                                        n(this);
                                        var b = this.originalElement, d = this.getValueOf("info", "txtWidth");
                                        "true" == b.getCustomData("isReady") && d && (b = b.$.height / b.$.width * d, isNaN(b) || (this.setValueOf("info", "txtHeight", Math.round(b)), e(this)));
                                        a.data && a.data.preventDefault()
                                    }, this.getDialog()),
                                        b.on("mouseover", function () {
                                            this.addClass("cke_btn_over")
                                        }, b), b.on("mouseout", function () {
                                        this.removeClass("cke_btn_over")
                                    }, b))
                                },
                                html: '\x3cdiv\x3e\x3ca href\x3d"javascript:void(0)" tabindex\x3d"-1" title\x3d"' + d.lang.custimage.lockRatio + '" class\x3d"cke_btn_locked" id\x3d"' + t + '" role\x3d"checkbox"\x3e\x3cspan class\x3d"cke_icon"\x3e\x3c/span\x3e\x3cspan class\x3d"cke_label"\x3e' + d.lang.custimage.lockRatio + '\x3c/span\x3e\x3c/a\x3e\x3ca href\x3d"javascript:void(0)" tabindex\x3d"-1" title\x3d"' + d.lang.custimage.resetSize +
                                '" class\x3d"cke_btn_reset" id\x3d"' + y + '" role\x3d"button"\x3e\x3cspan class\x3d"cke_label"\x3e' + d.lang.custimage.resetSize + "\x3c/span\x3e\x3c/a\x3e\x3c/div\x3e"
                            }]
                        }, {
                            type: "vbox", padding: 1, children: [{
                                type: "text",
                                id: "txtBorder",
                                className: "cs-wiki-dialog-image-attributes",
                                requiredContent: "img{border-width}",
                                width: "80px",
                                label: d.lang.custimage.border,
                                "default": "",
                                onKeyUp: function () {
                                    e(this.getDialog())
                                },
                                onChange: function () {
                                    k.call(this, "advanced:txtdlgGenStyle")
                                },
                                validate: CKEDITOR.dialog.validate.integer(d.lang.custimage.validateBorder),
                                setup: function (a, b) {
                                    if (1 ==
                                        a) {
                                        var c;
                                        c = (c = (c = b.getStyle("border-width")) && c.match(/^(\d+px)(?: \1 \1 \1)?$/)) && parseInt(c[1], 10);
                                        isNaN(parseInt(c, 10)) && (c = b.getAttribute("border"));
                                        this.setValue(c)
                                    }
                                },
                                commit: function (a, b) {
                                    var c = parseInt(this.getValue(), 10);
                                    1 == a || 4 == a ? (isNaN(c) ? !c && this.isChanged() && b.removeStyle("border") : (b.setStyle("border-width", CKEDITOR.tools.cssLength(c)), b.setStyle("border-style", "solid")), 1 == a && b.removeAttribute("border")) : 8 == a && (b.removeAttribute("border"), b.removeStyle("border-width"), b.removeStyle("border-style"),
                                        b.removeStyle("border-color"))
                                }
                            }, {
                                type: "text",
                                id: "txtHSpace",
                                className: "cs-wiki-dialog-image-attributes",
                                requiredContent: "img{margin-left,margin-right}",
                                width: "80px",
                                label: d.lang.custimage.hSpace,
                                "default": "",
                                onKeyUp: function () {
                                    e(this.getDialog())
                                },
                                onChange: function () {
                                    k.call(this, "advanced:txtdlgGenStyle")
                                },
                                validate: CKEDITOR.dialog.validate.integer(d.lang.custimage.validateHSpace),
                                setup: function (a, b) {
                                    if (1 == a) {
                                        var c, d;
                                        c = b.getStyle("margin-left");
                                        d = b.getStyle("margin-right");
                                        c = c && c.match(r);
                                        d = d && d.match(r);
                                        c = parseInt(c, 10);
                                        d = parseInt(d, 10);
                                        c = c == d && c;
                                        isNaN(parseInt(c, 10)) && (c = b.getAttribute("hspace"));
                                        this.setValue(c)
                                    }
                                },
                                commit: function (a, b) {
                                    var c = parseInt(this.getValue(), 10);
                                    1 == a || 4 == a ? (isNaN(c) ? !c && this.isChanged() && (b.removeStyle("margin-left"), b.removeStyle("margin-right")) : (b.setStyle("margin-left", CKEDITOR.tools.cssLength(c)), b.setStyle("margin-right", CKEDITOR.tools.cssLength(c))), 1 == a && b.removeAttribute("hspace")) : 8 == a && (b.removeAttribute("hspace"), b.removeStyle("margin-left"), b.removeStyle("margin-right"))
                                }
                            }, {
                                type: "text",
                                id: "txtVSpace",
                                className: "cs-wiki-dialog-image-attributes",
                                requiredContent: "img{margin-top,margin-bottom}",
                                width: "80px",
                                label: d.lang.custimage.vSpace,
                                "default": "",
                                onKeyUp: function () {
                                    e(this.getDialog())
                                },
                                onChange: function () {
                                    k.call(this, "advanced:txtdlgGenStyle")
                                },
                                validate: CKEDITOR.dialog.validate.integer(d.lang.custimage.validateVSpace),
                                setup: function (a, b) {
                                    if (1 == a) {
                                        var c, d;
                                        c = b.getStyle("margin-top");
                                        d = b.getStyle("margin-bottom");
                                        c = c && c.match(r);
                                        d = d && d.match(r);
                                        c = parseInt(c, 10);
                                        d = parseInt(d, 10);
                                        c = c == d && c;
                                        isNaN(parseInt(c, 10)) && (c = b.getAttribute("vspace"));
                                        this.setValue(c)
                                    }
                                },
                                commit: function (a, b) {
                                    var c = parseInt(this.getValue(), 10);
                                    1 == a || 4 == a ? (isNaN(c) ? !c && this.isChanged() && (b.removeStyle("margin-top"), b.removeStyle("margin-bottom")) : (b.setStyle("margin-top", CKEDITOR.tools.cssLength(c)), b.setStyle("margin-bottom", CKEDITOR.tools.cssLength(c))), 1 == a && b.removeAttribute("vspace")) : 8 == a && (b.removeAttribute("vspace"), b.removeStyle("margin-top"), b.removeStyle("margin-bottom"))
                                }
                            }, {
                                id: "cmbAlign",
                                requiredContent: "img{float}",
                                type: "select",
								className: "cs-wiki-dialog-select-field",
                                widths: ["35%", "65%"],
                                label: d.lang.common.align,
                                "default": "",
                                items: [[d.lang.common.notSet, ""], [d.lang.common.alignLeft, "left"], [d.lang.common.alignRight, "right"]],
                                onChange: function () {
                                    e(this.getDialog());
                                    k.call(this, "advanced:txtdlgGenStyle")
                                },
                                setup: function (a, b) {
                                    if (1 == a) {
                                        var c = b.getStyle("float");
                                        switch (c) {
                                            case "inherit":
                                            case "none":
                                                c = ""
                                        }
                                        !c && (c = (b.getAttribute("align") || "").toLowerCase());
                                        this.setValue(c)
                                    }
                                },
                                commit: function (a, b) {
                                    var c = this.getValue();
                                    if (1 == a || 4 == a) {
                                        if (c ? b.setStyle("float", c) : b.removeStyle("float"), 1 == a)switch (c =
                                            (b.getAttribute("align") || "").toLowerCase(), c) {
                                            case "left":
                                            case "right":
                                                b.removeAttribute("align")
                                        }
                                    } else 8 == a && b.removeStyle("float")
                                }
                            }]
                        }]
                    }, {
                        type: "vbox", height: "250px", children: [{
                            type: "html",
                            id: "htmlPreview",
                            style: "width:95%;",
                            html: "\x3cdiv\x3e&nbsp;" + '\x3cdiv id\x3d"' + p + '" class\x3d"ImagePreviewLoader" style\x3d"display:none"\x3e\x3cdiv class\x3d"loading"\x3e\x26nbsp;\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"ImagePreviewBox"\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3ca href\x3d"javascript:void(0)" target\x3d"_blank" onclick\x3d"return false;" id\x3d"' +
                            E + '"\x3e\x3cimg id\x3d"' + D + '" alt\x3d"" /\x3e\x3c/a\x3e' + (d.config.image_previewText || "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas feugiat consequat diam. Maecenas metus. Vivamus diam purus, cursus a, commodo non, facilisis vitae, nulla. Aenean dictum lacinia tortor. Nunc iaculis, nibh non iaculis aliquam, orci felis euismod neque, sed ornare massa mauris sed velit. Nulla pretium mi et risus. Fusce mi pede, tempor id, cursus ac, ullamcorper nec, enim. Sed tortor. Curabitur molestie. Duis velit augue, condimentum at, ultrices a, luctus ut, orci. Donec pellentesque egestas eros. Integer cursus, augue in cursus faucibus, eros pede bibendum sem, in tempus tellus justo quis ligula. Etiam eget tortor. Vestibulum rutrum, est ut placerat elementum, lectus nisl aliquam velit, tempor aliquam eros nunc nonummy metus. In eros metus, gravida a, gravida sed, lobortis id, turpis. Ut ultrices, ipsum at venenatis fringilla, sem nulla lacinia tellus, eget aliquet turpis mauris non enim. Nam turpis. Suspendisse lacinia. Curabitur ac tortor ut ipsum egestas elementum. Nunc imperdiet gravida mauris.") +
                            "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e\x3c/div\x3e"
                        }]
                    }]
                }]
            }]
        }
    };
    CKEDITOR.dialog.add("custimage", function (d) {
        return v(d, "custimage")
    });
    CKEDITOR.dialog.add("custimagebutton", function (d) {
        return v(d, "custimagebutton")
    })
})();