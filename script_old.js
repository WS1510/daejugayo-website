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

    // 관리자 버튼 상태 업데이트
    updateAdminButton();

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
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                age: formData.get('age'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                genre: formData.get('genre'),
                experience: formData.get('experience'),
                song: formData.get('song'),
                video: formData.get('video'),
                message: formData.get('message'),
                status: 'pending'
            };
            
            // 유효성 검사
            if (!data.name || !data.age || !data.phone || !data.email || !data.genre || !data.song) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            // 관리자 페이지로 데이터 전송
            sendToAdmin('vocal', data);
            
            // 성공 메시지
            alert(`🎉 보컬 지원이 완료되었습니다!\n\n이름: ${data.name}\n선호 장르: ${data.genre}\n준비곡: ${data.song}\n\n심사 결과는 연락처로 개별 안내드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }

    // 공연 참여 신청 폼 처리
    const performanceForm = document.querySelector('#performance-application .performance-form');
    if (performanceForm) {
        performanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                performance_date: formData.get('performance_date'),
                song1: formData.get('song1'),
                song2: formData.get('song2'),
                concept: formData.get('concept'),
                special_request: formData.get('special_request'),
                payment_confirm: formData.get('payment_confirm') === 'on'
            };
            
            // 유효성 검사
            if (!data.name || !data.phone || !data.performance_date || !data.song1 || !data.song2) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            if (!data.payment_confirm) {
                alert('노쇼방지 비용 입금 확인 체크박스를 선택해주세요.');
                return;
            }
            
            // 관리자 페이지로 데이터 전송
            sendToAdmin('performance', data);
            
            // 성공 메시지
            alert(`🎭 공연 참여 신청이 완료되었습니다!\n\n공연일: ${data.performance_date}\n1번곡: ${data.song1}\n2번곡: ${data.song2}\n\n공연 세부사항은 개별 연락드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }

    // 파티 참여 폼 처리
    const partyForm = document.querySelector('#party-application .party-form');
    if (partyForm) {
        partyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // 체크박스 배열 처리
            const musicGenres = [];
            const genreCheckboxes = this.querySelectorAll('input[name="music_genre"]:checked');
            genreCheckboxes.forEach(checkbox => {
                musicGenres.push(checkbox.value);
            });
            
            const data = {
                name: formData.get('name'),
                age: formData.get('age'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                participants: formData.get('participants'),
                music_genre: musicGenres,
                expectations: formData.get('expectations'),
                instagram: formData.get('instagram')
            };
            
            // 유효성 검사
            if (!data.name || !data.age || !data.phone || !data.email || !data.participants) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            // 관리자 페이지로 데이터 전송
            sendToAdmin('party', data);
            
            // 성공 메시지
            alert(`🎉 파티 참여 신청이 완료되었습니다!\n\n이름: ${data.name}\n참여 인원: ${data.participants}\n좋아하는 장르: ${musicGenres.join(', ')}\n\n파티 일정과 장소를 문자로 안내드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }
});

// 스크롤 시 네비게이션 바 스타일 변경
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// 부드러운 스크롤 효과
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // 네비게이션 바 높이만큼 조정
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 알림 함수
function showAlert() {
    alert('🎵 PLAYLOG SOUNDLAB에 오신 것을 환영합니다!\n\n대주가요 음악소셜링파티로 새로운 음악 경험을 만나보세요!');
}

// 탭 전환 기능
function switchTab(tabName) {
    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 폼에서 active 클래스 제거
    document.querySelectorAll('.application-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // 클릭된 탭 버튼에 active 클래스 추가
    event.target.classList.add('active');
    
    // 해당 폼 표시
    document.getElementById(tabName + '-application').classList.add('active');
}

// 섹션으로 스크롤하는 함수
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 파티 신청 버튼 클릭 시
function openPartyApplication() {
    // 지원하기 섹션으로 이동
    scrollToSection('apply');
    
    // 파티 참여 탭으로 전환
    setTimeout(() => {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.application-form').forEach(form => {
            form.classList.remove('active');
        });
        
        document.querySelector('.tab-button:last-child').classList.add('active');
        document.getElementById('party-application').classList.add('active');
    }, 500);
}

// 기타 문의 폼 제출 처리 (만약 있다면)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 가져오기
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // 간단한 유효성 검사
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return;
        }
        
        // 성공 메시지
        alert(`메시지가 전송되었습니다! 📧\n\n이름: ${name}\n이메일: ${email}\n\n감사합니다!`);
        
        // 폼 초기화
        this.reset();
    });
}
// 관리자 페이지로 데이터 전송 함수
function sendToAdmin(type, data) {
    // 로컬 스토리지에 저장 (관리자 페이지에서 읽어감)
    const storageKey = type + 'Applications';
    let existingData = [];
    
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            existingData = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('기존 데이터 로드 실패:', e);
    }
    
    // 타임스탬프 추가
    data.timestamp = new Date().toLocaleString('ko-KR');
    data.id = Date.now(); // 고유 ID 추가
    
    existingData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    
    console.log(`새로운 ${type} 지원이 관리자 페이지로 전송되었습니다:`, data);
}
document.addEventListener('DOMContentLoaded', function() {
    // 보컬 지원 폼 처리
    const vocalForm = document.querySelector('#vocal-application .vocal-form');
    if (vocalForm) {
        vocalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                age: formData.get('age'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                genre: formData.get('genre',
                experience: formData.get('experience'),
                song: formData.get('song'),
                video: formData.get('video'),
                message: formData.get('message'),
                status: 'pending'
            };
            
            // 유효성 검사
            if (!data.name || !data.age || !data.phone || !data.email || !data.genre || !data.song) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            // 관리자 페이지로 데이터 전송
            sendToAdmin('vocal', data);
            
            // 성공 메시지
            alert(`🎉 보컬 지원이 완료되었습니다!\n\n이름: ${data.name}\n선호 장르: ${data.genre}\n준비곡: ${data.song}\n\n심사 결과는 연락처로 개별 안내드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }

    // 공연 참여 신청 폼 처리
    const performanceForm = document.querySelector('#performance-application .performance-form');
    if (performanceForm) {
        performanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                performance_date: formData.get('performance_date'),
                song1: formData.get('song1'),
                song2: formData.get('song2'),
                concept: formData.get('concept'),
                special_request: formData.get('special_request'),
                payment_confirm: formData.get('payment_confirm') === 'on'
            };
            
            // 유효성 검사
            if (!data.name || !data.phone || !data.performance_date || !data.song1 || !data.song2) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            if (!data.payment_confirm) {
                alert('노쇼방지 비용 입금 확인 체크박스를 선택해주세요.');
                return;
            }
            
            // 관리자 페이지로 데이터 전송
            sendToAdmin('performance', data);
            
            // 성공 메시지
            alert(`🎭 공연 참여 신청이 완료되었습니다!\n\n공연일: ${data.performance_date}\n1번곡: ${data.song1}\n2번곡: ${data.song2}\n\n공연 세부사항은 개별 연락드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }

    // 파티 참여 폼 처리
    const partyForm = document.querySelector('#party-application .party-form');
    if (partyForm) {
        partyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // 체크박스 배열 처리
            const musicGenres = [];
            const genreCheckboxes = this.querySelectorAll('input[name="music_genre"]:checked');
            genreCheckboxes.forEach(checkbox => {
                musicGenres.push(checkbox.value);
            });
            
            const data = {
                name: formData.get('name'),
                age: formData.get('age'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                participants: formData.get('participants'),
                music_genre: musicGenres,
                expectations: formData.get('expectations'),
                instagram: formData.get('instagram')
            };
            
            // 유효성 검사
            if (!data.name || !data.age || !data.phone || !data.email || !data.participants) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            // 관리자 페이지로 데이터 전송
            sendToAdmin('party', data);
            
            // 성공 메시지
            alert(`🎉 파티 참여 신청이 완료되었습니다!\n\n이름: ${data.name}\n참여 인원: ${data.participants}\n좋아하는 장르: ${musicGenres.join(', ')}\n\n파티 일정과 장소를 문자로 안내드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }
});

// 스크롤 애니메이션 효과
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimation() {
    const elements = document.querySelectorAll('.service-card, .about-content, .contact-content');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// 초기 스타일 설정
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .about-content, .contact-content');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // 초기 체크
    handleScrollAnimation();
});

// 스크롤 이벤트 리스너
window.addEventListener('scroll', handleScrollAnimation);

// 페이지 로드 완료 후 웰컴 메시지
window.addEventListener('load', function() {
    console.log('🌟 웹페이지가 성공적으로 로드되었습니다!');
    console.log('💡 개발자 도구에서 이 메시지를 확인하고 계시는군요!');
    console.log('🚀 더 많은 기능을 추가해보세요!');
});

// 다크모드 토글 (선택사항)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // 로컬 스토리지에 저장
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 페이지 로드시 다크모드 설정 복원
document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// 마우스 따라다니는 효과 (선택사항)
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        // 커스텀 커서 요소가 없으면 생성
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(70, 144, 226, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    if (cursorElement) {
        cursorElement.style.left = e.clientX - 10 + 'px';
        cursorElement.style.top = e.clientY - 10 + 'px';
    }
});

// FAQ 토글 기능
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // 모든 FAQ 아이템 닫기
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 클릭된 아이템이 닫혀있었다면 열기
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// 소셜미디어 링크 열기
function openSocial(platform) {
    let url = '';
    
    switch(platform) {
        case 'instagram':
            url = 'https://instagram.com/singnsul612';
            break;
        case 'kakaotalk':
            url = 'http://pf.kakao.com/_Khxmxbn/chat';
            break;
    }
    
    if (url) {
        window.open(url, '_blank');
    }
}

// 페이지 로드시 FAQ 초기화
document.addEventListener('DOMContentLoaded', function() {
    // FAQ 관련 이벤트는 이미 HTML에서 onclick으로 처리됨
    console.log('🎵 대주가요 FAQ가 준비되었습니다!');
});

// 합격자 인증 모달 표시
function showAccessForm() {
    const modal = document.getElementById('access-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 합격자 인증 모달 닫기
function closeAccessModal() {
    const modal = document.getElementById('access-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 공연 참여 신청 접근 체크
function checkAccess(tabName) {
    if (!isAuthenticated && tabName === 'performance') {
        showAccessForm();
        return false;
    }
    switchTab(tabName);
}

// 합격자 인증 처리
function verifyAccess(event) {
    event.preventDefault();
    
    const name = document.getElementById('access-name').value;
    const phone = document.getElementById('access-phone').value;
    const code = document.getElementById('access-code').value;
    
    // 간단한 인증 로직 (실제로는 서버에서 검증해야 함)
    // 데모용으로 특정 코드들을 설정
    const validCodes = ['VOCAL2025', 'SINGER123', 'DAEJUGAYO24', 'PERFORMER1'];
    
    if (validCodes.includes(code.toUpperCase())) {
        // 인증 성공
        isAuthenticated = true;
        
        // 공연 참여 신청 탭 표시
        const performanceTab = document.getElementById('performance-tab');
        const accessControl = document.querySelector('.access-control');
        
        if (performanceTab) {
            performanceTab.style.display = 'block';
        }
        if (accessControl) {
            accessControl.style.display = 'none';
        }
        
        // 모달 닫기
        closeAccessModal();
        
        // 성공 메시지
        alert(`🎉 ${name}님, 합격자 인증이 완료되었습니다!\n이제 공연 참여 신청을 할 수 있습니다.`);
        
        // 공연 참여 신청 탭으로 이동
        switchTab('performance');
        
        // 세션 저장 (브라우저 새로고침해도 유지)
        sessionStorage.setItem('vocalistAuth', 'true');
        sessionStorage.setItem('vocalistName', name);
        
    } else {
        // 인증 실패
        alert('❌ 인증에 실패했습니다.\n이름, 연락처, 인증 코드를 다시 확인해주세요.');
    }
}

// 관리자 로그인 모달 표시
function showAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.style.display = 'block';
        // 폼 초기화
        document.getElementById('admin-login-form').reset();
    }
}

// 관리자 로그인 모달 닫기
function closeAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 관리자 로그인 처리
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    
    // 로딩 상태 표시
    const submitBtn = document.querySelector('.admin-login-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🔄 로그인 중...';
    submitBtn.disabled = true;
    
    // 간단한 지연으로 실제 로그인 과정 시뮬레이션
    setTimeout(() => {
        // 데모용 관리자 계정 검증
        if (username === 'admin' && password === 'playlog2025') {
            // 로그인 성공
            alert('✅ 관리자 로그인 성공!\n관리자 페이지로 이동합니다.');
            
            // 세션 저장
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminLoginTime', new Date().toISOString());
            
            // 관리자 페이지로 리다이렉트
            window.location.href = 'admin.html';
            
        } else {
            // 로그인 실패
            alert('❌ 로그인 실패\n아이디 또는 비밀번호를 확인해주세요.');
            
            // 폼 초기화
            document.getElementById('admin-login-form').reset();
            document.getElementById('admin-username').focus();
        }
        
        // 버튼 상태 복원
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1000); // 1초 지연으로 로그인 과정 시뮬레이션
}

// 홈페이지로 이동 함수
function goToHome() {
    // 관리자 대시보드 숨기기
    const adminSection = document.getElementById('admin-dashboard');
    if (adminSection) {
        adminSection.style.display = 'none';
    }
    
    // 모든 일반 섹션 다시 보이기
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        if (section.id !== 'admin-dashboard') {
            section.style.display = 'block';
        }
    });
    
    // 홈 섹션으로 스크롤
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 새로운 관리자 로그인 처리 (홈페이지에 머물기)
function adminLoginNew(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    
    // 로딩 상태 표시
    const submitBtn = document.querySelector('.admin-login-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🔄 로그인 중...';
    submitBtn.disabled = true;
    
    // 간단한 지연으로 실제 로그인 과정 시뮬레이션
    setTimeout(() => {
        // 데모용 관리자 계정 검증
        if (username === 'admin' && password === 'playlog2025') {
            // 로그인 성공
            alert('✅ 관리자 로그인 성공!\n홈페이지에서 관리자 기능을 이용하실 수 있습니다.');
            
            // 세션 저장
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminLoginTime', new Date().toISOString());
            
            // 모달 닫기
            closeAdminLoginModal();
            
            // 관리자 버튼 업데이트
            updateAdminButton();
            
        } else {
            // 로그인 실패
            alert('❌ 로그인 실패\n아이디 또는 비밀번호를 확인해주세요.');
            
            // 폼 초기화
            document.getElementById('admin-login-form').reset();
            document.getElementById('admin-username').focus();
        }
        
        // 버튼 상태 복원
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1000); // 1초 지연으로 로그인 과정 시뮬레이션
}

// 모달 외부 클릭시 닫기 (관리자 로그인 모달 포함)
window.addEventListener('click', function(event) {
    const accessModal = document.getElementById('access-modal');
    const adminModal = document.getElementById('admin-login-modal');
    
    if (event.target === accessModal) {
        closeAccessModal();
    }
    
    if (event.target === adminModal) {
        closeAdminLoginModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAccessModal();
        closeAdminLoginModal();
    }
});

// 페이지 로드시 관리자 로그인 상태 확인
document.addEventListener('DOMContentLoaded', function() {
    // 기존 코드...
    
    // 관리자 로그인 상태 확인
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminLoginTime = sessionStorage.getItem('adminLoginTime');
    
    if (adminLoggedIn === 'true' && adminLoginTime) {
        // 로그인 시간 확인 (24시간 세션 유지)
        const loginTime = new Date(adminLoginTime);
        const now = new Date();
        const timeDiff = now - loginTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // 세션이 유효한 경우 관리자 버튼 스타일 변경
            const adminBtn = document.querySelector('.admin-login-btn');
            if (adminBtn) {
                adminBtn.textContent = '🔓 관리자 (로그인됨)';
                adminBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                adminBtn.onclick = function() {
                    if (confirm('관리자 페이지로 이동하시겠습니까?')) {
                        window.location.href = 'admin.html';
                    }
                };
            }
        } else {
            // 세션 만료
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminLoginTime');
        }
    }
});

// 관리자 버튼 업데이트 함수
function updateAdminButton() {
    const adminLoginItem = document.querySelector('.admin-login-item');
    const adminInfoItem = document.querySelector('.admin-info-item');
    
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminLoginTime = sessionStorage.getItem('adminLoginTime');
    
    if (adminLoggedIn === 'true' && adminLoginTime) {
        // 로그인 시간 확인 (24시간 세션 유지)
        const loginTime = new Date(adminLoginTime);
        const now = new Date();
        const timeDiff = now - loginTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // 로그인된 상태 - 네비게이션 바 업데이트
            if (adminLoginItem) adminLoginItem.style.display = 'none';
            if (adminInfoItem) adminInfoItem.style.display = 'block';
        } else {
            // 세션 만료
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminLoginTime');
            resetAdminButton();
        }
    } else {
        resetAdminButton();
    }
}

// 관리자 버튼 초기화
function resetAdminButton() {
    const adminLoginItem = document.querySelector('.admin-login-item');
    const adminInfoItem = document.querySelector('.admin-info-item');
    
    if (adminLoginItem) adminLoginItem.style.display = 'block';
    if (adminInfoItem) adminInfoItem.style.display = 'none';
}

// 관리자 로그아웃 함수
function adminLogout() {
    if (confirm('관리자 모드를 종료하시겠습니까?')) {
        // 세션 제거
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        
        // 네비게이션 업데이트
        const adminLoginItem = document.querySelector('.admin-login-item');
        const adminInfoItem = document.getElementById('admin-nav-info');
        
        if (adminLoginItem && adminInfoItem) {
            adminLoginItem.style.display = 'block';
            adminInfoItem.style.display = 'none';
        }
        
        // 홈페이지로 이동 (관리자 대시보드에서 로그아웃하는 경우)
        const adminSection = document.getElementById('admin-dashboard');
        if (adminSection && adminSection.style.display !== 'none') {
            goToHome();
        }
        
        alert('관리자 모드가 종료되었습니다.');
    }
}

// 관리자 대시보드 표시 함수
function showAdminDashboard() {
    // 관리자 로그인 상태 확인
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminLoginTime = sessionStorage.getItem('adminLoginTime');
    
    if (adminLoggedIn !== 'true' || !adminLoginTime) {
        alert('관리자 로그인이 필요합니다.');
        showAdminLoginModal();
        return;
    }
    
    // 로그인 시간 확인 (24시간 세션 유지)
    const loginTime = new Date(adminLoginTime);
    const now = new Date();
    const timeDiff = now - loginTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff >= 24) {
        alert('관리자 세션이 만료되었습니다. 다시 로그인해주세요.');
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        resetAdminButton();
        showAdminLoginModal();
        return;
    }
    
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        if (section.id !== 'admin-dashboard') {
            section.style.display = 'none';
        }
    });
    
    // 관리자 대시보드 표시
    const adminSection = document.getElementById('admin-dashboard');
    if (adminSection) {
        adminSection.style.display = 'block';
        loadAdminData();
    }
}

// 관리자 섹션 전환
function showAdminSection(sectionName) {
    // 모든 탭 버튼 비활성화
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // 모든 콘텐츠 숨기기
    const contents = document.querySelectorAll('.admin-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    const selectedTab = document.querySelector(`[onclick="showAdminSection('${sectionName}')"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 선택된 콘텐츠 표시
    const selectedContent = document.getElementById(`admin-${sectionName}`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

// 관리자 데이터 로드
function loadAdminData() {
    updateStatistics();
    loadApplicantsData();
}

// 통계 업데이트
function updateStatistics() {
    const vocalCount = Math.floor(Math.random() * 50) + 10;
    const performanceCount = Math.floor(Math.random() * 20) + 5;
    const partyCount = Math.floor(Math.random() * 100) + 30;
    const codeCount = Math.floor(Math.random() * 30) + 10;
    
    document.getElementById('vocal-count').textContent = vocalCount;
    document.getElementById('performance-count').textContent = performanceCount;
    document.getElementById('party-count').textContent = partyCount;
    document.getElementById('code-count').textContent = codeCount;
}

// 지원자 데이터 로드
function loadApplicantsData() {
    const vocalApplicants = [
        { name: '김민수', age: 25, phone: '010-1234-5678', genre: '팝', date: '2025-07-10', status: 'pending' },
        { name: '이지은', age: 23, phone: '010-9876-5432', genre: 'R&B', date: '2025-07-09', status: 'approved' }
    ];
    
    updateVocalApplicantsList(vocalApplicants);
    
    const verificationCodes = [
        { name: '박소연', phone: '010-1111-2222', code: 'DJ2025001', date: '2025-07-08', used: false }
    ];
    
    updateVerificationCodesList(verificationCodes);
}

// 보컬 지원자 목록 업데이트
function updateVocalApplicantsList(applicants) {
    const tbody = document.getElementById('vocal-applicants-list');
    if (!tbody) return;
    
    tbody.innerHTML = applicants.map(applicant => `
        <tr>
            <td>${applicant.name}</td>
            <td>${applicant.age}</td>
            <td>${applicant.phone}</td>
            <td>${applicant.genre}</td>
            <td>${applicant.date}</td>
            <td><span class="status-badge status-${applicant.status}">
                ${applicant.status === 'pending' ? '대기중' : '승인됨'}
            </span></td>
            <td>
                <div class="table-actions">
                    <button class="table-btn btn-view">보기</button>
                    <button class="table-btn btn-edit">수정</button>
                    <button class="table-btn btn-delete">삭제</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 인증 코드 목록 업데이트
function updateVerificationCodesList(codes) {
    const tbody = document.getElementById('verification-codes-list');
    if (!tbody) return;
    
    tbody.innerHTML = codes.map(code => `
        <tr>
            <td>${code.name}</td>
            <td>${code.phone}</td>
            <td><strong>${code.code}</strong></td>
            <td>${code.date}</td>
            <td><span class="status-badge ${code.used ? 'status-used' : 'status-approved'}">
                ${code.used ? '사용됨' : '미사용'}
            </span></td>
            <td>
                <div class="table-actions">
                    <button class="table-btn btn-delete">삭제</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 인증 코드 생성 모달
function showGenerateCodeModal() {
    const modal = document.getElementById('generate-code-modal');
    if (modal) modal.classList.add('active');
}

function closeGenerateCodeModal() {
    const modal = document.getElementById('generate-code-modal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('generate-code-form').reset();
    }
}

function generateNewCode(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const code = 'DJ2025' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    alert(`✅ 인증 코드 생성: ${code}`);
    closeGenerateCodeModal();
    loadAdminData();
}

function exportData(type) {
    alert(`📥 ${type} 데이터 내보내기 기능은 개발 중입니다.`);
}

// 모달 외부 클릭 시 닫기 (인증 코드 생성 모달 포함)
window.addEventListener('click', function(event) {
    const generateCodeModal = document.getElementById('generate-code-modal');
    
    if (event.target === generateCodeModal) {
        closeGenerateCodeModal();
    }
});
