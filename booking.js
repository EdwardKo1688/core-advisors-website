/**
 * Booking Page - Calendar & Reservation System
 */
(function () {
    'use strict';

    let currentYear, currentMonth;
    let selectedDate = null;
    let selectedSlot = null;

    // Default available time slots (weekdays 10-17, demo mode)
    const DEFAULT_SLOTS = [
        '10:00-11:00', '11:00-12:00',
        '13:00-14:00', '14:00-15:00',
        '15:00-16:00', '16:00-17:00'
    ];

    // Demo: some dates are already booked
    const DEMO_BOOKED = {
        // format: 'YYYY-MM-DD': ['slot1']
    };

    const calMonth = document.getElementById('calMonth');
    const calDays = document.getElementById('calDays');
    const calPrev = document.getElementById('calPrev');
    const calNext = document.getElementById('calNext');
    const timeSlots = document.getElementById('timeSlots');
    const timeHint = document.getElementById('timeHint');

    if (!calMonth) return;

    // Initialize with current month
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    function init() {
        renderCalendar();
        setupNavigation();
        setupForm();
    }

    function renderCalendar() {
        const year = currentYear;
        const month = currentMonth;
        const monthNames = ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'];
        calMonth.textContent = year + ' 年 ' + monthNames[month];

        // First day of month (Monday=0 ... Sunday=6)
        const firstDay = new Date(year, month, 1);
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6; // Sunday

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        let html = '';

        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            html += '<div class="cal-day empty"></div>';
        }

        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const dayOfWeek = dateObj.getDay(); // 0=Sun, 6=Sat
            const dateStr = formatDateStr(year, month, d);
            const isPast = (year < todayYear) || (year === todayYear && month < todayMonth) || (year === todayYear && month === todayMonth && d < todayDate);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isToday = (year === todayYear && month === todayMonth && d === todayDate);
            const isSelected = selectedDate === dateStr;

            let cls = 'cal-day';
            if (isPast || isWeekend) {
                cls += ' past';
            } else {
                cls += ' available';
            }
            if (isToday) cls += ' today';
            if (isSelected) cls += ' selected';

            html += `<div class="${cls}" data-date="${dateStr}">${d}</div>`;
        }

        calDays.innerHTML = html;

        // Bind day clicks
        calDays.querySelectorAll('.cal-day.available').forEach(el => {
            el.addEventListener('click', () => selectDate(el.dataset.date));
        });
    }

    function setupNavigation() {
        calPrev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar();
        });

        calNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar();
        });
    }

    function selectDate(dateStr) {
        selectedDate = dateStr;
        selectedSlot = null;
        renderCalendar();
        loadTimeSlots(dateStr);
    }

    async function loadTimeSlots(dateStr) {
        let availableSlots = DEFAULT_SLOTS;
        let bookedSlots = DEMO_BOOKED[dateStr] || [];

        // Try API if configured
        if (typeof GAS_API_URL !== 'undefined' && typeof API_ENABLED !== 'undefined' && API_ENABLED) {
            try {
                const url = GAS_API_URL + '?action=getAvailableSlots&date=' + dateStr;
                const res = await fetch(url);
                const result = await res.json();
                if (result.success && result.data) {
                    availableSlots = result.data.available || DEFAULT_SLOTS;
                    bookedSlots = result.data.booked || [];
                }
            } catch { /* Use defaults */ }
        }

        timeHint.style.display = 'none';
        const displayDate = formatDisplayDate(dateStr);

        timeSlots.innerHTML = `<p class="slots-date-label">${displayDate}</p>` +
            availableSlots.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                return `<button class="time-slot-btn${isBooked ? ' booked' : ''}"
                    data-slot="${slot}" ${isBooked ? 'disabled' : ''}>${slot}</button>`;
            }).join('');

        // Bind slot clicks
        timeSlots.querySelectorAll('.time-slot-btn:not(.booked)').forEach(btn => {
            btn.addEventListener('click', () => {
                timeSlots.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedSlot = btn.dataset.slot;
                showForm();
            });
        });
    }

    function showForm() {
        document.getElementById('stepTime').style.display = 'none';
        document.getElementById('stepForm').style.display = 'block';
        document.getElementById('selectedDatetime').textContent =
            formatDisplayDate(selectedDate) + '　' + selectedSlot;
    }

    function setupForm() {
        // Back button
        document.getElementById('btnBackToTime').addEventListener('click', () => {
            document.getElementById('stepForm').style.display = 'none';
            document.getElementById('stepTime').style.display = 'block';
        });

        // Submit
        document.getElementById('bookingForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('bkName').value,
                company: document.getElementById('bkCompany').value,
                email: document.getElementById('bkEmail').value,
                phone: document.getElementById('bkPhone').value,
                topic: document.getElementById('bkTopic').value,
                message: document.getElementById('bkMessage').value,
                date: selectedDate,
                timeSlot: selectedSlot,
                timestamp: new Date().toISOString()
            };

            const submitBtn = document.getElementById('btnBookSubmit');
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            // Try API
            if (typeof GAS_API_URL !== 'undefined' && typeof API_ENABLED !== 'undefined' && API_ENABLED) {
                try {
                    const res = await fetch(GAS_API_URL + '?action=submitBooking', {
                        method: 'POST',
                        body: JSON.stringify(formData)
                    });
                    await res.json();
                } catch { /* Continue to confirmation */ }
            }

            showConfirmation(formData);
        });
    }

    function showConfirmation(data) {
        document.getElementById('stepForm').style.display = 'none';
        document.getElementById('stepConfirm').style.display = 'block';

        document.getElementById('confirmDetails').innerHTML = `
            <div class="detail-row"><span class="detail-label">日期</span><span class="detail-value">${formatDisplayDate(data.date)}</span></div>
            <div class="detail-row"><span class="detail-label">時段</span><span class="detail-value">${data.timeSlot}</span></div>
            <div class="detail-row"><span class="detail-label">姓名</span><span class="detail-value">${data.name}</span></div>
            <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${data.email}</span></div>
            <div class="detail-row"><span class="detail-label">主題</span><span class="detail-value">${data.topic}</span></div>
            ${data.company ? `<div class="detail-row"><span class="detail-label">公司</span><span class="detail-value">${data.company}</span></div>` : ''}
        `;

        // Scroll to top of form area
        document.querySelector('.booking-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Helpers
    function formatDateStr(y, m, d) {
        return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    }

    function formatDisplayDate(dateStr) {
        const [y, m, d] = dateStr.split('-');
        const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return y + ' 年 ' + parseInt(m) + ' 月 ' + parseInt(d) + ' 日（' + dayNames[dateObj.getDay()] + '）';
    }

    init();
})();
