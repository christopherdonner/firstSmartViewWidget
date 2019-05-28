/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
      'csui/lib/backbone'],
    function (module, _require, $, _, Marionette, Backbone) {
      var GeneralHelper = new Backbone.Model({

        namespace: function (namespaceString) {
          var parts       = namespaceString.split('.'),
              parent      = window,
              currentPart = '';

          for (var i = 0, length = parts.length; i < length; i++) {
            currentPart = parts[i];

            if (!parent[currentPart]) {
              parent[currentPart] = parent[currentPart] || {};
            }

            parent = parent[currentPart];
          }

          return parent;
        },
        generateUUID: function () {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
              function (c) {
                var r = Math.random() * 16 | 0,
                    v = (c === 'x' ? r : r & 0x3 | 0x8);

                return v.toString(16);
              }
          );
        },
        isEmpty: function (object) {
          if (object) {
            if ($.isArray(object)) {
              return object.length === 0;
            } else {
              return false;
            }
          } else {
            return true;
          }
        },
        extractDataFromDataUri: function (uri, options) {
          var regex  = /^data:([^,;]+)(?:;charset=([^,;]+))?(;base64)?,(.*)$/i,
              result = regex.exec(uri);
          if (result[3] && window.atob) {
            var data = window.escape(window.atob(result[4]));
            return (options && options.unescape) ? decodeURI(data) : data;
          } else {
            var fixPlus = result[4].replace(/\+/g, "%20");
            return (options && options.unescape) ? window.unescape(fixPlus) : fixPlus;
          }
        },
        extractOriginFromAbsoluteUrl: function (url) {
          if (url && typeof(url) === "string") {
            var index = url.indexOf("://");
            if (index !== -1) {
              index += 3;
              var endOfFqdn = url.indexOf("/", index);
              return url.slice(0, endOfFqdn);
            } else {
              return "";
            }
          } else {
            return "";
          }
        },
        determineDomain: function (url) {
          var domain = "",
              temp   = url.match(/^(?:(?:f|ht)tps?:\/\/)?([^\/:]+)/);

          if (temp.length !== 0) {
            temp = temp[0];

            domain = temp.slice(temp.indexOf(".") + 1);
          }

          return domain;
        },
        convertJoinUrlToUri: function (joinUrl) {
          var domain = this.determineDomain(joinUrl),
              temp   = joinUrl.split(domain),
              uri    = "";

          if (temp.length >= 2) {
            temp = temp[1];
            temp = temp.split("/");

            uri = "sip:" + temp[1] + "@" + domain + ";gruu;opaque=app:conf:focus:id:" +
                  temp[2];
          }

          return uri;
        },
        logError: function (error) {
          if (error && error instanceof Error && error.message) {
            window.console.log(error.message);
          }
        },
        genericRejectAction: function (object, message) {
          window.console.log(message);

          var deferred = null;

          if (object) {
            this.logError(object);

            try {
              if ($.isFunction(object.callback)) {
                object.callback(null);
              }
            } catch (e) {
              window.console.log(
                  "GeneralHelper: Encountered error executing callback");
              this.logError(object);
            }

            if (object.deferred) {
              deferred = object.deferred;
            }
          }

          if (!deferred) {
            deferred = $.Deferred();
          }

          deferred.reject(null);

          return deferred.promise();
        },
        safeCallbackExec: function (object) {
          if (object) {
            if ($.isFunction(object.callback)) {
              try {
                if ($.isArray(object.params) || !object.params) {
                  object.callback.apply(this, object.params);
                } else {
                  window.console.log(
                      "object.params not in correct format: should be [] or null: unable to safe execute callback");
                }
              } catch (e) {
                if (object.error) {
                  window.console.log(object.error);
                } else {
                  window.console.log("Encountered error safe executing callback");
                }

                this.logError(e);
              }
            } else if (object.callback) {
              window.console.log(
                  "object.callback is not a Function: unable to safe execute callback");
            }
          } else {
            window.console.log("object not defined: unable to safe execute callback");
          }
        },
        getValue: function (defaultValue, value) {
          return value || defaultValue;
        },
        parseHeaders: function (headers) {
          var obj   = {},
              split = headers.split("\r\n");

          for (var i = 0; i < split.length; i++) {
            if (split[i] !== "") {
              var index = split[i].indexOf(":");

              if (index !== -1) {
                var key   = $.trim(split[i].slice(0, index)),
                    value = $.trim(split[i].slice(index + 1)),
                    match = value.match(/\=".*?"/g);

                if (match && match.length !== 0) {
                  index = value.indexOf(match[0]);

                  var temp      = value.slice(0, index),
                      tempMatch = temp.match(/\W/g),
                      splitChar = tempMatch ? tempMatch[0] : null,
                      root      = splitChar ? $.trim(temp.split(splitChar)[0]) :
                                  $.trim(temp),
                      child     = value.slice(root.length + 1),
                      j         = 0;

                  if (!obj[key]) {
                    obj[key] = {};
                  }

                  while (j < match.length) {
                    if (!obj[key][root]) {
                      obj[key][root] = {};
                    }

                    for (j; j < match.length; j++) {
                      var skip = 0;

                      if (child.indexOf(",") === 0 ||
                          child.indexOf(splitChar) === 0) {
                        skip += 1;
                      }

                      if (child.indexOf(",") === 1 ||
                          child.indexOf(splitChar) === 1) {
                        skip += 1;
                      }

                      child = child.slice(skip);
                      index = child.indexOf(match[j]);

                      var item = $.trim(child.slice(0, index));
                      index = item.lastIndexOf(splitChar);

                      if (index !== -1) {
                        root = $.trim(item.slice(0, index));
                        child = child.slice(root.length + 1);
                        break;
                      }

                      child = child.slice(item.length + match[j].length);

                      var valueSplit = match[j].slice(1).replace(/"/g,
                          "").split(",");

                      if (valueSplit.length === 1) {
                        obj[key][root][item] = valueSplit[0];
                      } else {
                        obj[key][root][item] = [];

                        for (var k = 0; k < valueSplit.length; k++) {
                          obj[key][root][item].push(valueSplit[k]);
                        }
                      }
                    }
                  }
                } else {
                  obj[key] = value.replace(/"/g, "");
                }
              } else {
                window.console.log("Not a header?");
              }
            }
          }

          return obj;
        }

      });

      return GeneralHelper;
    });