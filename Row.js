// Common namespace for extension
var pb = {};

// Domain class that represents row from spreadsheet
pb.Row = function(entry) {
    var options = JSON.parse(localStorage.getItem("options")) || [];
    this.urlRowName = this.getValue(entry, options['urlRowName']);
    this.captionRowName = this.getValue(entry, options['captionRowName']);
    this.textRowName = this.getValue(entry, options['textRowName']);
};

pb.Row.prototype.getValue = function (entry, name){
    var element = entry.getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended', name)[0];
    if(element){
        return element.childNodes[0].nodeValue;
    }
    return null;
};