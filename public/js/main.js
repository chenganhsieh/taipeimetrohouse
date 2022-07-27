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


function logout() {
    if (firebase.auth().currentUser) {
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("userPhoto");
        sessionStorage.removeItem("position");
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
}

function getUserUid() {
    return firebase.auth().currentUser.uid;
}

function getUserPosition() {
    return firebase.database().ref('/users/' + getUserUid()).once('value').then(function(snapshot) {
        let position = (snapshot.val().position) || '訪客';
        return position
    });
}



function addEventElement(title, content, time, id, status) {
    var time = formatTime(new Date(time));
    var html =
        '<a href="#collapse' + id + '" class="d-block card-header py-3" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapse' + id + '">' +
        '<h6 class="m-0 font-weight-bold text-primary">' + title;
    if (status == "已完成") {
        html += '<i class="fas fa-check btn-success btn-circle ml-2"></i>'
    }
    html = html +
        '</h6>' +
        '</a>' +
        '<div class="collapse show" id="collapse' + id + '">' +
        '<div class="card-body">' +
        '<div class="row">' +
        '<div class="col-12">' +
        content +
        '</div>';
    if (status != "已完成") {
        html +=
            '<div class="col-12 text-center mt-3">'
        if (status == "請檢查") {
            html +=
                '<a id="check' + id + '" class="btn btn-danger btn-icon-split">';
        } else {
            html +=
                '<a id="check' + id + '" class="btn btn-success btn-icon-split">';
        }
        html +=
            '<span class="icon text-white-50">' +
            '<i class="fas fa-check"></i>' +
            '</span>';
        if (status == "請檢查") {
            html += '<span class="text text-white-50">等候主管確認</span>'
        } else {
            html += '<span class="text text-white-50" id="checkinfo' + id + '">任務完成請點選</span>'
        }
        html += '</a></div>'
    }
    html +=
        '</div></div>' +
        '<div class="card-footer text-muted">';
    if (status == '已完成') {
        html += '<div class="mr-2">完成時間:</div><div>' +
            time + '</div></div></div>';
    } else {
        html += '<div class="mr-2">到期時間:</div><div>' +
            time + '</div></div></div>';
    }
    // Adds an element to the document
    var p = document.getElementById("eventRow");
    var newElement = document.createElement("div");
    newElement.setAttribute('class', "card shadow mb-4 col-12");
    newElement.innerHTML = html;
    p.insertBefore(newElement, p.firstChild);
    if (status == "已指派") {
        document.getElementById('check' + id).addEventListener('click', function() { setEventCheck(id) }, false);

    }

}

function setEventCheck(eventId) {
    var infobutton = document.getElementById("checkinfo" + eventId);
    var infobuttonColor = document.getElementById("check" + eventId);
    infobutton.innerHTML = "回報中請稍候...";
    firebase.database().ref('tasks/' + eventId).update({
        status: '請檢查',
    }).then(function() {
        infobutton.innerHTML = "等候主管確認";
        infobuttonColor.classList.remove("btn-success");
        infobuttonColor.setAttribute('class', 'btn-danger btn btn-icon-split');
    }).catch(function(error) {
        alert(error);
        infobutton.innerHTML = "任務完成請點選";
    });

}



//set house element
// function addElement(imageURL, name, amount, time, id, roomId) {
//     var time = formatTime(new Date(time));
//     var html =
//         '<div class="card border-left-success shadow h-100 py-2">' +
//         '<div class="hovereffect" runat="server">' +
//         '<img class="card-img-top" src="' + imageURL + '" alt="Card image cap">' +
//         '<div class="overlay" id="' + id + '">' +
//         '<p class="mt-5">查看詳情</p>' +
//         '</div></div>' +
//         '<div class="card-body">' +
//         '<div class="row no-gutters align-items-center">' +
//         '<div class="col mr-2">' +
//         '<div class="text-lg font-weight-bold text-primary text-uppercase mb-1">' + name + '</div>' +
//         '<div class="h6 mb-0 font-weight-bold text-gray-800">間數: ' + amount + '</div>';
//     for (var i = 0; i < roomId.length; i++) {
//         html +=
//             '<div class="row">' +
//             '<div class="col-8 mt-2 mb-0 text-center"><button class="btn btn-primary btn-block" type="button" id="' + roomId[i] + '">' + (i + 1) + '號房間</button></div>' +
//             '<button class="col-4 mt-2 fas fa-hammer fa-1.5x text-white-50 btn-primary" id=build' + roomId[i] + '></button>' +
//             '</div>';
//         if (i == roomId.length - 1) {
//             html += '<div class="h6 mb-0 text-gray-600 mt-2">更新時間: </div>' +
//                 '<div class="h6 mb-0 text-gray-600 mt-2">' + time + '</div>' +
//                 '</div>' +
//                 '</div></div></div>'
//         }
//     }


//     // Adds an element to the document
//     var p = document.getElementById("houseRow");
//     var newElement = document.createElement("div");
//     newElement.setAttribute('class', "col-xl-3 col-md-6 mb-4");
//     newElement.innerHTML = html;
//     p.appendChild(newElement);
//     document.getElementById(id).addEventListener('click', function() { setOneHouseData(id) }, false);
//     for (var i = 0; i < roomId.length; i++) {
//         (function(i) {
//             var tempId = roomId[i];
//             document.getElementById(roomId[i]).addEventListener('click', function() { setRoomsData(tempId) }, false);

//         })(i)

//     }
// }

//set room Element
function addRoomElement(month, date, elecMeter, elecMoney, money, houseId, monthKey) {
    var html =
        '<td>' + month + '月</td>' +
        '<td>' + date + '</td>' +
        '<td>' + money + '</td>' +
        '<td><button class="btn btn-primary" type="button" id="money' + month + '">登記</button></td>';
    var p = document.getElementById("roomModalMoney");
    var newElement = document.createElement("tr");
    newElement.innerHTML = html;
    p.appendChild(newElement);
    document.getElementById("money" + month).addEventListener('click', function() { setRentDetailData(houseId, monthKey, "money") }, false);


    var html =
        '<td>' + month + '月</td>' +
        '<td>' + elecMeter + '</td>' +
        '<td>' + elecMoney + '</td>' +
        '<td><button class="btn btn-primary" type="button" id="ele' + month + '">登記</button></td>';
    var p = document.getElementById("roomModalElecMoney");
    var newElement = document.createElement("tr");
    newElement.innerHTML = html;
    p.appendChild(newElement);
    document.getElementById("ele" + month).addEventListener('click', function() { setRentDetailData(houseId, monthKey, "electric") }, false);
}
//set rent data
function setRentDetailData(roomId, monthId, mode) {
    if (mode == "money") {
        // $("#roomModal .close").click();
        $("#roomModal").modal('hide');
        $('#setRentDetailModal').modal();
        var giveRentMoneyData = document.getElementById("giveRentMoneyData");
        giveRentMoneyData.addEventListener('click', function() {
            var fixMoneyDate = document.getElementById("giveRentDate").value;
            var fixMoneyData = document.getElementById("giveRentMoney").value;

            fixMoneyDataFocusOut();
            fixMoneyDateFocusOut();
            if (fixMoneyDate.length < 1 || fixMoneyData.length < 1) {
                return;
            }
            //show uploading bar
            document.getElementById("setRentDetailModalUploading").hidden = false;

            firebase.database().ref('rooms/' + roomId + '/rentHis' + '/' + monthId).update({
                date: fixMoneyDate,
                money: fixMoneyData,
            }).then(function() {
                // // hide uploading alert
                // document.getElementById("setRentDetailModalUploading").hidden = true;
                // // show success alert
                // document.getElementById("setRentDetailModalSuccess").hidden = false;
                // setTimeout(function() {
                //     document.getElementById("setRentDetailModalSuccess").hidden = true;
                //     $("#setRentDetailModal .close").click();
                //     $("#roomModal").modal();
                // }, 2000);
            }).catch(function(error) {
                console.error('Error writing image data to database', error);
                alert(error);
            });

        });
    }
    if (mode == "electric") {
        $("#roomModal .close").click();
        $('#setRentElecModal').modal();
        var eleAmountData = document.getElementById("eleAmountData");
        eleAmountData.addEventListener('click', function() {
            var fixEleAmount = document.getElementById("eleAmount").value;
            var fixElemoney = document.getElementById("eleMoney").value;
            if (fixEleAmount.length < 1 || fixElemoney.length < 1) {
                return;
            }
            //show uploading bar
            $("#setRentElecModal .close").click();
            $('#uploadModal').modal();
            firebase.database().ref('rooms/' + id + '/rentHis' + '/' + monthId).update({
                elecMeter: fixEleAmount,
                elecMoney: fixElemoney,
            }).then(function() {
                // hide uploading alert
                $("#uploadModal .close").click();
                // show success alert
                $('#dataUploadModal').modal();

            }).catch(function(error) {
                console.error('Error writing image data to database', error);
                alert(error);
            });

        });

    }
    return;
}
//get event data
function setEventData() {
    var ref = firebase.database().ref('tasks/').orderByChild('userId').equalTo(getUserUid()).limitToLast(3);
    var dataAmount = 0; //use to check whether data loading is finished or not 
    ref.once('value', function(snapshot) {
        console.log(snapshot.numChildren())
        snapshot.forEach(function(childSnapshot) {
            dataAmount += 1;
            var title = childSnapshot.val().name;
            var content = childSnapshot.val().content;
            var date = childSnapshot.val().date;
            var finishDate = childSnapshot.val().finishDate;
            var id = childSnapshot.val().id;
            var status = childSnapshot.val().status
                // hide no new task info
            if (status == "已指派" || status == "請檢查") {
                var newTaskInfo = document.getElementById('eventNewOrNot');
                newTaskInfo.hidden = true;

            }
            if (status == "已完成") {
                addEventElement(title, content, finishDate, id, status);
            } else {
                addEventElement(title, content, date, id, status);
            }
        });
        if (dataAmount == snapshot.numChildren()) { //close loading bar and show the result
            $('#exampleModalLabel').text("上傳中請稍候...");
            $("#uploadModal .close").click();
        }
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

    if (!storageName || !storagePhoto || !position) {
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
}
//get user profile
function setRentData(id) {
    $("#roomModal .close").click();
    $('#setRentModal').modal();
    var fixRentData = document.getElementById("fixRentData");

    fixRentData.addEventListener('click', function() {
        var name = document.getElementById('name').value;
        var phone = document.getElementById('phone').value;
        var rent = document.getElementById('rent').value;
        var deposit = document.getElementById('deposit').value;
        var rentDate = document.getElementById('rentDate').value;
        nameFocusOut();
        phoneFocusOut();
        rentFocusOut();
        depositFocusOut();
        rentDateFocusOut();
        if (name.length < 1 || phone.length < 10 || rent.length < 1 || deposit.length < 1 ||
            rentDate.length < 1) {
            return;
        }
        //show uploading bar
        document.getElementById("setRentModalUploading").hidden = false;
        console.log()
        firebase.database().ref('rooms/' + id).update({
            name: name,
            phone: phone,
            rentMoney: rent,
            deposit: deposit,
            rentDate: rentDate
        }).then(function() {
            // hide uploading alert
            document.getElementById("setRentModalUploading").hidden = true;
            // show success alert
            document.getElementById("setRentModalSuccess").hidden = false;

        }).catch(function(error) {
            console.error('Error writing image data to database', error);
            alert(error);
        });
    }, false);

}

function formatTime(date, need_hhmm = true) {
    if (need_hhmm == true) {
        var formatted_date = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2) + " " + ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
    } else {
        var formatted_date = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2)
    }
    return formatted_date;
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

// 避免bootstrap的滾軸不見
$(document).on('hidden.bs.modal', '.modal', function() {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});
//set users data
function setTasksData() {
    let res = getUserPosition()
    var now_time = new Date().getTime()
    res.then(data => {
        var user_status = data
        if (user_status == "房務" || user_status == "工務" || user_status == "管理員" || user_status == "會計") {
            switch (user_status) {
                case "房務":
                    task_name = "clean_tasks"
                    document.getElementById("task_header").innerHTML =
                        '<th>種類</th>' +
                        '<th>處理狀態</th>' +
                        '<th>建立日期</th>' +
                        '<th>名稱</th>' +
                        '<th>處理人員</th>' +
                        '<th>確認完成</th>';
                    break;
                case "工務":
                    task_name = "fix_tasks"
                    document.getElementById("task_header").innerHTML =
                        '<th>種類</th>' +
                        '<th>處理狀態</th>' +
                        '<th>建立日期</th>' +
                        '<th>名稱</th>' +
                        '<th>處理人員</th>' +
                        '<th>查看詳情</th>';
                    break;
                case "管理員":
                    task_name = "admin_tasks"
                    document.getElementById("task_header").innerHTML =
                        '<th>種類</th>' +
                        '<th>處理狀態</th>' +
                        '<th>建立日期</th>' +
                        '<th>名稱</th>' +
                        '<th>處理人員</th>' +
                        '<th>查看詳情</th>';
                    break;
                case "會計":
                    task_name = "admin_tasks"
                    document.getElementById("task_header").innerHTML =
                        '<th>種類</th>' +
                        '<th>處理狀態</th>' +
                        '<th>建立日期</th>' +
                        '<th>名稱</th>' +
                        '<th>處理人員</th>' +
                        '<th>查看詳情</th>';
                    break;
            }
            firebase.database().ref(task_name).orderByChild('deal_userId').equalTo(getUserUid()).on('value', function(snapshot) {
                firebase.database().ref("other_tasks").orderByChild('deal_userId').equalTo(getUserUid()).on('value', function(snapshot1) {
                    var task_data = document.getElementById("task_data");

                    var data_amount = snapshot.numChildren() + snapshot1.numChildren();
                    var temp_amount = 0
                    $('#task_table').DataTable().destroy(); //會讓data 重新出來?! innerHTML必須後來在清空
                    task_data.innerHTML = "";


                    // table.clear()
                    snapshot.forEach(function(childSnapshot) {
                        temp_amount += 1;
                        // upload person data
                        var id = (childSnapshot.val() && childSnapshot.val().id);
                        var status = (childSnapshot.val() && childSnapshot.val().status) || '未處理';
                        var room_name = (childSnapshot.val() && childSnapshot.val().name) || '未知';
                        var person = (childSnapshot.val() && childSnapshot.val().userName) || '未知';
                        var date = (childSnapshot.val() && childSnapshot.val().date) || '未知';

                        var content = (childSnapshot.val() && childSnapshot.val().content) || '未填寫';
                        // deal person data
                        var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '未知';
                        var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '未知';
                        var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '未知';
                        var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '未知';
                        var money = (childSnapshot.val() && childSnapshot.val().deal_fee) || '未知';
                        var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '未知';
                        var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
                        var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '未知';

                        if (task_name == "clean_tasks") {
                            var html =
                                '<td>' + taskType + '</td>' +
                                '<td>' + status + '</td>' +
                                '<td>' + formatTime(new Date(date), false) + '</td>' +
                                '<td>' + room_name + '</td>' +
                                '<td>' + deal_person + '</td>';
                        } else if (task_name == "fix_tasks" || task_name == "admin_tasks") {
                            var html =
                                '<td>' + taskType + '</td>' +
                                '<td>' + status + '</td>' +
                                '<td>' + formatTime(new Date(date), false) + '</td>' +
                                '<td>' + room_name + '</td>' +
                                '<td>' + deal_person + '</td>';
                        }
                        var newElement = document.createElement("tr");

                        if (status == "請檢查") {
                            newElement.setAttribute('class', "table-success");
                        }
                        if (status == "已處理") {
                            newElement.setAttribute('class', "table-secondary");
                        }
                        newElement.setAttribute('id', id + "table");
                        if (task_name == "fix_tasks" || task_name == "admin_tasks") {
                            html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';
                        } else if (task_name == "clean_tasks") {
                            if (status == "待處理") {
                                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">開始處理</button></td>';
                            }
                            if (status == "處理中") {
                                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">完成點選</button></td>';
                            }
                            if (status == "請檢查") {
                                html += '<td><p style="font-size:1em;"  id="' + id + '">等待檢查中</p></td>';
                            }
                            if (status == "已處理") {
                                html += '<td><p style="font-size:1em;"  id="' + id + '">已完成</p></td>';
                            }
                        }

                        newElement.innerHTML = html;
                        task_data.insertBefore(newElement, task_data.firstChild);
                        if (task_name == "fix_tasks" || task_name == "admin_tasks") {
                            document.getElementById(id).addEventListener('click', function() {
                                setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device)
                            }, false);
                        } else if (task_name == "clean_tasks" && status != "請檢查" && status != "已處理") {
                            updates_data = {}
                            if (status == "待處理") {
                                updates_data["status"] = "處理中"

                            }
                            if (status == "處理中") {
                                updates_data["status"] = "請檢查"

                            }
                            document.getElementById(id).addEventListener('click', function() {
                                firebase.database().ref('clean_tasks/' + id).update(updates_data).then(function() {
                                        if (updates_data["status"] == "請檢查") {
                                            let send_link = "https://us-central1-taipeimetrohouse.cloudfunctions.net/sendFinishCleanMail?house=" +
                                                room_name + '&finishdate=' + formatTime(new Date(), false)
                                            $.ajax({
                                                url: send_link,
                                                type: 'GET',
                                                fail: function(xhr, textStatus, errorThrown) {
                                                    alert('未寄送email，網路錯誤');
                                                }
                                            });

                                        }
                                    })
                                    .catch(function(error) {
                                        alert("Data could not be saved." + error);
                                    });
                            }, false);
                        }
                    });

                    snapshot1.forEach(function(childSnapshot) {
                        temp_amount += 1;
                        // upload person data
                        var id = (childSnapshot.val() && childSnapshot.val().id);
                        var status = (childSnapshot.val() && childSnapshot.val().status) || '待處理';
                        var title_name = (childSnapshot.val() && childSnapshot.val().name) || '無';
                        var person = (childSnapshot.val() && childSnapshot.val().userName) || '無';
                        var date = (childSnapshot.val() && childSnapshot.val().date) || '無';

                        var content = (childSnapshot.val() && childSnapshot.val().content) || '無';
                        // deal person data
                        var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '無';
                        var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '無';
                        var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '無';
                        var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '無';
                        var money = (childSnapshot.val() && childSnapshot.val().deal_fee) || '無';
                        var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '無';
                        var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
                        var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '無';
                        var dead_date = (childSnapshot.val() && childSnapshot.val().dead_date) || '無';
                        if (content.length > 6) {
                            var html_content = content.substr(0, 5) + "...";
                        } else {
                            var html_content = content
                        }
                        if (now_time > dead_date && status != "請檢查" && status != "已處理") {
                            status = "已逾時"
                        }

                        var html =
                            '<td>' + taskType + '</td>' +
                            '<td>' + status + '</td>' +
                            '<td>' + formatTime(new Date(date), false) + '</td>' +
                            '<td>' + title_name + '</td>' +
                            '<td>' + deal_person + '</td>';

                        var newElement = document.createElement("tr");

                        if (status == "請檢查") {
                            newElement.setAttribute('class', "table-success");
                        }
                        if (status == "已處理") {
                            newElement.setAttribute('class', "table-secondary");
                        }
                        if (now_time > dead_date && status != "已處理") {
                            newElement.setAttribute('class', "table-danger");
                        }
                        newElement.setAttribute('id', id + "table");

                        html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';


                        newElement.innerHTML = html;
                        task_data.insertBefore(newElement, task_data.firstChild);

                        document.getElementById(id).addEventListener('click', function() {
                            setTaskContent(id, taskType, status, title_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device, dead_date)
                        }, false);
                    });
                    console.log(temp_amount)
                    console.log(data_amount)
                    if (temp_amount == data_amount) { //close loading bar and show the result
                        var table = $('#task_table').DataTable({
                            "order": [
                                [1, "desc"]
                            ]
                        });
                        $('#exampleModalLabel').text("上傳中請稍候...");
                        $("#uploadModal .close").click();
                    }

                });

            });
        }
        if (user_status == "管理員") {
            document.getElementById("admin_task_div").removeAttribute("hidden")
            firebase.database().ref("fix_tasks").orderByChild('status').equalTo("請檢查").on('value', function(snapshot) {
                firebase.database().ref("clean_tasks").orderByChild('status').equalTo("請檢查").on('value', function(snapshot1) {
                    firebase.database().ref("admin_tasks").orderByChild('status').equalTo("請檢查").on('value', function(snapshot2) {
                        firebase.database().ref("other_tasks").orderByChild('status').equalTo("請檢查").on('value', function(snapshot3) {
                            var admin_task_data = document.getElementById("admin_task_data");

                            var data_amount = snapshot.numChildren() + snapshot1.numChildren() + snapshot2.numChildren() + snapshot3.numChildren();
                            console.log(data_amount)
                            var temp_amount = 0
                            $('#admin_task_table').DataTable().destroy(); //會讓data 重新出來?! innerHTML必須後來在清空
                            admin_task_data.innerHTML = "";


                            // // table.clear()
                            snapshot.forEach(function(childSnapshot) {
                                temp_amount += 1;
                                console.log(temp_amount);
                                // upload person data
                                var id = (childSnapshot.val() && childSnapshot.val().id);
                                var status = (childSnapshot.val() && childSnapshot.val().status) || '未處理';
                                var room_name = (childSnapshot.val() && childSnapshot.val().name) || '未知';
                                var person = (childSnapshot.val() && childSnapshot.val().userName) || '未知';
                                var date = (childSnapshot.val() && childSnapshot.val().date) || '未知';
                                var content = (childSnapshot.val() && childSnapshot.val().content) || '無';
                                // deal person data
                                var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '未知';
                                var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '未知';
                                var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '未知';
                                var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '未知';
                                var money = (childSnapshot.val() && childSnapshot.val().deal_fee) || '未知';
                                var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '未知';
                                var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
                                var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '未知';

                                var html =
                                    '<td>' + taskType + '</td>' +
                                    '<td>' + status + '</td>' +
                                    '<td>' + formatTime(new Date(date), false) + '</td>' +
                                    '<td>' + room_name + '</td>' +
                                    '<td>' + person + '</td>' +
                                    '<td>' + deal_person + '</td>' +
                                    '<td>' + content + '</td>';

                                var newElement = document.createElement("tr");
                                newElement.setAttribute('class', "table-success");
                                newElement.setAttribute('id', id + "table");
                                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>'
                                newElement.innerHTML = html;
                                admin_task_data.insertBefore(newElement, admin_task_data.firstChild);
                                document.getElementById(id).addEventListener('click', function() {
                                    setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device)
                                }, false);
                            });

                            snapshot1.forEach(function(childSnapshot) {
                                temp_amount += 1;
                                console.log(temp_amount);
                                // upload person data
                                var id = (childSnapshot.val() && childSnapshot.val().id);
                                var status = (childSnapshot.val() && childSnapshot.val().status) || '未處理';
                                var room_name = (childSnapshot.val() && childSnapshot.val().name) || '未知';
                                var person = (childSnapshot.val() && childSnapshot.val().userName) || '未知';
                                var date = (childSnapshot.val() && childSnapshot.val().date) || '未知';
                                var content = (childSnapshot.val() && childSnapshot.val().content) || '無';
                                // deal person data
                                var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '未知';
                                var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '未知';
                                var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '未知';
                                var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '未知';
                                var money = (childSnapshot.val() && childSnapshot.val().deal_fee) || '未知';
                                var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '未知';
                                var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
                                var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '未知';



                                var html =
                                    '<td>' + taskType + '</td>' +
                                    '<td>' + status + '</td>' +
                                    '<td>' + formatTime(new Date(date), false) + '</td>' +
                                    '<td>' + room_name + '</td>' +
                                    '<td>' + person + '</td>' +
                                    '<td>' + deal_person + '</td>' +
                                    '<td>' + content + '</td>';

                                var newElement = document.createElement("tr");

                                newElement.setAttribute('class', "table-success");

                                newElement.setAttribute('id', id + "table");

                                html += '<td><button class="btn btn-primary" type="button" id="' + id + '_admin">確認完成</button></td>';


                                newElement.innerHTML = html;
                                admin_task_data.insertBefore(newElement, admin_task_data.firstChild);
                                var updates_data = {}
                                updates_data["status"] = "已處理"
                                document.getElementById(id + "_admin").addEventListener('click', function() {
                                    firebase.database().ref('clean_tasks/' + id).update(updates_data)
                                        .catch(function(error) {
                                            alert("Data could not be saved." + error);
                                        });
                                }, false);
                            });
                            snapshot2.forEach(function(childSnapshot) {
                                temp_amount += 1;
                                console.log(temp_amount);
                                // upload person data
                                var id = (childSnapshot.val() && childSnapshot.val().id);
                                var status = (childSnapshot.val() && childSnapshot.val().status) || '未處理';
                                var room_name = (childSnapshot.val() && childSnapshot.val().name) || '未知';
                                var person = (childSnapshot.val() && childSnapshot.val().userName) || '未知';
                                var date = (childSnapshot.val() && childSnapshot.val().date) || '未知';
                                var content = (childSnapshot.val() && childSnapshot.val().content) || '無';
                                // deal person data
                                var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '未知';
                                var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '未知';
                                var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '未知';
                                var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '未知';
                                var money = (childSnapshot.val() && childSnapshot.val().deal_fee) || '未知';
                                var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '未知';
                                var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
                                var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '未知';

                                var html =
                                    '<td>' + taskType + '</td>' +
                                    '<td>' + status + '</td>' +
                                    '<td>' + formatTime(new Date(date), false) + '</td>' +
                                    '<td>' + room_name + '</td>' +
                                    '<td>' + person + '</td>' +
                                    '<td>' + deal_person + '</td>' +
                                    '<td>' + content + '</td>';

                                var newElement = document.createElement("tr");
                                newElement.setAttribute('class', "table-success");
                                newElement.setAttribute('id', id + "table");
                                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>'
                                newElement.innerHTML = html;
                                admin_task_data.insertBefore(newElement, admin_task_data.firstChild);
                                document.getElementById(id).addEventListener('click', function() {
                                    setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device)
                                }, false);
                            });
                            snapshot3.forEach(function(childSnapshot) {
                                temp_amount += 1;
                                // upload person data
                                var id = (childSnapshot.val() && childSnapshot.val().id);
                                var status = (childSnapshot.val() && childSnapshot.val().status) || '待處理';
                                var title_name = (childSnapshot.val() && childSnapshot.val().name) || '無';
                                var person = (childSnapshot.val() && childSnapshot.val().userName) || '無';
                                var date = (childSnapshot.val() && childSnapshot.val().date) || '無';

                                var content = (childSnapshot.val() && childSnapshot.val().content) || '無';
                                // deal person data
                                var deal_person = (childSnapshot.val() && childSnapshot.val().deal_person) || '無';
                                var deal_method = (childSnapshot.val() && childSnapshot.val().deal_method) || '無';
                                var deal_result = (childSnapshot.val() && childSnapshot.val().deal_result) || '無';
                                var notes = (childSnapshot.val() && childSnapshot.val().deal_notes) || '無';
                                var money = (childSnapshot.val() && childSnapshot.val().deal_fee) || '無';
                                var taskType = (childSnapshot.val() && childSnapshot.val().taskType) || '無';
                                var device = (childSnapshot.val() && childSnapshot.val().device) || '無';
                                var finishdate = (childSnapshot.val() && childSnapshot.val().finishDate) || '無';
                                var dead_date = (childSnapshot.val() && childSnapshot.val().dead_date) || '無';
                                if (now_time > dead_date && status != "請檢查" && status != "已處理") {
                                    status = "已逾時"
                                }
                                if (content.length > 6) {
                                    var html_content = content.substr(0, 5) + "...";
                                } else {
                                    var html_content = content
                                }
                                if (now_time > dead_date && status != "請檢查" && status != "已處理") {
                                    status = "已逾時"
                                }
                                var html =
                                    '<td>' + taskType + '</td>' +
                                    '<td>' + status + '</td>' +
                                    '<td>' + formatTime(new Date(date), false) + '</td>' +
                                    '<td>' + title_name + '</td>' +
                                    '<td>' + person + '</td>' +
                                    '<td>' + deal_person + '</td>' +
                                    '<td>' + html_content + '</td>';

                                var newElement = document.createElement("tr");

                                if (status == "請檢查") {
                                    newElement.setAttribute('class', "table-success");
                                }
                                if (status == "已處理") {
                                    newElement.setAttribute('class', "table-secondary");
                                }
                                if (now_time > dead_date && status != "已處理") {
                                    newElement.setAttribute('class', "table-danger");
                                }
                                newElement.setAttribute('id', id + "table");

                                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';


                                newElement.innerHTML = html;
                                admin_task_data.insertBefore(newElement, admin_task_data.firstChild);

                                document.getElementById(id).addEventListener('click', function() {
                                    setTaskContent(id, taskType, status, title_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device, dead_date)
                                }, false);
                            });



                            if (temp_amount == data_amount) { //close loading bar and show the result
                                var table = $('#task_table').DataTable();
                                $('#exampleModalLabel').text("上傳中請稍候...");
                                $("#uploadModal .close").click();
                            }

                        });
                    });
                });

            });
        }
    })

}



function setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, deal_notes, deal_money, finishdate, device = "無", dead_date = "無") {
    console.log(status)
    document.getElementById("task_name").innerHTML = "<b>" + room_name + "</b>  " + taskType;
    // task status
    task_status = document.getElementById("task_status")
    task_status.innerHTML = status
    $('#task_status').off('click')

    // don't edit data
    document.getElementById("task_date").innerHTML = formatTime(new Date(date), false)
    document.getElementById("task_room").innerHTML = room_name
    document.getElementById("task_person").innerHTML = person
    document.getElementById("task_content").innerHTML = content;
    if (taskType == "其他" && dead_date != "無") {
        document.getElementById("dead_date_hr").removeAttribute("hidden")
        document.getElementById("dead_date_div").removeAttribute("hidden")
        document.getElementById("task_dead_date").innerHTML = formatTime(new Date(dead_date), false)
    }
    if (device != "無") {
        document.getElementById("task_device_div").removeAttribute("hidden")
        document.getElementById("task_device_name").innerHTML = device
    }
    // task finish date
    task_deal_date = document.getElementById("task_deal_date")
    task_deal_date.innerHTML = formatTime(new Date(finishdate), false)
    $('#task_deal_date').off('click')

    //task deal person
    task_deal_person = document.getElementById("task_deal_person")
    task_deal_person.innerHTML = deal_person
    $('#task_deal_person').off('click')


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
        task_status.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        task_deal_date.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        if (taskType != "其他") {
            task_deal_person.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        }
        task_deal_method.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        task_deal_result.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        task_deal_fee.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        task_deal_note.innerHTML += "<i class='fas fa-angle-right ml-2'></i>"
        fix_data_byId(id, 'task_status', "狀態", "select", "custom-select d-block w-100", status, taskType);
        fix_data_byId(id, 'task_deal_date', "日期", "input", "form-control", finishdate, taskType);
        if (taskType != "其他") {
            fix_data_byId(id, 'task_deal_person', "處理人員", "select", "custom-select d-block w-100", deal_method, taskType);
        }
        fix_data_byId(id, 'task_deal_method', "處理方法", "textarea", "form-control", deal_method, taskType);
        fix_data_byId(id, 'task_deal_result', '處理結果', 'textarea', 'form-control', deal_result, taskType);
        fix_data_byId(id, 'task_deal_fee', "費用", "input", "form-control", deal_money, taskType);
        fix_data_byId(id, 'task_deal_note', "備註", "input", "form-control", deal_notes, taskType);
    }

    $('#build_task_detail_modal').modal();
    document.getElementById("fix_modal_cancel").addEventListener('click', function() {
        $("#fix_data_modal").modal('hide');
        $('#build_task_detail_modal').modal('show');
    })

}

function fix_data_byId(FB_task_id, Ele_id, header, Cre_Ele_type, Cre_Ele_class, org_value, task_type) {

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
                '<option value="請檢查">請檢查</option>';
            // +
            // '<option value="已處理">已處理</option>' +
            // '</select>';
            firebase.database().ref('/users/' + getUserUid() + '/position').once('value').then(function(snapshot) {
                position = (snapshot.val()) || 'Anonymous';
                if (position == "管理員") {
                    newElement.innerHTML += '<option value="已處理">已處理</option>';
                }
            });
            newElement.innerHTML += '</select>'
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
            if (task_type == "修繕") {
                ref_head = "fix_tasks/"
            } else if (task_type == "其他") {
                ref_head = "other_tasks/"
            }
            console.log(ref_head + FB_task_id)
            console.log(updates_data)
            firebase.database().ref(ref_head + FB_task_id).update(updates_data).then(function() {
                org_value = fix_data
                    // $("#fix_data_modal .close").click();
                $("#fix_data_modal").modal('hide');
                document.getElementById(Ele_id).innerHTML = org_value + "<i class='fas fa-angle-right ml-2'></i>"
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
    // $('#exampleModalLabel').html("載入中...請稍後");
    // $('#uploadModal').modal();
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (user) {

            setUserData();
            // setHouseData();
            // setEventData();
            setTasksData();
            checkUserPosition();

        } else {
            window.location.href = './login.html';
        }

        // [END_EXCLUDE]
    });
    // [END authstatelistener]


    document.getElementById('logout').addEventListener('click', logout, false);
}

window.onload = function() {
    initApp();
};