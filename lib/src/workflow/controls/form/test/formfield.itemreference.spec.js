/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'workflow/testutils/base.test.utils',
  'workflow/widgets/workitem/workitem.properties/workitem.properties.view'
], function (_, $, BaseTestUtils, WorkItemPropertiesView) {
  'use strict';

  describe('Alpaca.Fields.CsuiItemReferenceField', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();

    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();

    });

    describe('Item Reference View', function () {
      var workItemPropertiesView;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context, 8),
            viewRendered = false;

        var promise = workItem.fetch();

        promise.always(function () {
          workItemPropertiesView = new WorkItemPropertiesView({
            context: context,
            model: workItem
          });

          workItemPropertiesView.render();
          BaseTestUtils.waitUntil(function () {
            if (BaseTestUtils.isWorkItemFetched(workItemPropertiesView.model)) {
              if (BaseTestUtils.isWorkItemRendered($(workItemPropertiesView.$el),
                      '.workitem-forms') &&
                  workItemPropertiesView.$el.find('.alpaca-container-item').length > 0) {
                viewRendered = true;
              }
            }
            return viewRendered;

          }, 5000).always(done);
        });
      });

      it('can be instantiated as Item Picker field', function () {
        var formElement = $(workItemPropertiesView.$el).find(".cs-form");

        var itemPickerField =
                $(formElement[0]).find(".alpaca-field.alpaca-field-item_reference_picker");

        expect(itemPickerField.length).toEqual(1);
        var nodePicker = $(formElement[0]).find('.cs-nodepicker');
        expect(nodePicker.length).toEqual(1);
      });

    });

  });
});

