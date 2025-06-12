// Test Data Storage
let testData = {
    name: '',
    purpose: '',
    concerns: [],
    frequency: 50,
    audioBlob: null,
    phone: '',
    email: '',
    messenger: 'whatsapp',
    startTime: new Date()
};

// Voice Animals Data
const animals = [
    {
        name: 'ЛЕВ',
        image: 'images/lion.svg',
        description: 'Мощный, уверенный, лидерский голос. Вы обладаете природной харизмой и способностью вести за собой людей.'
    },
    {
        name: 'КОЛИБРИ',
        image: 'images/colibri.svg',
        description: 'Быстрый, энергичный, яркий голос. Ваша речь полна жизни и энтузиазма, вы умеете заряжать других своей энергией.'
    },
    {
        name: 'СОВА',
        image: 'images/owl.svg',
        description: 'Мудрый, глубокий, вдумчивый голос. Люди прислушиваются к вам, потому что чувствуют глубину ваших мыслей.'
    },
    {
        name: 'ДЕЛЬФИН',
        image: 'images/dolphin.svg',
        description: 'Дружелюбный, мелодичный голос. Вы легко находите общий язык с людьми и создаёте позитивную атмосферу.'
    },
    {
        name: 'ОРЁЛ',
        image: 'images/eagle.svg',
        description: 'Командный, чёткий, целеустремлённый голос. Ваша речь точна и убедительна, вы прирождённый лидер.'
    },
    {
        name: 'КОШКА',
        image: 'images/cat.svg',
        description: 'Мягкий, обволакивающий, гипнотический голос. Вы умеете успокаивать и очаровывать своим голосом.'
    }
];

// Recording variables
let mediaRecorder;
let audioChunks = [];
let recordingTimer;
let seconds = 0;

// Initialize test
function initTest() {
    // Load saved progress if exists
    const savedData = localStorage.getItem('voiceTestData');
    if (savedData) {
        testData = JSON.parse(savedData);
    }
    
    // Update slider visualization
    const slider = document.getElementById('frequency');
    if (slider) {
        slider.addEventListener('input', updateWaveVisualization);
    }
}

// Start test from hero button
function startTest() {
    document.getElementById('test').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        showStep(1);
    }, 500);
}

// Navigate between steps
function nextStep(currentStep) {
    // Validation
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Save data
    saveStepData(currentStep);
    
    // Show next step
    if (currentStep === 6) {
        // Final step - send data and show result
        submitTest();
    } else {
        showStep(currentStep + 1);
    }
}

// Show specific step
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.test-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStep = document.getElementById(`step-${stepNumber}`);
    if (currentStep) {
        currentStep.classList.add('active');
        
        // Update progress bar if exists
        const progressBar = currentStep.querySelector('.progress');
        if (progressBar) {
            const progress = ((stepNumber - 1) / 6) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    // Save progress
    localStorage.setItem('currentStep', stepNumber);
}

// Validate step data
function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1:
            const name = document.getElementById('name').value.trim();
            if (!name) {
                showError('Пожалуйста, введите ваше имя');
                return false;
            }
            return true;
            
        case 2:
            const purpose = document.querySelector('input[name="purpose"]:checked');
            if (!purpose) {
                showError('Пожалуйста, выберите цель');
                return false;
            }
            return true;
            
        case 3:
            const concerns = document.querySelectorAll('input[name="concerns"]:checked');
            if (concerns.length === 0) {
                showError('Пожалуйста, выберите хотя бы один вариант');
                return false;
            }
            return true;
            
        case 4:
            // Slider always has value
            return true;
            
        case 5:
            if (!testData.audioBlob) {
                showError('Пожалуйста, запишите аудио');
                return false;
            }
            return true;
            
        case 6:
            const phone = document.getElementById('phone').value.trim();
            const agree = document.getElementById('agree').checked;
            
            if (!phone) {
                showError('Пожалуйста, введите телефон');
                return false;
            }
            
            if (!validatePhone(phone)) {
                showError('Пожалуйста, введите корректный телефон');
                return false;
            }
            
            if (!agree) {
                showError('Необходимо согласие на обработку данных');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

// Save step data
function saveStepData(stepNumber) {
    switch(stepNumber) {
        case 1:
            testData.name = document.getElementById('name').value.trim();
            break;
            
        case 2:
            testData.purpose = document.querySelector('input[name="purpose"]:checked').value;
            break;
            
        case 3:
            testData.concerns = Array.from(document.querySelectorAll('input[name="concerns"]:checked'))
                .map(cb => cb.value);
            break;
            
        case 4:
            testData.frequency = document.getElementById('frequency').value;
            break;
            
        case 5:
            // Audio already saved
            break;
            
        case 6:
            testData.phone = document.getElementById('phone').value.trim();
            testData.email = document.getElementById('email').value.trim();
            testData.messenger = document.querySelector('input[name="messenger"]:checked').value;
            break;
    }
    
    // Save to localStorage
    localStorage.setItem('voiceTestData', JSON.stringify(testData));
}

// Recording functions
function toggleRecording() {
    const recordBtn = document.getElementById('recordBtn');
    const recordText = recordBtn.querySelector('.record-text');
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop recording
        stopRecording();
    } else {
        // Start recording
        startRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            testData.audioBlob = audioBlob;
            
            // Enable next button
            document.getElementById('nextBtn5').disabled = false;
            
            // Create audio waves visualization
            createAudioWaves();
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Update UI
        const recordBtn = document.getElementById('recordBtn');
        recordBtn.classList.add('recording');
        recordBtn.querySelector('.record-text').textContent = 'Остановить запись';
        
        // Start timer
        startTimer();
        
        // Auto-stop after 15 seconds
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                stopRecording();
            }
        }, 15000);
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showError('Не удалось получить доступ к микрофону. Проверьте разрешения.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        // Update UI
        const recordBtn = document.getElementById('recordBtn');
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('.record-text').textContent = 'Записать заново';
        
        // Stop timer
        clearInterval(recordingTimer);
    }
}

function startTimer() {
    seconds = 0;
    const timerElement = document.getElementById('timer');
    
    recordingTimer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function createAudioWaves() {
    const wavesContainer = document.getElementById('audioWaves');
    wavesContainer.innerHTML = '';
    
    // Create visual representation of audio waves
    for (let i = 0; i < 30; i++) {
        const wave = document.createElement('div');
        wave.className = 'audio-wave';
        wave.style.height = Math.random() * 40 + 20 + 'px';
        wave.style.animationDelay = (i * 0.05) + 's';
        wavesContainer.appendChild(wave);
    }
}

// Update wave visualization based on slider
function updateWaveVisualization() {
    const value = document.getElementById('frequency').value;
    const wave = document.getElementById('wave');
    
    // Update wave animation speed based on frequency
    const speed = 3 - (value / 100) * 2; // 3s to 1s
    wave.style.animationDuration = speed + 's';
    
    // Update opacity
    wave.style.opacity = 0.2 + (value / 100) * 0.6;
}

// Submit test and show results
async function submitTest() {
    // Show generating screen
    showStep(7);
    
    // Calculate result based on answers
    const animalIndex = calculateAnimalResult();
    const animal = animals[animalIndex];
    
    // Send data to server (mock API call)
    try {
        await sendTestData();
        
        // Show result after animation
        setTimeout(() => {
            showResult(animal);
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting test:', error);
        showError('Произошла ошибка при отправке данных. Попробуйте еще раз.');
    }
}

// Calculate which animal matches the user
function calculateAnimalResult() {
    // Simple algorithm based on answers
    let score = 0;
    
    // Purpose scoring
    switch(testData.purpose) {
        case 'public': score += 4; break;
        case 'singing': score += 2; break;
        case 'confidence': score += 3; break;
        case 'curious': score += 1; break;
    }
    
    // Concerns scoring
    if (testData.concerns.includes('quiet')) score += 1;
    if (testData.concerns.includes('tired')) score += 2;
    if (testData.concerns.includes('tension')) score += 3;
    if (testData.concerns.includes('monotone')) score += 2;
    
    // Frequency scoring
    score += Math.floor(testData.frequency / 20);
    
    // Map score to animal (0-5)
    return Math.min(Math.floor(score / 3), animals.length - 1);
}

// Show result
function showResult(animal) {
    document.getElementById('generating').style.display = 'none';
    const resultCard = document.getElementById('result');
    resultCard.style.display = 'block';
    
    // Update animal info
    const animalImg = resultCard.querySelector('.animal-result');
    animalImg.src = animal.image;
    animalImg.alt = animal.name;
    
    resultCard.querySelector('h3').textContent = `Ваше голосовое животное - ${animal.name}`;
    resultCard.querySelector('.animal-card p').textContent = animal.description;
    
    // Clear saved data
    localStorage.removeItem('voiceTestData');
    localStorage.removeItem('currentStep');
    
    // Update today's count
    updateTodayCount();
}

// Mock API call
async function sendTestData() {
    // In real implementation, this would send data to server
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

// Share result
function shareResult() {
    const shareText = `Я прошел тест голоса в школе Анастасии Порток! Мое голосовое животное - ${animals[calculateAnimalResult()].name}. А какое у тебя? Пройди тест: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Мой результат теста голоса',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText);
        showSuccess('Ссылка скопирована!');
    }
}

// Book lesson
function bookLesson() {
    // Redirect to networking page or show booking form
    window.location.href = 'networking.html#form';
}

// Utility functions
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
}

function showError(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function updateTodayCount() {
    const countElement = document.getElementById('todayCount');
    if (countElement) {
        const currentCount = parseInt(countElement.textContent);
        countElement.textContent = currentCount + 1;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initTest);

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    }
    
    .toast.error {
        background-color: #FF5252;
    }
    
    .toast.success {
        background-color: #4CAF50;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 