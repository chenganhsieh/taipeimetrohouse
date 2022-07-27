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

/**
 * Handles the out focus element.
 */
function taskNameFocusOut() {
    var name = document.getElementById('taskName').value;
    var nameWrong = document.getElementById('taskNameWrong');
    if (name.length < 1) {
        nameWrong.removeAttribute("hidden");
    } else {
        nameWrong.setAttribute('hidden', 'true');
    }
}

function taskContentFocusOut() {
    var taskContent = document.getElementById('taskContent').value;
    var taskContentWrong = document.getElementById('taskContentWrong');
    if (taskContent.length < 2) {
        taskContentWrong.removeAttribute("hidden");
    } else {
        taskContentWrong.setAttribute('hidden', 'true');
    }
}

function taskPersonFocusOut() {
    var taskPerson = document.getElementById('taskPerson').value;
    var taskPersonWrong = document.getElementById('taskPersonWrong');
    if (taskPerson.length < 1) {
        taskPersonWrong.removeAttribute("hidden");
    } else {
        taskPersonWrong.setAttribute('hidden', 'true');
    }
}

function taskDateFocusOut() {
    var taskdate = document.getElementById('taskdate').value;
    var taskdatesWrong = document.getElementById('taskdateWrong');
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


//set users data
function setTasksData() {
    firebase.database().ref('other_tasks/').orderByChild('date').on('value', function(snapshot) {
        var taskIngData = document.getElementById("taskIngData");
        var taskFinishData = document.getElementById("taskFinishData");
        $('#task_table').DataTable().destroy(); //會讓data 重新出來?! innerHTML必須後來在清空
        $('#other_finish_table').DataTable().destroy(); //會讓data 重新出來?! innerHTML必須後來在清空
        taskIngData.innerHTML = "";
        taskFinishData.innerHTML = "";
        var temp_amount = 0
        var data_amount = snapshot.numChildren();
        var now_time = new Date().getTime()

        snapshot.forEach(function(childSnapshot) {
            temp_amount += 1
            var id = (childSnapshot.val() && childSnapshot.val().id);
            var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '無';
            var name = (childSnapshot.val() && childSnapshot.val().name) || '無';
            var content = (childSnapshot.val() && childSnapshot.val().content) || '無';

            var person = (childSnapshot.val() && childSnapshot.val().userName) || '無';
            // deal person data
            var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '無';
            var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '無';
            var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '無';
            var dead_date = (childSnapshot.val() && childSnapshot.val().dead_date) || '無';
            var date = (childSnapshot.val() && childSnapshot.val().date) || '無';
            var status = (childSnapshot.val() && childSnapshot.val().status) || '無';
            if (now_time > dead_date && status != "請檢查" && status != "已處理") {
                status = "已逾時"
            }
            var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '無';
            var money = (childSnapshot.val() && childSnapshot.val().money) || '無';
            var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate);
            var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
            var html =
                '<td>' + taskType + '</td>' +
                '<td>' + status + '</td>' +
                '<td>' + name + '</td>' +
                '<td>' + deal_person + '</td>' +
                '<td>' + formatTime(new Date(dead_date)) + '</td>';
            // ...
            var newElement = document.createElement("tr");

            if (status == "已處理") {
                newElement.setAttribute('class', "table-secondary");
                html += '<td>' + formatTime(new Date(finishdate)) + '</td>';
                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';
                newElement.innerHTML = html;
                taskFinishData.insertBefore(newElement, taskFinishData.firstChild);
                document.getElementById(id).addEventListener('click', function() { setTaskContent(id, "其他", status, name, person, date, dead_date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device) }, false);
            } else {
                if (status == "請檢查") {
                    newElement.setAttribute('class', "table-success");
                }

                if (now_time > dead_date) {
                    newElement.setAttribute('class', "table-danger");
                }
                newElement.setAttribute('id', id + "table");
                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';

                newElement.innerHTML = html;
                taskIngData.insertBefore(newElement, taskIngData.firstChild);
                document.getElementById(id).addEventListener('click', function() { setTaskContent(id, "其他", status, name, person, date, dead_date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device) }, false);
            }

        });
        if (data_amount == temp_amount) {
            var table = $('#task_table').DataTable();
            var table = $('#other_finish_table').DataTable();
        }

    });


}

function setTaskContent(id, taskType, status, title_name, person, date, task_dead_date, content, deal_person, deal_method, deal_result, deal_notes, deal_money, finishdate) {
    document.getElementById("task_name").innerHTML = "<b>" + title_name + "</b>  " + taskType;
    // task status
    task_status = document.getElementById("task_status")
    task_status.innerHTML = status
    $('#task_status').off('click')

    // don't edit data
    document.getElementById("task_date").innerHTML = formatTime(new Date(date), false)
    document.getElementById("task_title").innerHTML = title_name
    document.getElementById("task_person").innerHTML = person
    document.getElementById("task_content").innerHTML = content;
    document.getElementById("task_deal_person").innerHTML = deal_person;
    document.getElementById("task_dead_date").innerHTML = formatTime(new Date(task_dead_date), false);

    // task finish date
    task_deal_date = document.getElementById("task_deal_date")
    task_deal_date.innerHTML = formatTime(new Date(finishdate), false)
    $('#task_deal_date').off('click')

    //task deal method
    task_deal_method = document.getElementById("task_deal_method")
    task_deal_method.innerHTML = deal_method
    $('#task_deal_method').off('click')

    //task deal result
    task_deal_result = document.getElementById("task_deal_result")
    task_deal_result.innerHTML = deal_result
    $('#task_deal_result').off('click')

    //task deal fee
    task_deal_fee = document.getElementById("task_deal_fee");
    task_deal_fee.innerHTML = deal_money
    $('#task_deal_fee').off('click')

    //task notes
    task_deal_note = document.getElementById("task_deal_note");
    task_deal_note.innerHTML = deal_notes
    $('#task_deal_note').off('click')

    //fix event
    if (status != "已處理") {
        task_status.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_date.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_method.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_result.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_fee.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_note.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        fix_data_byId(id, 'task_status', "狀態", "select", "custom-select d-block w-100", status);
        fix_data_byId(id, 'task_deal_date', "日期", "input", "form-control", finishdate);
        fix_data_byId(id, 'task_deal_method', "處理方法", "textarea", "form-control", deal_method);
        fix_data_byId(id, 'task_deal_result', '處理結果', 'textarea', 'form-control', deal_result);
        fix_data_byId(id, 'task_deal_fee', "費用", "input", "form-control", deal_money);
        fix_data_byId(id, 'task_deal_note', "備註", "input", "form-control", deal_notes);
    }

    $('#build_task_detail_modal').modal();
    document.getElementById("fix_modal_cancel").addEventListener('click', function() {
        $("#fix_data_modal").modal('hide');
        $('#build_task_detail_modal').modal('show');
    })

}

function fix_data_byId(FB_task_id, Ele_id, header, Cre_Ele_type, Cre_Ele_class, org_value) {
    $('#' + Ele_id).click(function() {
        $("#build_task_detail_modal").modal('hide');
        document.getElementById("fix_modal_label").innerHTML = "填寫" + header
        var modal = document.getElementById("fix_modal_div")
        if (modal.childElementCount == 3) {
            modal.removeChild(modal.childNodes[2]);
        }
        var newElement = document.createElement(Cre_Ele_type);
        newElement.setAttribute('id', "fix_modal_data");
        newElement.setAttribute('class', Cre_Ele_class);
        if (Cre_Ele_type == "textarea") {
            newElement.setAttribute('rows', "4");
            newElement.setAttribute('cols', "50");
        }
        if (header == "處理人員") {
            newElement.innerHTML = '<option value="" >選擇...</option>' +
                '<option value="" >不指定</option>' +
                '</select>';
        }
        if (header == "日期") {
            newElement.setAttribute('type', "date");
            if (org_value != "未知") {
                org_value = formatTime(new Date(org_value))
                newElement.setAttribute('value', org_value, false);
            } else {
                newElement.setAttribute('value', "");
            }
        }
        if (header == "費用") {
            newElement.setAttribute('type', "number");
        }
        if (header == "備註") {
            newElement.setAttribute('type', "text");
        }
        if (header == "狀態") {
            newElement.innerHTML = '<option value="" >選擇...</option>' +
                '<option value="待處理">待處理</option>' +
                '<option value="處理中">處理中</option>' +
                '<option value="請檢查">請檢查</option>' +
                '<option value="已處理">已處理</option>' +
                '</select>';
        }

        if (org_value != "未知" && header != "日期") {
            newElement.value = org_value;
        }
        modal.insertBefore(newElement, modal.childNodes[2]);
        if (header == "處理人員") {
            setUsersData("fix_modal_data");
        }
        $("#fix_modal_check").off('click').click(function() {
            var fix_data = document.getElementById('fix_modal_data').value;
            var updates_data = {}
            if (header == "處理結果") {
                updates_data['deal_result'] = fix_data
            }
            if (header == "處理方法") {
                updates_data['deal_method'] = fix_data
            }
            if (header == "處理人員") {
                var fix_finish_deal_person_index = document.getElementById('fix_modal_data').selectedIndex;
                var fix_finish_deal_person = document.getElementById('fix_modal_data').value;
                if (taskPerson != "不指定") {
                    var taskPersonId = usersId[fix_finish_deal_person_index - 2];
                    var taskPersonEmail = usersEmail[fix_finish_deal_person_index - 2];
                } else {
                    var taskPersonId = "none"
                }
                updates_data['deal_person'] = fix_finish_deal_person
                updates_data['deal_userId'] = taskPersonId
                updates_data['deal_userEmail'] = taskPersonEmail
            }
            if (header == "日期") {
                updates_data['finishDate'] = formatMS(fix_data)
                fix_data = formatTime(new Date(fix_data), false)
            }
            if (header == "狀態") {
                updates_data['status'] = fix_data
            }
            if (header == "費用") {
                updates_data['deal_fee'] = fix_data
            }
            if (header == "備註") {
                updates_data['deal_notes'] = fix_data
            }
            firebase.database().ref('other_tasks/' + FB_task_id).update(updates_data).then(function() {
                org_value = fix_data
                    // $("#fix_data_modal .close").click();
                $("#fix_data_modal").modal('hide');
                document.getElementById(Ele_id).innerHTML = org_value + "<i class='fas fa-edit ml-2'></i>"
                $("#build_task_detail_modal").modal('show');
                // $('#build_task_detail_modal').modal();

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
        })
        $('#fix_data_modal').modal();

    });
}

//get house data
function setTaskFinish(id, deleteElement) {
    firebase.database().ref('tasks/' + id).update({
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
    var taskName = document.getElementById('taskName').value;
    var taskContent = document.getElementById('taskContent').value;
    var taskPersonIndex = document.getElementById('taskPerson').selectedIndex;
    var taskPerson = document.getElementById('taskPerson').value;
    var taskDate = document.getElementById('taskdate').value;
    var newRef = firebase.database().ref('other_tasks/').push();

    var taskPersonId = usersId[taskPersonIndex - 1];
    var taskPersonEmail = usersEmail[taskPersonIndex - 1];
    var current_user = sessionStorage.getItem('userName');

    taskNameFocusOut();
    taskContentFocusOut();
    taskPersonFocusOut();
    taskDateFocusOut();
    if (taskName.length < 1 || taskContent.length < 1 || taskPerson.length < 1 || taskDate.length < 1) {
        return;
    }
    $('#uploadModal').modal();
    var now_time = new Date().getTime()
    newRef.set({
        id: newRef.key,
        taskType: "其他",
        userName: current_user,
        name: taskName,
        deal_userId: taskPersonId,
        deal_userEmail: taskPersonEmail,
        deal_person: taskPerson,
        content: taskContent,
        date: now_time,
        dead_date: formatMS(taskDate),
        finishDate: "",
        status: "待處理"
    }).then(function() {
        // hide uploading alert
        $("#uploadModal .close").click();
        // show success alert
        $('#dataUploadModal').modal();
        document.getElementById('taskName').value = "";
        document.getElementById('taskContent').value = "";
        document.getElementById('taskPerson').value = "";
        document.getElementById('taskdate').value = "";



    }).catch(function(error) {
        console.error('Error writing user data to database', error);
    });
}

function switch_task(element) {
    var task_deck = document.getElementById("task_deck")
    var undone_deck = document.getElementById("undone_deck")
    var done_deck = document.getElementById("done_deck")
    if (element.id == "undone_task") {
        undone_deck.removeAttribute("hidden")
        task_deck.setAttribute("hidden", true)
        done_deck.setAttribute("hidden", true)
    } else if (element.id == "finish_task") {
        done_deck.removeAttribute("hidden")
        undone_deck.setAttribute("hidden", true)
        task_deck.setAttribute("hidden", true)
    } else {
        task_deck.removeAttribute("hidden")
        undone_deck.setAttribute("hidden", true)
        done_deck.setAttribute("hidden", true)
    }
}

// if position is not admin, back to main.html
function checkUserPosition() {
    var userId = getUserUid();
    var position = '';
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        var to_do = '<a class="nav-link" href="tasks.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">待辦事項</span></a>';
        var info = '<a class="nav-link" href="infohouse.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">即時資訊</span></a>';
        var fix = '<a class="nav-link" href="fixhouse.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">工務管理</span></a>';
        var clean = ' <a class="nav-link" href="cleanhouse.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">房務管理</span></a>';
        var add_house = '<a class="nav-link" href="newhouse.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">新增房型</span></a>';
        var account = '<a class="nav-link" href="accountmanage.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">帳戶管理</span></a>';
        var task = '<a class="nav-link" href="task.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">指派任務</span></a>';
        var rent = '<a class="nav-link" href="rent_calendar.html">' +
            '<i class="fas fa-fw fa-tachometer-alt"></i>' +
            '<span style="text-align: center">租金管理</span></a>';

        console.log(position)
        if (position == "管理員") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + fix + clean + add_house + account + task + rent
        } else
        if (position == "工務") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + fix + task
        } else if (position == "房務") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + clean
        } else if (position == "會計") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + fix + clean + add_house + account + task + rent
        } else {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info
        }
    });
}



//get one house data
function setUsersData() {
    firebase.database().ref('users/').once('value', function(snapshot) {
        var taskPerson = document.getElementById("taskPerson");
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

//get user profile
function setUserData() {
    //session storage file
    var storageName = sessionStorage.getItem('userName');
    var storagePhoto = sessionStorage.getItem('userPhoto');
    var position = sessionStorage.getItem('position');
    //html element
    var displayname = document.getElementById("displayname");
    var displayphoto = document.getElementById("displayImage");

    if (!storageName || !storagePhoto) {
        firebase.database().ref('users/' + getUserUid()).once('value').then(function(snapshot) {
            var username = (snapshot.val() && snapshot.val().name) || '訪客';
            var userphoto = (snapshot.val() && snapshot.val().profilePicUrl);
            var position = (snapshot.val() && snapshot.val().position);
            sessionStorage.setItem('userName', username);
            sessionStorage.setItem('userPhoto', userphoto);
            sessionStorage.setItem('position', position);
            displayname.textContent = username;
            displayphoto.src = userphoto;
        });
    } else {
        displayname.textContent = storageName;
        displayphoto.src = storagePhoto;
    }
    if (position != "管理員" && position != "會計" && position != "工務") {
        alert("您無權查看!")
        window.location.href = './index.html';
        return;
    }
}

//yyyy-mm-dd
function formatTime(date) {
    let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
            setUserData();
            checkUserPosition();
            setTasksData();
            setUsersData();
        } else {
            window.location.href = './login.html';
        }

        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('sendTask').addEventListener('click', uploadTaskData, false);
    document.getElementById('logout').addEventListener('click', logout, false);
}

window.onload = function() {
    initApp();
};