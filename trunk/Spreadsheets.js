// Process loading data from Google Spreadsheet
Spreadsheets = (function() {

    var request = new XMLHttpRequest();
    var spreadsheetName = "not specified";
    var rows = [];
    var isKeyValueData = false;

    var callbackOnSuccess = function() {
        console.log("not implemented")
    };
    var callbackOnFailure = function() {
        console.log("not implemented")
    };

    function selectSpreadsheet() {
        var entries = request.responseXML.getElementsByTagName('entry');
        for (var i = 0, entry; entry = entries[i]; i++) {
            var title = entry.getElementsByTagName('title');
            if (title[0].childNodes[0].nodeValue == spreadsheetName) {
                var links = entry.getElementsByTagName('link');
                for (var j = 0, link; link = links[j]; j++) {
                    if (link.getAttribute('type') == 'application/atom+xml') {
                        var url = link.getAttribute('href');
                        request = new XMLHttpRequest();
                        request.open('GET', url, true);
                        request.onload = getSpreadsheet;
                        request.send(null);
                        return;
                    }
                }
            }
        }
        callbackOnFailure.call(this, "spreadsheet not found");
    }

    function getSpreadsheet() {
        var xmlDocument = parseTextToXML(request.responseText);
        var entries = xmlDocument.getElementsByTagName('entry');
        for (var i = 0, entry; entry = entries[i]; i++) {
            var links = entry.getElementsByTagName('link');
            for (var j = 0, link; link = links[j]; j++) {
                if (link.getAttribute('type') == 'application/atom+xml') {
                    var url = link.getAttribute('href');
                    request = new XMLHttpRequest();
                    request.open('GET', url, true);
                    request.onload = buildRows;
                    request.send(null);
                    return;
                }
            }
        }
        callbackOnFailure.call(this, "spreadsheet link not found");
    }

    function buildRows() {
        var xmlDocument = parseTextToXML(request.responseText);
        var links = xmlDocument.getElementsByTagName('link');
        if (!localStorage['postURL']) {
            for (var i = 0, link; link = links[i]; i++) {
                if (link.getAttribute('rel') == 'http://schemas.google.com/g/2005#post') {
                    localStorage['postURL'] = link.getAttribute('href');
                    break;
                }
            }
        }
        var entries = xmlDocument.getElementsByTagName('entry');
        for (var i = 0, entry; entry = entries[i]; i++) {
            var row;
            if(isKeyValueData){
                row = {};
                row[getNodeValue(entry, "key")] = getNodeValue(entry, "value");
            } else {
                row = new pb.Row(entry);
            }
            rows.push(row);
        }
        callbackOnSuccess.call(this, rows);
    }

    function parseTextToXML(text) {
        var domParser = new DOMParser();
        return domParser.parseFromString(text, 'text/xml');
    }

    function getNodeValue(xmlEntry, propertyName) {
        var element = xmlEntry.getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended', propertyName)[0];
        if (element) {
            return element.childNodes[0].nodeValue;
        }
        return null;
    }

    return{
        // Loads data from spreadsheet with name = spreadsheetNameArg
        loadByName: function(spreadsheetNameArg, rowsArg, callbackOnSuccessArg, callbackOnFailureArg, isKeyValueDataArg) {
            spreadsheetName = spreadsheetNameArg;
            callbackOnSuccess = callbackOnSuccessArg;
            callbackOnFailure = callbackOnFailureArg;
            isKeyValueData = isKeyValueDataArg;
            rows = rowsArg;
            request.open('GET', 'https://spreadsheets.google.com/feeds/spreadsheets/private/full', true);
            request.onload = selectSpreadsheet;
            request.send(null);
        }
    }
})();

/**
 * TODO: clarify how accounts work
 *
 * Working case:
 * <entry xmlns="http://www.w3.org/2005/Atom"    xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">  <gsx:name>docs.google.com</gsx:name>       <gsx:login>111</gsx:login>         <gsx:password>111</gsx:password>        </entry>
 *
 * Not working:
 * "<entry xmlns="http://www.w3.org/2005/Atom"    xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">  <gsx:undefined>docs.google.com</gsx:undefined>       <gsx:undefined>123</gsx:undefined>         <gsx:undefined>123</gsx:undefined>        </entry>"
 *
 */
