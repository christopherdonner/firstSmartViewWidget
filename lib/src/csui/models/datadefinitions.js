/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ "module", "csui/lib/underscore", "csui/lib/backbone",
         "csui/utils/log", "csui/utils/base", "csui/models/datadefinition"
], function( module, _, Backbone,
             log, base, DataDefinitionModel )
  {
    "use strict";
    var DataDefinitionCollection = Backbone.Collection.extend({

      model: DataDefinitionModel,

      constructor: function DataDefinitionCollection( models, options ) {
        Backbone.Collection.prototype.constructor.apply(this, arguments);
        this.setOptions( options );
      },
      setOptions: function( options ) {
        this.options = options ? options : {};
        this.options.connector && this.options.connector.assignTo(this);
        this.options.node && this.options.node.connector && this.options.node.connector.assignTo(this);
      },

      url: function() {
        var url;
        if( this.options.url ) {
          var cgiPath = new base.Url(this.connector.connection.url).getCgiScript(true);
          url = base.Url.combine( cgiPath, this.options.url );
        } else {
          url = this.options.node && this.options.node.urlBase();
          if( this.options.nodeResource ) {
            url = base.Url.combine( url, this.options.nodeResource );
          }
        }
        return url;
      },

      fetch: function( options ) {
        log.debug( "Fetching data-definitions for url '{0}'.", this.url()) &&
          typeof console !== 'undefined' && console.log( log.last );

        options || (options = {});
        if( options.reset === undefined ) {
          options.reset = true;
        }

        return Backbone.Collection.prototype.fetch.call( this, options );
      },

      parse: function( response, options ) {
        this.data = response.data || {};
        this.definitions = response.definitions || {};
        this.definitions_map = response.definitions_map || {};
        this.definitions_order = response.definitions_order || {};
        this.definitions_flat = {};
        _.each( this.definitions, function( def, key ) {
          var definition = _.extend(
            {
              signature: key,
              href: this.data[key]
            },
            def
          );
          this.definitions_flat[key] = definition;
        }, this);

        return Backbone.Collection.prototype.parse.call( this,
          this.definitions_flat, options);
      },
      GetDefinitionsOrder: function() {
        return this.definitions_order;
      },
      GetDefinitionMap: function() {
        return this.definitions_map;
      },
      GetDefinition: function( signature ) {
        return this.definitions[signature];
      },
      GetFlatCollection: function() {
        return this.definitions_flat || {};
      },
      GetFlatDefinition: function( def ) {
        return this.definitions_flat[def];
      }

    });

    _.extend( DataDefinitionCollection, { version: '1.0' } );

    return DataDefinitionCollection;

  });
