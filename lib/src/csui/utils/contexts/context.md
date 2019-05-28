Context
=======

Gathers models, collections, or plain objects to be shared among multiple
scenarios and fetch them together.  Objects in context are managed by their
*factories*.

This is a base class. `PageContext` and `PerspectiveContext` are classes to
create instances of.

    // Get the (main contextual) authenticated user
    var currentUser = context.getModel(UserModelFactory);

Factory
-------

Is the "overlord" of objects in the context.  The parent class returned from
'csui/utils/contexts/factories/factory' is usually called by different names
like `ObjectFactory`, `ModelFactory` or `CollectionFactory` to express what
the descended factory will take care of.

* Creates an instance of the object, which will be returned to the caller.
* Assigns a unique prefix to the object, so that the same object can be
  obtained using the factory at different places.
* Can override how the model or collection is fetched.

A factory has to specify a unique `propertyPrefix` in the prototype and set
the object managed by it to `this.property`:

    var TestObjectFactory = ObjectFactory.extend({

      propertyPrefix: 'test',

      constructor: function TestObjectFactory(context, options) {
        ObjectFactory.prototype.constructor.apply(this, arguments);

        this.property = new TestObject();
      }

    });

    // Request an object with the default identifier
    // (internally stored with prefix 'test')
    var test = context.getObject(TestObjectFactory);

Objects are stored using `propertyPrefix`  in the context.  The `propertyPrefix`
is used alone for globally unique objects, or as a base for multiple objects
having the same factory, but different attributes:

    // Request a separate object with a specific identifier
    // (internally stored with prefix 'test-id-1')
    var test = context.getObject(TestObjectFactory, {
      attributes: {id: 1}
    });

Factory can be used just for the object creation, if you don't want to learn
about its constructor parameters.

    // Request a standalone object, not shareable by the context
    var test = context.getObject(TestObjectFactory, {
      unique: true,
      temporary: true,
      detached: true
    });

Fetchable Factory
-----------------

Exposes `fetch` method, which should fetch its model. Whenever the context
is fetched, this method will be called.

    var FavoriteCollectionFactory = CollectionFactory.extend({

      propertyPrefix: 'favorites',

      constructor: function FavoritesCollectionFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);

        var connector = context.getObject(ConnectorFactory, options);
        this.property = new FavoritesCollection(undefined, {
          connector: connector,
          autoreset: true
        });
      },

      fetch: function (options) {
        return this.property.fetch(options);
      }

    });

The `isFetchable` method can be added to be able to check dynamically, if
the object is fetchable or not.

    var NodeModelFactory = ModelFactory.extend({

      propertyPrefix: 'node',

      constructor: function NodeModelFactory(context, options) {
        ModelFactory.prototype.constructor.apply(this, arguments);

        var connector = context.getObject(ConnectorFactory, options);
        this.property = new NodeModel(undefined, {connector: connector});
      },

      isFetchable: function () {
        return this.property.isFetchable();
      },

      fetch: function (options) {
        return this.property.fetch(options);
      }

    });

Configurable Factory
--------------------

Factories are usually created once per object type, but they need to be able
to create multiple object instances.  With just the factory provided, the
object will be constructed with default options:

    // Get the (main contextual) node
    var currentNode = context.getModel(NodeModelFactory);

With the second argument, additional options can be passed to control the
object creation.  The `attributes` will be used to uniquely stamp the new
object, so future calls to `getObject` with the same attributes will return
the same object. Also the `attributes` will be passed to the constructor of
the object, if it is a `Backbone.Model`:

    // Get original where the (main contextual) node points to, if it is
    // a shortcut
    var originalId = currentNode.get('original_id'),
        original = context.getModel(NodeModelFactory, {
          attributes: {id: originalId}
        });

Below the property called like the factory prefix you can pass additional
options to the newly created object's constructor by the `options` property:

    // Get original where the (main contextual) node points to, if it is
    // a shortcut and make it fetchable by the connector
    var originalId = currentNode.original.get('id'),
        original = context.getModel(NodeModelFactory, {
          attributes: {id: originalId},
          node: {
            options: {connector: currentNode.connector}
          }
        });

If the new object is a `Backbone.Model`, you can specify different attributes
for the constructor, than the attributes, which control the unique stamp of
the object.  While the former should be as minimum as to compose the unique
stamp, the latter could be more complete to pre-initialize the new object:

    // Get original where the (main contextual) node points to, if it is
    // a shortcut, make it fetchable by the connector, but pre-initialize
    // it will all properties available so far
    var originalId = node.original.get('id'),
        original = context.getModel(NodeModelFactory, {
          attributes: {id: originalId},
          node: {
            attributes: node.original.attributes,
            options: {connector: currentNode.connector}
          }
        });

Finally, if you already have the new object created and you only need the
context to make it shareable, you can pass it to the property called like
the factory as-is:

    // Get original where the (main contextual) node points to, if it is
    // a shortcut, and share the same object, which has been obtained
    // with the contextual node
    var originalId = node.original.get('id'),
        original = context.getModel(NodeModelFactory, {
          attributes: {id: originalId},
          node: node.original
        });

Detached Objects
----------------

Objects, which are added to the context after the context was fetched are
needed to be fetched manually, if they need fetching at all.  Also, as
manually fetched objects, when the context is re-fetched, they are not
re-fetched again.  Their users decide, when they should be re-fetched.

    // User information, which does not refresh automatically and will be
    // discarded, when clear() is called on the context
    var ownerId = node.get('owner_user_id'),
        owner = context.getModel(MemberModelFactory, {
          attributes: {id: ownerId},
          detached: true
        });

Detached objects should merge the `Fetchable` mixin, which allows fetching
only once on demand by `ensureFetched`:

    // Make sure, that the model was fetched once, before accessing
    // its properties
    owner
        .ensureFetched()
        .done(function () {
          console.log('Login:', owner.get('name'));
        });

Permanent Objects
-----------------

Objects like the authenticated user need not be re-created during the
application lifecycle.  After being requested for the first time, they should
remain in the context for all scenarios.  (The only way how to re-create them
is to reload the entire application - the application page.)

    // User information, which does not refresh automatically and will not be
    // discarded, when clear() or fetch() is called on the context
    var ownerId = node.get('owner_user_id'),
        owner = context.getModel(MemberModelFactory, {
        attributes: {id: ownerId},
        permanent: true,
        detached: true
      });

Permanent objects are usually detached too, unless they should be re-fetched with
every context re-fetch.

Temporary Objects
-----------------

Objects like the original node need to be shared across function scopes and
object boundaries, but should not be re-created and re-fetched multiple times.
When the lifecycle of the current (main contextual) node ends, they should be
discarded from the context, so that they would not get re-fetched with the new
context content.

    // Shareable original node information, which will be discarded, as soon
    // as clear() or fetch() is called on the context
    var originalId = shortcut.original.get('id'),
        original = context.getModel(NodeModelFactory, {
          attributes: {id: originalId},
          temporary: true
        });

getObject(factory, options)
---------------------------

Returns an object maintained by the specified factory.  If the object has not
existed yet, it will be created, otherwise the previously created instance
will be returned.

The object existence is made unique by the property prefix defined by the
factory.  The full unique property stamp consists of this prefix and of the
context `attributes`, which can be passed in the second argument.

If the object is to be created, the second argument can carry parameters for
its constructor under the property named by the factory's property prefix;
usually `attributes` and `options` for a model or `models` and `options` for
a collection.  Instead of constructor parameters, this property can point to
an already created object, so that the factory just stores it as-is.

The second argument can contain boolean flags to control how the context
will handle the object: `detached`, `permanent`, `temporary` and `unique`.

    // Create a favorite node collection pre-initialized with some nodes
    // until it gets fetched with the context
    var favorites = context.getCollection(FavoriteCollectionFactory, {
      favorites: {
        models: [{type: 141}, {type: 142}]
      }
    });

getCollection(factory, options)
-------------------------------

Behaves just like `getObject`, but looks more intuitive, if the expected
result is Backbone.Collection.

getModel(factory, options)
--------------------------

Behaves just like `getObject`, but looks more intuitive, if the expected
result is Backbone.Model.

hasObject(factory, options)
---------------------------

Returns if there is an object maintained by the specified factory.

hasCollection(factory, options)
-------------------------------

Behaves just like `hasObject`, but looks more intuitive, if the expected
object is Backbone.Collection.

hasModel(factory, options)
--------------------------

Behaves just like `hasObject`, but looks more intuitive, if the expected
object is Backbone.Model.

clear(options)
-------

Discards all objects from the context, which are not permanent.
When `options.all` is set to `true`, all objects will be discarded.

fetch()
-------

Fetches all objects in the context, which are not detached.  Discards all
temporary objects before that.
