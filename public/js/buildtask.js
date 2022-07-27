// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBbo7Hhxo1T9oWqMSHDC-oXV1Y9RhzYt3M",
    authDomain: "taipeimetrohouse.firebaseapp.com",
    databaseURL: "https://taipeimetrohouse-default-rtdb.firebaseio.com",
    projectId: "taipeimetrohouse",
    storageBucket: "taipeimetrohouse.appspot.com",
    messagingSenderId: "850324469942",
    appId: "1:850324469942:web:fcc6c2df57dc682d508e17",
    measurementId: "G-NBE4QRRLYG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//save users data
var usersId = [];
var usersEmail = [];
var houseRoomNum = [];

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
    var taskContent = document.getElementById('buildTaskRooms').value;
    var taskContentWrong = document.getElementById('buildTaskRoomsWrong');
    if (taskContent.length < 2) {
        taskContentWrong.removeAttribute("hidden");
    } else {
        taskContentWrong.setAttribute('hidden', 'true');
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

// set function option
//if select one house change the num of rooms
function changeTaskOption() {
    var roomId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
    var taskRooms = document.getElementById("buildTaskRoomsNum");
    var taskRentIndex = document.getElementById('buildTaskRents').selectedIndex;

    var buildTaskRoomsScope = document.getElementById('buildTaskRoomsScope');
    var buildTaskRoomsNumScope = document.getElementById('buildTaskRoomsNumScope');
    var buildRentdateScope = document.getElementById("buildRentdateScope");
    var buildRentCostScope = document.getElementById("buildRentCostScope");
    var buildRentmonthScope = document.getElementById("buildRentmonthScope");
    var buildRentElectScope = document.getElementById("buildRentElectScope");
    var sendBuildTask = document.getElementById("sendBuildTask");
    buildTaskRoomsScope.setAttribute('hidden', 'true');
    buildTaskRoomsNumScope.setAttribute('hidden', 'true');
    buildRentdateScope.setAttribute('hidden', 'true');
    buildRentCostScope.setAttribute('hidden', 'true');
    buildRentmonthScope.setAttribute('hidden', 'true');
    sendBuildTask.setAttribute('hidden', 'true');
    buildRentElectScope.setAttribute('hidden', 'true');

    switch (taskRentIndex) {
        case 1:
            sendBuildTask.removeAttribute('hidden');
            buildTaskRoomsScope.removeAttribute("hidden");
            buildTaskRoomsNumScope.removeAttribute("hidden");
            buildRentdateScope.removeAttribute('hidden');
            buildRentCostScope.removeAttribute('hidden');
            document.getElementById('sendBuildTask').addEventListener('click', upLoadRentData, false);
            break;
        case 2:
            sendBuildTask.removeAttribute('hidden');
            buildTaskRoomsScope.removeAttribute("hidden");
            buildTaskRoomsNumScope.removeAttribute("hidden");
            buildRentmonthScope.removeAttribute("hidden");
            buildRentElectScope.removeAttribute("hidden");
            buildRentCostScope.removeAttribute('hidden');
            document.getElementById('sendBuildTask').addEventListener('click', upLoadEleData, false);
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
    }

    // var numOfRoom = parseInt(houseRoomNum[taskRoomIndex - 1]);
    // for (var i = 0; i < numOfRoom; i++) {
    //     var newElement = document.createElement("option");
    //     newElement.innerHTML = roomId[i];
    //     taskRooms.appendChild(newElement);
    // }

}


//set users data
function setTasksData() {
    firebase.database().ref('buildtasks/').orderByChild('date').on('value', function(snapshot) {
        var taskIngData = document.getElementById("taskIngData");
        var taskFinishData = document.getElementById("taskFinishData");
        taskIngData.innerHTML = "";
        taskFinishData.innerHTML = "";
        snapshot.forEach(function(childSnapshot) {

            var id = (childSnapshot.val() && childSnapshot.val().id);
            var name = (childSnapshot.val() && childSnapshot.val().name) || '未命名';
            var room = (childSnapshot.val() && childSnapshot.val().room) || 'None';
            var person = (childSnapshot.val() && childSnapshot.val().person) || 'visitor';
            var dealPerson = (childSnapshot.val() && childSnapshot.val().userName) || 'None';
            var dealmethod = (childSnapshot.val() && childSnapshot.val().dealmethod) || 'None';
            var dealresult = (childSnapshot.val() && childSnapshot.val().dealresult) || 'None';
            var notes = (childSnapshot.val() && childSnapshot.val().notes) || 'None';
            var money = (childSnapshot.val() && childSnapshot.val().money) || 'None';
            var phone = (childSnapshot.val() && childSnapshot.val().phone) || 'None';
            var model = (childSnapshot.val() && childSnapshot.val().model) || '型號';
            var category = (childSnapshot.val() && childSnapshot.val().category) || 'None';
            var status = (childSnapshot.val() && childSnapshot.val().status) || '已指派';
            var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '2020/01/01';
            var date = (childSnapshot.val() && childSnapshot.val().date) || '2020/01/01';
            var html =
                '<td>' + status + '</td>' +
                '<td>' + formatTime(new Date(date)) + '</td>' +
                '<td>' + room + '</td>' +
                '<td>' + name + '</td>' +
                '<td>' + person + '</td>' +
                '<td>' + formatTime(new Date(finishdate)) + '</td>' +
                '<td>' + dealmethod + '</td>' +
                '<td>' + dealPerson + '</td>' +
                '<td>' + dealresult + '</td>' +
                '<td>' + notes + '</td>' +
                '<td>' + money + '</td>' +
                '<td>' + phone + '</td>' +
                '<td>' + category + '</td>' +
                '<td>' + model + '</td>';
            // ...
            var newElement = document.createElement("tr");

            if (status == "已完成") {
                newElement.setAttribute('class', "table-secondary");
                // html += '<td>' + formatTime(new Date(finishdate)) + '</td>';
                newElement.innerHTML = html;
                taskFinishData.insertBefore(newElement, taskFinishData.firstChild);
            } else {
                if (status == "請檢查") {
                    newElement.setAttribute('class', "table-success");
                }
                newElement.setAttribute('id', id + "table");
                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">確認完成</button></td>';

                newElement.innerHTML = html;
                taskIngData.insertBefore(newElement, taskIngData.firstChild);
                document.getElementById(id).addEventListener('click', function() { setTaskFinish(id, id + "table") }, false);
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
//get house data
function uploadTaskData() {
    var taskName = document.getElementById('buildTaskName').value;

    var taskPersonIndex = document.getElementById('buildTaskPerson').selectedIndex;
    var taskPerson = document.getElementById('buildTaskPerson').value;

    var taskRoomIndex = document.getElementById('buildTaskRooms').selectedIndex;
    var taskRoom = document.getElementById('buildTaskRooms').value;
    var taskRoomNumIndex = document.getElementById('buildTaskRoomsNum').selectedIndex;
    var taskRoomNum = document.getElementById('buildTaskRoomsNum').value;


    var taskStatusIndex = document.getElementById('buildTaskStatus').selectedIndex;
    var taskStatus = document.getElementById('buildTaskStatus').value;

    var taskDate = document.getElementById('buildTaskdate').value;
    var newRef = firebase.database().ref('buildtasks/').push();

    var taskPersonId = usersId[taskPersonIndex - 1];
    var taskPersonEmail = usersEmail[taskPersonIndex - 1];

    var storageName = sessionStorage.getItem('userName');

    console.log(taskPersonId);
    console.log(taskPersonEmail);
    taskNameFocusOut();
    taskStatusFocusOut();
    taskRoomFocusOut();
    taskPersonFocusOut();
    taskDateFocusOut();
    if (taskName.length < 1 || taskRoom.length < 1 || taskStatus.length < 1 || taskPerson.length < 1 || taskDate.length < 1) {
        return;
    }
    $('#uploadModal').modal();
    newRef.set({
        id: newRef.key,
        userId: taskPersonId,
        userEmail: taskPersonEmail,
        userName: taskPerson,
        name: taskName,
        room: taskRoom + taskRoomNum,
        person: storageName,
        date: formatMS(taskDate),
        dealmethod: "",
        dealresult: "",
        notes: "",
        money: "",
        phone: "",
        category: "",
        model: "",
        finishDate: "",
        status: taskStatus
    }).then(function() {
        // hide uploading alert
        $("#uploadModal .close").click();
        // show success alert
        $('#dataUploadModal').modal();
        document.getElementById('buildTaskName').value = "";
        document.getElementById('buildTaskPerson').value = "";
        document.getElementById('buildTaskRooms').value = "";
        document.getElementById('buildTaskStatus').value = "";
        document.getElementById('buildTaskdate').value = "";



    }).catch(function(error) {
        console.error('Error writing user data to database', error);
    });
}

// if position is not admin, back to main.html
function checkUserPosition() {
    var userId = getUserUid();
    var position = '';
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        console.log(position);
        if (position != "管理員" && position != "房務") {
            window.location.href = './main.html';
            return;
        }
    });
}



//get one house data
function setUsersData() {
    firebase.database().ref('users/').once('value', function(snapshot) {
        var taskPerson = document.getElementById("buildTaskPerson");
        snapshot.forEach(function(childSnapshot) {
            var id = (childSnapshot.val() && childSnapshot.val().id);
            var name = (childSnapshot.val() && childSnapshot.val().name) || '訪客';
            var email = (childSnapshot.val() && childSnapshot.val().email);
            var newElement = document.createElement("option");
            newElement.innerHTML = name;
            usersId.push(id);
            usersEmail.push(email);
            taskPerson.appendChild(newElement);
        });
    });
}
//get all house data
function setHousesData() {
    firebase.database().ref('houses/').once('value', function(snapshot) {
        var taskRooms = document.getElementById("buildTaskRooms");
        snapshot.forEach(function(childSnapshot) {
            var name = (childSnapshot.val() && childSnapshot.val().name) || '訪客';
            var amount = (childSnapshot.val() && childSnapshot.val().amount);
            var newElement = document.createElement("option");
            newElement.innerHTML = name;
            houseRoomNum.push(amount);
            taskRooms.appendChild(newElement);
        });
    });
}
//if select one house change the num of rooms
function changeRoomNum() {
    var roomId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
    var taskRooms = document.getElementById("buildTaskRoomsNum");
    var taskRoomIndex = document.getElementById('buildTaskRooms').selectedIndex;
    var numOfRoom = parseInt(houseRoomNum[taskRoomIndex - 1]);
    for (var i = 0; i < numOfRoom; i++) {
        var newElement = document.createElement("option");
        newElement.innerHTML = roomId[i];
        taskRooms.appendChild(newElement);
    }

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
        firebase.database().ref('position/' + getUserUid()).once('value').then(function(snapshot) {
            if (snapshot.exists()) {
                let userposition = snapshot.val();
                sessionStorage.setItem('userposition', userposition)
            } else {
                let userposition = '訪客'
                sessionStorage.setItem('userposition', userposition)
            }
        });
        return;
    }

    displayname.textContent = storageName;
    displayphoto.src = storagePhoto;
}

//yyyy-mm-dd
function formatTime(date) {
    let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return formatted_date;
}

function formatMS(date) {
    var d = new Date(date);
    console.log(d);
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
            setTasksData();
            setUsersData();
            setUserData();
            setHousesData();
        } else {
            window.location.href = './login.html';
        }

        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('sendBuildTask').addEventListener('click', uploadTaskData, false);
    document.getElementById('logout').addEventListener('click', logout, false);
    document.getElementById('buildTaskRooms').addEventListener('change', changeRoomNum, false);
}

window.onload = function() {
    initApp();
};