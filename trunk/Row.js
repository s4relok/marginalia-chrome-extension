// Common namespace for extension
var pb = {};

// Domain class that represents row from spreadsheet
pb.Row = function(entry) {
    var accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    this.urlRowName = this.getValue(entry, accounts[0]['urlRowName']);
    this.captionRowName = this.getValue(entry, accounts[0]['captionRowName']);
    this.textRowName = this.getValue(entry, accounts[0]['textRowName']);
};

pb.Row.prototype.getValue = function (entry, name){
    var element = entry.getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended', name)[0];
    if(element){
        return element.childNodes[0].nodeValue;
    }
    return null;
};