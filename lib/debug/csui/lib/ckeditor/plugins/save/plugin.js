CKEDITOR.plugins.add("save", {
    lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',

    init: function(editor) {
        var configSave = editor.config.save;
        if (typeof configSave == "undefined") {
            configSave = {}
        }
        //adding the command save
        editor.addCommand("save", {

            //execution function for save command
            exec: function(editor) {
                var data = {}
                    , contentType = "application/x-www-form-urlencoded; charset=UTF-8";

                //get the url to save the data
                if (typeof configSave.url == "undefined") {
                    throw new Error("CKEditor save: You must define config.save.url in your configuration file.");
                    return
                } else if(typeof configSave.url == "function") {
                    configSave.url = configSave.url(editor);
                }
                CKEDITOR.tools.extend(data, configSave.postData || {}, true);

                // get the data from config
                if(typeof configSave.postData == "function"){
                    data = configSave.postData(editor);
                }else {
                    data= configSave.postData;
                }

                //if the useJSON is specified then convert data into json format
                if (!!configSave.useJSON) {
                    configSave.json = JSON.stringify(data);
                    contentType = "application/json; charset=UTF-8"
                } else {
                    var formData = "";
                    for (var parameter in data) {
                        formData += "&" + parameter + "=" + encodeURIComponent(data[parameter])
                    }
                    configSave.json = formData.slice(1)
                }
                //prepare httpRequest to send
                configSave.request = new XMLHttpRequest();
                configSave.request.onreadystatechange = function() {
                    if (configSave.request.readyState == 4) {

                        // execute the success callback function from config if the request status ok
                        if (typeof configSave.onSuccess == "function" && configSave.request.status == 200) {
                            configSave.onSuccess(editor, configSave.request.response)
                        } else {

                            //execute the failure callback function from config if the request is failed
                            if (typeof configSave.onFailure == "function") {
                                configSave.onFailure(editor, configSave.request.status, configSave.request)
                            }
                        }
                    }
                };

                //open the request with type, url
                configSave.request.open(configSave.type, configSave.url, true);

                //set the request header content-type
                configSave.request.setRequestHeader("Content-type", contentType);

                //set the  OTCSTicket for authentication
                configSave.request.setRequestHeader("OTCSTicket", configSave.ticket);

                //execute the onSave callback function
                if (typeof configSave.onSave == "function") {
                    var onSave = configSave.onSave(editor);
                    if (typeof onSave != "undefined" && !onSave) {
                        if (typeof configSave.onFailure == "function") {
                            configSave.onFailure(editor, -1, null )
                        } else {
                            throw new Error("CKEditor save: Saving Disable by return of onSave function = false")
                        }
                        return
                    }
                }
            }
        });

        // add save button to ckeditor
        editor.ui.addButton("Save", {
            icon: this.path + 'icons/save.png',
            label: editor.lang.save.toolbar,
            command: "save"
        })
    }
});
