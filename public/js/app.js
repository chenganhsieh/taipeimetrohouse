'use strict';
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

/* eslint-disable */
/* eslint-env jquery */
/* global moment, tui, chance */
/* global findCalendar, CalendarList, ScheduleList, generateSchedule */
var houseRoomNum = [];
var housesId = [];
var houseName = [];
var roomsId = [];
var pdf_file;
var room_number_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var select_roomId_list = [];

(function(window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = false;
    var useDetailPopup = false;
    var datePicker, selectedCalendar;


    cal = new Calendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        calendars: CalendarList,
        template: {
            // milestone: function(model) {
            //     return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>';
            // },
            allday: function(schedule) {
                return getTimeTemplate(schedule, true);
            },
            // time: function(schedule) {
            //     return getTimeTemplate(schedule, false);
            // }
        }
    });

    // event handlers
    cal.on({
        'clickMore': function(e) {
            console.log('clickMore', e);
        },
        'clickSchedule': function(e) {
            console.log('clickSchedule', e);
            detail_fix_rent_data(e)
        },
        'clickDayname': function(date) {
            console.log('clickDayname', date);
        },
        'beforeCreateSchedule': function(e) {
            console.log('beforeCreateSchedule', e);
            saveNewSchedule(e);
        },
        'beforeUpdateSchedule': function(e) {
            var schedule = e.schedule;
            var changes = e.changes;

            console.log('beforeUpdateSchedule', e);

            if (changes && !changes.isAllDay && schedule.category === 'allday') {
                changes.category = 'time';
            }
            if (changes.category == 'time') {
                cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
                let updates_data = {}
                if (changes.start != null) {
                    var start_date = formatTime(changes.start)
                } else {
                    var start_date = e.schedule.start
                }
                if (changes.end != null) {
                    var end_date = formatTime(changes.end);
                } else {
                    var end_date = e.schedule.end
                }
                let task_start_date = new Date(start_date);
                let task_end_date = new Date(end_date);
                let getStartTimeYear = task_start_date.getFullYear();
                let getStartTimeMonth = task_start_date.getMonth() + 1;
                let getStartTimeDate = task_start_date.getDate();
                let getEndTimeYear = task_end_date.getFullYear();
                let getEndTimeMonth = task_end_date.getMonth() + 1;
                let getEndTimeDate = task_end_date.getDate();
                updates_data['start_timesecond'] = task_start_date.getTime()
                updates_data['end_timesecond'] = task_end_date.getTime()
                updates_data['start_year'] = getStartTimeYear
                updates_data['end_year'] = getEndTimeYear
                updates_data['start_month'] = getStartTimeMonth
                updates_data['end_month'] = getEndTimeMonth
                updates_data['start_date'] = getStartTimeDate
                updates_data['end_date'] = getEndTimeDate
                firebase.database().ref('rooms_rent/' + schedule.calendarId + "/" + schedule.id).update(updates_data).then(function() {
                    setSchedules()
                }).catch(function(error) {
                    alert(error);
                });
            }
        },
        'beforeDeleteSchedule': function(e) {
            console.log('beforeDeleteSchedule', e);
            cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        },
        'afterRenderSchedule': function(e) {
            var schedule = e.schedule;
            // var element = cal.getElement(schedule.id, schedule.calendarId);
            // console.log('afterRenderSchedule', element);
        },
        'clickTimezonesCollapseBtn': function(timezonesCollapsed) {
            console.log('timezonesCollapsed', timezonesCollapsed);

            if (timezonesCollapsed) {
                cal.setTheme({
                    'week.daygridLeft.width': '77px',
                    'week.timegridLeft.width': '77px'
                });
            } else {
                cal.setTheme({
                    'week.daygridLeft.width': '60px',
                    'week.timegridLeft.width': '60px'
                });
            }

            return true;
        }
    });

    function getUserPosition() {
        return firebase.database().ref('/users/' + getUserUid()).once('value').then(function(snapshot) {
            var position = (snapshot.val().position) || '訪客';
            return position
        });
    }

    function detail_fix_rent_data(eventData) {
        let res = getUserPosition()
        res.then(data => {
            var user_status = data
            let rent_dataId = eventData.schedule.id
            let room_id = eventData.schedule.calendarId
            let house_name = eventData.schedule.title
            let room_deposit = eventData.schedule.raw.creator.company || '無';
            let room_person = eventData.schedule.raw.creator.name || '無';
            let room_phone = eventData.schedule.raw.creator.phone || '無';
            let room_email = eventData.schedule.raw.creator.email || '無';
            let room_userid = eventData.schedule.raw.creator.bug || '無';
            let room_money = eventData.schedule.raw.creator.avatar || '無';
            let room_start_date = eventData.schedule.start || '無';
            let room_end_date = eventData.schedule.end || '無';
            let read_start_date = formatTime(room_start_date)
            let read_end_date = formatTime(room_end_date)
            let room_contract = eventData.schedule.raw.memo;
            let getStartTimeYear = room_start_date.getFullYear()
            let getStartTimeMonth = room_start_date.getMonth() + 1
            let getStartDate = room_start_date.getDate();
            let pdfName = house_name + getStartTimeYear + getStartTimeMonth + getStartDate;
            let storageRef = 'rooms_rent/' + room_id + "/" + room_start_date.getFullYear() + (room_start_date.getMonth() + 1) + "/" + rent_dataId
            let databaeRef = 'rooms_rent/' + room_id + "/" + rent_dataId;


            if (user_status == "管理員" || user_status == "會計") {
                let show_date = read_start_date + "~" + read_end_date + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById("room_device_header").innerHTML = house_name + "房間"
                document.getElementById('room_deposit1').innerHTML = room_deposit + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById('room_person1').innerHTML = room_person + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById('room_phone1').innerHTML = room_phone + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById('room_email1').innerHTML = room_email + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById('room_userid1').innerHTML = room_userid + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById('room_money1').innerHTML = room_money + "<i class='fas fa-edit ml-2'></i>"
                document.getElementById('room_date1').innerHTML = show_date
                document.getElementById('room_contract_div').removeAttribute("hidden")
                document.getElementById("sendEmailInfo").setAttribute("hidden", true);

                if (room_contract != null && room_contract != "") {
                    document.getElementById('room_contract_div').innerHTML = '<button class="btn btn-primary text-lg font-weight-bold mb-1" id="room_contract" >x</button>'
                    document.getElementById('room_contract').innerHTML = house_name + ".pdf"
                        // document.getElementById('room_contract').setAttribute('onclick', 'openContract(' + room_contract + ')')
                    let fix_contract_html = document.createElement('i');
                    fix_contract_html.setAttribute('id', "room_contract_fix");
                    fix_contract_html.setAttribute('class', "fas fa-edit ml-2");
                    document.getElementById('room_contract_div').appendChild(fix_contract_html)
                    document.getElementById('room_contract').addEventListener('click', function() {
                        openContract(storageRef, databaeRef)
                    })
                } else {
                    document.getElementById('room_contract_div').innerHTML = '<a class="text-lg font-weight-bold text-primary mb-1" id="room_contract" target="_blank">x</a>'
                    document.getElementById('room_contract').innerHTML = "未上傳"
                    document.getElementById('room_contract').removeAttribute('href')
                    let fix_contract_html = document.createElement('i');
                    fix_contract_html.setAttribute('id', "room_contract_fix");
                    fix_contract_html.setAttribute('class', "fas fa-edit ml-2");
                    document.getElementById('room_contract_div').appendChild(fix_contract_html)

                }
                fix_data_byId(room_id, rent_dataId, 'room_person1', "房客", "input", "form-control", room_person.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_date1', "租期", "input", "form-control", show_date.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_phone1', "手機", "input", "form-control", room_phone.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_email1', "信箱", "input", "form-control", room_email.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_userid1', "身分證", "input", "form-control", room_userid.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_money1', "租金", "input", "form-control", room_money.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_deposit1', '押金', 'input', 'form-control', room_deposit.split("<")[0], eventData);
                fix_data_byId(room_id, rent_dataId, 'room_contract_fix', '契約', 'input', 'form-control', house_name, eventData);
                document.getElementById("fix_modal_cancel").addEventListener('click', function() {
                    $("#fix_data_modal .close").click();
                })
                document.getElementById('del_data').removeAttribute('hidden')
                $('#del_data').off('click').click(function() {
                    firebase.database().ref('rooms_rent/' + room_id + "/" + rent_dataId).remove().then(function() {
                        cal.deleteSchedule(rent_dataId, room_id);
                        $("#rent_detail_modal .close").click();
                    }).catch(function(error) {
                        alert(error);
                    });
                });
                $("#send_invite").off('click').click(function() {
                    // let temp_databaseRef = 'temp_sign_data/';
                    var newRef = firebase.database().ref(databaeRef);
                    let send_link = "https://us-central1-taipeimetrohouse.cloudfunctions.net/sendMail?dest=" +
                        room_email + '&username=' + room_person + '&house=' + house_name + '&url=' + "https://taipeimetrohouse.web.app/pdf.html" + "&stref=" + storageRef + "&dataref=" + databaeRef
                    if (room_email != "無" && room_email != null && room_contract != null) {
                        $.ajax({
                            url: send_link,
                            type: 'GET',
                            success: function() {
                                let invite_data = {}
                                invite_data['rent_anonymous'] = true
                                    // invite_data['start_month'] = getStartTimeMonth
                                    // invite_data['rent_pdf'] = room_contract
                                    // invite_data['start_date'] = getStartDate
                                    // invite_data['rent_name'] = house_name
                                newRef.update(invite_data).then(function() {
                                    document.getElementById("sendEmailInfo").innerHTML = "寄送成功"
                                    document.getElementById("sendEmailInfo").removeAttribute("hidden");
                                    console.log("success");
                                }).catch(function(error) {
                                    alert(error);
                                });

                            }
                        });


                    } else
                    if (room_email == null) {
                        document.getElementById("sendEmailInfo").innerHTML = "沒有email資訊"
                        document.getElementById("sendEmailInfo").removeAttribute("hidden");
                    } else if (room_contract == null) {
                        document.getElementById("sendEmailInfo").innerHTML = "未上傳契約"
                        document.getElementById("sendEmailInfo").removeAttribute("hidden");
                    }
                })
            } else {
                document.getElementById('del_data').setAttribute('hidden', true)
                document.getElementById("room_device_header").innerHTML = housename + "房間"
                document.getElementById('room_deposit1').innerHTML = room_deposit
                document.getElementById('room_person1').innerHTML = room_person
                document.getElementById('room_phone1').innerHTML = room_phone
                document.getElementById('room_email1').innerHTML = room_email
                document.getElementById('room_userid1').innerHTML = room_userid
                document.getElementById('room_money1').innerHTML = room_money
                document.getElementById('room_date1').innerHTML = read_start_date + "~" + read_end_date
                    // document.getElementById('room_contract').innerHTML = house_name + ".pdf"
                    // document.getElementById('room_contract').setAttribute('href', room_contract)
                document.getElementById('room_contract_div').setAttribute("hidden", true)
                document.getElementById("sendEmailInfo").setAttribute("hidden", true);

            }


            $('#rent_detail_modal').modal()


        })
        refreshScheduleVisibility();
    }

    function openContract(storageRef, databaseRef) {
        $("#rent_detail_modal .close").click();
        window.open('pdf.html?stref=' + storageRef + '&dataref=' + databaseRef)
    }

    function fix_data_byId(FB_task_id, rent_dataId, Ele_id, header, Cre_Ele_type, Cre_Ele_class, org_value, eventData) {
        $('#' + Ele_id).off('click').click(function() {
            $('#rent_detail_modal .close').click()
            var thisYear = new Date().getFullYear();
            var thisMonth = new Date().getMonth();
            var modal = document.getElementById("fix_modal_div");
            modal.innerHTML =
                '<label for="fix_modal_data" id="fix_modal_label">狀態</label>' +
                '<div class="text-center">' +
                '<p hidden style="font-size:1em; color:red;" id="buildTaskdateWrong">請輸入正確內容</p>' +
                '</div>'
            document.getElementById("fix_modal_label").innerHTML = "填寫" + header

            var newElement = document.createElement(Cre_Ele_type);
            newElement.setAttribute('id', "fix_modal_data");
            newElement.setAttribute('class', Cre_Ele_class);

            // if (header == "租期") {
            //     newElement.setAttribute('type', "date");
            // }
            if (header == "租期") {
                newElement.setAttribute('type', "date");
                newElement.value = org_value.split("~")[0];
                var newElement2 = document.createElement("input");
                newElement2.setAttribute('id', 'fix_modal_data2');
                newElement2.setAttribute('class', "form-control");
                newElement2.setAttribute('type', "date");
                newElement2.value = org_value.split("~")[1];
                modal.insertBefore(newElement, modal.childNodes[2]);
                modal.insertBefore(newElement2, modal.childNodes[3]);
            } else if (header == "契約") {
                newElement.setAttribute('type', "file");
                newElement.setAttribute('accept', "application/pdf, application/msword")
                modal.insertBefore(newElement, modal.childNodes[2]);
                $("#fix_modal_data").change(function() {
                    readURL(this);
                });
            } else {
                if (header == "租金" || header == "押金" || header == "手機") {
                    newElement.setAttribute('type', "number");
                }
                if (header == "房客" || header == "信箱" || header == "身分證") {
                    newElement.setAttribute('type', "text");
                }

                newElement.value = org_value;
                modal.insertBefore(newElement, modal.childNodes[2]);
            }
            $("#fix_modal_check").off('click').click(function() {
                var fix_data = document.getElementById('fix_modal_data').value;
                var updates_data = {}
                updates_data['edit_id'] = getUserUid()
                updates_data['edit_person'] = getUserName()
                updates_data['updateDate'] = firebase.database.ServerValue.TIMESTAMP
                if (header == "契約") {
                    let getStartTimeYear = eventData.schedule.start.getFullYear();
                    let getStartTimeMonth = eventData.schedule.start.getMonth() + 1;
                    let getStartTimeDate = eventData.schedule.start.getDate();
                    let pdfName = org_value + getStartTimeYear + getStartTimeMonth + getStartTimeDate;
                    let metadata = {
                        pdfFile: pdf_file.type
                    };
                    firebase.storage().ref('rooms_rent/' + FB_task_id + "/" + getStartTimeYear + getStartTimeMonth + "/" + rent_dataId + "/" + pdfName).put(pdf_file, metadata).then(function(snapshot) {
                        snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            eventData.schedule.raw.memo = downloadURL
                            updates_data['rent_pdf'] = downloadURL
                                //one for now rent data and another for history
                            firebase.database().ref('rooms_rent/' + FB_task_id + "/" + rent_dataId).update(updates_data).then(function() {
                                $("#fix_data_modal .close").click();
                                $('#rent_detail_modal').modal();
                                document.getElementById("room_contract").href = downloadURL
                                cal.updateSchedule(eventData.schedule.id, eventData.schedule.calendarId, eventData.schedule);
                                refreshScheduleVisibility();
                                pdf_file = null;
                            }).catch(function(error) {
                                alert(error);
                            });
                        });
                    });
                } else {
                    if (header == "房客") {
                        eventData.schedule.raw.creator.name = fix_data
                        updates_data['rent_name'] = fix_data
                    }
                    if (header == "租期") {
                        let start_date = fix_data
                        let end_date = document.getElementById('fix_modal_data2').value;
                        fix_data = start_date + "~" + end_date
                        let task_start_date = new Date(start_date);
                        let task_end_date = new Date(end_date);
                        let getStartTimeYear = task_start_date.getFullYear();
                        let getStartTimeMonth = task_start_date.getMonth() + 1;
                        let getStartTimeDate = task_start_date.getDate();
                        let getEndTimeYear = task_end_date.getFullYear();
                        let getEndTimeMonth = task_end_date.getMonth() + 1;
                        let getEndTimeDate = task_end_date.getDate();
                        updates_data['start_timesecond'] = task_start_date.getTime()
                        updates_data['end_timesecond'] = task_end_date.getTime()
                        updates_data['start_year'] = getStartTimeYear
                        updates_data['end_year'] = getEndTimeYear
                        updates_data['start_month'] = getStartTimeMonth
                        updates_data['end_month'] = getEndTimeMonth
                        updates_data['start_date'] = getStartTimeDate
                        updates_data['end_date'] = getEndTimeDate
                        eventData.schedule.start = task_start_date
                        eventData.schedule.end = task_end_date
                    }
                    if (header == "手機") {
                        eventData.schedule.raw.creator.phone = fix_data
                        updates_data['rent_phone'] = fix_data
                    }
                    if (header == "信箱") {
                        eventData.schedule.raw.creator.email = fix_data
                        updates_data['rent_email'] = fix_data
                    }
                    if (header == "身分證") {
                        eventData.schedule.raw.creator.bug = fix_data
                        updates_data['rent_userId'] = fix_data
                    }
                    if (header == "租金") {
                        eventData.schedule.raw.creator.avatar = fix_data
                        updates_data['rent_money'] = fix_data
                    }
                    if (header == "押金") {
                        eventData.schedule.raw.creator.company = fix_data
                        updates_data['rent_deposit'] = fix_data
                    }
                    //one for now rent data and another for history
                    firebase.database().ref('rooms_rent/' + FB_task_id + "/" + rent_dataId).update(updates_data).then(function() {
                        org_value = fix_data
                        $("#fix_data_modal .close").click();
                        $('#rent_detail_modal').modal()
                        document.getElementById(Ele_id).innerHTML = org_value + "<i class=fas fa-edit ml-2'></i>"
                        cal.updateSchedule(eventData.schedule.id, eventData.schedule.calendarId, eventData.schedule);
                        refreshScheduleVisibility();
                    }).catch(function(error) {
                        alert(error);
                    });
                }
            });
            $('#fix_data_modal').modal();
        });
    }


    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
        var html = [];
        var start = moment(schedule.start.toUTCString());
        if (!isAllDay) {
            html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(' Private');
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<span class="calendar-font-icon ic-location-b"></span>');
            }
            html.push(' ' + schedule.title);
        }

        return html.join('');
    }

    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        console.log(target);
        console.log(action);
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
        setSchedules();
    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
    }

    function onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

        if (!title) {
            alert('填寫主旨')
            return;
        }

        cal.createSchedules([{
            id: String(chance.guid()),
            calendarId: calendar.id,
            title: title,
            isAllDay: isAllDay,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            raw: {
                location: location
            },
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }

    function onChangeNewScheduleCalendar(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var calendarId = getDataAction(target);
        changeNewScheduleCalendar(calendarId);
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function createNewSchedule(event) {
        $('#add_rent_modal').modal()
        $('#buildTaskRooms').off('change').change(function() {
            changeRoomNum('add')
        });
        document.getElementById("add_modal_cancel").addEventListener('click', function() {
            $("#add_rent_modal .close").click();
            refreshScheduleVisibility();
        })
        document.getElementById('close_add_rent_modal_button').addEventListener('click', function() {
            refreshScheduleVisibility();
        })
        $("#buildRentStartDate").off('change').change(function() {
            console.log("Change")
            let min_date = document.getElementById("buildRentStartDate").value
            document.getElementById("buildRentEndDate").setAttribute("min", min_date)
        })
        $('#add_modal_check').off('click').click(function() {
            upLoadRentData();
        })
        if (useCreationPopup) {
            cal.openCreationPopup({
                start: start,
                end: end
            });
        }
    }
    //get all house data
    function setHousesData() {
        firebase.database().ref('houses/').once('value', function(snapshot) {
            var taskRooms = document.getElementById("buildTaskRooms");
            var filterRooms = document.getElementById("serachRooms");
            var filterRooms2 = document.getElementById("serachRooms2");
            var buildTaskRooms2 = document.getElementById("buildTaskRooms2");
            // var electRooms = document.getElementById("serachRoomsEle");
            snapshot.forEach(function(childSnapshot) {
                var name = (childSnapshot.val() && childSnapshot.val().name) || '訪客';
                var amount = (childSnapshot.val() && childSnapshot.val().amount);
                var houseId = (childSnapshot.val() && childSnapshot.val().id);
                var newElement = document.createElement("option");
                var newElement2 = document.createElement("option");
                var newElement3 = document.createElement("option");
                var newElement4 = document.createElement("option");
                newElement.innerHTML = name;
                newElement2.innerHTML = name;
                newElement3.innerHTML = name;
                newElement4.innerHTML = name;
                houseRoomNum.push(amount);
                filterRooms.appendChild(newElement);
                taskRooms.appendChild(newElement2);
                filterRooms2.appendChild(newElement3);
                buildTaskRooms2.appendChild(newElement4);
                // electRooms.appendChild(newElement3)
                housesId.push(houseId);
                houseName.push(name);
            });
        });
    }

    //change room num
    function changeRoomNum(type) {
        roomsId = []

        if (type == "add") {
            var taskRooms = document.getElementById("buildTaskRoomsNum");
            var taskRoomIndex = document.getElementById('buildTaskRooms').selectedIndex;
        } else if (type == "search") {
            var taskRooms = document.getElementById("serachRoomsNum");
            var taskRoomIndex = document.getElementById('serachRooms').selectedIndex;
        }
        taskRooms.innerHTML = ""
        var numOfRoom = parseInt(houseRoomNum[taskRoomIndex - 1]);
        var houseId = housesId[taskRoomIndex - 1];
        firebase.database().ref('houses/' + houseId).once('value', function(snapshot) {
            roomsId = snapshot.val().rooms
            select_roomId_list = snapshot.val().rooms
        }).then(function() {
            for (var i = 0; i < numOfRoom; i++) {
                var newElement = document.createElement("option");
                newElement.innerHTML = room_number_list[i] + "房";
                taskRooms.appendChild(newElement);
            }
        });
    }
    // upload rent data
    async function upLoadRentData() {
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];
        var taskRoomIndex = document.getElementById('buildTaskRooms').selectedIndex;
        var taskRoom = document.getElementById('buildTaskRooms').value;
        var taskRoomNumIndex = document.getElementById('buildTaskRoomsNum').selectedIndex;
        var taskRoomNum = document.getElementById('buildTaskRoomsNum').value;
        var taskStartDate = document.getElementById('buildRentStartDate').value;
        var taskEndDate = document.getElementById('buildRentEndDate').value;
        var buildRentMoney = document.getElementById('buildRentMoney').value;
        var buildRentDeposit = document.getElementById('buildRentDeposit').value;
        var buildRentPhone = document.getElementById('buildRentPhone').value;
        var buildRentEmail = document.getElementById('buildRentEmail').value;
        var buildRentUserId = document.getElementById('buildRentUserId').value;
        var buildRentName = document.getElementById("buildRentName").value;


        // if (type_index != 6 && type_index != 7 && type_index != 8) {
        // }
        taskRoomFocusOut();
        taskRoomNumFocusOut();
        taskRoomNameFocusOut();
        taskRoomPhoneFocusOut();
        taskRoomEmailFocusOut();
        taskRoomUserIdFocusOut();
        taskRoomMoneyFocusOut();
        taskRoomDepositFocusOut();
        startDateFocusOut();
        endDateFocusOut();

        if ((taskRoom.length < 1 || taskStartDate.length < 1 || taskEndDate.length < 1 || taskRoomNum < 1 || buildRentMoney.length < 1 || buildRentDeposit.length < 1 || buildRentPhone.length < 10 || buildRentName.length < 1)) {
            return;
        } else {
            taskRoom = taskRoom || "無"
            taskRoomNum = taskRoomNum || "無"
        }


        let task_start_date = new Date(taskStartDate);
        let task_end_date = new Date(taskEndDate);
        let getStartTimeYear = task_start_date.getFullYear();
        let getStartTimeMonth = task_start_date.getMonth() + 1;
        let getStartTimeDate = task_start_date.getDate();
        let getEndTimeYear = task_end_date.getFullYear();
        let getEndTimeMonth = task_end_date.getMonth() + 1;
        let getEndTimeDate = task_end_date.getDate();
        let checkRepeat = await checkRentRepeat(task_start_date.getTime(), task_end_date.getTime(), "rooms_rent/" + roomsId[taskRoomNumIndex] + "/")

        if (checkRepeat == true) {
            alert("該日期區間已有其他租約");
        } else {
            $("#add_rent_modal .close").click();
            $('#uploadModal').modal();
            var newPostKey = firebase.database().ref().child("rooms_rent/" + roomsId[taskRoomNumIndex]).push().key;
            //upload pdf to storage    
            if (pdf_file != null) {
                const pdfName = taskRoom + taskRoomNum + getStartTimeYear + getStartTimeMonth + getStartTimeDate;
                const metadata = {
                    pdfFile: pdf_file.type
                };
                firebase.storage().ref('rooms_rent/' + roomsId[taskRoomNumIndex] + "/" + getStartTimeYear + getStartTimeMonth + "/" + newPostKey + "/" + pdfName).put(pdf_file, metadata).then(function(snapshot) {
                    snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        pdf_file = null;
                        var postData = {
                            rent_id: newPostKey,
                            rent_pdf: downloadURL,
                            edit_person: getUserName(),
                            start_timesecond: task_start_date.getTime(),
                            end_timesecond: task_end_date.getTime(),
                            start_year: getStartTimeYear,
                            end_year: getEndTimeYear,
                            start_month: getStartTimeMonth,
                            end_month: getEndTimeMonth,
                            start_date: getStartTimeDate,
                            end_date: getEndTimeDate,
                            rent_name: buildRentName,
                            rent_phone: buildRentPhone,
                            rent_email: buildRentEmail,
                            rent_userId: buildRentUserId,
                            rent_money: buildRentMoney,
                            rent_deposit: buildRentDeposit,
                            rent_house_name: taskRoom,
                            rent_room_name: taskRoomNum,
                            updateDate: firebase.database.ServerValue.TIMESTAMP,
                        };
                        var updates = {};
                        updates["rooms_rent/" + roomsId[taskRoomNumIndex] + '/' + newPostKey] = postData;
                        firebase.database().ref().update(updates).then(function() {
                            // hide uploading alert
                            $("#uploadModal .close").click();
                            // show success alert
                            $('#dataUploadModal').modal();
                            document.getElementById('buildRentStartDate').value = "";
                            document.getElementById('buildRentEndDate').value = "";
                            document.getElementById('buildRentMoney').value = 0;
                            document.getElementById('buildRentDeposit').value = 0;
                            document.getElementById('buildTaskRoomsNum').selectedIndex = 0;
                            document.getElementById("buildTaskRoomsNum").value = "";
                            document.getElementById("buildTaskRooms").selectedIndex = 0;
                            document.getElementById("buildTaskRooms").value = 0;
                            document.getElementById("buildRentPhone").value = "";
                            document.getElementById("buildRentEmail").value = "";
                            document.getElementById("buildRentUserId").value = "";
                            document.getElementById("buildRentName").value = "";
                            document.getElementById("buildRentContract").value = null;
                            let room_index = houseName.indexOf(taskRoom);
                            document.getElementById('serachRooms').selectedIndex = room_index + 1
                            $('#serachRooms').change()
                            console.log(document.getElementById('serachRooms').value)
                        }).catch(function(error) {
                            console.error('Error writing user data to database', error);
                        });

                    })
                });
            } else {
                var postData = {
                    rent_id: newPostKey,
                    rent_pdf: null,
                    edit_person: getUserName(),
                    start_timesecond: task_start_date.getTime(),
                    end_timesecond: task_end_date.getTime(),
                    start_year: getStartTimeYear,
                    end_year: getEndTimeYear,
                    start_month: getStartTimeMonth,
                    end_month: getEndTimeMonth,
                    start_date: getStartTimeDate,
                    end_date: getEndTimeDate,
                    rent_name: buildRentName,
                    rent_phone: buildRentPhone,
                    rent_email: buildRentEmail,
                    rent_userId: buildRentUserId,
                    rent_money: buildRentMoney,
                    rent_deposit: buildRentDeposit,
                    rent_house_name: taskRoom,
                    rent_room_name: taskRoomNum,
                    updateDate: firebase.database.ServerValue.TIMESTAMP,
                };
                var updates = {};
                updates["rooms_rent/" + roomsId[taskRoomNumIndex] + '/' + newPostKey] = postData;
                firebase.database().ref().update(updates).then(function() {
                    // hide uploading alert
                    $("#uploadModal .close").click();
                    // show success alert
                    $('#dataUploadModal').modal();
                    document.getElementById('buildRentStartDate').value = "";
                    document.getElementById('buildRentEndDate').value = "";
                    document.getElementById('buildRentMoney').value = 0;
                    document.getElementById('buildRentDeposit').value = 0;
                    document.getElementById('buildTaskRoomsNum').selectedIndex = 0;
                    document.getElementById("buildTaskRoomsNum").value = "";
                    document.getElementById("buildTaskRooms").selectedIndex = 0;
                    document.getElementById("buildTaskRooms").value = 0;
                    document.getElementById("buildRentPhone").value = "";
                    document.getElementById("buildRentEmail").value = "";
                    document.getElementById("buildRentUserId").value = "";
                    document.getElementById("buildRentName").value = "";
                    document.getElementById("buildRentContract").value = null;
                    let room_index = houseName.indexOf(taskRoom);
                    document.getElementById('serachRooms').selectedIndex = room_index + 1
                    $('#serachRooms').change()
                    console.log(document.getElementById('serachRooms').value)
                    pdf_file = null
                }).catch(function(error) {
                    console.error('Error writing user data to database', error);
                });
            }

        }

    }

    function checkRentRepeat(startDate, endDate, checkRef) {
        let check = false;
        return firebase.database().ref(checkRef).orderByChild("end_timesecond").startAt(startDate).once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let val = childSnapshot.val();
                if (val.start_timesecond < endDate) {
                    check = true

                    return true
                }
            });
        }).then(function() {
            return check;
        }).catch(function(error) {
            console.log(error)
            alert("網路不穩定");
            return true;
        });

    }

    function getUserName() {
        if (sessionStorage.getItem('userName') != null && sessionStorage.getItem('userName') != "") {
            return sessionStorage.getItem('userName');
        }
        return firebase.auth().currentUser.displayName;
    }

    function getUserUid() {
        return firebase.auth().currentUser.uid;
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

    function taskRoomNumFocusOut() {
        var taskRoomNum = document.getElementById('buildTaskRoomsNum').value;
        var buildTaskRoomsNumWrong = document.getElementById('buildTaskRoomsNumWrong');
        if (taskRoomNum.length < 1) {
            buildTaskRoomsNumWrong.removeAttribute("hidden");
        } else {
            buildTaskRoomsNumWrong.setAttribute('hidden', 'true');
        }
    }

    function taskRoomNameFocusOut() {
        var buildRentName = document.getElementById('buildRentName').value;
        var buildRentNameWrong = document.getElementById('buildRentNameWrong');
        if (buildRentName.length < 1) {
            buildRentNameWrong.removeAttribute("hidden");
        } else {
            buildRentNameWrong.setAttribute('hidden', 'true');
        }
    }

    function taskRoomPhoneFocusOut() {
        var buildRentPhone = document.getElementById('buildRentPhone').value;
        var buildRentPhoneWrong = document.getElementById('buildRentPhoneWrong');
        if (buildRentPhone.length < 10) {
            buildRentPhoneWrong.removeAttribute("hidden");
        } else {
            buildRentPhoneWrong.setAttribute('hidden', 'true');
        }
    }

    function taskRoomEmailFocusOut() {
        var buildRentEmail = document.getElementById('buildRentEmail').value;
        var buildRentEmailWrong = document.getElementById('buildRentEmailWrong');
        if (buildRentEmail.length < 1 || buildRentEmail.indexOf('@') == -1) {
            buildRentEmailWrong.removeAttribute("hidden");
        } else {
            buildRentEmailWrong.setAttribute('hidden', 'true');
        }
    }

    function taskRoomUserIdFocusOut() {
        var buildRentUserId = document.getElementById('buildRentUserId').value;
        var buildRentUserIdWrong = document.getElementById('buildRentUserIdWrong');
        if (buildRentUserId.length < 1) {
            buildRentUserIdWrong.removeAttribute("hidden");
        } else {
            buildRentUserIdWrong.setAttribute('hidden', 'true');
        }
    }

    function taskRoomMoneyFocusOut() {
        var buildRentMoney = document.getElementById('buildRentMoney').value;
        var buildRentMoneyWrong = document.getElementById('buildRentMoneyWrong');
        if (buildRentMoney.length < 1) {
            buildRentMoneyWrong.removeAttribute("hidden");
        } else {
            buildRentMoneyWrong.setAttribute('hidden', 'true');
        }
    }

    function taskRoomDepositFocusOut() {
        var buildRentDeposit = document.getElementById('buildRentDeposit').value;
        var buildRentDepositWrong = document.getElementById('buildRentDepositWrong');
        if (buildRentDeposit.length < 1) {
            buildRentDepositWrong.removeAttribute("hidden");
        } else {
            buildRentDepositWrong.setAttribute('hidden', 'true');
        }
    }

    function endDateFocusOut() {
        //var taskdate = document.getElementById('buildTaskdate').value;
        var taskdate = document.getElementById('buildRentEndDate')
        var buildRentEndDateWrong = document.getElementById('buildRentEndDateWrong');
        if (taskdate.value.length < 1) {
            buildRentEndDateWrong.removeAttribute("hidden")
        } else {
            buildRentEndDateWrong.setAttribute('hidden', 'true');
        }
    }

    function startDateFocusOut() {
        //var taskdate = document.getElementById('buildTaskdate').value;
        var taskdate = document.getElementById('buildRentStartDate')
        var buildRentStartDaterong = document.getElementById('buildRentStartDateWrong');
        if (taskdate.value.length < 1) {
            buildRentStartDaterong.removeAttribute("hidden")
        } else {
            buildRentStartDaterong.setAttribute('hidden', 'true');
        }
    }
    //yyyy-mm-dd
    function formatTime(date) {
        var formatted_date = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2)
        return formatted_date;
    }

    function saveNewSchedule(scheduleData) {
        var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        document.getElementById('buildRentStartDate').value = formatTime(scheduleData.start);
        document.getElementById('buildRentEndDate').value = formatTime(scheduleData.end);
        $('#add_rent_modal').modal()
        $('#buildTaskRooms').off('change').change(function() {
            changeRoomNum('add');
        });
        $("#buildRentStartDate").off('change').change(function() {
            console.log("Change")
            let min_date = document.getElementById("buildRentStartDate").value
            document.getElementById("buildRentEndDate").setAttribute("min", min_date)
        })
        document.getElementById("add_modal_cancel").addEventListener('click', function() {
            $("#add_rent_modal .close").click();
            refreshScheduleVisibility();
        })
        document.getElementById('close_add_rent_modal_button').addEventListener('click', function() {
            refreshScheduleVisibility();
        })
        $('#add_modal_check').off('click').click(function() {
            $("#add_rent_modal .close").click();
            upLoadRentData();
        })
    }

    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        console.log(calendarId)
        console.log(checked)
        if (checked == true && calendarId != "all") {
            let room_index = select_roomId_list.indexOf(calendarId)
            console.log(room_index)
            if (room_index == -1) {
                select_roomId_list.push(calendarId)
            }
        } else if (calendarId != "all" && checked == false) {
            let room_index = select_roomId_list.indexOf(calendarId)
            console.log(room_index)
            if (room_index > -1) {
                select_roomId_list.splice(room_index, 1);
            }
        } else if (calendarId == "all" && checked == true) {
            select_roomId_list = roomsId
        } else {
            select_roomId_list = []
        }
        console.log(select_roomId_list)
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function(input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function(calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function(input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function(calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render(true);

        calendarElements.forEach(function(input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });
    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function currentCalendarDate(format) {
        var currentDate = moment([cal.getDate().getFullYear(), cal.getDate().getMonth(), cal.getDate().getDate()]);

        return currentDate.format(format);
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();

        var html = [];
        if (viewName === 'day') {
            html.push(currentCalendarDate('YYYY.MM.DD'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(currentCalendarDate('YYYY.MM'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
            html.push(' ~ ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
        }
        renderRange.innerHTML = html.join('');
    }

    function setSchedules() {
        cal.clear();
        console.log(CalendarList.length)
        let renderStart = cal.getDateRangeStart()
        let renderEnd = cal.getDateRangeEnd()
        CalendarList.forEach(function(calendar) {
            firebase.database().ref('rooms_rent/' + calendar.id).orderByChild('start_timesecond').startAt(renderStart.getTime()).endAt(renderEnd.getTime()).on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var schedule_id = childSnapshot.val().rent_id
                    var name = childSnapshot.val().rent_name;
                    var money = childSnapshot.val().rent_money;
                    var phone = childSnapshot.val().rent_phone;
                    var email = childSnapshot.val().rent_email;
                    var userId = childSnapshot.val().rent_userId;
                    var deposit = childSnapshot.val().rent_deposit;
                    var house_name = childSnapshot.val().rent_house_name;
                    var room_name = childSnapshot.val().rent_room_name;
                    var start_timesecond = childSnapshot.val().start_timesecond;
                    var end_timesecond = childSnapshot.val().end_timesecond;
                    var rent_contract = childSnapshot.val().rent_pdf

                    var schedule = new ScheduleInfo();
                    cal.deleteSchedule(schedule_id, calendar.id);
                    schedule.id = schedule_id;
                    schedule.calendarId = calendar.id;
                    schedule.title = house_name + room_name;
                    schedule.body = 'None';
                    schedule.isReadOnly = false;
                    schedule.category = 'allday'
                    var startDate = moment(start_timesecond)
                    var endDate = moment(end_timesecond);
                    schedule.start = startDate.toDate();
                    schedule.end = endDate.toDate();

                    schedule.isPrivate = false;
                    schedule.attendees = name;
                    schedule.recurrenceRule = '';
                    schedule.state = 'Busy';
                    schedule.color = calendar.color;
                    schedule.bgColor = calendar.bgColor;
                    schedule.dragBgColor = calendar.dragBgColor;
                    schedule.borderColor = calendar.borderColor;

                    schedule.raw.memo = rent_contract;
                    schedule.raw.creator.name = name;
                    schedule.raw.creator.avatar = money;
                    schedule.raw.creator.company = deposit;
                    schedule.raw.creator.email = email;
                    schedule.raw.creator.bug = userId;
                    schedule.raw.creator.phone = phone;
                    console.log(schedule)
                    cal.createSchedules([schedule]);
                    refreshScheduleVisibility();
                });
            });
            firebase.database().ref('rooms_rent/' + calendar.id).orderByChild('end_timesecond').startAt(renderStart.getTime()).endAt(renderEnd.getTime()).on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    let start_timesecond = childSnapshot.val().start_timesecond;
                    if (start_timesecond < renderStart.getTime()) {
                        var schedule_id = childSnapshot.val().rent_id
                        var name = childSnapshot.val().rent_name;
                        var money = childSnapshot.val().rent_money;
                        var phone = childSnapshot.val().rent_phone;
                        var email = childSnapshot.val().rent_email;
                        var userId = childSnapshot.val().rent_userId;
                        var deposit = childSnapshot.val().rent_deposit;
                        var house_name = childSnapshot.val().rent_house_name;
                        var room_name = childSnapshot.val().rent_room_name;
                        var end_timesecond = childSnapshot.val().end_timesecond;
                        var rent_contract = childSnapshot.val().rent_pdf

                        var schedule = new ScheduleInfo();
                        cal.deleteSchedule(schedule_id, calendar.id);
                        schedule.id = schedule_id;
                        schedule.calendarId = calendar.id;
                        schedule.title = house_name + room_name;
                        schedule.body = 'None';
                        schedule.isReadOnly = false;
                        schedule.category = 'allday'
                        var startDate = moment(start_timesecond)
                        var endDate = moment(end_timesecond);
                        schedule.start = startDate.toDate();
                        schedule.end = endDate.toDate();

                        schedule.isPrivate = false;
                        schedule.attendees = name;
                        schedule.recurrenceRule = '';
                        schedule.state = 'Busy';
                        schedule.color = calendar.color;
                        schedule.bgColor = calendar.bgColor;
                        schedule.dragBgColor = calendar.dragBgColor;
                        schedule.borderColor = calendar.borderColor;

                        schedule.raw.memo = rent_contract;
                        schedule.raw.creator.name = name;
                        schedule.raw.creator.avatar = money;
                        schedule.raw.creator.company = deposit;
                        schedule.raw.creator.email = email;
                        schedule.raw.creator.bug = userId;
                        schedule.raw.creator.phone = phone;
                        console.log(schedule)
                        cal.createSchedules([schedule]);
                        refreshScheduleVisibility();
                    }
                });
            });
            firebase.database().ref('rooms_rent/' + calendar.id).orderByChild('end_timesecond').startAt(renderEnd.getTime()).on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    let start_timesecond = childSnapshot.val().start_timesecond;
                    let end_timesecond = childSnapshot.val().end_timesecond;
                    let schedule_id = childSnapshot.val().rent_id
                    let event = cal.getElement(schedule_id, calendar.id)

                    if (start_timesecond < renderStart.getTime() && renderEnd.getTime() < end_timesecond && event == null) {
                        var name = childSnapshot.val().rent_name;
                        var money = childSnapshot.val().rent_money;
                        var phone = childSnapshot.val().rent_phone;
                        var email = childSnapshot.val().rent_email;
                        var userId = childSnapshot.val().rent_userId;
                        var deposit = childSnapshot.val().rent_deposit;
                        var house_name = childSnapshot.val().rent_house_name;
                        var room_name = childSnapshot.val().rent_room_name;
                        var rent_contract = childSnapshot.val().rent_pdf

                        var schedule = new ScheduleInfo();
                        cal.deleteSchedule(schedule_id, calendar.id);
                        schedule.id = schedule_id;
                        schedule.calendarId = calendar.id;
                        schedule.title = house_name + room_name;
                        schedule.body = 'None';
                        schedule.isReadOnly = false;
                        schedule.category = 'allday'
                        var startDate = moment(start_timesecond)
                        var endDate = moment(end_timesecond);
                        schedule.start = startDate.toDate();
                        schedule.end = endDate.toDate();

                        schedule.isPrivate = false;
                        schedule.attendees = name;
                        schedule.recurrenceRule = '';
                        schedule.state = 'Busy';
                        schedule.color = calendar.color;
                        schedule.bgColor = calendar.bgColor;
                        schedule.dragBgColor = calendar.dragBgColor;
                        schedule.borderColor = calendar.borderColor;

                        schedule.raw.memo = rent_contract;
                        schedule.raw.creator.name = name;
                        schedule.raw.creator.avatar = money;
                        schedule.raw.creator.company = deposit;
                        schedule.raw.creator.email = email;
                        schedule.raw.creator.bug = userId;
                        schedule.raw.creator.phone = phone;
                        console.log(schedule)
                        cal.createSchedules([schedule]);
                        refreshScheduleVisibility();
                    }
                });
            });
        });
        //generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
        // cal.createSchedules(ScheduleList);

        // refreshScheduleVisibility();
    }

    // set calendars
    function setCalendars() {
        $('#serachRooms').change(function() {
            CalendarList = []
            var taskRooms = document.getElementById("serachRoomsNum");
            var taskRoomIndex = document.getElementById('serachRooms').selectedIndex;
            var houseId = housesId[taskRoomIndex - 1];
            var numOfRoom = parseInt(houseRoomNum[taskRoomIndex - 1]);
            var room_number_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
            var calendar_color_list = ['#9e5fff', '#00a9ff', '#ff5583', '#03bd9e', '#bbdc00', '#9d9d9d', '#ffbb3b', '#ff4040', '#FFD306', '#804040']

            firebase.database().ref('houses/' + houseId).once('value', function(snapshot) {
                roomsId = snapshot.val().rooms
                select_roomId_list = snapshot.val().rooms
            }).then(function() {
                for (var i = 0; i < numOfRoom; i++) {
                    var calendar;
                    calendar = new CalendarInfo();
                    calendar.id = roomsId[i]
                    calendar.name = room_number_list[i] + "房";
                    calendar.color = '#ffffff'
                    calendar.bgColor = calendar_color_list[i];
                    calendar.dragBgColor = calendar_color_list[i];
                    calendar.borderColor = calendar_color_list[i];
                    addCalendar(calendar);
                    if (i == numOfRoom - 1) {
                        var calendarList = document.getElementById('calendarList');
                        var html = [];
                        CalendarList.forEach(function(calendar) {
                            html.push('<div class="lnb-calendars-item"><label>' +
                                '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
                                '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
                                '<span>' + calendar.name + '</span>' +
                                '</label></div>'
                            );
                        });
                        calendarList.innerHTML = html.join('\n');
                        setSchedules()
                    }
                }
            });

        })
    }


    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-save-schedule').on('click', onNewSchedule);
        $('#btn-new-schedule').on('click', createNewSchedule);

        $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);
        $("#buildRentContract").change(function() {
            readURL(this);
        });

        window.addEventListener('resize', resizeThrottled);
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

        pdf_file = input.files[0];

        if (pdf_file.size > 10485760) {
            alert("請選擇小於10MB的檔案");
            return
        }
        const validImageTypes = ['application/pdf', 'application/msword'];

        if (input.files && input.files[0]) {
            const file = input.files[0];
            const fileType = file['type'];

            if (input.files[0]) {}

            if (!validImageTypes.includes(fileType)) {
                alert("請選擇PDF或Word");
                return;
            }
            var reader = new FileReader();

            reader.onload = function(e) {
                console.log("file load")
            }

            reader.readAsDataURL(input.files[0]); // convert to base64 string
            //document.getElementById("buildRentContract").value = null;
        }
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    function downloadMonthlyData() {
        document.getElementById('export_data').addEventListener('click', function() {
            let taskRoomIndex = document.getElementById('serachRooms').selectedIndex;
            let taskHouseName = document.getElementById('serachRooms').value;
            if (taskRoomIndex == 0 || document.getElementById('serachRooms').value == "") {
                alert("請先選擇房源");
            } else {
                //use dataTable as output xlsx method
                $('#rentDataTable').DataTable().destroy();
                let taskIngData = document.getElementById("rentIngData");
                taskIngData.innerHTML = "";
                document.getElementById("rentIngHeader").innerHTML =
                    '<tr>' +
                    '<th>案源</th>' +
                    '<th>房別</th>' +
                    '<th>租客姓名</th>' +
                    '<th>租金</th>' +
                    '<th>實際繳交金額</th>' +
                    '<th>電費</th>' +
                    '<th>入帳方式</th>' +
                    '<th>入帳金額</th>' +
                    '<th>入帳時間</th>' +
                    '</tr>';
                let select_year = cal.getDate().getFullYear();
                let select_month = cal.getDate().getMonth() + 1;
                let outputData = {}
                let check_finish = 0
                for (let i = 0; i < select_roomId_list.length; i++) {
                    let time_range_start = new Date(select_year, select_month, 1, 0, 0, 0).getTime();
                    let time_range_end = new Date(select_year, select_month + 1, 0, 0, 0, 0).getTime();


                    firebase.database().ref('rooms_rent/' + select_roomId_list[i]).orderByChild('end_timesecond').startAt(time_range_start).once('value', function(snapshot) {
                        if (snapshot.numChildren() != 0) {
                            let child_length = snapshot.numChildren()
                            let temp_amount = 0
                            snapshot.forEach(function(childSnapshot) {

                                temp_amount += 1
                                if (childSnapshot.val().start_timesecond < time_range_end) {
                                    let temp_house = childSnapshot.val().rent_house_name
                                    let temp_room = childSnapshot.val().rent_room_name
                                    if (!outputData.hasOwnProperty(temp_house)) {
                                        outputData[temp_house] = {}
                                    }
                                    if (!outputData[temp_house].hasOwnProperty(temp_room)) {
                                        outputData[temp_house][temp_room] = {}
                                    }
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name] = {}
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['rent_id'] = childSnapshot.val().rent_id
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['month'] = select_month
                                        // outputData[temp_name]['room'] = childSnapshot.val().rent_room_name
                                        // outputData[temp_name]['task'] = childSnapshot.val().rent_house_name
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['money'] = childSnapshot.val().rent_money
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['pay_money'] = 0
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['pay_money_detail'] = ""
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['pay_time'] = ""
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['pay_method'] = ""
                                    outputData[temp_house][temp_room][childSnapshot.val().rent_name]['ele_money'] = 0

                                }
                                if (child_length == temp_amount) {
                                    check_finish += 1
                                }
                            });
                        } else {

                            let temp_room_index = roomsId.indexOf(select_roomId_list[i])
                            let temp_room_num = room_number_list[temp_room_index]


                            if (!outputData.hasOwnProperty(taskHouseName)) {
                                outputData[taskHouseName] = {}
                            }
                            if (!outputData[taskHouseName].hasOwnProperty(temp_room_num + "房")) {
                                outputData[taskHouseName][temp_room_num + "房"] = {}
                            }
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"] = {}


                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['rent_id'] = "none"
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['month'] = select_month
                                // temp_data['task'] = taskHouseName
                                // temp_data['room'] = temp_room_num + "房"
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['money'] = "未知"
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['pay_money'] = 0
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['pay_money_detail'] = ""
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['pay_time'] = ""
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['pay_method'] = ""
                            outputData[taskHouseName][temp_room_num + "房"]["無承租人"]['ele_money'] = 0

                            check_finish += 1
                        }
                    }).then(function() {
                        if (check_finish == select_roomId_list.length) {
                            let check_finish2 = 0
                            for (let j = 0; j < select_roomId_list.length; j++) {
                                firebase.database().ref('rent_money/' + select_roomId_list[j] + '/' + select_year + '/' + select_month).once('value', function(snapshot) {
                                    if (snapshot.numChildren() != 0) {
                                        let child_length = snapshot.numChildren()
                                        let temp_amount = 0

                                        snapshot.forEach(function(childSnapshot) {
                                            temp_amount += 1

                                            let pay_person = childSnapshot.val().pay_person
                                            let room_num = childSnapshot.val().roomNum
                                            let house_name = childSnapshot.val().houseName
                                            let pay_amount = childSnapshot.val().pay_money
                                            let pay_method = childSnapshot.val().pay_method
                                            let pay_date = childSnapshot.val().pay_date


                                            outputData[house_name][room_num][pay_person]['pay_money'] += parseInt(pay_amount)
                                            outputData[house_name][room_num][pay_person]['pay_money_detail'] += pay_amount + '/'
                                            outputData[house_name][room_num][pay_person]['pay_time'] += pay_date + '/'

                                            if (pay_method == "transfer") {
                                                outputData[house_name][room_num][pay_person]['pay_method'] = '匯款'
                                            } else {
                                                outputData[house_name][room_num][pay_person]['pay_method'] = '現金'
                                            }

                                            if (child_length == temp_amount) {
                                                check_finish2 += 1
                                            }

                                        })
                                    } else {
                                        check_finish2 += 1
                                    }

                                }).then(function() {
                                    if (check_finish2 == select_roomId_list.length) {
                                        let check_finish3 = 0
                                        for (let k = 0; k < select_roomId_list.length; k++) {
                                            firebase.database().ref('ele_money/' + select_roomId_list[k] + '/' + select_year + '/' + select_month).once('value', function(snapshot) {
                                                if (snapshot != null && snapshot.numChildren() != 0) {
                                                    let pay_person = snapshot.val().pay_person
                                                    let room_num = snapshot.val().roomNum
                                                    let house_name = snapshot.val().houseName
                                                    let pay_amount = snapshot.val().pay_money

                                                    outputData[house_name][room_num][pay_person]['ele_money'] += parseInt(pay_amount)
                                                    check_finish3 += 1

                                                } else {
                                                    check_finish3 += 1
                                                }

                                            }).then(function() {
                                                if (check_finish3 == select_roomId_list.length) {
                                                    for (let key in outputData) {
                                                        for (let key2 in outputData[key]) {
                                                            for (let key3 in outputData[key][key2]) {
                                                                '<tr>' +
                                                                '<th>案源</th>' +
                                                                '<th>房別</th>' +
                                                                '<th>租客姓名</th>' +
                                                                '<th>租金</th>' +
                                                                '<th>實際繳交金額</th>' +
                                                                '<th>電費</th>' +
                                                                '<th>入帳方式</th>' +
                                                                '<th>入帳金額</th>' +
                                                                '<th>入帳時間</th>' +
                                                                '</tr>';

                                                                let html2 = '<td>' + key + '</td>' +
                                                                    '<td>' + key2 + '</td>' +
                                                                    '<td>' + key3 + '</td>' +
                                                                    '<td>' + outputData[key][key2][key3]["money"] + '</td>' +
                                                                    '<td>' + outputData[key][key2][key3]["pay_money"] + '</td>' +
                                                                    '<td>' + outputData[key][key2][key3]["ele_money"] + '</td>' +
                                                                    '<td>' + outputData[key][key2][key3]["pay_method"] + '</td>' +
                                                                    '<td>' + outputData[key][key2][key3]["pay_money_detail"] + '</td>' +
                                                                    '<td>' + outputData[key][key2][key3]["pay_time"] + '</td>';

                                                                var newElement2 = document.createElement("tr");
                                                                newElement2.innerHTML = html2;
                                                                taskIngData.insertBefore(newElement2, taskIngData.firstChild);
                                                                console.log(html2)

                                                            }
                                                        }
                                                    }
                                                    var table = $('#rentDataTable').DataTable({
                                                        buttons: [{
                                                            'className': 'btn btn-primary glyphicon glyphicon-list-alt', //按鈕的class樣式
                                                            attr: {
                                                                id: 'download_excel'
                                                            },
                                                            'extend': 'excelHtml5', //匯出檔案格式為excel
                                                            'text': '下載檔案', //按鈕標題
                                                            //'title': 'XXX-' + start_date + "-" + end_date, //匯出的excel標題

                                                        }],
                                                        dom: "<'row '<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-4 align-self-center'B>>" +
                                                            "<'row'<'col-sm-12'tr>>" +
                                                            "<'row '<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                                                        "order": [
                                                            [1, "asc"]
                                                        ],
                                                        initComplete: function() {
                                                            var btns = $('.dt-button');
                                                            btns.removeClass('dt-button');
                                                            $("#download_excel").click()
                                                        },
                                                    })
                                                }

                                            })

                                        }
                                    }


                                });
                            }
                        }

                    });


                    // firebase.database().ref('rent_money/' + select_roomId_list[i] + '/' + select_year + '/' + select_month).orderByChild('pay_person').once('value', function(snapshot) {
                    //     if (snapshot != null) {
                    //         let child_length = childSnapshot.numChildren()
                    //         let temp_amount = 0
                    //         let temp_name = ""
                    //         let temp_data = {}
                    //         snapshot.forEach(function(childSnapshot) {
                    //             let rent_person = childSnapshot.val().pay_person
                    //             temp_amount += 1
                    //             if (temp_name != rent_person && temp_amount != 1) {
                    //                 outputData.push(temp_data)
                    //             } else {
                    //                 temp_name = rent_person
                    //                 temp_data['room_id'] = snapshot.val().roomid
                    //                 temp_data['month'] = select_month
                    //                 temp_data['task'] = snapshot.val().houseName
                    //                 temp_data['name'] = rent_person
                    //                 temp_data['money'] = snapshot.val().rent_money
                    //                 temp_data['pay_money'] += snapshot.val().pay_money
                    //                 temp_data['pay_time'] = formatTime(new Date(snapshot.val().pay_time))
                    //                 if (snapshot.val().pay_method == "transfer") {
                    //                     temp_data['pay_method'] = '匯款'
                    //                 } else {
                    //                     temp_data['pay_method'] = '現金'
                    //                 }
                    //             }
                    //             if (child_length == temp_amount) {
                    //                 check_finish += 1
                    //             }
                    //         });
                    //     } else {

                    //         temp_name = rent_person
                    //         temp_data['month'] = select_month
                    //         temp_data['task'] = snapshot.val().houseName
                    //         temp_data['name'] = rent_person
                    //         temp_data['money'] = snapshot.val().rent_money
                    //         temp_data['pay_money'] += snapshot.val().pay_money
                    //         temp_data['pay_time'] = formatTime(new Date(snapshot.val().pay_time))
                    //         if (snapshot.val().pay_method == "transfer") {
                    //             temp_data['pay_method'] = '匯款'
                    //         } else {
                    //             temp_data['pay_method'] = '現金'
                    //         }
                    //     }
                    // }).then(function() {
                    //     if (check_finish == select_roomId_list.length) {

                    //     }
                    // });


                }


            }
        });
    }



    resizeThrottled = tui.util.throttle(function() {
        cal.render();
    }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setRenderRangeText();
    setHousesData();
    setCalendars();
    setEventListener();
    downloadMonthlyData();
})(window, tui.Calendar);