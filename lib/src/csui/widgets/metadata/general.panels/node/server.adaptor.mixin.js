/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/nodesprites',
  'csui/controls/table/cells/size/size.view', 'csui/utils/base',
  'csui/utils/url', 'csui/models/form', 'csui/models/version',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (_, Backbone, NodeSpriteCollection, SizeView, base, Url,
    FormModel, VersionModel, NodeResourceMixin, lang) {
  'use strict';

  var prototypeExt = {
    makeServerAdaptor: function (options) {
      return this;
    },

    url: function () {
      var node   = this.options.node,
          nodeId = node.get('id'),
          url;
      if (nodeId === undefined) {
        url = _.str.sformat('forms/nodes/create?type={0}&parent_id={1}',
            node.get('type'), node.get('parent_id'));
      } else {
        if (node instanceof VersionModel) {
          url = _.str.sformat('forms/nodes/versions/properties/general?id={0}&version_number={1}',
              nodeId, node.get('version_number'));
        } else {
          url = _.str.sformat('forms/nodes/properties/general?id={0}', nodeId);
        }
      }
      return Url.combine(this.connector.connection.url, url);
    },

    parse: function (response, options) {
      var form  = _.extend({
            data: {},
            schema: {},
            options: {}
          }, response.form || response.forms && response.forms[0] || response),
          title = form.title || this.get('title') || lang.general;

      form.options = _.omit(form.options, 'form');
      if (!form.schema.title) {
        form.schema.title = title;
      }
      if (!form.title) {
        form.title = title;
      }

      this._addCreatorInfo(form, options);
      this._addOwnerInfo(form, options);
      this._addCreateDateInfo(form, options);
      this._addModifyDateInfo(form, options);
      this._addMimeTypeInfo(form, options);
      this._addSizeInfo(form, options);
      this._addItemidInfo(form, options);
      this._ensurePlaceholder(form, options);
      this._addReserveInfo(form, options);
      this._addMimeTypeClassNameInfo(form, options);
      return form;
    },

    _addSizeInfo: function (ret, options) {
      var type = this.options.node.get('type');

      this.sizeView = new SizeView({
        model: this.options.node,
        column: {name: this.options.node.has('size') ? "size" : "file_size"}
      });

      var refNode =
              _.extend(ret.data, {
                size: this.sizeView.getValueData().formattedValue
              });

      _.extend(ret.options.fields, {
        size: {
          hidden: false,
          readonly: true,
          label: lang.formFieldSizeLabel,
          placeholder: lang.alpacaPlaceholderNotAvailable,
          type: "text"
        }
      });

      _.extend(ret.schema.properties, {
        size: {
          hidden: false,
          readonly: true,
          title: lang.formFieldSizeLabel,
          type: "string"
        }
      });
    },

    _addItemidInfo: function (ret, options) {
      if (!!this.node) {
        var type = this.options.node.get('type');
        var refNode =
                _.extend(ret.data, {
                  itemId: this.node.get('id')
                });

        _.extend(ret.options.fields, {
          itemId: {
            hidden: false,
            readonly: true,
            label: lang.formFieldItemIdLabel,
            placeholder: lang.alpacaPlaceholderNotAvailable,
            type: "text"
          }
        });
        _.extend(ret.schema.properties, {
          itemId: {
            hidden: false,
            readonly: true,
            label: lang.formFieldItemIdLabel,
            placeholder: lang.alpacaPlaceholderNotAvailable,
            type: "text",
            tooltip: this.node.get('id')
          }
        });
      }
    },

    _addCreateDateInfo: function (ret, options) {
      if (!ret.options.fields.create_date) {
        return;
      }
      ret.options.fields.create_date.type = 'datetime';
      ret.options.fields.create_date.placeholder = lang.alpacaPlaceholderNotAvailable;
      ret.schema.properties.create_date.format = 'datetime';
    },

    _addModifyDateInfo: function (ret, options) {
      if (!ret.options.fields.modify_date) {
        return;
      }
      ret.options.fields.modify_date.type = 'datetime';
      ret.options.fields.modify_date.placeholder = lang.alpacaPlaceholderNotAvailable;
      ret.schema.properties.modify_date.format = 'datetime';
    },

    _addOwnerInfo: function (ret, options) {
      var ownerField = 'owner_user_id';
      if (this.node instanceof VersionModel) {
        ownerField = 'owner_id';  // v1 has a slightly different field name
      }
      if (!ret.options.fields[ownerField]) {
        return;
      }
      var isOwnerExists = this.node.get('owner_user_id') === -3,
          owner         = isOwnerExists ? {
            'id': -3
          } : (this.node.get('owner_user_id_expand') ||
               this.node.get('owner_user_id') ||
               this.node.get('owner_id'));

      if (owner && owner instanceof Object) {
        ret.data[ownerField] = owner.id;
        ret.options.fields[ownerField].type = 'otcs_user';
        ret.options.fields[ownerField].type_control = {
          name: isOwnerExists ? lang.NoOwner : base.formatMemberName(owner)
        };
        ret.options.fields[ownerField].placeholder = lang.alpacaPlaceholderNotAvailable;
      }
    },

    _addCreatorInfo: function (ret, options) {
      if (!ret.options.fields.create_user_id) {
        return;
      }
      var creator = this.node.get('create_user_id_expand') ||
                    this.node.get('create_user_id');
      if (creator && creator instanceof Object) {
        ret.data.create_user_id = creator.id;
        ret.options.fields.create_user_id.type = 'otcs_user';
        ret.options.fields.create_user_id.type_control = {
          name: base.formatMemberName(creator)
        };
        ret.options.fields.create_user_id.placeholder = lang.alpacaPlaceholderNotAvailable;
      }
    },

    _addMimeTypeInfo: function (ret, options) {
      var type = this.options.node.get('type');
      var node = this.options.node;

      _.extend(ret.data, {
        mime_type: NodeSpriteCollection.findTypeByNode(node)
      });

      _.extend(ret.options.fields, {
        mime_type: {
          hidden: false,
          readonly: true,
          label: lang.formFieldTypeLabel,
          placeholder: lang.alpacaPlaceholderNotAvailable,
          type: "text"
        }
      });

      _.extend(ret.schema.properties, {
        mime_type: {
          hidden: false,
          readonly: true,
          title: lang.formFieldTypeLabel,
          type: "string"
        }
      });
    },
    _addMimeTypeClassNameInfo: function (ret, options) {
      var type = this.options.node.get('type');
      var node = this.options.node;
      _.extend(ret.data, {
        mimeTypeClassName: NodeSpriteCollection.findClassByNode(node)
      });
    },

    _ensurePlaceholder: function (ret, options) {
      if (ret.options.fields.description) {
        var desc = ret.options.fields.description;
        if (desc.placeholder === undefined || desc.placeholder.length === 0) {
          desc.placeholder = lang.alpacaPlaceholderDescription;
        }
      }
    },

    _addReserveInfo: function (ret, options) {
      var refNode =
              _.extend(ret.data, {
                reserve_info: ((!!this.options.node.get('reserved')) ? this : undefined)
              });

      _.extend(ret.options.fields, {
        reserve_info: {
          hidden: false,
          readonly: true,
          label: lang.formFieldReservedByLabel,
          type: "otcs_reserve_button"
        }
      });

      _.extend(ret.schema.properties, {
        reserve_info: {
          hidden: false,
          readonly: true,
          type: "otcs_reserve_button"
        }
      });
    }
  };

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, prototypeExt);
    }
  };

  return ServerAdaptorMixin;
});
