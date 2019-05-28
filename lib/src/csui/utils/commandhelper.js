/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/base', 'csui/utils/command.error',
  'i18n!csui/utils/commands/nls/localized.strings',
  'i18n!csui/utils/commands/versions/nls/localized.strings',
  'csui/models/version', 'csui/lib/jquery.when.all'
], function (require, module, $, _, Backbone, base, CommandError,
    lang, versionsLang, VersionModel) {
  'use strict';

  var config = module.config();

  var CommandHelper = function () {};

  _.extend(CommandHelper.prototype, Backbone.Events, {

    checkNodeTypesAndRights: function (nodes, types, rights) {
      _.isArray(nodes) || nodes && (nodes = [nodes]);
      var container = _.contains(types, -1);
      return nodes && nodes.length && _.all(nodes, function (node) {
            return (_.contains(types, node.get("type")) ||
                    container && node.get("container")) &&
                   _.all(rights, function (right) {
                     return node.get("perm_" + right);
                   });
          });
    },

    checkNodeTypes: function (nodes, types) {
      _.isArray(nodes) || nodes && (nodes = [nodes]);
      var container = _.contains(types, -1);
      return nodes && nodes.length && _.all(nodes, function (node) {
            var attributes = base.isBackbone(node) ? node.attributes : node;
            return _.contains(types, attributes.type) ||
                   container && attributes.container;
          });
    },

    checkNodeRights: function (nodes, rights) {
      _.isArray(nodes) || nodes && (nodes = [nodes]);
      return nodes && nodes.length && _.all(nodes, function (node) {
            var attributes = base.isBackbone(node) ? node.attributes : node;
            return _.all(rights, function (right) {
              return attributes["perm_" + right];
            });
          });
    },

    getJustOneNode: function (status) {
      var node = status.nodes && status.nodes.length === 1 && status.nodes.at(0);
      return node;
    },

    getAtLeastOneNode: function (status) {
      if (status.nodes) {
        return status.nodes;
      }

      var ViewCollection = Backbone.Collection.extend(
          status.collection ? {model: status.collection.model} : {}
      );

      return new ViewCollection();
    },

    updateNode: function (node, attributesToUpdate) {
      var self = this;
      return node
          .save(attributesToUpdate, {
            wait: true,
            patch: true,
            silent: true
          })
          .then(function () {
            return node.fetch({force:true});
          })
          .then(function () {
            return node;
          }, function (error) {
            var commandError = new CommandError(error, node);
            $.Deferred().reject(commandError);
            return commandError;
          });
    },
    handleExecutionResults: function (promise, options) {
      var handleExecutionResultsDeferred = $.Deferred(),
          modulePromise = $.Deferred();

      require([
        'csui/controls/globalmessage/globalmessage'
      ], function(GlobalMessage) {
        modulePromise.resolve(GlobalMessage);
      }, modulePromise.reject);

      $.whenAll(modulePromise, promise)
       .always(function (parameters) {
        var GlobalMessage = parameters[0],
            results = parameters[1];
        if (!_.isArray(results)) {
          results = [results];
        }
        var okCnt = 0;
        var failedCnt = 0;
        _.each(results, function (result) {
          if (result !== undefined && !result.cancelled) {
            if (result instanceof Error) {
              failedCnt++;
            } else {
              okCnt++;
            }
          }
        });
        if (failedCnt === 0 && okCnt === 0) {
          handleExecutionResultsDeferred.reject();
          return;
        }
        var commandError = results[0];

        if (commandError instanceof VersionModel) {
          _.extend(lang, versionsLang);
        }

        if (results.length === 1) {
          if (okCnt === 1) {
            if (!options.suppressSuccessMessage) {
              GlobalMessage.showMessage("success",
                  _.str.sformat(lang.CommandSuccessfullySingular, okCnt,
                      options.command.get('doneVerb')));
            }
          } else {
            var message = commandError.errorDetails || commandError.message;

            if (config.offlineSupport && commandError.statusCode === 0) {
              handleExecutionResultsDeferred.reject(commandError);
            }
            else if (!options.suppressFailMessage && !commandError.suppressFailMessage) {
              GlobalMessage.showMessage("error",
                  _.str.sformat(lang.CommandFailedSingular, failedCnt,
                      options.command.get('verb')),
                  message);
            }
          }
        } else {
          if (failedCnt === 0) {
            if (!options.suppressSuccessMessage) {
              GlobalMessage.showMessage("success",
                  _.str.sformat(lang.CommandSuccessfullyPlural, okCnt,
                      options.command.get('doneVerb')
                  ));
            }
          } else {
            if (okCnt === 0) {
              if (config.offlineSupport && commandError.statusCode === 0) {
                handleExecutionResultsDeferred.reject(commandError);
              }
              else if (!options.suppressFailMessage && !commandError.suppressFailMessage) {
                GlobalMessage.showMessage("error",
                    _.str.sformat(lang.CommandFailedPlural, failedCnt,
                        options.command.get('verb')
                    ));
              }
            } else if (!options.suppressFailMessage && !commandError.suppressFailMessage) {
              if (!!options.customError) {
                GlobalMessage.showMessage('error', results[1]);
              } else {
                GlobalMessage.showMessage("error",
                  _.str.sformat(lang.CommandFailedPartial, failedCnt, results.length,
                      options.command.get('verb')
                ));
              }
            }
          }
        }
        handleExecutionResultsDeferred.resolve(results);
      });
      return handleExecutionResultsDeferred.promise();
    },

    _getErrorMessageFromResponse: function (err) {
      var errorMessage;
      if (err && err.responseJSON && err.responseJSON.error) {
        errorMessage = err.responseJSON.error;
      } else {
        var errorHtml = base.MessageHelper.toHtml();
        base.MessageHelper.reset();
        errorMessage = $(errorHtml).text();
      }
      return errorMessage;
    },
    refreshModelAttributesFromServer: function (node, collection) {
      var tempNode = node.clone();
      tempNode.collection = collection || node.collection;
      return tempNode.fetch()
                     .then(function () {
                       node.set(tempNode.attributes);
                       if (tempNode.original) {
                         node.original = tempNode.original;
                       }
                       return node;
                     });
    },

    showOfflineMessage: function (error, yesCallBck, noCallBack) {
      if (error && error.statusCode === 0 && config.offlineSupport) {
        var self = this;

        require(['csui/dialogs/modal.alert/modal.alert'],
            function (modalAlert) {

              modalAlert.showInformation(lang.GoToOffline, lang.NoConnectivity,
                  {
                    buttons: modalAlert.buttons.YesNo
                  })
                  .always(function (answer) {
                    if (answer) {
                      yesCallBck ? yesCallBck() : window.location.href = "#offline.list";
                    }
                    else {
                      noCallBack ? noCallBack() : self.trigger('offline:refused');
                    }
                  });
            });
        return true;
      }
    }
  });

  var helperInstance = new CommandHelper();
  return helperInstance;

});
