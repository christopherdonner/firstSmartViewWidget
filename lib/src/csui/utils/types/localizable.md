# Localizable Strings (csui/utils/types/localizable)

This module holds functions for performing string operations with localized strings or multi-lingual objects. They use the current application's locale, which is accessible via the "csui/lib/i18n" module.

## getClosestLocalizedString(value, fallback) : string

Returns a localized text picked from the multilingual value for the closest
language to the current locale settings.

The multilingual value is an object literal where keys are locales or
languages and values are localized texts:

```text
{
  "<locale or language>": "<localized text>",
  ...
}
```

For example:

```json
{
  "en":    "carbon-fiber",
  "en-br": "carbon-fibre",
  "de":    "Kohlefaser"
}
```

Locale identifier has the format `<language>-<country>` where `language` is
a two-letter code from [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
and `country`is a two-letter code from [ISO-3166-1](https://en.wikipedia.org/wiki/ISO_3166-1).
Locale matching is case-insensitive.

The CS REST API uses different format for locale identifiers, which occur
in multilingual metadata - underscore server as the separator instead of
hyphen (`<language>_<country>`).  It is recognized by this method as well
to allow easy integration, but do not use such locale identifiers in your
code and configugarion.  They are invalid for components which parse locale
identifiers using [RFC-5646](https://tools.ietf.org/html/rfc5646)
and [RFC-4647](https://tools.ietf.org/html/rfc4647) standards.  You would
have to convert your identifiers all the time.

### Parameters

value (object literal or any)
: Multilingual value as a map, where keys are locales or languages and values
  are localized texts, or any value which woudl be converted to a string
  (optional; an empty string - `''` - is the default)

fallback (any)
: A string to return if no fitting locale can be found in the `value` map.

### Result

The function returns always a string; if you do not pass an object literal
as the `value`, it will return `value.toString()` or `''` if the value
is `null` or `undefined`.  You do not need to check if the input `value`
is multilingual; you can pass normal strings to the function as well.

### Example

```javascript
var multilingualLabel = {
      'en': 'carbon-fiber',
      'de': 'Kohlenfaser'
    },
    // Receives 'carbon-fiber' for the 'en-US' locale
    label = base.getClosestLocalizedString(multilingualLabel);
```

## locale*String (...) : ...

These string operations work similarly to comparison operators and function in the `String` prototype, but they use rules for character comparing, changing case and transliterating as expected for the current application's locale.

### localeCompareString(left, right, options): -1|0|1

Compares two strings according to the current locale and returns the result of the following operation: `left < right ? -1 : left > right ? 1 : 0`.

String comparisons may use different rules, depending on the usage scenario; like searching or sorting, for example. Specify your intention using the `options` parameter:

```txt
{usage: 'search'} - you are searching or filtering
{usage: 'sort'}   - your are sorting
```

### localeContainsString(hay, needle): boolean

Works like a locale-specific `String.prototype.contains`.

### localeEndsWithString(full, end): boolean

Works like a locale-specific `String.prototype.endsWith`.

### localeIndexOfString(hay, needle): number

Works like a locale-specific `String.prototype.indexOf`.

### localeStartsWithString(full, start): boolean

Works like a locale-specific `String.prototype.startsWith`.

## formatMessage (count, messages, ...) : string

Chooses a string format from `messages` according to the supplied `count` and formats a string with `sformat` from "csui/lib/underscore.string" using the `count` and optionally other arguments. The argument `messages` is expected to have the following structure:

```javascript
  {
    formatForNone: 'expression for count == 0',
    formatForOne: 'expression for count == 1',
    formatForTwo: 'expression for 2 <= count <= 4',
    formatForFive: 'expression for count >= 5'
  }
```

If the key `formatForNone` is missing, `formatForFive` will be used instead of it.

Grammars of different languages use different rules how to declinate a substantive, which comes after a number representing a count. The count value usually changes the extension of the substantive, related adjectives, or sometimes the entire expression.

### Example

```txt
English     Czech           Format
----------------------------------------------------------
no file     žádný soubor    none (formatForNone, optional)
 1 file     1 soubor        one  (formatForOne)
 2 files    2 soubory       some (formatForTwo)
 3 files    3 soubory
 4 files    4 soubory
 5 files    5 souborů       many (formatForFive)
 6 files    6 souborů
 ...
 N files    N souborů       many (formatForFive)
 0 files    0 souborů       many (formatForFive, fallback)
```