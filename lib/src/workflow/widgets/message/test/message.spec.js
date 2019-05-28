/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/connector',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/message/message.view'
], function (_, $, Backbone, ConnectorFactory, BaseTestUtils, TestView, MessageView) {
  'use strict';

  describe('The Message View', function () {
    var view;

    beforeEach(function () {
      BaseTestUtils.membersMock.enable({
        id: 1002,
        type: 0,
        name: 'bwillis',
        business_email: 'bwillis@elink.loc',
        office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
        title: 'New York Police Officer (Retired)',
        display_name: 'Bruce Willis',
        name_formatted: 'Bruce Willis',
        group_id: 101
      });
    });

    afterEach(function () {
      BaseTestUtils.membersMock.disable();
    });

    describe('is initializing', function () {

      it('with an error without the model', function () {

        try {
          view = new MessageView({
            connector: BaseTestUtils.getContext().getObject(ConnectorFactory)
          });
          expect(false).toBeTruthy();
        }
        catch (err) {
          expect(err.message).toEqual('Message model is missing!');
        }

        try {
          view = new MessageView({
            connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
            model: undefined
          });
          expect(false).toBeTruthy();
        }
        catch (err) {
          expect(err.message).toEqual('Message model is missing!');
        }
      });

      it('correctly with a model', function () {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 'Bruce Willis',
            subject: 'The subject matter ...',
            text: '... is to verify the initialization of the view!'
          })
        });
        expect(view.model.get('sender')).toEqual('Bruce Willis');
        expect(view.model.get('subject')).toEqual('The subject matter ...');
        expect(view.model.get('text')).toEqual('... is to verify the initialization of the view!');
      });

    });

    describe('is rendering', function () {
      var parent;

      afterEach(function() {
        if (parent){
          parent.destroy();
          $('body').empty();
        }
      });

      it('the subject for the \'delegate\' type', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'delegate',
            text: 'There are 10 types of people in the world, those who understand binary and' +
                  ' those who don\'t.'
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('Message from');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('who forwarded the workflow step to a new approver.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim())
              .toEqual('There are 10 types of people in the world, those who understand binary' +
                       ' and those who don\'t.');
          done();
        });
      });

      it('the subject for the \'delegate\' type with an empty message', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'delegate',
            text: ''
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('forwarded the workflow step to a new approver without a message.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim()).toEqual('');
          done();
        });
      });

      it('the subject for the \'review\' type', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'review',
            text: 'There are 10 types of people in the world, those who understand binary and' +
                  ' those who don\'t.'
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('Message from');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('who sent you a workflow step for review. Please add a comment and reply.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim())
              .toEqual('There are 10 types of people in the world, those who understand binary' +
                       ' and those who don\'t.');
          done();
        });
      });

      it('the subject for the \'review\' type with an empty message', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'review',
            text: ''
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('sent you a workflow step for review. Please add a comment and reply.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim()).toEqual('');
          done();
        });
      });

      it('the subject for the \'review_return\' type', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'review_return',
            text: 'There are 10 types of people in the world, those who understand binary and' +
                  ' those who don\'t.'
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('Message from');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('who reviewed your workflow step.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim())
              .toEqual('There are 10 types of people in the world, those who understand binary' +
                       ' and those who don\'t.');
          done();
        });
      });

      it('the subject for the \'review_return\' type with an empty message', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'review_return',
            text: ''
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('reviewed your workflow step without a message.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim()).toEqual('');
          done();
        });
      });

      it('the subject as it is defined in the model', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'This message was brought to you by the mighty, mighty {0}.',
            text: 'Expect the unexpected!'
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim())
              .toEqual('This message was brought to you by the mighty, mighty');
          expect(subject.find('.subject-post').text().trim()).toEqual('.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim()).toEqual('Expect the unexpected!');
          done();
        });
      });

      it('the subject without a sender placeholder', function (done) {
        view = new MessageView({
          model: new Backbone.Model({
            sender: undefined,
            subject: 'This message was brought to you by the mighty, mighty Administrator.',
            text: 'Expect the unexpected!'
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('');
          expect(subject.find('.subject-post').text().trim())
              .toEqual('This message was brought to you by the mighty, mighty Administrator.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Anonymous User');
          var body = view.$el.find(".message-body");
          expect(body.text().trim()).toEqual('Expect the unexpected!');
          done();
        });
      });

      it('the sender based on a text', function (done) {
        view = new MessageView({
          model: new Backbone.Model({
            sender: 'Chuck Norris',
            subject: 'This message was brought to you by {0}.',
            text: 'Expect the unexpected!'
          })
        });
        view.render();
        var subject = view.$el.find('.message-subject');
        expect(subject.find('.subject-pre').text().trim())
            .toEqual('This message was brought to you by');
        expect(subject.find('.subject-post').text().trim()).toEqual('.');
        expect(subject.find('.subject-sender').text().trim()).toEqual('Chuck Norris');
        var body = view.$el.find(".message-body");
        expect(body.text().trim()).toEqual('Expect the unexpected!');
        done();
      });

      it('the message without a body', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: '{0} sent you a message.',
            text: ''
          })
        });
        view.render();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.subject-sender').text() === 'Bruce Willis');
        }, 1000).always(function () {
          var subject = view.$el.find('.message-subject');
          expect(subject.find('.subject-pre').text().trim()).toEqual('');
          expect(subject.find('.subject-post').text().trim()).toEqual('sent you a message.');
          expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
          var body = view.$el.find(".message-body");
          expect(body.text().trim()).toEqual('');
          done();
        });
      });

      it('the message that can be displayed / hidden with the toggle button', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'The subject matter ...',
            text: '... is to verify the initialization of the view!'
          })
        });
        var shown = false;
        parent = new TestView({
          view: view
        });
        parent.on('show', function () { shown = true;});
        parent.show();
        var body = view.$el.find('.message-body');
        expect(body.hasClass('binf-collapse')).toBeTruthy();
        expect(body.hasClass('binf-in')).toBeTruthy();
        var icon = view.$el.find('.toggle-button > span');
        expect(icon.hasClass('icon-expandArrowUp')).toBeTruthy();
        BaseTestUtils.waitUntil(function () {
          return shown;
        }, 2000).always(function () {
          $('.toggle-button').click();
          BaseTestUtils.waitUntil(function () {
            return view.$el.find('.message-body').hasClass('binf-collapsing');
          }, 2000).always(function () {
            BaseTestUtils.waitUntil(function () {
              return view.$el.find('.message-body').hasClass('binf-collapse');
            }, 2000).always(function () {
              body = view.$el.find('.message-body');
              expect(body.hasClass('binf-collapse')).toBeTruthy();
              expect(body.hasClass('binf-in')).toBeFalsy();
              done();
            });
          });
        });
      });
    });

    describe('is keyboard navigatable', function () {
      var parent;

      afterEach(function() {
        if (parent){
          parent.destroy();
          $('body').empty();
        }
      });

      it('and has the correct focus', function (done) {
        view = new MessageView({
          connector: BaseTestUtils.getContext().getObject(ConnectorFactory),
          model: new Backbone.Model({
            sender: 1002,
            subject: 'The subject matter ...',
            text: '... is to verify the keyboard navigation support of the view!'
          })
        });
        var shown = false;
        parent = new TestView({
          view: view
        });
        parent.on('show', function () { shown = true;});
        parent.show();
        BaseTestUtils.waitUntil(function () {
          return shown;
        }, 2000).always(function () {
          var toggle = view.currentlyFocusedElement();
          expect(toggle.length).toEqual(1);
          expect(toggle.hasClass('toggle-button')).toBeTruthy();
          expect(toggle.attr('tabindex')).toEqual('0');
          expect(toggle.hasClass('csui-acc-focusable-active')).toBeTruthy();
          done();
        });
      });
    });
  });
});

