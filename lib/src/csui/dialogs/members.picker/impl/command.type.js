/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore',
  'i18n!csui/dialogs/members.picker/impl/nls/lang'
], function (module, _, lang) {

  var config = module.config();

  var CommandTypes = function (options) {
    var member = options.initialContainer;
    this.unselectableMembers = options.unselectableMembers;
    this.selectableMembers = options.selectableMembers;
    this.invalidMembers = options.invalidMembers;
    this.selectableTypes = options.selectableTypes || [];
    this.unselectableTypes = options.unselectableTypes || [];
    this.showAllTypes = options.showAllTypes || false;
    this.parentId = !!member ? member.get('id') : -1;
    this.addButtonLabel = options.addButtonLabel || lang.addButtonLabel;
  };

  _.extend(CommandTypes.prototype, {

    getSelectableMemberTypes: function () {
      if (this.showAllTypes) {
        return [];
      }

      return this.selectableTypes;
    },
    validateTarget: function (targetMember) {
      var targetId   = targetMember.data ? targetMember.data.id : targetMember.get('id'),
          targetType = targetMember.get('type'),
          retVal     = _.every(this.unselectableMembers, function (id) {
            return (targetId !== id);
          });

      if (this.browseAllowed(targetMember)) {
        retVal = _.every(this.unselectableTypes, function (type) {
          return targetType !== type;
        });
      }

      return retVal;
    },
    validId: function (targetMember) {
      var targetId = targetMember.data ? targetMember.data.id : targetMember.get('id');
      return (targetId !== this.parentId);
    },

    validateAddableTypes: function (targetMember) {
      return !targetMember.addable_types;
    },

    isSelectableType: function (targetMember) {
      var targetType = targetMember.get('type');
      if (!targetType && targetType !== 0) {
        return false;
      }
      var retVal = _.every(this.unselectableTypes, function (type) {
        return (targetType !== type);
      });
      if (retVal && !_.isEmpty(this.selectableTypes)) {
        retVal = _.indexOf(this.selectableTypes, targetType) !== -1;
        if (!retVal && this.browseAllowed(targetMember) &&
            _.indexOf(this.selectableTypes, -1) > -1) {
          retVal = true;
        }
      }
      return retVal;
    },
    isSelectable: function (targetMember) {
      var targetId = targetMember.data ? targetMember.data.id : targetMember.get('id');
      if (targetMember.get('unselectable')) {
        return false;
      }

      var retVal = this.isSelectableType(targetMember);
      retVal && (retVal = _.every(this.unselectableMembers, function (id) {
        return (targetId !== id);
      }));
      if (this.selectableMembers) {
        retVal = targetMember.get("type") === 1;
      }
      return retVal;
    },
    browseAllowed: function (member) {
      return member.get('type') === 1;
    },
    validateMember: function (member) {
      var valid = this._hasValidId(member);
      if (valid && !this.showAllTypes) {
        if (!this.browseAllowed(member)) {
          if ((this.selectableTypes.length > 0) &&
              (this.selectableTypes.indexOf(member.get('type')) === -1)) {
            valid = false;
          }
        }
      }
      return valid;
    },

    _hasValidId: function (member) {
      return _.every(this.invalidmembers, function (invalidmembers) {
        return invalidmembers.get('id') !== member.get('id');
      });
    }

  });

  return CommandTypes;

});
