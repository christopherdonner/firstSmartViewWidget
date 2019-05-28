package DONNERTESTWIDGET

public object DONNERTESTWIDGETGlobals inherits KERNEL::Globals

	override	List	f__InitObjs = { \
											DONNERTESTWIDGET::DONNERTESTWIDGETWebModule, \
											DONNERTESTWIDGET::CSUIExtension, \
											DONNERTESTWIDGET::DONNERTESTWIDGETRequestHandlerGroup \
										}

end
