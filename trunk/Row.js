// Common namespace for extension
var pb = {};

// Domain class that represents row from spreadsheet
pb.Row = function(entry) {
    var options = JSON.parse(localStorage.getItem("options")) || [];
    this.urlRowName = this.getValue(entry, options['urlRowName']);
    this.captionRowName = this.getValue(entry, options['captionRowName']);
    this.textRowName = this.getValue(entry, options['textRowName']);
    //this.urloranotherkey = this.getValue(entry, "urloranotherkey");
    var s = this.getValue(entry, "lastuse");
    if(s != null){
        s = s.replace('"', '');
        s = s.replace('"', '');
        this.lastuse = s;
    }
    this.idURL = this.getJustValue(entry, "id");
    this.editURL = this.getEditURL(entry);
    this.entry = entry.toString();
};

pb.Row.prototype.getValue = function (entry, name){
    var element = entry.getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended', name)[0];
    if(element && element.childNodes.length > 0){
        return element.childNodes[0].nodeValue;
    }
    return null;
};

pb.Row.prototype.getJustValue = function (entry, name){
    var element = entry.getElementsByTagName(name)[0];
    if(element){
        return element.childNodes[0].nodeValue;
    }
    return null;
};

pb.Row.prototype.getEditURL = function (entry){
    var element = entry.getElementsByTagName("link")[1];
    if(element){
        return element.getAttribute("href");
    }
    return null;
};