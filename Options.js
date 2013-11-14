// Saves options to localStorage.
    function save_options() {
        var options = {};
        options["tableName"] = document.getElementById("tableName").value;
        options["urlRowName"] = document.getElementById("urlRowName").value;
        options["captionRowName"] = document.getElementById("captionRowName").value;
        options["textRowName"] = document.getElementById("textRowName").value;
        localStorage.setItem("options", JSON.stringify(options));

        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
            status.innerHTML = "";
        }, 1250);
    }

    // Restores select box state to saved value from localStorage. Here is used value of first// account in a list
    function restore_options() {
        var options = JSON.parse(localStorage.getItem("options"));
        document.getElementById("tableName").value = options["tableName"] || '';
        document.getElementById("urlRowName").value = options["urlRowName"] || '';
        document.getElementById("captionRowName").value = options["captionRowName"] || '';
        document.getElementById("textRowName").value = options["textRowName"] || '';
    }

document.addEventListener('DOMContentLoaded', function () 
{
	restore_options();
});

