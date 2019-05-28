/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/*! DataTables Bootstrap 3 integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */
define([
        'csui/lib/jquery',
        'csui/lib/jquery.dataTables/js/jquery.dataTables',
        'csui/lib/binf/js/binf'
    ],
    function (jQuery, DataTable) {

        /**
         * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
         * DataTables 1.10 or newer.
         *
         * This file sets the defaults and adds options to DataTables to style its
         * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
         * for further information.
         */
        (/** @lends <global> */function (window, document, undefined) {

            (function (factory) {
                "use strict";

                /*
                 if ( typeof define === 'function' && define.amd ) {
                 // Define as an AMD module if possible
                 define( 'datatables', ['jquery'], factory );
                 }
                 else if ( typeof exports === 'object' ) {
                 // Node/CommonJS
                 factory( require( 'jquery' ) );
                 }
                 else */
                if (jQuery && DataTable.defaults.renderer != 'bootstrap') {
                    // Prevent multiple instantiations if the script is loaded twice
                    factory(jQuery, DataTable);
                }
            }
            (/** @lends <global> */function ($, DataTable) {
                "use strict";

                /* Set the defaults for DataTables initialisation */
                $.extend(true, DataTable.defaults, {
                    dom: "<'binf-row'<'binf-col-sm-6'l><'binf-col-sm-6'f>>" +
                    "<'binf-row'<'binf-col-sm-12'tr>>" +
                    "<'binf-row'<'binf-col-sm-6'i><'binf-col-sm-6'p>>",
                    renderer: 'bootstrap'
                });


                /* Default class modification */
                $.extend(DataTable.ext.classes, {
                    sWrapper: "dataTables_wrapper binf-form-inline dt-bootstrap",
                    sFilterInput: "binf-form-control binf-input-sm",
                    sLengthSelect: "binf-form-control binf-input-sm"
                });


                /* Bootstrap paging button renderer */
                DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
                    var api = new DataTable.Api(settings);
                    var classes = settings.oClasses;
                    var lang = settings.oLanguage.oPaginate;
                    var btnDisplay, btnClass;

                    var attach = function (container, buttons) {
                        var i, ien, node, button;
                        var clickHandler = function (e) {
                            e.preventDefault();
                            if (!$(e.currentTarget).hasClass('binf-disabled')) {
                                api.page(e.data.action).draw(false);
                            }
                        };

                        for (i = 0, ien = buttons.length; i < ien; i++) {
                            button = buttons[i];

                            if ($.isArray(button)) {
                                attach(container, button);
                            }
                            else {
                                btnDisplay = '';
                                btnClass = '';

                                switch (button) {
                                    case 'ellipsis':
                                        btnDisplay = '&hellip;';
                                        btnClass = ' binf-disabled';
                                        break;

                                    case 'first':
                                        btnDisplay = lang.sFirst;
                                        btnClass = button + (page > 0 ?
                                            '' : ' binf-disabled');
                                        break;

                                    case 'previous':
                                        btnDisplay = lang.sPrevious;
                                        btnClass = button + (page > 0 ?
                                            '' : ' binf-disabled');
                                        break;

                                    case 'next':
                                        btnDisplay = lang.sNext;
                                        btnClass = button + (page < pages - 1 ?
                                            '' : ' binf-disabled');
                                        break;

                                    case 'last':
                                        btnDisplay = lang.sLast;
                                        btnClass = button + (page < pages - 1 ?
                                            '' : ' binf-disabled');
                                        break;

                                    default:
                                        btnDisplay = button + 1;
                                        btnClass = page === button ?
                                            ' binf-active' : '';
                                        break;
                                }

                                if (btnDisplay) {
                                    node = $('<li>', {
                                        'class': classes.sPageButton + ' ' + btnClass,
                                        'aria-controls': settings.sTableId,
                                        'tabindex': settings.iTabIndex,
                                        'id': idx === 0 && typeof button === 'string' ?
                                        settings.sTableId + '_' + button :
                                            null
                                    })
                                        .append($('<a>', {
                                            'href': '#'
                                        })
                                            .html(btnDisplay)
                                    )
                                        .appendTo(container);

                                    settings.oApi._fnBindAction(
                                        node, {action: button}, clickHandler
                                    );
                                }
                            }
                        }
                    };

                    attach(
                        $(host).empty().html('<ul class="binf-pagination"/>').children('ul'),
                        buttons
                    );
                };


                /*
                 * TableTools Bootstrap compatibility
                 * Required TableTools 2.1+
                 */
                if (DataTable.TableTools) {
                    // Set the classes that TableTools uses to something suitable for Bootstrap
                    $.extend(true, DataTable.TableTools.classes, {
                        "container": "DTTT binf-btn-group",
                        "buttons": {
                            "normal": "binf-btn binf-btn-default",
                            "disabled": "binf-disabled"
                        },
                        "collection": {
                            "container": "DTTT_dropdown binf-dropdown-menu",
                            "buttons": {
                                "normal": "",
                                "disabled": "disabled"
                            }
                        },
                        "print": {
                            "info": "DTTT_print_info"
                        },
                        "select": {
                            "row": "binf-active"
                        }
                    });

                    // Have the collection use a bootstrap compatible drop down
                    $.extend(true, DataTable.TableTools.DEFAULTS.oTags, {
                        "collection": {
                            "container": "ul",
                            "button": "li",
                            "liner": "a"
                        }
                    });
                }

                return $.fn.dataTable;
            }));


// Define as an AMD module if possible
            /*
             if (typeof define === 'function' && define.amd) {
             define(['jquery', 'datatables'], factory);
             }
             else if (typeof exports === 'object') {
             // Node/CommonJS
             factory(require('jquery'), require('datatables'));
             }
             else if (jQuery) {
             // Otherwise simply initialise as normal, stopping multiple evaluation
             factory(jQuery, jQuery.fn.dataTable);
             }

             */
        }(window, document));

        return jQuery.fn.dataTable;

    });
