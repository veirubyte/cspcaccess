(function(){
"use strict";

/* =========================================================================
   ICONS & THEME
   ========================================================================= */
var ICON = {
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>',
  ticket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"></path><path d="M10.3 3.9 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path></svg>',
  wrench:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2Z"></path></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5M21 12H9"></path></svg>',
  report:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg>',
  monitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>'
};

var root = document.documentElement;
var themeIcon = document.getElementById('themeIconMoon');
var savedTheme = null;
try { savedTheme = localStorage.getItem('cspc_theme'); } catch(e){}
if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);
function isDark(){
  var explicit = root.getAttribute('data-theme');
  if (explicit === 'dark') return true;
  if (explicit === 'light') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function syncThemeIcon(){
  if (!themeIcon) return;
  themeIcon.innerHTML = isDark()
    ? '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>';
}
syncThemeIcon();
document.getElementById('themeToggleBtn').addEventListener('click', function(){
  var next = isDark() ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.getItem('cspc_theme', next); } catch(e){}
  syncThemeIcon();
  if (utilChart) utilChart.update();
});

/* ---------- Toasts ---------- */
var toastStack = document.getElementById('toastStack');
function toast(type, title, msg){
  var el = document.createElement('div');
  el.className = 'toast ' + type;
  var icon = type === 'success' ? ICON.check : type === 'danger' ? ICON.ticket : type === 'warning' ? ICON.wrench : ICON.info;
  el.innerHTML =
    '<div class="toast-icon">' + icon + '</div>' +
    '<div class="toast-text"><strong>' + title + '</strong><p>' + msg + '</p></div>' +
    '<button class="toast-dismiss" aria-label="Dismiss">' + ICON.x + '</button>';
  toastStack.appendChild(el);
  var timer = setTimeout(function(){ dismiss(); }, 5200);
  el.querySelector('.toast-dismiss').addEventListener('click', function(){ clearTimeout(timer); dismiss(); });
  function dismiss(){
    el.classList.add('leaving');
    setTimeout(function(){ el.remove(); }, 200);
  }
}

/* ---------- Sidebar & Mobile Nav ---------- */
var sidebar = document.getElementById('sidebar');
var backdrop = document.getElementById('sidebarBackdrop');
function openSidebar(){ sidebar.classList.add('open'); backdrop.classList.add('show'); }
function closeSidebar(){ sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
document.getElementById('menuToggleBtn').addEventListener('click', openSidebar);
document.getElementById('sidebarCloseBtn').addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);

/* ---------- Dropdowns ---------- */
function setupDropdown(btnId, ddId){
  var btn = document.getElementById(btnId), dd = document.getElementById(ddId);
  if (!btn || !dd) return;
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var willOpen = !dd.classList.contains('open');
    document.querySelectorAll('.dropdown.open').forEach(function(d){ d.classList.remove('open'); });
    if (willOpen) dd.classList.add('open');
  });
}
setupDropdown('profileBtn','profileDropdown');
setupDropdown('notifBtn','notifDropdown');
document.addEventListener('click', function(){ document.querySelectorAll('.dropdown.open').forEach(function(d){ d.classList.remove('open'); }); });

/* =========================================================================
   DATA MODEL & SCHEDULE DEFINITIONS
   ========================================================================= */
var DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var ROOMS = {
  itlab1: 'ITLAB 1 — Programming Lab',
  itlab2: 'ITLAB 2 — Networking Lab',
  naslab: 'NAS LAB — Multimedia & Graphics',
  maclab: 'MAC LAB — Hardware & IoT'
};

var CLASS_TEACHER = {
  'BSIT 3A': 'Ma\u2019am Dela Cruz',
  'BSIT 3B': 'Sir Gonzales',
  'BSIT 2A': 'Ma\u2019am Tan',
  'BSCS 3A': 'Ma\u2019am Dela Cruz',
  'BSEMC 2A': 'Sir Ramirez',
  'BSIS 2D': 'Sir Gonzales',
  'BSIS 3A': 'Ma\u2019am Tan'
};

var SECTIONS = Object.keys(CLASS_TEACHER);
var FIRST_NAMES = ['Miguel','Andrea','Kyle','Sophia','Josh','Nicole','Ella','Marco','Bea','Ronan','Jasmine','Carlo','Trisha','Adrian','Faye'];
var LAST_NAMES = ['Santos','Reyes','Cruz','Bautista','Garcia','Lim','Torres','Fernandez','Ramos','Aquino','Villanueva','Mercado'];

var ROLES = {
  admin:   { name:'Alex Rivera', initials:'IT', badge:'Admin', badgeClass:'admin', avatarBg:'linear-gradient(145deg,var(--blue-500),var(--blue-700))' },
  teacher: { name:'Ma\u2019am Dela Cruz', initials:'MD', badge:'Teacher', badgeClass:'teacher', avatarBg:'linear-gradient(145deg,#e0a52c,#b4720a)' },
  student: { name:'Juan Dela Cruz', initials:'JD', badge:'Student', badgeClass:'student', avatarBg:'linear-gradient(145deg,#3fcf85,#0f8a4b)', studentId:'2024-00125', section:'BSIT 3A' }
};
ROLES.teacher.sections = SECTIONS.filter(function(s){ return CLASS_TEACHER[s] === ROLES.teacher.name; });
var currentRole = 'admin';

var VIEW_ROLES = { students:['admin','teacher'], settings:['admin'] };
function isViewAllowed(view, role){ var a = VIEW_ROLES[view]; return !a || a.indexOf(role) !== -1; }

function rand(n){ return Math.floor(Math.random() * n); }
function pick(arr){ return arr[rand(arr.length)]; }
function pad(n){ return n < 10 ? '0' + n : '' + n; }
function fmtDate(d){ return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
function fmtTime(d){
  var h = d.getHours(), m = d.getMinutes();
  var ap = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + ':' + pad(m) + ' ' + ap;
}
function fmtDateTime(d){ return fmtDate(d) + ' ' + fmtTime(d); }
function minsAgo(mins){ var d = new Date(); d.setMinutes(d.getMinutes() - mins); return d; }

/* ---------------- Time Helpers & Schedule Math ---------------- */
function timeToMinutes(str){
  if (!str) return 0;
  var s = str.trim();
  var match = s.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  var h = parseInt(match[1], 10);
  var m = parseInt(match[2], 10);
  var ap = match[3] ? match[3].toUpperCase() : null;
  if (ap === 'PM' && h < 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToTime12(min){
  var h = Math.floor(min / 60);
  var m = min % 60;
  var ap = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return h12 + ':' + pad(m) + ' ' + ap;
}

function formatTimeRange(startStr, endStr){
  return minutesToTime12(timeToMinutes(startStr)) + ' \u2013 ' + minutesToTime12(timeToMinutes(endStr));
}

/* ---------------- Master Laboratory Schedules ----------------
   Established Relationship:
   CLASS/SECTION -> TEACHER -> DAY -> TIME -> LABORATORY ROOM -> AVAILABLE PCs
----------------------------------------------------------------- */
var roomKeyMap = {
  'ITLAB1': 'itlab1',
  'ITLAB 1': 'itlab1',
  'ITLAB2': 'itlab2',
  'ITLAB 2': 'itlab2',
  'NAS LAB': 'naslab',
  'MAC LAB': 'maclab'
};

var enrollmentSchedules = [
  {
    scheduleId: 'SCH-001',
    classSection: 'BSIT 3A',
    subjectCode: 'IT 311',
    subjectName: 'Systems Integration & Architecture',
    teacher: 'Ma’am Dela Cruz',
    laboratoryRoom: 'NAS LAB',
    laboratoryName: 'Multimedia & Graphics',
    day: 'Sunday',
    startTime: '07:00',
    endTime: '12:00'
  },
  {
    scheduleId: 'SCH-002',
    classSection: 'BSIS 2D',
    subjectCode: 'IS 221',
    subjectName: 'Enterprise Architecture & Cloud Systems',
    teacher: 'Sir Gonzales',
    laboratoryRoom: 'MAC LAB',
    laboratoryName: 'Hardware & IoT',
    day: 'Monday',
    startTime: '16:00',
    endTime: '19:00'
  },
  {
    scheduleId: 'SCH-003',
    classSection: 'BSIT 3A',
    subjectCode: 'IT 312',
    subjectName: 'Advanced Web & Database Systems',
    teacher: 'Ma’am Dela Cruz',
    laboratoryRoom: 'ITLAB1',
    laboratoryName: 'Programming Lab',
    day: 'Saturday',
    startTime: '18:00',
    endTime: '23:59'
  },
  {
    scheduleId: 'SCH-004',
    classSection: 'BSCS 3A',
    subjectCode: 'CS 311',
    subjectName: 'Operating Systems & Algorithms',
    teacher: 'Ma’am Dela Cruz',
    laboratoryRoom: 'ITLAB1',
    laboratoryName: 'Programming Lab',
    day: 'Tuesday',
    startTime: '08:00',
    endTime: '12:00'
  },
  {
    scheduleId: 'SCH-005',
    classSection: 'BSIT 2A',
    subjectCode: 'IT 213',
    subjectName: 'Data Structures & Algorithms Lab',
    teacher: 'Ma’am Tan',
    laboratoryRoom: 'ITLAB2',
    laboratoryName: 'Networking Lab',
    day: 'Thursday',
    startTime: '13:00',
    endTime: '16:00'
  },
  {
    scheduleId: 'SCH-006',
    classSection: 'BSEMC 2A',
    subjectCode: 'EMC 201',
    subjectName: '3D Animation & Digital Modeling',
    teacher: 'Sir Ramirez',
    laboratoryRoom: 'NAS LAB',
    laboratoryName: 'Multimedia & Graphics',
    day: 'Friday',
    startTime: '09:00',
    endTime: '13:00'
  }
];

function normalizeEnrollmentSchedule(raw){
  var roomKey = roomKeyMap[(raw && raw.laboratoryRoom) ? (raw.laboratoryRoom.toUpperCase().replace(/\s+/g, ' ')).trim() : ''] || roomKeyMap[(raw && raw.laboratoryRoom) ? raw.laboratoryRoom : ''] || 'itlab1';
  return {
    id: raw.scheduleId,
    section: raw.classSection,
    teacher: raw.teacher,
    room: roomKey,
    day: raw.day,
    startTime: raw.startTime,
    endTime: raw.endTime,
    subject: (raw.subjectCode || '') + (raw.subjectCode && raw.subjectName ? ': ' : '') + (raw.subjectName || '')
  };
}

var schedules = enrollmentSchedules.map(normalizeEnrollmentSchedule);

var studentWeeklyTimetables = [
  {
    classSection: 'BSIT 3A',
    subjectCode: 'IT 311',
    subjectName: 'Systems Integration & Architecture',
    teacher: 'Ma’am Dela Cruz',
    laboratoryRoom: 'NAS LAB',
    laboratoryName: 'Multimedia & Graphics',
    day: 'Sunday',
    startTime: '07:00',
    endTime: '12:00',
    dataType: 'DEMO'
  },
  {
    classSection: 'BSIT 3A',
    subjectCode: 'IT 312',
    subjectName: 'Advanced Web & Database Systems',
    teacher: 'Ma’am Dela Cruz',
    laboratoryRoom: 'ITLAB1',
    laboratoryName: 'Programming Lab',
    day: 'Saturday',
    startTime: '18:00',
    endTime: '23:59',
    dataType: 'SPECIFIED'
  },
  {
    classSection: 'BSIT 3A',
    subjectCode: 'IT 313',
    subjectName: 'Database Laboratory',
    teacher: 'Sir Example',
    laboratoryRoom: 'ITLAB2',
    laboratoryName: 'Networking Lab',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '16:00',
    dataType: 'DEMO'
  },
  {
    classSection: 'BSIT 3A',
    subjectCode: 'IT 314',
    subjectName: 'Programming Laboratory',
    teacher: 'Ma’am Example',
    laboratoryRoom: 'NAS LAB',
    laboratoryName: 'Multimedia & Graphics',
    day: 'Thursday',
    startTime: '08:00',
    endTime: '11:00',
    dataType: 'DEMO'
  }
];

function getTeacherSchedulesForCurrentTeacher(){
  return schedules.filter(function(s){ return s.teacher === ROLES.teacher.name; });
}

function getStudentClassSchedules(classSection){
  var className = classSection || ROLES.student.section;
  var fromStatic = studentWeeklyTimetables.filter(function(s){ return s.classSection === className; });
  if (fromStatic.length) {
    return fromStatic.map(function(s){
      var roomKey = roomKeyMap[(s.laboratoryRoom || '').toUpperCase().replace(/\s+/g, ' ').trim()] || roomKeyMap[(s.laboratoryRoom || '')] || 'itlab1';
      return {
        id: s.scheduleId || 'STU-' + s.subjectCode,
        section: s.classSection,
        teacher: s.teacher,
        room: roomKey,
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
        subject: (s.subjectCode || '') + (s.subjectCode && s.subjectName ? ': ' : '') + (s.subjectName || '')
      };
    });
  }
  return schedules.filter(function(s){ return s.section === className; });
}

function isScheduleActive(sch, atDate){
  var d = atDate || new Date();
  var dayName = DAYS_OF_WEEK[d.getDay()];
  if (sch.day !== dayName) return false;
  var currentMin = d.getHours() * 60 + d.getMinutes();
  var startMin = timeToMinutes(sch.startTime);
  var endMin = timeToMinutes(sch.endTime);
  return currentMin >= startMin && currentMin < endMin;
}

function getActiveScheduleForSection(section, atDate){
  var d = atDate || new Date();
  return schedules.find(function(s){
    return s.section === section && isScheduleActive(s, d);
  }) || null;
}

function getActiveScheduleForStudent(studentObj, atDate){
  return getActiveScheduleForSection(studentObj.section, atDate);
}

function getUpcomingScheduleForSection(section, atDate){
  var d = atDate || new Date();
  var currentDayIdx = d.getDay();
  var currentMin = d.getHours() * 60 + d.getMinutes();

  var sectionSchedules = schedules.filter(function(s){ return s.section === section; });
  if (!sectionSchedules.length) return null;

  var sorted = sectionSchedules.slice().sort(function(a, b){
    var dayA = DAYS_OF_WEEK.indexOf(a.day);
    var dayB = DAYS_OF_WEEK.indexOf(b.day);
    var offsetA = (dayA - currentDayIdx + 7) % 7;
    var offsetB = (dayB - currentDayIdx + 7) % 7;
    if (offsetA === 0 && timeToMinutes(a.startTime) <= currentMin) offsetA = 7;
    if (offsetB === 0 && timeToMinutes(b.startTime) <= currentMin) offsetB = 7;
    if (offsetA !== offsetB) return offsetA - offsetB;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });
  return sorted[0] || null;
}

function checkScheduleConflict(room, day, startStr, endStr, excludeId){
  var newStart = timeToMinutes(startStr);
  var newEnd = timeToMinutes(endStr);
  if (newEnd <= newStart) return null;

  return schedules.find(function(s){
    if (excludeId && s.id === excludeId) return false;
    if (s.room !== room || s.day !== day) return false;
    var sStart = timeToMinutes(s.startTime);
    var sEnd = timeToMinutes(s.endTime);
    // Overlapping schedule in the same room on the same day:
    return newStart < sEnd && newEnd > sStart;
  }) || null;
}

/* =========================================================================
   STATIONS & INCIDENTS SEEDING
   ========================================================================= */
var incidentSeq = 1;
var incidents = [];
var stations = [];

function newSession(section, roomKey){
  var fn = pick(FIRST_NAMES), ln = pick(LAST_NAMES);
  var sch = getActiveScheduleForSection(section, new Date()) || schedules.find(function(s){ return s.section === section; });
  return {
    studentId: '2024-' + (10000 + rand(90000)).toString().slice(0,5),
    studentName: fn + ' ' + ln,
    section: section,
    teacher: sch ? sch.teacher : (CLASS_TEACHER[section] || 'Ma\u2019am Dela Cruz'),
    room: roomKey || (sch ? sch.room : 'itlab1'),
    scheduleId: sch ? sch.id : 'SCH-003',
    scheduledDay: sch ? sch.day : 'Saturday',
    scheduledStartTime: sch ? sch.startTime : '18:00',
    scheduledEndTime: sch ? sch.endTime : '23:59',
    checkIn: minsAgo(rand(90))
  };
}

(function buildStations(){
  var roomKeys = Object.keys(ROOMS);
  var idx = 1;
  roomKeys.forEach(function(room){
    for (var i = 0; i < 8; i++) {
      var id = 'PC-' + pad(idx);
      var roll = rand(100);
      var status = roll < 55 ? 'occupied' : roll < 82 ? 'available' : roll < 92 ? 'pending' : roll < 97 ? 'maintenance' : 'unavailable';
      var st = {
        id: id,
        room: room,
        cpu: pick(['Intel Core i5-12400','Intel Core i7-12700','Ryzen 5 5600']),
        ram: pick(['8GB RAM','16GB RAM']),
        os: 'Windows 11 Pro',
        session: null,
        history: [],
        manualUnavailable: false,
        status: 'available'
      };

      if (status === 'occupied' || status === 'pending') {
        st.session = newSession(pick(SECTIONS), room);
      }
      if (status === 'unavailable') { st.manualUnavailable = true; }
      if (status === 'pending') {
        incidents.push(makeIncident(st.session, id, 'Reported issue during routine laboratory session.', 'PENDING', minsAgo(rand(60))));
      }
      if (status === 'maintenance') {
        var sess = newSession(pick(SECTIONS), room);
        st.history.push({
          studentId: sess.studentId,
          studentName: sess.studentName,
          section: sess.section,
          teacher: sess.teacher,
          room: sess.room,
          scheduleId: sess.scheduleId,
          scheduledDay: sess.scheduledDay,
          scheduledStartTime: sess.scheduledStartTime,
          scheduledEndTime: sess.scheduledEndTime,
          checkIn: minsAgo(180),
          checkOut: minsAgo(120),
          incidentId: null,
          incidentStatus: 'None'
        });
        incidents.push(makeIncident(sess, id, 'Hardware fault under technician inspection.', 'UNDER MAINTENANCE', minsAgo(115)));
      }
      stations.push(st);
      idx++;
    }
  });

  // Seed the exact "missing mouse" example from the specification on PC-15 (itlab2).
  var demoStation = stations.find(function(s){ return s.id === 'PC-15'; });
  if (demoStation) {
    var checkInT = new Date(); checkInT.setHours(14,5,0,0);
    var checkOutT = new Date(); checkOutT.setHours(15,0,0,0);
    var demoSession = {
      studentId: '2024-00125',
      studentName: 'Juan Dela Cruz',
      section: 'BSIT 3A',
      teacher: CLASS_TEACHER['BSIT 3A'],
      room: demoStation.room,
      scheduleId: 'SCH-001',
      scheduledDay: 'Sunday',
      scheduledStartTime: '07:00',
      scheduledEndTime: '12:00',
      checkIn: checkInT
    };
    demoStation.session = null;
    var demoIncident = makeIncident(demoSession, 'PC-15', 'Mouse is missing from the station.', 'PENDING', checkOutT);
    demoStation.history.push({
      studentId: demoSession.studentId,
      studentName: demoSession.studentName,
      section: demoSession.section,
      teacher: demoSession.teacher,
      room: demoSession.room,
      scheduleId: demoSession.scheduleId,
      scheduledDay: demoSession.scheduledDay,
      scheduledStartTime: demoSession.scheduledStartTime,
      scheduledEndTime: demoSession.scheduledEndTime,
      checkIn: checkInT,
      checkOut: checkOutT,
      incidentId: demoIncident.id,
      incidentStatus: 'PENDING'
    });
    demoStation.protectedDemo = true;
    recomputeStationStatus(demoStation);
  }

  stations.forEach(function(s){ if (!s.protectedDemo) recomputeStationStatus(s); });
})();

function makeIncident(session, pcNumber, remark, status, date){
  var inc = {
    id: 'INC-' + pad(incidentSeq++),
    studentId: session.studentId,
    studentName: session.studentName,
    pcNumber: pcNumber,
    room: session.room,
    section: session.section,
    teacher: session.teacher,
    scheduleId: session.scheduleId || '—',
    scheduledDay: session.scheduledDay || '—',
    scheduledStartTime: session.scheduledStartTime || '—',
    scheduledEndTime: session.scheduledEndTime || '—',
    date: date || new Date(),
    remark: remark,
    status: status,
    adminRemark: '',
    resolution: '',
    dateResolved: null
  };
  incidents.push(inc);
  incidents.pop(); // avoid double-push when caller also pushes
  return inc;
}

function unresolvedIncidentsFor(pcId){
  return incidents.filter(function(i){ return i.pcNumber === pcId && i.status !== 'RESOLVED' && i.status !== 'DISMISSED'; });
}
function derivedIncidentState(pcId){
  var list = unresolvedIncidentsFor(pcId);
  if (list.some(function(i){ return i.status === 'UNDER MAINTENANCE'; })) return 'maintenance';
  if (list.length) return 'pending';
  return null;
}
function recomputeStationStatus(st){
  if (st.manualUnavailable) { st.status = 'unavailable'; return; }
  var derived = derivedIncidentState(st.id);
  if (derived) { st.status = derived; return; }
  st.status = st.session ? 'occupied' : 'available';
}

/* =========================================================================
   STUDENT & ADMIN ACTIONS
   ========================================================================= */
function checkInStudent(stationId){
  var st = stations.find(function(s){ return s.id === stationId; });
  if (!st) return false;

  var activeSchedule = getActiveScheduleForStudent(ROLES.student, new Date());
  if (!activeSchedule) {
    toast('danger', 'Check-in blocked', 'No active laboratory schedule for your class at this time.');
    return false;
  }
  if (st.room !== activeSchedule.room) {
    toast('danger', 'Access restricted', 'You cannot select PCs in ' + ROOMS[st.room] + '. Your scheduled laboratory is ' + ROOMS[activeSchedule.room] + '.');
    return false;
  }
  if (st.status !== 'available') {
    toast('warning', 'PC no longer available', st.id + ' is ' + st.status.toUpperCase() + '. Please choose another AVAILABLE PC.');
    renderAll();
    return false;
  }

  var now = new Date();
  st.session = {
    studentId: ROLES.student.studentId,
    studentName: ROLES.student.name,
    section: ROLES.student.section,
    teacher: activeSchedule.teacher,
    room: activeSchedule.room,
    scheduleId: activeSchedule.id,
    scheduledDay: activeSchedule.day,
    scheduledStartTime: activeSchedule.startTime,
    scheduledEndTime: activeSchedule.endTime,
    checkIn: now
  };
  recomputeStationStatus(st);
  return true;
}

function checkOutStudent(stationId, actorLabel){
  var st = stations.find(function(s){ return s.id === stationId; });
  if (!st || !st.session) return false;
  var sess = st.session;
  var relatedIncident = incidents.slice().reverse().find(function(i){
    return i.pcNumber === stationId && i.studentId === sess.studentId && i.status !== 'RESOLVED' && i.status !== 'DISMISSED';
  });

  st.history.push({
    studentId: sess.studentId,
    studentName: sess.studentName,
    section: sess.section,
    teacher: sess.teacher,
    room: sess.room || st.room,
    scheduleId: sess.scheduleId || '—',
    scheduledDay: sess.scheduledDay || '—',
    scheduledStartTime: sess.scheduledStartTime || '—',
    scheduledEndTime: sess.scheduledEndTime || '—',
    checkIn: sess.checkIn,
    checkOut: new Date(),
    incidentId: relatedIncident ? relatedIncident.id : null,
    incidentStatus: relatedIncident ? relatedIncident.status : 'None'
  });
  st.session = null;
  recomputeStationStatus(st);
  return true;
}

function reportIncident(stationId, remark){
  var st = stations.find(function(s){ return s.id === stationId; });
  if (!st || !st.session) return null;
  var sess = st.session;
  var inc = {
    id: 'INC-' + pad(incidentSeq++),
    studentId: sess.studentId,
    studentName: sess.studentName,
    pcNumber: stationId,
    room: sess.room || st.room,
    section: sess.section,
    teacher: sess.teacher,
    scheduleId: sess.scheduleId || '—',
    scheduledDay: sess.scheduledDay || '—',
    scheduledStartTime: sess.scheduledStartTime || '—',
    scheduledEndTime: sess.scheduledEndTime || '—',
    date: new Date(),
    remark: remark,
    status: 'PENDING',
    adminRemark: '',
    resolution: '',
    dateResolved: null
  };
  incidents.unshift(inc);
  recomputeStationStatus(st);
  return inc;
}

/* ---------- Admin Actions ---------- */
function adminVerify(id){
  var inc = incidents.find(function(i){ return i.id === id; }); if (!inc) return;
  inc.status = 'VERIFIED';
  recomputeStationStatus(stations.find(function(s){ return s.id === inc.pcNumber; }));
}
function adminSetMaintenance(id){
  var inc = incidents.find(function(i){ return i.id === id; }); if (!inc) return;
  inc.status = 'UNDER MAINTENANCE';
  recomputeStationStatus(stations.find(function(s){ return s.id === inc.pcNumber; }));
}
function adminResolve(id, resolutionText, adminRemark){
  var inc = incidents.find(function(i){ return i.id === id; }); if (!inc) return;
  inc.status = 'RESOLVED'; inc.resolution = resolutionText; inc.adminRemark = adminRemark || inc.adminRemark; inc.dateResolved = new Date();
  var st = stations.find(function(s){ return s.id === inc.pcNumber; });
  if (st) { st.protectedDemo = false; recomputeStationStatus(st); }
}
function adminDismiss(id, adminRemark){
  var inc = incidents.find(function(i){ return i.id === id; }); if (!inc) return;
  inc.status = 'DISMISSED'; inc.adminRemark = adminRemark || inc.adminRemark; inc.dateResolved = new Date();
  var st = stations.find(function(s){ return s.id === inc.pcNumber; });
  if (st) { st.protectedDemo = false; recomputeStationStatus(st); }
}
function adminToggleUnavailable(stationId){
  var st = stations.find(function(s){ return s.id === stationId; }); if (!st) return;
  if (st.session) { toast('warning', 'Student still checked in', 'Check out the current student before changing this PC\u2019s availability.'); return; }
  st.manualUnavailable = !st.manualUnavailable;
  st.protectedDemo = false;
  recomputeStationStatus(st);
}
function adminForceCheckout(stationId){
  if (checkOutStudent(stationId)) toast('success', 'Student checked out', stationId + ' session ended by administrator.');
}

/* =========================================================================
   ROLE SWITCHING & NAVIGATION
   ========================================================================= */
function applyRole(role){
  currentRole = role;
  var r = ROLES[role];
  document.getElementById('profileName').textContent = r.name;
  document.getElementById('profileAvatar').textContent = r.initials;
  document.getElementById('profileAvatar').style.background = r.avatarBg;
  var badge = document.getElementById('profileRoleBadge');
  badge.textContent = r.badge;
  badge.className = 'role-badge ' + r.badgeClass;

  document.querySelectorAll('#profileDropdown .dropdown-item[data-role]').forEach(function(it){
    it.classList.toggle('active', it.getAttribute('data-role') === role);
  });

  document.querySelectorAll('[data-nav-li]').forEach(function(li){
    var allowed = li.getAttribute('data-roles');
    li.style.display = (!allowed || allowed.split(' ').indexOf(role) !== -1) ? 'block' : 'none';
  });

  document.getElementById('ov-admin').style.display = role === 'admin' ? 'block' : 'none';
  document.getElementById('ov-teacher').style.display = role === 'teacher' ? 'block' : 'none';
  document.getElementById('ov-student').style.display = role === 'student' ? 'block' : 'none';

  // Role-specific navigation & headings
  document.getElementById('ticketsNavLabel').textContent = role === 'student' ? 'My Incident Reports' : 'Incident Reports';
  document.getElementById('usageNavLabel').textContent = role === 'student' ? 'My Usage History' : 'PC Usage History';
  document.getElementById('ticketsHeading').textContent = role === 'student' ? 'My Incident Reports' : 'Incident Reports';
  document.getElementById('ticketsSub').textContent = role === 'admin' ? 'Review, verify, and resolve issues reported across all laboratories.' : role === 'teacher' ? 'Incidents reported by students in your sections.' : 'Problems you\u2019ve reported during your PC sessions.';
  document.getElementById('usageHeading').textContent = role === 'student' ? 'My Usage History' : 'PC Usage History';
  document.getElementById('usageSub').textContent = role === 'student' ? 'Your past lab sessions with schedule records. Kept permanently for verification.' : 'Complete session history with schedule details — never deleted, even after a PC becomes available again.';
  document.getElementById('stationsHeading').textContent = role === 'student' ? 'Select a PC' : 'Live PC Station Map';
  document.getElementById('stationsSub').textContent = role === 'student' ? 'Only AVAILABLE stations in your assigned laboratory can be selected.' : 'Each PC shows its live status. Click a station for details.';
  document.getElementById('studentsSub').textContent = role === 'teacher' ? 'Students from your sections currently signed in.' : 'Everyone currently signed in across all laboratory rooms.';
  document.getElementById('studentsActionsHead').style.display = role === 'admin' ? '' : 'none';

  var scheduleHeading = document.getElementById('scheduleHeading');
  var scheduleSub = document.getElementById('scheduleSub');
  if (scheduleHeading) {
    scheduleHeading.textContent = role === 'student' ? 'My Weekly Laboratory Timetable' : role === 'teacher' ? 'My Weekly Laboratory Timetable' : 'Laboratory Schedules & Room Assignment';
  }
  if (scheduleSub) {
    scheduleSub.textContent = role === 'student' ? 'Laboratory schedules for your class' : role === 'teacher' ? 'Laboratory schedules assigned to you' : 'Schedule-based laboratory allocations connecting Class/Section, Teacher, Day, Time, and Lab Room.';
  }
  var calendarRoomSelect = document.getElementById('calendarRoomSelect');
  if (calendarRoomSelect) calendarRoomSelect.style.display = role === 'student' ? 'none' : '';

  // Sidebar: toggle between ACTIVE ROOM card (admin/student) and CURRENT SCHEDULE card (teacher)
  var roomSelect = document.getElementById('roomSelect');
  var lockedNotice = document.getElementById('studentLockedRoomNotice');
  var lockedTag = document.getElementById('studentLockedRoomName');
  var sidebarRoomCard = document.getElementById('sidebarRoomCard');
  var sidebarTeacherCard = document.getElementById('sidebarTeacherScheduleCard');
  var adminAddBtn = document.getElementById('adminAddScheduleBtn');
  if (adminAddBtn) adminAddBtn.style.display = 'none';
  var scheduleActionsColHeader = document.getElementById('scheduleActionsColHeader');
  if (scheduleActionsColHeader) scheduleActionsColHeader.style.display = 'none';

  if (role === 'student') {
    // Show room card (locked to active schedule room), hide teacher card
    if (sidebarRoomCard) sidebarRoomCard.style.display = 'block';
    if (sidebarTeacherCard) sidebarTeacherCard.style.display = 'none';
    var activeSch = getActiveScheduleForStudent(ROLES.student, new Date());
    if (activeSch) {
      roomSelect.value = activeSch.room;
      roomSelect.disabled = true;
      if (lockedNotice) {
        lockedNotice.style.display = 'block';
        lockedTag.textContent = ROOMS[activeSch.room].split('—')[0].trim() + ' (ACTIVE)';
        lockedTag.style.color = 'var(--blue-600)';
      }
    } else {
      roomSelect.disabled = true;
      if (lockedNotice) {
        lockedNotice.style.display = 'block';
        lockedTag.textContent = 'NO ACTIVE SCHEDULE';
        lockedTag.style.color = 'var(--warning)';
      }
    }
  } else if (role === 'teacher') {
    // Teacher: hide the room-select card entirely; show the auto-driven Current Schedule card
    if (sidebarRoomCard) sidebarRoomCard.style.display = 'none';
    if (sidebarTeacherCard) sidebarTeacherCard.style.display = 'block';
    // Keep roomSelect functional internally (for admin tools), but irrelevant to teacher sidebar
    roomSelect.disabled = false;
    if (lockedNotice) lockedNotice.style.display = 'none';
  } else {
    // Admin: show the standard ACTIVE ROOM card with full room selector
    if (sidebarRoomCard) sidebarRoomCard.style.display = 'block';
    if (sidebarTeacherCard) sidebarTeacherCard.style.display = 'none';
    roomSelect.disabled = false;
    if (lockedNotice) lockedNotice.style.display = 'none';
  }

  if (!isViewAllowed(activeView, role)) switchView('overview'); else switchView(activeView);
  renderRoleActions();
  renderAll();
  toast('info', 'Profile switched', 'Now viewing as ' + r.name + ' (' + r.badge + ').');
}

document.querySelectorAll('#profileDropdown .dropdown-item[data-role]').forEach(function(item){
  item.addEventListener('click', function(){ applyRole(item.getAttribute('data-role')); });
});
document.getElementById('logoutItem').addEventListener('click', function(){
  toast('info', 'Session locked', 'This is a demo profile — sign-out is simulated.');
});

/* ---------- Sidebar Room Select Synchronizer ---------- */
document.getElementById('roomSelect').addEventListener('change', function(){
  var val = this.value;
  var filter = document.getElementById('stationRoomFilter');
  if (filter && currentRole !== 'student') {
    filter.value = val;
    renderStationsGrid();
  }
  var calSelect = document.getElementById('calendarRoomSelect');
  if (calSelect) {
    calSelect.value = val;
    renderScheduleTimetableGrid();
  }
});

var VIEW_TITLES = {
  overview: ['Dashboard Overview','CCS Computer Laboratory Hub'],
  stations: ['PC Stations','Live status for every workstation'],
  tickets: ['Incident Reports','Reported problems and their status'],
  usage: ['PC Usage History','Full session record per PC'],
  students: ['Checked-In Students','Live attendance across all rooms'],
  schedule: ['Class Schedules','Weekly reservation calendar & room assignment'],
  settings: ['System Settings','Administrator configuration']
};
var activeView = 'overview';
function switchView(name){
  if (!isViewAllowed(name, currentRole)) name = 'overview';
  activeView = name;
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  var target = document.getElementById('view-' + name);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item[data-view]').forEach(function(n){ n.classList.toggle('active', n.getAttribute('data-view') === name); });
  document.getElementById('pageTitle').textContent = VIEW_TITLES[name][0];
  document.getElementById('pageCrumb').textContent = VIEW_TITLES[name][1];
  closeSidebar();
}
document.querySelectorAll('.nav-item[data-view]').forEach(function(n){
  n.addEventListener('click', function(){ switchView(n.getAttribute('data-view')); });
});
document.querySelectorAll('[data-goto]').forEach(function(b){
  b.addEventListener('click', function(){ switchView(b.getAttribute('data-goto')); });
});

/* ---------- Topbar Role Actions ---------- */
function renderRoleActions(){
  var host = document.getElementById('roleActions');
  host.innerHTML = '';
  if (currentRole === 'student') {
    var mySession = stations.find(function(s){ return s.session && s.session.studentId === ROLES.student.studentId; });
    if (mySession) {
      var reportBtn = document.createElement('button');
      reportBtn.className = 'btn btn-outline';
      reportBtn.innerHTML = ICON.report + '<span class="btn-label-full">Report a Problem</span>';
      reportBtn.addEventListener('click', function(){ openReportModal(mySession.id); });
      var coBtn = document.createElement('button');
      coBtn.className = 'btn btn-primary';
      coBtn.innerHTML = ICON.logout + '<span class="btn-label-full">Check Out</span>';
      coBtn.addEventListener('click', function(){ doStudentCheckout(mySession.id); });
      host.appendChild(reportBtn); host.appendChild(coBtn);
    } else {
      var goBtn = document.createElement('button');
      goBtn.className = 'btn btn-primary';
      goBtn.innerHTML = ICON.monitor + '<span class="btn-label-full">Select a PC</span>';
      goBtn.addEventListener('click', function(){ switchView('stations'); });
      host.appendChild(goBtn);
    }
  } else if (currentRole === 'admin') {
    var incBtn = document.createElement('button');
    incBtn.className = 'btn btn-outline';
    incBtn.innerHTML = ICON.ticket + '<span class="btn-label-full">Manage Incidents</span>';
    incBtn.addEventListener('click', function(){ switchView('tickets'); });
    host.appendChild(incBtn);
  }
  var reportBtn2 = document.getElementById('reportProblemBtn2');
  if (currentRole === 'student') {
    var hasSession = stations.some(function(s){ return s.session && s.session.studentId === ROLES.student.studentId; });
    reportBtn2.style.display = hasSession ? 'inline-flex' : 'none';
    reportBtn2.onclick = function(){
      var st = stations.find(function(s){ return s.session && s.session.studentId === ROLES.student.studentId; });
      if (st) openReportModal(st.id);
    };
  } else {
    reportBtn2.style.display = 'none';
  }
}

/* =========================================================================
   MODALS MANAGEMENT
   ========================================================================= */
function openModal(id){
  var m = document.getElementById(id + 'Modal');
  if (m) m.classList.add('open');
}
function closeModal(id){
  var m = document.getElementById(id + 'Modal');
  if (m) m.classList.remove('open');
}
document.querySelectorAll('[data-close-modal]').forEach(function(b){
  b.addEventListener('click', function(){ closeModal(b.getAttribute('data-close-modal')); });
});
document.querySelectorAll('.modal-backdrop').forEach(function(bg){
  bg.addEventListener('click', function(e){ if (e.target === bg) bg.classList.remove('open'); });
});
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(function(m){ m.classList.remove('open'); });
});
function setFieldError(id, hasError){ var f = document.getElementById(id); if (f) f.classList.toggle('has-error', hasError); }

/* ---------- Student Check-in Modal ---------- */
var checkinTargetId = null;
function openCheckinModal(stationId){
  var st = stations.find(function(s){ return s.id === stationId; });
  if (!st) return;

  var activeSchedule = getActiveScheduleForStudent(ROLES.student, new Date());
  if (!activeSchedule) {
    toast('danger', 'Check-in blocked', 'No active laboratory schedule for your class at this time.');
    return;
  }
  if (st.room !== activeSchedule.room) {
    toast('danger', 'Access restricted', 'You can only select PCs in ' + ROOMS[activeSchedule.room] + '. Your section is not assigned to ' + ROOMS[st.room] + '.');
    return;
  }
  if (st.status !== 'available') {
    toast('warning', 'Not available', stationId + ' is currently ' + st.status.toUpperCase() + '. Please select an AVAILABLE station.');
    renderAll();
    return;
  }

  checkinTargetId = stationId;
  document.getElementById('checkinModalTitle').textContent = 'Use ' + stationId + '?';
  document.getElementById('checkinModalRoom').textContent = ROOMS[st.room];
  document.getElementById('checkinIdentity').textContent = ROLES.student.name;
  document.getElementById('checkinStudentId').textContent = ROLES.student.studentId;
  document.getElementById('checkinSection').textContent = ROLES.student.section;
  document.getElementById('checkinTeacher').textContent = activeSchedule.teacher;
  document.getElementById('checkinScheduleId').textContent = activeSchedule.id;
  document.getElementById('checkinRoomName').textContent = ROOMS[st.room];
  document.getElementById('checkinScheduleTime').textContent = activeSchedule.day + ', ' + formatTimeRange(activeSchedule.startTime, activeSchedule.endTime);

  openModal('checkin');
}

document.getElementById('confirmCheckinBtn').addEventListener('click', function(){
  if (!checkinTargetId) return;
  var ok = checkInStudent(checkinTargetId);
  closeModal('checkin');
  if (ok) {
    renderAll();
    toast('success', 'Checked in successfully', 'You are now checked into ' + checkinTargetId + '. Status updated to OCCUPIED under your active schedule.');
  }
  checkinTargetId = null;
});

/* ---------- Report Incident Modal (Student) ---------- */
var reportTargetId = null;
function openReportModal(stationId){
  var st = stations.find(function(s){ return s.id === stationId; });
  if (!st || !st.session) { toast('warning', 'No active session', 'You must be checked into a PC to report a problem.'); return; }
  reportTargetId = stationId;
  document.getElementById('reportIdentityStrip').innerHTML = 'Reporting as <strong>' + ROLES.student.name + '</strong> &bull; ' + ROLES.student.studentId + ' &bull; ' + ROLES.student.section + ' &bull; ' + stationId;
  document.getElementById('reportRemarkInput').value = '';
  setFieldError('fld-reportRemark', false);
  openModal('report');
}

document.getElementById('submitReportBtn').addEventListener('click', function(){
  var val = document.getElementById('reportRemarkInput').value.trim();
  var valid = val.length > 3;
  setFieldError('fld-reportRemark', !valid);
  if (!valid || !reportTargetId) return;
  var inc = reportIncident(reportTargetId, val);
  closeModal('report');
  renderAll();
  if (inc) toast('danger', 'Incident reported', inc.id + ' filed for ' + reportTargetId + ' in ' + ROOMS[inc.room] + '. Sent to IT administrators.');
  reportTargetId = null;
});

function doStudentCheckout(stationId){
  var ok = checkOutStudent(stationId);
  if (ok) {
    renderAll();
    var st = stations.find(function(s){ return s.id === stationId; });
    var msg = st && (st.status === 'pending' || st.status === 'maintenance')
      ? stationId + ' has an unresolved report and remains ' + st.status.toUpperCase() + ' until IT review.'
      : stationId + ' is now AVAILABLE for the next scheduled student.';
    toast('success', 'Checked out', msg);
  }
}

/* ---------- Station Detail Modal (Admin & Teacher) ---------- */
function statusLabel(s){ return s === 'pending' ? 'Pending / Reported' : s.charAt(0).toUpperCase() + s.slice(1); }
function chip(cls, text){ return '<span class="chip ' + cls + '">' + text + '</span>'; }

function openStationDetail(id){
  var st = stations.find(function(s){ return s.id === id; });
  if (!st) return;
  document.getElementById('detailStationId').textContent = 'Station ' + st.id;
  document.getElementById('detailStationRoom').textContent = ROOMS[st.room];

  var relatedIncidents = incidents.filter(function(i){ return i.pcNumber === id; }).sort(function(a,b){ return b.date - a.date; });
  var body = '<div class="detail-grid">' +
    '<div class="detail-item"><span>Status</span>' + chip(st.status, statusLabel(st.status)) + '</div>' +
    '<div class="detail-item"><span>Laboratory Room</span><strong>' + (ROOMS[st.room] ? ROOMS[st.room].split('—')[0].trim() : st.room) + '</strong></div>' +
    '<div class="detail-item"><span>Processor</span><strong>' + st.cpu + '</strong></div>' +
    '<div class="detail-item"><span>Memory</span><strong>' + st.ram + '</strong></div>' +
  '</div>';

  body += '<div class="detail-section-title">Current Session &amp; Schedule Context</div>';
  if (st.session) {
    var sess = st.session;
    body += '<div class="mini-row"><div class="mini-main">' +
      '<strong>' + sess.studentName + ' \u2014 ' + sess.studentId + '</strong>' +
      '<span>Class: ' + sess.section + ' &bull; Teacher: ' + sess.teacher + ' &bull; Schedule: ' + (sess.scheduleId || '—') + ' (' + (sess.scheduledDay ? sess.scheduledDay + ' ' : '') + formatTimeRange(sess.scheduledStartTime, sess.scheduledEndTime) + ') &bull; In since ' + fmtTime(sess.checkIn) + '</span>' +
    '</div>' + chip('occupied', 'OCCUPIED') + '</div>';
  } else {
    body += '<p style="font-size:12.5px;color:var(--text-secondary);margin:0;">This station is currently unoccupied.</p>';
  }

  if (relatedIncidents.length) {
    body += '<div class="detail-section-title">Related Incidents</div><div class="mini-list">';
    relatedIncidents.slice(0,4).forEach(function(i){
      body += '<div class="mini-row"><div class="mini-main">' +
        '<strong>' + i.id + ' \u2014 ' + i.remark + '</strong>' +
        '<span>' + i.studentName + ' (' + i.section + ') &bull; ' + fmtDateTime(i.date) + '</span>' +
      '</div>' + chip(incidentChipClass(i.status), i.status) + '</div>';
    });
    body += '</div>';
  }

  var hist = st.history.slice().reverse().slice(0,4);
  body += '<div class="detail-section-title">Recent Usage History</div>';
  if (hist.length) {
    body += '<div class="mini-list">';
    hist.forEach(function(h){
      body += '<div class="mini-row"><div class="mini-main">' +
        '<strong>' + h.studentName + ' (' + h.studentId + ')</strong>' +
        '<span>' + h.section + ' &bull; Teacher: ' + h.teacher + ' &bull; Schedule: ' + (h.scheduleId || '—') + ' &bull; ' + fmtTime(h.checkIn) + ' \u2013 ' + fmtTime(h.checkOut) + '</span>' +
      '</div></div>';
    });
    body += '</div>';
  } else {
    body += '<p style="font-size:12.5px;color:var(--text-secondary);margin:0;">No past sessions recorded for this PC yet.</p>';
  }

  document.getElementById('stationDetailBody').innerHTML = body;

  var foot = '<button class="btn btn-outline" data-close-modal="stationDetail">Close</button>';
  if (currentRole === 'admin') {
    if (st.session) {
      foot += '<button class="btn btn-danger" id="detailForceCheckout">Force check-out</button>';
    } else if (st.manualUnavailable) {
      foot += '<button class="btn btn-primary" id="detailToggleUnavailable">Restore to available</button>';
    } else if (st.status === 'available') {
      foot += '<button class="btn btn-outline" id="detailToggleUnavailable">Mark unavailable</button>';
    }
  }
  document.getElementById('stationDetailFoot').innerHTML = foot;

  var fc = document.getElementById('detailForceCheckout');
  if (fc) fc.addEventListener('click', function(){ closeModal('stationDetail'); adminForceCheckout(id); renderAll(); });
  var tu = document.getElementById('detailToggleUnavailable');
  if (tu) tu.addEventListener('click', function(){
    adminToggleUnavailable(id);
    closeModal('stationDetail'); renderAll();
    var s2 = stations.find(function(s){ return s.id === id; });
    toast(s2.manualUnavailable ? 'warning' : 'success', s2.manualUnavailable ? 'Marked unavailable' : 'Restored', id + ' is now ' + statusLabel(s2.status).toUpperCase() + '.');
  });

  document.querySelectorAll('#stationDetailModal [data-close-modal]').forEach(function(b){
    b.addEventListener('click', function(){ closeModal('stationDetail'); });
  });
  openModal('stationDetail');
}

/* ---------- Incident Detail & Admin Resolution Modal ---------- */
function incidentChipClass(status){
  if (status === 'PENDING') return 'pending';
  if (status === 'VERIFIED') return 'verified';
  if (status === 'UNDER MAINTENANCE') return 'maintenance';
  if (status === 'RESOLVED') return 'resolved';
  if (status === 'DISMISSED') return 'dismissed';
  return 'pending';
}

function openIncidentModal(id){
  var inc = incidents.find(function(i){ return i.id === id; });
  if (!inc) return;
  document.getElementById('incidentModalTitle').textContent = 'Incident ' + inc.id;
  document.getElementById('incidentModalSub').textContent = inc.pcNumber + ' \u2022 ' + (ROOMS[inc.room] || inc.room) + ' \u2022 Reported ' + fmtDateTime(inc.date);

  var body = '<div class="detail-grid">' +
    '<div class="detail-item"><span>Student</span><strong>' + inc.studentName + '</strong></div>' +
    '<div class="detail-item"><span>Student ID</span><strong>' + inc.studentId + '</strong></div>' +
    '<div class="detail-item"><span>Section / Teacher</span><strong>' + inc.section + ' (' + inc.teacher + ')</strong></div>' +
    '<div class="detail-item"><span>Laboratory Room</span><strong>' + (ROOMS[inc.room] ? ROOMS[inc.room].split('—')[0].trim() : (inc.room || '—')) + '</strong></div>' +
    '<div class="detail-item"><span>Schedule Record</span><strong>' + (inc.scheduleId !== '—' ? inc.scheduleId + ' (' + (inc.scheduledDay ? inc.scheduledDay + ' ' : '') + formatTimeRange(inc.scheduledStartTime, inc.scheduledEndTime) + ')' : '—') + '</strong></div>' +
    '<div class="detail-item"><span>Current Status</span>' + chip(incidentChipClass(inc.status), inc.status) + '</div>' +
  '</div>' +
  '<div class="detail-section-title">Student Problem Description</div>' +
  '<p style="font-size:12.5px;margin:0 0 14px;background:var(--surface-alt);padding:10px 12px;border-radius:8px;border:1px solid var(--border);">' + inc.remark + '</p>';

  if (currentRole === 'admin' && inc.status !== 'RESOLVED' && inc.status !== 'DISMISSED') {
    body += '<div class="field" style="margin-top:16px;"><label>Administrator remark</label><textarea id="incAdminRemark" rows="2" placeholder="Optional note, e.g. technician dispatched, spare part requested…">' + (inc.adminRemark||'') + '</textarea></div>';
    body += '<div class="field" id="fld-incResolution"><label>Resolution <span class="req">*</span> <span class="hint" style="display:inline;">(required to resolve)</span></label><textarea id="incResolution" rows="2" placeholder="e.g. Mouse replaced with functional unit; station tested and restored to service.">' + (inc.resolution||'') + '</textarea><span class="field-error">Describe the resolution before returning the PC to service.</span></div>';
  } else if (inc.adminRemark || inc.resolution) {
    body += '<div class="detail-section-title">Administrator Notes</div>';
    if (inc.adminRemark) body += '<p style="font-size:12.5px;margin:0 0 6px;"><strong>Remark:</strong> ' + inc.adminRemark + '</p>';
    if (inc.resolution) body += '<p style="font-size:12.5px;margin:0;"><strong>Resolution:</strong> ' + inc.resolution + '</p>';
    if (inc.dateResolved) body += '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Resolved: ' + fmtDateTime(inc.dateResolved) + '</p>';
  }

  document.getElementById('incidentModalBody').innerHTML = body;

  var foot = '<button class="btn btn-outline" data-close-modal="incident">Close</button>';
  if (currentRole === 'admin' && inc.status !== 'RESOLVED' && inc.status !== 'DISMISSED') {
    if (inc.status === 'PENDING') foot += '<button class="btn btn-outline" id="actVerify">Verify</button>';
    if (inc.status !== 'UNDER MAINTENANCE') foot += '<button class="btn btn-outline" id="actMaintenance">Place under maintenance</button>';
    foot += '<button class="btn btn-outline" id="actDismiss">Dismiss</button>';
    foot += '<button class="btn btn-primary" id="actResolve">Resolve &amp; return to service</button>';
  }
  document.getElementById('incidentModalFoot').innerHTML = foot;

  var av = document.getElementById('actVerify');
  if (av) av.addEventListener('click', function(){ adminVerify(inc.id); closeModal('incident'); renderAll(); toast('info','Incident verified', inc.id + ' marked as verified.'); });
  var am = document.getElementById('actMaintenance');
  if (am) am.addEventListener('click', function(){ adminSetMaintenance(inc.id); closeModal('incident'); renderAll(); toast('warning','Under maintenance', inc.pcNumber + ' placed under maintenance.'); });
  var ad = document.getElementById('actDismiss');
  if (ad) ad.addEventListener('click', function(){
    var remark = (document.getElementById('incAdminRemark')||{}).value || '';
    adminDismiss(inc.id, remark); closeModal('incident'); renderAll();
    toast('info','Incident dismissed', inc.id + ' was dismissed.');
  });
  var ar = document.getElementById('actResolve');
  if (ar) ar.addEventListener('click', function(){
    var resolution = (document.getElementById('incResolution')||{}).value.trim();
    var remark = (document.getElementById('incAdminRemark')||{}).value || '';
    var valid = resolution.length > 3;
    setFieldError('fld-incResolution', !valid);
    if (!valid) return;
    adminResolve(inc.id, resolution, remark); closeModal('incident'); renderAll();
    toast('success','Incident resolved', inc.pcNumber + ' returned to AVAILABLE (if unoccupied).');
  });

  document.querySelectorAll('#incidentModal [data-close-modal]').forEach(function(b){
    b.addEventListener('click', function(){ closeModal('incident'); });
  });
  openModal('incident');
}

/* =========================================================================
   ADMINISTRATOR SCHEDULE MANAGEMENT (CRUD & CONFLICT PREVENTION)
   ========================================================================= */
function updateModalConflictWarning(){
  var room = document.getElementById('schRoomSelect').value;
  var day = document.getElementById('schDaySelect').value;
  var start = document.getElementById('schStartTimeInput').value;
  var end = document.getElementById('schEndTimeInput').value;
  var editId = document.getElementById('schEditId').value;

  var conflict = checkScheduleConflict(room, day, start, end, editId);
  var alertBox = document.getElementById('scheduleConflictAlert');
  var alertText = document.getElementById('scheduleConflictText');
  if (conflict) {
    alertBox.classList.add('show');
    alertText.textContent = 'Conflict detected: ' + ROOMS[conflict.room] + ' is already allocated to ' + conflict.section + ' (' + conflict.teacher + ') on ' + conflict.day + ' from ' + formatTimeRange(conflict.startTime, conflict.endTime) + ' (' + conflict.id + '). Overlapping schedules for the same laboratory room are prohibited.';
    return conflict;
  } else {
    alertBox.classList.remove('show');
    return null;
  }
}

['schRoomSelect','schDaySelect','schStartTimeInput','schEndTimeInput'].forEach(function(id){
  var el = document.getElementById(id);
  if (el) el.addEventListener('change', updateModalConflictWarning);
});

function openScheduleModal(editScheduleId){
  toast('info', 'Static enrollment data', 'Laboratory assignments are imported from the school enrollment report and cannot be edited here.');
}

var adminAddBtn = document.getElementById('adminAddScheduleBtn');
if (adminAddBtn) {
  adminAddBtn.style.display = 'none';
  adminAddBtn.addEventListener('click', function(){ openScheduleModal(null); });
}

var saveScheduleBtn = document.getElementById('saveScheduleBtn');
if (saveScheduleBtn) {
  saveScheduleBtn.addEventListener('click', function(){
    toast('info', 'Static enrollment data', 'The schedule is read-only and is sourced from the enrollment report.');
  });
}

function deleteSchedule(id){
  toast('info', 'Static enrollment data', 'Schedule records are read-only and cannot be deleted in this dashboard.');
}

/* =========================================================================
   RENDERERS & DATA POPULATION
   ========================================================================= */
function counts(){
  var c = { available:0, occupied:0, pending:0, maintenance:0, unavailable:0 };
  stations.forEach(function(s){ c[s.status]++; });
  c.total = stations.length;
  c.activeStudents = stations.filter(function(s){ return !!s.session; }).length;
  c.openIncidents = incidents.filter(function(i){ return i.status !== 'RESOLVED' && i.status !== 'DISMISSED'; }).length;
  return c;
}

function renderStats(){
  var c = counts();
  var navStatBadge = document.getElementById('navStationBadge');
  if (navStatBadge) navStatBadge.textContent = c.available + '/' + c.total;
  var navTickBadge = document.getElementById('navTicketBadge');
  if (navTickBadge) navTickBadge.textContent = c.openIncidents;

  var pct = Math.round((c.occupied / c.total) * 100);
  var capPct = document.getElementById('capacityPct');
  if (capPct) capPct.textContent = pct + '%';
  var capFill = document.getElementById('capacityFill');
  if (capFill) capFill.style.width = pct + '%';
  var capNote = document.getElementById('capacityNote');
  if (capNote) capNote.textContent = c.occupied + ' occupied \u2022 ' + c.available + ' available \u2022 ' + (c.pending + c.maintenance) + ' need attention';

  if (currentRole === 'admin') {
    document.getElementById('statTotal').textContent = c.total;
    document.getElementById('statAvailable').textContent = c.available;
    document.getElementById('statOccupied').textContent = c.occupied;
    document.getElementById('statPending').textContent = c.pending;
    document.getElementById('statMaintenance').textContent = c.maintenance;
    document.getElementById('statUnavailable').textContent = c.unavailable;
    document.getElementById('statActiveStudents').textContent = c.activeStudents;
    document.getElementById('statOpenIncidents').textContent = c.openIncidents;
  } else if (currentRole === 'teacher') {
    var myTeacherSchedules = schedules.filter(function(s){ return s.teacher === ROLES.teacher.name; });
    var mySections = ROLES.teacher.sections;
    var sub = document.getElementById('teacherSectionsSub');
    if (sub) sub.textContent = 'Assigned Sections: ' + mySections.join(', ') + ' &bull; Active teacher monitoring';
    var myActive = stations.filter(function(s){ return s.session && mySections.indexOf(s.session.section) !== -1; }).length;
    var myIncidents = incidents.filter(function(i){ return mySections.indexOf(i.section) !== -1 && i.status !== 'RESOLVED' && i.status !== 'DISMISSED'; }).length;
    document.getElementById('statMyActive').textContent = myActive;
    document.getElementById('statMyIncidents').textContent = myIncidents;
    document.getElementById('statMySections').textContent = myTeacherSchedules.length;
  }
}

function renderUtilChart(){
  var c = counts();
  if (!utilChart) return;
  utilChart.data.datasets[0].data = [c.available, c.occupied, c.pending, c.maintenance, c.unavailable];
  utilChart.update();
  var legend = document.getElementById('utilLegend');
  if (!legend) return;
  var rows = [
    ['#0f8a4b','Available',c.available],
    ['#2f6fed','Occupied',c.occupied],
    ['#b4720a','Pending / Reported',c.pending],
    ['#c62a3f','Under maintenance',c.maintenance],
    ['#8b97ab','Unavailable',c.unavailable]
  ];
  legend.innerHTML = rows.map(function(r){
    return '<div class="legend-row"><span class="legend-dot" style="background:' + r[0] + ';"></span><span class="name">' + r[1] + '</span><span class="val">' + r[2] + '</span></div>';
  }).join('');
}

function allHistoryEntries(){
  var list = [];
  stations.forEach(function(s){
    s.history.forEach(function(h){
      var inc = h.incidentId ? incidents.find(function(i){ return i.id === h.incidentId; }) : null;
      list.push({
        pc: s.id,
        room: h.room || s.room,
        studentId: h.studentId,
        studentName: h.studentName,
        section: h.section,
        teacher: h.teacher,
        scheduleId: h.scheduleId || '—',
        scheduledDay: h.scheduledDay || '—',
        scheduledStartTime: h.scheduledStartTime || '—',
        scheduledEndTime: h.scheduledEndTime || '—',
        checkIn: h.checkIn,
        checkOut: h.checkOut,
        incidentId: h.incidentId,
        incidentStatus: inc ? inc.status : (h.incidentStatus || 'None')
      });
    });
    if (s.session) {
      var sess = s.session;
      var inc = incidents.slice().reverse().find(function(i){
        return i.pcNumber === s.id && i.studentId === sess.studentId && i.status !== 'RESOLVED' && i.status !== 'DISMISSED';
      });
      list.push({
        pc: s.id,
        room: sess.room || s.room,
        studentId: sess.studentId,
        studentName: sess.studentName,
        section: sess.section,
        teacher: sess.teacher,
        scheduleId: sess.scheduleId || '—',
        scheduledDay: sess.scheduledDay || '—',
        scheduledStartTime: sess.scheduledStartTime || '—',
        scheduledEndTime: sess.scheduledEndTime || '—',
        checkIn: sess.checkIn,
        checkOut: null,
        incidentId: inc ? inc.id : null,
        incidentStatus: inc ? inc.status : 'None'
      });
    }
  });
  return list.sort(function(a,b){ return b.checkIn - a.checkIn; });
}

function renderRecentIncidents(){
  var body = document.getElementById('recentIncidentsBody');
  if (!body) return;
  var list = incidents.slice().sort(function(a,b){ return b.date - a.date; }).slice(0,5);
  body.innerHTML = list.map(function(i){
    return '<tr><td class="mono">' + i.id + '</td><td class="mono">' + i.pcNumber + '</td><td>' + i.studentName + '</td><td>' + chip(incidentChipClass(i.status), i.status) + '</td><td class="mono">' + fmtTime(i.date) + '</td></tr>';
  }).join('') || '<tr class="empty-row"><td colspan="5">No incidents reported yet.</td></tr>';
}

function renderRecentUsage(){
  var body = document.getElementById('recentUsageBody');
  if (!body) return;
  var list = allHistoryEntries().slice(0,6);
  body.innerHTML = list.map(function(h){
    var roomShort = ROOMS[h.room] ? ROOMS[h.room].split('—')[0].trim() : h.room;
    return '<tr>' +
      '<td class="mono">' + h.pc + '<span class="cell-sub">' + roomShort + '</span></td>' +
      '<td>' + h.studentName + '</td>' +
      '<td>' + h.section + '</td>' +
      '<td class="mono">' + fmtTime(h.checkIn) + '</td>' +
      '<td class="mono">' + (h.checkOut ? fmtTime(h.checkOut) : '<span class="chip occupied">In lab</span>') + '</td>' +
      '<td>' + (h.incidentId ? chip(incidentChipClass(h.incidentStatus), h.incidentId) : '<span class="muted-cell">None</span>') + '</td>' +
    '</tr>';
  }).join('') || '<tr class="empty-row"><td colspan="6">No usage recorded yet.</td></tr>';
}

/* ---------- Teacher Dashboard & Monitoring ---------- */
function renderTeacherOverview(){
  var myTeacherName = ROLES.teacher.name;
  var myTeacherSchedules = schedules.filter(function(s){ return s.teacher === myTeacherName; });
  var mySections = ROLES.teacher.sections;

  var schBody = document.getElementById('teacherSchedulesBody');
  var now = new Date();
  if (schBody) {
    schBody.innerHTML = myTeacherSchedules.map(function(s){
      var active = isScheduleActive(s, now);
      var statusBadge = active
        ? '<span class="chip active-schedule">ACTIVE NOW</span>'
        : '<span class="chip upcoming-schedule">Scheduled</span>';
      return '<tr>' +
        '<td class="mono"><strong>' + s.id + '</strong>' + (s.subject ? '<span class="cell-sub">' + s.subject + '</span>' : '') + '</td>' +
        '<td><strong>' + s.section + '</strong></td>' +
        '<td>' + ROOMS[s.room] + '</td>' +
        '<td>' + s.day + '</td>' +
        '<td class="mono">' + formatTimeRange(s.startTime, s.endTime) + '</td>' +
        '<td>' + statusBadge + '</td>' +
      '</tr>';
    }).join('') || '<tr class="empty-row"><td colspan="6">No laboratory schedules assigned to you yet.</td></tr>';
  }

  var sessBody = document.getElementById('teacherSessionsBody');
  if (sessBody) {
    var list = allHistoryEntries().filter(function(h){ return mySections.indexOf(h.section) !== -1; }).slice(0,10);
    sessBody.innerHTML = list.map(function(h){
      var roomShort = ROOMS[h.room] ? ROOMS[h.room].split('—')[0].trim() : h.room;
      return '<tr>' +
        '<td>' + h.studentName + '<span class="cell-sub">' + h.studentId + '</span></td>' +
        '<td>' + h.section + '</td>' +
        '<td class="mono">' + h.pc + '<span class="cell-sub">' + roomShort + '</span></td>' +
        '<td class="mono">' + fmtTime(h.checkIn) + '</td>' +
        '<td class="mono">' + (h.checkOut ? fmtTime(h.checkOut) : '\u2014') + '</td>' +
        '<td>' + (h.checkOut ? chip('resolved','Checked out') : chip('occupied','In lab')) + '</td>' +
      '</tr>';
    }).join('') || '<tr class="empty-row"><td colspan="6">No student sessions recorded for your sections yet.</td></tr>';
  }

  var incBody = document.getElementById('teacherIncidentsBody');
  if (incBody) {
    var incList = incidents.filter(function(i){ return mySections.indexOf(i.section) !== -1; }).sort(function(a,b){ return b.date-a.date; });
    incBody.innerHTML = incList.map(function(i){
      var roomShort = ROOMS[i.room] ? ROOMS[i.room].split('—')[0].trim() : (i.room || '');
      return '<tr>' +
        '<td class="mono">' + i.id + '<span class="cell-sub">' + (i.scheduleId || '—') + '</span></td>' +
        '<td>' + i.studentName + '</td>' +
        '<td class="mono">' + i.pcNumber + (roomShort ? '<span class="cell-sub">' + roomShort + '</span>' : '') + '</td>' +
        '<td>' + i.remark + '</td>' +
        '<td>' + chip(incidentChipClass(i.status), i.status) + '</td>' +
        '<td class="muted-cell">' + (i.adminRemark || '\u2014') + '</td>' +
      '</tr>';
    }).join('') || '<tr class="empty-row"><td colspan="6">No incidents reported in your sections.</td></tr>';
  }
}

/* ---------- Student Dashboard & Schedule Enforcement ---------- */
function renderStudentOverview(){
  var activeSchedule = getActiveScheduleForStudent(ROLES.student, new Date());
  var bannerEl = document.getElementById('studentScheduleOverviewBanner');

  if (bannerEl) {
    if (activeSchedule) {
      bannerEl.innerHTML =
        '<div class="schedule-banner active">' +
          '<div class="schedule-banner-icon">' + ICON.check + '</div>' +
          '<div class="schedule-banner-text">' +
            '<strong>Active Laboratory Schedule: ' + ROOMS[activeSchedule.room] + '</strong>' +
            '<p>Your class has an active laboratory schedule. You are authorized to select any AVAILABLE computer in ' + ROOMS[activeSchedule.room] + '.</p>' +
            '<div class="schedule-meta-pills">' +
              '<span class="schedule-meta-pill"><strong>Class:</strong> ' + ROLES.student.section + '</span>' +
              '<span class="schedule-meta-pill"><strong>Teacher:</strong> ' + activeSchedule.teacher + '</span>' +
              '<span class="schedule-meta-pill"><strong>Laboratory:</strong> ' + ROOMS[activeSchedule.room] + '</span>' +
              '<span class="schedule-meta-pill"><strong>Schedule:</strong> ' + activeSchedule.day + ', ' + formatTimeRange(activeSchedule.startTime, activeSchedule.endTime) + '</span>' +
              '<span class="schedule-meta-pill"><strong>Schedule ID:</strong> ' + activeSchedule.id + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else {
      var upcoming = getUpcomingScheduleForSection(ROLES.student.section, new Date());
      var upcomingNote = upcoming
        ? '<div style="margin-top:6px;font-size:11.5px;color:var(--text);font-weight:600;">Next scheduled period: ' + upcoming.day + ', ' + formatTimeRange(upcoming.startTime, upcoming.endTime) + ' in ' + ROOMS[upcoming.room] + ' (Teacher: ' + upcoming.teacher + ')</div>'
        : '';
      bannerEl.innerHTML =
        '<div class="schedule-banner inactive">' +
          '<div class="schedule-banner-icon">' + ICON.info + '</div>' +
          '<div class="schedule-banner-text">' +
            '<strong>No active laboratory schedule for your class at this time.</strong>' +
            '<p>Students belonging to ' + ROLES.student.section + ' may only access laboratory workstations during authorized class schedules. Workstation check-in is currently locked.</p>' +
            upcomingNote +
          '</div>' +
        '</div>';
    }
  }

  var card = document.getElementById('sessionCard');
  var st = stations.find(function(s){ return s.session && s.session.studentId === ROLES.student.studentId; });
  if (st) {
    card.className = 'session-card has-session';
    var mins = Math.max(0, Math.round((Date.now() - st.session.checkIn.getTime()) / 60000));
    card.innerHTML =
      '<div class="session-active-head">' +
        '<div>' +
          '<div class="session-pc-name">' + st.id + '</div>' +
          '<div style="font-size:12.5px;color:var(--text-secondary);">' + ROOMS[st.room] + ' &bull; Schedule: ' + (st.session.scheduleId || '—') + '</div>' +
        '</div>' +
        chip(st.status, statusLabel(st.status)) +
      '</div>' +
      '<div class="session-meta-grid">' +
        '<div class="session-meta-item"><span>Checked in</span><strong>' + fmtTime(st.session.checkIn) + '</strong></div>' +
        '<div class="session-meta-item"><span>Time in lab</span><strong>' + mins + ' min</strong></div>' +
        '<div class="session-meta-item"><span>Class / Section</span><strong>' + st.session.section + '</strong></div>' +
        '<div class="session-meta-item"><span>Assigned Teacher</span><strong>' + st.session.teacher + '</strong></div>' +
      '</div>' +
      '<div class="session-actions">' +
        '<button class="btn btn-outline" id="sessCardReport">' + ICON.report + ' Report a Problem</button>' +
        '<button class="btn btn-primary" id="sessCardCheckout">' + ICON.logout + ' Check Out</button>' +
      '</div>';
    document.getElementById('sessCardReport').addEventListener('click', function(){ openReportModal(st.id); });
    document.getElementById('sessCardCheckout').addEventListener('click', function(){ doStudentCheckout(st.id); });
  } else {
    card.className = 'session-card';
    if (activeSchedule) {
      card.innerHTML =
        '<div class="session-empty">' +
          '<p>You are not currently checked into a workstation. Your class is active in <strong>' + ROOMS[activeSchedule.room] + '</strong>. Select an available PC to begin your session.</p>' +
          '<button class="btn btn-primary" id="sessCardBrowse">' + ICON.monitor + ' Select a PC in ' + ROOMS[activeSchedule.room].split('—')[0].trim() + '</button>' +
        '</div>';
      document.getElementById('sessCardBrowse').addEventListener('click', function(){ switchView('stations'); });
    } else {
      card.innerHTML =
        '<div class="session-empty">' +
          '<p>Workstation check-in is restricted to scheduled laboratory periods. Please wait until your class laboratory period begins.</p>' +
          '<button class="btn btn-outline" id="sessCardBrowse" disabled>' + ICON.monitor + ' Check-in Locked (No Active Schedule)</button>' +
        '</div>';
    }
  }

  var myBody = document.getElementById('myUsageBody');
  if (myBody) {
    var mine = allHistoryEntries().filter(function(h){ return h.studentId === ROLES.student.studentId; });
    myBody.innerHTML = mine.map(function(h){
      var roomShort = ROOMS[h.room] ? ROOMS[h.room].split('—')[0].trim() : h.room;
      return '<tr>' +
        '<td class="mono">' + h.pc + '<span class="cell-sub">' + roomShort + '</span></td>' +
        '<td class="mono">' + fmtDateTime(h.checkIn) + '</td>' +
        '<td class="mono">' + (h.checkOut ? fmtDateTime(h.checkOut) : '<span class="chip occupied">In lab</span>') + '</td>' +
        '<td>' + (h.incidentId ? chip(incidentChipClass(h.incidentStatus), h.incidentId) : '<span class="muted-cell">None</span>') + '</td>' +
      '</tr>';
    }).join('') || '<tr class="empty-row"><td colspan="4">No past sessions recorded yet.</td></tr>';
  }
}

/* ---------- Stations Grid Rendering (Schedule Enforced) ---------- */
function renderStationsGrid(){
  var grid = document.getElementById('stationsGrid');
  var stationsBanner = document.getElementById('studentStationsScheduleBanner');
  var roomFilterSelect = document.getElementById('stationRoomFilter');

  if (currentRole === 'student') {
    var activeSchedule = getActiveScheduleForStudent(ROLES.student, new Date());
    roomFilterSelect.disabled = true;

    if (!activeSchedule) {
      // Inactive schedule state
      roomFilterSelect.value = 'all';
      stationsBanner.innerHTML =
        '<div class="schedule-banner inactive">' +
          '<div class="schedule-banner-icon">' + ICON.info + '</div>' +
          '<div class="schedule-banner-text">' +
            '<strong>No active laboratory schedule for your class at this time.</strong>' +
            '<p>Workstation access is locked. You can only view and select PCs when your section has an active laboratory schedule.</p>' +
          '</div>' +
        '</div>';

      var upcoming = getUpcomingScheduleForSection(ROLES.student.section, new Date());
      var upcomingInfo = upcoming
        ? '<div style="margin-top:14px;"><span class="chip active-schedule">Upcoming Schedule: ' + upcoming.day + ', ' + formatTimeRange(upcoming.startTime, upcoming.endTime) + ' &bull; ' + ROOMS[upcoming.room] + ' (Teacher: ' + upcoming.teacher + ')</span></div>'
        : '';

      grid.innerHTML =
        '<div class="no-schedule-box" style="grid-column: 1 / -1;">' +
          '<div class="no-schedule-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6M9 9l6 6"></path></svg></div>' +
          '<h3>No active laboratory schedule for your class at this time.</h3>' +
          '<p>Students belonging to <strong>' + ROLES.student.section + '</strong> cannot view or select PCs outside authorized laboratory hours. PCs from other laboratory rooms are restricted.</p>' +
          upcomingInfo +
        '</div>';
      return;
    }

    // Active schedule state: Lock to assigned room ONLY
    roomFilterSelect.value = activeSchedule.room;
    stationsBanner.innerHTML =
      '<div class="schedule-banner active">' +
        '<div class="schedule-banner-icon">' + ICON.check + '</div>' +
        '<div class="schedule-banner-text">' +
          '<strong>Class: ' + ROLES.student.section + ', Teacher: ' + activeSchedule.teacher + ', Laboratory: ' + ROOMS[activeSchedule.room] + ', Schedule: ' + activeSchedule.day + ', ' + formatTimeRange(activeSchedule.startTime, activeSchedule.endTime) + '</strong>' +
          '<p>Displaying only computers located in your assigned laboratory room (' + ROOMS[activeSchedule.room] + '). You can select any AVAILABLE workstation.</p>' +
        '</div>' +
      '</div>';

    // Strictly show ONLY the PCs belonging to the assigned laboratory room
    var list = stations.filter(function(s){ return s.room === activeSchedule.room; });

    grid.innerHTML = list.map(function(s){
      var canUse = s.status === 'available';
      var roomTag = ROOMS[s.room] ? ROOMS[s.room].split('—')[0].trim() : s.room;
      return '<div class="station-card st-' + s.status + '">' +
        '<div class="station-top">' +
          '<span class="station-id">' + s.id + '</span>' +
          '<span class="station-dot"></span>' +
        '</div>' +
        '<div style="font-size:10.5px;color:var(--text-muted);font-weight:600;">' + roomTag + '</div>' +
        '<span class="station-status">' + statusLabel(s.status) + '</span>' +
        '<button class="btn btn-primary btn-sm use-pc-btn" data-use="' + s.id + '" ' + (canUse ? '' : 'disabled') + '>' + (canUse ? 'Use this PC' : 'Not available') + '</button>' +
      '</div>';
    }).join('');

    grid.querySelectorAll('[data-use]').forEach(function(btn){
      btn.addEventListener('click', function(){ openCheckinModal(btn.getAttribute('data-use')); });
    });

  } else {
    // Admin / Teacher mode: Multi-room browsing allowed
    roomFilterSelect.disabled = false;
    stationsBanner.innerHTML = '';

    var filter = roomFilterSelect.value;
    var list = filter === 'all' ? stations : stations.filter(function(s){ return s.room === filter; });

    grid.innerHTML = list.map(function(s){
      var roomTag = ROOMS[s.room] ? ROOMS[s.room].split('—')[0].trim() : s.room;
      return '<button class="station-card clickable st-' + s.status + '" data-id="' + s.id + '">' +
        '<div class="station-top">' +
          '<span class="station-id">' + s.id + '</span>' +
          '<span class="station-dot"></span>' +
        '</div>' +
        '<div style="font-size:10.5px;color:var(--text-muted);font-weight:600;">' + roomTag + '</div>' +
        '<span class="station-user">' + (s.session ? s.session.studentName : '\u2014') + '</span>' +
        '<span class="station-status">' + statusLabel(s.status) + '</span>' +
      '</button>';
    }).join('');

    grid.querySelectorAll('.station-card').forEach(function(card){
      card.addEventListener('click', function(){ openStationDetail(card.getAttribute('data-id')); });
    });
  }
}
document.getElementById('stationRoomFilter').addEventListener('change', renderStationsGrid);

/* ---------- Incident Tickets Table ---------- */
var ticketSort = { key:null, dir:1 };
function renderTicketsTable(){
  var body = document.getElementById('ticketsBody');
  var q = (document.getElementById('ticketSearch').value || '').toLowerCase();
  var statusFilter = document.getElementById('ticketStatusFilter').value;
  var list = incidents.slice();

  if (currentRole === 'student') list = list.filter(function(i){ return i.studentId === ROLES.student.studentId; });
  if (currentRole === 'teacher') list = list.filter(function(i){ return ROLES.teacher.sections.indexOf(i.section) !== -1; });

  list = list.filter(function(i){
    var roomName = ROOMS[i.room] || i.room || '';
    var searchStr = (i.id + ' ' + i.pcNumber + ' ' + i.studentName + ' ' + i.remark + ' ' + i.section + ' ' + i.teacher + ' ' + roomName).toLowerCase();
    var matchQ = !q || searchStr.indexOf(q) !== -1;
    var matchS = statusFilter === 'all' || i.status === statusFilter;
    return matchQ && matchS;
  });

  if (ticketSort.key) {
    list.sort(function(a,b){ var av=a[ticketSort.key], bv=b[ticketSort.key]; return (av>bv?1:av<bv?-1:0) * ticketSort.dir; });
  } else {
    list.sort(function(a,b){ return b.date - a.date; });
  }

  body.innerHTML = list.map(function(i){
    var lastCol;
    if (currentRole === 'admin' && i.status !== 'RESOLVED' && i.status !== 'DISMISSED') {
      lastCol = '<div class="row-actions"><button class="btn btn-ghost btn-sm manage-incident" data-id="' + i.id + '">Manage</button></div>';
    } else if (currentRole === 'admin') {
      lastCol = '<div class="row-actions"><button class="btn btn-ghost btn-sm manage-incident" data-id="' + i.id + '">View</button></div>';
    } else {
      lastCol = '<span class="muted-cell">' + (i.resolution || i.adminRemark || '\u2014') + '</span>';
    }
    var roomShort = ROOMS[i.room] ? ROOMS[i.room].split('—')[0].trim() : (i.room || '');
    return '<tr>' +
      '<td class="mono">' + i.id + '<span class="cell-sub">' + fmtDateTime(i.date) + '</span></td>' +
      '<td class="mono">' + i.pcNumber + (roomShort ? '<span class="cell-sub">' + roomShort + '</span>' : '') + '</td>' +
      '<td>' + i.studentName + '<span class="cell-sub">' + i.studentId + '</span></td>' +
      '<td>' + i.section + '<span class="cell-sub">' + i.teacher + (i.scheduleId !== '—' ? ' &bull; ' + i.scheduleId : '') + '</span></td>' +
      '<td style="max-width:200px;">' + i.remark + '</td>' +
      '<td>' + chip(incidentChipClass(i.status), i.status) + '</td>' +
      '<td style="text-align:right;">' + lastCol + '</td>' +
    '</tr>';
  }).join('') || '<tr class="empty-row"><td colspan="7">No incidents match your filters.</td></tr>';

  body.querySelectorAll('.manage-incident').forEach(function(btn){
    btn.addEventListener('click', function(){ openIncidentModal(btn.getAttribute('data-id')); });
  });
}

document.querySelectorAll('#ticketsTable th.sortable').forEach(function(th){
  th.addEventListener('click', function(){
    var key = th.getAttribute('data-key');
    if (ticketSort.key === key) ticketSort.dir *= -1; else { ticketSort.key = key; ticketSort.dir = 1; }
    document.querySelectorAll('#ticketsTable th.sortable').forEach(function(h){ h.classList.remove('sorted'); });
    th.classList.add('sorted');
    renderTicketsTable();
  });
});
document.getElementById('ticketSearch').addEventListener('input', renderTicketsTable);
document.getElementById('ticketStatusFilter').addEventListener('change', renderTicketsTable);

/* ---------- PC Usage History Table (Schedule Enriched) ---------- */
function renderUsageTable(){
  var body = document.getElementById('usageBody');
  var q = (document.getElementById('usageSearch').value || '').toLowerCase();
  var list = allHistoryEntries();

  if (currentRole === 'student') list = list.filter(function(h){ return h.studentId === ROLES.student.studentId; });
  if (currentRole === 'teacher') list = list.filter(function(h){ return ROLES.teacher.sections.indexOf(h.section) !== -1; });

  list = list.filter(function(h){
    var roomName = ROOMS[h.room] || h.room || '';
    var searchStr = (h.pc + ' ' + h.studentName + ' ' + h.studentId + ' ' + h.section + ' ' + h.teacher + ' ' + roomName + ' ' + (h.scheduleId||'')).toLowerCase();
    return !q || searchStr.indexOf(q) !== -1;
  });

  body.innerHTML = list.map(function(h){
    var roomShort = ROOMS[h.room] ? ROOMS[h.room].split('—')[0].trim() : (h.room || '—');
    var scheduleDisplay = (h.scheduleId && h.scheduleId !== '—')
      ? '<span class="mono"><strong>' + h.scheduleId + '</strong></span><span class="cell-sub">' + (h.scheduledDay ? h.scheduledDay + ' ' : '') + formatTimeRange(h.scheduledStartTime, h.scheduledEndTime) + '</span>'
      : '<span class="muted-cell">—</span>';
    var statusDisplay = h.checkOut
      ? '<span class="mono">' + fmtDateTime(h.checkOut) + '</span>'
      : '<span class="chip occupied">In progress</span>';
    var incidentDisplay = h.incidentId
      ? chip(incidentChipClass(h.incidentStatus), h.incidentId)
      : '<span class="muted-cell">None</span>';

    return '<tr>' +
      '<td class="mono"><strong>' + h.pc + '</strong></td>' +
      '<td><strong>' + roomShort + '</strong></td>' +
      '<td>' + h.studentName + '<span class="cell-sub">' + h.studentId + '</span></td>' +
      '<td>' + h.section + '</td>' +
      '<td>' + h.teacher + '</td>' +
      '<td>' + scheduleDisplay + '</td>' +
      '<td class="mono">' + fmtDateTime(h.checkIn) + '</td>' +
      '<td>' + statusDisplay + '</td>' +
      '<td>' + incidentDisplay + '</td>' +
    '</tr>';
  }).join('') || '<tr class="empty-row"><td colspan="9">No usage history matches your search.</td></tr>';
}
document.getElementById('usageSearch').addEventListener('input', renderUsageTable);

/* ---------- Checked-In Students Table ---------- */
var studentSort = { key:null, dir:1 };
function renderStudentsTable(){
  var body = document.getElementById('studentsBody');
  var q = (document.getElementById('studentSearch').value || '').toLowerCase();
  var list = stations.filter(function(s){ return s.session; }).map(function(s){
    return {
      id: s.session.studentId,
      name: s.session.studentName,
      section: s.session.section,
      teacher: s.session.teacher,
      room: s.room,
      station: s.id,
      scheduleId: s.session.scheduleId,
      checkIn: s.session.checkIn
    };
  });

  if (currentRole === 'teacher') list = list.filter(function(s){ return ROLES.teacher.sections.indexOf(s.section) !== -1; });

  list = list.filter(function(s){
    var roomName = ROOMS[s.room] || s.room;
    var searchStr = (s.id + ' ' + s.name + ' ' + s.section + ' ' + s.teacher + ' ' + roomName).toLowerCase();
    return !q || searchStr.indexOf(q) !== -1;
  });

  if (studentSort.key) list.sort(function(a,b){ var av=a[studentSort.key], bv=b[studentSort.key]; return (av>bv?1:av<bv?-1:0)*studentSort.dir; });

  body.innerHTML = list.map(function(s){
    var action = currentRole === 'admin' ? '<button class="btn btn-ghost btn-sm force-checkout" data-station="' + s.station + '">Check-out</button>' : '';
    var roomShort = ROOMS[s.room] ? ROOMS[s.room].split('—')[0].trim() : s.room;
    return '<tr>' +
      '<td class="mono">' + s.id + '</td>' +
      '<td><strong>' + s.name + '</strong></td>' +
      '<td>' + s.section + '</td>' +
      '<td>' + s.teacher + '</td>' +
      '<td class="mono">' + s.station + '<span class="cell-sub">' + roomShort + '</span></td>' +
      '<td class="mono">' + fmtTime(s.checkIn) + '</td>' +
      '<td class="row-actions">' + action + '</td>' +
    '</tr>';
  }).join('') || '<tr class="empty-row"><td colspan="7">No students currently checked in.</td></tr>';

  body.querySelectorAll('.force-checkout').forEach(function(btn){
    btn.addEventListener('click', function(){ adminForceCheckout(btn.getAttribute('data-station')); renderAll(); });
  });
}

document.querySelectorAll('#studentsTable th.sortable').forEach(function(th){
  th.addEventListener('click', function(){
    var key = th.getAttribute('data-key');
    if (studentSort.key === key) studentSort.dir *= -1; else { studentSort.key = key; studentSort.dir = 1; }
    document.querySelectorAll('#studentsTable th.sortable').forEach(function(h){ h.classList.remove('sorted'); });
    th.classList.add('sorted');
    renderStudentsTable();
  });
});
document.getElementById('studentSearch').addEventListener('input', renderStudentsTable);

/* ---------- Schedules List & Weekly Timetable Matrix ---------- */
function renderScheduleList(){
  var body = document.getElementById('scheduleListBody');
  if (!body) return;

  var scheduleListPanel = document.querySelector('#view-schedule .panel.table-panel');
  var q = (document.getElementById('scheduleSearchInput').value || '').toLowerCase();
  var roomFilter = document.getElementById('scheduleRoomFilter').value;
  var dayFilter = document.getElementById('scheduleDayFilter').value;
  var now = new Date();

  if (currentRole === 'student') {
    if (scheduleListPanel) scheduleListPanel.style.display = 'none';
    return;
  }

  if (scheduleListPanel) scheduleListPanel.style.display = 'block';

  var list = schedules.slice().filter(function(s){
    if (currentRole === 'teacher') {
      if (s.teacher !== ROLES.teacher.name) return false;
    }
    var roomName = ROOMS[s.room] || s.room;
    var searchStr = (s.id + ' ' + s.section + ' ' + s.teacher + ' ' + roomName + ' ' + s.day + ' ' + (s.subject||'')).toLowerCase();
    var matchQ = !q || searchStr.indexOf(q) !== -1;
    var matchR = roomFilter === 'all' || s.room === roomFilter;
    var matchD = dayFilter === 'all' || s.day === dayFilter;
    return matchQ && matchR && matchD;
  });

  body.innerHTML = list.map(function(s){
    var active = isScheduleActive(s, now);
    var statusBadge = active
      ? '<span class="chip active-schedule">ACTIVE NOW</span>'
      : '<span class="chip upcoming-schedule">Scheduled</span>';
    var actions = '<span class="muted-cell">Read-only</span>';

    return '<tr>' +
      '<td class="mono"><strong>' + s.id + '</strong>' + (s.subject ? '<span class="cell-sub">' + s.subject + '</span>' : '') + '</td>' +
      '<td><strong>' + s.section + '</strong></td>' +
      '<td>' + s.teacher + '</td>' +
      '<td>' + ROOMS[s.room] + '</td>' +
      '<td>' + s.day + '</td>' +
      '<td class="mono">' + formatTimeRange(s.startTime, s.endTime) + '</td>' +
      '<td>' + statusBadge + '</td>' +
      '<td style="text-align:right;">' + actions + '</td>' +
    '</tr>';
  }).join('') || '<tr class="empty-row"><td colspan="8">No laboratory schedules match your search.</td></tr>';
}

document.getElementById('scheduleSearchInput').addEventListener('input', renderScheduleList);
document.getElementById('scheduleRoomFilter').addEventListener('change', renderScheduleList);
document.getElementById('scheduleDayFilter').addEventListener('change', renderScheduleList);

function renderScheduleTimetableGrid(){
  var grid = document.getElementById('scheduleGrid');
  if (!grid) return;

  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var slots = [
    { label:'07:00–09:00', start:420, end:540 },
    { label:'09:00–11:00', start:540, end:660 },
    { label:'11:00–13:00', start:660, end:780 },
    { label:'13:00–15:00', start:780, end:900 },
    { label:'15:00–17:00', start:900, end:1020 },
    { label:'17:00–19:00', start:1020, end:1140 },
    { label:'19:00–22:00', start:1140, end:1320 }
  ];

  var selectedRoom = document.getElementById('calendarRoomSelect').value;
  var sourceSchedules = schedules.slice();

  if (currentRole === 'teacher') {
    sourceSchedules = getTeacherSchedulesForCurrentTeacher();
  } else if (currentRole === 'student') {
    sourceSchedules = getStudentClassSchedules(ROLES.student.section);
  }

  var html = '<div class="schedule-cell head">Time</div>';
  days.forEach(function(d){ html += '<div class="schedule-cell head">' + d.slice(0,3) + '</div>'; });

  slots.forEach(function(slot){
    html += '<div class="schedule-cell time">' + slot.label + '</div>';
    days.forEach(function(d){
      var matching = sourceSchedules.filter(function(s){
        if (currentRole === 'admin' || currentRole === 'teacher') {
          if (s.room !== selectedRoom || s.day !== d) return false;
        } else {
          if (s.day !== d) return false;
        }
        var sStart = timeToMinutes(s.startTime);
        var sEnd = timeToMinutes(s.endTime);
        return slot.start < sEnd && slot.end > sStart;
      });

      var cellContent = matching.map(function(m){
        var classLabel = currentRole === 'student' ? '<strong>' + (m.section || ROLES.student.section) + '</strong><br>' : '<strong>' + m.section + '</strong><br>';
        var subjectText = m.subject ? '<span style="font-size:9.5px;opacity:.85;">' + m.subject + '</span><br>' : '';
        var roomText = currentRole === 'student' ? '<small>' + ROOMS[m.room].split('—')[0].trim() + '</small><br>' : '<small>' + ROOMS[m.room].split('—')[0].trim() + '</small><br>';
        return '<div class="class-block">' +
          classLabel +
          subjectText +
          '<small>' + m.teacher + '</small><br>' +
          roomText +
          '<span style="font-size:9.5px;opacity:.85;">' + formatTimeRange(m.startTime, m.endTime) + '</span>' +
        '</div>';
      }).join('');

      html += '<div class="schedule-cell">' + (cellContent || '') + '</div>';
    });
  });

  grid.style.gridTemplateColumns = '80px repeat(7, minmax(95px, 1fr))';
  grid.innerHTML = html;
}
document.getElementById('calendarRoomSelect').addEventListener('change', renderScheduleTimetableGrid);

/* ---------- Clock Pulse & System Time Display ---------- */
function updateSystemTimeDisplay(){
  var now = new Date();
  var dayName = DAYS_OF_WEEK[now.getDay()];
  var el = document.getElementById('currentSystemTimeDisplay');
  if (el) {
    el.textContent = dayName + ', ' + fmtTime(now);
  }
}
setInterval(updateSystemTimeDisplay, 1000);
updateSystemTimeDisplay();

/* ---------- Notifications ---------- */
function renderNotifications(){
  var list = document.getElementById('notifList');
  if (!list) return;
  var recentInc = incidents.slice().sort(function(a,b){ return b.date-a.date; })[0];
  var items = [
    { icon: ICON.ticket, text: recentInc ? recentInc.id + ' reported for ' + recentInc.pcNumber + ' in ' + (ROOMS[recentInc.room] ? ROOMS[recentInc.room].split('—')[0].trim() : 'Lab') : 'No active incidents', time: recentInc ? fmtTime(recentInc.date) : '\u2014' },
    { icon: ICON.calendar, text: 'Laboratory class schedules synchronized', time: 'Just now' },
    { icon: ICON.check, text: 'Workstation status monitoring active', time: '12m ago' }
  ];
  list.innerHTML = items.map(function(it){
    return '<div class="dropdown-item" style="cursor:default;"><div class="modal-icon" style="width:28px;height:28px;border-radius:8px;">' + it.icon + '</div><div class="dropdown-item-text"><span style="font-size:12px;">' + it.text + '</span><small>' + it.time + '</small></div></div>';
  }).join('');
}

/* ---------- Teacher Sidebar: CURRENT SCHEDULE (automatic, not manual) ---------- */
function renderSidebarTeacherSchedule(){
  var container = document.getElementById('sidebarTeacherScheduleContent');
  if (!container) return;

  var myTeacherName = ROLES.teacher.name;
  var now = new Date();

  // Find all schedules assigned to this teacher
  var mySchedules = schedules.filter(function(s){ return s.teacher === myTeacherName; });

  // Identify the one that is currently active (day + time match)
  var activeNow = mySchedules.find(function(s){ return isScheduleActive(s, now); }) || null;

  if (activeNow) {
    var roomShort = ROOMS[activeNow.room] ? ROOMS[activeNow.room] : activeNow.room;
    container.innerHTML =
      '<div class="sidebar-schedule-block active">' +
        '<div class="sidebar-schedule-badge">ACTIVE NOW</div>' +
        '<div class="sidebar-schedule-subject">' + (activeNow.subject || activeNow.id) + '</div>' +
        '<div class="sidebar-schedule-row">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>' +
          '<span>' + activeNow.section + '</span>' +
        '</div>' +
        '<div class="sidebar-schedule-row">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>' +
          '<span>' + roomShort + '</span>' +
        '</div>' +
        '<div class="sidebar-schedule-row">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg>' +
          '<span>' + activeNow.day + ' &bull; ' + formatTimeRange(activeNow.startTime, activeNow.endTime) + '</span>' +
        '</div>' +
        '<div class="sidebar-schedule-id">' + activeNow.id + '</div>' +
      '</div>';
  } else {
    // Look for an upcoming schedule to hint at
    var upcoming = null;
    var now2 = new Date();
    var currentDayIdx = now2.getDay();
    var currentMin = now2.getHours() * 60 + now2.getMinutes();
    var sorted = mySchedules.slice().sort(function(a, b){
      var dayA = DAYS_OF_WEEK.indexOf(a.day);
      var dayB = DAYS_OF_WEEK.indexOf(b.day);
      var offsetA = (dayA - currentDayIdx + 7) % 7;
      var offsetB = (dayB - currentDayIdx + 7) % 7;
      if (offsetA === 0 && timeToMinutes(a.startTime) <= currentMin) offsetA = 7;
      if (offsetB === 0 && timeToMinutes(b.startTime) <= currentMin) offsetB = 7;
      return offsetA !== offsetB ? offsetA - offsetB : timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
    upcoming = sorted[0] || null;

    var upcomingHtml = '';
    if (upcoming) {
      upcomingHtml =
        '<div class="sidebar-schedule-upcoming">' +
          '<span class="sidebar-schedule-upcoming-label">Next: </span>' +
          upcoming.day + ' &bull; ' + formatTimeRange(upcoming.startTime, upcoming.endTime) +
          '<br><span style="font-size:10.5px;opacity:.9;">' + upcoming.section + ' &bull; ' + (ROOMS[upcoming.room] ? ROOMS[upcoming.room].split('—')[0].trim() : upcoming.room) + '</span>' +
        '</div>';
    }

    container.innerHTML =
      '<div class="sidebar-schedule-block inactive">' +
        '<span class="sidebar-schedule-none">No active laboratory schedule</span>' +
        upcomingHtml +
      '</div>';
  }
}

/* ---------- Master Render ---------- */
function renderAll(){
  renderStats();
  renderUtilChart();
  if (currentRole === 'admin') { renderRecentIncidents(); renderRecentUsage(); }
  if (currentRole === 'teacher') { renderTeacherOverview(); renderSidebarTeacherSchedule(); }
  if (currentRole === 'student') renderStudentOverview();
  renderStationsGrid();
  renderTicketsTable();
  renderUsageTable();
  renderStudentsTable();
  renderScheduleList();
  renderScheduleTimetableGrid();
  renderNotifications();
  renderRoleActions();
  var lup = document.getElementById('lastUpdated');
  if (lup) lup.textContent = 'Updated just now';
}

/* =========================================================================
   CHART INITIALIZATION
   ========================================================================= */
var utilChart;
function initUtilChart(){
  var canvas = document.getElementById('utilChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  utilChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Available','Occupied','Pending','Maintenance','Unavailable'],
      datasets: [{
        data: [0,0,0,0,0],
        backgroundColor: ['#0f8a4b','#2f6fed','#b4720a','#c62a3f','#8b97ab'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: { legend: { display: false } }
    }
  });
}

/* =========================================================================
   GLOBAL SEARCH & KEYBOARD SHORTCUTS
   ========================================================================= */
document.getElementById('globalSearch').addEventListener('keydown', function(e){
  if (e.key !== 'Enter') return;
  var q = this.value.trim();
  if (!q) return;
  if (/^INC-/i.test(q)) {
    switchView('tickets');
    document.getElementById('ticketSearch').value = q;
    renderTicketsTable();
  } else if (/^PC-/i.test(q)) {
    switchView('stations');
  } else if (/^SCH-/i.test(q)) {
    switchView('schedule');
    document.getElementById('scheduleSearchInput').value = q;
    renderScheduleList();
  } else if (currentRole !== 'student' && isViewAllowed('students', currentRole)) {
    switchView('students');
    document.getElementById('studentSearch').value = q;
    renderStudentsTable();
  } else {
    switchView('usage');
    document.getElementById('usageSearch').value = q;
    renderUsageTable();
  }
});

document.addEventListener('keydown', function(e){
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('globalSearch').focus();
  }
});

/* =========================================================================
   SIMULATED REAL-TIME UPDATES (Skips Demo PC-15)
   ========================================================================= */
function simulateTick(){
  var pool = stations.filter(function(s){ return !s.protectedDemo; });
  var roll = Math.random();
  if (roll < 0.25) {
    var avail = pool.filter(function(s){ return s.status === 'available'; });
    if (avail.length) {
      var s = pick(avail);
      s.session = newSession(pick(SECTIONS), s.room);
      s.session.checkIn = new Date();
      recomputeStationStatus(s);
    }
  } else if (roll < 0.45) {
    var occ = pool.filter(function(s){ return s.status === 'occupied' && (!s.session || s.session.studentId !== ROLES.student.studentId); });
    if (occ.length) checkOutStudent(pick(occ).id);
  } else if (roll < 0.55) {
    var occ2 = pool.filter(function(s){ return s.status === 'occupied'; });
    if (occ2.length) {
      var s2 = pick(occ2);
      reportIncident(s2.id, pick(['Mouse cursor skipping','Keyboard key stuck','Screen flickering intermittently','Network cable loose','Audio port not responding']));
    }
  }
  renderAll();
}
setInterval(simulateTick, 10000);

/* =========================================================================
   INITIALIZATION
   ========================================================================= */
initUtilChart();
applyRole('admin');

})();
