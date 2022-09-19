var preventamobile = preventamobile || {};

preventamobile.configuration = function () {

    //#region Variables

    var urlServerOptions,
	   urlServerNames,
        setUrlBase,
        getUrlBase,
        getUrlServerOptions,
		getUrlBaseName;

    //#endregion

    //#region Configuration
    // urlServerOptions = ["http://10.0.0.149:8084/preventamobile/"];
     //urlServerOptions = ["http://preventa.cloudapp.net:8890/","http://preventa.cloudapp.net:8889/","http://gmsoftware.ddns.net:8084/preventamobile/","http://preventa.cloudapp.net:8891/"];
	 urlServerOptions = ["http://api.preventamovil.com.ar:8889/"];
	 urlServerNames = ["Actual"];
	
	// urlServerOptions = [];
	
    getUrlBaseName = function () {
        var urlServer = localStorage.getItem("urlServer");
        if (!urlServer) {
            //return urlServerOptions[0];
			return urlServerNames[0];
        }
        return urlServer;
    };
	
	getUrlBase = function () {
        var urlServer = localStorage.getItem("urlServer");
        if (!urlServer) {
            return urlServerOptions[0];
        }else{
			var options = getUrlServerNames();
			var servers = getUrlServerOptions();
			for (var i = 0; i < options.length; i++) {
            if (options[i] == urlServer)
               urlServer = servers[i];
			}
		}
        return urlServer;
    };
	
    getUrlServerOptions = function () {
        return urlServerOptions;
    };
	
	getUrlServerNames = function () {
        return urlServerNames;
    };

    setUrlBase = function (urlServer) {
        localStorage.setItem("urlServer", urlServer);
    };


		
    //#endregion

    return {
        getUrlBase: getUrlBase,
        setUrlBase: setUrlBase,
        getUrlServerOptions: getUrlServerOptions,
		getUrlServerNames: getUrlServerNames,
		getUrlBaseName: getUrlBaseName
    };
};

//@ sourceURL=_configuration.js