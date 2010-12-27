// Common namespace for extension
var pb = {};

// Domain class that represents row from spreadsheet
pb.Row = function(entry) {
    this.urlRowName = this.getValue(entry, localStorage['urlRowName']);
    this.captionRowName = this.getValue(entry, localStorage['captionRowName']);
    this.textRowName = this.getValue(entry, localStorage['textRowName']);
};

pb.Row.prototype.getValue = function (entry, name){
    var element = entry.getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended', name)[0];
    if(element){
        return element.childNodes[0].nodeValue;
    }
    return null;
};