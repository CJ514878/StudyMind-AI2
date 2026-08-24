// ==========================================
// STUDYMIND AI - STUDY PLAN DASHBOARD
// ==========================================


// ------------------------------------------
// LOAD SAVED STUDY DATA
// ------------------------------------------

let studyData =
    JSON.parse(localStorage.getItem("studyData"));


// If there is no study plan
if (!studyData) {

    alert("No study plan found. Please create one first.");

    window.location.href = "index.html";

}


// ------------------------------------------
// GET DASHBOARD ELEMENTS
// ------------------------------------------

const weeklyHours =
    document.getElementById("weeklyHours");

const daysLeftElement =
    document.getElementById("daysLeft");

const dailyGoal =
    document.getElementById("dailyGoal");

const studyScoreElement =
    document.getElementById("studyScore");

const studyStreak =
    document.getElementById("studyStreak");

const scoreValue =
    document.getElementById("scoreValue");

const scoreMessage =
    document.getElementById("scoreMessage");

const todayMission =
    document.getElementById("todayMission");

const todaySchedule =
    document.getElementById("todaySchedule");


// ------------------------------------------
// LOAD BASIC INFORMATION
// ------------------------------------------

let hoursPerDay =
    Number(studyData.hoursPerDay) || 0;

let numberOfSubjects =
    studyData.subjects
        ? studyData.subjects.length
        : 0;

let daysLeft =
    Number(studyData.daysLeft) || 0;


// Weekly hours

weeklyHours.textContent =
    hoursPerDay * 7;


// Days left

daysLeftElement.textContent =
    daysLeft;


// Daily goal

dailyGoal.textContent =
    hoursPerDay + " hrs";


// ------------------------------------------
// STUDY SCORE
// ------------------------------------------

let savedScore =
    Number(studyData.studyScore);

if (isNaN(savedScore)) {

    savedScore = 100;

}

studyScoreElement.textContent =
    savedScore;

scoreValue.textContent =
    savedScore;


// Score message

if (savedScore >= 90) {

    scoreMessage.textContent =
        "🏆 Excellent! Your study plan is well balanced.";

}
else if (savedScore >= 75) {

    scoreMessage.textContent =
        "✅ Good! Keep following your schedule.";

}
else if (savedScore >= 60) {

    scoreMessage.textContent =
        "⚠️ Fair. Consider improving your consistency.";

}
else {

    scoreMessage.textContent =
        "❌ Your study plan needs improvement.";

}


// ------------------------------------------
// STUDY STREAK
// ------------------------------------------

let streak =
    Number(localStorage.getItem("studyStreak")) || 0;

studyStreak.textContent =
    streak + " Days";


// ------------------------------------------
// SUBJECTS
// ------------------------------------------

let subjects =
    studyData.subjects || [];


// ------------------------------------------
// PROGRESS TRACKER
// ------------------------------------------

let completedSubjects =
    JSON.parse(
        localStorage.getItem("completedSubjects")
    ) || [];


// Remove duplicates

completedSubjects =
    [...new Set(completedSubjects)];


// Make sure only existing subjects count

completedSubjects =
    completedSubjects.filter(function(subject) {

        return subjects.includes(subject);

    });


let completed =
    completedSubjects.length;


let progressPercent =
    subjects.length > 0
        ? Math.round(
            (completed / subjects.length) * 100
        )
        : 0;


// Display progress

document.getElementById("progressPercent")
    .textContent =
    progressPercent + "%";


document.getElementById("progressCount")
    .textContent =
    completed +
    " of " +
    subjects.length +
    " subjects completed";


document.getElementById("progressBar")
    .style.width =
    progressPercent + "%";


// Progress circle

let circle =
    document.querySelector(".progressCircle");

if (circle) {

    circle.style.background =
        `conic-gradient(
            #2583ff ${progressPercent * 3.6}deg,
            #24344d ${progressPercent * 3.6}deg
        )`;

}


// ------------------------------------------
// TODAY'S MISSION
// ------------------------------------------

let todayIndex =
    new Date().getDay();

let todaySubject =
    subjects.length > 0
        ? subjects[
            todayIndex % subjects.length
        ]
        : "No subject selected";


todayMission.innerHTML = `

<p>📚 Study <strong>${todaySubject}</strong></p>

<p>🎯 Complete at least one important topic.</p>

<p>📝 Review what you studied today.</p>

`;


// ------------------------------------------
// TODAY'S SCHEDULE
// ------------------------------------------

if (subjects.length === 0) {

    todaySchedule.innerHTML =
        "<p>No subjects available.</p>";

}
else {

    let scheduleHTML = "";

    let startHour = 16;

    subjects.forEach(function(subject, index) {

        let hour =
            startHour + index;

        if (hour >= 24) {
            hour -= 24;
        }

        let nextHour =
            hour + 1;

        if (nextHour >= 24) {
            nextHour -= 24;
        }

        let start =
            formatTime(hour);

        let end =
            formatTime(nextHour);

        scheduleHTML += `

        <p>
        🔵 <strong>
        ${start} – ${end}
        </strong>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;
        ${subject}
        </p>

        `;

    });

    todaySchedule.innerHTML =
        scheduleHTML;

}


// ------------------------------------------
// FORMAT TIME
// ------------------------------------------

function formatTime(hour) {

    let suffix =
        hour >= 12
            ? "PM"
            : "AM";

    let displayHour =
        hour % 12;

    if (displayHour === 0) {
        displayHour = 12;
    }

    return displayHour + ":00 " + suffix;

}


// ==========================================
// CALENDAR
// ==========================================

const calendarDays =
    document.getElementById("calendarDays");

const calendarMonth =
    document.getElementById("calendarMonth");

const previousButton =
    document.getElementById("prevMonth");

const nextButton =
    document.getElementById("nextMonth");


let currentCalendarDate =
    new Date();


// ------------------------------------------
// RENDER CALENDAR
// ------------------------------------------

function renderCalendar() {

    calendarDays.innerHTML = "";


    let year =
        currentCalendarDate.getFullYear();

    let month =
        currentCalendarDate.getMonth();


    // First day of month

    let firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    // Number of days

    let daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // Previous month's days

    let previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    // Month title

    let monthName =
        currentCalendarDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    calendarMonth.textContent =
        monthName + " " + year;


    // --------------------------------------
    // PREVIOUS MONTH
    // --------------------------------------

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        let day =
            previousMonthDays - i;

        let cell =
            document.createElement("div");

        cell.textContent =
            day;

        cell.classList.add(
            "otherMonth"
        );

        calendarDays.appendChild(cell);

    }


    // --------------------------------------
    // CURRENT MONTH
    // --------------------------------------

    let today =
        new Date();


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        let cell =
            document.createElement("div");

        cell.textContent =
            day;


        // Highlight today

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            cell.classList.add(
                "today"
            );

        }


        calendarDays.appendChild(cell);

    }


    // --------------------------------------
    // NEXT MONTH
    // --------------------------------------

    let totalCells =
        calendarDays.children.length;

    let remaining =
        42 - totalCells;


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        let cell =
            document.createElement("div");

        cell.textContent =
            day;

        cell.classList.add(
            "otherMonth"
        );

        calendarDays.appendChild(cell);

    }

}


// ------------------------------------------
// PREVIOUS MONTH BUTTON
// ------------------------------------------

previousButton.addEventListener(
    "click",
    function() {

        currentCalendarDate.setMonth(
            currentCalendarDate.getMonth() - 1
        );

        renderCalendar();

    }
);


// ------------------------------------------
// NEXT MONTH BUTTON
// ------------------------------------------

nextButton.addEventListener(
    "click",
    function() {

        currentCalendarDate.setMonth(
            currentCalendarDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// Initial calendar

renderCalendar();


// ==========================================
// THEME
// ==========================================

const themeButton =
    document.getElementById("themeButton");


if (
    localStorage.getItem("theme")
    === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeButton.textContent =
        "☀️ Light Mode";

}


themeButton.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeButton.textContent =
                "☀️ Light Mode";

        }
        else {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeButton.textContent =
                "🌙 Dark Mode";

        }

    }
);