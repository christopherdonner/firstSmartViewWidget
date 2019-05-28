/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars', 'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/controls/table/table.columns',
  'csui/utils/url',
  'csui/utils/log',
  'hbs!esoc/widgets/tablecell/impl/tablecell',
  'esoc/widgets/socialactions/commentscollectionwidget',
  'esoc/widgets/tablecell/tablecell.model',
  'esoc/widgets/common/util',
  'i18n!esoc/widgets/tablecell/nls/lang',
  'css!esoc/widgets/tablecell/impl/social.css',
  'css!esoc/widgets/socialactions/socialactions.css'
], function (_, $, Handlebars, Marionette, ConnectorFactory, TemplatedCellView, cellViewRegistry, tableColumns, Url,
    Log, template, CommentsCollectionWidget, TableCellModel,CommonUtil, lang) {
  Handlebars.registerHelper('value-if', function (flag, thenValue, elseValue) {
    if (_.isObject(elseValue) && _.isObject(elseValue.hash)) {
      elseValue = '';
    }
    return flag ? thenValue : elseValue;
  });
  var TableCellView = TemplatedCellView.extend({
        className: 'csui-nowrap',
        template: template,
        title: '',  // do not display the column header

        events: {
          "keydown": "onKeyInView",
          "click .esoc-socialactions-comment .cs-icon-comment": "onClickComment"
        },

        log: Log,
        commonUtil: CommonUtil,
        constructor: function SocialColumnHandler() {
          TemplatedCellView.prototype.constructor.apply(this, arguments);
          this.listenTo(this.model, 'change', this.render);
        },

        getValueData: function () {
          var actions = this.model.collection.delayedActions,
              that    = this;
          this.updateSocailActions(this.model);
          actions && this.listenTo(actions, 'sync', function () {
            that.updateSocailActions(that.model);
            that.render();
          });
          this.model.attributes.messages = lang;
          this.model.attributes.wnd_comments_title = this.model.attributes.wnd_comments > 0 ?
                                                     this.model.attributes.wnd_comments > 1 ?
                                                     this.model.attributes.wnd_comments + " " + lang.commentCount :
                                                     this.model.attributes.wnd_comments + " " + lang.oneComment : '';
          this.model.attributes.wnd_comments_validated =
              this.model.attributes.wnd_comments > 0 ?
              this.model.attributes.wnd_comments > 99 ? '99' + '+' :
              this.model.attributes.wnd_comments : '';
          this.model.attributes.wnd_no_comments = lang.noComments;
          return this.model.toJSON();
        },

        updateSocailActions: function (nodeModel) {
          var showSocialActions = !!nodeModel.actions.get('comment');
          nodeModel.attributes.showSocialActions = showSocialActions;
          nodeModel.attributes.socialactions = {
            "attachementsEnabled": showSocialActions,
            "chatEnabled": showSocialActions,
            "commentingOpen": showSocialActions,
            "commentsEnabled": showSocialActions,
            "CSID": nodeModel.attributes.id,
            "likesEnabled": showSocialActions,
            "taggingEnabled": showSocialActions,
            "threadingEnabled": showSocialActions,
            "shortcutEnabled": showSocialActions
          };

        },
        onClickComment: function (e) {
          this.options.connector = this.options.connector ||
                                   this.options.context.getObject(ConnectorFactory);
          var commentConfig = {
                tablecellwidget: true,
                currentNodeModel: this.model,
                currentTarget: $(e.currentTarget).closest("td"),
                baseElement: this.$el.find(".esoc-socialactions-comment"),
                socialActionsInstanse: this
              },
              commentEle    = this.$el.find(".esoc-socialactions-comment")[0],
              csId          = commentEle.getAttribute("data-value") || commentEle.dataset.value;
          commentConfig.csId = csId;

          var tableCellModel = new TableCellModel({
            csId: csId,
            currentNodeModel: this.model
          }, {
            connector: this.options.connector
          });

          tableCellModel.fetch().then(function (response) {
            this.model.attributes.socialactions = response.available_settings;
            commentConfig.socialActionsInstanse.options.connector.connection.url = this.options.connector.connection.url;
            var commentsCollectionWidget = new CommentsCollectionWidget(commentConfig);
            commentsCollectionWidget.show();
          }.bind(this), function (jqXHR, statusText, error) {
            this.log.error("TEMP.  ERROR Getting available settings");
          }.bind(this));
        },

        onKeyInView: function (event) {
          if (event.keyCode === 32 || event.keyCode === 13) {
            var hasSocialActions = !!this.model.actions.get('comment') ? true : false;
            if (hasSocialActions) {
              this.onClickComment(event);
            }
          }
        }
      },
      {
        hasFixedWidth: true,
        columnClassName: 'csui-table-cell-esoc-social'
      }
  );
  cellViewRegistry.registerByColumnKey('wnd_comments', TableCellView);
  tableColumns.add({
    key: 'wnd_comments',
    sequence: 905,
    permanentColumn: true // don't wrap column due to responsiveness into details row
  });

});
