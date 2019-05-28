/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/**
 * @license i18n 2.0.6 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/i18n/LICENSE
 */
/*jslint regexp: true */
/*global require: false, navigator: false, define: false */

/**
 * This plugin handles i18n! prefixed modules. It does the following:
 *
 * 1) A regular module can have a dependency on an i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like 'i18n!nls/colors'.
 *
 * This plugin will load the i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is 'en-us',
 * then the plugin will ask for the 'en-us', 'en' and 'root' bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * i18n!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */

// [OT] Modifications done:
//
// * Adding :preferred after the requirejs module name will use the highest
//   priority preferred language, adding :configured will use the 'locale'
//   configuration options

+    //:preferred or :configured can be appended to use preferredLocales or locale

(function () {
    'use strict';

    //regexp for reconstructing the master bundle name from parts of the regexp match
    //nlsRegExp.exec('foo/bar/baz/nls/en-ca/foo') gives:
    //['foo/bar/baz/nls/en-ca/foo', 'foo/bar/baz/nls/', '/', '/', 'en-ca', 'foo']
    //nlsRegExp.exec('foo/bar/baz/nls/foo') gives:
    //['foo/bar/baz/nls/foo', 'foo/bar/baz/nls/', '/', '/', 'foo', '']
    //so, if match[5] is blank, it means this is the top bundle definition.
    // [OT] Introduce suffixes to choose configured language
    //:preferred or :configured can be appended to use preferredLocales or locale
    var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/:]*)\/?([^\/:]*)(:[^\/:]*)?/;

    //Helper function to avoid repeating code. Lots of arguments in the
    //desire to stay functional and support RequireJS contexts without having
    //to know about the RequireJS contexts.
    function addPart(locale, master, needed, toLoad, prefix, suffix) {
        if (master[locale]) {
            needed.push(locale);
            if (master[locale] === true || master[locale] === 1) {
                toLoad.push(prefix + locale + '/' + suffix);
            }
        }
    }

    function addIfExists(req, locale, toLoad, prefix, suffix) {
        var fullName = prefix + locale + '/' + suffix;
        if (require._fileExists(req.toUrl(fullName + '.js'))) {
            toLoad.push(fullName);
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     * This is not robust in IE for transferring methods that match
     * Object.prototype names, but the uses of mixin here seem unlikely to
     * trigger a problem related to that.
     */
    function mixin(target, source, force) {
        var prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop) && (!target.hasOwnProperty(prop) || force)) {
                target[prop] = source[prop];
            } else if (typeof source[prop] === 'object') {
                if (!target[prop] && source[prop]) {
                    target[prop] = {};
                }
                mixin(target[prop], source[prop], force);
            }
        }
    }

    define(['module'], function (module) {
        var masterConfig = module.config ? module.config() : {},
            locale = masterConfig.locale,
            // [OT] Introduce defaultLocale to make the fallback language
            // configurable and change the default from 'root' to English
            defaultLocale = masterConfig.defaultLocale || 'en-us',
            // [OT] Introduce preferredLocales separate from locale. Module
            // suffix can select between those two. preferredLocales can be
            // used also by other plugins for input and output, while locale
            // can stay for display text translation.
            preferredLocales = masterConfig.preferredLocales || [],
            // [OT] Introduce loadableLocales to limit languages, which are
            // tried to load to only those, which are available on the server
            loadableLocales = masterConfig.loadableLocales || [],
            // [OT] Introduce rtl as a setting for other modules, which is
            // beneficial to maintain together with other settings here
            rtl = masterConfig.rtl || false,
            // [OT] Introduce overriding specific strings in specific modules
            // from module/string keys in require.conf objects
            overrides = masterConfig.overrides || {};
        defaultLocale = defaultLocale.toLowerCase();
        if (!locale) {
            locale = typeof navigator !== 'undefined' &&
                     (navigator.languages && navigator.languages[0] ||
                      navigator.language || navigator.userLanguage) ||
                     defaultLocale;
        }
        locale = locale.toLowerCase();
        // [OT] Make an aray of all locales loadable by requirejs
        if (typeof loadableLocales === 'object' && !(loadableLocales instanceof Array)) {
            loadableLocales = Object.keys(loadableLocales);
        }
        var localeIndex, convertedLocale;
        for (localeIndex = 0; localeIndex < loadableLocales.length; ++localeIndex) {
            convertedLocale = loadableLocales[localeIndex];
            if (convertedLocale) {
                loadableLocales[localeIndex] = convertedLocale.toLowerCase();
            }
        }
        // [OT] Convert the string from Accept-Language to a prioritized array
        if (typeof preferredLocales === 'string') {
            // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4
            // See https://tools.ietf.org/html/bcp47
            // Example: "en-GB, sv;q=0.7, en;q=0.9"
            preferredLocales = preferredLocales
                .replace(/\s/g, '')
                .split(',')
                .map(function (item) {
                    var pair = item.split(';'),
                        quality = pair[1] || '';
                    return {
                        locale: pair[0].toLowerCase(),
                        quality: parseFloat(quality.split('=')[1] || 1)
                    };
                })
                // Skip empty items after splitting with ','
                .filter(function (item) {
                    return item.locale;
                })
                .sort(function (left, right) {
                    left = left.quality;
                    right = right.quality;
                    // the other way round - higher quality should be at the front
                    // quality 1 should come before quality 0
                    return left < right ? 1 : left > right ? -1 : 0;
                });
        }
        // [OT] Ensure, that we have at least the configured language as the preference
        if (!preferredLocales.length) {
          preferredLocales[0] = {
              locale: locale,
              quality: 1
          };
        }
        // [OT] Put together all localization settings into a single structure
        // to make the public interface
        var settings = {
            // Specified UI language chosen for the user
            locale: locale,
            // Specifies the default (fallback) language, if user
            // language is not available
            defaultLocale: defaultLocale,
            // Lists UI languages, which are availabel to choose from,
            // as a map, where keys are locales and values is true.
            loadableLocales: loadableLocales,
            // Lists preferred data formatting and sorting locales
            // in the preferred order as an array, where items are
            // objects with properties 'locale' and 'quality'
            preferredLocales: preferredLocales,
            // Specifies whether current language supports RTL or not
            rtl: rtl
        };

        return {
            version: '2.0.6',
            // [OT] FIXME: Remove defaultLocale; it was left here for compatibility
            defaultLocale: locale,
            // [OT] Expose the localization settings for module consumers
            settings: settings,
            /**
             * Called when a dependency needs to be loaded.
             */
            load: function (name, req, onLoad, config) {
                config = config || {};

                var masterName,
                    match = nlsRegExp.exec(name),
                    prefix = match[1],
                    locale = match[4],
                    suffix = match[5],
                    // [OT] Support ':suffix' preferences
                    preference = match[6],
                    parts = locale.split('-'),
                    toLoad = [],
                    value = {},
                    i, part, current = '';

                //If match[5] is blank, it means this is the top bundle definition,
                //so it does not have to be handled. Locale-specific requests
                //will have a match[4] value but no match[5]
                if (match[5]) {
                    //locale-specific bundle
                    prefix = match[1];
                } else {
                    //Top-level bundle.
                    suffix = match[4];
                    // [OT] Let the caller decide between the web browser settings
                    // for data formatting and the locale for translated texts
                    // TODO: Try preferred locales in the preferred order; not just
                    // the highest priority in the preferredLocales array
                    locale = preference === ':preferred' ?
                             settings.preferredLocales[0].locale : settings.locale;
                    parts = locale.split('-');
                }
                masterName = prefix + suffix;

                if (config.isBuild) {
                    //Check for existence of all locale possible files and
                    //require them if exist.
                    toLoad.push(masterName);
                    addIfExists(req, 'root', toLoad, prefix, suffix);
                    for (i = 0; i < parts.length; i++) {
                        part = parts[i];
                        current += (current ? '-' : '') + part;
                        addIfExists(req, current, toLoad, prefix, suffix);
                    }

                    req(toLoad, function () {
                        onLoad();
                    });
                } else {
                    //First, fetch the master bundle, it knows what locales are available.
                    req([masterName], function (master) {
                        //Figure out the best fit
                        var needed = [], unknown = [],
                            part;

                        //Always allow for root, then do the rest of the locale parts.
                        addPart('root', master, needed, toLoad, prefix, suffix);
                        for (i = 0; i < parts.length; i++) {
                            part = parts[i];
                            current += (current ? '-' : '') + part;
                            if (master[current] !== undefined) {
                                addPart(current, master, needed, toLoad,
                                        prefix, suffix);
                            } else {
                                // [OT] Gather the languages, which have not been
                                // specified in the master module
                                unknown.push(current);
                            }
                        }

                        //Load all the parts missing.
                        function loadKnownParts() {
                            req(toLoad, function () {
                                var i, partBundle, partModule, part;
                                for (i = needed.length - 1; i > -1 && needed[i]; i--) {
                                    part = needed[i];
                                    partBundle = master[part];
                                    // [OT] Fill the localization object from custom localization
                                    // strings before loading the localization modules
                                    // Full name of the module with localized strings
                                    partModule = prefix + part + '/' + suffix;
                                    // Merge dynamic localized strings from the configuration, if found
                                    Object.keys(overrides)
                                        .forEach(function (overrideModule) {
                                            if (overrideModule === partModule) {
                                                mixin(value, overrides[overrideModule]);
                                            }
                                        });
                                    // Support localization modules stored outside the master module
                                    if (partBundle === true || partBundle === 1) {
                                        partBundle = req(partModule);
                                    }
                                    // Merge static localized strings from the localizatoin module
                                    mixin(value, partBundle);
                                }

                                //All done, notify the loader.
                                onLoad(value);
                            }, function (error) {
                                // [OT] If a language module fails, propagate the failure
                                // and do not wait for a time-out
                                if (onLoad.error) {
                                    onLoad.error(error);
                                }
                            });
                        }

                        // [OT] Combine loading both known and unknown language modules

                        //Try loading one by one parts not specified in the
                        //master module and when all were processed, load the
                        //known rest and build the requested bundle.
                        function loadUnknownParts() {
                            current = unknown.shift();
                            if (current) {
                                if (settings.loadableLocales.length === 0 ||
                                    settings.loadableLocales.indexOf(current) >= 0) {
                                    req([prefix + current + '/' + suffix],
                                        function () {
                                            needed.push(current);
                                            master[current] = true;
                                            loadUnknownParts();
                                        }, function () {
                                            master[current] = false;
                                            loadUnknownParts();
                                        });
                                } else {
                                    master[current] = false;
                                    loadUnknownParts();
                                }
                            } else {
                                loadKnownParts();
                            }
                        }

                        //If at least one of the fallback locales was specified
                        // in the master module, do not try the unspecified.
                        if (needed.length > 1) {
                            loadKnownParts();
                        } else {
                            loadUnknownParts();
                        }
                    }, function (error) {
                        if (onLoad.error) {
                            onLoad.error(error);
                        }
                    });
                }
            }
        };
    });
}());
