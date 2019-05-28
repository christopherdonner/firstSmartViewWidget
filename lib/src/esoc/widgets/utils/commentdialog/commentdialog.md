# CommentDialog ('esoc/widgets/utils/commentdialog/commentdialog')

  This control provide the comment button along with comment count based on the options provided.

### Example

Step 1:
    csui.define(['csui/lib/marionette',
                 'csui/lib/jquery',
                 'csui/lib/underscore',
                 'esoc/widgets/utils/commentdialog/commentdialog'
    ], function (Marionette, $, _, CommentDialog) {

        ....
        ....
        var options = {
            placeholder: "#commentButtonDiv", // this should exists in dom
            nodeid: "6083" // provide valid node id
        };
        CommentDialog.getCommentButton(options);
        ....
        ....
      });
    });


#### Parameters:
* `options` - *Object* The CommentDialog options object.
* `options.placeholder` - Where to be show the comment button.
* `options.nodeid` - for which object we have to show the comment button.

#### Description:

    Based on the options provided, ie., placeholder and nodeid, this comment dialog controller,
    gives you the comment button and current comment count of the given nodeid,
    and place this button and count in given placeholder element.

