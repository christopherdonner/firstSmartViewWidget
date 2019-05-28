/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'csui/models/member',
  'csui/models/members',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/userpicker/impl/user.view',
  'csui/controls/userpicker/impl/group.view',
  'i18n!csui/controls/userpicker/nls/userpicker.lang',
  'hbs!csui/controls/userpicker/impl/userpicker',
  'hbs!csui/controls/userpicker/impl/empty.results',
  'css!csui/controls/userpicker/impl/userpicker',
  'csui/lib/bootstrap3-typeahead',
  'csui/lib/jquery.when.all'
], function (module, _, $, Marionette, Base, Url, ConnectorFactory, MemberModel, MemberCollection,
    TabableRegionBehavior, UserView,
    GroupView, lang, template, emptyTemplate) {

  var config = module.config();
  _.defaults(config, {
    matchingParams: ['name', 'first_name', 'last_name', 'business_email',
      'display_name', 'name_formatted']
  });

  var UserPickerView = Marionette.LayoutView.extend({

    template: template,

    templateHelpers: function () {
      var id2Use = this.options.id_input && this.options.id_input.length > 0 ?
                   this.options.id_input : _.uniqueId('csui-userpicker-input');
      return {
        placeholder: this.options.placeholder,
        id_input: id2Use,
        ariaLabel: this.options.ariaLabel ? this.options.ariaLabel : this.options.placeholder,
        clearValue: lang.clearValue,
        isRequired: this.options.isRequired
      };
    },

    ui: {
      userpicker: 'div.csui-control-userpicker',
      searchbox: 'input.typeahead',
      searchicon: '.typeahead.cs-search-icon',
      searchclear: '.typeahead.cs-search-clear'
    },

    behaviors: function () {
      return {
        TabableRegionBehavior: {
          behaviorClass: TabableRegionBehavior
        }
      };
    },

    currentlyFocusedElement: function (options) {
      if (!!this.ui.searchclear && $(this.ui.searchclear).is(':visible') && options && options.shiftKey) {
        return this.ui.searchclear;
      } else {
        return this.ui.searchbox;
      }
    },

    triggers: {
      'click @ui.searchbox': 'click',
      'click @ui.searchicon': 'click'
    },

    events: {
      'keyup @ui.searchbox': 'onKeyUp',
      'keydown @ui.searchbox': 'onKeyDown',
      'click @ui.searchclear': 'onClickClear',
      'keydown @ui.searchclear': 'onClickClear',
      'dragstart .typeahead.binf-dropdown-menu li > a': 'onDragMember'
    },

    constructor: function UserPickerView(options) {
      options || (options = {});
      (options.placeholder !== undefined) || (options.placeholder = lang.placeholderDefault);
      options.clearOnSelect || (options.clearOnSelect = false);
      options.items || (options.items = 'all');
      options.delay || (options.delay = 200);
      options.expandFields || (options.expandFields = ['group_id', 'leader_id']);
      options.userView || (options.userView = UserView);
      options.groupView || (options.groupView = GroupView);
      options.disabledMessage || (options.disabledMessage = '');
      options.prettyScrolling || (options.prettyScrolling = false);
      var connector;
      if (options.collection) {
        connector = options.collection.connector;
      } else {
        if (!options.context) {
          throw new Error('Context is missing in the constructor options');
        }
        connector = options.context.getObject(ConnectorFactory);
        options.collection = new MemberCollection(undefined, {
          connector: connector,
          memberFilter: options.memberFilter,
          expandFields: options.expandFields,
          limit: options.limit,
          comparator: function (item) {
            return item.get('name_formatted').toLowerCase();
          }
        });
      }
      if (!options.model) {
        options.model = new MemberModel(undefined, {connector: connector});
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var that = this;
      $(this.ui.searchicon).on("click",_.bind(this.onClickIcon,this));
      var typeaheadOptions = {
        items: this.options.items,
        delay: this.options.delay,
        collection: this.collection,
        autoSelect: false,
        matcher: this._matchMembers,
        sorter: this._sortMembers,
        source: _.bind(this._retrieveMembers, this),
        displayText: _.bind(this._retrieveDisplayText, this),
        highlighter: _.bind(this._renderHighlighter, this),
        afterSelect: _.bind(this._afterSelect, this),
        nextHighlighter: _.bind(this._nextHighlighter, this),
        accessbility: _.bind(this._accessbility, this),
        currentHighlighter: _.bind(this._currentHighlighter, this),
        prettyScrolling: this.options.prettyScrolling,
        appendTo: this.ui.userpicker,
        handleNoResults: true,
        emptyTemplate: emptyTemplate({"noresultsfound": lang.noResults}),
        beforeShow: this._beforePositioning,
        afterShow: _.bind(this._positionContainer, this)
      };
      if (this.options.scrollContainerHeight) {
        typeaheadOptions.scrollContainerHeight = this.options.scrollContainerHeight;
      }
      this.ui.searchbox.typeahead(typeaheadOptions);
      if (this.model.get('id')) {
        this.ui.searchbox.val(Base.formatMemberName(this.model));
      }
      this.updateStyles();
    },

    onKeyUp: function (e) {
      this.updateStyles();
      if (this.ui.searchbox.val() === "") {
        this.trigger('item:clear');
      }
    },

    onClickIcon: function () {
      if (!this.context.$scrollContainer.is(":visible")) {
        this.ui.searchbox.typeahead('lookup');
        this.ui.searchbox.focus();
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode === 9 && $(this.ui.searchclear).is(":visible")) {
        if (e.shiftKey) {
          this.updateStyles();
          this.ui.searchbox.typeahead('hide');
        } else {
          e.preventDefault();
          e.stopPropagation();
          this.ui.searchclear.focus();
        }
      }
    },

    onClickClear: function (event) {
      if (event.type === "click" || event.keyCode === 13) {
        this.ui.searchbox.val('');
        this.updateStyles();
        this.trigger('item:clear');
        this.ui.searchbox.typeahead('hide');
        this.ui.searchbox.focus();
      } else if (event.keyCode === 9 && $(this.ui.searchclear).is(":visible")) {
        if (event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          this.ui.searchbox.focus();
        } else {
          this.updateStyles();
          this.ui.searchbox.typeahead('hide');
        }
      }
    },

    onDragMember: function (e) {
      return false;
    },
    updateStyles: function () {
      var clear = this.ui.searchbox.val() && this.ui.searchbox.val().length > 0;
      this.ui.searchclear.css({
        'display': clear ? '' : 'none'
      });
    },
    _retrieveMembers: function (query) {
      var self = this;
      self.collection.query = query;
      return self.collection
          .fetch()
          .then(function () {
            if (typeof self.options.onRetrieveMembers === 'function') {
              self.options.onRetrieveMembers({
                collection: self.collection
              });
            }
            return self.collection.models;
          });
    },

    _retrieveDisplayText: function (item) {
      return item.get('name');
    },

    _renderHighlighter: function (item) {
      var model = this.collection.findWhere({name: item});
      var MemberView = (model.get('type') === 0) ? this.options.userView : this.options.groupView;
      var view = new MemberView({
        model: model,
        connector: this.collection.connector,
        disabledMessage: this.options.disabledMessage,
        lightWeight: this.options.lightWeight
      });
      return view.render().el;
    },

    _matchMembers: function (item) {
      if (_.isEmpty(this.query)) {
        return false;
      }
      var finalMachingString = "";
      _.each(config.matchingParams, function (curr) {
        finalMachingString += item.get(curr) || '';
      });
      finalMachingString = finalMachingString.toLowerCase();
      return finalMachingString.indexOf(this.query.toLowerCase()) >= 0;
    },

    _sortMembers: function (items) {
      return items;
    },

    _afterSelect: function (item) {
      var val = this.options.clearOnSelect ? '' : Base.formatMemberName(item);
      this.ui.searchbox.val(val);
      this.updateStyles();
      this.options.userView.userPicked = true;
      this.trigger('item:change', {item: item});
    },
    _currentHighlighter: function (item) {
      return;
    },
    _nextHighlighter: function (item) {
      return;
    },

    _accessbility: function(item) {
      this.ui.searchbox.attr('aria-activedescendant', item.attr("id"));
      return;
    },

    _beforePositioning: function (context) {  //prevent the visiblity of position adjustment
      var scrollSelector = context.$element.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling'; //.csui-normal-scrolling for touch devices
      var form = context.$element.closest(scrollSelector);
      if (form.length > 0) {
        if (context.$appendTo) {
          context.$appendTo.addClass('csui-transparent');
        }
      }
    },

    _positionContainer: function (context) {
      var placeVertical = '', controlTop = 0, formTop = 0, formHeight = 0;
      var scrollSelector = context.$element.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling'; //.csui-normal-scrolling for touch devices
      var form = context.$element.closest(scrollSelector);
      var contextHeight = context.$scrollContainer.children(
          'ul.typeahead.binf-dropdown-menu').height();

      var that = this;
      that.context = context;
      form = form.length > 0 ? form : context.$element.closest('.alpaca-field');
      context.$element.addClass('cs-userfield-height');
      if (form.length > 0) {
        formTop = form.offset().top;
        formHeight = form.height();
        controlTop = context.$element.offset().top;
        if (formTop < 0) {
          formTop = -1 * formTop;
        }

        if ((controlTop - formTop) > (formHeight + formTop - controlTop)) {
          if (controlTop > 0 && context.$scrollContainer.height() >
                                controlTop - form.offset().top) {
            context.$element.css("overflow", "hidden");
            context.$element.perfectScrollbar({suppressScrollX: true});
          }
        }

        if (contextHeight < 450) {
          context.$scrollContainer.children('ul.typeahead.binf-dropdown-menu').append($("<div" +
                                                                                        " class='picker-spacer'>spacer</div>"));
        }
        context.$scrollContainer.css("height", "auto");
        setTimeout(function () {
          context.$scrollContainer.scrollTop(0);
          context.$scrollContainer.children('ul.typeahead.binf-dropdown-menu').find(
              ".picker-spacer").remove();

          var inputEle = context.$element;
          Base.adjustDropDownField(inputEle, context.$scrollContainer, true, that,
              that.hideUserPicker, context.$scrollContainer);

          context.$scrollContainer.perfectScrollbar("update");
          if (context.$appendTo) {
            context.$appendTo.removeClass('csui-transparent');
          }
          that.trigger("userpicker:open");
          that.ui.searchbox.attr("aria-expanded", true);
          that.ui.searchbox.attr('aria-owns', 'user-picker-ul');
        }, 0);
      }
    },

    hideUserPicker: function (view) {
      view.context.$scrollContainer.hide();
      view.trigger("userpicker:close");
      view.ui.searchbox.attr("aria-expanded", false);
    }
  });

  return UserPickerView;

});
