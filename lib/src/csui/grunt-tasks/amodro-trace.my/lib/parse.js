/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


var define = function(ary, fn) {
    module.exports = fn.apply(undefined,
                              (ary.map(function(id) { return require(id); })));
};
define(['esprima', './lang'], function (esprima, lang) {
    'use strict';

    function arrayToString(ary) {
        var output = '[';
        if (ary) {
            ary.forEach(function (item, i) {
                output += (i > 0 ? ',' : '') + '"' + lang.jsEscape(item) + '"';
            });
        }
        output += ']';

        return output;
    }
    var argPropName = 'arguments',
        emptyScope = {},
        mixin = lang.mixin,
        hasProp = lang.hasProp;
    function traverse(object, visitor) {
        var key, child;

        if (!object) {
            return;
        }

        if (visitor.call(null, object) === false) {
            return false;
        }
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    if (traverse(child, visitor) === false) {
                        return false;
                    }
                }
            }
        }
    }
    function traverseBroad(object, visitor) {
        var key, child;

        if (!object) {
            return;
        }

        if (visitor.call(null, object) === false) {
            return false;
        }
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    traverseBroad(child, visitor);
                }
            }
        }
    }
    function getValidDeps(node) {
        if (!node || node.type !== 'ArrayExpression' || !node.elements) {
            return;
        }

        var deps = [];

        node.elements.some(function (elem) {
            if (elem.type === 'Literal') {
                deps.push(elem.value);
            }
        });

        return deps.length ? deps : undefined;
    }
    function isFnExpression(node) {
        return (node && (node.type === 'FunctionExpression' ||
                             node.type === 'ArrowFunctionExpression'));
    }
    function parse(moduleName, fileName, fileContents, options) {
        options = options || {};
        var i, moduleCall, depString,
            moduleDeps = [],
            result = '',
            moduleList = [],
            needsDefine = true,
            astRoot = esprima.parse(fileContents);

        parse.recurse(astRoot, function (callName, config, name, deps, node, factoryIdentifier, fnExpScope) {
            if (!deps) {
                deps = [];
            }

            if (callName === 'define' && (!name || name === moduleName)) {
                needsDefine = false;
            }

            if (!name) {
                moduleDeps = moduleDeps.concat(deps);
            } else {
                moduleList.push({
                    name: name,
                    deps: deps
                });
            }

            if (callName === 'define' && factoryIdentifier && hasProp(fnExpScope, factoryIdentifier)) {
                return factoryIdentifier;
            }
            return !!options.findNestedDependencies;
        }, options);

        if (options.insertNeedsDefine && needsDefine) {
            result += 'require.needsDefine("' + moduleName + '");';
        }

        if (moduleDeps.length || moduleList.length) {
            for (i = 0; i < moduleList.length; i++) {
                moduleCall = moduleList[i];
                if (result) {
                    result += '\n';
                }
                if (moduleCall.name === moduleName) {
                    moduleCall.deps = moduleCall.deps.concat(moduleDeps);
                    moduleDeps = [];
                }

                depString = arrayToString(moduleCall.deps);
                result += 'define("' + moduleCall.name + '",' +
                          depString + ');';
            }
            if (moduleDeps.length) {
                if (result) {
                    result += '\n';
                }
                depString = arrayToString(moduleDeps);
                result += 'define("' + moduleName + '",' + depString + ');';
            }
        }

        return result || null;
    }

    parse.traverse = traverse;
    parse.traverseBroad = traverseBroad;
    parse.isFnExpression = isFnExpression;
    parse.recurse = function (object, onMatch, options, fnExpScope) {
        var key, child, result, i, params, param, tempObject,
            hasHas = options && options.has;

        fnExpScope = fnExpScope || emptyScope;

        if (!object) {
            return;
        }
        if (hasHas && object.type === 'IfStatement' && object.test.type &&
                object.test.type === 'Literal') {
            if (object.test.value) {
                this.recurse(object.consequent, onMatch, options, fnExpScope);
            } else {
                this.recurse(object.alternate, onMatch, options, fnExpScope);
            }
        } else {
            result = this.parseNode(object, onMatch, fnExpScope);
            if (result === false) {
                return;
            } else if (typeof result === 'string') {
                return result;
            }
            if (object.type === 'ExpressionStatement' && object.expression &&
                    object.expression.type === 'CallExpression' && object.expression.callee &&
                    isFnExpression(object.expression.callee)) {
                tempObject = object.expression.callee;
            }
            if (object.type === 'UnaryExpression' && object.argument &&
                object.argument.type === 'CallExpression' && object.argument.callee &&
                isFnExpression(object.argument.callee)) {
                tempObject = object.argument.callee;
            }
            if (tempObject && tempObject.params && tempObject.params.length) {
                params = tempObject.params;
                fnExpScope = mixin({}, fnExpScope, true);
                for (i = 0; i < params.length; i++) {
                    param = params[i];
                    if (param.type === 'Identifier') {
                        fnExpScope[param.name] = true;
                    }
                }
            }

            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    child = object[key];
                    if (typeof child === 'object' && child !== null) {
                        result = this.recurse(child, onMatch, options, fnExpScope);
                        if (typeof result === 'string') {
                            break;
                        }
                    }
                }
            }
            if (typeof result === 'string') {
                if (hasProp(fnExpScope, result)) {
                    return result;
                }

                return;
            }
        }
    };
    parse.definesRequire = function (fileName, fileContents) {
        var found = false;

        traverse(esprima.parse(fileContents), function (node) {
            if (parse.hasDefineAmd(node)) {
                found = true;
                return false;
            }
        });

        return found;
    };
    parse.getAnonDeps = function (fileName, fileContents) {
        var astRoot = typeof fileContents === 'string' ?
                      esprima.parse(fileContents) : fileContents,
            defFunc = this.findAnonDefineFactory(astRoot);

        return parse.getAnonDepsFromNode(defFunc);
    };
    parse.getAnonDepsFromNode = function (node) {
        var deps = [],
            funcArgLength;

        if (node) {
            this.findRequireDepNames(node, deps);
            funcArgLength = node.params && node.params.length;
            if (funcArgLength) {
                deps = (funcArgLength > 1 ? ["require", "exports", "module"] :
                        ["require"]).concat(deps);
            }
        }
        return deps;
    };

    parse.isDefineNodeWithArgs = function (node) {
        return node && node.type === 'CallExpression' &&
               node.callee && node.callee.type === 'Identifier' &&
               node.callee.name === 'define' && node[argPropName];
    };
    parse.findAnonDefineFactory = function (node) {
        var match;

        traverse(node, function (node) {
            var arg0, arg1;

            if (parse.isDefineNodeWithArgs(node)) {
                arg0 = node[argPropName][0];
                if (isFnExpression(arg0)) {
                    match = arg0;
                    return false;
                }
                arg1 = node[argPropName][1];
                if (arg0.type === 'Literal' && isFnExpression(arg1)) {
                    match = arg1;
                    return false;
                }
            }
        });

        return match;
    };
    parse.findConfig = function (fileContents) {
        var jsConfig, foundConfig, stringData, foundRange, quote, quoteMatch,
            quoteRegExp = /(:\s|\[\s*)(['"])/,
            astRoot = esprima.parse(fileContents, {
                loc: true
            });

        traverse(astRoot, function (node) {
            var arg,
                requireType = parse.hasRequire(node);

            if (requireType && (requireType === 'require' ||
                    requireType === 'requirejs' ||
                    requireType === 'requireConfig' ||
                    requireType === 'requirejsConfig')) {

                arg = node[argPropName] && node[argPropName][0];

                if (arg && arg.type === 'ObjectExpression') {
                    stringData = parse.nodeToString(fileContents, arg);
                    jsConfig = stringData.value;
                    foundRange = stringData.range;
                    return false;
                }
            } else {
                arg = parse.getRequireObjectLiteral(node);
                if (arg) {
                    stringData = parse.nodeToString(fileContents, arg);
                    jsConfig = stringData.value;
                    foundRange = stringData.range;
                    return false;
                }
            }
        });

        if (jsConfig) {
            quoteMatch = quoteRegExp.exec(jsConfig);
            quote = (quoteMatch && quoteMatch[2]) || '"';
            foundConfig = eval('(' + jsConfig + ')');
        }

        return {
            config: foundConfig,
            range: foundRange,
            quote: quote
        };
    };
    parse.getRequireObjectLiteral = function (node) {
        if (node.id && node.id.type === 'Identifier' &&
                (node.id.name === 'require' || node.id.name === 'requirejs') &&
                node.init && node.init.type === 'ObjectExpression') {
            return node.init;
        }
    };
    parse.renameNamespace = function (fileContents, ns) {
        var lines,
            locs = [],
            astRoot = esprima.parse(fileContents, {
                loc: true
            });

        parse.recurse(astRoot, function (callName, config, name, deps, node) {
            locs.push(node.loc);
            return callName !== 'define';
        }, {});

        if (locs.length) {
            lines = fileContents.split('\n');
            locs.reverse();
            locs.forEach(function (loc) {
                var startIndex = loc.start.column,
                lineIndex = loc.start.line - 1,
                line = lines[lineIndex];

                lines[lineIndex] = line.substring(0, startIndex) +
                                   ns + '.' +
                                   line.substring(startIndex,
                                                      line.length);
            });

            fileContents = lines.join('\n');
        }

        return fileContents;
    };
    parse.findDependencies = function (fileName, fileContents, options) {
        var dependencies = [],
            astRoot = esprima.parse(fileContents);

        parse.recurse(astRoot, function (callName, config, name, deps) {
            if (deps) {
                dependencies = dependencies.concat(deps);
            }
        }, options);

        return dependencies;
    };
    parse.findCjsDependencies = function (fileName, fileContents) {
        var dependencies = [];

        traverse(esprima.parse(fileContents), function (node) {
            var arg;

            if (node && node.type === 'CallExpression' && node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' && node[argPropName] &&
                    node[argPropName].length === 1) {
                arg = node[argPropName][0];
                if (arg.type === 'Literal') {
                    dependencies.push(arg.value);
                }
            }
        });

        return dependencies;
    };
    parse.hasDefDefine = function (node) {
        return node.type === 'FunctionDeclaration' && node.id &&
                    node.id.type === 'Identifier' && node.id.name === 'define';
    };
    parse.hasDefineAmd = function (node) {
        return node && node.type === 'AssignmentExpression' &&
            node.left && node.left.type === 'MemberExpression' &&
            node.left.object && node.left.object.name === 'define' &&
            node.left.property && node.left.property.name === 'amd';
    };
    parse.refsDefineAmd = function (node) {
        return node && node.type === 'MemberExpression' &&
        node.object && node.object.name === 'define' &&
        node.object.type === 'Identifier' &&
        node.property && node.property.name === 'amd' &&
        node.property.type === 'Identifier';
    };
    parse.hasRequire = function (node) {
        var callName,
            c = node && node.callee;

        if (node && node.type === 'CallExpression' && c) {
            if (c.type === 'Identifier' &&
                    (c.name === 'require' ||
                    c.name === 'requirejs')) {
                callName = c.name;
            } else if (c.type === 'MemberExpression' &&
                    c.object &&
                    c.object.type === 'Identifier' &&
                    (c.object.name === 'require' ||
                        c.object.name === 'requirejs') &&
                    c.property && c.property.name === 'config') {
                callName = c.object.name + 'Config';
            }
        }

        return callName;
    };
    parse.hasDefine = function (node) {
        return node && node.type === 'CallExpression' && node.callee &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'define';
    };
    parse.getNamedDefine = function (fileContents) {
        var name;
        traverse(esprima.parse(fileContents), function (node) {
            if (node && node.type === 'CallExpression' && node.callee &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'define' &&
            node[argPropName] && node[argPropName][0] &&
            node[argPropName][0].type === 'Literal') {
                name = node[argPropName][0].value;
                return false;
            }
        });

        return name;
    };
    parse.usesAmdOrRequireJs = function (fileName, fileContents) {
        var uses;

        traverse(esprima.parse(fileContents), function (node) {
            var type, callName, arg;

            if (parse.hasDefDefine(node)) {
                type = 'declaresDefine';
            } else if (parse.hasDefineAmd(node)) {
                type = 'defineAmd';
            } else {
                callName = parse.hasRequire(node);
                if (callName) {
                    arg = node[argPropName] && node[argPropName][0];
                    if (arg && (arg.type === 'ObjectExpression' ||
                            arg.type === 'ArrayExpression')) {
                        type = callName;
                    }
                } else if (parse.hasDefine(node)) {
                    type = 'define';
                }
            }

            if (type) {
                if (!uses) {
                    uses = {};
                }
                uses[type] = true;
            }
        });

        return uses;
    };
    parse.usesCommonJs = function (fileName, fileContents) {
        var uses = null,
            assignsExports = false;


        traverse(esprima.parse(fileContents), function (node) {
            var type,
                exp = node.expression || node.init;

            if (node.type === 'Identifier' &&
                    (node.name === '__dirname' || node.name === '__filename')) {
                type = node.name.substring(2);
            } else if (node.type === 'VariableDeclarator' && node.id &&
                    node.id.type === 'Identifier' &&
                        node.id.name === 'exports') {
                type = 'varExports';
            } else if (exp && exp.type === 'AssignmentExpression' && exp.left &&
                    exp.left.type === 'MemberExpression' && exp.left.object) {
                if (exp.left.object.name === 'module' && exp.left.property &&
                        exp.left.property.name === 'exports') {
                    type = 'moduleExports';
                } else if (exp.left.object.name === 'exports' &&
                        exp.left.property) {
                    type = 'exports';
                }

            } else if (node && node.type === 'CallExpression' && node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' && node[argPropName] &&
                    node[argPropName].length === 1 &&
                    node[argPropName][0].type === 'Literal') {
                type = 'require';
            }

            if (type) {
                if (type === 'varExports') {
                    assignsExports = true;
                } else if (type !== 'exports' || !assignsExports) {
                    if (!uses) {
                        uses = {};
                    }
                    uses[type] = true;
                }
            }
        });

        return uses;
    };


    parse.findRequireDepNames = function (node, deps) {
        traverse(node, function (node) {
            var arg;

            if (node && node.type === 'CallExpression' && node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' &&
                    node[argPropName] && node[argPropName].length === 1) {

                arg = node[argPropName][0];
                if (arg.type === 'Literal') {
                    deps.push(arg.value);
                }
            }
        });
    };
    parse.parseNode = function (node, onMatch, fnExpScope) {
        var name, deps, cjsDeps, arg, factory, exp, refsDefine, bodyNode,
            args = node && node[argPropName],
            callName = parse.hasRequire(node);

        if (callName === 'require' || callName === 'requirejs') {
            arg = node[argPropName] && node[argPropName][0];
            if (arg && arg.type !== 'ArrayExpression') {
                if (arg.type === 'ObjectExpression') {
                    arg = node[argPropName][1];
                }
            }

            deps = getValidDeps(arg);
            if (!deps) {
                return;
            }

            return onMatch("require", null, null, deps, node);
        } else if (parse.hasDefine(node) && args && args.length) {
            name = args[0];
            deps = args[1];
            factory = args[2];

            if (name.type === 'ArrayExpression') {
                factory = deps;
                deps = name;
                name = null;
            } else if (isFnExpression(name)) {
                factory = name;
                name = deps = null;
            } else if (name.type !== 'Literal') {
                name = deps = factory = null;
            }

            if (name && name.type === 'Literal' && deps) {
                if (isFnExpression(deps)) {
                    factory = deps;
                    deps = null;
                } else if (deps.type === 'ObjectExpression') {
                    deps = factory = null;
                } else if (deps.type === 'Identifier' && args.length === 2) {
                    deps = factory = null;
                }
            }

            if (deps && deps.type === 'ArrayExpression') {
                deps = getValidDeps(deps);
            } else if (isFnExpression(factory)) {
                cjsDeps = parse.getAnonDepsFromNode(factory);
                if (cjsDeps.length) {
                    deps = cjsDeps;
                }
            } else if (deps || factory) {
                return;
            }
            if (name && name.type === 'Literal') {
                name = name.value;
            }

            return onMatch("define", null, name, deps, node,
                           (factory && factory.type === 'Identifier' ? factory.name : undefined),
                           fnExpScope);
        } else if (node.type === 'CallExpression' && node.callee &&
                   isFnExpression(node.callee) &&
                   node.callee.body && node.callee.body.body &&
                   node.callee.body.body.length === 1 &&
                   node.callee.body.body[0].type === 'IfStatement') {
            bodyNode = node.callee.body.body[0];
            if (bodyNode.consequent && bodyNode.consequent.body) {
                exp = bodyNode.consequent.body[0];
                if (exp.type === 'ExpressionStatement' && exp.expression &&
                    parse.hasDefine(exp.expression) &&
                    exp.expression.arguments &&
                    exp.expression.arguments.length === 1 &&
                    exp.expression.arguments[0].type === 'Identifier') {
                    traverse(bodyNode.test, function (node) {
                        if (parse.refsDefineAmd(node)) {
                            refsDefine = true;
                            return false;
                        }
                    });

                    if (refsDefine) {
                        return onMatch("define", null, null, null, exp.expression,
                                       exp.expression.arguments[0].name, fnExpScope);
                    }
                }
            }
        }
    };
    parse.nodeToString = function (contents, node) {
        var extracted,
            loc = node.loc,
            lines = contents.split('\n'),
            firstLine = loc.start.line > 1 ?
                        lines.slice(0, loc.start.line - 1).join('\n') + '\n' :
                        '',
            preamble = firstLine +
                       lines[loc.start.line - 1].substring(0, loc.start.column);

        if (loc.start.line === loc.end.line) {
            extracted = lines[loc.start.line - 1].substring(loc.start.column,
                                                            loc.end.column);
        } else {
            extracted =  lines[loc.start.line - 1].substring(loc.start.column) +
                     '\n' +
                     lines.slice(loc.start.line, loc.end.line - 1).join('\n') +
                     '\n' +
                     lines[loc.end.line - 1].substring(0, loc.end.column);
        }

        return {
            value: extracted,
            range: [
                preamble.length,
                preamble.length + extracted.length
            ]
        };
    };
    parse.getLicenseComments = function (fileName, contents) {
        var commentNode, refNode, subNode, value, i, j,
            ast = esprima.parse(contents, {
                comment: true,
                range: true
            }),
            result = '',
            existsMap = {},
            lineEnd = contents.indexOf('\r') === -1 ? '\n' : '\r\n';

        if (ast.comments) {
            for (i = 0; i < ast.comments.length; i++) {
                commentNode = ast.comments[i];

                if (commentNode.type === 'Line') {
                    value = '//' + commentNode.value + lineEnd;
                    refNode = commentNode;

                    if (i + 1 >= ast.comments.length) {
                        value += lineEnd;
                    } else {
                        for (j = i + 1; j < ast.comments.length; j++) {
                            subNode = ast.comments[j];
                            if (subNode.type === 'Line' &&
                                    subNode.range[0] === refNode.range[1] + 1) {
                                value += '//' + subNode.value + lineEnd;
                                refNode = subNode;
                            } else {
                                break;
                            }
                        }
                        value += lineEnd;
                        i = j - 1;
                    }
                } else {
                    value = '/*' + commentNode.value + '*/' + lineEnd + lineEnd;
                }

                if (!existsMap[value] && (value.indexOf('license') !== -1 ||
                        (commentNode.type === 'Block' &&
                            value.indexOf('/*!') === 0) ||
                        value.indexOf('opyright') !== -1 ||
                        value.indexOf('(c)') !== -1)) {

                    result += value;
                    existsMap[value] = true;
                }

            }
        }

        return result;
    };

    return parse;
});
