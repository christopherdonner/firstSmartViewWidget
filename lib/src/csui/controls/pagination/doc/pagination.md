# NodesPaginationView (controls/pagination)

  Creates a pagination navigational toolbar conventionally located at the bottom of a nodes table.
  Pagination has a few configuration parameters that for now are hard coded into the view.

     this.config = {
        maxRowsPerPage: 100,
        minRowsPerPage: 30,
        ddItemsList: [ 30, 50, 100 ]},   //dropdown page size selection
      };

To include pagination:
 1. Provide a div container in which to place it. It does not matter what ID or class you give your
    div container, it will not effect the pagination bar.

    ### Example:

        
    <div class="csui-nodestable">
      <div id="tabletoolbar"></div>
      <div id="tableview"></div>
      <div id="paginationview"></div>
    </div>

 2. Provide the pageSize and  collection you originally used to create your table.

    ###Example:
    
    
     this.paginationView = new PaginationView({
        collection: collection,
        pageSize: this.options.pageSize
     });

To extend the language bundle for pagination:
 1. Create module specific pagination file like:
     <module name>/localization/pagination/nls/root/lang:
        PageNavBarTotalItems: "{1} items"

 2. Add lang file in their bundles file:

     <module name>/bundles/<module>-all:
        ...,
        '<module name>/localization/pagination/nls/root/lang'

 3. Map it to csui pagination public language bundle in the config file:

     /app:
         require.config({
           map: {
             '*': {
               'csui/controls/pagination/nls/localized.strings':
               '<module>/localization/pagination/nls/lang'
             }
           }
         });