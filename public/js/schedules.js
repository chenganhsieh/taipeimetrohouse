'use strict';

/*eslint-disable*/

var ScheduleList = [];

var SCHEDULE_CATEGORY = [
    'milestone',
    'task'
];

function ScheduleInfo() {
    this.id = null;
    this.calendarId = null;
    this.title = null;
    this.body = null;
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = '';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = false;
    this.goingDuration = 0;
    this.comingDuration = 0;
    this.recurrenceRule = '';
    this.state = '';

    this.raw = {
        memo: '',
        hasToOrCc: false,
        hasRecurrenceRule: false,
        location: null,
        class: 'public', // or 'private'
        creator: {
            name: '',
            avatar: '',
            company: '',
            email: '',
            phone: ''
        }
    };
}

function generateTime(schedule, renderStart, renderEnd) {
    var startDate = moment(renderStart.getTime())
    var endDate = moment(renderEnd.getTime());
    var diffDate = endDate.diff(startDate, 'days');

    schedule.isAllday = chance.bool({ likelihood: 30 });
    if (schedule.isAllday) {
        schedule.category = 'allday';
    } else if (chance.bool({ likelihood: 30 })) {
        schedule.category = SCHEDULE_CATEGORY[chance.integer({ min: 0, max: 1 })];
        if (schedule.category === SCHEDULE_CATEGORY[1]) {
            schedule.dueDateClass = 'morning';
        }
    } else {
        schedule.category = 'time';
    }

    startDate.add(chance.integer({ min: 0, max: diffDate }), 'days');
    startDate.hours(chance.integer({ min: 0, max: 23 }))
    startDate.minutes(chance.bool() ? 0 : 30);
    schedule.start = startDate.toDate();

    endDate = moment(startDate);
    if (schedule.isAllday) {
        endDate.add(chance.integer({ min: 0, max: 3 }), 'days');
    }

    schedule.end = endDate
        .add(chance.integer({ min: 1, max: 4 }), 'hour')
        .toDate();

    if (!schedule.isAllday && chance.bool({ likelihood: 20 })) {
        schedule.goingDuration = chance.integer({ min: 30, max: 120 });
        schedule.comingDuration = chance.integer({ min: 30, max: 120 });;

        if (chance.bool({ likelihood: 50 })) {
            schedule.end = schedule.start;
        }
    }
}

function generateNames() {
    var names = [];
    var i = 0;
    var length = chance.integer({ min: 1, max: 10 });

    for (; i < length; i += 1) {
        names.push(chance.name());
    }

    return names;
}

function generateRandomSchedule(calendar, renderStart, renderEnd) {
    console.log("generate_random_schedule")
    var schedule = new ScheduleInfo();

    schedule.id = chance.guid();
    schedule.calendarId = calendar.id;

    schedule.title = chance.sentence({ words: 3 });
    schedule.body = chance.bool({ likelihood: 20 }) ? chance.sentence({ words: 10 }) : '';
    schedule.isReadOnly = chance.bool({ likelihood: 20 });
    schedule.rent_house_name = "測試用房間"
    generateTime(schedule, renderStart, renderEnd);

    schedule.isPrivate = chance.bool({ likelihood: 10 });
    schedule.location = chance.address();
    schedule.attendees = chance.bool({ likelihood: 70 }) ? generateNames() : [];
    schedule.recurrenceRule = chance.bool({ likelihood: 20 }) ? 'repeated events' : '';
    schedule.state = chance.bool({ likelihood: 20 }) ? 'Free' : 'Busy';
    schedule.color = calendar.color;
    schedule.bgColor = calendar.bgColor;
    schedule.dragBgColor = calendar.dragBgColor;
    schedule.borderColor = calendar.borderColor;

    if (schedule.category === 'milestone') {
        schedule.color = schedule.bgColor;
        schedule.bgColor = 'transparent';
        schedule.dragBgColor = 'transparent';
        schedule.borderColor = 'transparent';
    }

    schedule.raw.memo = chance.sentence();
    schedule.raw.creator.name = chance.name();
    schedule.raw.creator.avatar = chance.avatar();
    schedule.raw.creator.company = chance.company();
    schedule.raw.creator.email = chance.email();
    schedule.raw.creator.phone = chance.phone();
    schedule.raw.creator.userid = chance.userId();

    if (chance.bool({ likelihood: 20 })) {
        var travelTime = chance.minute();
        schedule.goingDuration = travelTime;
        schedule.comingDuration = travelTime;
    }

    ScheduleList.push(schedule);
}
//yyyy-mm-dd
function formatTime(date) {
    var formatted_date = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2)
    return formatted_date;
}

function generateSchedule(viewName, renderStart, renderEnd) {
    ScheduleList = [];
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
                schedule.id = schedule_id;
                schedule.calendarId = calendar.id;
                schedule.title = house_name + room_name;
                schedule.body = 'None';
                schedule.isReadOnly = false;
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
                schedule.raw.creator.phone = phone;
                schedule.raw.creator.bug = userId;

                ScheduleList.push(schedule);
            });
            console.log(snapshot.val())
        });
        // var i = 0,
        //     length = 10;
        // if (viewName === 'month') {
        //     length = 3;
        // } else if (viewName === 'day') {
        //     length = 4;
        // }
        // for (; i < length; i += 1) {
        //     generateRandomSchedule(calendar, renderStart, renderEnd);
        // }
    });


}