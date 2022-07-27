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







/**
 * Handles the out focus element.
 */
function emailFocusOut() {
    var email = document.getElementById('email').value;
    var emailWrong = document.getElementById('emailWrong');
    if (email.length < 4 || email.indexOf("@") == -1) {
        emailWrong.removeAttribute("hidden");
    } else {
        emailWrong.setAttribute('hidden', 'true');
    }
}

function passwordFocusOut() {
    var password = document.getElementById('password').value;
    var passwordWrong = document.getElementById('passwordWrong');
    if (password.length < 4) {
        passwordWrong.removeAttribute("hidden");
    } else {
        passwordWrong.setAttribute('hidden', 'true');
    }
}

function reapeatpasswordFocusOut() {
    var repeatPassword = document.getElementById('repeatPassword').value;
    var password = document.getElementById('password').value;
    var repeatPasswordWrong = document.getElementById('repeatPasswordWrong');
    if (repeatPassword != password) {
        repeatPasswordWrong.removeAttribute("hidden");
    } else {
        repeatPasswordWrong.setAttribute('hidden', 'true');
    }
}

function userNameFocusOut() {
    var nickname = document.getElementById('nickname').value;
    var nicknameWrong = document.getElementById('nicknameWrong');
    if (nickname.length < 1) {
        nicknameWrong.removeAttribute("hidden");
    } else {
        nicknameWrong.setAttribute('hidden', 'true');
    }
}



/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var repeatPassword = document.getElementById('repeatPassword').value;
    var userName = document.getElementById('nickname').value;

    if (email.length < 4 || email.indexOf("@") == -1 || password.length < 4 || password != repeatPassword || userName.length < 1) {
        alert('輸入資料有誤!');
    } else {
        // Create user with email and pass.
        // [START createwithemail]
        console.log("save now");
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {


            saveUserInformation();


        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('密碼太弱');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });

    }

}

function saveUserInformation() {
    var email = document.getElementById('email').value;
    var userName = document.getElementById('nickname').value;

    firebase.database().ref('users/' + getUserUid()).set({
        id: getUserUid(),
        name: userName,
        email: email,
        profilePicUrl: 'img/profile_placeholder.png',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(function() {
        window.location.href = './index.html';
    }).catch(function(error) {
        console.error('Error writing user data to database', error);
    });

}


function getUserUid() {
    return firebase.auth().currentUser.uid;
}

function initApp() {
    document.getElementById('email').addEventListener('focusout', emailFocusOut, false);
    document.getElementById('password').addEventListener('focusout', passwordFocusOut, false);
    document.getElementById('repeatPassword').addEventListener('focusout', reapeatpasswordFocusOut, false);
    document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('nickname').addEventListener('focusout', userNameFocusOut, false);
    firebase.auth().onAuthStateChanged(function(user) {
        // [END_EXCLUDE]
        if (user) {
            window.location.href = './index.html';
        }
    });
}


window.onload = function() {
    initApp();
};