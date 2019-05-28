/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/controls/table/cells/node.state/node.state.view',
  'csui/utils/contexts/page/page.context', 'csui/utils/contexts/factories/node'
], function (require, NodeStateView, PageContext, NodeModelFactory) {
  'use strict';

  describe('ReservationIconView', function () {
    beforeAll(function () {
      this.context = new PageContext({
        factories: {
          user: {
            attributes: {id: 1000}
          },
          node: {
            attributes: {id: 2000}
          }
        }
      });

      this.node = this.context.getModel(NodeModelFactory);
    });

    function createView(done) {
      require([
        'csui/controls/table/cells/node.state/impl/reservation/reservation.view'
      ], function (ReservationIconView) {
        this.view = new ReservationIconView({
          model: this.node,
          context: this.context
        });
        this.view.render();
        this.icon = this.view.$('span.icon').get(0);
        done();
      }.bind(this));
    }

    describe('for an unreserved node', function () {
      beforeAll(function (done) {
        this.node.set({
          reserved: false,
          reserved_user_id: null,
          reserved_user_id_expand: undefined
        });
        createView.call(this, done);
      });

      it('it renders empty', function () {
        expect(this.view.el.innerHTML).toEqual('');
      });
    });

    describe('for a node reserved by the same user', function () {
      describe('with unexpanded user information', function () {
        beforeAll(function (done) {
          this.node.set({
            reserved: true,
            reserved_user_id: 1000,
            reserved_user_id_expand: undefined
          });
          createView.call(this, done);
        });

        it('it renders an icon', function () {
          expect(this.icon).toBeDefined();
        });

        it('it renders the icon for the same user', function () {
          expect(this.icon.classList.contains('icon-reserved_self')).toBeTruthy();
        });
      });

      describe('with user information expanded by a v1 resource', function () {
        beforeAll(function (done) {
          this.node.set({
            reserved: true,
            reserved_user_id: {
              id: 1000,
              name: 'Me'
            },
            reserved_user_id_expand: undefined
          });
          createView.call(this, done);
        });

        it('it renders an icon', function () {
          expect(this.icon).toBeDefined();
        });

        it('it renders the icon for the same user', function () {
          expect(this.icon.classList.contains('icon-reserved_self')).toBeTruthy();
        });
      });

      describe('with user information expanded by a v2 resource', function () {
        beforeAll(function (done) {
          this.node.set({
            reserved: true,
            reserved_user_id: 1000,
            reserved_user_id_expand: {
              id: 1000,
              name: 'Me'
            }
          });
          createView.call(this, done);
        });

        it('it renders an icon', function () {
          expect(this.icon).toBeDefined();
        });

        it('it renders the icon for the same user', function () {
          expect(this.icon.classList.contains('icon-reserved_self')).toBeTruthy();
        });
      });
    });

    describe('for a node reserved by other user', function () {
      describe('with unexpanded user information', function () {
        beforeAll(function (done) {
          this.node.set({
            reserved: true,
            reserved_user_id: 1001,
            reserved_user_id_expand: undefined
          });
          createView.call(this, done);
        });

        it('it renders an icon', function () {
          expect(this.icon).toBeDefined();
        });

        it('it renders the icon for other user', function () {
          expect(this.icon.classList.contains('icon-reserved_other')).toBeTruthy();
        });
      });

      describe('with user information expanded by a v1 resource', function () {
        beforeAll(function (done) {
          this.node.set({
            reserved: true,
            reserved_user_id: {
              id: 1001,
              name: 'Other'
            },
            reserved_user_id_expand: undefined
          });
          createView.call(this, done);
        });

        it('it renders an icon', function () {
          expect(this.icon).toBeDefined();
        });

        it('it renders the icon for other user', function () {
          expect(this.icon.classList.contains('icon-reserved_other')).toBeTruthy();
        });
      });

      describe('with user information expanded by a v2 resource', function () {
        beforeAll(function (done) {
          this.node.set({
            reserved: true,
            reserved_user_id: 1001,
            reserved_user_id_expand: {
              id: 1001,
              name: 'Other'
            }
          });
          createView.call(this, done);
        });

        it('it renders an icon', function () {
          expect(this.icon).toBeDefined();
        });

        it('it renders the icon for other user', function () {
          expect(this.icon.classList.contains('icon-reserved_other')).toBeTruthy();
        });
      });
    });
  });
});
