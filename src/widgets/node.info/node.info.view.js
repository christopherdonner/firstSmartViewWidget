// An application widget is exposed via a RequireJS module
define([
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'csui/utils/contexts/factories/node',            // Factory for the node
  'csui/utils/contexts/factories/volume',          // Factory for the volume
  'csui/utils/contexts/factories/containing.workspace', // Factory for the workspace
  'samples/widgets/node.info/impl/node/node.view', // View showing a single node
  'hbs!samples/widgets/node.info/impl/node.info', // Template to render the HTML
  'css!samples/widgets/node.info/impl/node.info'  // Stylesheet needed for this view
], function (_, Marionette, NodeModelFactory, VolumeModelFactory,
  ContainingWorkspaceModelFactory, NodeView, template) {

  // An application widget is a view, because it should render a HTML fragment
  var NodeInfoView = Marionette.LayoutView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'samples-node-info tile content-tile',

    // Template method rendering the HTML for the view
    template: template,

    // Placeholders for the node and volume informations
    regions: {
      nodeRegion: '.samples-node',
      volumeRegion: '.samples-volume',
      containingWorkspaceRegion: '.samples-containing-workspace'
    },

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function NodeInfoView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // Read the widget configuration with the expected defaults
      var context = this.options.context,
          data = _.extend({
            node: true,
            containingWorkspace: true,
            volume: true
          }, this.options.data);

      // Request the model only if the widget configuration needs it
      if (data.node) {
        // Obtain the model with the data shown by this view; using the
        // model // factory with the context makes the model instance not
        // only shareable with other widgets through the context, but also
        // fetched at the same moment as the other models.
        this.node = context.getModel(NodeModelFactory);
        // Whenever the model is changed to point to other node, check
        // if its region should still be displayed or not
        this.listenTo(this.node, 'change:id', function () {
          this._updateVisibility(this.nodeRegion);
        });
      }
      if (data.volume) {
        this.volume = context.getModel(VolumeModelFactory);
        this.listenTo(this.volume, 'change:id', function () {
          this._updateVisibility(this.volumeRegion);
        });
      }
      if (data.containingWorkspace) {
        this.containingWorkspace = context.getModel(ContainingWorkspaceModelFactory);
        this.listenTo(this.containingWorkspace, 'change:id', function () {
          this._updateVisibility(this.containingWorkspaceRegion);
        });
      }
    },

    onRender: function () {
      // Show the node view only if the node model was created
      // accoding to the widget configuration
      if (this.node) {
        this.nodeRegion.show(new NodeView({
          model: this.node,
          title: 'Node'
        }));
        // All regions are hidden by default; update their visibility
        // accordingly
        this._updateVisibility(this.nodeRegion);
      }
      if (this.volume) {
        this.volumeRegion.show(new NodeView({
          model: this.volume,
          title: 'Volume'
        }));
        this._updateVisibility(this.volumeRegion);
      }
      if (this.containingWorkspace) {
        this.containingWorkspaceRegion.show(new NodeView({
          model: this.containingWorkspace,
          title: 'Workspace'
        }));
        this._updateVisibility(this.containingWorkspaceRegion);
      }
    },

    _updateVisibility: function (region) {
      var model = region.currentView.model,
          // SHow the region only if the model points to a valid node
          method = model.get('id') > 0 ? 'removeClass' : 'addClass';
      region.$el[method]('hidden');
    },

  });

  return NodeInfoView;

});
