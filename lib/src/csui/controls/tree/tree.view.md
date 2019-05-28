Tree Structure
==============

```
//To Display as tree structure create TreeView object by passing node collection like below
treeView = new TreeView({
  collection: nodeCollection,
  readonly: true/false //optional
});

// Sample node collection
var nodeCollection = [
    {
      nodeName: "<Name of node>",
      nodeId: "<Id of Node>",
      nodes: [
        {
          nodeName: <Child node name>,
          nodeId: "<node id>",
          nodeClass: "<class>",
          nodeSplit: true/false, <optional> // It will create on div to split tree
          splitName: "<Split name>", <optional>
          splitClass: "<Split class name>" <optional>
        },
        {
          nodeName: "<Name of node>",
          nodeId: "<node id>",
          nodes: [
            {nodeName: <Name of node>, nodeId: "<node id>"},
            {nodeName: <Name of node>, nodeId: "<node id>"},
            {nodeName: <Name of node>, nodeId: "<node id>"},
            {
              nodeName: <Name of node>,
              nodeId: ""<node id>",
              nodes: [
                {
                  nodeName: <Name of node>,
                  nodeId: "<node id>"
                  nodes: [
                    {
                      nodeName: <Name of node>,
                      nodeId: "<node id>"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];