# ParameterPromptForm widget

**Module: webreports/widgets/parameter.prompt.form/parameter.prompt.form.view**

Displays a rendered parameter prompt form for a given WebReport node.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.

### Example

    var promptView,
        promptModel,
        contentRegion = new Marionette.Region({el: "#content"}),
        pageContext = new PageContext(),
        currentNode = pageContext.getModel(NodeModelFactory, {attributes: {id: 348547}}),
        runWRModel = pageContext.getModel(PromptModelFactory, {
            attributes: {
                node: currentNode
            }
        }),
        runWRController = new RunWRController();


    pageContext.fetch()
            .done(function () {

                // We've got the page context, now get the runWRModel to see if there are parameters:
                runWRController.getRunWRPreModel({
                    node: currentNode,
                    context: pageContext
                }).done( function(){

                    // Build the prompt view and show it:
                    promptView = new PromptView({
                        context: pageContext,
                        model: currentNode,
                        promptModel: runWRController.runWRPreModel,
                        showBackIcon: false
                    });

                    contentRegion.show(promptView);
                });
            })

### Options

`model` (node model)
: **Mandatory.** The node model of the WebReport for which to lookup prompt parameters.