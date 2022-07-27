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

var houseRoomNum = [];
var housesId = [];
var houseName = [];
var roomsId = [];
var room_number_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function sendInvite() {
    $("#sendmail_modal").modal();
    $("#send_invite_cancel").off("click").click(function() {
        $("#sendmail_modal .close").click();
    })
    $("#send_invite_check").off("click").click(function() {
        console.log("good")
        var email = document.getElementById("email_data").value
        console.log(email)
        if (email.indexOf("@") == -1 || email.length < 4) {
            document.getElementById("sendEmailWrong").removeAttribute("hidden")
        } else {
            $("#send_invite_check").off("click");
            document.getElementById("send_invite_check").innerHTML = "寄送中...";
            let send_link = "https://us-central1-taipeimetrohouse.cloudfunctions.net/sendInviteMail?dest=" + email
            if (email != "None") {
                $.ajax({
                    url: send_link,
                    type: 'GET',
                    timeout: 5000,
                    success: function() {
                        document.getElementById("send_invite_check").innerHTML = "寄送完成";
                        document.getElementById('email_data').value = "";
                    },
                    fail: function(xhr, textStatus, errorThrown) {
                        alert('未知錯誤，未寄送郵件');
                        document.getElementById("send_invite_check").innerHTML = "寄送邀請";
                        $("#sendmail_modal .close").click();
                        document.getElementById('email_data').value = "";
                    },
                    error: function(request, status, error) {
                        alert("網路或資料庫錯誤，未寄送郵件。請聯絡工程師");
                        document.getElementById("send_invite_check").innerHTML = "寄送邀請";
                        $("#sendmail_modal .close").click();
                        document.getElementById('email_data').value = "";
                    }
                });
            }
        }
    })




    //     let send_link = "https://us-central1-taipeimetrohouse.cloudfunctions.net/sendInviteMail?dest=" + taskPersonEmail
    //     if (taskPersonEmail != "None") {
    //         $.ajax({
    //             url: send_link,
    //             type: 'GET',
    //             success: function() {
    //                 // hide uploading alert
    //                 $("#uploadModal .close").click();
    //                 // show success alert
    //                 $('#dataUploadModal').modal();
    //                 document.getElementById('buildTaskPerson').value = "";
    //                 document.getElementById('buildTaskdate').value = "";
    //                 document.getElementById("buildCleanNote").value = "";
    //             },
    //             fail: function(xhr, textStatus, errorThrown) {
    //                 alert('網路錯誤');
    //             }
    //         });
    //     } else {
    //         // hide uploading alert
    //         $("#uploadModal .close").click();
    //         // show success alert
    //         $('#dataUploadModal').modal();
    //         document.getElementById('buildTaskPerson').value = "";
    //         document.getElementById('buildTaskdate').value = "";
    //         document.getElementById("buildCleanNote").value = "";
    //     }
    // }).catch(function(error) {
    //     console.error('Error writing user data to database', error);
    // });


}



//set users data
function setUsersData() {
    let res = getUserPosition();
    res.then(data => {
        var user_status = data
        firebase.database().ref('users').on('value', function(snapshot) {
            var datatable = document.getElementById("usersData")
            $('#dataTable').DataTable().destroy();
            datatable.innerHTML = ""
            var users_amount = snapshot.numChildren()
            var temp_amount = 0
            var houses_ids = []

            snapshot.forEach(function(childSnapshot) {
                temp_amount += 1
                var id = (childSnapshot.val() && childSnapshot.val().id);
                var username = (childSnapshot.val() && childSnapshot.val().name) || '訪客';
                var email = (childSnapshot.val() && childSnapshot.val().email) || '無';
                var position = (childSnapshot.val() && childSnapshot.val().position) || '訪客';
                var housevalue = (childSnapshot.val() && childSnapshot.val().housevalue) || '不限制';
                var roomvalue = (childSnapshot.val() && childSnapshot.val().roomvalue) || '';
                var specificId = email.split("@")[0]
                var html =
                    '<td>' + username;
                if (user_status == "管理員") {
                    html += '<i class="fas fa-edit ml-2" id="fixname_' + id + '"></i>'
                }
                html +=
                    '</td>' +
                    '<td>' + email + '</td>' +
                    '<td><select class="custom-select d-block" id="' + specificId + '" required>' +
                    '<option value="' + position + '" selected  disabled hidden>' + position + '</option>' +
                    '<option>管理員</option>' +
                    '<option>會計</option>' +
                    '<option>房務</option>' +
                    '<option>工務</option>' +
                    '<option>訪客</option>' +
                    '</select></td>' +

                    '<td><select class="custom-select d-block" id="buildTaskRooms_' + specificId + '" required>' +
                    '<option value="' + housevalue + '" selected>' + housevalue + '</option>' +
                    '</select></td>' +

                    '<td><select class="custom-select d-block" id="buildTaskRoomsNum_' + specificId + '" required>' +
                    '<option value="' + roomvalue + '" selected>' + roomvalue + '</option>' +
                    '</select></td>' +

                    '<td><button class="btn btn-primary" type="button" id="' + specificId + 'button">確認修改</button></td>';
                // ...
                var p = document.getElementById("usersData");
                var newElement = document.createElement("tr");
                newElement.innerHTML = html;
                p.appendChild(newElement);
                document.getElementById(specificId + 'button').addEventListener('click', function() { saveUserPosition(id, specificId) }, false);
                houses_ids.push('buildTaskRooms_' + specificId)
                if (temp_amount == users_amount) {
                    $('#dataTable').DataTable()
                    setHousesData(houses_ids)
                }
                document.getElementById('buildTaskRooms_' + specificId).addEventListener('change', function() { changeRoomNum('buildTaskRooms_' + specificId, 'buildTaskRoomsNum_' + specificId) }, false);
                $('#fixname_' + id).off('click').click(function() {
                    var newElement = document.createElement('input');
                    var modal = document.getElementById("fix_modal_div")
                    if (modal.childElementCount == 3) {
                        modal.removeChild(modal.childNodes[2]);
                    }
                    document.getElementById("fix_modal_label").innerHTML = "修改姓名"
                    newElement.setAttribute('id', "fix_modal_data");
                    newElement.setAttribute('class', 'form-control');
                    newElement.setAttribute('type', "text");
                    newElement.value = username;
                    modal.insertBefore(newElement, modal.childNodes[2]);

                    $("#fix_modal_check").off('click').click(function() {
                        var fix_data = document.getElementById('fix_modal_data').value;
                        var updates_data = {}
                        updates_data['name'] = fix_data
                        updates_data['edit_person'] = getUserName()
                        updates_data['timestamp'] = firebase.database.ServerValue.TIMESTAMP
                            //one for now rent data and another for history
                        firebase.database().ref('users/' + id).update(updates_data).then(function() {
                            $("#fix_data_modal .close").click();
                        }).catch(function(error) {
                            alert(error);
                        });
                    })
                    $("#fix_modal_cancel").off('click').click(function() {
                        $("#fix_data_modal .close").click();
                    })
                    $("#fix_data_modal").modal();

                });
            })
        });
    });
}





//Save house information
function saveUserPosition(userId, selectorId) {
    //show uploading bar
    $('#uploadModal').modal();

    var positionvalue = document.getElementById(selectorId).value;
    var housevalue = document.getElementById("buildTaskRooms_" + selectorId).value || "不限制";
    var roomvalue = document.getElementById("buildTaskRoomsNum_" + selectorId).value || "不限制";
    if (roomvalue[1] == "房") {
        roomvalue = roomvalue[0]
    }


    firebase.database().ref('users/' + userId).update({
            position: positionvalue,
            housevalue: housevalue,
            roomvalue: roomvalue,
            edit_person: getUserName()
        })
        .then(function(snapshot) {
            $("#uploadModal .close").click();
            // show success alert
            $('#dataUploadModal').modal();
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


function getUserUid() {
    return firebase.auth().currentUser.uid;
}

function getUserName() {
    if (sessionStorage.getItem('userName') != null && sessionStorage.getItem('userName') != "") {
        return sessionStorage.getItem('userName');
    }
    return firebase.auth().currentUser.displayName;

}
// console.log(getUserPosition())
function getUserPosition() {
    return firebase.database().ref('/users/' + getUserUid()).once('value').then(function(snapshot) {
        let position = (snapshot.val().position) || '訪客';
        return position
    });
}
// if position is not admin, back to main.html
function checkUserPosition() {
    var userId = getUserUid();
    var position = '';
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        if (position != "管理員") {
            window.location.href = './main.html';
            return;
        }
    });
}
//change room num
function changeRoomNum(htmlhouseid, roomId) {
    roomsId = []
    var taskRooms = document.getElementById(roomId);
    var taskhouseIndex = document.getElementById(htmlhouseid).selectedIndex;
    taskRooms.innerHTML = ""
    var numOfRoom = parseInt(houseRoomNum[taskhouseIndex - 1]);

    var houseId = housesId[taskhouseIndex - 1];
    var newElement = document.createElement("option");
    newElement.innerHTML = "不限制";
    taskRooms.appendChild(newElement);
    firebase.database().ref('houses/' + houseId).once('value', function(snapshot) {
        roomsId = snapshot.val().rooms
    }).then(function() {
        for (var i = 0; i < numOfRoom; i++) {
            var newElement = document.createElement("option");
            newElement.innerHTML = room_number_list[i] + "房";
            taskRooms.appendChild(newElement);
        }
    });
}
//get all house data
function setHousesData(houseids) {
    console.log(houseids)
    firebase.database().ref('houses/').once('value', function(snapshot) {
        var count = 0
        for (let temp = 0; temp < houseids.length; temp++) {
            count += 1
            let id = houseids[temp]
            let buildTaskRooms2 = document.getElementById(id);
            let first_option = document.createElement("option");
            first_option.innerHTML = "不限制"
            buildTaskRooms2.appendChild(first_option);
            if (count == 1) {
                houseRoomNum.push(0);
                housesId.push("none");
                houseName.push(name);
            }
            snapshot.forEach(function(childSnapshot) {
                var name = (childSnapshot.val() && childSnapshot.val().name);
                var amount = (childSnapshot.val() && childSnapshot.val().amount);
                var houseId = (childSnapshot.val() && childSnapshot.val().id);
                var newElement4 = document.createElement("option");
                newElement4.innerHTML = name;
                buildTaskRooms2.appendChild(newElement4);
                if (count == 1) {
                    houseRoomNum.push(amount);
                    housesId.push(houseId);
                    houseName.push(name);
                }
            });
        }
    });
}
// set user profile
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
            var userposition = (snapshot.val() && snapshot.val().position) || '訪客';
            sessionStorage.setItem('userName', username);
            sessionStorage.setItem('userPhoto', userphoto);
            sessionStorage.setItem('userposition', userposition)
            displayname.textContent = username;
            displayphoto.src = userphoto;
        });
        return;
    }

    displayname.textContent = storageName;
    displayphoto.src = storagePhoto;
}

//logout
function logout() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
}


function initApp() {
    document.getElementById('logout').addEventListener('click', logout, false);
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (!user) {
            window.location.href = './login.html';
            return;
        }
        setUserData();
        checkUserPosition();
        setUsersData();
        //console.log(getUserPosition())

    });
}


window.onload = function() {
    initApp();
};