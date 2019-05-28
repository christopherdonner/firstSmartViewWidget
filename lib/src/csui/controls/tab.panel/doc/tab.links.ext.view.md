# TabLinkCollectionViewExt

TabLinkCollectionViewExt inherits and extends TabLinkCollectionView to provide additional 
functionality such as having left and right toolbar for tab scrolling functionality, add new tab 
and delete tab capability.

Define the following in the main Tab View constructor:

    this.options = {
      TabLinkCollectionViewClass: TabLinkCollectionViewExt
    }

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
          delete_icon: 'category_delete',
          delete_tooltip: lang.removeCategoryTooltip,
          contentView: this.getContentView,
          TabLinkCollectionViewClass: TabLinkCollectionViewExt
        });
        this.widths = [];
        
        ...
        
      },
    
      ...
      
    });
    
