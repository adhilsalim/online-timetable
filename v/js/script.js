var scriptReplacedLink = "", selectedRow = null, timeConverted = "", hours = 0, minutes = 0, suffix = "AM", hoursU = 0, minutesU = 0, suffixU = "AM", hoursE = 0, minutesE = 0, suffixE = "AM", i = 0, j = 0, tabledatastring = "table_data_export=failed;", tempstring = "", tableexist = "";
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
var today = dd + '-' + mm + '-' + yyyy;
var pdfFileName = 'TimeTable-' + today;




function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    }
}


function readFormData() {
    var formData = {};
    formData["Subject"] = document.getElementById("Subject").value;
    formData["Time"] = document.getElementById("Time").value;
    formData["Link"] = document.getElementById("Link").value;
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("subjectList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = `<a href="` + data.Link + `" target="_blank">` + data.Subject + `</a>`;

    cell2 = newRow.insertCell(1);
    //cell2.innerHTML = data.Time;
    hours = data.Time.split(":")[0];
    minutes = data.Time.split(":")[1];
    suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours < 10 ? "0" + hours : hours;
    cell2.innerHTML = hours + ":" + minutes + " " + suffix;

    cell3 = newRow.insertCell(2);
    cell3.innerHTML = `<p style="display:none;">` + data.Link + `</p>`;

    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<button class="button buttonedit" onClick="onEdit(this)">edit</button>
                       <button class="button buttondelete" onClick="onDelete(this)">delete</button>`;
}

//clear the textbox after submit
function resetForm() {
    document.getElementById("Subject").value = "";
    document.getElementById("Time").value = "";
    document.getElementById("Link").value = "";
    selectedRow = null;
}

//retrieve the value
function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("Link").value = selectedRow.cells[2].innerHTML.replace("<p style=", "").replace("display:none;", "").replace("</p>", "").replace(">", "").replace('"', "").replace('"', "");
    scriptReplacedLink = document.getElementById("Link").value = selectedRow.cells[2].innerHTML.replace("<p style=", "").replace("display:none;", "").replace("</p>", "").replace(">", "").replace('"', "").replace('"', "");

    document.getElementById("Subject").value = selectedRow.cells[0].innerHTML.replace("</a>", "").replace("<a href=", "").replace('"', "").replace('"', "").replace('"', "").replace('"', "").replace("target=_blank>", "").replace(" ", "").replace(scriptReplacedLink, "");

    hoursE = selectedRow.cells[1].innerHTML.split(":")[0]; //hrs
    minutesE = selectedRow.cells[1].innerHTML.split(":")[1].replace("AM", "").replace("PM", "").replace(" ", ""); //mnts
    suffixE = selectedRow.cells[1].innerHTML.split(" ")[1]; //sfx
    if (suffixE == "PM") {
        hoursE = Number(hoursE) + 12;
    }
    document.getElementById("Time").value = hoursE + ":" + minutesE;
}


function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = `<a href="` + formData.Link + `" target="_blank">` + formData.Subject + `</a>`;

    hoursU = formData.Time.split(":")[0];
    minutesU = formData.Time.split(":")[1];
    suffixU = hoursU >= 12 ? "PM" : "AM";
    hoursU = hoursU % 12 || 12;
    hoursU = hoursU < 10 ? "0" + hoursU : hoursU;
    selectedRow.cells[1].innerHTML = hoursU + ":" + minutesU + " " + suffixU;


    //selectedRow.cells[1].innerHTML = formData.Time;
    selectedRow.cells[2].innerHTML = `<p style="display:none;">` + formData.Link + `</p>`;
}

function onDelete(td) {
    document.getElementById("popupmessage").style.display = "block";
    document.getElementById('deleteconfirm').onclick = function () {
        row = td.parentElement.parentElement;
        document.getElementById("subjectList").deleteRow(row.rowIndex);
        resetForm();
        closepop();
    };

}

//validate input
function validate() {
    isValid = true;
    if (document.getElementById("Subject").value == "C-C" || document.getElementById("Subject").value == "R-R" || document.getElementById("Subject").value == "C-CR-R" || document.getElementById("Subject").value == "C-CR-RC-C") {
        alert("reserved string!");
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}



//when cancel button or delere button is pressed while pop-up message is visible
function closepop() {
    document.getElementById("popupmessage").style.display = "none";
}



//create table data
function createtabledata() {
    tabledatastring = "";
    var rowLength = document.getElementById("subjectList").rows.length;
    for (i = 1; i < rowLength; i++) {
        var columnLength = document.getElementById("subjectList").rows[i].cells.length;

        for (j = 0; j < columnLength; j++) {
            if (j == 0) {
                scriptReplacedLink = document.getElementById("subjectList").rows[i].cells.item(j + 2).innerHTML.replace("<p style=", "").replace("display:none;", "").replace("</p>", "").replace(">", "").replace('"', "").replace('"', "");
                tempstring = document.getElementById("subjectList").rows[i].cells.item(j).innerHTML.replace("</a>", "").replace("<a href=", "").replace('"', "").replace('"', "").replace('"', "").replace('"', "").replace("target=_blank>", "").replace(" ", "").replace(scriptReplacedLink, "");
                tabledatastring = tabledatastring + tempstring + "C-C";
            }
            if (j == 1) {
                tempstring = document.getElementById("subjectList").rows[i].cells.item(j).innerHTML;
                tabledatastring = tabledatastring + tempstring + "C-C";
            }
            if (j == 2) {

                tempstring = document.getElementById("subjectList").rows[i].cells.item(j).innerHTML.replace("<p style=", "").replace("display:none;", "").replace("</p>", "").replace(">", "").replace('"', "").replace('"', "");
                tabledatastring = tabledatastring + tempstring + "C-C";
            }
        }
        tabledatastring = tabledatastring + "R-R";

    }
    if (importDataValidator == "f") {
        tabledatastring = tabledatastring + "C-C";
    } else {
        tabledatastring = tabledatastring.replace("C-CR-RR-R", "C-CR-RC-C")
    }



    tableexist = document.getElementById("subjectList").rows.length
    if (tableexist <= 1) {
        tabledatastring = "error::table data missing";
    }
    var text = tabledatastring;
    var filename = "data.txt";
    download(filename, text);
}

//downloading data
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
//when clicked download
//document.getElementById("download").addEventListener("click", function () { 
//var text = tabledatastring; var filename = "data.txt"; download(filename, text); }, false);

//download pdf
function generate() {
    tableexist = document.getElementById("subjectList").rows.length
    if (tableexist <= 1) {
        //Eat5StartDoNothing
    }
    else {
        var doc = new jspdf.jsPDF()
        doc.autoTable({ html: '#subjectList' })
        doc.save(pdfFileName)

    }

}

