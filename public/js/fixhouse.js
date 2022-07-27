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
//----------------------------------------------------Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//---------------------------------------------------messaging
var messaging = null;
let room_number_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then((registration) => {
        messaging.useServiceWorker(registration);
    });
// 啟動　Firebase Messaging
messaging = firebase.messaging();
messaging.usePublicVapidKey("BIPCMKwinazsKt4MwUKjqIIc4Dk7-eAKmqIiosjwjoLUX42YI785ZVWPScNY4XkJRCeTtH3ARJl-P3PviTekkH8");
messaging.getToken().then((currentToken) => {
    if (currentToken) {

    }
});
// 收到訊息時的處理(前景)
messaging.onMessage(function(payload) {

    console.log('onMessage run');

    // 網頁本身
    $('#MessageZone').append("Message received :" + JSON.stringify(payload) + "<br><br>")

    //如果可以顯示通知就做顯示通知
    if (Notification.permission === 'granted') {
        notifyMe(payload);
    }
});
// 視窗提示訊息
function notifyMe(payload) {

    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        show_win(payload);
    } else if (Notification.permission !== 'denied' || Notification.permission === "default") {
        // 再次請求授權
        Notification.requestPermission(function(permission) {
            if (permission === "granted") {
                show_win(payload);
            };
        });
    };
};
// 視窗訊息
function show_win(payload) {

    console.log('onMessage: ', payload);
    var notifyMsg = payload.data;
    var notification = new Notification(notifyMsg.title, {
        body: notifyMsg.body,
        icon: notifyMsg.icon
    });

    notification.onclick = function(e) { // 綁定點擊事件
        e.preventDefault(); // prevent the browser from focusing the Notification's tab
        window.open(notifyMsg.click_action);
    }
}

if ((Notification.permission !== "granted" && Notification.permission !== 'denied') || Notification.permission === "default") {
    // 允許請求
    messaging.requestPermission()
        .then(function() {
            // 獲得允許
            console.log('Notification permission granted.');
            messaging.getToken() // 取得Token
                .then(function(currentToken) {

                    //紀錄token
                    sendTokenToServer(currentToken)
                })
                .catch(function(err) {
                    alert('Unable to get permission to send message 1');
                });
        })
        .catch(function(err) {
            alert('Unable to get permission to send message 2');
        });
}
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        sendTokenToServer(refreshedToken);
    }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
    });
});
// 紀錄Token
function sendTokenToServer(currentToken) {

    firebase.database().ref('users/' + getUserUid()).update({
        message_token: currentToken,
    }).catch(function(error) {
        console.error('Error writing message token to database', error);
        alert(error);
    });
}

//----------------------------------------------------save selected users data
var usersId = [];
var usersEmail = [];
var userStatus = [];
var houseRoomNum = [];
var houseRoomId = []



//----------------------------------------------------check input data 
function taskStatusFocusOut() {
    var taskContent = document.getElementById('buildTaskStatus').value;
    console.log(taskContent)

    var taskContentWrong = document.getElementById('buildTaskStatusWrong');
    if (taskContent.length < 1) {
        taskContentWrong.removeAttribute("hidden");
    } else {
        taskContentWrong.setAttribute('hidden', 'true');
    }
}

function taskContentFocusOut() {
    var taskContent = document.getElementById('buildTaskContent').value;
    var taskContentWrong = document.getElementById('buildTaskContentWrong');
    if (taskContent.length < 2) {
        taskContentWrong.removeAttribute("hidden");
    } else {
        taskContentWrong.setAttribute('hidden', 'true');
    }
}

function taskPersonFocusOut() {
    var taskPerson = document.getElementById('buildTaskPerson').value;
    console.log(taskPerson)
    console.log(taskPerson.length)
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






// ---------------------------------------------------logout
function logout() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
}

function getUserUid() {
    return firebase.auth().currentUser.uid;
}

/**
 * Handles the out focus element.
 */
function nameFocusOut() {
    var name = document.getElementById('name').value;
    var nameWrong = document.getElementById('nameWrong');
    if (name.length < 1) {
        nameWrong.removeAttribute("hidden");
    } else {
        nameWrong.setAttribute('hidden', 'true');
    }
}

function phoneFocusOut() {
    var phone = document.getElementById('phone').value;
    var phoneWrong = document.getElementById('phoneWrong');
    if (phone.length < 1) {
        phoneWrong.removeAttribute("hidden");
    } else {
        phoneWrong.setAttribute('hidden', 'true');
    }
}

function rentFocusOut() {
    var rent = document.getElementById('rent').value;
    var rentWrong = document.getElementById('rentWrong');
    if (rent.length < 1) {
        rentWrong.removeAttribute("hidden");
    } else {
        rentWrong.setAttribute('hidden', 'true');
    }
}

function depositFocusOut() {
    var deposit = document.getElementById('deposit').value;
    var depositWrong = document.getElementById('depositWrong');
    if (deposit.length < 1) {
        depositWrong.removeAttribute("hidden");
    } else {
        depositWrong.setAttribute('hidden', 'true');
    }
}

function rentDateFocusOut() {
    var rentDate = document.getElementById('rentDate').value;
    var rentDateWrong = document.getElementById('rentDateWrong');
    if (rentDate.length < 1) {
        rentDateWrong.removeAttribute("hidden");
    } else {
        rentDateWrong.setAttribute('hidden', 'true');
    }
}

function fixMoneyDataFocusOut() {
    var rentDate = document.getElementById('giveRentDate').value;
    var rentDateWrong = document.getElementById('giveRentDateWrong');
    if (rentDate.length < 1) {
        rentDateWrong.removeAttribute("hidden");
    } else {
        rentDateWrong.setAttribute('hidden', 'true');
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

function fixMoneyDateFocusOut() {
    var rentDate = document.getElementById('giveRentMoney').value;
    var rentDateWrong = document.getElementById('giveRentMoneyWrong');
    if (rentDate.length < 1) {
        rentDateWrong.removeAttribute("hidden");
    } else {
        rentDateWrong.setAttribute('hidden', 'true');
    }

}

//set house element
function addElement(imageURL, name, amount, time, id, roomId) {
    var time = formatTime(new Date(time), true);
    var html = '<div class="card h-100 ">' +
        '<div class="img_container">' +
        '<div id="' + id + "_carousel" + '" class=" carousel slide" data-ride="carousel">' +
        ' <div class="carousel-inner">';

    for (var img_amount = 0; img_amount < imageURL.length; img_amount++) {
        if (img_amount == 0) {
            html += '<div class="carousel-item active">';
        } else {
            html += '<div class="carousel-item">';
        }
        html +=
            '<img class="card-img-top img-fluid" src="' + imageURL[img_amount] + '" alt="house img">' +
            '</div>'
    }
    html += '</div>' +
        '<a class="carousel-control-prev" href="#' + id + "_carousel" + '" role="button" data-slide="prev">' +
        '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="carousel-control-next" href="#' + id + "_carousel" + '" role="button" data-slide="next">' +
        '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
        '<span class="sr-only">Next</span>' +
        '</a>' +
        '</div>' +
        '</div>';
    html +=
        // '<div class="card h-100 ">' +
        // '<div class="img_container">' +
        // '<img class="card-img-top img-fluid image_hov" src="' + imageURL + '" alt="房間圖片" >' +
        // '<div class="middle">' +
        // '<div class="text" >查看詳情</div>' +
        // ' </div>' +
        // '</div>' +

        '<div class="card-body">' +
        '<button class="card-title font-weight-bold text-primary btn" id="' + id + '">' + name + "-詳情" + '</button>' +
        '<h6 class="card-subtitle mt-1 text-gray-800">間數: ' + amount + '</h6>';
    for (var i = 0; i < roomId.length; i++) {
        html +=
            '<div class="row">' +
            '<div class="col-8 mt-2 mb-0 text-center"><button class="btn btn-primary btn-block" type="button" id=device' + roomId[i] + '>' + room_number_list[i] + '房設備</button></div>' +
            '<button class="col-4 mt-2 btn-primary btn btn-block" id=build' + roomId[i] + '>修繕</button>' +
            '</div>';
        if (i == roomId.length - 1) {
            html += '<div class="h6 mb-0 text-gray-600 mt-2">更新時間: </div>' +
                '<div class="h6 mb-0 text-gray-600 mt-2">' + time + '</div>' +
                '</div>' +
                '</div></div></div>'
        }
    }


    // Adds an element to the document
    var p = document.getElementById("house_deck");
    var newElement = document.createElement("div");
    newElement.setAttribute('class', "col-sm-6 col-lg-3 py-2");
    newElement.innerHTML = html;
    p.appendChild(newElement);
    document.getElementById(id).addEventListener('click', function() { setOneHouseData(id) }, false);
    for (var i = 0; i < roomId.length; i++) {
        (function(i) {
            var tempId = roomId[i];
            document.getElementById("device" + roomId[i]).addEventListener('click', function() { setRoomsDeviceData(name, room_number_list[i], tempId) }, false);
            document.getElementById("build" + roomId[i]).addEventListener('click', function() { uploadTaskData(name, room_number_list[i], tempId, "修繕") }, false);
        })(i)

    }
}

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

//get house data
function setHouseData() {
    var ref = firebase.database().ref('houses/');
    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var name = childSnapshot.val().name;
            var time = childSnapshot.val().timestamp;
            var amount = childSnapshot.val().amount;
            var image = childSnapshot.val().imageURL;
            var childKey = childSnapshot.key;
            var roomId = childSnapshot.val().rooms;
            addElement(image, name, amount, time, childKey, roomId);

        });
    });
}
//get all house data
function setSelectHouseData() {
    firebase.database().ref('houses/').once('value', function(snapshot) {
        var taskRooms = document.getElementById("buildTaskRooms");
        snapshot.forEach(function(childSnapshot) {
            var name = (childSnapshot.val() && childSnapshot.val().name) || '房源';
            var id = (childSnapshot.val() && childSnapshot.val().id) || 'id';
            var amount = (childSnapshot.val() && childSnapshot.val().amount);
            var newElement = document.createElement("option");
            newElement.innerHTML = name;
            houseRoomNum.push(amount);
            houseRoomId.push(id);
            taskRooms.appendChild(newElement);
        });
    });
}


//get one house data
function setOneHouseData(id) {
    var ref = firebase.database().ref('houses/' + id);
    ref.once('value', function(snapshot) {
        document.getElementById('ModalLabel').innerHTML = snapshot.val().name;
        document.getElementById('houseModalName').innerHTML = snapshot.val().name;
        document.getElementById('houseModalType').innerHTML = snapshot.val().type;
        document.getElementById('houseModalAmount').innerHTML = snapshot.val().amount;
        document.getElementById('houseModalAddress').innerHTMLress = snapshot.val().address;
        document.getElementById('houseModalWaternum').innerHTML = snapshot.val().waternum;
        document.getElementById('houseModalElectricNum').innerHTML = snapshot.val().electricnum;
        document.getElementById('houseModalCleanCost').innerHTML = snapshot.val().cleancost;
        document.getElementById('houseModalNetworkProvider').innerHTML = snapshot.val().networkprovider;
        let wifi_list = snapshot.val().wifiname;
        let wifi_pass_list = snapshot.val().wifipassword;
        for (let i = 0; i < wifi_list.length; i++) {
            if (i % 3 == 0) {
                document.getElementById('houseModalwifiname').innerHTML += "\n"
                document.getElementById('houseModalwifipassword').innerHTML += "\n"
            }
            document.getElementById('houseModalwifiname').innerHTML += wifi_list[i] + " | "
            document.getElementById('houseModalwifipassword').innerHTML += wifi_pass_list[i] + " | "

        }
        document.getElementById('houseModaldoorpassword').innerHTML = snapshot.val().doorpassword;
        document.getElementById('houseModalGasNum').innerHTML = snapshot.val().gasnum;
        $('#houseModal').modal();
    });
}

//get one house device data
function setRoomsDeviceData(housename, roomNum, id) {
    document.getElementById("room_device_header").innerHTML = housename + " " + roomNum + "房間"
    console.log(id);
    var ref = firebase.database().ref('rooms_device/' + id);
    ref.on('value', function(childSnapshot) {
        var img_check = [];
        // upload person data
        var room_aircon = (childSnapshot.val() && childSnapshot.val().room_aircon) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_aircon_graph || false);
        var room_aircon_ctrl = (childSnapshot.val() && childSnapshot.val().room_aircon_ctrl) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_aircon_ctrl_graph || false);
        var room_tv = (childSnapshot.val() && childSnapshot.val().room_tv) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_tv_graph || false);
        var room_tv_control = (childSnapshot.val() && childSnapshot.val().room_tv_control) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_tv_control_graph || false);
        var room_tv_box = (childSnapshot.val() && childSnapshot.val().room_tv_box) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_tv_box_graph || false);
        var room_wash = (childSnapshot.val() && childSnapshot.val().room_wash) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_wash_graph || false);
        var room_dry = (childSnapshot.val() && childSnapshot.val().room_dry) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_dry_graph || false);
        var room_ind_sv = (childSnapshot.val() && childSnapshot.val().room_ind_sv) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_ind_sv_graph || false);
        var room_wave = (childSnapshot.val() && childSnapshot.val().room_wave) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_wave_graph || false);
        var room_fresh = (childSnapshot.val() && childSnapshot.val().room_fresh) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_fresh_graph || false);
        var room_fast_heat = (childSnapshot.val() && childSnapshot.val().room_fast_heat) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_fast_heat_graph || false);
        var room_iron = (childSnapshot.val() && childSnapshot.val().room_iron) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_iron_graph || false);
        var room_warm = (childSnapshot.val() && childSnapshot.val().room_warm) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_warm_graph || false);
        var room_toilet = (childSnapshot.val() && childSnapshot.val().room_toilet) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_toilet_graph || false);
        var room_toilet_wat = (childSnapshot.val() && childSnapshot.val().room_toilet_wat) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_toilet_wat_graph || false);
        var room_toilet_pro = (childSnapshot.val() && childSnapshot.val().room_toilet_pro) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_toilet_pro_graph || false);
        var room_hot = (childSnapshot.val() && childSnapshot.val().room_hot) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_hot_graph || false);
        var room_wifi = (childSnapshot.val() && childSnapshot.val().room_wifi) || '無';
        img_check.push(childSnapshot.val() && childSnapshot.val().room_wifi_graph || false);
        console.log(img_check)
        var device = ['room_aircon', 'room_aircon_ctrl', 'room_tv', 'room_tv_control',
            'room_tv_box', 'room_wash', 'room_dry', 'room_ind_sv', 'room_wave', 'room_fresh',
            'room_fast_heat', 'room_iron', 'room_warm', 'room_toilet', 'room_toilet_wat', 'room_toilet_pro',
            'room_hot', 'room_wifi'
        ]
        document.getElementById('room_aircon').innerHTML = room_aircon
        document.getElementById('room_aircon_ctrl').innerHTML = room_aircon_ctrl
        document.getElementById('room_tv').innerHTML = room_tv;
        document.getElementById('room_tv_control').innerHTML = room_tv_control;
        document.getElementById('room_tv_box').innerHTML = room_tv_box;
        document.getElementById('room_wash').innerHTML = room_wash;
        document.getElementById('room_dry').innerHTML = room_dry;
        document.getElementById('room_ind_sv').innerHTML = room_ind_sv;
        document.getElementById('room_wave').innerHTML = room_wave;
        document.getElementById('room_fresh').innerHTML = room_fresh;
        document.getElementById('room_fast_heat').innerHTML = room_fast_heat;
        document.getElementById('room_iron').innerHTML = room_iron;
        document.getElementById('room_warm').innerHTML = room_warm;
        document.getElementById('room_toilet').innerHTML = room_toilet;
        document.getElementById('room_toilet_wat').innerHTML = room_toilet_wat;
        document.getElementById('room_toilet_pro').innerHTML = room_toilet_pro;
        document.getElementById('room_hot').innerHTML = room_hot;
        document.getElementById('room_wifi').innerHTML = room_wifi;
        for (let device_i = 0; device_i < 18; device_i++) {
            if (img_check[device_i] == true) {
                document.getElementById(device[device_i]).innerHTML += "<i class='fas fa-images' aria-hidden='true'></i>";
                $('#' + device[device_i]).off('click').click(function() {
                    const images = firebase.storage().ref().child('rooms_images/' + id + "/");
                    const image = images.child(id + "_" + device[device_i]);
                    image.getDownloadURL().then(function(url) {
                        var newTab = window.open("showimg.html");
                        setTimeout(function() {
                            var img_div = document.createElement("img")
                            img_div.setAttribute("class", "img-fluid");
                            img_div.setAttribute("src", url);
                            console.log(img_div)
                            newTab.document.body.appendChild(img_div);
                        }, 500);
                    })
                })
            } else {
                $('#' + device[device_i]).off('click')
            }
        }

        for (let button_i = 1; button_i < 55; button_i++) {
            let device_name = device[Math.floor((button_i - 1) / 3)]
            let img_has = img_check[(button_i - 1) % 3]
            $('#' + "room_" + button_i + "_device_button").off('click').click(function() {
                set_device_event(id, button_i, device_name, housename, roomNum, img_has);
            })
        }
        $('#room_device_modal').modal();
    })
}

function set_device_event(id, button_num, device_name, housename, roomNum, img_has) {
    var ele_id = "room_" + button_num + "_device_button"
    console.log(button_num)
    if (button_num % 3 == 1) {
        fix_device_byId(id, ele_id, '修改', 'input', 'form-control', button_num, device_name, img_has)
    }
    if (button_num % 3 == 2) {
        fix_device_byId(id, ele_id, '移轉', 'div', 'col-md- mb-3', button_num, device_name, img_has)
    }
    if (button_num % 3 == 0) {
        var device = ['冷氣', '冷氣遙控器', '電視機', '電視遙控器',
            '機上盒', '洗衣機', '烘衣機', '電磁爐', '微波爐', '洗衣機',
            '快煮壺', '熨斗', '電暖器', '馬桶', '馬桶水箱', '免治馬桶',
            '電熱水器', 'wifi'
        ]
        uploadTaskData(housename, roomNum, id, "修繕", device[Math.floor((button_num - 3) / 3)], "room_device_modal")
    }
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
    if (position == "房務" || position == "訪客") {
        alert("您無權訪問!")
        window.location.href = './index.html';
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

//set users account data
function setUsersData(elementId = "buildTaskPerson") {
    usersId = [] //不指定
    usersEmail = []
    userStatus = []
    taskPerson = []
    firebase.database().ref('users/').once('value', function(snapshot) {
        var taskPerson = document.getElementById(elementId);
        taskPerson.innerHTML = '<option value="" >選擇...</option>' +
            '<option value="不指定">不指定</option>';
        snapshot.forEach(function(childSnapshot) {
            var position = (childSnapshot.val() && childSnapshot.val().position);
            if (position == "管理員" || position == "工務") {
                var id = (childSnapshot.val() && childSnapshot.val().id);
                var name = (childSnapshot.val() && childSnapshot.val().name) || '訪客';
                var email = (childSnapshot.val() && childSnapshot.val().email);
                var newElement = document.createElement("option");
                newElement.innerHTML = name;
                newElement.setAttribute("value", name);
                usersId.push(id);
                userStatus.push(position)
                usersEmail.push(email);
                taskPerson.appendChild(newElement);
            }
        });
    });
}

//upload tasks data
function uploadTaskData(housename, roomNum, room_id, task_Type, device_name = "無", back_modal = "無") {
    if (back_modal != "無") {
        $('#' + back_modal + ' .close').click()
    }
    document.getElementById("build_task_header").innerHTML = housename + " " + roomNum + "房間"
    setUsersData(); //指派人員的資料
    if (device_name != "無") {
        document.getElementById("fix_device_div").removeAttribute("hidden")
        document.getElementById("buildTaskDevice").innerHTML = device_name
    }
    $('#build_task_modal').modal();
    $("#task_assign_btn").off('click').click(function() {
        var task_type = task_Type;
        var taskName = housename + " " + roomNum + "房間";
        var taskStatus = document.getElementById('buildTaskStatus').value;
        var taskContent = document.getElementById('buildTaskContent').value;
        var taskPersonIndex = document.getElementById('buildTaskPerson').selectedIndex;
        var taskPerson = document.getElementById('buildTaskPerson').value;
        var taskDate = document.getElementById('buildTaskdate').value;

        var current_user = sessionStorage.getItem('userName');
        var newRef = firebase.database().ref('fix_tasks/').push();
        taskStatusFocusOut();
        taskContentFocusOut();
        taskPersonFocusOut();
        taskDateFocusOut();
        if (taskPerson != "不指定") {
            var taskPersonId = usersId[taskPersonIndex - 2];
            var taskPersonEmail = usersEmail[taskPersonIndex - 2];
            var taskPersonStatus = userStatus[taskPersonIndex - 2];
            if (taskPersonStatus == "管理員") {
                newRef = firebase.database().ref('admin_tasks/').push();
            }
        } else if (taskPerson == "不指定") {
            var taskPersonId = 'None'
            var taskPersonEmail = 'None'
        }
        if (taskName.length < 1 || taskContent.length < 1 || taskPerson.length < 1 || taskDate.length < 1 || taskStatus < 1) {
            return;
        } else {
            $("#build_task_modal .close").click();
            $('#uploadModal').modal();

            newRef.set({
                id: newRef.key,
                taskType: task_type,
                device: device_name,
                roomId: room_id,
                userName: current_user,
                name: taskName,
                content: taskContent,
                deal_person: taskPerson,
                deal_userId: taskPersonId,
                deal_userEmail: taskPersonEmail,
                date: formatMS(taskDate),
                finishDate: "",
                status: taskStatus
            }).then(function() {
                // hide uploading alert
                $("#uploadModal .close").click();
                // show success alert
                $('#dataUploadModal').modal();
                document.getElementById('buildTaskStatus').value = "";
                document.getElementById('buildTaskContent').value = "";
                document.getElementById('buildTaskPerson').value = "";
                document.getElementById('buildTaskdate').value = "";
            }).catch(function(error) {
                console.error('Error writing user data to database', error);
            });
        }
    });
}



function formatTime(date, need_hhmm) {
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
        //$("#uploadModal .close").click();
    });
}
//set users data
function setTasksData() {
    firebase.database().ref('fix_tasks/').orderByChild('taskType').equalTo("修繕").on('value', function(snapshot) {
        var taskIngData = document.getElementById("taskIngData");
        var taskFinishData = document.getElementById("taskFinishData");
        var data_amount = snapshot.numChildren();
        var temp_amount = 0
        $('#task_table').DataTable().destroy(); //會讓data 重新出來?! innerHTML必須後來在清空
        $('#task_finish_table').DataTable().destroy();
        taskIngData.innerHTML = "";
        taskFinishData.innerHTML = "";

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
            var html =
                '<td>' + taskType + '</td>' +
                '<td>' + status + '</td>' +
                '<td>' + formatTime(new Date(date), false) + '</td>' +
                '<td>' + room_name + '</td>' +
                '<td>' + person + '</td>' +
                '<td>' + content + '</td>';
            var newElement = document.createElement("tr");

            if (status == "已處理") {
                newElement.setAttribute('class', "table-secondary");
                // html += '<td>' + formatTime(new Date(finishdate)) + '</td>';

                newElement.setAttribute('id', id + "table");
                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';
                newElement.innerHTML = html;
                taskFinishData.insertBefore(newElement, taskFinishData.firstChild);
                document.getElementById(id).addEventListener('click', function() {
                    setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device)
                }, false);
            } else {
                if (status == "請檢查") {
                    newElement.setAttribute('class', "table-success");
                }
                newElement.setAttribute('id', id + "table");
                html += '<td><button class="btn btn-primary" type="button" id="' + id + '">查看詳情</button></td>';

                newElement.innerHTML = html;
                taskIngData.insertBefore(newElement, taskIngData.firstChild);

                document.getElementById(id).addEventListener('click', function() {
                    setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, notes, money, finishdate, device)
                }, false);


            }
            if (temp_amount == data_amount) {
                var table = $('#task_table').DataTable();
                var table = $('#task_finish_table').DataTable();
            }

        });

    });
}
// 避免bootstrap的滾軸不見
$(document).on('hidden.bs.modal', '.modal', function() {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});

function setTaskContent(id, taskType, status, room_name, person, date, content, deal_person, deal_method, deal_result, deal_notes, deal_money, finishdate, device = "無") {
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
        task_status.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_date.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_person.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_method.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_result.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_fee.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        task_deal_note.innerHTML += "<i class='fas fa-edit ml-2'></i>"
        fix_data_byId(id, 'task_status', "狀態", "select", "custom-select d-block w-100", status);
        fix_data_byId(id, 'task_deal_date', "日期", "input", "form-control", finishdate);
        fix_data_byId(id, 'task_deal_person', "處理人員", "select", "custom-select d-block w-100", deal_person);
        fix_data_byId(id, 'task_deal_method', "處理方法", "textarea", "form-control", deal_method);
        fix_data_byId(id, 'task_deal_result', '處理結果', 'textarea', 'form-control', deal_result);
        fix_data_byId(id, 'task_deal_fee', "費用", "input", "form-control", deal_money);
        fix_data_byId(id, 'task_deal_note', "備註", "input", "form-control", deal_notes);
    }

    $('#build_task_detail_modal').modal();
    $('#fix_modal_cancel').off('click').click(function() {
        $("#fix_data_modal").modal('hide');
        $('#build_task_detail_modal').modal('show');
    })
}

function fix_data_byId(FB_task_id, Ele_id, header, Cre_Ele_type, Cre_Ele_class, org_value) {
    $('#' + Ele_id).click(function() {
        $("#build_task_detail_modal").modal('hide');
        var modal = document.getElementById("fix_modal_div")
        modal.innerHTML = '<label for="fix_modal_data" id="fix_modal_label">狀態</label>' +
            '<div class="text-center">' +
            ' <p hidden style="font-size:1em; color:red;" id="buildTaskdateWrong">請輸入正確內容</p>' +
            '</div>';
        document.getElementById("fix_modal_label").innerHTML = "填寫" + header
            // var modal = document.getElementById("fix_modal_div")
            // if (modal.childElementCount == 3) {
            //     modal.removeChild(modal.childNodes[2]);
            // }
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
            firebase.database().ref('fix_tasks/' + FB_task_id).update(updates_data).then(function() {
                console.log("finish")
                console.log(fix_data)
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

function fix_device_byId(FB_task_id, Ele_id, header, Cre_Ele_type, Cre_Ele_class, button_num, device_name, img_has) {
    var graph_upload = img_has
    $("#room_device_modal").modal('hide');
    var modal = document.getElementById("fix_modal_div")
    var org_value = document.getElementById(device_name).innerHTML.split("<")[0]
    modal.innerHTML = '<label for="fix_modal_data" id="fix_modal_label">狀態</label>' +
        '<div class="text-center">' +
        '<p hidden style="font-size:1em; color:red;" id="buildTaskdateWrong">請輸入正確內容</p>' +
        '</div>';
    document.getElementById("fix_modal_label").innerHTML = header;
    if (header == "修改") {
        var newElement = document.createElement(Cre_Ele_type);
        newElement.setAttribute('id', "fix_modal_data");
        newElement.setAttribute('class', Cre_Ele_class);
        newElement.setAttribute('type', "text");
        var img_label = document.createElement("label");
        img_label.setAttribute("for", "file-upload")
        img_label.setAttribute("class", "btn btn-secondary mt-2 ")
        img_label.innerHTML = "上傳圖片"
        var img_input = document.createElement("input");
        img_input.setAttribute("id", "file-upload");
        img_input.setAttribute("type", "file")
        img_input.setAttribute("hidden", true)
        img_input.setAttribute("accept", "image/png, image/jpeg")
        var img_show = document.createElement("img");
        img_show.setAttribute("class", "img-fluid");
        img_show.setAttribute("hidden", true);
        img_show.setAttribute("id", "blah")
        if (org_value != "無") {
            newElement.value = org_value;
        }
        modal.insertBefore(newElement, modal.childNodes[2]);
        modal.insertBefore(img_label, modal.childNodes[3]);
        modal.insertBefore(img_input, modal.childNodes[4]);
        modal.insertBefore(img_show, modal.childNodes[5]);
    }
    if (header == "移轉") {
        var html_house_select = document.createElement(Cre_Ele_type);
        html_house_select.setAttribute('class', Cre_Ele_class);
        html_house_select.innerHTML =
            "<label for='buildTaskRooms'>房源</label>" +
            "<select class='custom-select d-block w-100' id='buildTaskRooms' required>" +
            "<option value=" +
            " >選擇...</option>" +
            "</select>" +
            "<div class='text-center'>" +
            "<p hidden style='font-size:1em; color:red;' id='buildTaskRoomsWrong'>請選擇房源</p>" +
            "</div>";
        var html_room_select = document.createElement('div');
        html_room_select.setAttribute('class', 'col-md-12 mb-3');
        html_room_select.innerHTML = '<label for="buildTaskRoomsNum">房號</label>' +
            '<select class="custom-select d-block w-100" id="buildTaskRoomsNum" required>' +
            '<option value="" >選擇...</option>' +
            '</select>' +
            '<div class="text-center">' +
            '<p hidden style="font-size:1em; color:red;" id="buildTaskRoomsNumWrong">請選擇房號</p>' +
            '</div>'
        modal.insertBefore(html_house_select, modal.childNodes[2]);
        modal.insertBefore(html_room_select, modal.childNodes[3]);
        console.log(document.getElementById('buildTaskRooms'));
        setSelectHouseData();
        document.getElementById('buildTaskRooms').addEventListener('change', changeRoomNum, false);
    }


    $("#file-upload").off('click').click(function() {
        document.getElementById("blah").removeAttribute("hidden")
            //select image
        $("#file-upload").change(function() {
            var imageFile = readURL(this);
            // upload img file to firebase storage
            // Create a root reference      
            var storageRef = firebase.storage().ref();
            const imageName = FB_task_id + '_' + device_name;
            const metadata = {
                imageFile: imageFile.type
            };
            graph_upload = true
            const task = storageRef.child('rooms_images/' + FB_task_id + '/' + imageName)
                .put(imageFile, metadata).then(function() {

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
        });
    })
    $('#fix_modal_cancel').off('click').click(function() {
        $("#fix_data_modal").modal('hide');
        $("#room_device_modal").modal('show');
    });
    $("#fix_modal_check").off('click').click(function() {
        if (header == "修改") {
            var fix_data = document.getElementById('fix_modal_data').value;
            var updates_data = {}
            updates_data[device_name] = fix_data
            updates_data[device_name + "_graph"] = graph_upload
            firebase.database().ref('rooms_device/' + FB_task_id).update(updates_data).then(function() {
                // org_value = fix_data
                // if (header == "修改") {
                //     if (graph_upload == true) {
                //         org_value += "<i class='fas fa-images' aria-hidden='true'></i>"
                //     }
                // }
                // if (header == "移轉") {
                //     document.getElementById('buildTaskName').value = "";
                //     document.getElementById('buildTaskPerson').value = "";
                //     document.getElementById('buildTaskRooms').value = "";
                //     document.getElementById('buildTaskStatus').value = "";
                //     document.getElementById('buildTaskdate').value = "";
                // }
                // $("#fix_data_modal .close").click();
                $("#fix_data_modal").modal('hide');
                //document.getElementById(device_name).innerHTML = org_value
                $("#room_device_modal").modal('show');
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
        }
        if (header == "移轉") {
            var taskRoomIndex = document.getElementById('buildTaskRooms').selectedIndex;
            console.log(taskRoomIndex)
            console.log(houseRoomId[taskRoomIndex - 1]);
            var taskRoomNumIndex = document.getElementById('buildTaskRoomsNum').selectedIndex;
            var taskRoomNum = document.getElementById('buildTaskRoomsNum').value;
            var room_id = ""
            var oldRef = firebase.database().ref('houses/' + houseRoomId[taskRoomIndex - 1] + "/");
            oldRef.once('value', function(snapshot) {
                var rooms = snapshot.val().rooms;
                room_id = rooms[taskRoomNumIndex - 1]
            }).then(function() {
                var updates_data = {}
                updates_data[device_name] = document.getElementById(device_name).innerHTML.split("<")[0]
                updates_data[device_name + "_graph"] = true
                var old_data = {}
                old_data[device_name] = "無"
                old_data[device_name + "_graph"] = false
                $('#' + device_name).off('click')

                const images = firebase.storage().ref().child('rooms_images/' + FB_task_id + "/");
                const image = images.child(FB_task_id + "_" + device_name);
                image.getDownloadURL().then(function(url) {
                    console.log(url)
                        // This can be downloaded directly:
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function(event) {
                        var blob = xhr.response;
                        var storageRef = firebase.storage().ref();
                        const imageName = room_id + '_' + device_name;
                        const metadata = {
                            imageFile: blob.type
                        };
                        const task = storageRef.child('rooms_images/' + room_id + '/' + imageName)
                            .put(blob, metadata)
                    };
                    xhr.open('GET', url);
                    xhr.send();
                });


                firebase.database().ref('rooms_device/' + room_id).update(updates_data)
                    .then(function() {
                        firebase.database().ref('rooms_device/' + FB_task_id).update(old_data)
                            .then(function() {
                                // $("#fix_data_modal .close").click();
                                $("#fix_data_modal").modal('hide');
                                // document.getElementById(device_name).innerHTML = org_value.split("<")[0]
                                $("#room_device_modal").modal('show');
                                // $('#build_task_detail_modal').modal();
                            });
                    });


            });
        }

    })
    $('#fix_data_modal').modal();


}

//if select one house change the num of rooms
function changeRoomNum() {
    var taskRooms = document.getElementById("buildTaskRoomsNum");
    taskRooms.innerHTML = '<option value="" >選擇...</option>' +
        '</select>'
    var taskRoomIndex = document.getElementById('buildTaskRooms').selectedIndex;
    var numOfRoom = parseInt(houseRoomNum[taskRoomIndex - 1]);
    for (var i = 0; i < numOfRoom; i++) {
        var newElement = document.createElement("option");
        newElement.innerHTML = room_number_list[i] + "房間";
        taskRooms.appendChild(newElement);
    }

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

function switch_task(element) {
    var house_deck = document.getElementById("house_deck")
    var undone_deck = document.getElementById("undone_deck")
    var done_deck = document.getElementById("done_deck")
    if (element.id == "undone_task") {
        undone_deck.removeAttribute("hidden")
        house_deck.setAttribute("hidden", true)
        done_deck.setAttribute("hidden", true)
    } else if (element.id == "finish_task") {
        done_deck.removeAttribute("hidden")
        undone_deck.setAttribute("hidden", true)
        house_deck.setAttribute("hidden", true)
    } else {
        house_deck.removeAttribute("hidden")
        undone_deck.setAttribute("hidden", true)
        done_deck.setAttribute("hidden", true)
    }
}



/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // $('#upload_modal_label').html("載入中...請稍後");
    // $('#uploadModal').modal();
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (user) {
            setUserData();
            setHouseData();
            checkUserPosition();
            setTasksData();

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

function formatMS(date) {
    var d = new Date(date);
    return d.getTime();
}
//read user upload image
function readURL(input) {
    var imageFile = input.files[0];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileType = file['type'];

        if (input.files[0]) {}

        if (!validImageTypes.includes(fileType)) {
            alert("請選擇圖檔");
            return;
        }

        var reader = new FileReader();

        reader.onload = function(e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
    return imageFile
}