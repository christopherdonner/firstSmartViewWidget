/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/base', 'csui/utils/commandhelper', 'csui/utils/command.error'
], function (module, require, _, $, base, CommandHelper, CommandError) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });
  var PageLeavingBlocker;

  var MultipleItemsCommand = {

    execute: function (status, options) {
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      return this._performActions(status, options);
    },

    _performActions: function (status, options) {
      var deferred = $.Deferred(),
          self = this,
          promises;
      require(['csui/utils/taskqueue', 'csui/utils/page.leaving.blocker'
      ], function (TaskQueue) {
        PageLeavingBlocker = arguments[1];
        options = options || {};
        if (!options.context) {
          options.context = status.context;
        }
        self._announceStart(status);
        var nodes = CommandHelper.getAtLeastOneNode(status),
            queue = new TaskQueue({
              parallelism: options.parallelism || config.parallelism
            });

        promises = nodes.map(function (node, index) {
          var deferred = $.Deferred();
          queue.pending.add({
            worker: function () {
              self._performAction(node, options)
                  .done(deferred.resolve)
                  .fail(function(error){
                    deferred.reject(error);
                  });
              return deferred.promise();
            }
          });
          return deferred.promise();
        });
        $.whenAll
            .apply($, promises)
            .always(_.bind(self._announceFinish, self, status))
            .done(function () {
              if(!status.suppressMultipleSuccessMessage) {
                self.showSuccess(promises);
              }
              deferred.resolve.apply(deferred, arguments);      // pass the original arguments to handler, so that events are triggered
            })
            .fail(function () {
              if(!status.suppressMultipleFailMessage) {
                self.showError(promises);
              }
              deferred.reject.apply(deferred, arguments);      // pass the original arguments to handler, so that events are triggered
            });

      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    showError: function(promises) {
      var errorMessage,
          successMessage;

      var checkResult = this._checkPromises(promises);
      if(checkResult) {
        var countFailed = checkResult.countFailed;
        var countOk = checkResult.countOk;

        errorMessage = this._getErrorMessage(countFailed);

        var msg;
        if(countOk > 0) {
          successMessage = this._getSuccessMessage(countOk);
          msg = successMessage + " " + errorMessage;
        } else {
          msg = errorMessage;
        }

        require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          GlobalMessage.showMessage("error", msg, undefined, {});
        });
      }
    },

    showSuccess: function(promises) {
      var successMessage;

      var checkResult = this._checkPromises(promises);
      if (checkResult) {
        var countOk = checkResult.countOk;

        successMessage = this._getSuccessMessage(countOk);

        require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          GlobalMessage.showMessage("success", successMessage, undefined, {});
        });
      }
    },

    showSuccessWithLink: function(promises, msgOptions) {
      var successMessage;

      var checkResult = this._checkPromises(promises);
      if (checkResult) {
        var countOk = checkResult.countOk;

        successMessage = this._getSuccessMessage(countOk);

        require([
          'csui/controls/globalmessage/globalmessage'
        ], function (GlobalMessage) {
          GlobalMessage.showMessage("success_with_link", successMessage, undefined, msgOptions);
        });
      }
    },
    _getErrorMessage: function(cnt) {
      var emessages = this.get("errorMessages");
      var errorMessage = base.formatMessage(cnt, emessages);

      return errorMessage;
    },
    _getSuccessMessage: function(cnt) {
      var smessages = this.get("successMessages");
      var successMessage = base.formatMessage(cnt, smessages);

      return successMessage;
    },
    _checkPromises: function(promises) {
      if (!_.isArray(promises)) {
        promises = [promises];
      }

      var okCnt = 0;
      var failedCnt = 0;
      _.each(promises, function (prom) {
        if (prom !== undefined) {
          if (!prom.cancelled) {
            if (prom instanceof CommandError) {
              failedCnt++;
            } else if (typeof prom.state !== 'undefined' && typeof prom.state === 'function') {
              if (prom.state() && prom.state().toLowerCase() === 'resolved') {
                okCnt++;
              } else {
                failedCnt++;
              }
            } else {
              okCnt++;
            }
          }
        }
      });

      return {
        countOk: okCnt,
        countFailed: failedCnt
      };
    },


    _announceStart: function (status) {
      var originatingView = status.originatingView;
      if (originatingView && originatingView.blockActions) {
        originatingView.blockActions();
      }
      var pageLeavingWarning = this.get('pageLeavingWarning');
      if (pageLeavingWarning) {
        PageLeavingBlocker.enable(pageLeavingWarning);
      }
    },

    _announceFinish: function (status) {
      if (this.get('pageLeavingWarning')) {
        PageLeavingBlocker.disable();
      }
      var originatingView = status.originatingView;
      if (originatingView && originatingView.unblockActions) {
        originatingView.unblockActions();
      }
    }

  };

  return MultipleItemsCommand;

});
