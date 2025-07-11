// 접근 제어 관련 변수
let isAuthenticated = false;
let selectedFiles = [];
let fileUploadInitialized = false;

// 모바일 메뉴 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // ARIA 속성 업데이트
            const isExpanded = navMenu.classList.contains('active');
            mobileMenu.setAttribute('aria-expanded', isExpanded);
        });
        
        // 키보드 접근성 지원
        mobileMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // 메뉴 링크 클릭시 모바일 메뉴 닫기
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
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
        if (vocalistName) {
            announceToScreenReader(`환영합니다, ${vocalistName}님!`);
        }
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
            
            // 파일 데이터 처리
            const fileInput = document.getElementById('vocal-files');
            const files = fileInput ? fileInput.files : null;
            
            // 관리자 페이지 데이터 구조에 맞게 변환
            const applicantData = {
                name: data.name,
                age: parseInt(data.age),
                phone: data.phone,
                email: data.email,
                genre: data.genre,
                song: data.song,
                experience: data.experience || '정보 없음',
                motivation: data.message,
                video: data.video || ''
            };
            
            // 파일이 있는 경우 파일 처리와 함께 저장
            if (files && files.length > 0) {
                processFormWithFiles(applicantData, files);
            } else {
                // 파일이 없는 경우 바로 저장
                saveApplicationData(applicantData);
            }
        });
    }

    // 파일 업로드 기능 초기화
    initFileUpload();

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

    // 파일 업로드 기능
    const fileInput = document.getElementById('vocal-files');
    const fileList = document.getElementById('file-list');
    const fileUploadLabel = document.querySelector('.file-upload-label');
    
    if (fileInput && fileList && fileUploadLabel) {
        let selectedFiles = [];
        const maxFileSize = 100 * 1024 * 1024; // 100MB
        const allowedTypes = [
            'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', // 음성 파일
            'video/mp4', 'video/webm', 'video/ogg', // 영상 파일
            'image/jpeg', 'image/jpg', 'image/png', // 이미지 파일
            'application/pdf', // PDF
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOC, DOCX
        ];
        
        // 파일 선택 이벤트
        fileInput.addEventListener('change', handleFileSelect);
        
        // 드래그 앤 드롭 이벤트
        fileUploadLabel.addEventListener('dragover', handleDragOver);
        fileUploadLabel.addEventListener('dragleave', handleDragLeave);
        fileUploadLabel.addEventListener('drop', handleFileDrop);
        
        function handleFileSelect(event) {
            const files = Array.from(event.target.files);
            processFiles(files);
        }
        
        function handleDragOver(event) {
            event.preventDefault();
            fileUploadLabel.classList.add('drag-over');
        }
        
        function handleDragLeave(event) {
            event.preventDefault();
            fileUploadLabel.classList.remove('drag-over');
        }
        
        function handleFileDrop(event) {
            event.preventDefault();
            fileUploadLabel.classList.remove('drag-over');
            
            const files = Array.from(event.dataTransfer.files);
            processFiles(files);
        }
        
        function processFiles(files) {
            files.forEach(file => {
                if (validateFile(file)) {
                    addFileToList(file);
                }
            });
            updateFileInput();
        }
        
        function validateFile(file) {
            // 파일 크기 체크
            if (file.size > maxFileSize) {
                showFileError(`${file.name}: 파일 크기가 100MB를 초과합니다.`);
                return false;
            }
            
            // 파일 타입 체크
            if (!allowedTypes.includes(file.type)) {
                showFileError(`${file.name}: 지원하지 않는 파일 형식입니다.`);
                return false;
            }
            
            // 중복 파일 체크
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                showFileError(`${file.name}: 이미 선택된 파일입니다.`);
                return false;
            }
            
            return true;
        }
        
        function addFileToList(file) {
            selectedFiles.push(file);
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.fileName = file.name;
            
            const fileIcon = getFileIcon(file.type);
            const fileSize = formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">${fileIcon}</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${fileSize})</span>
                </div>
                <button type="button" class="file-remove" onclick="removeFile('${file.name}')">삭제</button>
            `;
            
            fileList.appendChild(fileItem);
        }
        
        function getFileIcon(fileType) {
            if (fileType.startsWith('audio/')) return '🎵';
            if (fileType.startsWith('video/')) return '🎬';
            if (fileType.startsWith('image/')) return '🖼️';
            if (fileType === 'application/pdf') return '📄';
            if (fileType.includes('document')) return '📝';
            return '📎';
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function updateFileInput() {
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            fileInput.files = dt.files;
        }
        
        function showFileError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'file-error';
            errorDiv.textContent = message;
            
            fileList.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
        
        // 전역 함수로 파일 삭제 기능 제공
        window.removeFile = function(fileName) {
            selectedFiles = selectedFiles.filter(file => file.name !== fileName);
            
            const fileItem = document.querySelector(`[data-file-name="${fileName}"]`);
            if (fileItem) {
                fileItem.remove();
            }
            
            updateFileInput();
        };
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

// 관리자 로그인 관련 함수들

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLoginStatus();
});

// 로그인 상태 확인
function checkAdminLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    const currentTime = new Date().getTime();
    
    // 로그인 유효시간 (24시간)
    const validTime = 24 * 60 * 60 * 1000;
    
    if (isLoggedIn && loginTime && (currentTime - parseInt(loginTime)) < validTime) {
        // 로그인 상태 유지
        showAdminLoggedInState();
    } else {
        // 로그인 만료 또는 미로그인
        clearAdminSession();
    }
}

// 로그인된 상태 UI 표시
function showAdminLoggedInState() {
    const adminButton = document.querySelector('.admin-login-btn');
    if (adminButton) {
        adminButton.textContent = '🔑 관리자 페이지';
        adminButton.classList.add('logged-in');
        adminButton.onclick = function() {
            window.location.href = 'admin-simple.html'; // 같은 탭에서 이동
        };
        
        // 기존 로그아웃 버튼이 있는지 확인
        const existingLogoutBtn = document.querySelector('.admin-logout-btn');
        if (!existingLogoutBtn) {
            // 로그아웃 버튼 추가
            const logoutBtn = document.createElement('a');
            logoutBtn.href = 'javascript:void(0)';
            logoutBtn.className = 'nav-link admin-logout-btn';
            logoutBtn.textContent = '🚪 로그아웃';
            logoutBtn.onclick = adminLogout;
            
            // 로그아웃 버튼을 관리자 버튼 옆에 추가
            const navItem = document.createElement('li');
            navItem.className = 'nav-item';
            navItem.appendChild(logoutBtn);
            
            const navMenu = document.querySelector('.nav-menu');
            navMenu.appendChild(navItem);
        }
    }
}

// 관리자 세션 정리
function clearAdminSession() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    
    // UI 초기화
    const adminButton = document.querySelector('.admin-login-btn');
    if (adminButton) {
        adminButton.textContent = '관리자';
        adminButton.classList.remove('logged-in');
        adminButton.onclick = showAdminLogin;
    }
    
    // 로그아웃 버튼 제거
    const logoutBtn = document.querySelector('.admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.parentElement.remove();
    }
}

// 관리자 로그아웃
function adminLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        clearAdminSession();
        alert('로그아웃되었습니다.');
        location.reload(); // 페이지 새로고침
    }
}

// 관리자 로그인 모달 표시
function showAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 관리자 로그인 모달 닫기
function closeAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 복원
    
    // 폼 초기화
    document.getElementById('admin-login-form').reset();
    document.getElementById('admin-error').style.display = 'none';
}

// 관리자 로그인 처리
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // 관리자 계정 확인 (실제 서비스에서는 서버에서 검증해야 함)
    if (username === 'admin' && password === 'daejugayo2024') {
        // 로그인 성공 - 세션 저장
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', new Date().getTime().toString());
        
        closeAdminLogin();
        
        // 성공 알림
        alert('관리자 로그인 성공! 관리자 페이지로 이동합니다.');
        
        // UI 업데이트
        showAdminLoggedInState();
        
        // 관리자 페이지로 이동
        window.location.href = 'admin-simple.html'; // 같은 탭에서 이동
        
    } else {
        // 로그인 실패
        document.getElementById('admin-error').style.display = 'block';
        
        // 입력 필드 shake 효과
        const form = document.getElementById('admin-login-form');
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modal = document.getElementById('admin-login-modal');
    if (event.target === modal) {
        closeAdminLogin();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAdminLogin();
    }
});

// shake 애니메이션 CSS 추가
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// 스타일 시트에 shake 애니메이션 추가
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// 모달 외부 클릭시 닫기
window.addEventListener('click', function(event) {
    const accessModal = document.getElementById('access-modal');
    
    if (event.target === accessModal) {
        closeAccessModal();
    }
});

// 폼 제출 시 파일 데이터 처리
function processFormWithFiles(formData, files) {
    const fileDataArray = [];
    
    if (files && files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                fileDataArray.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result // Base64 데이터
                });
                
                // 모든 파일 처리가 완료되면 데이터 저장
                if (fileDataArray.length === files.length) {
                    formData.attachedFiles = fileDataArray;
                    saveApplicationData(formData);
                }
            };
            reader.readAsDataURL(file);
        });
    } else {
        // 파일이 없는 경우 바로 저장
        saveApplicationData(formData);
    }
}

function saveApplicationData(data) {
    // 기존 localStorage 저장 로직에 파일 데이터 포함
    const existingApplicants = JSON.parse(localStorage.getItem('applicantsData') || '[]');
    const applicantData = {
        ...data,
        id: Date.now(),
        status: 'pending',
        date: new Date().toLocaleDateString('ko-KR'),
        submitTime: new Date().toLocaleString('ko-KR'),
        attachedFiles: data.attachedFiles || []
    };
    
    existingApplicants.push(applicantData);
    localStorage.setItem('applicantsData', JSON.stringify(existingApplicants));
    
    // 성공 메시지 표시
    alert('🎤 보컬 지원이 완료되었습니다!\n관리자가 검토 후 연락드리겠습니다.');
    
    // 폼 초기화
    document.querySelector('.vocal-form').reset();
    document.getElementById('file-list').innerHTML = '';
    selectedFiles = [];
}

// 파일 업로드 기능 초기화
function initFileUpload() {
    // 이미 초기화되었다면 중복 실행 방지
    if (fileUploadInitialized) return;
    
    const fileInput = document.getElementById('vocal-files');
    const fileList = document.getElementById('file-list');
    const fileUploadLabel = document.querySelector('.file-upload-label');
    
    if (!fileInput || !fileList || !fileUploadLabel) return;
    
    // 초기화 플래그 설정
    fileUploadInitialized = true;
    selectedFiles = [];
    
    const maxFileSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
        'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', // 음성 파일
        'video/mp4', 'video/webm', 'video/ogg', // 영상 파일
        'image/jpeg', 'image/jpg', 'image/png', // 이미지 파일
        'application/pdf', // PDF
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOC, DOCX
    ];
    
    // 기존 이벤트 리스너 제거 (중복 방지)
    fileInput.removeEventListener('change', handleFileSelect);
    fileUploadLabel.removeEventListener('dragover', handleDragOver);
    fileUploadLabel.removeEventListener('dragleave', handleDragLeave);
    fileUploadLabel.removeEventListener('drop', handleFileDrop);
    
    // 파일 선택 이벤트
    fileInput.addEventListener('change', handleFileSelect);
    
    // 드래그 앤 드롭 이벤트
    fileUploadLabel.addEventListener('dragover', handleDragOver);
    fileUploadLabel.addEventListener('dragleave', handleDragLeave);
    fileUploadLabel.addEventListener('drop', handleFileDrop);
    
    function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        processFiles(files);
    }
    
    function handleDragOver(event) {
        event.preventDefault();
        fileUploadLabel.classList.add('drag-over');
    }
    
    function handleDragLeave(event) {
        event.preventDefault();
        fileUploadLabel.classList.remove('drag-over');
    }
    
    function handleFileDrop(event) {
        event.preventDefault();
        fileUploadLabel.classList.remove('drag-over');
        
        const files = Array.from(event.dataTransfer.files);
        processFiles(files);
    }
    
    function processFiles(files) {
        files.forEach(file => {
            if (validateFile(file)) {
                addFileToList(file);
            }
        });
        updateFileInput();
    }
    
    function validateFile(file) {
        // 파일 크기 체크
        if (file.size > maxFileSize) {
            showFileError(file.name + ': 파일 크기가 100MB를 초과합니다.');
            return false;
        }
        
        // 파일 타입 체크
        if (!allowedTypes.includes(file.type)) {
            showFileError(file.name + ': 지원하지 않는 파일 형식입니다.');
            return false;
        }
        
        // 중복 파일 체크
        if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
            showFileError(file.name + ': 이미 선택된 파일입니다.');
            return false;
        }
        
        return true;
    }
    
    function addFileToList(file) {
        selectedFiles.push(file);
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = file.name;
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = '<div class="file-info">' +
            '<span class="file-icon">' + fileIcon + '</span>' +
            '<span class="file-name">' + file.name + '</span>' +
            '<span class="file-size">(' + fileSize + ')</span>' +
            '</div>' +
            '<button type="button" class="file-remove" onclick="removeFile(\'' + file.name + '\')">삭제</button>';
        
        fileList.appendChild(fileItem);
    }
    
    function updateFileInput() {
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
    }
    
    function showFileError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'file-error';
        errorDiv.textContent = message;
        
        fileList.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// 파일 아이콘 가져오기
function getFileIcon(fileType) {
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.startsWith('video/')) return '🎬';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('document')) return '📝';
    return '📎';
}

// 파일 크기 포맷
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 파일 삭제
function removeFile(fileName) {
    selectedFiles = selectedFiles.filter(file => file.name !== fileName);
    
    const fileItem = document.querySelector('[data-file-name="' + fileName + '"]');
    if (fileItem) {
        fileItem.remove();
    }
    
    const fileInput = document.getElementById('vocal-files');
    if (fileInput) {
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
    }
}

// 폼 검증 함수들
function validateField(input) {
    const formGroup = input.closest('.form-group');
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // 기본 required 검증
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '이 필드는 필수입니다.';
    }
    
    // 타입별 검증
    if (value && input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 이메일 형식을 입력해주세요.';
        }
    }
    
    if (value && input.type === 'tel') {
        const phoneRegex = /^[0-9-+\s()]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 전화번호 형식을 입력해주세요.';
        }
    }
    
    if (value && input.type === 'number') {
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');
        const numValue = parseInt(value);
        
        if (min && numValue < parseInt(min)) {
            isValid = false;
            errorMessage = `최소값은 ${min}입니다.`;
        } else if (max && numValue > parseInt(max)) {
            isValid = false;
            errorMessage = `최대값은 ${max}입니다.`;
        }
    }

    // 에러 표시/제거
    if (formGroup) {
        const existingError = formGroup.querySelector('.error-message');
        
        if (!isValid) {
            formGroup.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            
            if (!existingError) {
                const errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                errorElement.textContent = errorMessage;
                formGroup.appendChild(errorElement);
            } else {
                existingError.textContent = errorMessage;
            }
        } else {
            formGroup.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
            
            if (existingError) {
                existingError.remove();
            }
        }
    }

    return isValid;
}

function clearValidationErrors(e) {
    const input = e.target;
    const formGroup = input.closest('.form-group');
    
    if (formGroup && formGroup.classList.contains('error')) {
        formGroup.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// 접근성 개선을 위한 추가 함수들
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// 스크린 리더 전용 텍스트를 위한 CSS 클래스
const srOnlyStyle = document.createElement('style');
srOnlyStyle.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(srOnlyStyle);

// 전역 오류 처리
window.addEventListener('error', function(e) {
    // 사용자에게 친화적인 오류 메시지 표시
    const errorMessage = '일시적인 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.';
    
    // 사용자에게 알림
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader(errorMessage);
    }
    
    // 개발자 콘솔에 상세 오류 정보 기록
    console.error('전역 오류 발생:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
});

// Promise 오류 처리
window.addEventListener('unhandledrejection', function(e) {
    console.error('처리되지 않은 Promise 거부:', e.reason);
    
    // 사용자에게 알림
    const errorMessage = '요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.';
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader(errorMessage);
    }
});

// 네트워크 연결 상태 모니터링
window.addEventListener('online', function() {
    announceToScreenReader('인터넷 연결이 복구되었습니다.');
});

window.addEventListener('offline', function() {
    announceToScreenReader('인터넷 연결이 끊어졌습니다. 연결을 확인해주세요.');
});

// 지역 선택 처리 함수
function handleRegionChange() {
    const regionSelect = document.getElementById('vocal-region');
    const detailRegionSelect = document.getElementById('vocal-detail-region');
    
    if (regionSelect && detailRegionSelect) {
        const selectedRegion = regionSelect.value;
        
        // 세부 지역 초기화
        detailRegionSelect.innerHTML = '';
        detailRegionSelect.disabled = false;
        detailRegionSelect.required = true;
        
        // 지역별 세부 옵션 설정
        const regionOptions = {
            '서울': [
                '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
                '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구',
                '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구',
                '종로구', '중구', '중랑구'
            ],
            '경기': [
                '수원시', '성남시', '안양시', '안산시', '고양시', '과천시', '광명시', '광주시',
                '군포시', '김포시', '남양주시', '동두천시', '부천시', '시흥시', '안성시',
                '양주시', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시',
                '평택시', '포천시', '하남시', '화성시', '가평군', '양평군', '여주시', '연천군'
            ],
            '인천': [
                '중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구',
                '강화군', '옹진군'
            ],
            '부산': [
                '중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구',
                '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'
            ],
            '대구': [
                '중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'
            ],
            '광주': [
                '동구', '서구', '남구', '북구', '광산구'
            ],
            '대전': [
                '동구', '중구', '서구', '유성구', '대덕구'
            ],
            '울산': [
                '중구', '남구', '동구', '북구', '울주군'
            ],
            '세종': [
                '세종시'
            ],
            '강원': [
                '춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시',
                '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군',
                '양구군', '인제군', '고성군', '양양군'
            ],
            '충북': [
                '청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군',
                '진천군', '괴산군', '음성군', '단양군'
            ],
            '충남': [
                '천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시',
                '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'
            ],
            '전북': [
                '전주시', '군산시', '익산시', '정읍시', '남원시', '김제시',
                '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'
            ],
            '전남': [
                '목포시', '여수시', '순천시', '나주시', '광양시',
                '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군',
                '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'
            ],
            '경북': [
                '포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시',
                '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군',
                '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'
            ],
            '경남': [
                '창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시',
                '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'
            ],
            '제주': [
                '제주시', '서귀포시'
            ]
        };
        
        if (selectedRegion && regionOptions[selectedRegion]) {
            // 기본 옵션 추가
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '세부 지역을 선택하세요';
            detailRegionSelect.appendChild(defaultOption);
            
            // 해당 지역의 세부 옵션들 추가
            regionOptions[selectedRegion].forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                detailRegionSelect.appendChild(optionElement);
            });
        } else if (selectedRegion === '기타') {
            const defaultOption = document.createElement('option');
            defaultOption.value = '기타';
            defaultOption.textContent = '기타';
            detailRegionSelect.appendChild(defaultOption);
            detailRegionSelect.value = '기타';
        } else {
            // 시/도가 선택되지 않은 경우
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '시/도를 먼저 선택하세요';
            detailRegionSelect.appendChild(defaultOption);
            detailRegionSelect.disabled = true;
            detailRegionSelect.required = false;
        }
    }
}

// 장르 선택 처리 함수
function handleGenreChange() {
    const genreSelect = document.getElementById('vocal-genre');
    const customGenreGroup = document.getElementById('custom-genre-group');
    const customGenreInput = document.getElementById('vocal-custom-genre');
    
    if (genreSelect && customGenreGroup && customGenreInput) {
        if (genreSelect.value === '기타') {
            customGenreGroup.style.display = 'block';
            customGenreInput.required = true;
        } else {
            customGenreGroup.style.display = 'none';
            customGenreInput.required = false;
            customGenreInput.value = '';
        }
    }
}
