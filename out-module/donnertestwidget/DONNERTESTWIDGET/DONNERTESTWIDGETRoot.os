package DONNERTESTWIDGET

/**
 *  This is a good place to put documentation about your OSpace.
 */
public object DONNERTESTWIDGETRoot

	public		Object	Globals = DONNERTESTWIDGET::DONNERTESTWIDGETGlobals



	/**
	 *  Content Server Startup Code
	 */
	public function Void Startup()
		
			//
			// Initialize globals object
			//
		
			Object	globals = $DONNERTESTWIDGET = .Globals.Initialize()
		
			//
			// Initialize objects with __Init methods
			//
		
			$Kernel.OSpaceUtils.InitObjects( globals.f__InitObjs )
		
		end

end
