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

function fixMoneyDateFocusOut() {
    var rentDate = document.getElementById('giveRentMoney').value;
    var rentDateWrong = document.getElementById('giveRentMoneyWrong');
    if (rentDate.length < 1) {
        rentDateWrong.removeAttribute("hidden");
    } else {
        rentDateWrong.setAttribute('hidden', 'true');
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
function addElement(imageURL, name, amount, time, id, roomId) {
    var time = formatTime(new Date(time));
    var html =
        '<div class="card border-left-success shadow h-100 py-2">' +
        '<div class="hovereffect" runat="server">' +
        '<img class="card-img-top" src="' + imageURL + '" alt="Card image cap">' +
        '<div class="overlay" id="' + id + '">' +
        '<p class="mt-5">查看圖片</p>' +
        '</div></div>' +
        '<div class="card-body">' +
        '<div class="row no-gutters align-items-center">' +
        '<div class="col mr-2">' +
        '<div class="text-lg font-weight-bold text-primary text-uppercase mb-1">' + name + '</div>' +
        '<div class="h6 mb-0 font-weight-bold text-gray-800">間數: ' + amount + '</div>';
    for (var i = 0; i < roomId.length; i++) {
        html +=
            '<div class="row">' +
            '<div class="col-8 mt-2 mb-0 text-center"><button class="btn btn-primary btn-block" type="button" id="' + roomId[i] + '">' + (i + 1) + '號房間</button></div>' +
            '<button class="col-4 mt-2 fas fa-hammer fa-1.5x text-white-50 btn-primary" id=build' + roomId[i] + '></button>' +
            '</div>';
        if (i == roomId.length - 1) {
            html += '<div class="h6 mb-0 text-gray-600 mt-2">更新時間: </div>' +
                '<div class="h6 mb-0 text-gray-600 mt-2">' + time + '</div>' +
                '</div>' +
                '</div></div></div>'
        }
    }


    // Adds an element to the document
    var p = document.getElementById("houseRow");
    var newElement = document.createElement("div");
    newElement.setAttribute('class', "col-md-3 mb-4");
    newElement.innerHTML = html;
    p.appendChild(newElement);
    document.getElementById(id).addEventListener('click', function() { setOneHouseData(id) }, false);
    for (var i = 0; i < roomId.length; i++) {
        (function(i) {
            var tempId = roomId[i];
            document.getElementById(roomId[i]).addEventListener('click', function() { setRoomsData(tempId) }, false);

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
    var facilityAmount = 0;
    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            facilityAmount += 1;
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
        document.getElementById('houseModalwifiname').innerHTML = snapshot.val().wifiname;
        document.getElementById('houseModalwifipassword').innerHTML = snapshot.val().wifipassword;
        document.getElementById('houseModaldoorpassword').innerHTML = snapshot.val().doorpassword;
        document.getElementById('houseModalGasNum').innerHTML = snapshot.val().gasnum;
        $('#houseModal').modal();
    });
}

//get one house data
function setRoomsData(id) {
    console.log(id);
    var ref = firebase.database().ref('rooms/' + id);
    ref.once('value', function(snapshot) {
        document.getElementById('roomModalLabel').innerHTML = snapshot.val().roomId + "號房間";
        document.getElementById('roomModalName').innerHTML = snapshot.val().name;
        document.getElementById('roomModalPhone').innerHTML = snapshot.val().phone;
        document.getElementById('roomModalRentMoney').innerHTML = snapshot.val().rentMoney;
        document.getElementById('roomModalDeposit').innerHTML = snapshot.val().deposit;
        document.getElementById('roomModalRentDate').innerHTML = snapshot.val().rentDate;
        document.getElementById("fixRentProfile").addEventListener('click', function() { setRentData(id) }, false);
    }).then(function() {
        console.log("good");
        var ref = firebase.database().ref('rooms/' + id + '/rentHis');
        ref.orderByChild('id').on('value', function(snapshot) {
            var eleChartMoney = [];
            var p = document.getElementById("roomModalMoney");
            p.innerHTML = "";
            var p = document.getElementById("roomModalElecMoney");
            p.innerHTML = "";
            snapshot.forEach(function(childSnapshot) {
                var month = childSnapshot.val().id + 1;
                var date = childSnapshot.val().date;
                var elecMeter = childSnapshot.val().elecMeter;
                var elecMoney = childSnapshot.val().elecMoney;
                var money = childSnapshot.val().money;
                addRoomElement(month, date, elecMeter, elecMoney, money, id, childSnapshot.key);
                eleChartMoney.push(elecMoney);
                if (month == 12) {
                    createChart(eleChartMoney);
                    $('#dataTable').DataTable({
                        destroy: true,
                        ordering: false,
                        searching: false,
                    });
                    $('#dataTable2').DataTable({
                        destroy: true,
                        ordering: false,
                        searching: false,
                    });
                    $('#roomModal').modal();
                }
            })
        });
    }).catch(function(error) {
        console.error('Error reading user data from database', error);
        alert(error);
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

            if (position == "管理員" || position == "房務") {
                //set rent data button
                var p = document.getElementById("setRentProDiv");
                var newElement = document.createElement("button");
                newElement.setAttribute('class', "btn btn-primary");
                newElement.setAttribute('type', "button");
                newElement.setAttribute('id', "fixRentProfile");
                newElement.innerHTML = "修改承租人";
                p.appendChild(newElement);
                return;
            }
        });
        return;
    }

    displayname.textContent = storageName;
    displayphoto.src = storagePhoto;
    if (position == "管理員" || position == "房務") {
        //set rent data button
        var p = document.getElementById("setRentProDiv");
        var newElement = document.createElement("button");
        newElement.setAttribute('class', "btn btn-primary");
        newElement.setAttribute('type', "button");
        newElement.setAttribute('id', "fixRentProfile");
        newElement.innerHTML = "修改承租人";
        p.appendChild(newElement);
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

function formatTime(date) {
    let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    return formatted_date;
}
// if position is not admin, back to main.html
function checkUserPosition() {
    var userId = getUserUid();
    var position = '';
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        if (position == "管理員" && position == "房務") {
            //set rent data button
            var p = document.getElementById("setRentProDiv");
            var newElement = document.createElement("button");
            newElement.setAttribute('class', "btn btn-primary");
            newElement.setAttribute('type', "button");
            newElement.setAttribute('id', "fixRentProfile");
            newElement.innerHTML = "修改承租人";
            p.appendChild(newElement);



            return;
        }
        //finish loading
        $('#exampleModalLabel').text("上傳中請稍候...");
        $("#uploadModal .close").click();
    });
}



/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    $('#exampleModalLabel').html("載入中...請稍候");
    $('#uploadModal').modal();
    console.log("what")
        // Listening for auth state changes.
        // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (user) {

            setUserData();
            setHouseData();
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


// chart-area 
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

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