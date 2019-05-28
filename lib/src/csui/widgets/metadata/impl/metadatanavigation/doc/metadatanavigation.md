# MetaDataNavigationView (widgets/metadata/impl/metadatanavigation)

  Shows a `MetadataNavigationView`. The `MetadataNavigationView` view provides a frame 
  view comprising a navigation list and a content view, typically for a container holding 
  child nodes.


### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          context   = new PageContext(),
          connector = context.getObject(ConnectorFactory),
          node      = new NodeModel({ id: 3001, name: 'Container'}, {connector: connector}),
          nodeChildren = new NodeChildrenCollection(undefined, { node: node }),
          contentView = new Backbone.View(),
          metadataNavigationView = new MetadataNavigationView({
                        container: node,
                        collection: nodeChildren,
                        data: {
                          contentView: contentView
                        }
                      });

      nodeChildren.fetch().done(function (result) {
        contentRegion.show(metadataNavigationView);
      });

## Constructor Summary

### constructor(options)

  Creates a new `MetaDataView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.container` - *Backbone.Model* The container within which to navigate (fills header).
* `options.collection` - *Backbone.Collection* The collection to show in the navigation list.

#### Returns:

  The newly created object instance.

#### Example:

  See the [MetadataNavigationView](#) object for an example.

## Localizations Summary

No localization keys are used

