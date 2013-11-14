var currentDomain;
    var firstFoundText;

    function addRow() {
        var options = JSON.parse(localStorage.getItem("options"));
        var values = {
            domain: currentDomain,
            title: document.getElementById('title').value,
            text: document.getElementById('text').value
        };
        Spreadsheets.addRow(options, values);
    }

    function get_hostname_from_url(url) {
        var host = url.match(/:\/\/(.[^/]+)/)[1];
        if (host.indexOf('www.') > -1) {
            host = host.substring(4, host.length);
        }
        return host;
    }

    function showMessage(message, callback) {
        var status = document.getElementById("notes");
        status.innerHTML = message;
        setTimeout(function() {
            callback.call();
        }, 1250);
    }

    function initAddBtn() {
        document.getElementById('add').onclick = function() {
            hideMenu();
            hideLoadingIndicator();
            document.getElementById('addForm').style.display = 'block';


            document.getElementById('save').onclick = function() {
                addRow();
                showMessage("Saved.", function() {
                    updateRows(function() {
                        status.innerHTML = "";
                        this.close();
                    });
                });
                document.getElementById('addForm').style.display = 'none';
            };
        };
    }
    function initShowBtn(rows) {
        document.getElementById('show').onclick = function() {
            hideMenu();
            chrome.tabs.getSelected(null, function(tab) {
                var url = tab.url;
                for (var i = 0, row; row = rows[i]; i++) {
                    if (url.indexOf(row.urlRowName) > -1) {
                        var title = document.createElement('b');
                        var div = document.createElement('div');
                        var text = document.createTextNode(row.captionRowName);
                        title.appendChild(text);
                        text = document.createTextNode(row.textRowName);
                        div.appendChild(title);
                        div.appendChild(document.createElement('br'));
                        div.appendChild(text);
                        div.setAttribute('class', 'block');
                        document.getElementById('notes').appendChild(div);
                    }
                }
            });
        };
    }
    function initPopup() {
        chrome.extension.sendMessage({request: "get-rows"}, function(o) {
            var rows = o.response;
            document.getElementById('show').style.display = 'none';
            // TODO: remove duplicate below (inject this checking to initShowBtn)
            chrome.tabs.getSelected(null, function(tab) {
                var url = tab.url;
                currentDomain = get_hostname_from_url(tab.url);
                for (var i = 0, row; row = rows[i]; i++) {
                    if (url.indexOf(row.urlRowName) > -1) {
                        firstFoundText = row.textRowName;
                        document.getElementById('show').style.display = 'block';
                        document.getElementById('copy').style.display = 'block';
                        // TODO: check Experimental fucntion
                        copy();
                        break;
                    }
                }
            });
            initShowBtn(rows);
        });
    }

    function copy(callback) {
        directCopy(firstFoundText);
	//chrome.extension.sendMessage({request: "copy-text", text: }, function(o) {
        //    if (callback) {
        //        callback.call();
        //    }
        //});
    }

    function initCopyButton() {
        document.getElementById('copy').onclick = function() {
            copy(function() {
                this.close();
            });
        }
    }

    function updateRows(fn) {
        chrome.extension.sendMessage({request: "update-rows"}, fn || function() {
        });
    }

    function hideMenu() {
        document.getElementById('menu').style.display = 'none';
    }
    function showLoadingIndicator() {
        document.getElementById('loading').style.display = 'block';
    }
    function hideLoadingIndicator() {
        document.getElementById('loading').style.display = 'none';
    }

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.request == "rows-updated") {
            hideLoadingIndicator();
            initPopup();
        } else if (request.request == "spreadsheet-not-found") {
            console.log("spreadsheet-not-found");
            showMessage("Spreadsheet " + request.tableName + " not found", function() {
            });
        } else {
            sendResponse({}); // snub them.
        }
    });

function copyToClipboard(text) {
        var input = document.getElementById('text');

        if (input == undefined)
            return;

        input.value = text;
        input.select();
        document.execCommand('Copy', false, null);
    }

function directCopy(str){
    //based on http://stackoverflow.com/a/12693636
        document.oncopy = function(event) {
    event.clipboardData.setData("Text", str);
    event.preventDefault();
        };
    document.execCommand("Copy");
        document.oncopy = undefined;
}

// ENTRY POINT HERE

document.addEventListener('DOMContentLoaded', function () 
{
	showLoadingIndicator(); updateRows(); initAddBtn(); initCopyButton();
});


