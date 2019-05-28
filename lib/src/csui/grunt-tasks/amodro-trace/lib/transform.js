/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


var define = function(ary, fn) {
    module.exports = fn.apply(undefined,
                              (ary.map(function(id) { return require(id); })));
};

define([ 'esprima', './parse', './lang'],
function (esprima, parse, lang) {
    'use strict';
    var transform,
        jsExtRegExp = /\.js$/g,
        baseIndentRegExp = /^([ \t]+)/,
        indentRegExp = /\{[\r\n]+([ \t]+)/,
        keyRegExp = /^[_A-Za-z]([A-Za-z\d_]*)$/,
        bulkIndentRegExps = {
            '\n': /\n/g,
            '\r\n': /\r\n/g
        };

    function applyIndent(str, indent, lineReturn) {
        var regExp = bulkIndentRegExps[lineReturn];
        return str.replace(regExp, '$&' + indent);
    }

    transform = {
        toTransport: function (namespace, moduleName, path, contents, onFound, options) {
            options = options || {};

            var astRoot, contentLines, modLine,
                foundAnon,
                scanCount = 0,
                scanReset = false,
                defineInfos = [],
                applySourceUrl = function (contents) {
                    if (options.useSourceUrl) {
                        contents = 'eval("' + lang.jsEscape(contents) +
                            '\\n//# sourceURL=' + (path.indexOf('/') === 0 ? '' : '/') +
                            path +
                            '");\n';
                    }
                    return contents;
                };

            try {
                astRoot = esprima.parse(contents, {
                    loc: true
                });
            } catch (e) {
                var logger = options.logger;
                if (logger && logger.warn) {
                    if (jsExtRegExp.test(path)) {
                        logger.warn('toTransport skipping ' + path +
                                    ': ' + e.toString());
                    }
                }
                return contents;
            }
            parse.traverse(astRoot, function (node) {
                var args, firstArg, firstArgLoc, factoryNode,
                    needsId, depAction, foundId, init,
                    sourceUrlData, range,
                    namespaceExists = false;
                if (node.type === 'VariableDeclarator' &&
                    node.id && node.id.name === 'define' &&
                    node.id.type === 'Identifier') {
                    init = node.init;
                    if (init && init.callee &&
                        init.callee.type === 'CallExpression' &&
                        init.callee.callee &&
                        init.callee.callee.type === 'Identifier' &&
                        init.callee.callee.name === 'require' &&
                        init.callee.arguments && init.callee.arguments.length === 1 &&
                        init.callee.arguments[0].type === 'Literal' &&
                        init.callee.arguments[0].value &&
                        init.callee.arguments[0].value.indexOf('amdefine') !== -1) {
                    } else {
                        return false;
                    }
                }

                namespaceExists = namespace &&
                                node.type === 'CallExpression' &&
                                node.callee  && node.callee.object &&
                                node.callee.object.type === 'Identifier' &&
                                node.callee.object.name === namespace &&
                                node.callee.property.type === 'Identifier' &&
                                node.callee.property.name === 'define';

                if (namespaceExists || parse.isDefineNodeWithArgs(node)) {
                    args = node.arguments;
                    if (!args || !args.length) {
                        return;
                    }

                    firstArg = args[0];
                    firstArgLoc = firstArg.loc;

                    if (args.length === 1) {
                        if (firstArg.type === 'Identifier') {
                            needsId = true;
                            depAction = 'empty';
                        } else if (parse.isFnExpression(firstArg)) {
                            factoryNode = firstArg;
                            needsId = true;
                            depAction = 'scan';
                        } else if (firstArg.type === 'ObjectExpression') {
                            needsId = true;
                            depAction = 'skip';
                        } else if (firstArg.type === 'Literal' &&
                                   typeof firstArg.value === 'number') {
                            needsId = true;
                            depAction = 'skip';
                        } else if (firstArg.type === 'UnaryExpression' &&
                                   firstArg.operator === '-' &&
                                   firstArg.argument &&
                                   firstArg.argument.type === 'Literal' &&
                                   typeof firstArg.argument.value === 'number') {
                            needsId = true;
                            depAction = 'skip';
                        } else if (firstArg.type === 'MemberExpression' &&
                                   firstArg.object &&
                                   firstArg.property &&
                                   firstArg.property.type === 'Identifier') {
                            needsId = true;
                            depAction = 'empty';
                        }
                    } else if (firstArg.type === 'ArrayExpression') {
                        needsId = true;
                        depAction = 'skip';
                    } else if (firstArg.type === 'Literal' &&
                               typeof firstArg.value === 'string') {
                        needsId = false;
                        if (args.length === 2 &&
                            parse.isFnExpression(args[1])) {
                            factoryNode = args[1];
                            depAction = 'scan';
                        } else {
                            depAction = 'skip';
                        }
                    } else {
                        return;
                    }

                    range = {
                        foundId: foundId,
                        needsId: needsId,
                        depAction: depAction,
                        namespaceExists: namespaceExists,
                        node: node,
                        defineLoc: node.loc,
                        firstArgLoc: firstArgLoc,
                        factoryNode: factoryNode,
                        sourceUrlData: sourceUrlData
                    };
                    if (range.needsId) {
                        if (foundAnon) {
                            var logger = options.logger;
                            if (logger && logger.warn) {
                               logger.warn(path + ' has more than one anonymous ' +
                                'define. May be a built file from another ' +
                                'build system like, Ender. Skipping normalization.');
                            }
                            defineInfos = [];
                            return false;
                        } else {
                            foundAnon = range;
                            defineInfos.push(range);
                        }
                    } else if (depAction === 'scan') {
                        scanCount += 1;
                        if (scanCount > 1) {
                            if (!scanReset) {
                                defineInfos =  foundAnon ? [foundAnon] : [];
                                scanReset = true;
                            }
                        } else {
                            defineInfos.push(range);
                        }
                    }
                }
            });


            if (!defineInfos.length) {
                return applySourceUrl(contents);
            }
            defineInfos.reverse();

            contentLines = contents.split('\n');

            modLine = function (loc, contentInsertion) {
                var startIndex = loc.start.column,
                lineIndex = loc.start.line - 1,
                line = contentLines[lineIndex];
                contentLines[lineIndex] = line.substring(0, startIndex) +
                                           contentInsertion +
                                           line.substring(startIndex,
                                                              line.length);
            };

            defineInfos.forEach(function (info) {
                var deps,
                    contentInsertion = '',
                    depString = '';
                if (info.needsId && moduleName) {
                    contentInsertion += "'" + moduleName + "',";
                }

                if (info.depAction === 'scan') {
                    deps = parse.getAnonDepsFromNode(info.factoryNode);

                    if (deps.length) {
                        depString = '[' + deps.map(function (dep) {
                            return "'" + dep + "'";
                        }) + ']';
                    } else {
                        depString = '[]';
                    }
                    depString +=  ',';

                    if (info.factoryNode) {
                        modLine(info.factoryNode.loc, depString);
                    } else {
                        contentInsertion += depString;
                    }
                }

                if (contentInsertion) {
                    modLine(info.firstArgLoc, contentInsertion);
                }
                if (namespace && !info.namespaceExists) {
                    modLine(info.defineLoc, namespace + '.');
                }
                if (onFound) {
                    onFound(info);
                }
            });

            contents = contentLines.join('\n');

            return applySourceUrl(contents);
        },
        modifyConfig: function (fileContents, onConfig) {
            var details = parse.findConfig(fileContents),
                config = details.config;

            if (config) {
                config = onConfig(config);
                if (config) {
                    return transform.serializeConfig(config,
                                              fileContents,
                                              details.range[0],
                                              details.range[1],
                                              {
                                                quote: details.quote
                                              });
                }
            }

            return fileContents;
        },

        serializeConfig: function (config, fileContents, start, end, options) {
            var indent, match, configString, outDentRegExp,
                baseIndent = '',
                startString = fileContents.substring(0, start),
                existingConfigString = fileContents.substring(start, end),
                lineReturn = existingConfigString.indexOf('\r') === -1 ? '\n' : '\r\n',
                lastReturnIndex = startString.lastIndexOf('\n');
            if (lastReturnIndex === -1) {
                lastReturnIndex = 0;
            }

            match = baseIndentRegExp.exec(startString.substring(lastReturnIndex + 1, start));
            if (match && match[1]) {
                baseIndent = match[1];
            }
            match = indentRegExp.exec(existingConfigString);
            if (match && match[1]) {
                indent = match[1];
            }

            if (!indent || indent.length < baseIndent) {
                indent = '  ';
            } else {
                indent = indent.substring(baseIndent.length);
            }

            outDentRegExp = new RegExp('(' + lineReturn + ')' + indent, 'g');

            configString = transform.objectToString(config, {
                                                    indent: indent,
                                                    lineReturn: lineReturn,
                                                    outDentRegExp: outDentRegExp,
                                                    quote: options && options.quote
                                                });
            configString = applyIndent(configString, baseIndent, lineReturn);

            return startString + configString + fileContents.substring(end);
        },
        objectToString: function (obj, options, totalIndent) {
            var startBrace, endBrace, nextIndent,
                first = true,
                value = '',
                lineReturn = options.lineReturn,
                indent = options.indent,
                outDentRegExp = options.outDentRegExp,
                quote = options.quote || '"';

            totalIndent = totalIndent || '';
            nextIndent = totalIndent + indent;

            if (obj === null) {
                value = 'null';
            } else if (obj === undefined) {
                value = 'undefined';
            } else if (typeof obj === 'number' || typeof obj === 'boolean') {
                value = obj;
            } else if (typeof obj === 'string') {
                value = quote + lang.jsEscape(obj) + quote;
            } else if (lang.isArray(obj)) {
                lang.each(obj, function (item, i) {
                    value += (i !== 0 ? ',' + lineReturn : '' ) +
                        nextIndent +
                        transform.objectToString(item,
                                                 options,
                                                 nextIndent);
                });

                startBrace = '[';
                endBrace = ']';
            } else if (lang.isFunction(obj) || lang.isRegExp(obj)) {
                value = obj.toString().replace(outDentRegExp, '$1');
            } else {
                lang.eachProp(obj, function (v, prop) {
                    value += (first ? '': ',' + lineReturn) +
                        nextIndent +
                        (keyRegExp.test(prop) ? prop : quote + lang.jsEscape(prop) + quote )+
                        ': ' +
                        transform.objectToString(v,
                                                 options,
                                                 nextIndent);
                    first = false;
                });
                startBrace = '{';
                endBrace = '}';
            }

            if (startBrace) {
                value = startBrace +
                        lineReturn +
                        value +
                        lineReturn + totalIndent +
                        endBrace;
            }

            return value;
        }
    };

    return transform;
});
