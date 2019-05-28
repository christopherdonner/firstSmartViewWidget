/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.mockjax'], function ($, mockjax) {

  var DataManager = function DataManager() {};

  DataManager.enable =  function () {
    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/2020(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodeData(2020, 30)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2020/nodes(.*)$'),
      responseTime: 50,
      responseText: DataManager.nodesData(30, 30, 1, 2020)
    });


    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/2060(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodeData(2060, 60)
    });
    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2060/nodes(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodesData(60, 30, 2, 2060)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/2080(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodeData(2080, 63)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2080/nodes(?:\\?(.*)(page=2)(.*))$'),
      responseTime: 50,
      responseText: DataManager.nodesData(33, 30, 2, 2080)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2080/nodes(?:\\?(.*)(page=3)(.*))$'),
      responseTime: 50,
      responseText: DataManager.nodesData(33, 30, 2, 2080)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2080/nodes(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodesData(63, 30, 3, 2080)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/2090(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodeData(2090, 0)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2090/nodes(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodesData(0, 30, 0, 2090)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/2091(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodeData(2091, 47)
    });

    mockjax({
      name: 'controls/pagination/test/pagination.mock',
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2091/nodes(?:\\?(.*))?$'),
      responseTime: 50,
      responseText: DataManager.nodesData(47, 50, 1, 2091)
    });
  };

  DataManager.disable = function () {
    mockjax.clear();
  };

  DataManager.nodeData = function (id, size) {
    var responseText = {"addable_types":[{"icon":"\/alphasupport\/webdoc\/folder.gif","type":0,"type_name":"Folder"},{"icon":"\/alphasupport\/tinyali.gif","type":1,"type_name":"Shortcut"},{"icon":"\/alphasupport\/webattribute\/16category.gif","type":131,"type_name":"Category"},{"icon":"\/alphasupport\/webdoc\/cd.gif","type":136,"type_name":"Compound Document"},{"icon":"\/alphasupport\/webdoc\/url.gif","type":140,"type_name":"URL"},{"icon":"\/alphasupport\/webdoc\/doc.gif","type":144,"type_name":"Document"},{"icon":"\/alphasupport\/task\/16tasklist.gif","type":204,"type_name":"Task List"},{"icon":"\/alphasupport\/channel\/16channel.gif","type":207,"type_name":"Channel"}],"available_actions":[{"parameterless":false,"read_only":true,"type":"browse","type_name":"Browse","webnode_signature":null},{"parameterless":false,"read_only":false,"type":"update","type_name":"Update","webnode_signature":null}],"available_roles":[{"type":"audit","type_name":"Audit"},{"type":"categories","type_name":"Categories"}],"data":{"container":true,"container_size":53,"create_date":"2003-10-01T13:30:55","create_user_id":1000,"description":"","description_multilingual":{"en":""},"guid":null,"icon":"\/alphasupport\/webdoc\/icon_library.gif","icon_large":"\/alphasupport\/webdoc\/icon_library_large.gif","id":2000,"modify_date":"2015-04-16T13:47:47","modify_user_id":1000,"name":"Enterprise","name_multilingual":{"en":"Enterprise"},"owner_group_id":1001,"owner_user_id":1000,"parent_id":-1,"reserved":false,"reserved_date":null,"reserved_user_id":0,"type":141,"type_name":"Enterprise Workspace","versions_control_advanced":false,"volume_id":-2000},"definitions":{"container":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"container","multi_value":false,"name":"Container","persona":"","read_only":true,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"container_size":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"container_size","max_value":null,"min_value":null,"multi_value":false,"name":"Container Size","persona":"","read_only":true,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"create_date":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"include_time":true,"key":"create_date","multi_value":false,"name":"Created","persona":"","read_only":true,"required":false,"type":-7,"type_name":"Date","valid_values":[],"valid_values_name":[]},"create_user_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"create_user_id","max_value":null,"min_value":null,"multi_value":false,"name":"Created By","persona":"user","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"description":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"description","max_length":null,"min_length":null,"multiline":true,"multilingual":true,"multi_value":false,"name":"Description","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"guid":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"guid","multi_value":false,"name":"GUID","persona":"","read_only":false,"required":false,"type":-95,"type_name":"GUID","valid_values":[],"valid_values_name":[]},"icon":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"icon","max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Icon","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"icon_large":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"icon_large","max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Large Icon","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"id","max_value":null,"min_value":null,"multi_value":false,"name":"ID","persona":"node","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"modify_date":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"include_time":true,"key":"modify_date","multi_value":false,"name":"Modified","persona":"","read_only":true,"required":false,"type":-7,"type_name":"Date","valid_values":[],"valid_values_name":[]},"modify_user_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"modify_user_id","max_value":null,"min_value":null,"multi_value":false,"name":"Modified By","persona":"user","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"name","max_length":null,"min_length":null,"multiline":false,"multilingual":true,"multi_value":false,"name":"Name","password":false,"persona":"","read_only":false,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"owner_group_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"owner_group_id","max_value":null,"min_value":null,"multi_value":false,"name":"Owned By","persona":"group","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"owner_user_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"owner_user_id","max_value":null,"min_value":null,"multi_value":false,"name":"Owned By","persona":"user","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"parent_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"parent_id","max_value":null,"min_value":null,"multi_value":false,"name":"Parent ID","persona":"node","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"reserved":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"reserved","multi_value":false,"name":"Reserved","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"reserved_date":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"include_time":true,"key":"reserved_date","multi_value":false,"name":"Reserved","persona":"","read_only":false,"required":false,"type":-7,"type_name":"Date","valid_values":[],"valid_values_name":[]},"reserved_user_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"reserved_user_id","max_value":null,"min_value":null,"multi_value":false,"name":"Reserved By","persona":"member","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"type":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"type","max_value":null,"min_value":null,"multi_value":false,"name":"Type","persona":"","read_only":true,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]},"type_name":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"type_name","max_length":null,"min_length":null,"multiline":false,"multilingual":false,"multi_value":false,"name":"Type","password":false,"persona":"","read_only":true,"regex":"","required":false,"type":-1,"type_name":"String","valid_values":[],"valid_values_name":[]},"versions_control_advanced":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"versions_control_advanced","multi_value":false,"name":"Versions Control Advanced","persona":"","read_only":false,"required":false,"type":5,"type_name":"Boolean","valid_values":[],"valid_values_name":[]},"volume_id":{"allow_undefined":false,"bulk_shared":false,"default_value":null,"description":null,"hidden":false,"key":"volume_id","max_value":null,"min_value":null,"multi_value":false,"name":"VolumeID","persona":"node","read_only":false,"required":false,"type":2,"type_name":"Integer","valid_values":[],"valid_values_name":[]}},"definitions_base":["container","container_size","create_date","create_user_id","description","guid","icon","icon_large","id","modify_date","modify_user_id","name","owner_group_id","owner_user_id","parent_id","reserved","reserved_date","reserved_user_id","type","type_name","versions_control_advanced","volume_id"],"definitions_order":["id","type","type_name","name","description","parent_id","volume_id","guid","create_date","create_user_id","modify_date","modify_user_id","owner_user_id","owner_group_id","reserved","reserved_date","reserved_user_id","icon","icon_large","versions_control_advanced","container","container_size"],"perspective":{"options":{"rows":[{"columns":[{"sizes":{"md":12},"widget":{"options":{},"type":"nodestable"}}]}]},"type":"grid"},"type":141,"type_info":{"advanced_versioning":false,"container":true},"type_name":"Enterprise Workspace"};
    responseText.data.id = id;
    responseText.data.container_size = size;
    return responseText;
  };
  DataManager.nodesData = function (numItems, pgSize, pgTotal,id) {
    var responseText = {"data":[],"definitions":{"create_date":{"align":"center","name":"Created","persona":"","type":-7,"width_weight":0},"description":{"align":"left","name":"Description","persona":"","type":-1,"width_weight":100},"icon":{"align":"center","name":"Icon","persona":"","type":-1,"width_weight":0},"id":{"align":"left","name":"ID","persona":"node","type":2,"width_weight":0},"mime_type":{"align":"left","name":"MIME Type","persona":"","type":-1,"width_weight":0},"modify_date":{"align":"left","name":"Modified","persona":"","sort":true,"type":-7,"width_weight":0},"name":{"align":"left","name":"Name","persona":"","sort":true,"type":-1,"width_weight":100},"original_id":{"align":"left","name":"Original ID","persona":"node","type":2,"width_weight":0},"parent_id":{"align":"left","name":"Parent ID","persona":"node","type":2,"width_weight":0},"reserved":{"align":"center","name":"Reserve","persona":"","type":5,"width_weight":0},"reserved_date":{"align":"center","name":"Reserved","persona":"","type":-7,"width_weight":0},"reserved_user_id":{"align":"center","name":"Reserved By","persona":"member","type":2,"width_weight":0},"size":{"align":"right","name":"Size","persona":"","sort":true,"sort_key":"size","type":2,"width_weight":0},"size_formatted":{"align":"right","name":"Size","persona":"","sort":true,"sort_key":"size","type":2,"width_weight":0},"type":{"align":"center","name":"Type","persona":"","sort":true,"type":2,"width_weight":0},"volume_id":{"align":"left","name":"VolumeID","persona":"node","type":2,"width_weight":0}},"definitions_map":{"name":["menu"]},"definitions_order":["type","name","size_formatted","modify_date"],"limit":100,"page":1,"page_total":12,"range_max":100,"range_min":1,"sort":"asc_name","total_count":0,"where_facet":[],"where_name":"","where_type":[]};

    var data = {"volume_id":-2000,"id":5204,"parent_id":id,"name":"Commitment Document HTML5viewer - Copy - Copy - Copy.docx","type":144,"description":"","create_date":"2015-03-17T08:55:42","modify_date":"2015-03-17T08:55:42","reserved":false,"reserved_user_id":0,"reserved_date":null,"icon":"\/img_0317\/webdoc\/appword.gif","mime_type":"application\/vnd.openxmlformats-officedocument.wordprocessingml.document","original_id":0,"wnd_owner":1000,"wnd_createdby":1000,"wnd_createdate":"2015-03-17T08:55:42","wnd_modifiedby":1000,"wnd_version":1,"wnf_readydate":null,"type_name":"Document","container":false,"size":170333,"perm_see":true,"perm_see_contents":true,"perm_modify":true,"perm_modify_attributes":true,"perm_modify_permissions":true,"perm_create":true,"perm_delete":true,"perm_delete_versions":true,"perm_reserve":true,"cell_metadata":{"data":{"menu":"api\/v1\/nodes\/5204\/actions","name":"api\/v1\/nodes\/5204\/content?action=open","type":""},"definitions":{"menu":{"body":"","content_type":"","display_hint":"menu","display_href":"","handler":"menu","image":"","method":"GET","name":"","parameters":{},"tab_href":""},"name":{"body":"","content_type":"","display_hint":"link","display_href":"","handler":"file","image":"","method":"GET","name":"Commitment Document HTML5viewer - Copy - Copy - Copy.docx","parameters":{"mime_type":"application\/vnd.openxmlformats-officedocument.wordprocessingml.document"},"tab_href":""},"type":{"body":"","content_type":"","display_hint":"icon","display_href":"","handler":"","image":"\/img_0317\/webdoc\/doc.gif","method":"","name":"Document","parameters":{},"tab_href":""}}},"menu":null,"size_formatted":"167 KB","reserved_user_login":null,"action_url":"\/v1\/actions\/5204","parent_id_url":"\/v1\/nodes\/2442","actions":[{"name":"Download","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=download","children":{},"signature":"Download"},{"name":"View as Web Page","url":"\/OTCS_0317\/cs.exe?func=doc.ViewDoc&nodeid=5204","children":{},"signature":"ViewDoc"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Add Version","url":"\/OTCS_0317\/cs.exe?func=doc.AddVersion&nodeid=5204&nexturl=","children":{},"signature":"AddVersion"},{"name":"Edit","url":"\/OTCS_0317\/cs.exe?func=Edit.Edit&reqp=0&nodeid=5204&nexturl=","children":{},"signature":"Edit"},{"name":"Rename","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=rename&nexturl=","children":{},"signature":"Rename"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Add to Favorites","url":"\/OTCS_0317\/cs.exe?func=ll&objid=5204&objaction=MakeFavorite&nexturl=","children":{},"signature":"MakeFavorite"},{"name":"Copy","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=copy&nexturl=","children":{},"signature":"Copy"},{"name":"Make Generation","url":"\/OTCS_0317\/cs.exe?func=ll&objType=2&objAction=Create&sourceID=5204&parentID=2442&nexturl=","children":{},"signature":"CreateGeneration"},{"name":"Make Shortcut","url":"\/OTCS_0317\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=5204&parentID=2442&nexturl=","children":{},"signature":"CreateAlias"},{"name":"Move","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=move&nexturl=","children":{},"signature":"Move"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Set Notification","url":"\/OTCS_0317\/cs.exe?func=notify.specificnode&Nodeid=5204&VolumeID=-2000&Subtype=144&Name=Commitment%20Document%20HTML5viewer%20%2D%20Copy%20%2D%20Copy%20%2D%20Copy%2Edocx&nexturl=","children":{},"signature":"SetNotification"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Make News","url":"\/OTCS_0317\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=5204&nexturl=","children":{},"signature":"CreateNewsAndAttach"},{"name":"Rate It","url":"\/OTCS_0317\/cs.exe?func=ll&objid=5204&objAction=Ratings","children":{},"signature":"RateIt"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Permissions","url":"\/OTCS_0317\/cs.exe?func=ll&objAction=Permissions&objId=5204&id=5204&nexturl=","children":{},"signature":"Permissions"},{"name":"Reserve","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=reservedoc&nexturl=","children":{},"signature":"ReserveDoc"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Overview","url":"\/OTCS_0317\/cs.exe?func=ll&objaction=overview&objid=5204","children":{},"signature":"Overview"},{"name":"Print","url":"\/OTCS_0317\/cs.exe?func=multifile.printmulti&nodeID_list=5204&nexturl=","children":{},"signature":"Print"},{"name":"Zip & Download","url":"\/OTCS_0317\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=5204&nexturl=","children":{},"signature":"ZipDwnld"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Find Similar","url":"\/OTCS_0317\/cs.exe?func=OTCIndex.FindSimilarURL&DataID=5204&VersionNum=1","children":{},"signature":"OTCIndexResultFindSimilar"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Delete","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=delete&nexturl=","children":{},"signature":"Delete"},{"name":"-","url":"","children":{},"signature":"-"},{"name":"Properties","url":"","children":[{"children":{},"name":"General","signature":"Properties","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=properties&nexturl="},{"children":{},"name":"Specific","signature":"Info","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=info&nexturl="},{"children":{},"name":"Audit","signature":"Audit","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=audit&nexturl="},{"children":{},"name":"Categories","signature":"InfoCmdCategories","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=attrvaluesedit&version=1&nexturl="},{"children":{},"name":"Ratings","signature":"Ratings","url":"\/OTCS_0317\/cs.exe?func=ll&objid=5204&objAction=Ratings"},{"children":{},"name":"References","signature":"References","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=references&nexturl="},{"children":{},"name":"Versions","signature":"Versions","url":"\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=versions&nexturl="}],"signature":"PropertiesMenu"}]};
    var totalData = numItems < pgSize? numItems : pgSize;
    for (var i = 1; i <= totalData; i++) {
      data.id = i;
      data.parent_id_url = "\/v1\/nodes\/" + id;
      responseText.data.push(data);
    }

    responseText.limit = pgSize;
    responseText.page_total = pgTotal;
    responseText.range_max = pgSize;
    responseText.total_count = numItems;

    return responseText;
  };

  return DataManager;
});
