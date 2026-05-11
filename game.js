class CatGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = false;
        this.gamePaused = false;
        this.timer = null;
        this.dotTimer = null;
        
        // DOM элементы
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.redDot = document.getElementById('red-dot');
        this.messageElement = document.getElementById('message');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.gameContainer = document.getElementById('game-container');
        
        // Инициализация
        this.init();
    }
    
    init() {
        // Обработчики событий
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.redDot.addEventListener('click', () => this.catchDot());
        
        // Для мобильных устройств - обработка касаний
        this.redDot.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.catchDot();
        }, { passive: false });
        
        // Инициализация сообщения
        this.updateMessage('Нажми "Начать игру" чтобы начать!');
    }
    
    startGame() {
        if (this.gameActive && !this.gamePaused) return;
        
        if (!this.gameActive) {
            // Новая игра
            this.score = 0;
            this.timeLeft = 60;
            this.updateScore();
            this.updateTime();
            this.gameActive = true;
            this.gamePaused = false;
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.resetBtn.disabled = false;
            
            this.updateMessage('Лови красную точку!');
            this.showDot();
            
            // Запуск таймера
            this.timer = setInterval(() => this.updateTimer(), 1000);
            
            // Запуск появления точек
            this.dotTimer = setInterval(() => {
                if (!this.gamePaused) {
                    this.moveDot();
                }
            }, 1500);
        } else if (this.gamePaused) {
            // Продолжение игры после паузы
            this.gamePaused = false;
            this.pauseBtn.textContent = 'Пауза';
            this.updateMessage('Продолжаем игру!');
        }
        
        this.redDot.style.display = 'block';
    }
    
    togglePause() {
        if (!this.gameActive) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.pauseBtn.textContent = 'Продолжить';
            this.updateMessage('Игра на паузе');
            this.redDot.style.display = 'none';
        } else {
            this.pauseBtn.textContent = 'Пауза';
            this.updateMessage('Продолжаем игру!');
            this.redDot.style.display = 'block';
        }
    }
    
    resetGame() {
        this.gameActive = false;
        this.gamePaused = false;
        
        clearInterval(this.timer);
        clearInterval(this.dotTimer);
        
        this.score = 0;
        this.timeLeft = 60;
        this.updateScore();
        this.updateTime();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.pauseBtn.textContent = 'Пауза';
        
        this.redDot.style.display = 'none';
        this.updateMessage('Нажми "Начать игру" чтобы начать!');
    }
    
    updateTimer() {
        if (this.gamePaused) return;
        
        this.timeLeft--;
        this.updateTime();
        
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }
    
    updateTime() {
        this.timeElement.textContent = this.timeLeft;
        
        // Изменение цвета при малом времени
        if (this.timeLeft <= 10) {
            this.timeElement.style.color = '#f44336';
            this.timeElement.classList.add('pulse');
        } else {
            this.timeElement.style.color = '#667eea';
            this.timeElement.classList.remove('pulse');
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        
        // Анимация при изменении счета
        this.scoreElement.classList.add('pulse');
        setTimeout(() => {
            this.scoreElement.classList.remove('pulse');
        }, 300);
    }
    
    updateMessage(text) {
        this.messageElement.textContent = text;
        this.messageElement.classList.add('fade-in');
        setTimeout(() => {
            this.messageElement.classList.remove('fade-in');
        }, 300);
    }
    
    showDot() {
        const containerRect = this.gameContainer.getBoundingClientRect();
        const dotSize = 60;
        
        // Генерация случайной позиции
        const maxX = containerRect.width - dotSize;
        const maxY = containerRect.height - dotSize;
        
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        
        this.redDot.style.left = `${x}px`;
        this.redDot.style.top = `${y}px`;
        this.redDot.style.display = 'block';
    }
    
    moveDot() {
        if (!this.gameActive || this.gamePaused) return;
        
        const containerRect = this.gameContainer.getBoundingClientRect();
        const dotSize = 60;
        
        // Генерация новой случайной позиции
        const maxX = containerRect.width - dotSize;
        const maxY = containerRect.height - dotSize;
        
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        
        // Плавное перемещение
        this.redDot.style.transition = 'left 0.5s ease, top 0.5s ease';
        this.redDot.style.left = `${x}px`;
        this.redDot.style.top = `${y}px`;
        
        // Сброс transition после перемещения
        setTimeout(() => {
            this.redDot.style.transition = '';
        }, 500);
    }
    
    catchDot() {
        if (!this.gameActive || this.gamePaused) return;
        
        // Увеличение счета
        this.score++;
        this.updateScore();
        
        // Анимация попадания
        this.redDot.classList.add('pulse');
        setTimeout(() => {
            this.redDot.classList.remove('pulse');
        }, 300);
        
        // Создание всплывающего текста "+1"
        this.createScorePopup();
        
        // Перемещение точки
        setTimeout(() => {
            this.moveDot();
        }, 300);
    }
    
    createScorePopup() {
        const popup = document.createElement('div');
        popup.className = 'score-pop';
        popup.textContent = '+1';
        
        const dotRect = this.redDot.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();
        
        popup.style.left = `${dotRect.left - containerRect.left + 30}px`;
        popup.style.top = `${dotRect.top - containerRect.top - 20}px`;
        
        this.gameContainer.appendChild(popup);
        
        // Удаление после анимации
        setTimeout(() => {
            popup.remove();
        }, 500);
    }
    
    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        clearInterval(this.dotTimer);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.redDot.style.display = 'none';
        
        // Сообщение с результатом
        let message = `Игра окончена! Твой счет: ${this.score}`;
        if (this.score >= 50) {
            message += ' 🏆 Отличный результат! Твой котик гордится тобой!';
        } else if (this.score >= 30) {
            message += ' 👍 Хорошая игра!';
        } else if (this.score >= 15) {
            message += ' 😺 Неплохо!';
        } else {
            message += ' 🐱 Попробуй еще раз!';
        }
        
        this.updateMessage(message);
        
        // Виброотклик на мобильных устройствах (если поддерживается)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const game = new CatGame();
    
    // Предотвращение масштабирования при двойном тапе на мобильных устройствах
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Оптимизация для мобильных устройств
    document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    console.log('🐱 Игра для котика загружена и готова!');
});