/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/browsable/client-side.mixin'
], function (_, $, Backbone, ClientSideBrowsableMixin) {
  'use strict';

  describe('ClientSideBrowsableMixin-Backbone.Collection', function () {

    var TestCollection = Backbone.Collection.extend({

          items: [
            {id: 1, name: 'first', creation_date: '2018-03-04T11:22:02.000+00:00', versions:['c'], type: 1},
            {id: 2, name: 'second', creation_date: '2017-07-09T02:19:35.000+00:00', versions:['a', 'b'], type: 1},
            {id: 3, name: 'third', creation_date: '2017-01-15T02:19:35.000+00:00', versions:['z', 'y'], type: 2, container: true},
            {id: 4, name: 'fourth', creation_date: '2017-08-03T02:19:35.000+00:00', versions:['a', 'b'], type: 2, container: true},
            {id: 5, name: 'fifth', creation_date: '2017-11-21T02:19:35.000+00:00', versions:['a', 'b', 'c'], type: 3},
            {id: 6, name: 'sixth', creation_date: '2017-02-19T02:19:35.000+00:00', versions:[], type: 3},
            {id: 7, name: 'seventh', creation_date: '2016-05-29T02:19:35.000+00:00', versions:['b'], type: 3}
          ],

          initialize: function (models, options) {
            this.makeClientSideBrowsable(options);
          },

          fetch: function (options) {
            this._populateTestItems(options);
            return $.Deferred().resolve(this.items).promise();
          },

          _populateTestItems: function (options) {
            if (options.parse === void 0) {
              options.parse = true;
            }
            this.trigger('request', this, {}, options);
            var method = options.reset ? 'reset' : 'set';
            this[method](this.items, options);
            if (options && options.success) {
              options.success(this, this.items, options);
            }
            this.trigger('sync', this, this.items, options);
          }

        }),
        testCollection, testCollectionFetchSpy, testCollectionPopulateSpy;

    ClientSideBrowsableMixin.mixin(TestCollection.prototype);

    function initialize(options) {
      testCollection = new TestCollection(undefined, options);
      testCollectionFetchSpy = spyOn(testCollection, 'fetch');
      testCollectionFetchSpy.and.callThrough();
      testCollectionPopulateSpy = spyOn(testCollection, '_populateTestItems');
      testCollectionPopulateSpy.and.callThrough();
      testCollectionFetchSpy.calls.reset();
      testCollectionPopulateSpy.calls.reset();
    }

    it('can be constructed', function () {
      initialize();
      expect(testCollection instanceof TestCollection).toBeTruthy();
    });

    describe('fetch', function () {

      beforeEach(function (done) {
        initialize();
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
              expect(testCollectionPopulateSpy).toHaveBeenCalledTimes(1);

              fetching = testCollection.fetch().then(function () {
                expect(testCollectionFetchSpy).toHaveBeenCalledTimes(2);
                expect(testCollectionPopulateSpy).toHaveBeenCalledTimes(1);
                done();
              });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('loads the full collection at first but not at other times', function (done) {
        initialize();       // resets call counter
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
              expect(testCollectionPopulateSpy).toHaveBeenCalledTimes(1);

              var fetching2 = testCollection.fetch()
                  .then(function () {
                    expect(testCollectionFetchSpy).toHaveBeenCalledTimes(2);
                    expect(testCollectionPopulateSpy).toHaveBeenCalledTimes(1);
                    done();
                  })
                  .fail(function () {
                    expect(fetching2.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 20000);

      it('loads the full collection again if the reload option is used', function (done) {
        initialize();

        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
              expect(testCollectionPopulateSpy).toHaveBeenCalledTimes(1);
              fetching = testCollection.fetch({reload: true})
                  .then(function () {
                    expect(testCollectionPopulateSpy).toHaveBeenCalledTimes(2);
                    expect(testCollectionFetchSpy).toHaveBeenCalledTimes(2);
                    done();
                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });

      }, 20000);

      it('loads all models from the full collection by default', function (done) {
        initialize();
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(7);
              expect(testCollection.first().get('id')).toBe(1);
              expect(testCollection.last().get('id')).toBe(7);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('sets filtered and total counts', function (done) {
        initialize({
          filter: {name: 't', type: [1, 3]}
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.totalCount).toBe(7);
              expect(testCollection.filteredCount).toBe(4);
              done();
            });
      });

      it('loads part of the full collection with settings from the constructor', function (done) {
        initialize({
          skip: 1,
          top: 2,
          orderBy: 'name desc',
          filter: {name: 't', type: [1, 3]}
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(7);
              expect(testCollection.last().get('id')).toBe(1);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('loads part of the full collection with later provided settings', function (done) {
        initialize();
        testCollection.setLimit(1, 2, false);
        testCollection.setOrder('name desc', false);
        testCollection.setFilter({name: 't', type: [1, 3]}, false);
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(7);
              expect(testCollection.last().get('id')).toBe(1);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('reloads the part of the full collection with the previous settings', function (done) {
        initialize({
          skip: 1,
          top: 2,
          orderBy: 'name desc',
          filter: {name: 't', type: [1, 3]}
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              testCollection.reset([], {populate: false});
              fetching = testCollection.fetch()
                  .then(function () {
                    expect(testCollection.length).toBe(2);
                    done();
                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 20000);

      it('reloads the same part of the full collection with reset:true too', function (done) {
        initialize({
          skip: 1,
          top: 2,
          orderBy: 'name desc',
          filter: {name: 't', type: [1, 3]}
        });
        var fetching = testCollection.fetch({reset: true})
            .then(function () {
              expect(testCollection.length).toBe(2);
              testCollection.reset([], {populate: false});
              fetching = testCollection.fetch({reset: true})
                  .then(function () {
                    expect(testCollection.length).toBe(2);
                    done();
                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 20000);

    });

    describe('populate', function () {

      it('replaces the content of the current collection', function (done) {
        initialize();
        testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBeGreaterThan(2);
              testCollection.populate([
                {id: 1, name: 'first', type: 1},
                {id: 2, name: 'second', type: 1}])
                  .then(function () {
                    expect(testCollection.totalCount).toEqual(2);
                    expect(testCollection.length).toEqual(2);
                    done();
                  });
            });
      });

      it('fills the internal buffer and populates the collection using paging', function (done) {
        initialize({
          skip: 0,
          top: 1
        });
        testCollection.populate([
          {id: 1, name: 'first', type: 1},
          {id: 2, name: 'second', type: 1}]).then(function () {
          expect(testCollection.totalCount).toEqual(2);
          expect(testCollection.length).toEqual(1);
          done();
        });
      });

      it('calls the success callback', function (done) {
        initialize();
        testCollection.populate([
          {id: 1, name: 'first', type: 1},
          {id: 2, name: 'second', type: 1}
        ], {
          success: function () {
            setTimeout(done);
          }
        });
      });

      it('triggers request and sync events', function (done) {
        initialize();
        var counter = 0;
        testCollection.once('request sync', function () {
          if (++counter === 2) {
            setTimeout(done);
          }
        });
        testCollection.populate([
          {id: 1, name: 'first', type: 1},
          {id: 2, name: 'second', type: 1}]);
      });

      it('resolves the promise', function (done) {
        initialize();
        testCollection.populate([
          {id: 1, name: 'first', type: 1},
          {id: 2, name: 'second', type: 1}])
            .done(done);
      });

    });

    describe('reset', function () {

      beforeEach(function () {
        initialize();
      });

      it('replaces the content of the collection including the internal buffer by default',
          function (done) {
            testCollection.fetch()
                .then(function () {
                  expect(testCollection.length).toBeGreaterThan(2);
                  testCollection.reset([
                    {id: 1, name: 'first', type: 1},
                    {id: 2, name: 'second', type: 1}]);
                  expect(testCollection.totalCount).toEqual(2);
                  expect(testCollection.length).toEqual(2);
                  done();
                });
          });

      it('replaces the content of the only collection if requested', function (done) {
        testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBeGreaterThan(2);
              testCollection.reset([
                {id: 1, name: 'first', type: 1},
                {id: 2, name: 'second', type: 1}
              ], {
                populate: false
              });
              expect(testCollection.totalCount).toBeGreaterThan(2);
              expect(testCollection.length).toEqual(2);
              done();
            });
      });

    });

    describe('continuous fetch', function () {

      it('loads the initial top items if called at first', function (done) {
        initialize({
          skip: 0,
          top: 2
        });
        var fetching = testCollection.fetch({
          remove: false,
          merge: false
        })
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(1);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('loads another top items if called later', function (done) {
        initialize({
          skip: 0,
          top: 2
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(1);
              testCollection.setSkip(testCollection.skipCount + testCollection.topCount, false);
              fetching = testCollection.fetch({
                remove: false,
                merge: false
              })
                  .then(function () {
                    expect(testCollection.length).toBe(4);
                    expect(testCollection.first().get('id')).toBe(1);
                    expect(testCollection.at(2).get('id')).toBe(3);
                    done();
                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 20000);

      it('keeps the sorting and filtering parameters', function (done) {
        initialize({
          skip: 0,
          top: 2,
          orderBy: 'name',
          filter: {name: 'h'}
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(5);
              testCollection.setSkip(testCollection.skipCount + testCollection.topCount, false);
              fetching = testCollection.fetch({
                remove: false,
                merge: false
              })
                  .then(function () {
                    expect(testCollection.length).toBe(4);
                    expect(testCollection.first().get('id')).toBe(5);
                    expect(testCollection.at(2).get('id')).toBe(7);
                    done();
                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 20000);

      it('reuses the internal filtered and sorted collection to fetch the text items',
          function (done) {
            initialize({
              skip: 0,
              top: 2
            });
            var fetching = testCollection.fetch()
                .then(function () {
                  var lastFilteredAndSortedModels = testCollection.lastFilteredAndSortedModels;
                  testCollection.setSkip(testCollection.skipCount + testCollection.topCount, false);
                  fetching = testCollection.fetch({
                    remove: false,
                    merge: false
                  })
                      .then(function () {
                        expect(testCollection.lastFilteredAndSortedModels).toBe(
                            lastFilteredAndSortedModels);
                        done();
                      });
                });
          });

      it('re-creates the internal filtered and sorted collection to fetch the text items',
          function (done) {
            initialize({
              skip: 0,
              top: 2,
              orderBy: 'name asc'
            });
            var fetching = testCollection.fetch()
                .then(function () {
                  var lastFilteredAndSortedModels = testCollection.lastFilteredAndSortedModels;
                  testCollection.setSkip(testCollection.skipCount + testCollection.topCount, false);
                  testCollection.setOrder('name desc', false);
                  fetching = testCollection.fetch({
                    remove: false,
                    merge: false
                  })
                      .then(function () {
                        expect(testCollection.lastFilteredAndSortedModels).not.toBe(
                            lastFilteredAndSortedModels);
                        done();
                      });
                });
          });

      it('can start from the beginning in the middle of continuous fetching', function (done) {
        initialize({
          skip: 0,
          top: 2
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(1);
              testCollection.setSkip(testCollection.skipCount + testCollection.topCount, false);
              fetching = testCollection.fetch({
                remove: false,
                merge: false
              })
                  .then(function () {
                    expect(testCollection.length).toBe(4);
                    expect(testCollection.first().get('id')).toBe(1);
                    expect(testCollection.at(2).get('id')).toBe(3);
                    testCollection.setSkip(0, false);
                    fetching = testCollection.fetch({
                      remove: true,
                      merge: false
                    })
                        .then(function () {
                          expect(testCollection.length).toBe(2);
                          expect(testCollection.first().get('id')).toBe(1);
                          done();
                        })
                        .fail(function () {
                          expect(fetching.state()).toBe('resolved',
                              "Collection has not been fetched in time");
                          done();
                        });
                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 30000);

      it('can start from the beginning by using the reset option', function (done) {
        initialize({
          skip: 0,
          top: 2
        });

        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(1);
              testCollection.setSkip(testCollection.skipCount + testCollection.topCount, false);
              fetching = testCollection.fetch({
                remove: false,
                merge: false
              })
                  .then(function () {
                    expect(testCollection.length).toBe(4);
                    expect(testCollection.first().get('id')).toBe(1);
                    expect(testCollection.at(2).get('id')).toBe(3);
                    testCollection.setSkip(0, false);
                    fetching = testCollection.fetch({
                      reset: true
                    })
                        .then(function () {
                          expect(testCollection.length).toBe(2);
                          expect(testCollection.first().get('id')).toBe(1);
                          done();
                        })
                        .fail(function () {
                          expect(fetching.state()).toBe('resolved',
                              "Collection has not been fetched in time");
                          done();
                        });

                  })
                  .fail(function () {
                    expect(fetching.state()).toBe('resolved',
                        "Collection has not been fetched in time");
                    done();
                  });

            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 30000);

    });

    describe('setLimit', function () {

      it('skips items from the beginning to the specified index', function (done) {
        initialize({
          skip: 3
        });

        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(4);
              expect(testCollection.first().get('id')).toBe(4);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('tops items at the specified index', function (done) {
        initialize({
          top: 3
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(3);
              expect(testCollection.first().get('id')).toBe(1);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('limits items to the specified count starting at the specified index', function (done) {
        initialize({
          skip: 2,
          top: 3
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(3);
              expect(testCollection.first().get('id')).toBe(3);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('fetches if the passed in parameters change the collection state', function (done) {
        initialize({
          skip: 1,
          top: 2
        });
        var syncCount = 0;
        testCollection.on('sync', function () {
          syncCount++;
          if (syncCount === 1) {
            expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
            expect(testCollection.length).toBe(3);
            expect(testCollection.first().get('id')).toBe(2);

            expect(testCollection.setLimit(2, 3)).toBeTruthy();       //  triggers sync
          } else {
            expect(testCollectionFetchSpy).toHaveBeenCalledTimes(2);
            expect(testCollection.length).toBe(3);
            expect(testCollection.first().get('id')).toBe(3);
            done();
          }
        });

        expect(testCollection.setLimit(1, 3)).toBeTruthy();   // triggers sync
      }, 20000);

      it('can delay the fetch if the parameters change the collection state', function () {
        initialize({
          skip: 1,
          top: 2
        });
        expect(testCollection.setLimit(1, 3, false)).toBeTruthy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });

      it('does not do anything if the parameters do not change the collection state', function () {
        initialize({
          skip: 1,
          top: 2
        });
        expect(testCollection.setLimit(1, 2)).toBeFalsy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });

    });

    describe('setOrder', function () {

      it('sorts ascending by default', function (done) {
        initialize({
          orderBy: 'name'
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBeGreaterThan(0);
              expect(testCollection.first().get('id')).toBe(5);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('sorts ascending when specified', function (done) {
        initialize({
          orderBy: 'name asc'
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBeGreaterThan(0);
              expect(testCollection.first().get('id')).toBe(5);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('sorts descending when specified', function (done) {
        initialize({
          orderBy: 'name desc'
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBeGreaterThan(0);
              expect(testCollection.first().get('id')).toBe(3);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('fetches if the passed in parameters change the collection state', function (done) {
        initialize({
          orderBy: 'type'
        });
        var syncCount = 0;
        testCollection.on('sync', function () {
          syncCount++;
          if (syncCount === 1) {
            expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
            expect(testCollection.length).toBe(7);
            expect(testCollection.first().get('id')).toBe(5);
            done();
          }
        });
        expect(testCollection.setOrder('name')).toBeTruthy();
      }, 10000);

      it('can delay the fetch if the parameters change the collection state', function () {
        initialize({
          orderBy: 'type'
        });
        expect(testCollection.setOrder('name', false)).toBeTruthy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });

      it('does not do anything if the parameters do not change the collection state', function () {
        initialize({
          orderBy: 'type'
        });
        expect(testCollection.setOrder('type')).toBeFalsy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });

      it('sorts by date', function (done) {
        initialize({
          orderBy: 'creation_date desc'
        });
        var fetching = testCollection.fetch()
          .then(function () {
            expect(testCollection.length).toBeGreaterThan(0);
            expect(testCollection.first().get('id')).toBe(1);
            done();
          })
          .fail(function () {
            expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            done();
          });
      }, 10000);
	  
	  it('sorts by multi-vaue attribute ', function (done) {
        initialize({
          orderBy: 'versions'
        });
        var fetching = testCollection.fetch()
          .then(function () {
            expect(testCollection.length).toBeGreaterThan(0);
            expect(testCollection.at(0).get('id')).toBe(6);
			expect(testCollection.at(1).get('id')).toBe(2);
			expect(testCollection.at(2).get('id')).toBe(4);
			expect(testCollection.at(3).get('id')).toBe(5);
			expect(testCollection.at(4).get('id')).toBe(7);
			expect(testCollection.at(5).get('id')).toBe(1);
			expect(testCollection.at(6).get('id')).toBe(3);
            done();
          })
          .fail(function () {
            expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            done();
          });
      }, 10000);
    });

    describe('setFilter', function () {

      it('given multiple property values treats them with the OR operation', function (done) {
        initialize({
          filter: {
            'name': ['d', 'i']
          }
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(5);
              expect(testCollection.first().get('id')).toBe(1);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('given multiple properties treats them with the AND operation', function (done) {
        initialize({
          filter: {
            'name': ['d', 'i'],
            'type': 3
          }
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(5);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('when called multiple times, adds new attribute filters', function (done) {
        initialize();
        testCollection.setFilter(['d', 'i'], 'name', false);
        testCollection.setFilter(3, 'type', false);
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(5);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('matches all containers with the {type: -1} filter', function (done) {
        initialize({
          filter: {
            'type': -1
          }
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(3);
              expect(testCollection.last().get('id')).toBe(4);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

      it('fetches if the passed in parameters change the collection state', function (done) {
        initialize({
          filter: {'name': 't'}
        });
        var syncCount = 0;
        testCollection.on('sync', function () {
          syncCount++;
          if (syncCount === 1) {
            expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
            expect(testCollection.length).toBe(2);
            expect(testCollection.first().get('id')).toBe(2);
            done();
          }
        });
        expect(testCollection.setFilter({'name': 'd'})).toBeTruthy();
      }, 10000);

      it('can delay the fetch if the parameters change the collection state', function () {
        initialize({
          filter: {'name': 't'}
        });
        expect(testCollection.setFilter({'name': 'd'}, false)).toBeTruthy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });

      it('does not do anything if the parameters do not change the collection state', function () {
        initialize({
          filter: {'name': 't'}
        });
        expect(testCollection.setFilter({'name': 't'})).toBeFalsy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });
	  
	  it('filters on multi-value property', function (done) {
        initialize({
          filter: {
            'versions': 'a'
          }
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(3);
              expect(testCollection.first().get('id')).toBe(2);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      }, 10000);

    });

    describe('compareObjectsForSort', function () {
      it('can be overridden', function (done) {
        initialize({
          orderBy: 'name'
        });

        var originalCompareObjectsForSort = testCollection.compareObjectsForSort;
        testCollection.compareObjectsForSort = function (property, left, right) {
          if (property === 'name') {
            left = left.get(property);
            right = right.get(property);
            if (left < right) {
              return 1;
            } else if (left > right) {
              return -1;
            }
            return 0;
          }
          return originalCompareObjectsForSort.call(this, property, left, right);
        };

        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBeGreaterThan(0);
              expect(testCollection.first().get('id')).toBe(3);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
              done();
            });
      });
    });
  });
});
