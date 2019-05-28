# Mixins for Models

Here you can find prototype partials to be "mixed in" to your model objects.  You will
get additional methods in your prototype coming from the *mixin*.

Mixins should not replace your existing methods or methods you inherit from a parent object.
You are supposed to call the mixin methods explicitly to gain the added functionality.  If
they override a Backbone method, it should be documented and you will need to be careful
about the order you apply the mixins in.

Mixins usually export an object literal to be merged with the prototype of the target model
by calling its static `mixin` method:

```
MyMixin.mixin(MyModel.prototype);
```
