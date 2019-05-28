/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['json!webreports/webreports-extensions.json'], function (extensions) {
	'use strict';

	describe('The extension', function () {
		beforeAll(function () {
			expect(extensions).toBeTruthy();
			var collection = extensions[
				'csui/models/server.module/server.module.collection'];
			expect(collection).toBeTruthy();
			var modules = collection.modules;
			expect(modules).toBeTruthy();
			this.webreports = modules.webreports;
		});

		it('registers the module', function () {
			expect(this.webreports).toBeTruthy();
		});

		it('declares a version', function () {
			expect(this.webreports.version).toBeTruthy();
		});
	});
});
