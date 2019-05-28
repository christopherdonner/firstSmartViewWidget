# TabLinksScrollMixin

Provides TabLinkCollectionViewExt Mixin for the additional tab overflow scrolling functionality.

Define the following in the main Tab View constructor:

    this.options = {
      toolbar: true,
      TabLinkCollectionViewClass: TabLinkCollectionViewExt
    }

Add this mixin to your main Tab View implementation and make the appropriate calls.
Also add your own css styling to achieve the correct entity location and layout.

For detailed example, see: `src/widgets/metadata/impl/metadata.properties.view.js`.

## Example

    var MetadataPropertiesViewImpl = TabPanelView.extend({
    
      constructor: function MetadataPropertiesViewImpl(options) {
        options || (options = {});
        this.options = options;
        _.defaults(this.options, {
          tabType: 'nav-pills',
          mode: 'spy',
          toolbar: true,
          contentView: this.getContentView,
          TabLinkCollectionViewClass: TabLinkCollectionViewExt
        });
        this.widths = [];
        
        ...
        
      },
    
      render: function () {
        TabPanelView.prototype.render.apply(this);
    
        this._initializeToolbars();
        this._listenToTabEvent();
        this._setInitialTabState();
    
        // delay this a bit since the initial dialog fade in makes the tab to be hidden
        setTimeout(_.bind(this._enableToolbarState, this), 500);
    
        return this;
      }
      
      ...
      
    });
    
    // Add the mixin functionality to the Tab View implementation
    _.extend(MetadataPropertiesViewImpl.prototype, TabLinksScrollMixin);
