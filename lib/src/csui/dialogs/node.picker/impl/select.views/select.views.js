/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/utils/log", "csui/utils/base", "i18n!csui/dialogs/node.picker/impl/nls/lang",
  "csui/models/node/node.model", "csui/models/nodechildren",
  "csui/dialogs/node.picker/impl/select.view/select.view",
  "csui/dialogs/modal.alert/modal.alert", 'csui/utils/commands',
  "hbs!csui/dialogs/node.picker/impl/select.views/selectviews",
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/dialogs/node.picker/impl/search.list/search.results.model',
  'csui/lib/binf/js/binf', 'csui/lib/jquery.ui/js/jquery-ui',
  "css!csui/dialogs/node.picker/impl/select.views/selectviews",
  "css!csui/dialogs/node.picker/impl/select.views/slider"
], function (module, $, _, Marionette, log, base, lang,
    NodeModel, NodeChildrenCollection, SelectView, ModalAlert, commands,
    template, ViewEventsPropagationMixin, TabableRegionBehavior, SearchResultCollection) {
  'use strict';

  var SelectViews = Marionette.ItemView.extend({

    className: 'csui-select-lists',
    template: template,
    constructor: function SelectViews(options) {
      options || (options = {});
      _.defaults(options, {pageSize: 30});

      Marionette.ItemView.prototype.constructor.call(this, options);

      this.commandType = options.commandType;
      this.selectableTypes = this.commandType.getSelectableNodeTypes();
      this.listTypes = _.isEmpty(this.selectableTypes) ? [] :
                       _.contains(this.selectableTypes, -1) ? this.selectableTypes :
                       _.union(this.selectableTypes, [-1]);
      this.leftView = this.rightView = null;
      this.invalidNodes = [];

      this.connector = options.connector;
    },

    onRender: function () {
      this.setLeftOnly();

      if (this.leftView) {
        this.leftView.render();
      }

      if (this.rightView) {
        this.rightView.render();
      }
    },

    onDomRefresh: function () {
      this.leftView.triggerMethod('dom:refresh', this.leftView);
      if (this.rightView) {
        this.rightView.triggerMethod('dom:refresh', this.rightView);
      }
    },

    onShow: function () {
      this.leftView.triggerMethod('show');

      if (this.rightView) {
        this.rightView.triggerMethod('show');
      }
    },

    setParentNodeAsTarget: function (node) {
      var selectable = this.commandType.isSelectable(node);
      this.rightView && this.rightView.clearSelect();
      if (!this.commandType.multiSelect) {
        this.leftView && this.leftView.setNewSelect(node, true);
      }
      return selectable;
    },
    getSelection: function () {
      var retVal         = {},
          rightSelection = this.rightView ? this.rightView.selectList : {},
          leftSelection  = this.leftView.selectList;
      _.extend(retVal, leftSelection, rightSelection);

      return retVal;
    },

    getNumberOfSelectItems: function () {
      var totalCount = this.leftView.getNumberOfSelectItems();

      if (this.rightView) {
        totalCount += this.rightView.getNumberOfSelectItems() || 0;
      }

      return totalCount;
    },
    leftNodeId: function () {
      var container = this.leftView.container;
      return container ? container.get('id') : -1;
    },

    setLeftOnly: function () {
      var left = this._setView(-1, 'cs-start-locations left-only', this.options.searchView, false,
          this.options),
          node = left.view.container,
          self = this;

      left.promise
          .done(function () {
            if (node && !self.commandType.multiSelect) {
              self.leftView.addFolderSelection(node);
            }
            if (self.options.searchView) {
              self.trigger("update:searchHeader", this);
            }
            if (self.options.targetBrowseHistory.length === 0 && self.options.searchView) {
              self.options.targetBrowseHistory.push(['location', self.options.previousLocation.id]);
            }
            if (self.options.targetBrowseHistory.length > 0) {
              self.showBackButton();
            } else if (self.options.targetBrowseHistory.length > 1 ||
                       (self.options.targetBrowseHistory.length === 1 &&
                        self.options.navigateFromHistory)) {
              self.showBackButton();
            }
          })
          .fail(function (resp) {
            self.forceClose(resp);
          });

      this.leftView = left.view;
      return left.promise;
    },

    forceClose: function (resp) {
      this
          ._displayAlert(resp)
          .always(this.trigger('close'));
    },
    newLeftView: function (node, pageSize) {
      var newId = node.get('id'),
          self  = this;
      this.options.pageSize = pageSize;
      return this._drillUp(newId).done(function (view) {
        self.leftView = view;
        if (!self.commandType.multiSelect) {
          self.leftView.addFolderSelection(node);
        }
        self.onDomRefresh();
        if (self.options.targetBrowseHistory.length === 0) {
          var page     = Math.floor((self.leftView.collection.skipCount || 0) /
                                    self.leftView.collection.topCount) + 1,
              pageSize = parseInt(self.leftView.collection.topCount) * parseInt(page);
          var nodeObj = {
            "leftId": (self.leftView && self.leftView.container) ?
                      self.leftView.container.get("id") :
                      node.parent ? node.parent.get("id") : undefined,
            "rightId": (self.rightView && self.rightView.container) ?
                       self.rightView.container.get("id") : undefined,
            "pageSize": pageSize
          };
          self.options.targetBrowseHistory.push(['node', nodeObj]);
        }
      }).fail(function (resp) {
        self._displayAlert(resp);
      });
    },

    onSelectionChange: function (args, view) {
      var isRightView = view && this._isRightView(view);

      if (args && args.add) {
        if (isRightView) {
          this.leftView.clearSelect();
        }
        else {
          this.rightView && this.rightView.clearSelect();
        }
      }

      if (view.options.searchView) {
        if (args.node.get("container")) {
          this.trigger('update:searchHeader', args.node);
        } else {
          this.trigger('change:complete', args.node);
        }
      } else {
        this.trigger('change:complete', args.node);
      }
      return true;
    },

    onBrowse: function (view, args) {
      var isRightView = this._isRightView(view),
          promise     = null;
      this.trigger('changing:selection');

      if (isRightView) {
        promise = this.selectRight(args);
      }
      else {
        promise = this.selectLeft(args);
      }

      promise
          .done(function () {
            view.trigger('browse:complete');
          })
          .fail(function () {
            view.clearSelect();
          });
      return promise;
    },

    onClickLocation: function (view, args) {
      this.trigger('click:location', view);
    },

    selectLeft: function (args, view) {
      var self        = this,
          replaceView = 'right';
      if (this.options.searchView) {
        this.options.targetBrowseHistory.push(['search', this.options.query.clone()]);
      }

      return this._runSelection(args, '.cs-pane-view', replaceView)
          .done(function (view) {
            if (view) {
              self.rightView = view;
              self.onDomRefresh();
            }
          });

    },

    selectRight: function (args, view) {
      var self        = this,
          replaceView = 'left';
      if (this.options.targetBrowseHistory.length === 0) {
        this.options.targetBrowseHistory.push(['location', this.options.previousLocation.id]);
      } else {
        var page         = Math.floor((this.leftView.collection.skipCount || 0) /
                                      this.leftView.collection.topCount) + 1,
            pageSize     = parseInt(this.leftView.collection.topCount) * parseInt(page),
            browsedChild = this.leftView.listView.browsedChild,
            nodeObj      = {
              "leftId": browsedChild ? browsedChild.model.parent.get("id") : undefined,
              "rightId": browsedChild ? browsedChild.model.get('id') : undefined,
              "pageSize": pageSize
            };
        this.options.targetBrowseHistory.push(['node', nodeObj]);
      }
      return this._runSelection(args, '.csui-panel.cs-start-locations', replaceView).done(
          function (newView) {
            if (newView) {
              self.leftView = self.rightView;
              self.rightView = newView;
              self.onDomRefresh();
              self.showBackButton();
            }
          });
    },

    showBackButton: function () {
      if (this.leftView && this.options.targetBrowseHistory.length >= 1) {
        this.leftView.headerView && this.leftView.headerView.ui.backBtn.show();
      }
    },

    hideBackButton: function () {
      if (this.leftView && this.options.targetBrowseHistory.length < 1) {
        this.leftView.headerView && this.leftView.headerView.ui.backBtn.hide();
      }
    },

    _runSelection: function (args, shiftViewClass, replaceView) {
      var node     = args.node,
          self     = this,
          deferred = $.Deferred();
      var nodeId = node.get('id');
      this._drillDown(nodeId, shiftViewClass)
          .done(function (view) {
            if (replaceView === 'left') {
              self.onClearLeftViewSelectList();
            } else if (replaceView === 'right') {
              self.onClearRightViewSelectList();
            }
            var browsedModel = (replaceView === 'left' ? self.rightView : self.leftView)
                .listView.browsedChild.model;
            self.trigger('changed', browsedModel.get('id'));
            self.trigger('change:complete', node);
            deferred.resolve(view);
          })
          .fail(function (resp) {
            self._displayAlert(resp);
            self.trigger('change:complete');
            deferred.reject();
          });

      return deferred;
    },

    _drillUp: function (nodeId, rightFlag) {
      this.trigger('drill:up', nodeId);
      var newView  = this._setView(nodeId, 'csui-new-view left-only binf-hidden',
          this.options.searchView, 'prepend'),
          view     = newView.view,
          self     = this,
          deferred = $.Deferred();

      view.$el.addClass('zeroWidth')
          .removeClass('binf-hidden');

      view.render();
      if (!rightFlag) {
        self._removeRightView(newView.promise).done(function () {
          deferred.resolve(newView.view);
        }).fail(function (resp) {
          deferred.reject(resp);
        });
      }
      return deferred;
    },

    _drillDown: function (nodeId, removeClass) {
      var newView      = this._setView(nodeId, 'csui-new-view', false),
          panelPromise = null,
          view         = newView.view;

      view.render();

      if (this.rightView == null) {
        view.options.searchView = false;
        $(".binf-list-group").removeClass("search-left-item");
        if ($(".csui-search-item-left-panel").is(":visible")) {
          $(".binf-list-group").addClass("search-left-folder-right");
        }
        panelPromise = this._addRightView(newView.promise, view);
      } else {
        panelPromise = this._replaceView(newView.promise, view, removeClass);
      }

      return panelPromise;
    },

    _showLeftOnly: function () {
      var leftView  = this.leftView,
          rightView = this.rightView,
          self      = this,
          width     = '100%';

      leftView.animate({width: width}, {
        duration: 200, complete: animateComplete
      });

      function animateComplete() {
        if (rightView != null) {
          var selectView = rightView[0].selectView;
          self.cancelEventsToViewsPropagation(selectView);
          selectView.destroy();   //selectView is the view object that was added to the DOM element
          rightView.remove();
          self.rightView = null;
        }
      }
    },

    _removeRightView: function (fetchPromise) {
      var newView   = this.$el.find('.csui-new-view'),
          leftView  = this.$el.find('.csui-panel.cs-start-locations'),
          rightView = this.$el.find('.cs-pane-view'),
          deferred  = $.Deferred(),
          self      = this;

      leftView.hide();
      rightView.hide();
      newView[0].className = 'csui-panel cs-start-locations left-only';

      fetchPromise.done(function () {
        self._finishRightRemove(newView, leftView, rightView);
        deferred.resolve();
      }).fail(function (resp) {
        self._removeNewView(newView, leftView, rightView);
        deferred.reject(resp);
      });

      return deferred;
    },

    _removeNewView: function (newView, leftView, rightView) {
      newView || (newView = this.$el.find('.csui-new-view'));
      var selectView = newView[0].selectView;
      this.cancelEventsToViewsPropagation(selectView);
      selectView.destroy();
      newView.remove();
      leftView && leftView.show();
      rightView && rightView.show();
    },

    _finishRightRemove: function (newView, leftView, rightView) {
      var selectView;
      if (rightView.length > 0) {
        selectView = rightView[0].selectView;
        this.cancelEventsToViewsPropagation(selectView);
        selectView.destroy();   //selectView is the view object that was added to the DOM element
        rightView.remove();
        this.rightView = null;
      }

      selectView = leftView[0].selectView;
      this.cancelEventsToViewsPropagation(selectView);
      selectView.destroy();
      leftView.remove();
      this.leftView = null;

      return true;
    },

    _addRightView: function (fetchPromise, selectView) {
      var leftView = this.$el.find('.csui-panel.cs-start-locations'),
          newView  = this.$el.find('.csui-new-view'),
          deferred = $.Deferred(),
          self     = this;

      leftView[0].className = 'csui-panel cs-start-locations';
      newView[0].className = 'csui-panel cs-pane-view csui-slideMidLeft';

      fetchPromise.done(function () {
        deferred.resolve(selectView);
      }).fail(function (resp) {
        self._removeNewView(newView);
        leftView.animate({width: '100%'}, {
          duration: 200,
          complete: function () {
            leftView.addClass('left-only').css('width', '');
          }
        });
        self.leftView.clearSelect();
        self.leftView.refresh();
        deferred.reject(resp);
      });

      return deferred;
    },

    _replaceView: function (fetchPromise, selectView, removeClass) {
      var view      = this.$el.find(removeClass),
          newView   = $('.csui-new-view'),
          rightView = $('.cs-pane-view'),
          deferred  = $.Deferred(),
          self      = this;

      view.hide();
      switch (removeClass) {
      case '.csui-panel.cs-start-locations':
        rightView[0].className = 'csui-panel cs-start-locations csui-slideLeft';
        newView[0].className = 'csui-panel cs-pane-view csui-slideMidLeft';
        break;
      case '.cs-pane-view':
        newView[0].className = 'csui-panel cs-pane-view csui-slideMidLeft';
      }
      this.$el.find('.left-only').removeClass('left-only');
      fetchPromise.done(function () {
        self._removeView(view);
        deferred.resolve(selectView);
      }).fail(function (resp) {
        self._reverseRemoveView(newView, removeClass, rightView);
        if (removeClass === '.csui-panel.cs-start-locations') {
          view.show();
        }
        deferred.reject(resp);
      });

      return deferred;
    },

    _reverseRemoveView: function (domView, className, rightView) {
      this._removeNewView(domView);
      switch (className) {
      case '.csui-panel.cs-start-locations':
        rightView[0].className = 'csui-panel cs-pane-view csui-slideRight';
        this.rightView.refresh();
        break;
      case '.cs-pane-view':
        this._removeView(rightView);
        this.leftView.$el[0].className = 'csui-panel cs-start-locations left-only';
        this.leftView.clearSelect();
        this.leftView.refresh();
      }
      return true;
    },

    _removeView: function (domView) {
      if (domView.length) {
        var selectView = domView[0].selectView;
        this.cancelEventsToViewsPropagation(selectView);
        selectView.destroy();   //selectView is the view object that was added to the DOM element
        domView.remove();
        return true;
      } else {
        return false;
      }
    },
    _setView: function (nodeId, className, searchView, appendAction, viewOptions) {
      viewOptions || (viewOptions = this._getViewOptions(nodeId, this.connector));
      this.options.searchView = searchView;
      _.defaults(viewOptions, this.options, {invalidNodes: this.invalidNodes});
      appendAction || (appendAction = 'append');

      var view    = this._newView(viewOptions, className),
          promise = this._fetchView(view);
      if (searchView) {
        this.options.fromSearch = true;
      } else {
        this.options.fromSearch = false;
      }
      view.el.selectView = view;
      this.$el[appendAction](view.el);

      return {view: view, promise: promise};
    },

    _fetchView: function (view) {

      this._fetchContainer(view);
      return this._fetchCollection(view);
    },

    _fetchContainer: function (view) {
      if (view.container && view.container.get("id")) {
        view.container.fetch();
      }
      return true;
    },

    _fetchCollection: function (view) {
      view.collection.setOrder(this.options.orderBy, false);
      view.collection.setFilter({type: this.listTypes}, false);
      view.collection.setLimit(0, this.options.pageSize || view.options.pageSize, false);

      var deferred = $.Deferred(), self = this;
      var promise = view.collection.fetch({reset: false, merge: false, remove: false});
      promise.done(function (result) {
        view.listView.resolveShortcuts(view.collection).always(function() {
          deferred.resolve(view.collection);
        });
      }).fail(function (resp) {
        deferred.reject(resp);
      });

      return deferred;
    },

    _newView: function (args, className) {
      var self    = this,
          options = _.extend({
            listTypes: this.listTypes,
            className: className + ' csui-panel',
            parentEl: this.$el
          }, args);

      var selectView = new SelectView(options);
      this.propagateEventsToViews(selectView);
      this.listenTo(selectView, 'selection:change', this.onSelectionChange);
      this.listenTo(selectView, 'search:failed', this._searchFailed);
      this.listenTo(selectView, 'backbutton:click', this._onClickBackButton);
      this.listenTo(selectView, 'clear:selectList', this.onClearLeftViewSelectList);
      this.listenTo(selectView, 'browse:select', _.bind(this.onBrowse, this));
      this.listenTo(selectView, 'click:location', _.bind(this.onClickLocation, this));
      return selectView;
    },

    onClearLeftViewSelectList: function () {
      if (!!this.leftView) {
        this.leftView.selectList = {};
      }
    },

    onClearRightViewSelectList: function () {
      if (!!this.rightView) {
        this.rightView.selectList = {};
      }
    },

    _onClickBackButton: function (args) {
      var self = this;
      var lastVisited = this.options.targetBrowseHistory.length > 0 ?
                        this.options.targetBrowseHistory.pop() : undefined;
      if (this.options.targetBrowseHistory.length === 1) {
        this.options.navigateFromHistory = true;
      } else {
        this.options.navigateFromHistory = false;
      }
      if (lastVisited && lastVisited[0] === "search") {
        this.requestedQueryModel = lastVisited[1];
        this.trigger("back:toSearch", this);
        if (this.options.targetBrowseHistory.length > 0) {
          this.showBackButton();
        }
      } else if (lastVisited && lastVisited[0] === "location") {
        this.onClearLeftViewSelectList();
        this.onClearRightViewSelectList();
        this.trigger("change:location", lastVisited);
      } else if ((this.options.searchView && lastVisited && lastVisited[0] === "node") ||
                 (lastVisited && lastVisited[0] === "node")) {
        this.options.searchView = false;
        var leftNode  = new NodeModel({id: lastVisited[1].leftId}, {connector: this.connector}),
            rightNode = new NodeModel({id: lastVisited[1].rightId}, {connector: this.connector});
        this.newLeftView(leftNode, lastVisited[1].pageSize).done(function (view) {
          self.setParentNodeAsTarget(leftNode);
          self.trigger('change:complete');

          self.trigger('toggle:breadcrumbs', self.leftNodeId());
          if (self.options.targetBrowseHistory) {
            self.hideBackButton();
          }

          if (self.options.targetBrowseHistory.length > 0 && rightNode && rightNode.get('id')) {
            if (self.$el.find('.cs-left-item-' + rightNode.get('id')).length > 0) {
              self.$el.find('.cs-left-item-' + rightNode.get('id')).trigger("click");
            }
            self.showBackButton();
          } else {
            self.hideBackButton();
          }
        });
      }
      this.options.backBtn = true;
    },

    _searchFailed: function (args) {
      var isRightView = this._isRightView(args.view);

      if (!isRightView) {
        this.forceClose(args.resp);
      }
      else {
        this._displayAlert(args.resp);
      }
    },

    _isRightView: function (view) {
      var viewClasses = view.$el[0].className.split(' ');
      return _.contains(viewClasses, 'cs-pane-view');
    },

    _addNewPanel: function (className, action) {
      var div = document.createElement('div');
      div.className = className;
      this.$el[action](div);

      return div;
    },

    _getViewOptions: function (nodeId, connector) {
      var node       = new NodeModel({id: nodeId}, {connector: connector}),
          collection = new NodeChildrenCollection(undefined, {
            node: node,
            autofetch: true,
            orderBy: this.options.orderBy,
            expand: ['node'],
            commands: commands.getAllSignatures()
          });

      return {container: node, collection: collection};
    },

    _displayAlert: function (resp) {
      var msg = _.str.sformat(lang.serverError, 'unknown');
      if (resp) {
        if (resp instanceof SelectView) {
          msg = _.str.sformat(lang.ViewDenied, resp.node.get('name'));
        }
        else {
          if (resp.responseJSON) {
            msg = resp.responseJSON.error;
          }
        }
      }
      return ModalAlert.showInformation(msg);
    }

  });

  _.extend(SelectViews.prototype, ViewEventsPropagationMixin);

  return SelectViews;

});
