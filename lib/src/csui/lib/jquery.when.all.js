/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery'], function ($) {

  // Behaves like `$.when`, but waits until all promises have been resolved
  // or rejected.  (The `$.when` rejects immediately after the first promise
  // has been rejected.)
  //
  // The returned promise will be resolved if all input promises were
  // resolved.  If ai least one input promise was rejected, the returned
  // promise will be rejected.  The returned promise arguments are values
  // of the input promises - both resolved and rejected - in the order
  // of the input promises.
  //
  // This method is useful if you can recognize a resolved promise value
  // from a rejected one, similarly to the `always` promise callback.

  $.whenAll = function () {
    var promises = Array.prototype.slice.call(arguments),
        counter = promises.length,
        finished = $.Deferred(),
        results = [],
        failed;
    if (promises.length) {
      $.each(promises, function (index, promise) {
        promise
            .fail(function () {
              failed = true;
            })
            .always(function () {
              results[index] = arguments.length <= 1 ? arguments[0] :
                               Array.prototype.slice.call(arguments);
              if (!--counter) {
                var method = failed ? 'reject' : 'resolve';
                finished[method](results);
              }
            });
      });
    } else {
      finished.resolve(results);
    }
    return finished.promise();
  };

  return $.whenAll;

});
