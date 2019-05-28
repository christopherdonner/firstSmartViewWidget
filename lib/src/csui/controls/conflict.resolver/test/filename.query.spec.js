/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/node/node.model', 'csui/models/namequery',
  './filename.query.mock.data.err.js',
  './filename.query.mock.data.cnt1.js',
  './filename.query.mock.data.cnt9.js',
  './filename.query.mock.data.cnt22.js',
  'csui/utils/connector'
], function (_, $, NodeModel, NameQuery, MockDataErr, MockDataCnt1, MockDataCnt9, MockDataCnt22, Connector) {
  'use strict';

  describe('File Name Query', function () {

     describe('testing capture of server error response', function() {
       var connector, container;
       beforeEach(function() {
         MockDataErr.enable();
         connector = new Connector({
           connection: {
             url: '//server/otcs/cs/api/v1',
             supportPath: '/support',
             session: {
               ticket: 'dummy'
             }
           }
         });

         container = new NodeModel({
           id: 2000
         }, {
           connector: connector
         });
       });
       afterEach(function() {
         MockDataErr.disable();
       });
       it('testing capture of server error response', function (done) {

         var nameQuery = new NameQuery({
             containerId: container.get('id')
           }, {
             connector: connector
           }),
           files = getFiles(0),
           response = false;

         nameQuery.queryNames(files)
           .then(function () {
             expect(true).toBe(false, '0: server did not return expected error');
             done();
           })
           .fail(function () {
             response = true;
             expect(response).toBe(true, "0: server reported expected error");
             done();
           });
       }, 10000);

     });

     describe('testing query of 1 file', function() {
       var connector, container;
       beforeEach(function() {
         MockDataCnt1.enable();
         connector = new Connector({
           connection: {
             url: '//server/otcs/cs/api/v1',
             supportPath: '/support',
             session: {
               ticket: 'dummy'
             }
           }
         });

         container = new NodeModel({
           id: 2000
         }, {
           connector: connector
         });
       });
       afterEach(function() {
         MockDataCnt1.disable();
       });
       it('testing query of 1 file', function (done) {

         var nameQuery = new NameQuery({
             containerId: container.get('id')
           }, {
             connector: connector
           }),
           files = getFiles(1),
           numCleanFiles = 0,
           numConflictFiles = 0;

         nameQuery.queryNames(files)
           .then(function (cleanFiles, conflictFiles) {
             numCleanFiles = cleanFiles.length;
             numConflictFiles = conflictFiles.length;

             expect(numCleanFiles).toBe(1);
             expect(numConflictFiles).toBe(0);
             done();
           })
           .fail(function () {
             expect(numCleanFiles).toBeGreaterThan(0, "1: server did not return response");
             done();
           });
       }, 10000);
     });

     describe('testing query of 9 files', function() {
       var connector, container;
       beforeEach(function() {
         MockDataCnt9.enable();
         connector = new Connector({
           connection: {
             url: '//server/otcs/cs/api/v1',
             supportPath: '/support',
             session: {
               ticket: 'dummy'
             }
           }
         });

         container = new NodeModel({
           id: 2000
         }, {
           connector: connector
         });
       });
       afterEach(function() {
         MockDataCnt9.disable();
       });
       it('testing query of 9 files', function (done) {
         var nameQuery = new NameQuery({
             containerId: container.get('id')
           }, {
             connector: connector
           }),
           files = getFiles(9),
           numConflicts = 0,
           numCleanFiles = 0;

         nameQuery.queryNames(files)
           .then(function (cleanFiles, conflictFiles) {
             numCleanFiles = cleanFiles.length;
             numConflicts = conflictFiles.length;

             expect(numConflicts).toBe(4);
             expect(numCleanFiles).toBe(5);
             done();
           })
           .fail(function () {
             expect(numCleanFiles).toBeGreaterThan(0, "9: server did not return response");
             done();
           });
       }, 10000);
     });

     describe('testing query of 22 files', function() {
       var connector, container;
       beforeEach(function() {
         MockDataCnt22.enable();
         connector = new Connector({
           connection: {
             url: '//server/otcs/cs/api/v1',
             supportPath: '/support',
             session: {
               ticket: 'dummy'
             }
           }
         });

         container = new NodeModel({
           id: 2000
         }, {
           connector: connector
         });
       });
       afterEach(function() {
         MockDataCnt22.disable();
       });
       it('testing query of 22 files', function (done) {
         var nameQuery = new NameQuery({
             containerId: container.get('id')
           }, {
             connector: connector
           }),
           files = getFiles(22),
           numConflicts = 0,
           numCleanFiles = 0;

         nameQuery.queryNames(files)
           .then(function (cleanFiles, conflictFiles) {
             numCleanFiles = cleanFiles.length;
             numConflicts = conflictFiles.length;

             expect(numConflicts).toBe(11);
             expect(numCleanFiles).toBe(11);
             done();
           })
           .fail(function () {
             expect(numCleanFiles).toBeGreaterThan(0, "22: server did not return response");
             done();
           });
       }, 10000);
     });
    function getFiles(numFiles) {
      var files = [];
      for (var i = 0; i < numFiles; i++) {
        files.push({name: 'file ' + i});
      }
      return files;
    }

  });

});


