// 관리자 페이지 JavaScript

// 전역 변수
let isAdminLoggedIn = false;
let currentSection = 'dashboard';
let applicationsData = {
    vocals: [],
    performances: [],
    parties: []
};
let authCodes = [
    { code: 'VOCAL2025', name: '데모용 코드', phone: '', created: '2025-07-11', used: 0, active: true },
    { code: 'SINGER123', name: '데모용 코드', phone: '', created: '2025-07-11', used: 0, active: true },
    { code: 'DAEJUGAYO24', name: '데모용 코드', phone: '', created: '2025-07-11', used: 0, active: true },
    { code: 'PERFORMER1', name: '데모용 코드', phone: '', created: '2025-07-11', used: 0, active: true }
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    checkAdminLogin();
    animateStatNumbers(); // 통계 숫자 애니메이션 추가
    initializeAdvancedFeatures(); // 고급 인터랙티브 기능 초기화
    
    // 실시간 시계 업데이트
    setInterval(updateClock, 1000);
    updateClock();
});

// 페이지 로드 시 추가 기능 초기화
function initializeAdvancedFeatures() {
    addStatCardInteractions();
    initializeTableAnimations();
    initializeScheduleCardEffects();
    addButtonRippleEffects();
}

// 테이블 애니메이션 초기화
function initializeTableAnimations() {
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    
    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.1}s`;
        row.classList.add('fade-in-row');
    });
}

// 스케줄 카드 효과 초기화
function initializeScheduleCardEffects() {
    const scheduleCards = document.querySelectorAll('.schedule-card');
    
    scheduleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('slide-in-card');
        
        // 카드 클릭 시 펄스 효과
        card.addEventListener('click', function() {
            this.classList.add('pulse-effect');
            setTimeout(() => {
                this.classList.remove('pulse-effect');
            }, 600);
        });
    });
}

// 버튼 리플 효과 추가
function addButtonRippleEffects() {
    const buttons = document.querySelectorAll('.btn-sm, .btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 실시간 시계 표시
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('admin-clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// 로컬 스토리지에서 데이터 로드
function loadStoredData() {
    const storedVocals = localStorage.getItem('vocalApplications');
    const storedPerformances = localStorage.getItem('performanceApplications');
    const storedParties = localStorage.getItem('partyApplications');
    const storedCodes = localStorage.getItem('authCodes');
    
    if (storedVocals) {
        applicationsData.vocals = JSON.parse(storedVocals);
    }
    if (storedPerformances) {
        applicationsData.performances = JSON.parse(storedPerformances);
    }
    if (storedParties) {
        applicationsData.parties = JSON.parse(storedParties);
    }
    if (storedCodes) {
        authCodes = JSON.parse(storedCodes);
    }
}

// 관리자 로그인 상태 확인
function checkAdminLogin() {
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession === 'true') {
        isAdminLoggedIn = true;
        showDashboard();
    } else {
        showLoginModal();
    }
}

// 로그인 모달 표시
function showLoginModal() {
    document.getElementById('admin-login-modal').classList.add('active');
    document.getElementById('admin-dashboard').classList.add('hidden');
    
    // 네비게이션에서 관리자 정보 숨기기
    const navAdminInfo = document.getElementById('nav-admin-info');
    if (navAdminInfo) {
        navAdminInfo.style.display = 'none';
    }
}

// 대시보드 표시
function showDashboard() {
    document.getElementById('admin-login-modal').classList.remove('active');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    
    // 네비게이션에 관리자 정보 표시
    const navAdminInfo = document.getElementById('nav-admin-info');
    if (navAdminInfo) {
        navAdminInfo.style.display = 'flex';
    }
    
    updateDashboard();
}

// 관리자 로그인
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // 데모용 관리자 계정
    if (username === 'admin' && password === 'playlog2025') {
        isAdminLoggedIn = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        
        // 로그인 성공 메시지
        alert('✅ 관리자 로그인 성공!');
    } else {
        alert('❌ 잘못된 관리자 정보입니다.');
    }
}

// 관리자 로그아웃
function adminLogout() {
    if (confirm('정말 로그아웃하시겠습니까?')) {
        isAdminLoggedIn = false;
        sessionStorage.removeItem('adminLoggedIn');
        showLoginModal();
        
        // 폼 초기화
        document.getElementById('admin-login-form').reset();
    }
}

// 홈페이지로 이동 (로그인 상태 유지)
function goToHomepage() {
    if (confirm('홈페이지로 이동하시겠습니까?\n관리자 로그인 상태는 유지됩니다.')) {
        // 로그인 상태를 유지하면서 홈페이지로 이동
        window.location.href = 'index.html';
    }
}

// 섹션 전환
function showSection(sectionName) {
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // 모든 네비게이션 아이템 비활성화
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // 선택된 섹션 표시
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // 해당 네비게이션 아이템 활성화
    const activeNavItem = Array.from(navItems).find(item => 
        item.textContent.includes(getSectionTitle(sectionName))
    );
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    currentSection = sectionName;
    
    // 섹션별 데이터 업데이트
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'vocals':
            updateVocalsTable();
            break;
        case 'performances':
            updatePerformancesTable();
            break;
        case 'parties':
            updatePartiesTable();
            break;
        case 'codes':
            updateCodesSection();
            break;
    }
}

// 섹션 제목 매핑
function getSectionTitle(sectionName) {
    const titles = {
        'dashboard': '대시보드',
        'vocals': '보컬 지원자',
        'performances': '공연 참여자',
        'parties': '파티 참여자',
        'codes': '인증 코드'
    };
    return titles[sectionName] || '';
}

// 대시보드 업데이트
function updateDashboard() {
    document.getElementById('vocal-count').textContent = applicationsData.vocals.length;
    document.getElementById('performance-count').textContent = applicationsData.performances.length;
    document.getElementById('party-count').textContent = applicationsData.parties.length;
    document.getElementById('code-count').textContent = authCodes.length;
    
    updateRecentActivities();
}

// 최근 활동 업데이트
function updateRecentActivities() {
    const activitiesList = document.getElementById('recent-activities');
    const activities = [];
    
    // 최근 지원자들 추가
    applicationsData.vocals.forEach(vocal => {
        activities.push({
            time: vocal.timestamp || '2025-07-11 14:30',
            desc: `${vocal.name}님이 보컬에 지원했습니다`
        });
    });
    
    applicationsData.performances.forEach(perf => {
        activities.push({
            time: perf.timestamp || '2025-07-11 15:00',
            desc: `${perf.name}님이 공연 참여를 신청했습니다`
        });
    });
    
    applicationsData.parties.forEach(party => {
        activities.push({
            time: party.timestamp || '2025-07-11 15:30',
            desc: `${party.name}님이 파티 참여를 신청했습니다`
        });
    });
    
    // 시간순 정렬 (최신순)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // 최대 5개만 표시
    const recentActivities = activities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        activitiesList.innerHTML = `
            <div class="activity-item">
                <span class="activity-time">2025-07-11 14:30</span>
                <span class="activity-desc">관리자 페이지가 생성되었습니다</span>
            </div>
        `;
    } else {
        activitiesList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <span class="activity-time">${activity.time}</span>
                <span class="activity-desc">${activity.desc}</span>
            </div>
        `).join('');
    }
}

// 보컬 지원자 테이블 업데이트
function updateVocalsTable() {
    const tbody = document.getElementById('vocals-table');
    
    if (applicationsData.vocals.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="10">아직 지원자가 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = applicationsData.vocals.map((vocal, index) => `
        <tr>
            <td><input type="checkbox" class="vocal-select" data-index="${index}"></td>
            <td>${vocal.name}</td>
            <td>${vocal.age}</td>
            <td>${vocal.phone}</td>
            <td>${vocal.email}</td>
            <td>${vocal.genre}</td>
            <td>${vocal.song}</td>
            <td>${vocal.timestamp || '2025-07-11 14:30'}</td>
            <td><span class="status-badge ${vocal.status || 'pending'}">${getStatusText(vocal.status || 'pending')}</span></td>
            <td>
                <button class="action-btn small" onclick="viewVocalDetail(${index})">상세보기</button>
                <button class="action-btn small danger" onclick="deleteVocal(${index})">삭제</button>
            </td>
        </tr>
    `).join('');
}

// 공연 참여자 테이블 업데이트
function updatePerformancesTable() {
    const tbody = document.getElementById('performances-table');
    
    if (applicationsData.performances.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">아직 공연 참여 신청자가 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = applicationsData.performances.map((perf, index) => `
        <tr>
            <td>${perf.name}</td>
            <td>${perf.phone}</td>
            <td>${perf.performance_date}</td>
            <td>${perf.song1}</td>
            <td>${perf.song2}</td>
            <td>${perf.payment_confirm ? '✅ 완료' : '❌ 미완료'}</td>
            <td>${perf.timestamp || '2025-07-11 15:00'}</td>
            <td>
                <button class="action-btn small" onclick="viewPerformanceDetail(${index})">상세보기</button>
                <button class="action-btn small danger" onclick="deletePerformance(${index})">삭제</button>
            </td>
        </tr>
    `).join('');
}

// 파티 참여자 테이블 업데이트
function updatePartiesTable() {
    const tbody = document.getElementById('parties-table');
    
    if (applicationsData.parties.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">아직 파티 참여 신청자가 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = applicationsData.parties.map((party, index) => `
        <tr>
            <td>${party.name}</td>
            <td>${party.age}</td>
            <td>${party.phone}</td>
            <td>${party.email}</td>
            <td>${party.participants}</td>
            <td>${Array.isArray(party.music_genre) ? party.music_genre.join(', ') : party.music_genre || '-'}</td>
            <td>${party.timestamp || '2025-07-11 15:30'}</td>
            <td>
                <button class="action-btn small" onclick="viewPartyDetail(${index})">상세보기</button>
                <button class="action-btn small danger" onclick="deleteParty(${index})">삭제</button>
            </td>
        </tr>
    `).join('');
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'pending': '심사중',
        'approved': '합격',
        'rejected': '불합격'
    };
    return statusMap[status] || '심사중';
}

// 인증 코드 섹션 업데이트
function updateCodesSection() {
    // 현재 HTML에 이미 정적으로 표시되어 있으므로 동적 업데이트는 나중에 구현
}

// 새로고침
function refreshDashboard() {
    loadStoredData();
    updateDashboard();
    alert('✅ 데이터를 새로고침했습니다!');
}

// 엑셀 내보내기 (시뮬레이션)
function exportVocals() {
    if (applicationsData.vocals.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }
    
    const csvContent = convertToCSV(applicationsData.vocals, [
        'name', 'age', 'phone', 'email', 'genre', 'song', 'experience', 'message'
    ]);
    
    downloadCSV(csvContent, 'vocal_applications.csv');
}

function exportPerformances() {
    if (applicationsData.performances.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }
    
    const csvContent = convertToCSV(applicationsData.performances, [
        'name', 'phone', 'performance_date', 'song1', 'song2', 'concept', 'payment_confirm'
    ]);
    
    downloadCSV(csvContent, 'performance_applications.csv');
}

function exportParties() {
    if (applicationsData.parties.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }
    
    const csvContent = convertToCSV(applicationsData.parties, [
        'name', 'age', 'phone', 'email', 'participants', 'music_genre', 'expectations'
    ]);
    
    downloadCSV(csvContent, 'party_applications.csv');
}

// CSV 변환 함수
function convertToCSV(data, headers) {
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

// CSV 다운로드 함수
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    alert(`✅ ${filename} 파일이 다운로드되었습니다!`);
}

// 합격 처리 모달 표시
function showAddCodeModal() {
    const selectedCheckboxes = document.querySelectorAll('.vocal-select:checked');
    
    if (selectedCheckboxes.length === 0) {
        alert('합격 처리할 지원자를 선택해주세요.');
        return;
    }
    
    const selectedVocalsList = document.getElementById('selected-vocals-list');
    selectedVocalsList.innerHTML = '';
    
    selectedCheckboxes.forEach(checkbox => {
        const index = checkbox.dataset.index;
        const vocal = applicationsData.vocals[index];
        
        const vocalItem = document.createElement('div');
        vocalItem.className = 'selected-vocal-item';
        vocalItem.innerHTML = `
            <span class="selected-vocal-info">${vocal.name} (${vocal.phone})</span>
            <button class="remove-vocal-btn" onclick="removeSelectedVocal(${index})">제거</button>
        `;
        selectedVocalsList.appendChild(vocalItem);
    });
    
    document.getElementById('add-code-modal').style.display = 'flex';
}

function closeAddCodeModal() {
    document.getElementById('add-code-modal').style.display = 'none';
}

// 선택된 지원자 합격 처리
function processSelectedVocals() {
    const selectedCheckboxes = document.querySelectorAll('.vocal-select:checked');
    let processedCount = 0;
    
    selectedCheckboxes.forEach(checkbox => {
        const index = checkbox.dataset.index;
        const vocal = applicationsData.vocals[index];
        
        // 새 인증 코드 생성
        const newCode = generateRandomCode();
        
        // 인증 코드 추가
        authCodes.push({
            code: newCode,
            name: vocal.name,
            phone: vocal.phone,
            created: new Date().toISOString().split('T')[0],
            used: 0,
            active: true
        });
        
        // 지원자 상태 업데이트
        vocal.status = 'approved';
        vocal.authCode = newCode;
        
        processedCount++;
    });
    
    // 로컬 스토리지 업데이트
    localStorage.setItem('vocalApplications', JSON.stringify(applicationsData.vocals));
    localStorage.setItem('authCodes', JSON.stringify(authCodes));
    
    // 체크박스 초기화
    selectedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    closeAddCodeModal();
    updateVocalsTable();
    updateDashboard();
    
    alert(`✅ ${processedCount}명의 지원자가 합격 처리되었습니다!\n인증 코드가 자동으로 생성되었습니다.`);
}

// 코드 생성 모달
function showGenerateCodeModal() {
    document.getElementById('generate-code-modal').style.display = 'flex';
    regenerateCode(); // 자동으로 코드 생성
}

function closeGenerateCodeModal() {
    document.getElementById('generate-code-modal').style.display = 'none';
    document.getElementById('generate-code-form').reset();
}

// 랜덤 코드 생성
function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function regenerateCode() {
    document.getElementById('code-value').value = generateRandomCode();
}

// 새 코드 생성
function generateNewCode(event) {
    event.preventDefault();
    
    const name = document.getElementById('code-name').value;
    const phone = document.getElementById('code-phone').value;
    const code = document.getElementById('code-value').value;
    
    // 중복 코드 확인
    if (authCodes.find(item => item.code === code)) {
        alert('이미 존재하는 코드입니다. 새로 생성해주세요.');
        regenerateCode();
        return;
    }
    
    // 새 코드 추가
    authCodes.push({
        code: code,
        name: name,
        phone: phone,
        created: new Date().toISOString().split('T')[0],
        used: 0,
        active: true
    });
    
    // 로컬 스토리지 업데이트
    localStorage.setItem('authCodes', JSON.stringify(authCodes));
    
    closeGenerateCodeModal();
    updateCodesSection();
    updateDashboard();
    
    alert(`✅ 인증 코드 "${code}"가 생성되었습니다!`);
}

// 코드 비활성화
function deactivateCode(code) {
    if (confirm(`인증 코드 "${code}"를 비활성화하시겠습니까?`)) {
        const codeItem = authCodes.find(item => item.code === code);
        if (codeItem) {
            codeItem.active = false;
            localStorage.setItem('authCodes', JSON.stringify(authCodes));
            updateCodesSection();
            alert(`✅ 코드 "${code}"가 비활성화되었습니다.`);
        }
    }
}

// 코드 삭제
function deleteCode(code) {
    if (confirm(`인증 코드 "${code}"를 완전히 삭제하시겠습니까?`)) {
        const index = authCodes.findIndex(item => item.code === code);
        if (index !== -1) {
            authCodes.splice(index, 1);
            localStorage.setItem('authCodes', JSON.stringify(authCodes));
            updateCodesSection();
            alert(`✅ 코드 "${code}"가 삭제되었습니다.`);
        }
    }
}

// 상세보기 함수들 (나중에 구현)
function viewVocalDetail(index) {
    const vocal = applicationsData.vocals[index];
    alert(`보컬 상세 정보:\n이름: ${vocal.name}\n연락처: ${vocal.phone}\n이메일: ${vocal.email}\n경험: ${vocal.experience || '없음'}\n지원 동기: ${vocal.message || '없음'}`);
}

function viewPerformanceDetail(index) {
    const perf = applicationsData.performances[index];
    alert(`공연 상세 정보:\n이름: ${perf.name}\n공연일: ${perf.performance_date}\n컨셉: ${perf.concept || '없음'}\n특별 요청: ${perf.special_request || '없음'}`);
}

function viewPartyDetail(index) {
    const party = applicationsData.parties[index];
    alert(`파티 상세 정보:\n이름: ${party.name}\n인스타그램: ${party.instagram || '없음'}\n기대사항: ${party.expectations || '없음'}`);
}

// 삭제 함수들
function deleteVocal(index) {
    if (confirm('정말 이 지원자를 삭제하시겠습니까?')) {
        applicationsData.vocals.splice(index, 1);
        localStorage.setItem('vocalApplications', JSON.stringify(applicationsData.vocals));
        updateVocalsTable();
        updateDashboard();
    }
}

function deletePerformance(index) {
    if (confirm('정말 이 공연 신청을 삭제하시겠습니까?')) {
        applicationsData.performances.splice(index, 1);
        localStorage.setItem('performanceApplications', JSON.stringify(applicationsData.performances));
        updatePerformancesTable();
        updateDashboard();
    }
}

function deleteParty(index) {
    if (confirm('정말 이 파티 신청을 삭제하시겠습니까?')) {
        applicationsData.parties.splice(index, 1);
        localStorage.setItem('partyApplications', JSON.stringify(applicationsData.parties));
        updatePartiesTable();
        updateDashboard();
    }
}

// 공연 날짜 필터
function filterPerformances() {
    const selectedDate = document.getElementById('performance-date-filter').value;
    // 필터링 로직 구현 (현재는 기본 테이블 업데이트)
    updatePerformancesTable();
}

// 메인 페이지에서 데이터를 수신하는 함수
function receiveApplicationData(type, data) {
    if (!applicationsData[type]) {
        applicationsData[type] = [];
    }
    
    // 타임스탬프 추가
    data.timestamp = new Date().toLocaleString('ko-KR');
    
    applicationsData[type].push(data);
    localStorage.setItem(type + 'Applications', JSON.stringify(applicationsData[type]));
    
    console.log(`새로운 ${type} 지원이 접수되었습니다:`, data);
}

// 통계 숫자 카운트 애니메이션
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(element => {
        const targetValue = parseFloat(element.getAttribute('data-count'));
        let currentValue = 0;
        const increment = targetValue / 50; // 50프레임으로 나눠서 애니메이션
        const isDecimal = targetValue % 1 !== 0;
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            // 소수점이 있는 경우와 정수인 경우 처리
            if (isDecimal) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 40); // 40ms 간격으로 업데이트
    });
}

// 통계 카드 호버 효과
function addStatCardInteractions() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.color = '#FFD700';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1)';
                number.style.color = '#fff';
            }
        });
    });
}
