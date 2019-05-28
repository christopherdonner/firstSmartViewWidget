# CommentCommand

This command is used to check if the 'comment'
action is permitted for a particular node and render comment as command.

## Example

As part of toolbaritems user can add below Toolitem to get the comment command
 {
    signature: "Comment",
    name: lang.ToolbarItemComment,
    icon: "icon icon-socialComment",
    className: "esoc-socialactions-comment",
	  customView: true,
    commandData: { useContainer: true }
 },

customView: true|false[optional]
 If it is true it will use custom comment view to display comment icon with comment count.
 If the value is false, it will render only comment icon.

commandData: { useContainer: true|false }
 useContainer: true - it will display comments of parent node container
 useContainer: false - it will display comments of selected node.