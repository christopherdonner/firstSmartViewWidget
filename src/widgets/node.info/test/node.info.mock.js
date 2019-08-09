/**
 * Created by martinel on 15.12.2016.
 */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

    var mocks = [];

    return {
        enable: function () {
            mocks.push(mockjax({
                url: '//server/otcs/cs/api/v2/nodes/555555?*',
                responseText: {
                    data: {
                        id: 555555,
                        name: "MockedNode",
                        create_date: "2016-12-10",
                        modify_date: "2016-12-10"
                    }
                }
            }));
            mocks.push(mockjax({
                url: '//server/otcs/cs/api/v2/nodes/666666?*',
                responseText: {
                    data: {
                        id: 666666,
                        volume_id: 666666,
                        name: "MockedVolume",
                        create_date: "2016-12-11",
                        modify_date: "2016-12-11"
                    }
                }
            }));

        },

        disable: function () {
            var mock;
            while ((mock = mocks.pop())) {
                mockjax.clear(mock);
            }
        }

    };

});

