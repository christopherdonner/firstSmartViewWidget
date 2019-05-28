/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, $, _, Backbone, log) {
  'use strict';

  log = log(module.id);

  var Task = Backbone.Model.extend({

    constructor: function Task(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.deferred = $.Deferred();
    },

    promise: function () {
      return this.deferred.promise();
    }

  });

  var TaskCollection = Backbone.Collection.extend({model: Task});

  function TaskQueue(options) {
    this.parallelism = options && options.parallelism || Infinity;
    this.pending = new TaskCollection(undefined, {model: Task});
    this.pending.on("add", this.dequeue, this);
    this.active = new TaskCollection(undefined, {model: Task});
  }

  _.extend(TaskQueue.prototype, {

    dequeue: function () {
      var task;
      log.debug(
          'Pending queue {0} contains {1} tasks, active queue {0} contains {1} tasks.',
          this.pending.cid, this.pending.length, this.active.cid, this.active.length)
      && console.log(log.last);
      if (this.active.length < this.parallelism &&
          (task = this.pending.shift())) {
        this.execute(task);
        this.dequeue();
      }
    },

    execute: function (task) {
      log.debug('Executing task {0}...', task.cid)
      && console.log(log.last);
      this.active.add(task);
      task.get("worker")()
          .done(task.deferred.done)
          .fail(task.deferred.fail)
          .always(_.bind(function () {
            this.active.remove(task);
            this.dequeue();
          }, this));
    }

  });

  TaskQueue.Task = Task;
  TaskQueue.TaskCollection = TaskCollection;
  TaskQueue.version = "1.0";

  return TaskQueue;

});
