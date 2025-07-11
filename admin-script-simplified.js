// 간소화된 관리자 페이지 JavaScript

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeSimplifiedAdmin();
});

// 간소화된 관리자 기능 초기화
function initializeSimplifiedAdmin() {
    animateStatNumbers();
    addStatCardInteractions();
    initializeTableAnimations();
    initializeActionCards();
    addButtonRippleEffects();
    
    // 실시간 시계 업데이트
    setInterval(updateClock, 1000);
    updateClock();
}

// 통계 숫자 카운트 애니메이션
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(element => {
        const targetValue = parseFloat(element.getAttribute('data-count'));
        let currentValue = 0;
        const increment = targetValue / 50;
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
        }, 40);
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

// 테이블 애니메이션 초기화
function initializeTableAnimations() {
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    
    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.1}s`;
        row.classList.add('fade-in-row');
    });
}

// 액션 카드 효과 초기화
function initializeActionCards() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach((card, index) => {
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

// 지원자 관리 기능
function approveApplicant(button) {
    const row = button.closest('tr');
    const name = row.querySelector('td:first-child strong').textContent;
    const statusCell = row.querySelector('.status');
    
    statusCell.className = 'status approved';
    statusCell.textContent = '승인';
    
    // 버튼 변경
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <button class="btn-sm btn-edit">수정</button>
        <button class="btn-sm btn-delete">삭제</button>
    `;
    
    showToast(`${name}님의 지원을 승인했습니다.`, 'success');
    updateStatistics();
}

function rejectApplicant(button) {
    const row = button.closest('tr');
    const name = row.querySelector('td:first-child strong').textContent;
    const statusCell = row.querySelector('.status');
    
    statusCell.className = 'status rejected';
    statusCell.textContent = '거절';
    
    // 버튼 변경
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <button class="btn-sm btn-edit">재검토</button>
        <button class="btn-sm btn-delete">삭제</button>
    `;
    
    showToast(`${name}님의 지원을 거절했습니다.`, 'error');
    updateStatistics();
}

function deleteApplicant(button) {
    const row = button.closest('tr');
    const name = row.querySelector('td:first-child strong').textContent;
    
    if (confirm(`${name}님의 지원서를 삭제하시겠습니까?`)) {
        row.remove();
        showToast(`${name}님의 지원서를 삭제했습니다.`, 'warning');
        updateStatistics();
    }
}

// 통계 업데이트
function updateStatistics() {
    const rows = document.querySelectorAll('.admin-table tbody tr');
    const approved = document.querySelectorAll('.status.approved').length;
    const pending = document.querySelectorAll('.status.pending').length;
    const total = rows.length;
    
    // 통계 카드 업데이트
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[0]) {
        const totalNumber = statCards[0].querySelector('.stat-number');
        totalNumber.textContent = total;
    }
    if (statCards[1]) {
        const approvedNumber = statCards[1].querySelector('.stat-number');
        approvedNumber.textContent = approved;
    }
    if (statCards[2]) {
        const pendingNumber = statCards[2].querySelector('.stat-number');
        pendingNumber.textContent = pending;
    }
}

// 토스트 알림 표시
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type} show`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 빠른 작업 기능들
function generateAuthCode() {
    const code = 'VOCAL' + Date.now().toString().slice(-6);
    showToast(`인증 코드가 생성되었습니다: ${code}`, 'success');
}

function viewApplicantStatus() {
    const total = document.querySelectorAll('.admin-table tbody tr').length;
    const approved = document.querySelectorAll('.status.approved').length;
    const pending = document.querySelectorAll('.status.pending').length;
    const rejected = document.querySelectorAll('.status.rejected').length;
    
    alert(`지원자 현황:
총 지원자: ${total}명
승인: ${approved}명
대기: ${pending}명
거절: ${rejected}명`);
}

function sendNotifications() {
    showToast('모든 지원자에게 알림을 발송했습니다.', 'success');
}

function backupData() {
    showToast('데이터 백업이 완료되었습니다.', 'success');
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.nav-toggle');
    
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

// 전역 함수로 등록
window.approveApplicant = approveApplicant;
window.rejectApplicant = rejectApplicant;
window.deleteApplicant = deleteApplicant;
window.generateAuthCode = generateAuthCode;
window.viewApplicantStatus = viewApplicantStatus;
window.sendNotifications = sendNotifications;
window.backupData = backupData;
window.toggleMobileMenu = toggleMobileMenu;
