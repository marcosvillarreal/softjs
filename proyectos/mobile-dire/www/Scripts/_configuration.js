﻿var preventamobile = preventamobile || {};

preventamobile.configuration = function () {

    //#region Variables

    var urlServerOptions,
        setUrlBase,
        getUrlBase,
        getUrlServerOptions;

    //#endregion

    //#region Configuration
    // urlServerOptions = ["http://10.0.0.149:8084/preventamobile/"];
     urlServerOptions = ["http://gmsoftware.ddns.net:8084/preventamobile/"];
	
	// urlServerOptions = [];
	
    getUrlBase = function () {
        var urlServer = localStorage.getItem("urlServer");
        if (!urlServer) {
            return urlServerOptions[0];
        }
        return urlServer;
    };

    getUrlServerOptions = function () {
        return urlServerOptions;
    };

    setUrlBase = function (urlServer) {
        localStorage.setItem("urlServer", urlServer);
    };

    //#endregion

    return {
        getUrlBase: getUrlBase,
        setUrlBase: setUrlBase,
        getUrlServerOptions: getUrlServerOptions
    };
};

//@ sourceURL=_configuration.js