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
var pdf = ""

function createPDF(storageRef, dataRef, anonymous) {
    firebase.database().ref(dataRef).once('value').then(function(snapshot) {
        var pdf_url = (snapshot.val() && snapshot.val().rent_pdf);
        let rent_name = (snapshot.val() && snapshot.val().rent_name);
        // let house_room = (snapshot.val() && snapshot.val().rent_room_name);
        let year = (snapshot.val() && snapshot.val().start_year);
        let month = (snapshot.val() && snapshot.val().start_month);
        let date = (snapshot.val() && snapshot.val().start_date);
        let pdf_name = rent_name + year + month + date


        if (pdf_url == null) {
            alert("檔案不存在！")
            window.close()
        } else if (anonymous == true) {
            let pdf_anonymous = (snapshot.val() && snapshot.val().rent_anonymous);
            if (pdf_anonymous == true) {
                pdf = new PDFAnnotate('pdf-container', pdf_url, storageRef + "/" + pdf_name, dataRef, {
                    onPageUpdated: (page, oldData, newData) => {
                        console.log(page, oldData, newData);
                    }
                });
            } else {
                alert("連結已失效！")
                window.close()
            }
        } else {
            pdf = new PDFAnnotate('pdf-container', pdf_url, storageRef + "/" + pdf_name, dataRef, {
                onPageUpdated: (page, oldData, newData) => {
                    console.log(page, oldData, newData);
                }
            });
        }
    });
}

function enableMove(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    $(element).addClass('active');
    pdf.enableMove();
}

function enableSelector(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    $(element).addClass('active');
    pdf.enableSelector();
}

// pencile = false

function enablePencil(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    // if (pencile == true) {
    //     $(element).removeClass('active');
    //     pdf.enableSelector();
    //     pencile = false
    // } else {
    //     pencile = true
    $(element).addClass('active');
    pdf.enablePencil();
    // pencile = true
    // }
}

function enableAddText(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    $(element).addClass('active');
    pdf.enableAddText();
}

function enableAddImage(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    $(element).addClass('active');
    pdf.enableAddImage();
}

function enableAddArrow(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    $(element).addClass('active');
    pdf.enableAddArrow();
}

function enableRectangle(event) {
    event.preventDefault();
    var element = ($(event.target).hasClass('tool-button')) ? $(event.target) : $(event.target).parents('.tool-button').first();
    $('.tool-button.active').removeClass('active');
    $(element).addClass('active');
    pdf.setColor('rgba(255, 0, 0, 0.3)');
    pdf.setBorderColor('blue');
    pdf.enableRectangle();
}

function deleteSelectedObject(event) {
    event.preventDefault();
    pdf.deleteSelectedObject();
}

function savePDF() {
    // $('#uploadModal').modal("show");
    pdf.savePdf()
}

function clearPage() {
    pdf.clearActivePage();
}

function showPdfData() {
    var string = pdf.serializePdf();
    $('#dataModal .modal-body pre').first().text(string);
    PR.prettyPrint();
    $('#dataModal').modal('show');
}

$(function() {
    $('.color-tool').click(function() {
        $('.color-tool.active').removeClass('active');
        $(this).addClass('active');
        color = $(this).get(0).style.backgroundColor;
        pdf.setColor(color);
    });

    // $('#brush-size').change(function() {
    //     var width = $(this).val();
    //     pdf.setBrushSize(width);
    // });

    // $('#font-size').change(function() {
    //     var font_size = $(this).val();
    //     pdf.setFontSize(font_size);
    // });
});
//get user profile
function setUserData() {
    firebase.database().ref('users/' + getUserUid()).once('value').then(function(snapshot) {
        var position = (snapshot.val() && snapshot.val().position);
        if (position != "管理員" && position != "會計" && position != "工務") {
            alert("請勿越權！達3次將封鎖帳號")
            window.location.href = './index.html';
            return;
        } else {
            let params = checkURL();
            createPDF(params[0], params[1], false);
        }
    });

}

function checkURL() {
    let params = new URLSearchParams(location.search);
    let storageRef = params.get('stref')
    let dataRef = params.get('dataref')


    if (storageRef == null || dataRef == null) {
        alert("連結有誤，請聯絡管理員");
        window.location.href = './index.html';
    }
    return [storageRef, dataRef]
}

function getUserUid() {
    return firebase.auth().currentUser.uid;
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
        } else {
            //window.location.href = './login.html';
            let params = checkURL();
            createPDF(params[0], params[1], true);
        }

        // [END_EXCLUDE]
    });
}

window.onload = function() {
    initApp();
};