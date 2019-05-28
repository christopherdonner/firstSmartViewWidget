/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(function () {
    'use strict';

    return [
        {
            equals: {type: [128]},
            signature: 'InitiateWorkflow',
            sequence: 30
        },
        {
            equals: {type: [153]},
            signature: 'OpenWorkflowStep',
            sequence: 30
        }
    ];

});