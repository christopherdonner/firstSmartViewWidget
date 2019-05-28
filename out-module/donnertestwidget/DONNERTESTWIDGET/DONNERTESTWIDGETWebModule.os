package DONNERTESTWIDGET

public object DONNERTESTWIDGETWebModule inherits WEBDSP::WebModule

	override	List	fDependencies = { { 'kernel', 16, 0 }, { 'restapi', 16, 0 } }
	override	Boolean	fEnabled = TRUE
	override	String	fModuleName = 'donnertestwidget'
	override	String	fName = 'DONNERTESTWIDGET'
	override	List	fOSpaces = { 'donnertestwidget' }
	override	String	fSetUpQueryString = 'func=donnertestwidget.configure&module=donnertestwidget&nextUrl=%1'
	override	List	fVersion = { '1', '0', 'r', '0' }

end
