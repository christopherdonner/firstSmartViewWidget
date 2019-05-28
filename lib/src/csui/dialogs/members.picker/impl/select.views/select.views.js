/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/log', 'csui/utils/base',
  'i18n!csui/dialogs/members.picker/impl/nls/lang',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'csui/dialogs/members.picker/impl/select.view/select.view',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/commands',
  'hbs!csui/dialogs/members.picker/impl/select.views/selectviews',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/jquery.ui/js/jquery-ui'
], function (module, $, _, Marionette, log, base, lang, MemberModel, MemberChildrenCollection,
    SelectView, ModalAlert, commands, template, ViewEventsPropagationMixin) {
  'use strict';

  var SelectViews = Marionette.ItemView.extend({

    className: 'csui-select-lists',
    template: template,

    constructor: function SelectViews(options) {
      options || (options = {});
      _.defaults(options, {pageSize: 30});

      Marionette.ItemView.prototype.constructor.call(this, options);

      this.commandType = options.commandType;
      this.leftView = this.rightView = null;
      this.rootGroup = options.rootGroup;
      this.invalidMembers = [];

      this.ancestorCollection = options.ancestorCollection;

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

    setParentGroupAsTarget: function (member) {
      var selectable = this.commandType.isSelectable(member);
      this.rightView && this.rightView.clearSelect();
      this.leftView && this.leftView.setNewSelect(member, true);
      return selectable;
    },

    getSelection: function () {
      var rightSelection = this.rightView ? this.rightView.selectedMember : null,
          leftSelection  = rightSelection === null ? this.leftView.selectedMember : null;

      return rightSelection !== null ? rightSelection : leftSelection;
    },

    getNumberOfSelectItems: function () {
      return this.rightView && this.rightView.getNumberOfSelectItems() > 0 ?
             this.rightView.getNumberOfSelectItems() : this.leftView.getNumberOfSelectItems();
    },
    leftNodeId: function () {
      var container = this.leftView.container;
      return container ? container.get('id') : -1;
    },

    setLeftOnly: function () {
      var left   = this._setView(this.rootGroup, 'cs-start-locations left-only', false,
          this.options),
          member = left.view.container,
          self   = this;

      left.promise
          .done(function () {
            if (member) {
              self.leftView.addMemberSelection(member);
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
    newLeftView: function (member, pageSize) {
      var self = this;
      this.options.pageSize = pageSize;
      return this._drillUp(member).done(function (view) {
            self.leftView = view;
            self.leftView.addMemberSelection(member);
            self.trigger('changed');
            self.onDomRefresh();
          })
          .fail(function (resp) {
            self._displayAlert(resp);
          });
    },

    onSelectionChange: function (args, view) {
      var isRightView = view && this._isRightView(view),
          replaceRightView;
      if (args && !args.breadCrumbSelection) {
        if (isRightView) {
          args.add && this.leftView.clearSelect();
        } else {
          if (this.rightView) {
            args.add && this.rightView.clearSelect();
            replaceRightView = this.rightView.container.id !== args.member.id;
          }
        }
      }
      if (args.type === 1) {
        this._updateAncestorCollection(args.member, {
          isLeftView: !isRightView,
          replaceRightView: replaceRightView
        });
      }
      args.member.add = args.add;
      this.trigger('change:complete', args.member);

      return true;
    },

    onBrowse: function (view, args) {
      var isRightView = this._isRightView(view),
          promise     = null;

      this.trigger('changing:selection');

      promise = isRightView ? this.selectRight(args) : this.selectLeft(args);

      promise.done(function () {
        view.trigger('browse:complete');
      }).fail(function () {
        view.clearSelect();
      });

      return promise;
    },

    selectLeft: function (args) {
      var self = this;
      return this._runSelection(args, '.cs-pane-view')
          .done(function (view) {
            if (view) {
              self.rightView = view;
              self.onDomRefresh();
            }
          });

    },

    selectRight: function (args) {
      var self        = this,
          page        = Math.floor((this.leftView.collection.skipCount || 0) /
                                   this.leftView.collection.topCount) + 1,
          pageSize    = parseInt(this.leftView.collection.topCount) * parseInt(page),
          parentId    = args.member.get("parentId"),
          parent      = this.ancestorCollection.get(parentId),
          grandParent = parent && this.ancestorCollection.get(parent.get('parentId'));

      if (this.options.targetBrowseHistory.length === 0) {
        this.options.targetBrowseHistory.push('start.location');
      }
      else {
        var memberObj = {
          "leftId": grandParent ? grandParent.get('id') : null,
          "leftName": grandParent ? grandParent.get("name") : undefined,
          "leftParent": grandParent ? grandParent.get("parentId") : undefined,
          "leftType": grandParent ? grandParent.get("type") : undefined,
          "rightId": parent ? parent.get("id") : undefined,
          "rightName": parent ? parent.get("name") : undefined,
          "rightParent": parent ? parent.get("parentId") : undefined,
          "rightType": parent ? parent.get("type") : undefined,
          "pageSize": pageSize
        };

        this.options.targetBrowseHistory.push(memberObj);
      }
      return this._runSelection(args, '.csui-panel.cs-start-locations').done(function (newView) {
        if (newView) {
          self.leftView = self.rightView;
          self.showBackButton();
          self.rightView = newView;
          self.onDomRefresh();
        }
      });
    },

    showBackButton: function () {
      if (this.leftView && this.options.targetBrowseHistory.length >= 1) {
        this.leftView.headerView.ui.backButton.parent().show();
      }
    },

    hideBackButton: function () {
      if (this.leftView && this.options.targetBrowseHistory.length < 1) {
        this.leftView.headerView.ui.backButton.parent().hide();
      }
    },

    _runSelection: function (args, shiftViewClass) {
      var member   = args.member,
          self     = this,
          deferred = $.Deferred();
      this._drillDown(member, shiftViewClass)
          .done(function (view) {
            self.trigger('changed');
            self.trigger('change:complete', member);
            deferred.resolve(view);
          })
          .fail(function (resp) {
            self._displayAlert(resp);
            self.trigger('change:complete');
            deferred.reject();
          });

      return deferred;
    },
    _drillUp: function (member, rightFlag) {
      var newView  = this._setView(member, 'csui-new-view left-only binf-hidden', 'prepend'),
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

    _drillDown: function (member, removeClass) {
      var newView      = this._setView(member, 'csui-new-view', false),
          panelPromise = null,
          view         = newView.view;

      view.render();

      if (!this.rightView) {
        panelPromise = this._addRightView(newView.promise, view);
      } else {
        panelPromise = this._replaceView(newView.promise, view, removeClass);
      }

      return panelPromise;
    },

    _showLeftOnly: function () {
      var leftView  = this.$el.find('.csui-panel.cs-start-locations'),//leftView  = this.leftView,
          rightView = this.$el.find('.csui-panel.cs-pane-view.csui-slideMidLeft'),
          self      = this,
          width     = '100%';

      rightView.hide();

      leftView.animate({width: width}, {
        duration: 200, complete: animateComplete
      });

      function animateComplete() {
        if (!!rightView) {
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
      newView || ( newView = this.$el.find('.csui-new-view'));
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
        leftView.animate({width: '100%'}, 200);
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
      var selectView = domView[0].selectView;
      this.cancelEventsToViewsPropagation(selectView);
      selectView.destroy();   //selectView is the view object that was added to the DOM element
      domView.remove();

      return true;
    },
    _setView: function (member, className, appendAction, viewOptions) {
      viewOptions || (viewOptions = this._getViewOptions(member, this.connector));
      _.defaults(viewOptions, this.options, {invalidMembers: this.invalidMembers});
      appendAction || (appendAction = 'append');

      var view    = this._newView(viewOptions, className),
          promise = this._fetchView(view);
      view.el.selectView = view;
      this.$el[appendAction](view.el);

      return {view: view, promise: promise};
    },

    _fetchView: function (view) {
      return this._fetchCollection(view);
    },

    _fetchCollection: function (view) {
      view.collection.setOrder(this.options.orderBy, false);
      view.collection.setLimit(0, this.options.pageSize, false);
      return view.collection.fetch({reset: false, merge: false, remove: false});
    },

    _newView: function (args, className) {
      var options = _.extend({
        className: className + ' csui-panel',
        parentEl: this.$el
      }, args);

      var selectView = new SelectView(options);
      this.propagateEventsToViews(selectView);
      this.listenTo(selectView, 'selection:change', this.onSelectionChange);
      this.listenTo(selectView, 'backbutton:click', this._onClickBackButton);
      this.listenTo(selectView, 'browse:select', _.bind(this.onBrowse, this));
      return selectView;
    },

    _onClickBackButton: function () {
      var self = this;
      var lastVisited = this.options.targetBrowseHistory.length > 0 ?
                        this.options.targetBrowseHistory.pop() : undefined;
      this.options.navigateFromHistory = this.options.targetBrowseHistory.length === 1;

      if (!!lastVisited.leftId) {
        var leftMember  = new MemberModel({
              id: lastVisited.leftId,
              name: lastVisited.leftName,
            }, {connector: this.connector}),
            rightMember = new MemberModel({
              id: lastVisited.rightId,
              name: lastVisited.rightName,
            }, {connector: this.connector});
        this.newLeftView(leftMember, lastVisited.pageSize).done(function () {
          self.setParentGroupAsTarget(leftMember);
          self.trigger('change:complete');

          if (self.options.targetBrowseHistory.length > 0 && rightMember && rightMember.get('id')) {
            if (self.$el.find('.cs-left-item-' + rightMember.get('id')).length > 0) {
              self.$el.find('.cs-left-item-' + rightMember.get('id')).trigger("click");
            }
          }
          self.showBackButton();
        });
      } else if (lastVisited === "start.location") {
        this.trigger('change:location', this.options.startLocation);
      }
      else {
        self.hideBackButton();
        var lefMember = new MemberModel({id: this.options.container.groupId},
            {connector: this.connector});
        var nodeId = this.options.container.groupId;
        this.newLeftView(lefMember, lastVisited.pageSize).done(function () {
          self.setParentGroupAsTarget(lefMember);
          var previousIndex = self.ancestorCollection.findByIndex(lastVisited.rightId);
          self.ancestorCollection.findByIndex(lastVisited.rightId);
          self.ancestorCollection.reset(self.ancestorCollection.slice(0, previousIndex));
        });
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

    _getViewOptions: function (member, connector) {
      var memberModel = new MemberModel({
            id: member.get("id"),
            name: member.get("name"),
            parentId: member.get("parentId"),
            nodeId: member.get("nodeId"),
            categoryId: member.get("categoryId"),
            groupId: member.get("groupId")
          },
          {connector: connector}),
          collection  = new MemberChildrenCollection(undefined, {
            member: memberModel,
            autofetch: true,
            orderBy: this.options.orderBy,
            commands: commands.getAllSignatures(),
            connector: this.connector,
            type: this.options.startLocation === "all.groups" ? 1 : null
          });

      return {container: memberModel, collection: collection};
    },

    _displayAlert: function (resp) {
      var msg = _.str.sformat(lang.serverError, 'unknown');
      if (resp) {
        if (resp instanceof SelectView) {
          msg = _.str.sformat(lang.ViewDenied, resp.member.get('name'));
        } else {
          if (resp.responseJSON) {
            msg = resp.responseJSON.error;
          }
        }
      }
      return ModalAlert.showInformation(msg);
    },

    _updateAncestorCollection: function (member, options) {
      var previousIndex = this.ancestorCollection.findByIndex(member.id);
      if (previousIndex >= 0) {
        this.ancestorCollection.reset(this.ancestorCollection.slice(0, previousIndex + 1));
      } else {
        if (options.isLeftView) {
          if (options.replaceRightView) {
            this.ancestorCollection.pop();
          }
        }
        this.ancestorCollection.add(member.clone());
      }
    }

  });

  _.extend(SelectViews.prototype, ViewEventsPropagationMixin);

  return SelectViews;

});
