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
var room_number_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
//This is user upload file
var imageFile;
var imageFile_list = []
var imageFile_list_name = []
var imageFile_roomlist = []
var imageFile_roomlist_name = []
var image_count = 0;
var image_roomcout = 0;
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
function addElement(imageURL, imageName, name, amount, time, id, roomId, userposition, userhousevalue, userroomvalue) {
    var time = formatTime(new Date(time), true);
    var html = '<div class="card h-100 ">' +
        '<div class="img_container">' +
        '<div id="' + id + "_carousel" + '" class=" carousel slide" data-ride="carousel">' +
        ' <div class="carousel-inner">';
    if (imageURL != null) {
        for (let img_amount = 0; img_amount < imageURL.length; img_amount++) {
            if (img_amount == 0) {
                html += '<div class="carousel-item active">';
            } else {
                html += '<div class="carousel-item">';
            }
            html +=
                '<img class="card-img-top img-fluid image_hov" src="' + imageURL[img_amount] + '" alt="house img">';
            if (userposition == "管理員" && (userhousevalue == "不限制" || userhousevalue == name)) {
                html += '<div class="middle">' +
                    '<div class="btn btn-danger"  id="' + id + imageName[img_amount] + '">刪除</div>' +
                    '</div>'
            }
            html += '</div>';
        }
    } else {
        html += '<div class="carousel-item active">' +
            '<img class="card-img-top img-fluid" src="./img/house.png" alt="house img">' +
            '</div>';
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
        '<div class="card-body">' +
        '<button class="card-title font-weight-bold text-primary btn" id="' + id + '">' + name + "-詳情" + '</button>' +
        '<h6 class="card-subtitle mt-1 text-gray-800">間數: ' + amount + '</h6>';
    for (var i = 0; i < roomId.length; i++) {
        html +=
            '<div class="row no-gutters align-items-center">' +
            '<div class="col-12 mt-2 mb-0 text-center"><button class="btn btn-primary btn-block" type="button" id="' + roomId[i] + '">' + room_number_list[i] + '房資訊</button></div>' +
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
    document.getElementById(id).addEventListener('click', function() { setOneHouseData(id, name) }, false);
    if (imageURL != null && userposition == "管理員" && (userhousevalue == "不限制" || userhousevalue == name)) {
        for (let img_amount = 0; img_amount < imageURL.length; img_amount++) {
            document.getElementById(id + imageName[img_amount]).addEventListener("click", function() {
                removeImage(id, imageName[img_amount], "house");
            });
        }
    }

    for (var i = 0; i < roomId.length; i++) {
        (function(i) {
            var tempId = roomId[i];
            document.getElementById(roomId[i]).addEventListener('click', function() { setRoomsData(name, room_number_list[i], tempId) }, false);
            // document.getElementById("build" + roomId[i]).addEventListener('click', function() { uploadTaskData(name, i + 1, tempId, "修繕") }, false);
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

function uploadHouseImage(houseId) {
    $("#uploadModal").modal();
    var storageRef = firebase.storage().ref();
    var newRef = firebase.database().ref('houses/' + houseId);

    newRef.once('value', function(childSnapshot) {
        let downloadURL_list = (childSnapshot.val() && childSnapshot.val().imageURL);
        let imageName_list = (childSnapshot.val() && childSnapshot.val().imageName);
        if (imageName_list == null) {
            imageName_list = []
            downloadURL_list = []
        }
        let total_image_amount = imageFile_list.length + downloadURL_list.length
        for (var j = 0; j < imageFile_list.length; j++) {
            const imageName = imageFile_list_name[j];
            const metadata = {
                imageFile: imageFile_list[j].type
            };
            document.getElementById("image" + (j + 1)).setAttribute("hidden", true)
            storageRef.child('images/' + houseId + '/' + imageName)
                .put(imageFile_list[j], metadata).then(function(snapshot) {
                    snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        downloadURL_list.push(downloadURL)
                        imageName_list.push(imageName)
                        if (downloadURL_list.length == total_image_amount) {
                            newRef.update({
                                imageURL: downloadURL_list,
                                imageName: imageName_list
                            }).then(function() {
                                $("#uploadModal .close").click();
                                // show success alert
                                $('#dataUploadModal').modal();
                                imageFile_list = []
                                imageFile_list_name = []
                                image_count = 0
                                document.getElementById("imgInp").value = ""

                            }).catch(function(error) {
                                console.error('Error writing user data to database', error);
                                alert(error);
                            });
                        }
                    });
                }).catch(function(error) {
                    console.error('Error writing user data to database', error);
                    alert(error);
                });
        }
    }).catch(function(error) {
        console.error('Error writing user data to database', error);
        alert(error);
    });
}


function uploadRoomImage(roomId) {
    $("#uploadModal").modal();
    var storageRef = firebase.storage().ref();
    var newRef = firebase.database().ref('rooms/' + roomId);
    newRef.once('value', function(childSnapshot) {
        let downloadURL_list = (childSnapshot.val() && childSnapshot.val().imageURL);
        let imageName_list = (childSnapshot.val() && childSnapshot.val().imageName);
        if (imageName_list == null) {
            imageName_list = []
            downloadURL_list = []
        }
        let total_image_amount = imageFile_roomlist.length + downloadURL_list.length
        for (var j = 0; j < imageFile_roomlist.length; j++) {
            const imageName = imageFile_roomlist_name[j];
            const metadata = {
                imageFile: imageFile_roomlist[j].type
            };
            document.getElementById("image_room" + (j + 1)).setAttribute("hidden", true)
            storageRef.child('room_images/' + roomId + '/' + imageName)
                .put(imageFile_roomlist[j], metadata).then(function(snapshot) {
                    snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        downloadURL_list.push(downloadURL)
                        imageName_list.push(imageName)
                            // imageName_list.push(imageName)
                        if (downloadURL_list.length == total_image_amount) {
                            newRef.update({
                                imageURL: downloadURL_list,
                                imageName: imageName_list
                            }).then(function() {
                                $("#uploadModal .close").click();
                                // show success alert
                                $('#dataUploadModal').modal();
                                imageFile_roomlist = []
                                imageFile_roomlist_name = []
                                image_roomcout = 0
                                document.getElementById("img_room_Inp").value = ""


                            }).catch(function(error) {
                                console.error('Error writing user data to database', error);
                                alert(error);
                            });
                        }
                    });
                }).catch(function(error) {
                    console.error('Error writing user data to database', error);
                    alert(error);
                });
        }

    }).catch(function(error) {
        console.error('Error writing user data to database', error);
        alert(error);
    });

}

//get house data
function setHouseData() {
    let res = getUserPosition()
    res.then(data => {
        let userposition = data[0]
        let userhousevalue = data[1]
        let useroomvalue = data[2]
        var ref = firebase.database().ref('houses/');
        ref.on('value', function(snapshot) {
            document.getElementById("house_deck").innerHTML = "";
            snapshot.forEach(function(childSnapshot) {
                var name = childSnapshot.val().name;
                var time = childSnapshot.val().timestamp;
                var amount = childSnapshot.val().amount;
                var image = childSnapshot.val().imageURL;
                var imageName = childSnapshot.val().imageName;
                var childKey = childSnapshot.key;
                var roomId = childSnapshot.val().rooms;
                addElement(image, imageName, name, amount, time, childKey, roomId, userposition, userhousevalue, useroomvalue);

            });
        });
    })
}




//get one house data
function setOneHouseData(id, housename) {
    let res = getUserPosition()
    res.then(data => {
        var user_status = data[0]
        let userhousevalue = data[1]
        let useroomvalue = data[2]
        if (user_status == "管理員" && (userhousevalue == housename || userhousevalue == "不限制") && useroomvalue == "不限制") {
            edit_html = "<i class='fas fa-edit ml-2'></i>"
        } else {
            edit_html = ""
        }
        var ref = firebase.database().ref('houses/' + id);
        ref.once('value', function(snapshot) {
            document.getElementById('ModalLabel').innerHTML = snapshot.val().name;
            document.getElementById('houseModalName').innerHTML = snapshot.val().name + edit_html;
            document.getElementById('houseModalManageCost').innerHTML = snapshot.val().managecost + edit_html;
            document.getElementById('houseModaltvcost').innerHTML = snapshot.val().tvcost + edit_html;
            document.getElementById('houseModalpaycost').innerHTML = snapshot.val().paycost + edit_html;
            document.getElementById('houseModalType').innerHTML = snapshot.val().type + edit_html;
            document.getElementById('houseModalAmount').innerHTML = snapshot.val().amount + edit_html;
            document.getElementById('houseModalAddress').innerHTML = snapshot.val().address + edit_html;
            document.getElementById('houseModalWaternum').innerHTML = snapshot.val().waternum + edit_html;
            document.getElementById('houseModalElectricNum').innerHTML = snapshot.val().electricnum + edit_html;
            document.getElementById('houseModalCleanCost').innerHTML = snapshot.val().cleancost + edit_html;
            document.getElementById('houseModalNetworkProvider').innerHTML = snapshot.val().networkprovider + edit_html;
            document.getElementById('houseModalwifiname').innerHTML = ""
            document.getElementById('houseModalwifipassword').innerHTML = ""
            let wifi_list = snapshot.val().wifiname;
            let wifi_pass_list = snapshot.val().wifipassword;
            for (let i = 0; i < wifi_list.length; i++) {
                // if (i % 3 == 0) {
                //     document.getElementById('houseModalwifiname').innerHTML += "\n"
                //     document.getElementById('houseModalwifipassword').innerHTML += "\n"
                // }

                document.getElementById('houseModalwifiname').innerHTML += '<div class="col-md-12 col-xs-12">' + wifi_list[i] + '</div>'
                document.getElementById('houseModalwifipassword').innerHTML += '<div class="col-md-12 col-xs-12">' + wifi_pass_list[i] + '</div>'
                if (i == wifi_list.length - 1) {
                    document.getElementById('houseModalwifiname').innerHTML += '<div class="col-md-12 col-xs-12">' + edit_html + '</div>'
                    document.getElementById('houseModalwifipassword').innerHTML += '<div class="col-md-12 col-xs-12">' + edit_html + '</div>'
                }
            }
            //document.getElementById('houseModalwifiname').innerHTML = snapshot.val().wifiname + edit_html;
            //document.getElementById('houseModalwifipassword').innerHTML = snapshot.val().wifipassword + edit_html;
            document.getElementById('houseModaldoorpassword').innerHTML = snapshot.val().doorpassword + edit_html;
            document.getElementById('houseModalGasNum').innerHTML = snapshot.val().gasnum + edit_html;
            console.log(userhousevalue)
            console.log(housename)
            if (user_status == "管理員" && (userhousevalue == housename || userhousevalue == "不限制") && useroomvalue == "不限制") {
                fix_data_byId(id, "houseModalName", "案名", "input", "form-control", snapshot.val().name, user_status)
                fix_data_byId(id, "houseModalType", "類型", "select", "custom-select d-block w-100", snapshot.val().type, user_status)
                fix_data_byId(id, "houseModalAmount", "間數", "input", "form-control", snapshot.val().amount, user_status)
                fix_data_byId(id, "houseModalAddress", "地址", "input", "form-control", snapshot.val().address, user_status)
                fix_data_byId(id, "houseModalWaternum", "水號", "input", "form-control", snapshot.val().waternum, user_status)
                fix_data_byId(id, "houseModalElectricNum", "電號", "input", "form-control", snapshot.val().electricnum, user_status)
                fix_data_byId(id, "houseModalManageCost", "管理費", "input", "form-control", snapshot.val().managecost, user_status)
                fix_data_byId(id, "houseModaltvcost", "第四台", "input", "form-control", snapshot.val().tvcost, user_status)
                fix_data_byId(id, "houseModalpaycost", "扣繳", "input", "form-control", snapshot.val().paycost, user_status)
                fix_data_byId(id, "houseModalGasNum", "瓦斯", "input", "form-control", snapshot.val().gasnum, user_status)
                fix_data_byId(id, "houseModalCleanCost", "清潔費", "input", "form-control", snapshot.val().cleancost, user_status)
                fix_data_byId(id, "houseModalNetworkProvider", "網路第四台", "input", "form-control", snapshot.val().networkprovider, user_status)
                fix_data_byId(id, "houseModalwifiname", "wifi", "input", "form-control", snapshot.val().wifiname, user_status)
                fix_data_byId(id, "houseModalwifipassword", "wifi密碼", "input", "form-control", snapshot.val().wifipassword, user_status)
                fix_data_byId(id, "houseModaldoorpassword", "大門密碼", "input", "form-control", snapshot.val().doorpassword, user_status)
                document.getElementById("fix_modal_cancel").addEventListener('click', function() {
                    $("#fix_data_modal .close").click();
                    $("#houseModal").modal()
                })
                let upload_img_div = document.getElementById("upload_houseimage_div")
                upload_img_div.innerHTML = ""
                let temp_label = document.createElement('label')
                temp_label.setAttribute("for", "imgInp")
                temp_label.innerHTML = "上傳圖片(至多4張)";
                upload_img_div.appendChild(temp_label);
                let temp_input = document.createElement('input')
                temp_input.setAttribute("type", "file")
                temp_input.setAttribute("id", "imgInp")
                temp_input.setAttribute("accept", "image/png, image/jpeg")
                upload_img_div.appendChild(temp_input)

                let temp_row = document.createElement('div')
                temp_row.setAttribute("class", "row")
                temp_row.innerHTML =
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image1">' +
                    '</div>' +
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image2">' +
                    '</div>' +
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image3">' +
                    '</div>' +
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image4">' +
                    '</div>'
                upload_img_div.appendChild(temp_row)
                $("#imgInp").off('change').change(function() {
                    readURL(this, 'house');
                });

            } else {
                $('#houseModalName').off('click')
                $('#houseModalType').off('click')
                $('#houseModalAmount').off('click')
                $('#houseModalAddress').off('click')
                $('#houseModalWaternum').off('click')
                $('#houseModalElectricNum').off('click')
                $('#houseModalManageCost').off('click')
                $('#houseModaltvcost').off('click')
                $('#houseModalpaycost').off('click')
                $('#houseModalGasNum').off('click')
                $('#houseModalCleanCost').off('click')
                $('#houseModalNetworkProvider').off('click')
                $('#houseModalwifiname').off('click')
                $('#houseModalwifipassword').off('click')
                $('#houseModaldoorpassword').off('click')
                    // document.getElementById("upload_houseimage_div").innerHTML = ""
            }
            $("#fix_house_data").click(function() {
                if ((user_status == "管理員") && imageFile_list.length != 0) {
                    $("#houseModal .close").click()
                    uploadHouseImage(id);
                } else {
                    $("#houseModal .close").click()
                }
            })
            $('#houseModal').modal();
        });
    });
}

function fix_data_byId(FB_task_id, Ele_id, header, Cre_Ele_type, Cre_Ele_class, org_value, user_status) {
    $('#' + Ele_id).off('click').click(function() {
        $("#houseModal .close").click()
        document.getElementById("fix_modal_label").innerHTML = "填寫" + header
        var modal = document.getElementById("fix_modal_div")
        if (modal.childElementCount == 3) {
            modal.removeChild(modal.childNodes[2]);
        }
        var newElement = document.createElement(Cre_Ele_type);
        newElement.setAttribute('id', "fix_modal_data");
        newElement.setAttribute('class', Cre_Ele_class);
        if (header == "案名" || header == "地址" || header == "網路第四台" || header == "wifi" || header == "wifi密碼" || header == "扣繳") {
            newElement.setAttribute('type', "text");
        }
        if (header == "間數" || header == "水號" || header == "電號" || header == "瓦斯" || header == "管理費" || header == "大門密碼" || header == "清潔費" || header == "第四台") {
            newElement.setAttribute('type', "number");
        }
        if (header == "類型") {
            newElement.innerHTML =
                'option value="" >選擇...</option>' +
                '<option>Airbnb</option>' +
                '<option>長租</option>' +
                '<option>購置長租</option>' +
                '<option>長租代管</option>' +
                ' </select>';
        }

        newElement.value = org_value;
        modal.insertBefore(newElement, modal.childNodes[2]);
        $("#fix_modal_check").off('click').click(function() {
            var fix_data = document.getElementById('fix_modal_data').value;
            var updates_data = {}
            updates_data['edit_id'] = getUserUid()
            updates_data['edit_person'] = getUserName()
            updates_data['timestamp'] = firebase.database.ServerValue.TIMESTAMP
            if (header == "案名") {
                updates_data['name'] = fix_data
            }
            if (header == "類型") {
                updates_data['type'] = fix_data
            }
            if (header == "地址") {
                updates_data['address'] = fix_data
            }
            if (header == "網路第四台") {
                updates_data['networkprovider'] = fix_data
            }
            if (header == "第四台") {
                updates_data['tvcost'] = fix_data
            }
            if (header == "扣繳") {
                updates_data['paycost'] = fix_data
            }
            if (header == "wifi") {
                updates_data['wifiname'] = fix_data
            }
            if (header == "wifi密碼") {
                updates_data['wifipassword'] = fix_data
            }
            if (header == "間數") {
                updates_data['amount'] = fix_data
            }
            if (header == "水號") {
                updates_data['waternum'] = fix_data
            }
            if (header == "電號") {
                updates_data['electricnum'] = fix_data
            }
            if (header == "瓦斯") {
                updates_data['gasnum'] = fix_data
            }
            if (header == "管理費") {
                updates_data['managecost'] = fix_data
            }
            if (header == "清潔費") {
                updates_data['cleancost'] = fix_data
            }
            if (header == "大門密碼") {
                updates_data['doorpassword'] = fix_data
            }
            //one for now rent data and another for history
            firebase.database().ref('houses/' + FB_task_id).update(updates_data).then(function() {
                org_value = fix_data
                if (user_status == "管理員" || user_status == "會計") {
                    document.getElementById(Ele_id).innerHTML = org_value + "<i class='fas fa-edit ml-2'></i>"
                } else {
                    document.getElementById(Ele_id).innerHTML = org_value
                }
                $("#fix_data_modal").modal('hide');
                $("#houseModal").modal();

            }).catch(function(error) {
                alert(error);
            });
        });
        $('#fix_data_modal').modal();
    });
}

function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function getUserPosition() {
    return firebase.database().ref('/users/' + getUserUid()).once('value').then(function(snapshot) {
        position = (snapshot.val().position) || '訪客';
        housevalue = (snapshot.val().housevalue) || '不限制';
        roomvalue = (snapshot.val().roomvalue) || '不限制';
        return [position, housevalue, roomvalue]
    });
}

function removeImage(id, imageName, type) {
    if (type == "house") {
        console.log('images/' + id + '/' + imageName)
        firebase.storage().ref().child('images/' + id + '/' + imageName).delete()
            .catch(function(error) {
                alert(error);
            });;
        var ref = firebase.database().ref('houses/' + id);
    } else {
        console.log("remove:" + 'room_images/' + id + "/" + imageName)
        firebase.storage().ref().child('room_images/' + id + '/' + imageName).delete()
            .catch(function(error) {
                alert(error);
            });;
        var ref = firebase.database().ref('rooms/' + id);
    }

    ref.once('value', function(childSnapshot) {
        let imageURL = (childSnapshot.val() && childSnapshot.val().imageURL);
        let imageName_list = (childSnapshot.val() && childSnapshot.val().imageName);
        if (imageURL != null && imageURL.length != 0) {
            let image_index = imageName_list.indexOf(imageName)
            imageURL.splice(image_index, 1)
            imageName_list.splice(image_index, 1)
            var updates_data = {}
            updates_data['imageURL'] = imageURL
            updates_data['imageName'] = imageName_list
            ref.update(updates_data).catch(function(error) {
                alert(error);
            });
        }
    })
}
//get one house device data
function setRoomsData(housename, roomNum, id) {
    document.getElementById("room_device_header").innerHTML = housename + " " + roomNum + "房間"
    let useres = getUserPosition()
    useres.then(data => {
        let userposition = data[0]
        let userhousevalue = data[1]
        let userroomvalue = data[2]
        var ref = firebase.database().ref('rooms/' + id);
        ref.on('value', function(childSnapshot) {
            var imageURL = (childSnapshot.val() && childSnapshot.val().imageURL);
            var imageName = (childSnapshot.val() && childSnapshot.val().imageName);
            if (imageURL != null && imageURL.length != 0) {
                document.getElementById('room_img_div').removeAttribute("hidden")
                var newElement = document.createElement("div");
                newElement.setAttribute('id', id + "_carousel");
                newElement.setAttribute('class', "carousel slide");
                newElement.setAttribute('data-ride', "carousel");


                var html = ' <div class="carousel-inner">';

                for (var img_amount = 0; img_amount < imageURL.length; img_amount++) {
                    if (img_amount == 0) {
                        html += '<div class="carousel-item active">';
                    } else {
                        html += '<div class="carousel-item">';
                    }
                    html +=
                        '<img class="card-img-top img-fluid image_hov" src="' + imageURL[img_amount] + '" alt="house img">'
                    if (userposition == "管理員" && (userhousevalue == "不限制" || userhousevalue == housename) && (userroomvalue == "不限制" || userroomvalue == roomNum)) {
                        html += '<div class="middle">' +
                            '<div class="btn btn-danger"  id="' + id + imageName[img_amount] + '">刪除</div>' +
                            '</div>'
                    }

                    html += '</div>';
                }
                html += '</div>' +
                    '<a class="carousel-control-prev" href="#' + id + "_carousel" + '" role="button" data-slide="prev">' +
                    '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
                    '<span class="sr-only">Previous</span>' +
                    '</a>' +
                    '<a class="carousel-control-next" href="#' + id + "_carousel" + '" role="button" data-slide="next">' +
                    '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
                    '<span class="sr-only">Next</span>' +
                    '</a>';
                newElement.innerHTML = html
                document.getElementById('room_img_div').innerHTML = ""
                document.getElementById('room_img_div').appendChild(newElement);
                if (userposition == "管理員" && (userhousevalue == "不限制" || userhousevalue == housename) && (userroomvalue == "不限制" || userroomvalue == roomNum)) {
                    for (let img_amount = 0; img_amount < imageURL.length; img_amount++) {
                        document.getElementById(id + imageName[img_amount]).addEventListener("click", function() {
                            removeImage(id, imageName[img_amount], "room");
                        });
                    }
                }


            } else {
                document.getElementById('room_img_div').innerHTML = ""
                document.getElementById('room_img_div').setAttribute("hidden", true)
            }

        })

    })

    let res = getUserPosition()
    res.then(data => {
        var user_status = data[0]
        var userhousevalue = data[1]
        var useroomvalue = data[2]

        if (user_status == "管理員") {
            $("#fix_room_data").off('click').click(function() {
                if (imageFile_roomlist.length != 0) {
                    $("#room_device_modal .close").click()
                    uploadRoomImage(id);
                } else {
                    $("#room_device_modal .close").click()
                }
            })
        }

        let temp_time = new Date().getTime();
        firebase.database().ref('rooms_rent' + '/' + id).orderByChild('end_timesecond').limitToLast(5).once('value').then(function(snapshot) {
            let child_length = snapshot.numChildren()
            let temp_child_amount = 0
            let checked = false
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val().end_timesecond >= temp_time && childSnapshot.val().start_timesecond <= temp_time) {
                    checked = true;
                    temp_child_amount += 1
                    let end_timesecond = childSnapshot.val().end_timesecond
                    let now_time = new Date()
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
                    document.getElementById("room_money").innerHTML = room_rent
                    document.getElementById("room_deposit").innerHTML = room_deposit
                }
            });

            if (snapshot == null || child_length == 0 || !checked) {
                var room_person = "目前無承租人"
                var room_date = "無租期"
                var room_phone = "無資料"
                var room_rent = "無資料"
                var room_deposit = "無資料"
                document.getElementById("room_person").innerHTML = room_person
                document.getElementById("room_date").innerHTML = room_date
                document.getElementById("room_phone").innerHTML = room_phone
                document.getElementById("room_money").innerHTML = room_rent
                document.getElementById("room_deposit").innerHTML = room_deposit
            }
            if (user_status == "管理員" && (userhousevalue == "不限制" || userhousevalue == housename) && (useroomvalue == "不限制" || useroomvalue == roomNum)) {
                let upload_img_div = document.getElementById("upload_room_image_div")
                upload_img_div.innerHTML = ""
                let temp_label = document.createElement('label')
                temp_label.setAttribute("for", "img_room_Inp")
                temp_label.innerHTML = "上傳圖片(至多4張)";
                upload_img_div.appendChild(temp_label);
                let temp_input = document.createElement('input')
                temp_input.setAttribute("type", "file")
                temp_input.setAttribute("id", "img_room_Inp")
                temp_input.setAttribute("accept", "image/png, image/jpeg")
                upload_img_div.appendChild(temp_input)

                let temp_row = document.createElement('div')
                temp_row.setAttribute("class", "row")
                temp_row.innerHTML =
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image_room1">' +
                    '</div>' +
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image_room2">' +
                    '</div>' +
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image_room3">' +
                    '</div>' +
                    '<div class="col-md-3 col-xs-3 col-sm-3">' +
                    '<img hidden class="img-fluid" src="./img/imageupload.png" alt="Upload house image" id="image_room4">' +
                    '</div>'
                upload_img_div.appendChild(temp_row)
                $("#img_room_Inp").off('change').change(function() {
                    readURL(this, 'room');
                });
            }
            // } else {
            //     document.getElementById("upload_room_image_div").innerHTML = ""
            // }

            $('#room_device_modal').modal();
        });
    })
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

            // if (position == "管理員" || position == "房務") {
            //     //set rent data button
            //     var p = document.getElementById("setRentProDiv");
            //     var newElement = document.createElement("button");
            //     newElement.setAttribute('class', "btn btn-primary");
            //     newElement.setAttribute('type', "button");
            //     newElement.setAttribute('id', "fixRentProfile");
            //     newElement.innerHTML = "修改承租人";
            //     p.appendChild(newElement);
            //     return;
            // }
        });
        return;
    }

    displayname.textContent = storageName;
    displayphoto.src = storagePhoto;
    // if (position == "管理員" || position == "房務") {
    //     //set rent data button
    //     var p = document.getElementById("setRentProDiv");
    //     var newElement = document.createElement("button");
    //     newElement.setAttribute('class', "btn btn-primary");
    //     newElement.setAttribute('type', "button");
    //     newElement.setAttribute('id', "fixRentProfile");
    //     newElement.innerHTML = "修改承租人";
    //     p.appendChild(newElement);
    // }
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
    const messaging = firebase.messaging();
    // Add the public key generated from the console here.
    messaging.usePublicVapidKey("BIPCMKwinazsKt4MwUKjqIIc4Dk7-eAKmqIiosjwjoLUX42YI785ZVWPScNY4XkJRCeTtH3ARJl-P3PviTekkH8");
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then((currentToken) => {
        if (currentToken) {
            // sendTokenToServer(currentToken);
            // updateUIForPushEnabled(currentToken);
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // showToken('Error retrieving Instance ID token. ', err);
        // setTokenSentToServer(false);
    });
    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            setTokenSentToServer(false);
            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken);
            // ...
        }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ', err);
        });
    });
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        //$("#uploadModal .close").click();
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

        if (position == "管理員") {
            $("#imgInp").off('change').change(function() {
                readURL(this, 'house');
            });
            $("#img_room_Inp").off('change').change(function() {
                readURL(this, 'room');
            });


            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + fix + clean + add_house + account + task + rent
        } else if (position == "工務") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + fix + task
            document.getElementById("upload_houseimage_div").remove();
            document.getElementById("upload_room_image_div").remove();
        } else if (position == "房務") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + clean
            document.getElementById("upload_houseimage_div").remove();
            document.getElementById("upload_room_image_div").remove();
        } else if (position == "會計") {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info + fix + clean + add_house + account + task + rent
            document.getElementById("upload_houseimage_div").remove();
            document.getElementById("upload_room_image_div").remove();
        } else {
            document.getElementById("nav_bar_item").innerHTML =
                to_do + info
            document.getElementById("upload_houseimage_div").remove();
            document.getElementById("upload_room_image_div").remove();
        }
    });
}

// 避免bootstrap的滾軸不見
$(document).on('hidden.bs.modal', '.modal', function() {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});

//read user upload image
function readURL(input, task_type) {
    if (!input) {
        alert("找不到檔案");
        return;
    } else if (!input.files) {
        alert("不支援的檔案類型");
        return
    }

    imageFile = input.files[0];

    if (imageFile.size > 10485760) {
        alert("請選擇小於10MB的圖檔");
        return
    }
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileType = file['type'];

        if (input.files[0]) {}

        if (!validImageTypes.includes(fileType)) {
            alert("請選擇圖檔");
            return;
        }
        if (task_type == "house") {
            imageFile_list_name.push(document.getElementById("imgInp").value)
            imageFile_list.push(input.files[0])
            if (imageFile_list.length > 4) {
                imageFile_list.shift()
            }
        } else if (task_type == "room") {
            imageFile_roomlist_name.push(document.getElementById("img_room_Inp").value)
            imageFile_roomlist.push(input.files[0])
            if (imageFile_roomlist.length > 4) {
                imageFile_roomlist.shift()
            }
        }
        var reader = new FileReader();

        reader.onload = function(e) {
            if (task_type == "house") {
                if (image_count == 4) {
                    image_count = 0
                }
                image_count += 1
                $('#image' + image_count).attr('src', e.target.result);
                document.getElementById('image' + image_count).removeAttribute("hidden")
            } else if (task_type == "room") {
                if (image_roomcout == 4) {
                    image_roomcout = 0
                }
                image_roomcout += 1
                $('#image_room' + image_roomcout).attr('src', e.target.result);
                document.getElementById('image_room' + image_roomcout).removeAttribute("hidden")
            }
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
        document.getElementById("imgInp").value = null;
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
        } else {
            window.location.href = './login.html';
        }
        // [END_EXCLUDE]
    });

    document.getElementById('logout').addEventListener('click', logout, false);
}

window.onload = function() {
    initApp();
};

function formatMS(date) {
    var d = new Date(date);
    return d.getTime();
}