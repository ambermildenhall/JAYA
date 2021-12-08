var baseurl = "http://localhost:8080/api/v1/fridge"

function collapseLoginForm(){
    document.getElementById("emailForm").style.display = "none";
    login();
}

function showLoginForm(){
    document.getElementById("emailForm").style.display = "block";
}

function collapseAddFoodForm(){
    document.getElementById("addFoodForm").style.display = "none";
    addFood();
}

function collapseEditFoodForm(button){
    document.getElementById("editFoodForm").style.display = "none";
    editFood(button);
}

function login(){
var email = document.getElementById("email").value;
var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", baseurl + "/get-user/" + email, true);
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
            var user = JSON.parse(xmlhttp.responseText);
            if (user.userId === -1){
                showLoginForm();
                alert("User does not exist. Try a different email.")
            }
            else{
                document.getElementById("userName").innerHTML = "Logged in as: " + user.name;
                document.getElementById("userId").innerHTML = user.userId;
                document.getElementById("userId").style.display = "none";
                document.getElementById("userEmail").innerHTML = user.email;
                document.getElementById("userEmail").style.display = "none";
                getFridge(user.userId);
            }
        }
        else{
            System.out.println("Error")
        }
    };
    xmlhttp.send();
}

function getFridge(userId){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", baseurl + "/get-fridge/" + userId, true);
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
            var food = JSON.parse(xmlhttp.responseText);
            var tbltop = "<thead><tr><th>Food Name</th><th>Food Quantity</th><th>Core Quantity</th><th>Edit</th><th>Delete</th></tr><thead/>";
            
            var main = "<tbody>";
            for (i = 0; i < food.length; i++){
                main += "<tr><td>" + food[i].foodName +"</td><td>" + food[i].foodQuantity 
                +"</td><td>" + food[i].coreQuantity 
                + `</td><td><button class="tableButton" id = "editButton" onclick = editFoodForm(this)>Edit</button>`
                + `</td><td><button class="tableButton" id = "deleteButton" onclick = deleteFood(this)>Delete</button>`;
            }
            main+= "</tbody>"
            var tbl = tbltop + main;
            document.getElementById("fridgeTable").innerHTML = tbl;
            sortTable();
            var addFoodButton = "<button class = \"button-37\" onclick = addFoodForm()>Add Food Item</button>";
            document.getElementById("addFood").innerHTML = addFoodButton;
            var missingCoreButton = "<button class = \"button-37\" onclick = missingCore()>What am I missing?</button>";
            document.getElementById("missingCore").innerHTML = missingCoreButton;
        }
        else{
            System.out.println("Error")
        }
    };
    xmlhttp.send();
}

function sortTable() {
    var filterTable, rows, sorted, i, x, y, sortFlag;
    filterTable = document.getElementById("fridgeTable");
    sorted = true;
    while (sorted) {
       sorted = false;
       rows = filterTable.rows;
       for (i = 1; i < rows.length - 1; i++) {
            sortFlag = false;
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                sortFlag = true;
                break;
            }
        }
        if (sortFlag) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            sorted = true;
        }
    }
}

function addFoodForm(){
    var addFoodForm = 
    `<form onsubmit="return false;">
        <label for=foodName>What food would you like to add?:</label>
        <br><input type=text id=foodName><br>
        <label for=foodQuantity>How many do you want to add to your fridge?:</label>
        <br><input type=number id=foodQuantity><br>
        <label for=coreQuantity>How many would you like in your fridge at all times?:</label>
        <br><input type=number id=coreQuantity><br>
        <input type="submit" onclick="collapseAddFoodForm();" />
    </form>`
    document.getElementById("addFoodForm").innerHTML = addFoodForm;
    document.getElementById("addFoodForm").style.display = 'block';
}

function addFood(){
    var foodName = document.getElementById("foodName").value;
    var foodQuantity = document.getElementById("foodQuantity").value;
    var coreQuantity = document.getElementById("coreQuantity").value;
    var userId = document.getElementById("userId").innerHTML;
    var xmlhttp = new XMLHttpRequest();
    const json = {
        "deltaFoodQuantity": foodQuantity,
        "newCoreQuantity": coreQuantity
    };
    xmlhttp.open("POST", baseurl + "/user/" + userId + "/food/" + foodName + "/update", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(json));
    alert("Food item added!");
    getFridge(userId);
    if (foodQuantity == ""){
        foodQuantity = 0;
    }
    const food = {
        "foodName": foodName,
        "foodQuantity": foodQuantity,
        "coreQuantity": coreQuantity
    };
    coreAlert(food);
    document.getElementById("missingList").style.display = "none";
}

function deleteFood(button){
    var row = button.parentNode.parentNode.rowIndex;
    var table = document.getElementById("fridgeTable");
    var foodName = table.rows[row].cells[0].innerHTML;
    var userId = document.getElementById("userId").innerHTML;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("DELETE", baseurl + "/user/" + userId + "/food/" + foodName + "/delete", true);
    xmlhttp.send();
    alert("Food item deleted!");
    alert("Food item deleted!");
    getFridge(userId);
}

function editFoodForm(button){
    const edit = document.createElement("edit");
    edit.id = "editFoodForm";
    var editFoodForm = `<form onsubmit="return false;">
    <label for=foodQuan>How much would you like to +/-?</label>
    <br><input type=number id=foodQuan><br>
    <label for=coreQuan>How many would you like in your fridge at all times?</label>
    <br><input type=number id=coreQuan><br>
    <input type="submit" onclick="collapseEditFoodForm(this);" />
    </form>`;
    edit.innerHTML = editFoodForm;
    button.parentNode.replaceChild(edit, button);
    
}

function editFood(button){
    var row = button.parentNode.parentNode.parentNode.parentNode.rowIndex;
    var table = document.getElementById("fridgeTable");
    var foodName = table.rows[row].cells[0].innerHTML;
    var foodQuantity = document.getElementById("foodQuan").value;
    var foodQForCore = table.rows[row].cells[1].innerHTML;
    var coreQuantity = document.getElementById("coreQuan").value;
    var userId = document.getElementById("userId").innerHTML;
    var xmlhttp = new XMLHttpRequest();
    const json = {
        "deltaFoodQuantity": foodQuantity,
        "newCoreQuantity": coreQuantity
    };
    xmlhttp.open("POST", baseurl + "/user/" + userId + "/food/" + foodName + "/update", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(json));
    alert("Food item updated!");
    getFridge(userId);
    const food = {
        "foodName": foodName,
        "foodQuantity": foodQForCore,
        "coreQuantity": coreQuantity
    };
    document.getElementById("missingList").style.display = "none";
    coreAlert(food);
}

function coreAlert(food){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", baseurl + "/has-core", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
            var hasCoreFood = JSON.parse(xmlhttp.responseText);
            if(hasCoreFood == false){
                alert("You are under your core value!");
            }
        }
        else{
            System.out.println("Error")
        }
    };
    xmlhttp.send(JSON.stringify(food));
}

function missingCore(){
    document.getElementById("missingList").style.display = 'block';
    var xmlhttp = new XMLHttpRequest();
    var userId = document.getElementById("userId").innerHTML;
    xmlhttp.open("GET", baseurl + "/missing-core/" + userId, true);
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
            var food = JSON.parse(xmlhttp.responseText);

            var list = ""
            for (i = 0; i < food.length; i++){
                list += "<p>" + food[i].foodName + "</p>";
            }
            document.getElementById("missingList").innerHTML = list;
        }
        else{
            System.out.println("Error")
        }
    };
    xmlhttp.send();
}