// 접근 제어 관련 변수
let isAuthenticated = false;

// 모바일 메뉴 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 메뉴 링크 클릭시 모바일 메뉴 닫기
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 세션에서 인증 상태 복원
    if (sessionStorage.getItem('vocalistAuth') === 'true') {
        isAuthenticated = true;
        const performanceTab = document.getElementById('performance-tab');
        const accessControl = document.querySelector('.access-control');
        
        if (performanceTab) {
            performanceTab.style.display = 'block';
        }
        if (accessControl) {
            accessControl.style.display = 'none';
        }
        
        // 환영 메시지 (필요시)
        const vocalistName = sessionStorage.getItem('vocalistName');
        console.log(`환영합니다, ${vocalistName}님!`);
    }

    // 폼 제출 이벤트 처리
    // 보컬 지원 폼 처리
    const vocalForm = document.querySelector('#vocal-application .vocal-form');
    if (vocalForm) {
        vocalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            data.type = 'vocal';
            
            // 로컬 스토리지에 저장
            const existingData = JSON.parse(localStorage.getItem('vocalApplications') || '[]');
            existingData.push(data);
            localStorage.setItem('vocalApplications', JSON.stringify(existingData));
            
            // 성공 메시지
            alert('🎤 보컬 지원이 완료되었습니다!\n\n빠른 시일 내에 연락드리겠습니다. 감사합니다!');
            
            // 폼 초기화
            this.reset();
        });
    }

    // 공연 참여 신청 폼 처리
    const performanceForm = document.querySelector('#performance-application .performance-form');
    if (performanceForm) {
        performanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 인증 상태 확인
            if (!isAuthenticated) {
                alert('공연 참여 신청은 보컬 오디션 합격자만 가능합니다.');
                return;
            }
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            data.type = 'performance';
            data.vocalistName = sessionStorage.getItem('vocalistName');
            
            // 로컬 스토리지에 저장
            const existingData = JSON.parse(localStorage.getItem('performanceApplications') || '[]');
            existingData.push(data);
            localStorage.setItem('performanceApplications', JSON.stringify(existingData));
            
            // 성공 메시지
            alert('🎭 공연 참여 신청이 완료되었습니다!\n\n노쇼방지 비용 입금 확인 후 최종 확정 안내드리겠습니다.');
            
            // 폼 초기화
            this.reset();
        });
    }

    // 파티 참여 폼 처리
    const partyForm = document.querySelector('#party-application .party-form');
    if (partyForm) {
        partyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            data.type = 'party';
            
            // 체크박스 처리 (좋아하는 음악 장르)
            const musicGenres = Array.from(this.querySelectorAll('input[name="music_genre"]:checked'))
                .map(checkbox => checkbox.value);
            data.music_genre = musicGenres;
            
            // 로컬 스토리지에 저장
            const existingData = JSON.parse(localStorage.getItem('partyApplications') || '[]');
            existingData.push(data);
            localStorage.setItem('partyApplications', JSON.stringify(existingData));
            
            // 성공 메시지
            alert('🎉 파티 참여 신청이 완료되었습니다!\n\n곧 연락드리겠습니다. 감사합니다!');
            
            // 폼 초기화
            this.reset();
        });
    }
});

// 스크롤 기능
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 탭 전환 기능
function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // 모든 폼 숨기기
    const applicationForms = document.querySelectorAll('.application-form');
    applicationForms.forEach(form => form.classList.remove('active'));
    
    // 선택된 탭 활성화
    const selectedTabButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
    
    // 선택된 폼 표시
    const selectedForm = document.getElementById(`${tabName}-application`);
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
}

// 접근 제어 관련 함수
function checkAccess(type) {
    if (!isAuthenticated) {
        alert('공연 참여 신청은 보컬 오디션 합격자만 이용할 수 있습니다.\n먼저 합격자 인증을 해주세요.');
        showAccessForm();
    } else {
        switchTab(type);
    }
}

// 접근 폼 표시
function showAccessForm() {
    const modal = document.getElementById('access-modal');
    if (modal) {
        modal.style.display = 'block';
        // 폼 초기화
        document.getElementById('access-form').reset();
    }
}

// 접근 모달 닫기
function closeAccessModal() {
    const modal = document.getElementById('access-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 접근 인증 처리
function verifyAccess(event) {
    event.preventDefault();
    
    const name = document.getElementById('access-name').value.trim();
    const phone = document.getElementById('access-phone').value.trim();
    const code = document.getElementById('access-code').value.trim();
    
    // 간단한 데모용 인증 (실제로는 서버 검증 필요)
    const validCodes = {
        'demo123': { name: '김보컬', phone: '010-1234-5678' },
        'test456': { name: '이가수', phone: '010-9876-5432' },
        'singer789': { name: '박아티스트', phone: '010-5555-6666' }
    };
    
    if (validCodes[code] && 
        validCodes[code].name === name && 
        validCodes[code].phone === phone) {
        
        // 인증 성공
        isAuthenticated = true;
        sessionStorage.setItem('vocalistAuth', 'true');
        sessionStorage.setItem('vocalistName', name);
        sessionStorage.setItem('vocalistPhone', phone);
        
        // UI 업데이트
        const performanceTab = document.getElementById('performance-tab');
        const accessControl = document.querySelector('.access-control');
        
        if (performanceTab) {
            performanceTab.style.display = 'block';
        }
        if (accessControl) {
            accessControl.style.display = 'none';
        }
        
        closeAccessModal();
        alert(`환영합니다, ${name}님!\n공연 참여 신청을 이용하실 수 있습니다.`);
        
        // 공연 참여 탭으로 전환
        switchTab('performance');
        
    } else {
        alert('인증 정보가 일치하지 않습니다.\n이름, 연락처, 인증 코드를 다시 확인해주세요.');
        document.getElementById('access-code').focus();
    }
}

// FAQ 토글 기능
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const arrow = element.querySelector('.faq-arrow');
    
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        answer.style.maxHeight = '0';
        arrow.style.transform = 'rotate(0deg)';
    }
}

// 소셜 링크 열기
function openSocial(platform) {
    switch(platform) {
        case 'instagram':
            window.open('https://instagram.com/singnsul612', '_blank');
            break;
        case 'kakaotalk':
            alert('카카오톡 채널: @playlogsoundlab\n또는 이메일로 문의해주세요: playlogsoundlab@gmail.com');
            break;
    }
}

// 파티 신청 모달 (관객 신청하기 버튼용)
function openPartyApplication() {
    // 파티 참여 탭으로 이동
    scrollToSection('apply');
    setTimeout(() => {
        switchTab('party');
    }, 500);
}

// 홈페이지로 이동 함수
function goToHome() {
    // 홈 섹션으로 스크롤
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 모달 외부 클릭시 닫기
window.addEventListener('click', function(event) {
    const accessModal = document.getElementById('access-modal');
    
    if (event.target === accessModal) {
        closeAccessModal();
    }
});
