var rows = [];

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.request) {
            case "get-rows":
                sendResponse({response: rows});
                break;
            case "update-rows":
                rows = [];
                init();
                sendResponse({});
                break;
            case "copy-text":
                copyToClipboard(request.text);
                sendResponse({});
                break;
            default:
                sendResponse({}); // snub them.
        }
    });

    function init() {
        var options = JSON.parse(localStorage.getItem("options")) || [];
        var tableName = options['tableName'];

        if (!tableName) {
            Spreadsheets.loadByName("pb-settings", [], function(rowsArg) {
                var options = {};
                options["tableName"] = rowsArg[0].tableName;
                options["urlRowName"] = rowsArg[1].urlRowName;
                options["captionRowName"] = rowsArg[2].captionRowName;
                options["textRowName"] = rowsArg[3].textRowName;
                localStorage.setItem("options", JSON.stringify(options));
                init();
            }, function(whatHappened) {
                console.log("Can't load settings: " + whatHappened);
            }, true);
        } else {
            Spreadsheets.loadByName(tableName, rows, function(rowsArg) {
                rows = rowsArg;
                rowsUpdatedRequest();
            }, function(whatHappened) {
                if (whatHappened == "spreadsheet not found") {
                    chrome.extension.sendMessage({request: "spreadsheet-not-found", tableName: tableName}, function() {
                        console.log('background: spreadsheet-not-found ' + tableName);
                    });
                } else if (whatHappened == "spreadsheet link not found") {
                    chrome.extension.sendMessage({request: "spreadsheet-not-found", tableName: tableName}, function() {
                        console.log('background: spreadsheet-not-found ' + tableName);
                    });
                }
                rowsUpdatedRequest();
            });
        }
    }

    function copyToClipboard(text) {
        var input = document.getElementById('text');

        if (input == undefined)
            return;

        input.value = text;
        input.select();
        document.execCommand('Copy');
    }
    function rowsUpdatedRequest() {
        chrome.extension.sendMessage({request: "rows-updated"}, function() {
            console.log('background: rows-updated')
        });
    }

document.addEventListener('DOMContentLoaded', function () 
{
	init();
});