/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/url', 'csui/utils/base', 'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/models/form', 'csui/controls/form/form.view',
  'csui/widgets/metadata/property.panels/categories/impl/category.form.view',
  'csui/models/appliedcategories', 'csui/widgets/metadata/impl/metadata.forms',
  'csui/dialogs/modal.alert/modal.alert', 'csui/controls/progressblocker/blocker',
  'csui/models/version', 'csui/widgets/metadata/impl/metadata.utils', 'i18n',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/widgets/metadata/general.form.fields/general.form.field.behavior',
  'csui/widgets/metadata/general.action.fields/general.action.field.behavior',
  'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/widgets/metadata/metadata.property.panels',
  'csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu.view',
  'csui/widgets/metadata/add.properties.menuitems',
  'csui/widgets/metadata/add.properties.menuitems.mask',
  'csui/widgets/metadata/impl/tab.contents.header/tab.contents.header.view',
  'csui/controls/form/pub.sub',
  'csui/widgets/metadata/impl/metadata.tabcontentcollection.view',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, Marionette, Url, base, TabPanelView, TabLinkCollectionViewExt,
    TabLinksScrollMixin, FormModel, FormView, CategoryFormView, AppliedCategoryCollection,
    MetadataFormCollection, ModalAlert, BlockingView, VersionModel, MetadataUtils, i18n,
    PerfectScrollingBehavior, GeneralFormFieldBehavior, GeneralActionFieldBehavior, lang,
    metadataPropertyPanels,
    AddPropertiesDropdownMenuView, toolbarItems, AddPropertiesMenuItemsMask,
    TabContentHeaderView, PubSub, MetadataTabContentCollectionView) {
  var AppliedCategoryActionsCollection = AppliedCategoryCollection.extend({

    constructor: function AppliedCategoryActionsCollection(attributes, options) {
      AppliedCategoryCollection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
      _.defaults(this.options, {urlResource: ''});
    },

    url: function () {
      return Url.combine(this.node.urlBase(), this.options.urlResource);
    },

    fetch: function () {
      if (this.node instanceof VersionModel ||
          this.node.get("id") === undefined || this.options.action) {
        this.fetching = false;
        this.fetched = true;
        return $.Deferred().resolve();
      }

      return AppliedCategoryCollection.prototype.fetch.apply(this, arguments);
    },

    parse: function () {
      if (this.node instanceof VersionModel) {
        return {};
      }
      if (this.node.get("id") === undefined || this.options.action) {
        return {categories_add: "dummy value"};
      }
      return AppliedCategoryCollection.prototype.parse.apply(this, arguments);
    }

  });
  var MetadataPropertiesViewImpl = TabPanelView.extend({

    className: (base.isTouchBrowser() ? 'cs-touch-browser ' : '') + 'cs-metadata-properties' +
               ' binf-panel binf-panel-default',

    rtlEnabled: i18n.settings.rtl,

    contentView: function (model) {
      var panel = _.findWhere(this._propertyPanels, {model: model});
      if (panel) {
        return panel.contentView || FormView;
      }
      if (model.get('role_name') === 'categories') {
        return CategoryFormView;
      }
      return FormView;
    },

    contentViewOptions: function (model) {
      var options = {
            context: this.options.context,
            node: this.options.node,
            mode: this.options.formMode,
            fetchedModels: this.allForms,
            displayedModels: this.collection,
            originatingView: this,
            layoutMode: 'doubleCol',
            metadataView: this.options.metadataView,
            generalFormFieldDescriptors: this._generalFormFieldDescriptors,
            generalActionFieldDescriptors: this._generalActionFieldDescriptors
          },
          panel   = _.findWhere(this._propertyPanels, {model: model});
      if (panel) {
        _.extend(options, panel.contentViewOptions);
      }
      return options;
    },
    isTabable: function () {
      if (this.options.notTabableRegion === true) {
        return false;
      }
      return true;  // this view can be reached by tab
    },

    constructor: function MetadataPropertiesViewImpl(options) {
      options || (options = {});
      var delete_icon;

      if (base.isTouchBrowser()) {
        delete_icon = 'category_delete-touch-browser';
      } else {
        delete_icon = 'category_delete';
      }

      _.defaults(options, {
        tabType: 'binf-nav-pills',
        mode: 'spy',
        extraScrollTopOffset: 3,
        formMode: 'update',
        toolbar: true,
        toolbarItems: toolbarItems,
        delete_icon: delete_icon,
        delete_tooltip: lang.removeCategoryTooltip,
        contentView: this.getContentView,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        TabContentCollectionViewClass: MetadataTabContentCollectionView,
        searchTabContentForTabableElements: true,
        tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                                ' select:not([disabled]), textarea:not([disabled]),' +
                                ' button:not([disabled]), iframe, object, embed,' +
                                ' *[tabindex], *[data-cstabindex], *[contenteditable]'
      });

      if (!options.toolbarItemsMask) {
        options.toolbarItemsMask = new AddPropertiesMenuItemsMask();
      }

      this.behaviors = _.extend({
        PerfectScrolling: {
          behaviorClass: PerfectScrollingBehavior,
          contentParent: '> .binf-tab-content',
          scrollXMarginOffset: 30,
          scrollYMarginOffset: 15
        }
      }, this.behaviors);

      if (options.collection) {
        this.allForms = options.collection;
      } else {
        this.allForms = new MetadataFormCollection(undefined, {
          node: options.node,
          connector: options.node.connector,
          container: options.container,
          action: options.action,
          inheritance: options.inheritance,
          autoreset: true,
          formCollection: options.formCollection
        });
        options.collection = new Backbone.Collection();
      }
      if (options.node.newCategories === undefined) {
        options.node.newCategories = new Backbone.Collection();
      }
      if (options.node.removedCategories === undefined) {
        options.node.removedCategories = [];
      }

      TabPanelView.prototype.constructor.apply(this, arguments);

      this.widths = [];

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      PubSub.off('pubsub:tab:contents:panel:textarea:scrollupdate');
      this.listenTo(PubSub, 'pubsub:tab:contents:panel:textarea:scrollupdate',
          this._updateToTextAreaScrollbar);

      this.listenTo(this.allForms, "request", this.blockActions)
          .listenTo(this.allForms, "request", this._checkFormFetching)
          .listenTo(this.allForms, "sync", this._syncForms)
          .listenTo(this.allForms, "sync", this.unblockActions)
          .listenTo(this.allForms, "destroy", this.unblockActions)
          .listenTo(this.allForms, "error", this.unblockActions)
          .listenTo(this.collection, "reset", this.render)
          .listenTo(options.node, 'change:id', function () {
            if (this.options.formMode !== 'create') {
              this._fetchForms();
            }
          }).listenTo(this, 'reset:switch', this._resetRequiredSwitchView)
          .listenTo(this, "update:button", _.bind(function (flag) {
            this.options.metadataView.trigger("update:button", {overlay: flag});
          }, this));
      if (this.allForms.fetching) {
        this.blockActions();
      }

      $(window).bind('resize', {view: this}, this._onWindowResize);
      $(window).bind('resize.tableview', {view: this}, this._onWindowResize);
      this.listenTo(this, 'render', this.onRendered);
      this.listenTo(Backbone, 'metadata:schema:updated', function (model) {
        this.resolveHasRequiredFields(model);
        this.has_required_fields = this.collection
            .filter(
                function (model) {
                  return model.get('required') === true;
                });
        this.tabLinks.trigger('metadata:schema:updated', model);
        this.tabContentHeader.trigger('metadata:schema:updated', model);
      }, this);
    },

    onBeforeDestroy: function () {
      $(window).unbind('resize', this._onWindowResize);
      $(window).unbind('resize.tableview', this._onWindowResize);

      if (this.addPropertiesView) {
        this.cancelEventsToViewsPropagation(this.addPropertiesView);
        this.addPropertiesView.destroy();
      }

      if (this.contentHeaderRegion) {
        this.contentHeaderRegion.empty();
      }
    },

    _updateScrollbar: function () {
      this.trigger('update:scrollbar');
      this.$(this.behaviors.PerfectScrolling.contentParent).animate({scrollTop: 0}, "fast");
    },

    _updateToTextAreaScrollbar: function (data) {
      this.trigger('update:scrollbar');
      var scrollTop = data.$el.offset().top -
                      this.$(this.behaviors.PerfectScrolling.contentParent).offset().top;
      if (this.$(this.behaviors.PerfectScrolling.contentParent).scrollTop() > 0) {
        this.$(this.behaviors.PerfectScrolling.contentParent).animate({scrollTop: scrollTop},
            "fast");
      }
    },

    _activateSelectedPropertyTab: function () {
      var selectedProperty = this.options.selectedProperty;
      if (selectedProperty && selectedProperty instanceof Backbone.Model) {
        if (this.collection && this.collection.length > 0) {
          var id = selectedProperty.get('id');  // primary check
          var title = selectedProperty.get('title');  // fallback check
          var i, model, matchIndex = -1;
          for (i = 0; i < this.collection.length; i++) {
            model = this.collection.at(i);
            if (id === model.get('id') || title === model.get('title')) {
              matchIndex = i;
              break;
            }
          }
          if (matchIndex !== -1) {
            this.options.activeTab.set("tabIndex", matchIndex);
            this.tabLinks.children.findByIndex(matchIndex).activate();
          }
        }
      }
    },
    render: function () {
      var dataFetched = true;
      if (!this.allForms.fetched && !this.allForms.error) {
        dataFetched = false;
        if (!this._fetchingForms) {
          this._fetchForms();
        }
      }
      if (dataFetched === false || this._fetchingForms) {
        return this;
      }

      if (this.collection.length === 1) {
        var singleFormModel = this.collection.first(),
            schema          = _.clone(singleFormModel.get('schema'));
        schema.title = '';
        singleFormModel.set('schema', schema);
      }

      var self = this;
      this.collection.each(function (model, index) {
        var has_required_fields = self.resolveHasRequiredFields.call(self, model);
        if (has_required_fields) {
          self.hasRequiredField = true;
        }
      });
      _.extend(this, {
        _: _
      });
      TabPanelView.prototype.render.apply(this);
      this._createAddPropertiesView();
      this._initializeOthers();
      return this;
    },

    resolveHasRequiredFields: function (model) {
      var metadataUtils = new MetadataUtils();
      var has_required_fields = metadataUtils.AlpacaFormOptionsSchemaHaveRequiredFields(
          model.get('options'), model.get('schema'), model.get('id')
      );
      model.set('required', has_required_fields);
      return has_required_fields;
    },

    onRendered: function () {
      this._setTablinksAttributes();
      setTimeout(_.bind(this._setTablinksAttributes, this), 300);
      this.tabLinks.stopListening(this.collection, 'reset');
      this.tabContent.stopListening(this.collection, 'reset');
      if (this.tabContentHeader) { // clean-up completely tab content's header if it not yet.
        this.tabContentHeader.destroy();
        this.$el.find(".csui-tab-contents-header-wrapper").remove();
      }

      this.listenTo(this.tabLinks, 'childview:delete:tab', _.bind(this._onDeleteCategory, this));
      this.tabLinks.$el.addClass('binf-hidden');
      this.tabContent.$el.addClass('binf-hidden');
      this.blockActions();
      this.updateTitle = true;
      var allFormsRendered = [],
          self             = this;
      this.tabContent.children.each(_.bind(function (childView) {
        var formRendered = $.Deferred();
        allFormsRendered.push(formRendered.promise());
        var childViewContent = childView.content;
        if (childViewContent instanceof FormView && !childViewContent.isRenderFinished()) {
          this.listenTo(childViewContent, 'render:form', function (childViewContent) {
            var formHtmlRegion = !!childViewContent.$el.find(".cs-form-singlecolumn") ?
                                 childViewContent.$el.find(".cs-form-singlecolumn") :
                                 childViewContent.$el.find(".cs-form-doublecolumn");
            if (!!formHtmlRegion && formHtmlRegion.length > 0) {
              if (!!formHtmlRegion.html()) {
                formRendered.resolve();
              }
            } else {
              formRendered.resolve();
            }
          });
        } else {
          formRendered.resolve();
        }
      }, this));
      $.when.apply($, allFormsRendered).done(function () {
        self.unblockActions();
        self.tabLinks.$el.removeClass('binf-hidden');
        var canHaveTabContentHeader = !!self.collection.findWhere({id: 'general'});
        if (canHaveTabContentHeader) {
          var objPubSubId = (self.options.node instanceof VersionModel ? 'v' : 'p');
          objPubSubId = 'pubsub:tab:contents:header:view:switch:' + objPubSubId +
                        self.options.node.get('id');
          PubSub.off(objPubSubId);
          self.listenTo(PubSub, objPubSubId, self._onRequiredSwitch);

          self.tabContent.$el.before("<div class='csui-tab-contents-header-wrapper'></div>");
          self.contentHeaderRegion = new Marionette.Region({
            el: self.$el.find('.csui-tab-contents-header-wrapper')
          });
          self.tabContentHeader = new TabContentHeaderView(self.options);
          self.contentHeaderRegion.show(self.tabContentHeader);
        }

        if (!!self.tabContentHeader && !!self.options.node.collection.requireSwitched &&
            !!self.hasRequiredField) {
          self._hideNotRequiredFormFields(true);
        }
        self.tabContent.$el.removeClass('binf-hidden');
        if (self.addPropertiesView && self.rightToolbar) {
          var apv = self.addPropertiesView.render();
          Marionette.triggerMethodOn(apv, 'before:show', apv, self);
          self.rightToolbar.append(apv.el);
          Marionette.triggerMethodOn(apv, 'show', apv, self);
          self.allFormsRendered = true;
        }
        var firstVisibleTabLink,
            firstVisibleTab = self.tabLinks.collection.find(function (tabModel) {
              var tabLink = self.tabLinks.children.findByModel(tabModel);
              return !tabLink.$el.hasClass('binf-hidden');
            });
        if (firstVisibleTab &&
            !(firstVisibleTabLink = self.tabLinks.children.findByModel(
                firstVisibleTab)).isActive()) {
          firstVisibleTabLink.activate();
        }

        self._initializeOthers();
        self.triggerMethod('render:forms', this);
        setTimeout(function () {
          self._computeTablinkWidth();
          self._enableToolbarState();
        }, 300);
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);

        if (self.options.formMode !== "create") {
          self.setFocus();
        }
        self.trigger('update:scrollbar');
        if (self.updateTitle) {
          var objPubSubTabId = (self.options.node instanceof VersionModel ? 'v' : 'p') +
                               self.options.node.get('id');
          objPubSubTabId = 'pubsub:tab:contents:header:view:change:tab:title:' +
                           objPubSubTabId;
          PubSub.trigger(objPubSubTabId, firstVisibleTabLink.el.innerText);
        }
        self._activateSelectedPropertyTab();
      });

      if (this.$el && !this.$el.is(":visible")) {
        this.updateTitle = false;
      }
      this.childWithBlockingView &&
      this.childWithBlockingView.metadataHeaderView.metadataItemNameView.ui.toggleIcon.attr(
          'tabindex', 0);
    },

    onShow: function () {
    },

    setFocus: function () {
    },

    _computeTablinkWidth: function () {
      var tabLinksBar = this.$el.find('.tab-links-bar');
      var tabLinks = tabLinksBar && tabLinksBar.find('ul > li');
      tabLinksBar && tabLinksBar.removeClass('wide-tablink very-wide-tablink');
      if (tabLinksBar && tabLinksBar.length > 0 && tabLinks && tabLinks.length > 1) {
        var tabLinksBarWidth = $(tabLinksBar[0]).width();
        var totalTablinksWidth = 0;
        var i, numTabs = 0;
        for (i = 0; i < tabLinks.length; i++) {
          var $tabLink = $(tabLinks[i]);
          if (!($tabLink.hasClass('hidden-by-switch'))) {
            totalTablinksWidth += $tabLink.width();
            numTabs++;
          }
        }
        var oneTablinkWidth = numTabs > 0 ? (totalTablinksWidth / numTabs) : $(tabLinks[0]).width();
        var totalWidthCheck1 = totalTablinksWidth * 2;  // twice smaller
        var totalWidthCheck2 = totalTablinksWidth + (1.3 * oneTablinkWidth);  // a little smaller
        if (tabLinksBarWidth > totalWidthCheck1) {
          tabLinksBar.addClass('very-wide-tablink');
        } else if (tabLinksBarWidth > totalWidthCheck2) {
          tabLinksBar.addClass('wide-tablink');
        } else {
          tabLinksBar.removeClass('wide-tablink very-wide-tablink');
        }
      }
    },

    onPanelActivated: function () {
      setTimeout(_.bind(function () {
        this._setTablinksAttributes();
        this._enableToolbarState();
      }, this), 300);
    },
    validateForms: function () {
      var allFormsValid = true;
      if (!!this.allFormsRendered) {
        this.tabContent.children.each(function (tab) {
          var isCurrentFormValid = tab.content.validate();
          allFormsValid = allFormsValid && isCurrentFormValid;
        });
        allFormsValid ? this._hideValidationError() : this._showValidationError();
        return allFormsValid;
      } else {
        return false;
      }
    },
    getFormsValues: function () {
      var formValues = {},
          formFieldValues, formFieldRoles, roles, role;

      this.tabContent.children.each(function (tab) {
        var values   = tab.content.getValues(),
            roleName = tab.content.model.get("role_name"),
            category, catId;

        if (values) {
          if (roleName) {
            roles = formValues.roles || (formValues.roles = {});
            role = roles[roleName] || (roles[roleName] = {});
            if (roleName === 'categories') {
              catId = tab.model.get("id").toString();
              category = role[catId] || (role[catId] = {});
              if (_.isEmpty(values)) {
                category = null;
              } else {
                _.extend(category, values);
              }
            } else {
              _.extend(role, values);
            }
          } else {
            _.extend(formValues, values);
          }
        }
      });
      if (this.options.node.removedCategories.length > 0) {
        roles = formValues.roles || (formValues.roles = {});
        role = roles['categories'] || (roles['categories'] = {});
        _.each(this.options.node.removedCategories, function (removedCatId) {
          role[removedCatId] || (role[removedCatId] = {});
        });
      }

      var generalTab = this.tabContent.children.find(function (tab) {
        return !!tab.content.getGeneralFormFieldValues;
      });
      if (generalTab) {
        formFieldValues = generalTab.content.getGeneralFormFieldValues();
        formFieldRoles = formFieldValues.roles || {};
        delete formFieldValues.roles;
        _.extend(formValues, formFieldValues);
        _.each(_.keys(formFieldRoles), function (roleName) {
          roles = formValues.roles || (formValues.roles = {});
          role = roles[roleName] || (roles[roleName] = {});
          _.extend(role, formFieldRoles[roleName]);
        });
      }

      return formValues;
    },

    _addValidationErrorElement: function () {
      if (this.$el.find('.metadata-validation-error').length === 0) {
        this.tabLinks.$el.after('<div class="metadata-validation-error"></div>');
        this.validationErrorElem = $(this.$el.find('.metadata-validation-error')[0]);
        this.validationErrorElem.append(
            '<span class="icon notification_error cs-close-error-icon" alt="' +
            lang.hideValidationErrorMessageIconTooltip + '" title="' +
            lang.hideValidationErrorMessageIconTooltip + '"></span>');
        this.validationErrorElem.append('<span class="validation-error-message">' +
                                        lang.formValidationErrorMessage + '</span>');
        this.validationErrorElem.hide();

        var closeIcon = $(this.$el.find('.metadata-validation-error .cs-close-error-icon')[0]);
        closeIcon && closeIcon.on('click', _.bind(function (event) {
          event.preventDefault();
          event.stopPropagation();
          this._hideValidationError();
        }, this));
      }
    },

    _showValidationError: function () {
      if (this.validationErrorElem === undefined) {
        this._addValidationErrorElement();
      }
      if (this.tabContent.$el.find('.alpaca-message-notOptional').length > 0) {
        this.tabContent && this.tabContent.$el.addClass('show-validation-error');
        this.contentHeaderRegion && this.contentHeaderRegion.$el.addClass('show-validation-error');
        this.validationErrorElem && this.validationErrorElem.show();
      } else {
        this._hideValidationError();
      }
    },

    _hideValidationError: function () {
      this.tabContent && this.tabContent.$el.removeClass('show-validation-error');
      this.contentHeaderRegion && this.contentHeaderRegion.$el.removeClass('show-validation-error');
      this.validationErrorElem && this.validationErrorElem.hide();
    },

    _clearValidationError: function () {
      this.tabContent && this.tabContent.$el.removeClass('show-validation-error');
      this.contentHeaderRegion && this.contentHeaderRegion.$el.removeClass('show-validation-error');
      if (this.validationErrorElem) {
        this.validationErrorElem.remove();
        delete this.validationErrorElem;
      }
    },

    _checkFormFetching: function () {
      this._fetchingForms = true;
    },

    _fetchForms: function () {
      return this.allForms.fetch();
    },

    _syncForms: function () {
      var self = this;
      this.blockActions();
      this._clearValidationError();
      return this._loadPanels()
          .then(_.bind(this._loadGeneralFormFields, this)).then(
              _.bind(this._loadGeneralActionFields, this))
          .always(function () {
            self.unblockActions();
            self._fetchingForms = false;
          })
          .then(function () {
            var panelModels = _.pluck(self._propertyPanels, 'model'),
                models      = self.allForms.where({role_name: 'categories'});
            self.panelModelsLength = panelModels.length;
            if (self.options.node.newCategories.models.length > 0) {
              models = _.union(models, self.options.node.newCategories.models);
            }
            var categoryModels = _.sortBy(models,
                function (model) {return model.attributes.title.toLowerCase()});
            models = panelModels.concat(categoryModels);
            self._normalizeModels(models);
            self.collection.reset(models);
            self._checkCategoriesActions();
          })
          .fail(function (request) {
            var error = new base.Error(request);
            ModalAlert.showError(error.message, lang.getPropertyPanelsFailTitle);
          });
    },

    _loadPanels: function () {
      var self = this,
          methodName, parameters;
      if (this.options.action === 'create') {
        methodName = 'getPropertyPanelsForCreate';
        parameters = [{forms: this.allForms}];
      } else if (this.options.action === 'copy') {
        methodName = 'getPropertyPanelsForCopy';
        parameters = [{forms: this.allForms}];
      } else if (this.options.action === 'move') {
        methodName = 'getPropertyPanelsForMove';
        parameters = [{forms: this.allForms}];
      } else { // update
        methodName = 'getPropertyPanels';
      }
      var promises = metadataPropertyPanels.chain()
          .map(function (panel) {
            var Controller        = panel.get('controller'),
                controllerOptions = panel.get('controllerOptions'),
                controller        = new Controller(_.extend({
                  context: self.options.context,
                  model: self.options.node
                }, controllerOptions)),
                method            = controller[methodName];
            return method && method.apply(controller, parameters);
          })
          .compact()
          .value();
      return $.when
          .apply($, promises)
          .then(function () {
            self._propertyPanels = _.flatten(arguments);
          });
    },

    _loadGeneralFormFields: function () {
      var self = this;
      return GeneralFormFieldBehavior.getFieldDescriptors({
        context: this.options.context,
        action: this.options.action,
        node: this.options.node,
        forms: this.allForms
      }).then(function (fieldDescriptors) {
        self._generalFormFieldDescriptors = fieldDescriptors;
      });
    },

    _loadGeneralActionFields: function () {
      var self = this;
      return GeneralActionFieldBehavior.getFieldDescriptors({
        context: this.options.context,
        action: this.options.action,
        node: this.options.node,
        forms: this.allForms
      }).then(function (fieldDescriptors) {
        self._generalActionFieldDescriptors = fieldDescriptors;
      });
    },

    _normalizeModels: function (models) {
      _.each(models, function (model) {
        if (model instanceof FormModel) {
          var schema = model.get('schema');
          if (schema && schema.title) {
            model.set('title', schema.title);
          }
        }
        if (model.get('id') == null) {
          model.set('id', model.cid);
        }
        if (model.collection) {
          model.collection.remove(model);
        }
      });
    },
    _checkCategoriesActions: function () {
      var categoryModels = this.options.collection.where({role_name: 'categories'});
      if (categoryModels.length > 0) {
        var catId           = categoryModels[0].get('categoryId'),
            categoryActions = new AppliedCategoryActionsCollection(undefined, {
              node: this.options.node,
              action: this.options.action,
              urlResource: 'categories/' + catId + '/actions',
              autofetch: true,
              autoreset: true
            });
        this.blockActions();
        categoryActions.fetch()
            .done(_.bind(function () {
              if (categoryActions.length > 0 &&
                  categoryActions.at(0).get("categories_remove") &&
                  categoryActions.at(0).get("categories_remove").length > 0) {
                _.each(categoryModels, function (cat) {
                  cat.attributes['removeable'] = true;
                  cat.trigger('action:updated');
                });
              }
              this.unblockActions();
              setTimeout(_.bind(function () {
                var event = $.Event('tab:content:render');
                this.$el.trigger(event);
              }, this), 300);
            }, this))
            .fail(_.bind(function (resp) {
              var serverError = this._getRespError(resp);
              var title = lang.getCategoryActionsFailTitle;
              var message = _.str.sformat(lang.getActionsForACategoryFailMessage,
                  catId, this.options.node.get("id"), serverError);
              ModalAlert.showError(message, title);
              this.unblockActions();
            }, this));
      }
    },
    _initializeOthers: function () {
      var options = {
        gotoPreviousTooltip: lang.gotoPreviousCategoryTooltip,
        gotoNextTooltip: lang.gotoNextCategoryTooltip
      };
      this._initializeToolbars(options);
      this._listenToTabEvent();
      setTimeout(_.bind(this._enableToolbarState, this), 300);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function () {
          self._setTablinksAttributes();
          self._computeTablinkWidth();
          self._enableToolbarState();
          self._updateScrollbar();
        }, 200);
      }
    },

    _setTablinksAttributes: function () {
      var i, limit = 5;
      var siblings, parent = this.$el.parent();
      for (i = 0; i < limit; i++) {
        siblings = parent.siblings('.cs-tab-links.binf-dropdown');
        if (siblings.length > 0) {
          var width = $(siblings[0]).width();
          if (width > 15) {
            var newWidth    = width - 12,
                widForEle   = newWidth + "px",
                dirForEle   = this.rtlEnabled ? "margin-right" : "margin-left",
                tabLinksEle = this.$el.find('.tab-links');

            tabLinksEle.css({
              "width": function () {
                return "calc(100% - " + widForEle + ")";
              }
            });

            if (tabLinksEle.length) {
              tabLinksEle.css(dirForEle, widForEle);
              var tabLinksEleWidth = parseInt(tabLinksEle.css('width').replace('px', ''), 10);
              if (tabLinksEleWidth > 20 && tabLinksEleWidth < 250) {
                tabLinksEle.addClass('csui-mini-tablinks');
              } else {
                tabLinksEle.removeClass('csui-mini-tablinks');
              }
            }
          }
          break;
        }
        parent = parent.parent();
      }
    },

    _createAddPropertiesView: function () {
      if (this.addPropertiesView) {
        this.cancelEventsToViewsPropagation(this.addPropertiesView);
        this.addPropertiesView.destroy();
      }

      var options = _.extend({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMask: this.options.toolbarItemsMask,
        parentView: this,
        blockingParentView: this.options.blockingParentView,
        addPropertiesCallback: this.addPropertiesCallback,
        suppressAddProperties: this.options.suppressAddProperties
      }, this.options);
      this.addPropertiesView = new AddPropertiesDropdownMenuView(options);
      this.propagateEventsToViews(this.addPropertiesView);
    },

    addCatAt: function (models, respModel) {
      var index = this.panelModelsLength;
      for (var i = index; i < models.length; i++) {
        if (models[i].get('title').toLowerCase() > respModel.get('title').toLowerCase()) {
          index = i;
          break;
        }
        index += 1;
      }
      return index;
    },

    addPropertiesCallback: function (catModel) {
      if (this.options.action) {
        this.options.node.newCategories.add(catModel);
      }
      var index = this.options.collection.models.length === 1 ? 1 :
                  this.addCatAt(this.options.collection.models, catModel);

      this.doAddModelProperties(catModel, index);
      return false;
    },
    doAddModelProperties: function doAddModelProperties(model, index, additionalAddOpts) {
      var self = this;
      this.tabLinks.$el.find(".binf-active").removeClass("binf-active")
          .removeAttr('aria-selected');

      function tabContentRendered() {
        var event = $.Event('tab:content:render');
        self.$el.trigger(event);
        self._autoScrollTabTo(index, {animationOff: true})
            .done(function () {
              var newTab = self.tabLinks.children.findByModel(
                  self.options.collection.findWhere({id: model.get('id')}));
              newTab.activate();
            });
      }
      this.options.collection.add(model, _.extend(additionalAddOpts || {}, {at: index}));
      model.collection = this.options.collection;

      this._listenToTabIdEvent(index);

      var formContent = this.tabContent.children.findByModel(
          this.options.collection.findWhere({id: model.get('id')})),
          newFormView = formContent && formContent.content;
      if (newFormView !== undefined) {
        var isRendered = (newFormView instanceof FormView) ? newFormView.isRenderFinished() :
                         newFormView._isRendered;
        if (isRendered) {
          tabContentRendered();
        } else {
          var renderEvent = (newFormView instanceof FormView) ? 'render:form' : 'dom:refresh';
          this.listenToOnce(newFormView, renderEvent, _.bind(function () {
            this.trigger("update:button", false);
            tabContentRendered();
          }, this));
        }
        this._autoScrollTabTo(index, {animationOff: true});
      } else {
        tabContentRendered();
      }

      this._computeTablinkWidth();
      this._enableToolbarState();
      this.trigger('reset:switch');
    },

    _resetRequiredSwitchView: function () {
      PubSub.trigger('pubsub:header:rightbar:view:change:switch:status', 'reset');
    },
    _onDeleteCategory: function (tabLink) {
      this.tabToDelete = tabLink;
      var categoryName = tabLink.model.get("title");
      var title = lang.removeCategoryWarningTitle;
      var message = categoryName ? _.str.sformat(lang.removeCategoryWarningMessage, categoryName) :
                    lang.removeCategoryWarningMessage;
      ModalAlert
          .confirmWarning(message, title)
          .done(_.bind(this._removeCategory, this))
          .fail(_.bind(function (err) {
            if (!err) {
              this.tabToDelete.$el.find('a').focus();
            }
          }, this));
    },
    _removeCategory: function () {
      if (this.tabToDelete) {
        var id = this.tabToDelete.model.get('id');
        id = _.isNumber(id) ? id.toString() : id;
        if (this.options.node.get("id") === undefined || this.options.action) {
          this._removeTab();
          if (this.options.node.newCategories.remove(id) === undefined) {
            this.options.node.removedCategories.push(id);
          }
          return;
        }

        var fullUrl = Url.combine(this.options.node.urlBase(), 'categories/' + id);
        var options = {
          type: 'DELETE',
          url: fullUrl
        };
        this.options.node.connector && this.options.node.connector.extendAjaxOptions(options);

        this.blockActions();
        $.ajax(options)
            .done(_.bind(function () {
              this.unblockActions();
              this._removeTab();
            }, this))
            .fail(_.bind(function (resp) {
              this.unblockActions();
              var serverError = this._getRespError(resp);
              var categoryName = this.tabToDelete.model.get("title");
              var title = lang.removeCategoryFailMessageTitle;
              var message = _.str.sformat(lang.removeCategoryFailMessage, categoryName,
                  serverError);
              ModalAlert.showError(message, title);
            }, this));
      }
    },
    _removeTab: function () {
      if (this.tabToDelete.$el.hasClass('binf-active')) {
        var previousIndex = this.tabToDelete._index - 1;
        var previousTab = this.tabLinks.children.findByIndex(previousIndex);
        this._autoScrollTabTo(previousIndex, {animationOff: true})
            .done(function () {
              previousTab && previousTab.activate();
            });
      }
      this.options.collection.remove(this.tabToDelete.model);
      this.trigger('reset:switch');

      setTimeout(_.bind(function () {
        this._computeTablinkWidth();
        this._enableToolbarState();
        var event = $.Event('tab:content:render');
        this.$el.trigger(event);
      }, this), 300);
    },
    _onRequiredSwitch: function (args) {
      Backbone.trigger('closeToggleAction');
      this._updateScrollbar();
      this._hideNotRequiredFormFields(args.on, args);
      return false;
    },

    _hideNotRequiredFormFields: function (hide, args) {
      this.tabContent.children.each(function (tabContent) {
        if (tabContent.content.hideNotRequired) {
          var appliedToWholeForm = tabContent.content.hideNotRequired(hide);
          var tabLink = this.tabLinks.children.findByModel(tabContent.model);
          if (appliedToWholeForm) {
            var method = hide ? 'addClass' : 'removeClass';
            tabContent.$el[method]('binf-hidden hidden-by-switch');
            if (hide) {
              this._hideTabLinkByRequiredSwitch(tabLink.$el);
            } else {
              this._showTabLinkByRequiredSwitch(tabLink.$el, tabContent.model.get('removeable'));
            }
          } else {
            this._showTabLinkByRequiredSwitch(tabLink.$el, tabContent.model.get('removeable'));
          }
        }
      }, this);
      this.tabLinks.$el.find(".tab-links-first-visible").removeClass("tab-links-first-visible");
      this.tabContent.onReorder();
      var firstVisibleTabLink,
          tabLinkViews      = this.tabLinks.children._views,
          keysSortedByIndex = Object.keys(tabLinkViews).sort(
              function (view1, view2) {
                return tabLinkViews[view1]._index - tabLinkViews[view2]._index;
              });
      for (var index = 0; index < keysSortedByIndex.length; index++) {
        if (!this.tabLinks.children._views[keysSortedByIndex[index]].$el.hasClass('binf-hidden')) {
          firstVisibleTabLink = this.tabLinks.children._views[keysSortedByIndex[index]];
          break;
        }
      }
      if (!!firstVisibleTabLink) {
        firstVisibleTabLink.$el.addClass("tab-links-first-visible");
      }
      if (firstVisibleTabLink && !firstVisibleTabLink.isActive()) {
        firstVisibleTabLink.activate();
      }

      setTimeout(_.bind(function () {
        this._computeTablinkWidth();
        this._enableToolbarState();
        var event = $.Event('tab:content:render');
        this.$el.trigger(event);
        if (!!args) { // executes only when coming thr' event driven
          this.currentTabPosition = 1;
        }

      }, this), 300);
    },
    _getRespError: function (resp) {
      var error = '';
      if (resp && resp.responseJSON && resp.responseJSON.error) {
        error = resp.responseJSON.error;
      } else if (base.MessageHelper.hasMessages()) {
        error = $(base.MessageHelper.toHtml()).text();
        base.MessageHelper.clear();
      }
      return error;
    }

  });

  _.extend(MetadataPropertiesViewImpl.prototype, TabLinksScrollMixin);

  return MetadataPropertiesViewImpl;

});
