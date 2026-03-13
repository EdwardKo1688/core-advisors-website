// === AI Smart Assessment System (Enhanced) ===

(function () {
    'use strict';

    const TOTAL_QUESTIONS = 30;
    const SECTION_NAMES = [
        '基本資料',
        '企業戰略與決策',
        '營運流程成熟度',
        '數據與資料能力',
        '技術與系統基礎',
        'AI 策略與治理',
        '組織文化與人才'
    ];

    let currentSection = 0;
    const answers = {};

    // DOM Elements
    const sections = document.querySelectorAll('.assess-section');
    const navItems = document.querySelectorAll('.assess-nav-item');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const mobileProgressFill = document.getElementById('mobileProgressFill');
    const mobileProgressText = document.getElementById('mobileProgressText');

    if (!sections.length) return;

    // Initialize
    function init() {
        setupRatingButtons();
        setupOptionTracking();
        setupNavClicks();
        updateUI();
    }

    // Auto-advance: scroll to next question after answering
    function autoAdvanceToNext(currentQuestionEl) {
        const allQuestions = Array.from(
            currentQuestionEl.closest('.assess-questions')?.querySelectorAll('.assess-question') || []
        );
        const idx = allQuestions.indexOf(currentQuestionEl);
        if (idx >= 0 && idx < allQuestions.length - 1) {
            const nextQ = allQuestions[idx + 1];
            setTimeout(() => {
                nextQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nextQ.classList.add('highlight');
                setTimeout(() => nextQ.classList.remove('highlight'), 800);
            }, 300);
        } else if (idx === allQuestions.length - 1) {
            // Last question in section — pulse the Next button
            const btn = btnNext.style.display !== 'none' ? btnNext : btnSubmit;
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 1500);
        }
    }

    // Rating button clicks
    function setupRatingButtons() {
        document.querySelectorAll('.q-rating').forEach(ratingGroup => {
            ratingGroup.querySelectorAll('.q-rating-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const qNum = ratingGroup.dataset.q;
                    ratingGroup.querySelectorAll('.q-rating-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    answers['q' + qNum] = btn.dataset.value;
                    const qEl = document.querySelector(`.assess-question[data-q="${qNum}"]`);
                    markAnswered(qNum);
                    updateProgress();
                    if (qEl) autoAdvanceToNext(qEl);
                });
            });
        });
    }

    // Track radio/checkbox answers
    function setupOptionTracking() {
        document.querySelectorAll('.assess-question input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                const qEl = input.closest('.assess-question');
                const qNum = qEl.dataset.q;
                answers['q' + qNum] = input.value;
                markAnswered(qNum);
                updateProgress();
                // Auto-advance for single-select (radio)
                autoAdvanceToNext(qEl);
            });
        });

        document.querySelectorAll('.assess-question input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                const qEl = input.closest('.assess-question');
                const qNum = qEl.dataset.q;
                const checked = qEl.querySelectorAll('input[type="checkbox"]:checked');
                if (checked.length > 0) {
                    answers['q' + qNum] = Array.from(checked).map(c => c.value);
                    markAnswered(qNum);
                } else {
                    delete answers['q' + qNum];
                    qEl.classList.remove('answered');
                }
                updateProgress();
                // No auto-advance for multi-select (user may want to select more)
            });
        });
    }

    function markAnswered(qNum) {
        const qEl = document.querySelector(`.assess-question[data-q="${qNum}"]`);
        if (qEl) qEl.classList.add('answered');
    }

    // Sidebar nav clicks
    function setupNavClicks() {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = parseInt(item.dataset.section);
                goToSection(targetSection);
            });
        });
    }

    // Navigation
    function goToSection(index) {
        if (index < 0 || index >= sections.length) return;

        // Validate basic info before moving forward
        if (index > currentSection && currentSection === 0) {
            if (!validateBasicInfo()) return;
        }

        currentSection = index;
        updateUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateUI() {
        // Show/hide sections
        sections.forEach((s, i) => {
            s.classList.toggle('active', i === currentSection);
        });

        // Update sidebar nav
        navItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === currentSection) item.classList.add('active');
            if (i < currentSection) item.classList.add('completed');
        });

        // Buttons
        btnPrev.style.display = currentSection > 0 ? 'inline-flex' : 'none';
        btnNext.style.display = currentSection < sections.length - 1 ? 'inline-flex' : 'none';
        btnSubmit.style.display = currentSection === sections.length - 1 ? 'inline-flex' : 'none';

        // Progress
        updateProgress();

        // Mobile progress text
        if (mobileProgressText) {
            mobileProgressText.textContent = SECTION_NAMES[currentSection] || '';
        }
    }

    function updateProgress() {
        const answered = countAnsweredQuestions();
        const pct = Math.round((answered / TOTAL_QUESTIONS) * 100);

        if (progressFill) progressFill.style.width = pct + '%';
        if (progressText) progressText.textContent = answered + ' / ' + TOTAL_QUESTIONS + ' 題';
        if (mobileProgressFill) mobileProgressFill.style.width = pct + '%';
    }

    function countAnsweredQuestions() {
        let count = 0;
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            if (answers['q' + i]) count++;
        }
        return count;
    }

    // Validation
    function validateBasicInfo() {
        const required = [
            { id: 'companyName', label: '公司名稱' },
            { id: 'industry', label: '產業類別' },
            { id: 'companySize', label: '公司規模' },
            { id: 'userName', label: '姓名' },
            { id: 'userEmail', label: 'Email' }
        ];

        let valid = true;
        document.querySelectorAll('.assess-field.error').forEach(f => f.classList.remove('error'));
        document.querySelectorAll('.field-error-msg').forEach(m => m.remove());

        required.forEach(field => {
            const el = document.getElementById(field.id);
            if (!el || !el.value.trim()) {
                valid = false;
                const fieldEl = el.closest('.assess-field');
                if (fieldEl) {
                    fieldEl.classList.add('error');
                    const msg = document.createElement('span');
                    msg.className = 'field-error-msg';
                    msg.textContent = '請填寫' + field.label;
                    fieldEl.appendChild(msg);
                }
            }
        });

        if (!valid) {
            const firstError = document.querySelector('.assess-field.error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return valid;
    }

    // Button handlers
    if (btnPrev) {
        btnPrev.addEventListener('click', () => goToSection(currentSection - 1));
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => goToSection(currentSection + 1));
    }
    if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
            const formData = {
                companyName: document.getElementById('companyName')?.value || '',
                industry: document.getElementById('industry')?.value || '',
                companySize: document.getElementById('companySize')?.value || '',
                department: document.getElementById('department')?.value || '',
                userName: document.getElementById('userName')?.value || '',
                jobTitle: document.getElementById('jobTitle')?.value || '',
                userEmail: document.getElementById('userEmail')?.value || '',
                userPhone: document.getElementById('userPhone')?.value || '',
                answers: answers,
                answeredCount: countAnsweredQuestions(),
                totalQuestions: TOTAL_QUESTIONS,
                timestamp: new Date().toISOString()
            };

            // Save to sessionStorage first (always works)
            sessionStorage.setItem('assessmentData', JSON.stringify(formData));

            // POST to Google Apps Script if configured
            if (typeof GAS_API_URL !== 'undefined' && typeof API_ENABLED !== 'undefined' && API_ENABLED) {
                fetch(GAS_API_URL + '?action=submitAssessment', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                })
                .then(r => r.json())
                .then(result => {
                    if (result.success) {
                        formData.serverId = result.id;
                        formData.serverScore = result.totalScore;
                        sessionStorage.setItem('assessmentData', JSON.stringify(formData));
                    }
                })
                .catch(() => { /* API failed, continue with local data */ })
                .finally(() => {
                    window.location.href = 'result.html';
                });
            } else {
                window.location.href = 'result.html';
            }
        });
    }

    init();
})();
