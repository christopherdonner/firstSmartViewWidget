# Core RequireJS module bundles

Code and stylesheets of the Graphite application are concatenated, minified
and split to *(RequireJS) module bundles*.

## Available bundles

Dividing the functionality to sets of modules - bundles, which are usually
used together, allows creating pages using only needed modules and not
always loading the entire framework.  It allows to share building blocks
bigger than a module among pages, leads to a better cache usage and helps
reducing the time before the application page loads for the first time.

csui-loader
: Contains RequireJS, module loading plugins, static configuration and
  global functions of the framework core.  This file is supposed to be
  loaded statically by `<script>` at first.

csui-app
: Includes core 3rd party libraries and basic modules to build an MVC
  application connecting to the CS REST API.  Additionally, it includes
  modules with simple UI controls, namely list views, message boxes etc.

csui-browse
: Provides support for browsing item collections in tables.

csui-forms
: Adds functionality for handling read-only and editable forms.

csui-signin
: Supplies all modules needed on the sign-in page.

csui-error
: Supplies all modules needed on the error page.

## Existing bundle indexes

Bundle indexes list module identifiers from one or more bundles, which are
going to be used on an application page.  They can be quickly loaded at
the beginning and help loading the actual module bundle first when one of
its modules is needed.

csui-app-index
: Exposes modules used by the main Graphite application, referring to
  csui-app, csui-browse and csui-forms bundles.

csui-signin-index
: Exposes modules used by the user authentication page, referring just to
  the csui-signin bundle.

## How the bundles and their indexes are used

There are four public entry points to the Graphite framework, which use
bundle indexes optimized for their particular scenario.

### /app

Main application page. Uses the `csui-app-index` bundle index.  The included
bundles are supposed to load step-by-step, optimizing the loading performance
of the three main conditions which the SPA can start under.

#### User landing page

Usually the first page the user opens.  Uses simple dashboard widgets.  Only
the `csui-app` bundle should be loaded at first.

#### Container browsing page

Browses an item collection in a table, providing operations like rename,
copy, move etc.  Only the `csui-app` and 'csui-browse` bundles should be
loaded at first.

#### Form editing page

Shows item information in multiple forms, providing operations like field
editing, classifying etc.  Only the `csui-app` and 'csui-forms` bundles
should be loaded at first.

### /app/signin

User authentication page. Uses the `csui-signin-index` bundle index.  It
contains only one bundle, which is loaded on the page right away, because
the page is very simple.

### /widgets

Dynamically generated script to embed the framework on other pages.  Uses
the `csui-app-index` bundle index.  Offers all functionality used on /app.

## Possible improvement

The `csui-app` bundle contains not only the framework code, but also simple
controls enough to suport the landing page.  Browsing and form editing
starting point load it now, although they don't need the functionality.  If
it grows big, it should be divided to `csui-core` and `csui-start`.  The
`csui-core` could be included in every index and loaded from cache in all
scenarios.  It will pay off when the landing page part grows a little;
loading multiple small files takes longer than loading one file with all
of them;
