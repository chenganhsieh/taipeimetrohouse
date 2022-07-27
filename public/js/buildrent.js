//save users data
var usersId = [];
var usersEmail = [];
var electChart;
var switch_task_id = "none"

//rent data id
var rent_id_list = []
var rent_money_list = []

/**
 * Handles the out focus element.
 */
function taskNameFocusOut() {
    var name = document.getElementById('buildTaskName').value;
    var nameWrong = document.getElementById('buildTaskNameWrong');
    if (name.length < 1) {
        nameWrong.removeAttribute("hidden");
    } else {
        nameWrong.setAttribute('hidden', 'true');
    }
}

function taskStatusFocusOut() {
    var taskContent = document.getElementById('buildTaskStatus').value;
    var taskContentWrong = document.getElementById('buildTaskStatusWrong');
    if (taskContent.length < 2) {
        taskContentWrong.removeAttribute("hidden");
    } else {
        taskContentWrong.setAttribute('hidden', 'true');
    }
}

function taskRoomFocusOut() {
    var taskContent = document.getElementById('buildTaskRooms2').value;
    var taskContentWrong = document.getElementById('buildTaskRooms2Wrong');
    if (taskContent.length < 2) {
        taskContentWrong.removeAttribute("hidden");
    } else {
        taskContentWrong.setAttribute('hidden', 'true');
    }
}


function taskRoomNumFocusOut() {
    var taskRoomNum = document.getElementById('buildTaskRoomsNum2').value;
    var buildTaskRoomsNumWrong = document.getElementById('buildTaskRoomsNum2Wrong');
    if (taskRoomNum.length < 1) {
        buildTaskRoomsNumWrong.removeAttribute("hidden");
    } else {
        buildTaskRoomsNumWrong.setAttribute('hidden', 'true');
    }
}

function taskPersonFocusOut() {
    var taskPerson = document.getElementById('buildTaskPerson').value;
    var taskPersonWrong = document.getElementById('buildTaskPersonWrong');
    if (taskPerson.length < 1) {
        taskPersonWrong.removeAttribute("hidden");
    } else {
        taskPersonWrong.setAttribute('hidden', 'true');
    }
}

function taskDateFocusOut() {
    var taskdate = document.getElementById('buildTaskdate').value;
    var taskdatesWrong = document.getElementById('buildTaskdateWrong');
    if (taskdate.length < 1) {
        taskdatesWrong.removeAttribute("hidden");
    } else {
        taskdatesWrong.setAttribute('hidden', 'true');
    }
}

function taskMonthFocusOut() {
    var taskdate = document.getElementById('buildTaskmonth').value;
    var taskdatesWrong = document.getElementById('buildTaskmonthWrong');
    if (taskdate.length < 1) {
        taskdatesWrong.removeAttribute("hidden");
    } else {
        taskdatesWrong.setAttribute('hidden', 'true');
    }
}

function rentFocusOut() {
    var rentCost = document.getElementById('rentCost').value;
    var rentCostWrong = document.getElementById('rentCostWrong');
    if (rentCost.length < 1) {
        rentCostWrong.removeAttribute("hidden");
    } else {
        rentCostWrong.setAttribute('hidden', 'true');
    }
}

function electFocusOut() {
    var elect = document.getElementById('buildRentElect').value;
    var electWrong = document.getElementById('buildRentElectWrong');
    if (elect.length < 1) {
        electWrong.removeAttribute("hidden");
    } else {
        electWrong.setAttribute('hidden', 'true');
    }
}

function objFocusOut() {
    var buildRentObj = document.getElementById('buildRentObj').value;
    var buildRentObjWrong = document.getElementById('buildRentObjWrong');
    if (buildRentObj.length < 1) {
        buildRentObjWrong.removeAttribute("hidden");
    } else {
        buildRentObjWrong.setAttribute('hidden', 'true');
    }
}

function searchYearFocusOut() {
    var searchYear = document.getElementById('searchYear').value;
    var searchYearWrong = document.getElementById('searchYearWrong');
    if (searchYear.length < 1) {
        searchYearWrong.removeAttribute("hidden");
    } else {
        searchYearWrong.setAttribute('hidden', 'true');
    }
}

function searchMonthFocusOut() {
    var searchMonth = document.getElementById('searchMonth').value;
    var searchMonthWrong = document.getElementById('searchMonthWrong');
    if (searchMonth.length < 1) {
        searchYearWrong.removeAttribute("hidden");
    } else {
        searchMonthWrong.setAttribute('hidden', 'true');
    }
}

function serachRoomsFocusOut() {
    var serachRooms = document.getElementById('serachRooms2').value;
    var serachRoomsWrong = document.getElementById('serachRooms2Wrong');
    if (serachRooms.length < 1) {
        serachRoomsWrong.removeAttribute("hidden");
    } else {
        serachRoomsWrong.setAttribute('hidden', 'true');
    }
}

function serachRoomsNumFocusOut() {
    var serachRoomsNum = document.getElementById('serachRoomsNum2').value;
    var serachRoomsNumWrong = document.getElementById('serachRoomsNum2Wrong');
    if (serachRoomsNum.length < 1) {
        serachRoomsNumWrong.removeAttribute("hidden");
    } else {
        serachRoomsNumWrong.setAttribute('hidden', 'true');
    }
}


function buildRentElectfocusOut() {
    var buildRentElect = document.getElementById('buildRentElect').value;
    var buildRentElectWrong = document.getElementById('buildRentElectWrong');
    if (buildRentElect.length < 1) {
        buildRentElectWrong.removeAttribute("hidden");
    } else {
        buildRentElectWrong.setAttribute('hidden', 'true');
    }
}

//Logout
function logout() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
}

//getUserUid
function getUserUid() {
    return firebase.auth().currentUser.uid;
}

function getUserName() {
    if (sessionStorage.getItem('userName') != null && sessionStorage.getItem('userName') != "") {
        return sessionStorage.getItem('userName');
    }
    return firebase.auth().currentUser.displayName;
}




//set elect data
function setEleData() {
    var year = document.getElementById("searchYearEle").value;
    var filterRoomNum = document.getElementById("serachRoomsEle").value;
    var serachRoomsNumEle = document.getElementById("serachRoomsNumEle").value;
    var onlyOne = false;

    if (year == "" || year == " ") {
        var thisYear = new Date().getFullYear();
    } else {
        var thisYear = year;
    }

    if (filterRoomNum != "" && serachRoomsNumEle == "") {
        var newRef = firebase.database().ref('elect/' + thisYear).orderByChild('houseName').equalTo(filterRoomNum);
    } else if (serachRoomsNumEle != "" && filterRoomNum == "") {
        var newRef = firebase.database().ref('elect/' + thisYear).orderByChild('roomNum').equalTo(serachRoomsNumEle);
    } else if (serachRoomsNumEle != "" && 　filterRoomNum != "") {
        onlyOne = true;
        var newRef = firebase.database().ref('elect/' + thisYear).orderByChild('houseNameRoom').equalTo(filterRoomNum + serachRoomsNumEle);
    } else {
        var newRef = firebase.database().ref('elect/' + thisYear).orderByChild('updateDate').limitToLast(20);
    }

    newRef.on('value', function(snapshot) {
        var taskIngData = document.getElementById("eleData");
        // var taskFinishData = document.getElementById("taskFinishData");
        taskIngData.innerHTML = "";
        // taskFinishData.innerHTML = "";
        snapshot.forEach(function(childSnapshot) {
            console.log("testing");
            var roomNum = (childSnapshot.val() && childSnapshot.val().roomNum);
            var roomName = (childSnapshot.val() && childSnapshot.val().houseName);
            var month1 = (childSnapshot.val() && childSnapshot.val().month1) || 0;
            var month2 = (childSnapshot.val() && childSnapshot.val().month2) || 0;
            var month3 = (childSnapshot.val() && childSnapshot.val().month3) || 0;
            var month4 = (childSnapshot.val() && childSnapshot.val().month4) || 0;
            var month5 = (childSnapshot.val() && childSnapshot.val().month5) || 0;
            var month6 = (childSnapshot.val() && childSnapshot.val().month6) || 0;
            var month7 = (childSnapshot.val() && childSnapshot.val().month7) || 0;
            var month8 = (childSnapshot.val() && childSnapshot.val().month8) || 0;
            var month9 = (childSnapshot.val() && childSnapshot.val().month9) || 0;
            var month10 = (childSnapshot.val() && childSnapshot.val().month10) || 0;
            var month11 = (childSnapshot.val() && childSnapshot.val().month11) || 0;
            var month12 = (childSnapshot.val() && childSnapshot.val().month12) || 0;
            console.log(month5);

            var money1 = (childSnapshot.val() && childSnapshot.val().money1) || "";
            var money2 = (childSnapshot.val() && childSnapshot.val().money2) || "";
            var money3 = (childSnapshot.val() && childSnapshot.val().money3) || "";
            var money4 = (childSnapshot.val() && childSnapshot.val().money4) || "";
            var money5 = (childSnapshot.val() && childSnapshot.val().money5) || "";
            var money6 = (childSnapshot.val() && childSnapshot.val().money6) || "";
            var money7 = (childSnapshot.val() && childSnapshot.val().money7) || "";
            var money8 = (childSnapshot.val() && childSnapshot.val().money8) || "";
            var money9 = (childSnapshot.val() && childSnapshot.val().money9) || "";
            var money10 = (childSnapshot.val() && childSnapshot.val().money10) || "";
            var money11 = (childSnapshot.val() && childSnapshot.val().money11) || "";
            var money12 = (childSnapshot.val() && childSnapshot.val().money12) || "";
            var html =
                '<td>' + roomName + roomNum + '</td>' +
                '<td>' + '抄表度數' + '</td>' +
                '<td>' + month1 + '</td>' +
                '<td>' + month2 + '</td>' +
                '<td>' + month3 + '</td>' +
                '<td>' + month4 + '</td>' +
                '<td>' + month5 + '</td>' +
                '<td>' + month6 + '</td>' +
                '<td>' + month7 + '</td>' +
                '<td>' + month8 + '</td>' +
                '<td>' + month9 + '</td>' +
                '<td>' + month10 + '</td>' +
                '<td>' + month11 + '</td>' +
                '<td>' + month12 + '</td>';
            var html1 =
                '<td>' + ' ' + '</td>' +
                '<td>' + '應收電費' + '</td>' +
                '<td>' + money1 + '</td>' +
                '<td>' + money2 + '</td>' +
                '<td>' + money3 + '</td>' +
                '<td>' + money4 + '</td>' +
                '<td>' + money5 + '</td>' +
                '<td>' + money6 + '</td>' +
                '<td>' + money7 + '</td>' +
                '<td>' + money8 + '</td>' +
                '<td>' + money9 + '</td>' +
                '<td>' + money10 + '</td>' +
                '<td>' + money11 + '</td>' +
                '<td>' + money12 + '</td>';
            // ...
            var newElement = document.createElement("tr");
            var newElement1 = document.createElement("tr");
            // newElement.setAttribute('class', "table-secondary");
            newElement.innerHTML = html;
            newElement1.innerHTML = html1;
            taskIngData.insertBefore(newElement1, taskIngData.firstChild);
            taskIngData.insertBefore(newElement, taskIngData.firstChild);

            if (onlyOne == true) {
                dataArray = [month1, month2, month3, month4, month5, month6, month7, month8, month9, month10, month11, month12]
                electChart.destroy();
                createChar(dataArray);
            }

        });

    });


}

//get house data
function setTaskFinish(id, deleteElement) {
    firebase.database().ref('buildtasks/' + id).update({
        status: "已完成",
        finishDate: firebase.database.ServerValue.TIMESTAMP
    }).then(function() {
        var element = document.getElementById(deleteElement);
        element.parentNode.removeChild(element);
    }).catch(function(error) {
        switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                alert("您沒有權限");
                break;
            case 'storage/canceled':
                // User canceled the upload
                alert("網路不佳，您已取消上傳");
                break;
            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                alert("未知錯誤");
                break;
        }
    });
}

// if position is not admin, back to main.html
function checkUserPosition() {
    var userId = getUserUid();
    var position = '';
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        if (position != "管理員" && position != "會計") {
            window.location.href = './main.html';
            return;
        }
    });
}

function upLoadEleData() {
    var taskRoomIndex = document.getElementById('buildTaskRooms2').selectedIndex;
    var taskRoom = document.getElementById('buildTaskRooms2').value;
    var taskRoomNumIndex = document.getElementById('buildTaskRoomsNum2').selectedIndex;
    var taskRoomNum = document.getElementById('buildTaskRoomsNum2').value;
    var taskDate = document.getElementById('buildTaskmonth').value;
    var rentCost = document.getElementById('rentCost').value;
    var buildRentElect = document.getElementById('buildRentElect').value;


    taskRoomFocusOut();
    taskRoomNumFocusOut();
    taskMonthFocusOut();
    rentFocusOut();
    buildRentElectfocusOut();
    if (taskRoom.length < 1 || taskDate.length < 1 || taskRoomNum < 1 || rentCost.length < 1 || buildRentElect < 1) {
        return;
    }
    $('#uploadModal').modal();
    taskDate = new Date(taskDate);
    getTimeYear = taskDate.getFullYear();
    getTimeMonth = taskDate.getMonth() + 1;
    var monthName = "money" + getTimeMonth;
    var dateName = "date" + getTimeMonth;
    var electName = "month" + getTimeMonth;
    var newRef = firebase.database().ref('elect/' + getTimeYear + '/' + housesId[taskRoomIndex - 1] + taskRoomNum);
    newRef.update({
        houseid: housesId[taskRoomIndex - 1],
        houseName: houseName[taskRoomIndex - 1],
        houseNameRoom: houseName[taskRoomIndex - 1] + taskRoomNum,
        [monthName]: rentCost,
        [dateName]: formatMS(taskDate),
        roomNum: taskRoomNum,
        [electName]: buildRentElect,
        updateDate: firebase.database.ServerValue.TIMESTAMP
    }).then(function() {
        // hide uploading alert
        $("#uploadModal .close").click();
        // show success alert
        $('#dataUploadModal').modal();
        document.getElementById('buildTaskRents').selectedIndex = 0;
        document.getElementById('buildTaskdate').value = "";
        document.getElementById('rentCost').value = 0;
        document.getElementById('buildTaskRoomsNum').selectedIndex = 0;
        document.getElementById('buildRentElect').value = 0;
    }).catch(function(error) {
        console.error('Error writing user data to database', error);
        alert("網路錯誤");
    });
}


// upload rent data
function upLoadRentData2(type_index) {
    console.log(type_index)
    var taskRoomIndex = document.getElementById('buildTaskRooms2').selectedIndex;
    var taskRoom = document.getElementById('buildTaskRooms2').value;
    var taskRoomNumIndex = document.getElementById('buildTaskRoomsNum2').selectedIndex;
    var taskRoomNum = document.getElementById('buildTaskRoomsNum2').value;
    var taskDate = document.getElementById('buildTaskdate').value;
    var taskMonth = document.getElementById('buildTaskmonth').value;
    taskMonth = new Date(taskMonth).getMonth() + 1;
    var rentCost = document.getElementById('rentCost').value;
    var rentDegree = document.getElementById('buildRentElect').value || 0;
    var rentOrgDegree = document.getElementById('buildRentElectOrg').value;
    var buildRentObj = document.getElementById("buildRentObj").value;
    var buildRentMoneyType = document.getElementById("buildRentTypeSelect").value || '無';
    var rent_name = document.getElementById('buildTaskPerson').value || '無';
    var rent_name_idIndex = document.getElementById('buildTaskPerson').selectedIndex;
    var rent_id = rent_id_list[rent_name_idIndex];
    var rent_money = rent_money_list[rent_name_idIndex];

    if (type_index != 6 && type_index != 7 && type_index != 8) {
        taskRoomFocusOut();
        taskRoomNumFocusOut();
    }
    taskDateFocusOut();
    rentFocusOut();
    if ((taskRoom.length < 1 || taskDate.length < 1 || taskRoomNum < 1 || rentCost.length < 1) && (type_index != 6 && type_index != 7 && type_index != 8)) {
        console.log("room error")
        return;
    } else {
        taskRoom = taskRoom || "無"
        taskRoomNum = taskRoomNum || "無"
    }
    if ((type_index == 2 || type_index == 3) && rentDegree.length < 1) {
        electFocusOut();
        return;
    }
    if ((type_index == 2 || type_index == 3 || type_index == 4 || type_index == 5) && taskMonth.length < 1) {
        taskMonthFocusOut();
        return;
    }
    if ((type_index == 6 || type_index == 7 || type_index == 8) && buildRentObj.length < 1) {
        objFocusOut();
        return
    }
    $('#uploadModal').modal();
    task_date = new Date(taskDate);
    getTimeYear = task_date.getFullYear();
    getTimeMonth = task_date.getMonth() + 1;
    var monthName = "money" + getTimeMonth;
    var dateName = "date" + getTimeMonth;
    var degreeName = "degree" + (task_date.getMonth() + 1);
    var orgDegreeName = "degree" + (task_date.getMonth());
    var now_time = new Date().getTime()


    var rent_type = ["rent_money", "ele_money", "wat_money", "mag_money", "gas_money", "obj_money", "fix_money", "other_money"]
    if (type_index == 1) {
        var newPostKey = firebase.database().ref().child(rent_type[type_index - 1] + '/' + roomsId[taskRoomNumIndex] + "/" + getTimeYear + '/' + getTimeMonth).push().key;
    } else if (type_index >= 6) {
        var newPostKey = firebase.database().ref().child(rent_type[type_index - 1] + '/' + getTimeYear + "/" + getTimeMonth).push().key;
    }

    //var newRef = firebase.database().ref(rent_type[type_index - 1] + '/' + roomsId[taskRoomNumIndex] + "/" + getTimeYear + '/' + getTimeMonth);
    if (type_index == 1) {
        var postData = {
            id: newPostKey,
            houseid: housesId[taskRoomIndex - 1],
            roomid: roomsId[taskRoomNumIndex],
            houseName: houseName[taskRoomIndex - 1],
            roomNum: taskRoomNum,
            rent_money: rent_money,
            pay_person: rent_name,
            pay_rent_id: rent_id,
            pay_money: rentCost,
            pay_time: new Date(task_date).getTime(),
            pay_method: buildRentMoneyType,
            pay_date: taskDate,
            updateDate: firebase.database.ServerValue.TIMESTAMP,
            uploadPersonId: getUserUid(),
            uploadPersonName: getUserName()

        }
    } else if (type_index > 1 && type_index < 6) {
        var postData = {
            houseid: housesId[taskRoomIndex - 1],
            roomid: roomsId[taskRoomNumIndex],
            houseName: houseName[taskRoomIndex - 1],
            roomNum: taskRoomNum,
            degree: rentDegree,
            degree_month: taskMonth,
            pay_person: rent_name,
            pay_rent_id: rent_id,
            pay_money: rentCost,
            pay_time: new Date(task_date).getTime(),
            pay_method: buildRentMoneyType,
            updateDate: firebase.database.ServerValue.TIMESTAMP,
            uploadPersonId: getUserUid(),
            uploadPersonName: getUserName()

        }
    } else if (type_index >= 6) {
        var postData = {
            id: newPostKey,
            houseid: housesId[taskRoomIndex - 1],
            roomid: roomsId[taskRoomNumIndex],
            houseName: houseName[taskRoomIndex - 1],
            roomNum: taskRoomNum,
            obj: buildRentObj,
            pay_money: rentCost,
            pay_time: new Date(task_date).getTime(),
            updateDate: firebase.database.ServerValue.TIMESTAMP,
            uploadPersonId: getUserUid(),
            uploadPersonName: getUserName()
        }
    }
    var updates = {};
    if (type_index == 2 || type_index == 3 || type_index == 4 || type_index == 5) {
        updates[rent_type[type_index - 1] + '/' + roomsId[taskRoomNumIndex] + "/" + getTimeYear + '/' + taskMonth] = postData;
    } else if (type_index == 1) {
        updates[rent_type[type_index - 1] + '/' + roomsId[taskRoomNumIndex] + "/" + getTimeYear + '/' + getTimeMonth + "/" + newPostKey] = postData;
    } else if (type_index >= 6) {
        updates[rent_type[type_index - 1] + '/' + getTimeYear + '/' + getTimeMonth + "/" + newPostKey] = postData;
    }
    firebase.database().ref().update(updates).then(function() {
        // hide uploading alert
        $("#uploadModal .close").click();
        // show success alert
        $('#dataUploadModal').modal();
        document.getElementById('buildTaskRents').selectedIndex = 0;
        document.getElementById('buildTaskdate').value = "";
        document.getElementById('rentCost').value = 0;
        document.getElementById('buildTaskRoomsNum2').selectedIndex = 0;
        document.getElementById("buildTaskRoomsNum2").value = "";
        document.getElementById("buildTaskRooms2").selectedIndex = 0;
        document.getElementById("buildTaskRooms2").value = 0;
        document.getElementById("buildRentElect").value = 0;
        document.getElementById("buildRentElectOrg").value = 0;
        document.getElementById("buildRentObj").value = "";
    }).catch(function(error) {
        console.error('Error writing user data to database', error);
        alert("網路錯誤");
    });
}



//get all house data
function setHousesData() {
    firebase.database().ref('houses/').once('value', function(snapshot) {
        var taskRooms = document.getElementById("buildTaskRooms");
        var filterRooms = document.getElementById("serachRooms2");
        // var electRooms = document.getElementById("serachRoomsEle");
        snapshot.forEach(function(childSnapshot) {
            var name = (childSnapshot.val() && childSnapshot.val().name) || '訪客';
            var amount = (childSnapshot.val() && childSnapshot.val().amount);
            var houseId = (childSnapshot.val() && childSnapshot.val().id);
            var newElement = document.createElement("option");
            var newElement2 = document.createElement("option");
            var newElement3 = document.createElement("option");
            newElement.innerHTML = name;
            newElement2.innerHTML = name;
            newElement3.innerHTML = name;
            houseRoomNum.push(amount);
            filterRooms.appendChild(newElement);
            taskRooms.appendChild(newElement2);
            // electRooms.appendChild(newElement3)
            housesId.push(houseId);
            houseName.push(name);
        });
    });
}
//if select one house change the num of rooms
function changeRentOption() {
    var taskRentIndex = document.getElementById('buildTaskRents').selectedIndex;
    let now_year = new Date().getFullYear()
    let prior_month = new Date().getMonth()
    if (prior_month == 0) {
        prior_month = 12
    }

    document.getElementById('buildTaskRoomsScope2').removeAttribute('hidden');
    document.getElementById('buildTaskRoomsNumScope2').removeAttribute('hidden');
    document.getElementById("buildTaskPersonScope2").removeAttribute('hidden');
    document.getElementById("buildRentdateScope").removeAttribute('hidden');
    document.getElementById("buildRentCostScope").removeAttribute('hidden');
    document.getElementById("buildRentType").removeAttribute('hidden')
    document.getElementById("buildRentmonthScope").setAttribute('hidden', 'true');
    document.getElementById("buildRentElectScope").setAttribute('hidden', 'true');
    document.getElementById("buildRentElectOrgScope").setAttribute('hidden', 'true');
    document.getElementById("sendBuildTask_div").removeAttribute('hidden');
    document.getElementById("buildRentObjectScope").setAttribute('hidden', 'true');
    document.getElementById("buildRentType").setAttribute("hidden", "true")
    if (taskRentIndex == 1) {
        document.getElementById("buildRentType").removeAttribute('hidden')
    }

    if (taskRentIndex == 2 || taskRentIndex == 3) {
        document.getElementById("buildRentElectOrgScope").removeAttribute('hidden');
        document.getElementById("buildRentElectScope").removeAttribute('hidden');
        document.getElementById('buildTaskmonth').addEventListener('change', function() { changeEle(taskRentIndex) }, false);
        document.getElementById("buildRentmonthScope").removeAttribute('hidden');
    }
    if (taskRentIndex == 4 || taskRentIndex == 5) {
        document.getElementById("buildRentmonthScope").removeAttribute('hidden');
    }
    if (taskRentIndex == 6 || taskRentIndex == 7 || taskRentIndex == 8) {
        document.getElementById("buildRentObjectScope").removeAttribute('hidden');
    }
    $("#sendBuildTask").off('click').click(function() {
        upLoadRentData2(taskRentIndex)
    });

}

function changeEle(taskRentIndex) {
    let now_year = new Date().getFullYear();
    let prior_month = new Date(document.getElementById("buildTaskmonth").value).getMonth();
    let room_index = document.getElementById("buildTaskRoomsNum2").selectedIndex
    let room_id = roomsId[room_index]
    if (prior_month == 0) {
        prior_month = 12
    }
    document.getElementById("buildRentElectOrg").value = 0
    if (taskRentIndex == 2) {
        firebase.database().ref("ele_money" + '/' + room_id + "/" + now_year + '/' + prior_month).once('value', function(snapshot) {
            if (snapshot.val() != null) {
                document.getElementById("buildRentElectOrg").value = snapshot.val().degree
            }
        })
    } else {
        firebase.database().ref("wat_money" + '/' + room_id + "/" + now_year + '/' + prior_month).once('value', function(snapshot) {
            if (snapshot.val() != null) {
                document.getElementById("buildRentElectOrg").value = snapshot.val().degree
            }
        })
    }
}
//change room num
function changeRoomNum2(type) {
    roomsId = []
    if (type == "add") {
        var taskRooms = document.getElementById("buildTaskRoomsNum2");
        var taskRoomIndex = document.getElementById('buildTaskRooms2').selectedIndex;
    } else if (type == "search") {
        var taskRooms = document.getElementById("serachRoomsNum2");
        var taskRoomIndex = document.getElementById('serachRooms2').selectedIndex;
    }
    taskRooms.innerHTML = ""
    var numOfRoom = parseInt(houseRoomNum[taskRoomIndex - 1]);
    var houseId = housesId[taskRoomIndex - 1];
    firebase.database().ref('houses/' + houseId).once('value', function(snapshot) {
        roomsId = snapshot.val().rooms
    }).then(function() {
        for (var i = 0; i < numOfRoom; i++) {
            var newElement = document.createElement("option");
            newElement.innerHTML = room_number_list[i] + "房";
            taskRooms.appendChild(newElement);
            if (i == numOfRoom - 1) {
                changeRentPeople()
            }
        }
    });
}

function changeRentPeople() {
    // buildTaskRoomsNum2
    var taskRoomIndex = document.getElementById('buildTaskRoomsNum2').selectedIndex;
    var roomId = roomsId[taskRoomIndex];
    var buildTaskPerson = document.getElementById("buildTaskPerson");
    buildTaskPerson.innerHTML = ""
    firebase.database().ref('rooms_rent/' + roomId).orderByChild('updateDate').limitToLast(3).once('value', function(snapshot) {
        let child_length = snapshot.numChildren()
        let temp_child_amount = 0
        let rent_name_list = []
        rent_id_list = []
        rent_money_list = []

        snapshot.forEach(function(childSnapshot) {
            rent_name_list.push(childSnapshot.val().rent_name)
            rent_id_list.push(childSnapshot.val().rent_id)
            rent_money_list.push(childSnapshot.val().rent_money)
            temp_child_amount += 1
            if (child_length == temp_child_amount) {
                for (var i = 0; i < child_length; i++) {
                    var newElement = document.createElement("option");
                    newElement.innerHTML = rent_name_list[i];
                    buildTaskPerson.appendChild(newElement);
                }
            }
        });

    })

}

function searchData() {

    var searchYear = document.getElementById("searchYear").value;
    var searchMonth = document.getElementById("searchMonth").value;
    var serachRooms = document.getElementById("serachRooms2").value;
    var serachRooms_index = document.getElementById("serachRooms2").selectedIndex;
    var serachRoomsNum = document.getElementById("serachRoomsNum2").value;
    var serachRoomsNum_index = document.getElementById("serachRoomsNum2").selectedIndex;


    searchYearFocusOut()
    console.log(switch_task_id)
    if (switch_task_id != "obj_money" && switch_task_id != "fix_money" && switch_task_id != "other_money") {
        serachRoomsFocusOut()
        serachRoomsNumFocusOut()
        if (searchYear.length < 1 || serachRooms.length < 1 || serachRoomsNum.length < 1) {
            return
        }
    }
    // if (switch_task_id == "ele_money" || switch_task_id == "wat_money") {
    //     document.getElementById("chart_div").removeAttribute("hidden")
    // }
    if (switch_task_id == "obj_money" || switch_task_id == "fix_money" || switch_task_id == "other_money") {
        searchMonthFocusOut()
        if (searchMonth.length < 1 || searchYear.length < 1) {
            return
        }
    }
    console.log(switch_task_id)
    if (switch_task_id != "obj_money" && switch_task_id != "fix_money" && switch_task_id != "other_money") {
        var room_id = roomsId[serachRoomsNum_index]
            // current rent person info
        firebase.database().ref('rooms_rent' + '/' + room_id).orderByChild('end_timesecond').limitToLast(1).once('value').then(function(snapshot) {
            let child_length = snapshot.numChildren()
            let temp_child_amount = 0
            snapshot.forEach(function(childSnapshot) {
                temp_child_amount += 1
                let end_timesecond = childSnapshot.val().end_timesecond
                let now_time = new Date()
                console.log(end_timesecond)
                if (now_time.getTime() < end_timesecond) {
                    var room_person = ((childSnapshot.val() && childSnapshot.val().rent_name) || '無資料');
                    var room_start_date = new Date(childSnapshot.val().start_timesecond);
                    var room_end_date = new Date(childSnapshot.val().end_timesecond);
                    var room_date = formatTime(room_start_date) + "~" + formatTime(room_end_date);
                    var room_phone = ((childSnapshot.val() && childSnapshot.val().rent_phone) || '無資料');
                    var room_rent = ((childSnapshot.val() && childSnapshot.val().rent_money) || '無資料');
                    var room_deposit = ((childSnapshot.val() && childSnapshot.val().rent_deposit) || '無資料');
                } else {
                    var room_person = "目前無承租人"
                    var room_date = "無租期"
                    var room_phone = "無資料"
                    var room_rent = "無資料"
                    var room_deposit = "無資料"
                }
                document.getElementById("room_person").innerHTML = room_person
                document.getElementById("room_date").innerHTML = room_date
                document.getElementById("room_phone").innerHTML = room_phone
                document.getElementById("room_rent").innerHTML = room_rent
                document.getElementById("room_deposit").innerHTML = room_deposit


            });
            if (snapshot == null) {
                child_length = 0;
                var room_person = "目前無承租人"
                var room_date = "無租期"
                var room_phone = "無資料"
                var room_rent = "無資料"
                var room_deposit = "無資料"
                document.getElementById("room_person").innerHTML = room_person
                document.getElementById("room_date").innerHTML = room_date
                document.getElementById("room_phone").innerHTML = room_phone
                document.getElementById("room_rent").innerHTML = room_rent
                document.getElementById("room_deposit").innerHTML = room_deposit
            }
            if (temp_child_amount == child_length) {
                document.getElementById("rent_detail_div").removeAttribute("hidden")
                document.getElementById("money_status_div").removeAttribute("hidden")
            }
        });
        // datatable data 
        $('#rentDataTable').DataTable().destroy();
        let taskIngData = document.getElementById("rentIngData");
        taskIngData.innerHTML = "";
        let month_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        if (switch_task_id == "rent_money") {
            document.getElementById("rentIngHeader").innerHTML =
                '<tr>' +
                '<th>月份</th>' +
                '<th>房間</th>' +
                '<th>租金狀況</th>' +
                '<th>繳交時間</th>' +
                '<th>繳交方式</th>' +
                '</tr>';
            firebase.database().ref(switch_task_id + '/' + roomsId[serachRoomsNum_index] + "/" + searchYear).once('value').then(function(snapshot) {
                var total_child = snapshot.numChildren()
                var temp_amount = 0

                snapshot.forEach(function(childSnapshot) {
                    let month = +childSnapshot.key
                    const remove_index = month_list.indexOf(month)
                    if (remove_index > -1) {
                        console.log("remove index:" + month)
                        month_list.splice(remove_index, 1);
                    }
                    temp_amount += 1
                    childSnapshot.forEach(function(childchildSnapshot) {
                        let houseName = (childchildSnapshot.val() && childchildSnapshot.val().houseName) || "";
                        let roomNum = (childchildSnapshot.val() && childchildSnapshot.val().roomNum) || "無資料";
                        let houseRoom = houseName + roomNum
                        let pay_method = (childchildSnapshot.val() && childchildSnapshot.val().pay_method);
                        let pay_money = (childchildSnapshot.val() && childchildSnapshot.val().pay_money);
                        let pay_time = (childchildSnapshot.val() && childchildSnapshot.val().pay_time);
                        let degree_month = (childchildSnapshot.val() && childchildSnapshot.val().degree_month);
                        let degree = (childchildSnapshot.val() && childchildSnapshot.val().degree);
                        let format_pay_time = formatTime(new Date(pay_time))
                        if (pay_method == "transfer") {
                            var pay_method_word = "轉帳"
                        } else {
                            var pay_method_word = "現金"
                        }
                        var html2 = '<td>' + month + '</td>' +
                            '<td>' + houseRoom + '</td>' +
                            '<td>已繳' + pay_money + '</td>' +
                            '<td>' + format_pay_time + '</td>' +
                            '<td>' + pay_method_word + '</td>';

                        var newElement2 = document.createElement("tr");
                        newElement2.innerHTML = html2;
                        taskIngData.insertBefore(newElement2, taskIngData.firstChild);

                    })

                });
                if (temp_amount == total_child) {
                    let last_month_size = month_list.length
                    let temp_month_count = 0
                    let now_month = (new Date().getMonth()) + 1
                    month_list.forEach(function(item) {
                        temp_month_count += 1
                        var html2 = '<td>' + item + '</td>' +
                            '<td>' + serachRooms + serachRoomsNum + '</td>';
                        if (now_month == item) {
                            html2 +=
                                '<td style = "color:red;">' + "未繳交" + '</td>' +
                                '<td style = "color:red;">' + "未知" + '</td>' +
                                '<td style = "color:red;">' + "未知" + '</td>';
                        } else {
                            html2 +=
                                '<td>' + "未繳交" + '</td>' +
                                '<td>' + "未知" + '</td>' +
                                '<td>' + "未知" + '</td>';
                        }

                        var newElement2 = document.createElement("tr");
                        newElement2.innerHTML = html2;
                        taskIngData.insertBefore(newElement2, taskIngData.firstChild);
                        if (temp_month_count == last_month_size) {
                            var table = $('#rentDataTable').DataTable({
                                buttons: [{
                                    'className': 'btn btn-primary glyphicon glyphicon-list-alt', //按鈕的class樣式
                                    'extend': 'excelHtml5', //匯出檔案格式為excel
                                    'text': '下載檔案', //按鈕標題
                                    //'title': 'XXX-' + start_date + "-" + end_date, //匯出的excel標題

                                }],
                                dom: "<'row '<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-4 align-self-center'B>>" +
                                    "<'row'<'col-sm-12'tr>>" +
                                    "<'row '<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                                "order": [
                                    [0, "asc"]
                                ],
                                initComplete: function() {
                                    var btns = $('.dt-button');
                                    btns.removeClass('dt-button');
                                },
                            })
                        }
                    })
                }
            });
        } else if (switch_task_id == "ele_money" || switch_task_id == "wat_money" || switch_task_id == "mag_money" || switch_task_id == "gas_money") {
            if (switch_task_id == "ele_money" || switch_task_id == "wat_money") {
                document.getElementById("rentIngHeader").innerHTML = '<tr>' +
                    '<th>月份</th>' +
                    '<th>房間</th>' +
                    '<th>度數</th>' +
                    '<th>繳交狀況</th>' +
                    '<th>繳交時間</th>' +
                    '</tr>';
            } else if (switch_task_id == "mag_money" || switch_task_id == "gas_money") {
                document.getElementById("rentIngHeader").innerHTML =
                    '<th>月份</th>' +
                    '<th>房間</th>' +
                    '<th>繳交狀況</th>' +
                    '<th>繳交時間</th>' +
                    '</tr>';
            }
            firebase.database().ref(switch_task_id + '/' + roomsId[serachRoomsNum_index] + "/" + searchYear).once('value').then(function(snapshot) {
                var total_child = snapshot.numChildren()
                var temp_amount = 0

                snapshot.forEach(function(childSnapshot) {
                    let month = +childSnapshot.key
                    const remove_index = month_list.indexOf(month)
                    if (remove_index > -1) {
                        month_list.splice(remove_index, 1);
                    }
                    temp_amount += 1

                    let houseName = (childSnapshot.val() && childSnapshot.val().houseName) || "";
                    let roomNum = (childSnapshot.val() && childSnapshot.val().roomNum) || "無資料";
                    let houseRoom = houseName + roomNum
                    let pay_money = (childSnapshot.val() && childSnapshot.val().pay_money);
                    let pay_time = (childSnapshot.val() && childSnapshot.val().pay_time);
                    let degree_month = (childSnapshot.val() && childSnapshot.val().degree_month);
                    let degree = (childSnapshot.val() && childSnapshot.val().degree);
                    let format_pay_time = formatTime(new Date(pay_time))
                    if (switch_task_id == "ele_money" || switch_task_id == "wat_money") {
                        var html2 = '<td>' + month + '</td>' +
                            '<td>' + houseRoom + '</td>' +
                            '<td>' + degree + '</td>' +
                            '<td>已繳' + pay_money + '</td>' +
                            '<td>' + format_pay_time + '</td>';
                    } else if (switch_task_id == "mag_money" || switch_task_id == "gas_money") {
                        var html2 = '<td>' + month + '</td>' +
                            '<td>' + houseRoom + '</td>' +
                            '<td>' + pay_money + '</td>' +
                            '<td>' + format_pay_time + '</td>';
                    }
                    var newElement2 = document.createElement("tr");
                    newElement2.innerHTML = html2;
                    taskIngData.insertBefore(newElement2, taskIngData.firstChild);


                });
                if (temp_amount == total_child) {
                    let last_month_size = month_list.length
                    let temp_month_count = 0
                    let now_month = (new Date().getMonth()) + 1
                    month_list.forEach(function(item) {
                        temp_month_count += 1
                        var html2 = '<td>' + item + '</td>' +
                            '<td>' + serachRooms + serachRoomsNum + '</td>';
                        if (now_month == item) {
                            if (switch_task_id == "ele_money" || switch_task_id == "wat_money") {
                                html2 +=
                                    '<td style = "color:red;">' + "未知" + '</td>' +
                                    '<td style = "color:red;">' + "未繳交" + '</td>' +
                                    '<td style = "color:red;">' + "未知" + '</td>';
                            }
                            if (switch_task_id == "mag_money" || switch_task_id == "gas_money") {
                                html2 +=
                                    '<td style = "color:red;">' + "未繳交" + '</td>' +
                                    '<td style = "color:red;">' + "未知" + '</td>';
                            }
                        } else {
                            if (switch_task_id == "ele_money" || switch_task_id == "wat_money") {
                                html2 +=
                                    '<td>' + "未知" + '</td>' +
                                    '<td>' + "未繳交" + '</td>' +
                                    '<td>' + "未知" + '</td>';
                            }
                            if (switch_task_id == "mag_money" || switch_task_id == "gas_money") {
                                html2 +=
                                    '<td>' + "未繳交" + '</td>' +
                                    '<td>' + "未知" + '</td>';
                            }
                        }

                        var newElement2 = document.createElement("tr");
                        newElement2.innerHTML = html2;
                        taskIngData.insertBefore(newElement2, taskIngData.firstChild);
                        if (temp_month_count == last_month_size) {
                            var table = $('#rentDataTable').DataTable({
                                "order": [
                                    [0, "asc"]
                                ]
                            })
                        }
                    })
                }
            });
        }
    } else {
        $('#rentDataTable').DataTable().destroy();
        let taskIngData = document.getElementById("rentIngData");
        taskIngData.innerHTML = "";
        document.getElementById("rentIngHeader").innerHTML =
            '<tr>' +
            '<th>種類</th>' +
            '<th>房間</th>' +
            '<th>日期</th>' +
            '<th>金額</th>' +
            '<th>內容</th>' +
            '</tr>';
        firebase.database().ref(switch_task_id + "/" + searchYear + "/" + searchMonth).once('value').then(function(snapshot) {
            var total_child = snapshot.numChildren()
            var temp_amount = 0
            let task_type = "物件"
            if (switch_task_id == "ojb_money") { task_type = "物件" } else if (switch_task_id == "fix_money") { task_type = "修繕" } else { task_type = "其他" }
            snapshot.forEach(function(childSnapshot) {
                temp_amount += 1
                let houseName = (childSnapshot.val() && childSnapshot.val().houseName) || "";
                let roomNum = (childSnapshot.val() && childSnapshot.val().roomNum) || "無資料";
                let houseRoom = childSnapshot.val().houseName + childSnapshot.val().roomNum
                let pay_money = (childSnapshot.val() && childSnapshot.val().pay_money);
                let pay_time = (childSnapshot.val() && childSnapshot.val().pay_time);
                let object = (childSnapshot.val() && childSnapshot.val().obj);
                let format_pay_time = formatTime(new Date(pay_time))
                var html2 = '<td>' + task_type + '</td>' +
                    '<td>' + houseRoom + '</td>' +
                    '<td>' + format_pay_time + '</td>' +
                    '<td>' + pay_money + '元</td>' +
                    '<td>' + object + '</td>';
                var newElement2 = document.createElement("tr");
                newElement2.innerHTML = html2;
                taskIngData.insertBefore(newElement2, taskIngData.firstChild);
            });
            if (total_child == 0) {
                var html2 = '<td>無資料</td>' +
                    '<td>無資料</td>' +
                    '<td>無資料</td>' +
                    '<td>無資料</td>' +
                    '<td>無資料</td>';
                var newElement2 = document.createElement("tr");
                newElement2.innerHTML = html2;
                taskIngData.insertBefore(newElement2, taskIngData.firstChild);
            }
            if (total_child == temp_amount) {
                var table = $('#rentDataTable').DataTable({
                    "order": [
                        [2, "desc"]
                    ]
                })
                document.getElementById("money_status_div").removeAttribute("hidden")
            }
        });
    }
}





//set users data
function setRentsData() {
    var year = document.getElementById("searchYear").value;
    var filterRoomNum = document.getElementById("serachRooms").value;
    console.log(year);
    if (year == "" || year == " ") {
        var thisYear = new Date().getFullYear();
    } else {
        var thisYear = year;
    }
    if (filterRoomNum != " ") {
        var newRef = firebase.database().ref('rents/' + thisYear).orderByChild('updateDate').limitToLast(20);
    } else {
        var newRef = firebase.database().ref('rents/' + thisYear).orderByChild('houseName').equalTo(filterRoomNum);
    }

    newRef.on('value', function(snapshot) {
        var taskIngData = document.getElementById("rentIngData");
        // var taskFinishData = document.getElementById("taskFinishData");
        taskIngData.innerHTML = "";
        // taskFinishData.innerHTML = "";
        console.log("start")
        snapshot.forEach(function(childSnapshot) {
            var roomNum = (childSnapshot.val() && childSnapshot.val().roomNum);
            var roomName = (childSnapshot.val() && childSnapshot.val().houseName);
            var money1 = (childSnapshot.val() && childSnapshot.val().money1) || "";
            var money2 = (childSnapshot.val() && childSnapshot.val().money2) || "";
            var money3 = (childSnapshot.val() && childSnapshot.val().money3) || "";
            var money4 = (childSnapshot.val() && childSnapshot.val().money4) || "";
            var money5 = (childSnapshot.val() && childSnapshot.val().money5) || "";
            var money6 = (childSnapshot.val() && childSnapshot.val().money6) || "";
            var money7 = (childSnapshot.val() && childSnapshot.val().money7) || "";
            var money8 = (childSnapshot.val() && childSnapshot.val().money8) || "";
            var money9 = (childSnapshot.val() && childSnapshot.val().money9) || "";
            var money10 = (childSnapshot.val() && childSnapshot.val().money10) || "";
            var money11 = (childSnapshot.val() && childSnapshot.val().money11) || "";
            var money12 = (childSnapshot.val() && childSnapshot.val().money12) || "";
            var html =
                '<td>' + roomName + roomNum + '</td>' +
                '<td>' + money1 + '</td>' +
                '<td>' + money2 + '</td>' +
                '<td>' + money3 + '</td>' +
                '<td>' + money4 + '</td>' +
                '<td>' + money5 + '</td>' +
                '<td>' + money6 + '</td>' +
                '<td>' + money7 + '</td>' +
                '<td>' + money8 + '</td>' +
                '<td>' + money9 + '</td>' +
                '<td>' + money10 + '</td>' +
                '<td>' + money11 + '</td>' +
                '<td>' + money12 + '</td>';
            // ...
            var newElement = document.createElement("tr");
            // newElement.setAttribute('class', "table-secondary");
            newElement.innerHTML = html;
            taskIngData.insertBefore(newElement, taskIngData.firstChild);
            // if (data == 20) {
            //     $('#rentDataTable').data.reload();
            // }
        });

    });


}


//get user profile
function setUserData() {
    //session storage file
    var storageName = sessionStorage.getItem('userName');
    var storagePhoto = sessionStorage.getItem('userPhoto');
    //html element
    var displayname = document.getElementById("displayname");
    var displayphoto = document.getElementById("displayImage");

    if (!storageName || !storagePhoto) {
        firebase.database().ref('users/' + getUserUid()).once('value').then(function(snapshot) {
            var username = (snapshot.val() && snapshot.val().name) || '訪客';
            var userphoto = (snapshot.val() && snapshot.val().profilePicUrl);
            sessionStorage.setItem('userName', username);
            sessionStorage.setItem('userPhoto', userphoto);
            displayname.textContent = username;
            displayphoto.src = userphoto;
        });
        return;
    }

    displayname.textContent = storageName;
    displayphoto.src = storagePhoto;
}

function switch_task(element) {
    if (element.id == "add_rent") {
        document.getElementById("calendar_footer").removeAttribute("hidden")
        document.getElementById("org_footer").setAttribute("hidden", true)
        document.getElementById("calendar_div").removeAttribute("hidden")
        document.getElementById("div_header").setAttribute("hidden", true)
        document.getElementById("add_money_div").setAttribute("hidden", true)
        document.getElementById("room_info_div").setAttribute("hidden", true)
        document.getElementById("money_status_div").setAttribute("hidden", true)
    } else {
        document.getElementById("org_footer").removeAttribute("hidden")
        document.getElementById("calendar_footer").setAttribute("hidden", true)
        document.getElementById('calendar_div').setAttribute("hidden", true)
        document.getElementById("div_header").removeAttribute("hidden")
        document.getElementById("serachHouseScope").removeAttribute("hidden")
        document.getElementById("serachRoomsScope").removeAttribute("hidden")
        document.getElementById("searchMonthScope").setAttribute("hidden", true)
        if (element.id == "add_money") {
            document.getElementById("div_header").innerHTML = "新增資料"
            document.getElementById("add_money_div").removeAttribute("hidden")
            document.getElementById("room_info_div").setAttribute("hidden", true)
            document.getElementById("money_status_div").setAttribute("hidden", true)
            document.getElementById("obj_status_div").setAttribute("hidden", true)
            document.getElementById("chart_div").setAttribute("hidden", true)
            document.getElementById("rent_detail_div").setAttribute("hidden", true)
        } else if (element.id == "wat_money" || element.id == "ele_money") {
            if (element.id == "wat_money") { switch_task_id = "wat_money" } else { switch_task_id = "ele_money" }
            document.getElementById("div_header").innerHTML = "水電查詢"
            document.getElementById("add_money_div").setAttribute("hidden", true)
            document.getElementById("room_info_div").removeAttribute("hidden")
            document.getElementById("rent_detail_div").setAttribute("hidden", true)
            document.getElementById("money_status_div").setAttribute("hidden", true)
            document.getElementById("obj_status_div").setAttribute("hidden", true)
            document.getElementById("searchYear").value = "";
            document.getElementById("serachRooms2").value = "";
            document.getElementById("serachRooms2").selectedIndex = 0;
            document.getElementById("serachRoomsNum2").value = "";
            document.getElementById("serachRoomsNum2").selectedIndex = 0;
        } else {
            if (element.id == "rent_money") {
                switch_task_id = "rent_money"
                document.getElementById("div_header").innerHTML = "租金查詢"
            } else if (element.id == "mag_money") {
                switch_task_id = "mag_money"
                document.getElementById("div_header").innerHTML = "管理費查詢"
            } else if (element.id == "gas_money") {
                switch_task_id = "gas_money"
                document.getElementById("div_header").innerHTML = "瓦斯費查詢"
            } else if (element.id == "obj_money") {
                switch_task_id = "obj_money"
                document.getElementById("div_header").innerHTML = "物件費查詢"
                document.getElementById("serachHouseScope").setAttribute("hidden", true)
                document.getElementById("serachRoomsScope").setAttribute("hidden", true)
                document.getElementById("searchMonthScope").removeAttribute("hidden")

            } else if (element.id == "fix_money") {
                switch_task_id = "fix_money"
                document.getElementById("div_header").innerHTML = " 修繕費查詢"
                document.getElementById("serachRoomsScope").setAttribute("hidden", true)
                document.getElementById("serachHouseScope").setAttribute("hidden", true)
                document.getElementById("searchMonthScope").removeAttribute("hidden")
            } else {
                switch_task_id = "other_money"
                document.getElementById("div_header").innerHTML = " 其他查詢"
                document.getElementById("serachRoomsScope").setAttribute("hidden", true)
                document.getElementById("serachHouseScope").setAttribute("hidden", true)
                document.getElementById("searchMonthScope").removeAttribute("hidden")
            }
            document.getElementById("add_money_div").setAttribute("hidden", true)
            document.getElementById("room_info_div").removeAttribute("hidden")
            document.getElementById("rent_detail_div").setAttribute("hidden", true)
            document.getElementById("money_status_div").setAttribute("hidden", true)
            document.getElementById("obj_status_div").setAttribute("hidden", true)
            document.getElementById("searchYear").value = "";
            document.getElementById("serachRooms2").value = "";
            document.getElementById("serachRooms2").selectedIndex = 0;
            document.getElementById("serachRoomsNum2").value = "";
            document.getElementById("serachRoomsNum2").selectedIndex = 0;
            document.getElementById("buildRentObj").value = "";
        }
    }
}

//yyyy-mm-dd
function formatTime(date) {
    var formatted_date = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2)
    return formatted_date;
}

function formatMS(date) {
    var d = new Date(date);
    return d.getTime();
}



/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (user) {
            checkUserPosition();
            setUserData();
            // setRentsData();
            // setEleData();
            //setHousesData();
        } else {
            window.location.href = './login.html';
        }

        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    //format datepicker only for year
    $("#searchYear").datepicker({
        language: 'zh-TW',
        format: "yyyy",
        viewMode: "years",
        minViewMode: "years",
        autoclose: true


    });
    $("#searchMonth").datepicker({
        language: 'zh-TW',
        format: "m",
        viewMode: "months",
        minViewMode: "months",
        autoclose: true,

    });

    createChar([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    document.getElementById('logout').addEventListener('click', logout, false);
    document.getElementById('buildTaskRents').addEventListener('change', changeRentOption, false);
    document.getElementById('buildTaskRooms2').addEventListener('change', function() { changeRoomNum2('add') }, false);
    document.getElementById('buildTaskRoomsNum2').addEventListener('change', function() { changeRentPeople() }, false);
    document.getElementById('serachRooms2').addEventListener('change', function() { changeRoomNum2('search') }, false);
    document.getElementById('search_button').addEventListener('click', function() { searchData(); }, false);
    // document.getElementById('serachRoomsEle').addEventListener('change', changeEleRoomNum, false);
    // document.getElementById('filtRentData').addEventListener('click', setRentsData, false);
    // document.getElementById('filtEleData').addEventListener('click', setEleData, false);
}

window.onload = function() {
    initApp();
};


function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function createChar(dataArray) {
    // Area Chart Example
    var ctx = document.getElementById("electChart");
    // electChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    //         datasets: [{
    //             label: "Earnings",
    //             lineTension: 0.3,
    //             backgroundColor: "rgba(78, 115, 223, 0.05)",
    //             borderColor: "rgba(78, 115, 223, 1)",
    //             pointRadius: 3,
    //             pointBackgroundColor: "rgba(78, 115, 223, 1)",
    //             pointBorderColor: "rgba(78, 115, 223, 1)",
    //             pointHoverRadius: 3,
    //             pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
    //             pointHoverBorderColor: "rgba(78, 115, 223, 1)",
    //             pointHitRadius: 10,
    //             pointBorderWidth: 2,
    //             data: dataArray,
    //         }],
    //     },
    //     options: {
    //         maintainAspectRatio: false,
    //         layout: {
    //             padding: {
    //                 left: 10,
    //                 right: 25,
    //                 top: 25,
    //                 bottom: 0
    //             }
    //         },
    //         scales: {
    //             xAxes: [{
    //                 time: {
    //                     unit: 'date'
    //                 },
    //                 gridLines: {
    //                     display: false,
    //                     drawBorder: false
    //                 },
    //                 ticks: {
    //                     maxTicksLimit: 12
    //                 }
    //             }],
    //             yAxes: [{
    //                 ticks: {
    //                     maxTicksLimit: 5,
    //                     padding: 10,
    //                     // Include a dollar sign in the ticks
    //                     callback: function(value, index, values) {
    //                         return number_format(value) + '度';
    //                     }
    //                 },
    //                 gridLines: {
    //                     color: "rgb(234, 236, 244)",
    //                     zeroLineColor: "rgb(234, 236, 244)",
    //                     drawBorder: false,
    //                     borderDash: [2],
    //                     zeroLineBorderDash: [2]
    //                 }
    //             }],
    //         },
    //         legend: {
    //             display: false
    //         },
    //         tooltips: {
    //             backgroundColor: "rgb(255,255,255)",
    //             bodyFontColor: "#858796",
    //             titleMarginBottom: 10,
    //             titleFontColor: '#6e707e',
    //             titleFontSize: 14,
    //             borderColor: '#dddfeb',
    //             borderWidth: 1,
    //             xPadding: 15,
    //             yPadding: 15,
    //             displayColors: false,
    //             intersect: false,
    //             mode: 'index',
    //             caretPadding: 10,
    //             callbacks: {
    //                 label: function(tooltipItem, chart) {
    //                     var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
    //                     return datasetLabel + ': 度' + number_format(tooltipItem.yLabel);
    //                 }
    //             }
    //         }
    //     }
    // });
}