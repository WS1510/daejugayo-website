// 모바일 메뉴 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

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

// 폼 제출 처리
document.querySelector('.contact-form').addEventListener('submit', function(e) {
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

// 보컬 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const vocalForm = document.querySelector('.vocal-form');
    if (vocalForm) {
        vocalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 간단한 유효성 검사
            if (!data.name || !data.age || !data.phone || !data.email || !data.genre || !data.song) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            // 성공 메시지
            alert(`🎤 보컬 지원이 완료되었습니다!\n\n이름: ${data.name}\n장르: ${data.genre}\n준비곡: ${data.song}\n\n빠른 시일 내에 연락드리겠습니다. 감사합니다!`);
            
            // 폼 초기화
            this.reset();
        });
    }
    
    // 파티 폼 제출 처리
    const partyForm = document.querySelector('.party-form');
    if (partyForm) {
        partyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 체크박스 데이터 처리
            const musicGenres = Array.from(document.querySelectorAll('input[name="music_genre"]:checked'))
                                    .map(cb => cb.value);
            
            // 간단한 유효성 검사
            if (!data.name || !data.age || !data.phone || !data.email || !data.participants) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
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
