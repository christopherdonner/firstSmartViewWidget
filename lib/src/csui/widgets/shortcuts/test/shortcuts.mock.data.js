/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  var mocks = [];

  return {

    enable: function () {

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2003?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 2003,
                name: 'My Personal Workspace',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/141?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 2000,
                name: 'Enterprise',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/142?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 2003,
                name: 'My Personal Workspace',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/50000?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 50000,
                name: 'Water Management',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/60000?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 60000,
                name: 'Lawn Care',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/70000?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 70000,
                name: 'Research and Development',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/80000?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 80000,
                name: 'A long Shortcut name that spans multiple lines',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/90000?*',
        responseText: {
          results: {
            actions: {
              data: {
                browse: {}
              },
              map: {},
              order: []
            },
            data: {
              properties: {
                id: 90000,
                name: 'A really long Shortcut name that spans so many lines.  The quick brown fox jumps over the fence with missing letter g.  The quick brown fox jumps over the lazy dog.  That\'s complete English alphabet.  What about pangrams for other languages?',
                container: true
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2004?*',
        status: 404,
        responseText: {
          error: 'Sorry, the item you requested could not be accessed. ' +
                 'Either it does not exist, or you do not have permission to access it. ' +
                 'If you were sent a link to this item, please contact the sender for assistance.'
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

});
