/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
      'csui/lib/marionette', 'csui/models/nodes', 'csui/utils/commands',
      'csui/utils/contexts/factories/member',
      'csui/utils/base',
      'i18n!csui/widgets/html.editor/impl/nls/lang',
      'hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu',
      'hbs!csui/widgets/html.editor/impl/dropdown.menu/dropdown.option'],
    function (module, _, $, Backbone, Marionette, NodeCollection, commands,
        MemberModelFactory, base, lang, TemplateDropdownMenu, TemplateDropdownOption) {
      'use strict';

      var DropdownOption = Marionette.ItemView.extend({
        tagName: 'li',
        template: TemplateDropdownOption,
        events: {
          'click a': '_executeAction',
          'keyup a': 'onKeyUp'
        },
        templateHelpers: function () {
          return {
            actionName: lang[this.model.get('signature') || this.model.get('name')]
          };
        },
        constructor: function (options) {
          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },
        _executeAction: function () {
          if (this.options.openForEdit) {
            this.options.openForEdit();
          } else {
            var self = this;
            this.options.command.execute(this.options.status).always(function () {
              self.trigger('csui.command.executed', this);  // this contains promise object
            });
          }
        },

        onKeyUp: function (event) {
          if ([13, 32].indexOf(event.keyCode) !== -1) { // enter, space
            this._executeAction();
          }
        }
      });

      var DropdownMenuView = Marionette.CompositeView.extend({
        className: "csui-html-editor-dropdown",
        template: TemplateDropdownMenu,
        childView: DropdownOption,
        childViewContainer: "ul.binf-dropdown-menu",
        childEvents: {
          'csui.command.executed': 'afterCommandExecution'
        },
        ui: {
          'dropdownMenu': '.binf-dropdown-menu'
        },
        childViewOptions: function (actionModel) {
          var signature = !!actionModel.get('openForEdit') ? 'HTMLEdit' :
                          actionModel.get('signature');
          var options = {
            status: this.status,
            node: this.options.node
          };
          if (signature === 'HTMLEdit') {
            options.openForEdit = this.options.openForEdit;
          } else {
            if (signature === 'properties') {
              signature = "Properties";
            } else if (['reserve', 'unreserve'].indexOf(signature) !== -1) {
              if (signature === 'unreserve') {
                signature = "Unreserve";
              } else {
                signature = "Reserve";
              }
              signature += 'Doc';
            }
            options.command = commands.get(signature);
          }
        
        
          return options;
        },
        templateHelpers: function () {
          var helpers = {
            haveEditPermission: this.haveEditPermissions,
            tooltip: lang.more,
            iconClass: 'icon-html-edit-toolbar-more',
            reserved: this.node.get('reserved'),
            moreActionsAria: _.str.sformat(lang.moreActionsAria,
                !!this.parentView.options.title ? this.parentView.options.title : '')
          };
          if (helpers.reserved) {
            var selfReserved = this.node.get('reserved_user_id') === this.user.get(
                    'id');
            if (!selfReserved) {
              helpers.tooltip = _.str.sformat(lang.reservedBy, this.node.get('reserved_user_id'),
                  base.formatExactDate((
                      this.node.get('reserved_date'))));
            }
            helpers.iconClass = selfReserved ? 'icon-html-editor-reserved-owned' :
                                'icon-html-editor-reserved_other';
          }
          return helpers;
        },

        constructor: function DropdownMenuView(options) {
          this.parentView = options.parentView;
          this.node = options.node;
          this.user = options.user;
          this.haveEditPermissions = !!(options.node.actions.get('reserve') || options.node.actions
              .get('unreserve'));
          options.collection = this.buildCollection();
          Marionette.CompositeView.prototype.constructor.apply(this, arguments);
          this.listenTo(this.options.node, 'change', this.updateActionCollection);
          this.status = {
            context: this.options.context,
            container: this.options.node,
            nodes: new NodeCollection([this.options.node])
          };
          if (this.node.get('reserved') &&
              this.node.get('reserved_user_id') !== this.user.get('id')) {
            this.reservedByUserModel = this.options.context.getModel(MemberModelFactory, {
              attributes: {
                id: this.node.get('reserved_user_id')
              }
            });
          }
        },

        buildCollection: function () {
          var collection = new Backbone.Collection();
          if (this.haveEditPermissions) {
            if (!this.node.get('reserved') ||
                this.node.get('reserved_user_id') === this.user.get('id')) {
              collection.add(new Backbone.Model({
                openForEdit: true,
                name: 'Edit'
              }));
            }
            var action, supportedActions = ['properties', 'permissions', 'unreserve'],
                self                     = this;
            supportedActions.map(function (action) {
              action = self.node.actions.get(action);
              action && collection.add(action);
            });
          }
          return collection;
        },

        updateActionCollection: function () {
          this.haveEditPermissions = !!(this.options.node.actions.get('reserve') ||
                                        this.options.node.actions.get('unreserve'));
          this.collection = this.buildCollection();
          this.render();
        },

        afterCommandExecution: function (childView, promise) {
          promise.fail(_.bind(function () {
            if (childView.model.get('name') === 'Unreserve') {
              this.node.fetch();
            }
          }, this));
        },
        adjustDropdownMenu: function () {
          if (document.dir === 'rtl') {
            return false;
          }
          this.ui.dropdownMenu.removeClass("csui-html-editor-floating-dd-menu");
          var dropdownLeftOffset   = this.ui.dropdownMenu.offset().left,
              dropdownWidth        = this.ui.dropdownMenu.outerWidth(),
              originatingViewWidth = document.body.scrollWidth,
              ddMenuOverlaps       = dropdownLeftOffset + (2 * dropdownWidth) <=
                                     originatingViewWidth;
          if (ddMenuOverlaps) {
            this.ui.dropdownMenu.addClass("csui-html-editor-floating-dd-menu");
          }
        },
        onRender: function () {
          var dropDown = this.$el.find('.binf-dropdown');
          dropDown.bind('binf.dropdown.before.show', _.bind(function () {
            dropDown.bind('binf.dropdown.after.show', this.adjustDropdownMenu.bind(this));
            $(window).bind('resize.html.editor.dropdown.menu', this.adjustDropdownMenu.bind(
                this));
          }, this));
          dropDown.bind('hide.binf.dropdown', _.bind(function () {
            dropDown.unbind('binf.dropdown.after.show');
            $(window).unbind('resize.html.editor.dropdown.menu');
          }));
          if (!!this.reservedByUserModel && !this.reservedByUserModel.fetched) {
            this.reservedByUserModel.fetch().done(_.bind(function (response) {
              this.$el.find('.binf-dropdown-toggle.csui-html-editor-control,' +
                            ' .csui-html-editor-reserved-readonly').attr('title',
                  _.str.sformat(lang.reservedBy, response.data.display_name,
                      base.formatExactDate((
                          this.node.get('reserved_date')))));
            }, this));
          }
        }
      });
      return DropdownMenuView;
    });
