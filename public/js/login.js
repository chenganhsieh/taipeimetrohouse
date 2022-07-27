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

// google sign in need to consider save user information
var googleSignInTask = false;

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


/**
 * Handles the sign up button press.
 */
function handleSignIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var passwordWrong = document.getElementById('passwordWrong');
    var emailWrong = document.getElementById('emailWrong');

    passwordWrong.setAttribute('hidden', 'true');
    emailWrong.setAttribute('hidden', 'true');

    if (email.length < 4 || email.indexOf("@") == -1) {
        emailWrong.removeAttribute("hidden");
    } else {
        // Create user with email and pass.
        // [START createwithemail]
        console.log("save now");
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            if (user) {

                console.log("login")

            }
        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                passwordWrong.removeAttribute("hidden");
            } else if (errorCode === 'auth/network-request-failed') {
                alert("網路不穩定");
            } else if (errorCode === 'auth/user-not-found') {
                emailWrong.removeAttribute("hidden");
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });

    }

}

function handleGoogleSignIn() {

    if (!firebase.auth().currentUser) {
        console.log("Start login")
        sessionStorage.setItem('login_task', true);
        var provider = new firebase.auth.GoogleAuthProvider();
        googleSignInTask = true;
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().languageCode = 'zh-TW';
        firebase.auth().signInWithRedirect(provider);
        // firebase.auth().getRedirectResult()
        // firebase.auth().signInWithPopup(provider).then(function(result) 
    } else {
        firebase.auth().signOut();
    }
    document.getElementById("sign-in-google").disabled = true





}

function saveUserInformation(user) {
    firebase.database().ref('users/' + getUserUid()).set({
        id: getUserUid(),
        name: user.displayName,
        email: user.email,
        position: "訪客",
        profilePicUrl: user.photoURL || 'img/profile_placeholder.png',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(function() {
        window.location.href = './tasks.html';
    }).catch(function(error) {
        alert("登入失敗！");
        console.error('Error writing user data to database', error);
    });

}

function getUserUid() {
    return firebase.auth().currentUser.uid;
}

function initApp() {

    // document.getElementById('sign-in').addEventListener('click', handleSignIn, false);
    document.getElementById('sign-in-google').addEventListener('click', handleGoogleSignIn, false);
    if (sessionStorage.getItem('login_task')) {
        $("#uploadModal").modal()
        sessionStorage.removeItem('login_task');
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                sessionStorage.clear();
                if (result.additionalUserInfo.isNewUser == true) {
                    console.log("new user")
                    saveUserInformation(user);
                } else {
                    console.log("go to new page")
                    $("#uploadModal .close").click()
                    window.location.href = './tasks.html';
                }
            } else {
                $("#uploadModal .close").click();
                alert("未提供帳戶資訊");
            }
        }).catch(function(error) {
            $("#uploadModal .close").click();
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert("密碼錯誤");
                passwordWrong.removeAttribute("hidden");
            } else if (errorCode === 'auth/network-request-failed') {
                alert("網路不穩定");
            } else if (errorCode === 'auth/user-not-found') {
                emailWrong.removeAttribute("hidden");
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }

}


window.onload = function() {
    initApp();
};