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

//This is user upload file
var imageFile;
var imageFile_list = []
var imageName_list = []
var image_count = 0;


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

function typeFocusOut() {
    var type = document.getElementById('type').value;
    var typeWrong = document.getElementById('typeWrong');
    if (type.length < 1) {
        typeWrong.removeAttribute("hidden");
    } else {
        typeWrong.setAttribute('hidden', 'true');
    }
}

function amountFocusOut() {
    var amount = document.getElementById('amount').value;
    var amountWrong = document.getElementById('amountWrong');
    if (amount.length < 1) {
        amountWrong.removeAttribute("hidden");
    } else {
        amountWrong.setAttribute('hidden', 'true');
    }
}

function addressFocusOut() {
    var address = document.getElementById('address').value;
    var addressWrong = document.getElementById('addressWrong');
    if (address.length < 5) {
        addressWrong.removeAttribute("hidden");
    } else {
        addressWrong.setAttribute('hidden', 'true');
    }
}

function waternumFocusOut() {
    var waternum = document.getElementById('waternum').value;
    var waternumWrong = document.getElementById('waternumWrong');
    if (waternum.length < 1) {
        waternumWrong.removeAttribute("hidden");
    } else {
        waternumWrong.setAttribute('hidden', 'true');
    }
}

function electricnumFocusOut() {
    var electricnum = document.getElementById('electricnum').value;
    var electricnumWrong = document.getElementById('electricnumWrong');
    if (electricnum.length < 1) {
        electricnumWrong.removeAttribute("hidden");
    } else {
        electricnumWrong.setAttribute('hidden', 'true');
    }
}

function managecostFocusOut() {
    var managecost = document.getElementById('managecost').value;
    var managecostWrong = document.getElementById('managecostWrong');
    if (managecost.length < 1) {
        managecostWrong.removeAttribute("hidden");
    } else {
        managecostWrong.setAttribute('hidden', 'true');
    }
}

function tvcostFocusOut() {
    var tvcost = document.getElementById('tvcost').value;
    var tvcostWrong = document.getElementById('tvcostWrong');
    if (tvcost.length < 1) {
        tvcostWrong.removeAttribute("hidden");
    } else {
        tvcostWrong.setAttribute('hidden', 'true');
    }
}

function paycostFocusOut() {
    var paycost = document.getElementById('paycost').value;
    var paycostWrong = document.getElementById('paycostWrong');
    if (paycost.length < 1) {
        paycostWrong.removeAttribute("hidden");
    } else {
        paycostWrong.setAttribute('hidden', 'true');
    }
}

function gasnumFocusOut() {
    var gasnum = document.getElementById('gasnum').value;
    var gasnumWrong = document.getElementById('gasnumWrong');
    if (gasnum.length < 1) {
        gasnumWrong.removeAttribute("hidden");
    } else {
        gasnumWrong.setAttribute('hidden', 'true');
    }
}

function cleancostFocusOut() {
    console.log("test")
    var cleancost = document.getElementById('cleancost').value;
    var cleancostWrong = document.getElementById('cleancostWrong');
    if (cleancost.length < 1) {
        cleancostWrong.removeAttribute("hidden");
    } else {
        cleancostWrong.setAttribute('hidden', 'true');
    }
}

function networkproviderFocusOut() {
    var networkprovider = document.getElementById('networkprovider').value;
    var networkproviderWrong = document.getElementById('networkproviderWrong');
    if (networkprovider.length < 1) {
        networkproviderWrong.removeAttribute("hidden");
    } else {
        networkproviderWrong.setAttribute('hidden', 'true');
    }
}

function wifinameFocusOut() {
    var wifiname = document.getElementById('wifiname0').value;
    var wifinameWrong = document.getElementById('wifinameWrong');
    if (wifiname.length < 1) {
        wifinameWrong.removeAttribute("hidden");
    } else {
        wifinameWrong.setAttribute('hidden', 'true');
    }
}

function wifipasswordFocusOut() {
    var wifipassword = document.getElementById('wifipassword0').value;
    var wifipasswordWrong = document.getElementById('wifipasswordWrong');
    if (wifipassword.length < 1) {
        wifipasswordWrong.removeAttribute("hidden");
    } else {
        wifipasswordWrong.setAttribute('hidden', 'true');
    }
}

function doorpasswordFocusOut() {
    var doorpassword = document.getElementById('doorpassword').value;
    var doorpasswordWrong = document.getElementById('doorpasswordWrong');
    if (doorpassword.length < 1) {
        doorpasswordWrong.removeAttribute("hidden");
    } else {
        doorpasswordWrong.setAttribute('hidden', 'true');
    }
}

function photoFocusOut() {
    // var photoWrong = document.getElementById('photoWrong');
    var image_amount = imageFile_list.length
    if (image_amount < 1) {
        photoWrong.removeAttribute("hidden");
    } else {
        photoWrong.setAttribute('hidden', 'true');
    }
}

function roomAmount_wifiAmount() {
    console.log("handle room amount")
    $('#amount').off('change').change(function() {
        var amount = document.getElementById('amount').value;
        var wifi_row = document.getElementById('wifi_row');
        wifi_row.innerHTML = ''
        console.log(amount)
        if (amount > 1) {
            for (let i = 0; i < amount; i++) {
                var newElement1 = document.createElement("div");
                newElement1.innerHTML =
                    '<label for="wifiname' + i + '">Wifi名稱</label>' +
                    '<input type="text" class="form-control" id="wifiname' + i + '" placeholder="" value="" required>';
                if (i == 0) {
                    newElement1.innerHTML += '<div class="text-center">' +
                        '<p hidden style="font-size:1em; color:red;" id="wifinameWrong">請輸入正確wifi名稱</p>' +
                        '</div>'
                }
                newElement1.setAttribute('class', "col-md-6 mb-3")
                var newElement2 = document.createElement("div");
                newElement2.innerHTML =
                    '<label for="wifipassword' + i + '">Wifi密碼</label>' +
                    '<input type="text" class="form-control" id="wifipassword' + i + '" placeholder="0" value="" required>';
                if (i == 0) {
                    newElement2.innerHTML += '<div class="text-center">' +
                        '<p hidden style="font-size:1em; color:red;" id="wifipasswordWrong">請輸入正確wifi密碼</p>' +
                        '</div>'
                }
                newElement2.setAttribute('class', "col-md-6 mb-3")
                wifi_row.appendChild(newElement1);
                wifi_row.appendChild(newElement2);
            }
        }
    });
}



//Save house information
function saveHouseInformation() {
    var name = document.getElementById('name').value;
    var type = document.getElementById('type').value;
    var amount = document.getElementById('amount').value;
    var address = document.getElementById('address').value;
    var waternum = document.getElementById('waternum').value;
    var electricnum = document.getElementById('electricnum').value;
    var gasnum = document.getElementById('gasnum').value;
    var cleancost = document.getElementById('cleancost').value;
    var managecost = document.getElementById('managecost').value;
    var networkprovider = document.getElementById('networkprovider').value;
    var tvcost = document.getElementById('tvcost').value;
    var paycost = document.getElementById('paycost').value;
    var wifiname = document.getElementById('wifiname0').value;
    var wifipassword = document.getElementById('wifipassword0').value;
    var doorpassword = document.getElementById('doorpassword').value;
    let wifiname_list = []
    let wifipassword_list = []

    nameFocusOut();
    typeFocusOut();
    amountFocusOut();
    addressFocusOut();
    waternumFocusOut();
    electricnumFocusOut();
    managecostFocusOut();
    paycostFocusOut();
    tvcostFocusOut();
    gasnumFocusOut();
    cleancostFocusOut();
    networkproviderFocusOut();
    wifinameFocusOut();
    wifipasswordFocusOut();
    doorpasswordFocusOut();
    photoFocusOut();
    if (name.length < 1 || type.length < 1 || amount.length < 1 || address.length < 5 ||
        waternum.length < 1 || electricnum.length < 1 || gasnum.length < 1 ||
        cleancost.length < 1 || managecost.length < 1 || tvcost.length < 1 || paycost.length < 1 || networkprovider.length < 1 || wifiname.length < 1 ||
        wifipassword.length < 1 || doorpassword.length < 1 || imageFile_list.length < 1) {
        return;
    }
    //show uploading bar
    $('#uploadModal').modal();
    wifiname_list.push(wifiname)
    wifipassword_list.push(wifipassword)
    for (let room_amount = 1; room_amount < amount; room_amount++) {
        let wifi_temp_name = document.getElementById("wifiname" + room_amount).value
        if (wifi_temp_name.length > 0) {
            wifiname_list.push(wifi_temp_name)
        } else {
            wifiname_list.push("None")
        }
        let wifi_temp_pass = document.getElementById("wifipassword" + room_amount).value
        if (wifi_temp_pass.length > 0) {
            wifipassword_list.push(wifi_temp_pass)
        } else {
            wifipassword_list.push("None")
        }

    }
    firebase.database().ref('houses').orderByChild('name').equalTo(name).once("value")
        .then(function(snapshot) {

            //check same name project
            var value = snapshot.val();
            if (value) {
                alert('已有重複案名');
                $("#uploadModal .close").click();
                return;
            }

            // upload img file to firebase storage
            // Create a root reference      
            var storageRef = firebase.storage().ref();
            var newRef = firebase.database().ref('houses/').push();
            var downloadURL_list = []
            for (var j = 0; j < imageFile_list.length; j++) {
                const imageName = 'image-' + j;
                const metadata = {
                    imageFile: imageFile_list[j].type
                };

                storageRef.child('images/' + newRef.key + '/' + imageName)
                    .put(imageFile_list[j], metadata).then(function(snapshot) {
                        snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            downloadURL_list.push(downloadURL)
                            if (downloadURL_list.length == imageFile_list.length) {
                                newRef.set({
                                    id: newRef.key,
                                    name: name,
                                    type: type,
                                    amount: amount,
                                    address: address,
                                    waternum: waternum,
                                    electricnum: electricnum,
                                    gasnum: gasnum,
                                    cleancost: cleancost,
                                    managecost: managecost,
                                    tvcost: tvcost,
                                    paycost: paycost,
                                    networkprovider: networkprovider,
                                    wifiname: wifiname_list,
                                    wifipassword: wifipassword_list,
                                    doorpassword: doorpassword,
                                    imageURL: downloadURL_list,
                                    imageName: imageName_list,
                                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                                }).then(function() {
                                    var i = 0;
                                    var roomId = [];
                                    for (i = 0; i < amount; i++) {
                                        var newDetailRef = firebase.database().ref('rooms/').push();
                                        roomId.push(newDetailRef.key);
                                        newDetailRef.set({
                                            houseId: newRef.key,
                                            roomId: i + 1,
                                            name: "無",
                                            rentMoney: 0,
                                            deposit: 0,
                                            phone: "None",
                                            rentDate: "2020/01/01~2020/01/02",
                                        }).then(function() {
                                            if (i == amount) {
                                                newRef.update({
                                                    rooms: roomId
                                                }).then(function() {
                                                    // hide uploading alert
                                                    $("#uploadModal .close").click();
                                                    // show success alert
                                                    $('#dataUploadModal').modal();
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
                                }).catch(function(error) {
                                    console.error('Error writing user data to database', error);
                                    alert(error);
                                });
                            }

                        }).catch(function(error) {
                            alert(error)
                        })
                    }).catch(function(error) {
                        alert(error)
                    })
            }
        });
}

function getUserUid() {
    return firebase.auth().currentUser.uid;
}

// if position is not admin, back to main.html
function checkUserPosition() {
    var userId = getUserUid();
    var position = '';
    return firebase.database().ref('/users/' + userId + '/position').once('value').then(function(snapshot) {
        position = (snapshot.val()) || 'Anonymous';
        if (position != "管理員" && position != "房務") {
            window.location.href = './main.html';
            return;
        }
    });
}

function sendToMainPage() {
    window.location.href = './infohouse.html';
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
//logout
function logout() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
}

//read user upload image
function readURL(input) {
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
        imageFile_list.push(input.files[0])
        imageName_list.push(document.getElementById("imgInp").value)
        if (imageFile_list.length > 4) {
            imageFile_list.shift()
        }

        var reader = new FileReader();

        reader.onload = function(e) {
            if (image_count == 4) {
                image_count = 0
            }
            image_count += 1
            $('#image' + image_count).attr('src', e.target.result);
            document.getElementById('image' + image_count).removeAttribute("hidden")
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
        document.getElementById("imgInp").value = null;
    }
}

function initApp() {
    document.getElementById('submitHouseInfo').addEventListener('click', saveHouseInformation, false);
    document.getElementById('upLoadSuccess').addEventListener('click', sendToMainPage, false);
    document.getElementById('logout').addEventListener('click', logout, false);
    roomAmount_wifiAmount()
        //select image
    $("#imgInp").change(function() {
        readURL(this);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (!user) {
            window.location.href = './login.html';
            return;
        }
        setUserData();
        checkUserPosition();

    });
}


window.onload = function() {
    initApp();
};