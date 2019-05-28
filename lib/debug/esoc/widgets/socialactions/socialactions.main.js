/**
 * SocialActionsMainWidget is for initiating all the
 * social actions (comments, likes, tags, chat, etc.,)
 * based on the permissions.
 */

csui.define([
  'module',
  'require',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/connector',
  'csui/utils/namedsessionstorage',
  'esoc/widgets/socialactions/socialactions.view',
  'csui/utils/contexts/factories/connector'
], function (module, _require, $, Marionette, Connector, NamedSessionStorage,
    SocialActionsItemView, ConnectorFactory) {
  function SocialActionsMainWidget(options) {
    if (!options.connector) {
      options.connector = options.context.getObject(ConnectorFactory);
    }
    var namedSessionStorage = new NamedSessionStorage();
    $(options.placeholder).ready(function () {
      $(options.placeholder).each(function () {
        var contentRegion = new Marionette.Region({
          el: $(this)
        });
        var rockey = $(this).data("rockey");
        var roid = $(this).data("roid");
        if (namedSessionStorage.get(rockey + roid) !== undefined &&
            namedSessionStorage.get(rockey + roid).length > 0) {
          $(this).attr("data-csid", namedSessionStorage.get(rockey + roid));
        }
        var socialActionsItemsView = new SocialActionsItemView({
          connector: options.connector,
          context: options.context,
          rockey: rockey,
          roid: roid,
          csid: $(this).data("csid"),
          baseElement: $(this),
          maxMessageLength: options.config_settings.maxMessageLength
        });
        contentRegion.show(socialActionsItemsView);
      });
    });
  }

  return SocialActionsMainWidget;
});
