// 향상된 관리자 페이지 JavaScript

// 현재 활성 섹션
let currentSection = 'dashboard';

// 지원자 데이터 (예시)
let applicantsData = [
    {
        id: 1,
        name: '김보컬',
        age: 25,
        phone: '010-1234-5678',
        genre: 'pop',
        song: '좋은 날 - 아이유',
        date: '2025-07-10',
        status: 'pending'
    },
    {
        id: 2,
        name: '이가수',
        age: 28,
        phone: '010-9876-5432',
        genre: 'rnb',
        song: 'Through the Night - 아이유',
        date: '2025-07-09',
        status: 'approved'
    },
    {
        id: 3,
        name: '박아티스트',
        age: 26,
        phone: '010-5555-6666',
        genre: 'indie',
        song: '사랑한다 안한다 - 윤하',
        date: '2025-07-08',
        status: 'pending'
    },
    {
        id: 4,
        name: '최뮤지션',
        age: 24,
        phone: '010-7777-8888',
        genre: 'ballad',
        song: '호텔 델루나 - 아이유',
        date: '2025-07-07',
        status: 'approved'
    },
    {
        id: 5,
        name: '정보컬',
        age: 29,
        phone: '010-9999-0000',
        genre: 'jazz',
        song: 'Fly Me To The Moon',
        date: '2025-07-06',
        status: 'approved'
    },
    {
        id: 6,
        name: '한싱어',
        age: 22,
        phone: '010-1111-2222',
        genre: 'pop',
        song: 'LOVE DIVE - IVE',
        date: '2025-07-05',
        status: 'rejected'
    }
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedAdmin();
});

// 향상된 관리자 시스템 초기화
function initializeEnhancedAdmin() {
    // 기본 기능 초기화
    animateStatNumbers();
    startClock();
    initializeInteractions();
    renderApplicantsTable();
    updateStatistics();
    
    // 초기 섹션 표시
    showSection('dashboard');
    
    console.log('🎭 Enhanced Admin System Initialized');
}

// 섹션 전환
function showSection(sectionId) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 네비게이션 활성화 상태 업데이트
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 선택된 섹션 표시
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    // 네비게이션 링크 활성화
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // 섹션별 추가 초기화
    switch(sectionId) {
        case 'dashboard':
            refreshDashboard();
            break;
        case 'applicants':
            renderApplicantsTable();
            break;
        case 'performances':
            // 공연 관리 초기화
            break;
        case 'settings':
            // 설정 초기화
            break;
    }
}

// 통계 숫자 애니메이션
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(element => {
        const targetValue = parseFloat(element.getAttribute('data-count'));
        let currentValue = 0;
        const increment = targetValue / 60;
        const isDecimal = targetValue % 1 !== 0;
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            if (isDecimal) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 30);
    });
}

// 실시간 시계
function startClock() {
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
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 인터랙션 초기화
function initializeInteractions() {
    // 통계 카드 호버 효과
    document.querySelectorAll('.stat-card').forEach(card => {
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
    
    // 액션 버튼 클릭 효과
    document.querySelectorAll('.action-btn, .btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// 리플 효과 생성
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 지원자 테이블 렌더링
function renderApplicantsTable() {
    const tbody = document.getElementById('applicants-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    applicantsData.forEach(applicant => {
        const row = createApplicantRow(applicant);
        tbody.appendChild(row);
    });
    
    updateApplicantCount();
}

// 지원자 행 생성
function createApplicantRow(applicant) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-status', applicant.status);
    tr.setAttribute('data-id', applicant.id);
    
    const genreClass = applicant.genre;
    const statusText = getStatusText(applicant.status);
    const actionButtons = getActionButtons(applicant.status);
    
    tr.innerHTML = `
        <td>
            <div class="applicant-info">
                <div class="applicant-avatar">${applicant.name.charAt(0)}</div>
                <div class="applicant-details">
                    <strong>${applicant.name}</strong>
                    <span class="applicant-age">${applicant.age}세</span>
                </div>
            </div>
        </td>
        <td>${applicant.phone}</td>
        <td><span class="genre-tag ${genreClass}">${getGenreText(applicant.genre)}</span></td>
        <td class="song-title">${applicant.song}</td>
        <td>${applicant.date}</td>
        <td><span class="status-badge ${applicant.status}">${statusText}</span></td>
        <td>
            <div class="action-buttons">
                ${actionButtons}
            </div>
        </td>
    `;
    
    return tr;
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'pending': '검토 대기',
        'approved': '승인 완료',
        'rejected': '거절됨'
    };
    return statusMap[status] || status;
}

// 장르 텍스트 변환
function getGenreText(genre) {
    const genreMap = {
        'pop': '팝',
        'rnb': 'R&B',
        'indie': '인디',
        'ballad': '발라드',
        'jazz': '재즈'
    };
    return genreMap[genre] || genre;
}

// 액션 버튼 생성
function getActionButtons(status) {
    if (status === 'pending') {
        return `
            <button class="btn-approve" onclick="approveApplicant(this)" title="승인">✓</button>
            <button class="btn-reject" onclick="rejectApplicant(this)" title="거절">✗</button>
            <button class="btn-detail" onclick="viewApplicantDetail(this)" title="상세보기">👁</button>
        `;
    } else {
        return `
            <button class="btn-edit" onclick="editApplicant(this)" title="수정">✏️</button>
            <button class="btn-delete" onclick="deleteApplicant(this)" title="삭제">🗑️</button>
            <button class="btn-detail" onclick="viewApplicantDetail(this)" title="상세보기">👁</button>
        `;
    }
}

// 지원자 승인
function approveApplicant(button) {
    const row = button.closest('tr');
    const applicantId = parseInt(row.getAttribute('data-id'));
    const applicant = applicantsData.find(a => a.id === applicantId);
    
    if (applicant) {
        applicant.status = 'approved';
        showToast(`${applicant.name}님의 지원을 승인했습니다.`, 'success');
        renderApplicantsTable();
        updateStatistics();
        addToRecentActivity('approved', applicant.name);
    }
}

// 지원자 거절
function rejectApplicant(button) {
    const row = button.closest('tr');
    const applicantId = parseInt(row.getAttribute('data-id'));
    const applicant = applicantsData.find(a => a.id === applicantId);
    
    if (applicant) {
        applicant.status = 'rejected';
        showToast(`${applicant.name}님의 지원을 거절했습니다.`, 'error');
        renderApplicantsTable();
        updateStatistics();
        addToRecentActivity('rejected', applicant.name);
    }
}

// 지원자 삭제
function deleteApplicant(button) {
    const row = button.closest('tr');
    const applicantId = parseInt(row.getAttribute('data-id'));
    const applicant = applicantsData.find(a => a.id === applicantId);
    
    if (applicant && confirm(`${applicant.name}님의 지원서를 삭제하시겠습니까?`)) {
        const index = applicantsData.findIndex(a => a.id === applicantId);
        applicantsData.splice(index, 1);
        showToast(`${applicant.name}님의 지원서를 삭제했습니다.`, 'warning');
        renderApplicantsTable();
        updateStatistics();
    }
}

// 지원자 상세보기
function viewApplicantDetail(button) {
    const row = button.closest('tr');
    const applicantId = parseInt(row.getAttribute('data-id'));
    const applicant = applicantsData.find(a => a.id === applicantId);
    
    if (applicant) {
        showApplicantModal(applicant);
    }
}

// 지원자 모달 표시
function showApplicantModal(applicant) {
    const modal = document.getElementById('applicant-detail-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
                <h4 style="color: #FFD700; margin-bottom: 0.5rem;">기본 정보</h4>
                <p><strong>이름:</strong> ${applicant.name}</p>
                <p><strong>나이:</strong> ${applicant.age}세</p>
                <p><strong>연락처:</strong> ${applicant.phone}</p>
            </div>
            <div>
                <h4 style="color: #FFD700; margin-bottom: 0.5rem;">지원 정보</h4>
                <p><strong>장르:</strong> ${getGenreText(applicant.genre)}</p>
                <p><strong>준비곡:</strong> ${applicant.song}</p>
                <p><strong>지원일:</strong> ${applicant.date}</p>
            </div>
        </div>
        <div style="margin-top: 2rem;">
            <h4 style="color: #FFD700; margin-bottom: 0.5rem;">상태</h4>
            <span class="status-badge ${applicant.status}">${getStatusText(applicant.status)}</span>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('applicant-detail-modal').style.display = 'none';
}

// 지원자 필터링
function filterApplicants(status) {
    const rows = document.querySelectorAll('#applicants-tbody tr');
    const tabs = document.querySelectorAll('.filter-tab');
    
    // 탭 활성화 상태 업데이트
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // 행 필터링
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateApplicantCount(status);
}

// 지원자 수 업데이트
function updateApplicantCount(filter = 'all') {
    const countElement = document.getElementById('applicant-count');
    if (!countElement) return;
    
    let count;
    if (filter === 'all') {
        count = applicantsData.length;
    } else {
        count = applicantsData.filter(a => a.status === filter).length;
    }
    
    countElement.textContent = count;
}

// 통계 업데이트
function updateStatistics() {
    const total = applicantsData.length;
    const approved = applicantsData.filter(a => a.status === 'approved').length;
    const pending = applicantsData.filter(a => a.status === 'pending').length;
    
    // 통계 카드 업데이트
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards[0]) statCards[0].textContent = total;
    if (statCards[1]) statCards[1].textContent = approved;
    if (statCards[2]) statCards[2].textContent = pending;
}

// 최근 활동에 추가
function addToRecentActivity(type, name) {
    // 실제 구현에서는 서버에 저장하거나 로컬 스토리지 사용
    console.log(`Recent activity: ${type} - ${name}`);
}

// 토스트 알림 표시
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // 애니메이션
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 자동 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// 빠른 작업 함수들
function generateAuthCode() {
    const code = 'VOCAL' + Date.now().toString().slice(-6);
    showToast(`인증 코드가 생성되었습니다: ${code}`, 'success');
}

function sendBulkNotifications() {
    showToast('모든 지원자에게 알림을 발송했습니다.', 'info');
}

function exportData() {
    showToast('데이터를 Excel 파일로 내보냅니다.', 'info');
}

function backupSystem() {
    showToast('시스템 백업이 완료되었습니다.', 'success');
}

function refreshDashboard() {
    animateStatNumbers();
    showToast('대시보드를 새로고침했습니다.', 'info');
}

function refreshApplicants() {
    renderApplicantsTable();
    showToast('지원자 목록을 새로고침했습니다.', 'info');
}

function exportApplicants() {
    showToast('지원자 데이터를 Excel로 내보냅니다.', 'info');
}

// 공연 관리 함수들
function addNewPerformance() {
    showToast('새 공연 추가 기능을 준비 중입니다.', 'info');
}

function managePerformers() {
    showToast('출연진 관리 화면으로 이동합니다.', 'info');
}

function editPerformance() {
    showToast('공연 정보 수정 화면으로 이동합니다.', 'info');
}

function assignPerformers() {
    showToast('출연진 배정 화면으로 이동합니다.', 'info');
}

// 설정 함수들
function manageAuthCodes() {
    showToast('인증 코드 관리 화면으로 이동합니다.', 'info');
}

function generateNewCode() {
    generateAuthCode();
}

function configureNotifications() {
    showToast('알림 설정 화면으로 이동합니다.', 'info');
}

function testEmail() {
    showToast('테스트 이메일을 발송했습니다.', 'success');
}

function createBackup() {
    showToast('백업을 생성하고 있습니다...', 'info');
    setTimeout(() => {
        showToast('백업이 성공적으로 생성되었습니다.', 'success');
    }, 2000);
}

function restoreBackup() {
    showToast('백업 복원 기능을 준비 중입니다.', 'info');
}

function viewSystemStats() {
    showToast('시스템 통계 화면으로 이동합니다.', 'info');
}

function exportStats() {
    showToast('통계 리포트를 내보냅니다.', 'info');
}

// 유틸리티 함수들
function goToMainSite() {
    window.location.href = 'index.html';
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.nav-toggle');
    
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // ESC로 모달 닫기
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // 숫자 키로 섹션 전환 (1-4)
    if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.altKey) {
        const sections = ['dashboard', 'applicants', 'performances', 'settings'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            showSection(sections[sectionIndex]);
        }
    }
});

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('applicant-detail-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
