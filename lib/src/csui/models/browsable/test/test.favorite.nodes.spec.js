/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/connector', './test.favorite.nodes.js', './server-side.mock.js'
], function (_, $, Backbone, Connector, FavoriteNodeCollection, mock) {

  describe('BrowsableMixin-FavoriteNodeCollection', function () {

    var connector, testCollection, testCollectionFetchSpy;

    function initialize(options) {
      if (!connector) {
        connector = new Connector({
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/support',
            session: {
              ticket: 'dummy'
            }
          }
        });
      }
      testCollection = new FavoriteNodeCollection(undefined, _.extend({
        connector: connector
      }, options));
      testCollectionFetchSpy = spyOn(testCollection, 'fetch');
      testCollectionFetchSpy.and.callThrough();
    }

    beforeEach(function () {
      mock.enable();
    });

    afterEach(function () {
      mock.disable();
    });

    it('can be constructed', function () {
      initialize();
      expect(testCollection instanceof FavoriteNodeCollection).toBeTruthy();
    });

    describe('fetch', function () {

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
            });
      }, 10000);

      it('loads part of the full collection with settings from the constructor', function (done) {
        initialize({
          skip: 2,
          top: 2,
          orderBy: 'name desc',
          filter: {name: 't', type: [1, 3]}
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(1);
              expect(testCollection.last().get('id')).toBe(5);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            });
      }, 10000);

      it('loads part of the full collection with later provided settings', function (done) {
        initialize();
        testCollection.setLimit(2, 2, false);
        testCollection.setOrder('name desc', false);
        testCollection.setFilter({name: 't', type: [1, 3]}, false);
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(2);
              expect(testCollection.first().get('id')).toBe(1);
              expect(testCollection.last().get('id')).toBe(5);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            });
      }, 10000);

      it('reloads the part of the full collection with the previous settings', function (done) {
        initialize({
          skip: 2,
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
                  });

            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            });
      }, 20000);

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
                  });

            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
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
                  });
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            });
      }, 20000);

    });

    describe('setLimit', function () {

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
            });
      }, 10000);

      it('limits items to the specified count starting at the specified index', function (done) {
        initialize({
          skip: 3,
          top: 3
        });
        var fetching = testCollection.fetch()
            .then(function () {
              expect(testCollection.length).toBe(3);
              expect(testCollection.first().get('id')).toBe(4);
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
            });
      }, 10000);

      it('fetches if the passed in parameters change the collection state', function (done) {
        initialize({
          skip: 2,
          top: 2
        });

        var syncCount = 0;
        testCollection.on('sync', function () {
          syncCount++;
          if (syncCount === 1) {
            expect(testCollectionFetchSpy).toHaveBeenCalledTimes(1);
            expect(testCollection.length).toBe(3);
            expect(testCollection.first().get('id')).toBe(3);

            expect(testCollection.setLimit(3, 3)).toBeTruthy();
          } else {
            expect(testCollectionFetchSpy).toHaveBeenCalledTimes(2);
            expect(testCollection.length).toBe(3);
            expect(testCollection.first().get('id')).toBe(4);
            done();
          }
        });
        expect(testCollection.setLimit(2, 3)).toBeTruthy();
      }, 20000);

      it('can delay the fetch if the parameters change the collection state', function () {
        initialize({
          skip: 2,
          top: 2
        });
        expect(testCollection.setLimit(2, 3, false)).toBeTruthy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
      });

      it('does not do anything if the parameters do not change the collection state', function () {
        initialize({
          skip: 2,
          top: 2
        });
        expect(testCollection.setLimit(2, 2)).toBeFalsy();
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

      it('can delay the fetch if the parameters change the collection state', function (done) {
        initialize({
          filter: {'name': 't'}
        });
        expect(testCollection.setFilter({'name': 'd'}, false)).toBeTruthy();
        expect(testCollectionFetchSpy).not.toHaveBeenCalled();
        done();
      });

      it('does not do anything if the parameters do not change the collection state',
          function (done) {
            initialize({
              filter: {'name': 't'}
            });
            expect(testCollection.setFilter({'name': 't'})).toBeFalsy();
            expect(testCollectionFetchSpy).not.toHaveBeenCalled();
            done();
          });

    });

  });

});
