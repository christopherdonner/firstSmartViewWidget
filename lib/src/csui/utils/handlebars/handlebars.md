## Handlebars Helpers

Globally usable helpers.  Just require the module and the helpers will be
registered.  All helpers here have the `csui-` prefix.

### l10n

```text
{{csui-l10n property}}
```

Renders a string localized to the current locale using the `property` value.
The implementation is based on the
[`getClosestLocalizedString()`](../base.md#getclosestlocalizedstringvalue-fallback-string)
function from [*csui/utils/base*](../base.md).
