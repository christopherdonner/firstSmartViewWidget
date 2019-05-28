/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore",
  "csui/utils/log",
  "hbs!esoc/widgets/utils/command/comment/comment.toolitem",
  "csui/controls/toolbar/toolitem.view",
  "i18n!esoc/widgets/tablecell/nls/lang"
], function (module, $, _, log, template, ToolItemView, Lang) {

  var CommentToolItemView = ToolItemView.extend({

    tagName: 'li',

    template: template,

    templateHelpers: function () {
      var commentCount = this.model.attributes.commandData.wnd_comments;
      var data = {
        renderIconAndText: this.options.renderIconAndText === true,
        renderTextOnly: this.options.renderTextOnly === true,
        isSeparator: this.model.isSeparator(),
        id: this.model.attributes.commandData.id,
        wnd_comments_title: commentCount > 0 ?
                            commentCount > 1 ?
                            commentCount + " " + Lang.commentCount :
                            commentCount + " " + Lang.oneComment : '',
        wnd_comments_validated: commentCount > 99 ? '99+' : (commentCount > 0 ? commentCount : "")
      };
      return data;
    },

    constructor: function CommentToolItemView() {
      ToolItemView.prototype.constructor.apply(this, arguments);
    }
  });

  return CommentToolItemView;

});

