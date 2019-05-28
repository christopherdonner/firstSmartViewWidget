# TabLinkDropDownCollectionView

TabLinkDropDownCollectionView is similar to TabLinkCollectionView but instead of rendering tab 
buttons, it renders a dropdown menu.  The behavior is similar that when a menu item is selected, 
the appropriate tab content view will be activated.

Define the following in the main Tab View constructor:

    this.options = {
      TabLinkCollectionViewClass: TabLinkDropDownCollectionView
    }

For detailed example, see: `src/widgets/metadata/impl/metadata.dropdown.view.js`.

## Example

    var MetadataDropdownTabView = TabPanelView.extend({
    
      constructor: function MetadataPropertiesViewImpl(options) {
        options || (options = {});
        this.options = options;
        _.defaults(this.options, {
          contentView: MetadataPropertiesContentView, // MetadataPropertiesView,
          TabLinkCollectionViewClass: TabLinkDropDownCollectionView
        });
        
        ...
        
      },
    
      ...
      
    });
    
