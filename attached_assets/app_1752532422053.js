// Life In Weeks - JavaScript Application
class LifeInWeeks {
    constructor() {
        this.currentDate = new Date('2025-07-10');
        this.currentYear = 2025;
        this.weeksPerYear = 52;
        this.totalLifeWeeks = 4160;
        this.averageLifespanYears = 80;
        
        this.quotes = [
            "You could leave life right now. Let that determine what you do and say and think.",
            "We are finite, time-limited creatures, and that's precisely what makes our choices meaningful.",
            "The average human lifespan is absurdly, insultingly brief.",
            "Those are your weeks and they're all you've got."
        ];
        
        this.currentView = 'lifetime';
        this.userAge = 0;
        this.birthDate = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.displayRandomQuote();
        this.updateStatistics();
        this.updateVisualization();
    }
    
    initializeElements() {
        this.ageInput = document.getElementById('age');
        this.weeksGrid = document.getElementById('weeks-grid');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.monthSelector = document.querySelector('.month-selector');
        this.monthSelect = document.getElementById('month');
        this.gridTitle = document.getElementById('grid-title');
        
        // Statistics elements
        this.weeksLivedEl = document.getElementById('weeks-lived');
        this.weeksRemainingEl = document.getElementById('weeks-remaining');
        this.lifePercentageEl = document.getElementById('life-percentage');
        this.yearProgressEl = document.getElementById('year-progress');
        
        // Progress bars
        this.progressLivedEl = document.getElementById('progress-lived');
        this.progressRemainingEl = document.getElementById('progress-remaining');
        this.progressTotalEl = document.getElementById('progress-total');
        this.progress2025El = document.getElementById('progress-2025');
        
        this.quoteEl = document.getElementById('quote');
    }
    
    setupEventListeners() {
        // Age input with immediate response
        this.ageInput.addEventListener('input', (e) => {
            this.handleAgeChange(e.target.value);
        });
        
        this.ageInput.addEventListener('change', (e) => {
            this.handleAgeChange(e.target.value);
        });
        
        // View buttons
        this.viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(e.target.dataset.view);
            });
        });
        
        // Month selector
        this.monthSelect.addEventListener('change', (e) => {
            if (this.currentView === 'monthly') {
                this.updateVisualization();
            }
        });
    }
    
    handleAgeChange(ageValue) {
        const numAge = parseFloat(ageValue);
        
        if (isNaN(numAge) || numAge < 0 || numAge > 120 || ageValue === '') {
            this.userAge = 0;
            this.birthDate = null;
        } else {
            this.userAge = numAge;
            // Calculate birth date based on current date and age
            const birthYear = this.currentDate.getFullYear() - numAge;
            const birthMonth = this.currentDate.getMonth();
            const birthDay = this.currentDate.getDate();
            this.birthDate = new Date(birthYear, birthMonth, birthDay);
        }
        
        this.updateStatistics();
        this.updateVisualization();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        this.viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide month selector
        if (view === 'monthly') {
            this.monthSelector.classList.remove('hidden');
        } else {
            this.monthSelector.classList.add('hidden');
        }
        
        this.updateVisualization();
    }
    
    calculateWeeksLived() {
        if (!this.birthDate || this.userAge <= 0) {
            return 0;
        }
        
        // Calculate weeks lived based on age
        const weeksLived = Math.floor(this.userAge * this.weeksPerYear);
        return Math.max(0, Math.min(weeksLived, this.totalLifeWeeks));
    }
    
    calculateCurrentWeek() {
        const startOfYear = new Date(this.currentYear, 0, 1);
        const timeDiff = this.currentDate.getTime() - startOfYear.getTime();
        const dayOfYear = Math.floor(timeDiff / (24 * 60 * 60 * 1000)) + 1;
        return Math.min(Math.ceil(dayOfYear / 7), 52);
    }
    
    calculate2025Progress() {
        const startOfYear = new Date(this.currentYear, 0, 1);
        const endOfYear = new Date(this.currentYear, 11, 31);
        const totalDays = 365; // 2025 is not a leap year
        const daysPassed = Math.floor((this.currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        
        return {
            totalDays,
            daysPassed,
            percentage: Math.min(Math.round((daysPassed / totalDays) * 100), 100)
        };
    }
    
    updateStatistics() {
        const weeksLived = this.calculateWeeksLived();
        const weeksRemaining = Math.max(0, this.totalLifeWeeks - weeksLived);
        const lifePercentage = weeksLived > 0 ? Math.min(Math.round((weeksLived / this.totalLifeWeeks) * 100), 100) : 0;
        const yearProgress = this.calculate2025Progress();
        
        // Update numbers immediately
        this.weeksLivedEl.textContent = weeksLived.toLocaleString();
        this.weeksRemainingEl.textContent = weeksRemaining.toLocaleString();
        this.lifePercentageEl.textContent = `${lifePercentage}%`;
        this.yearProgressEl.textContent = `${yearProgress.percentage}%`;
        
        // Update progress bars with smooth animation
        requestAnimationFrame(() => {
            this.progressLivedEl.style.width = `${lifePercentage}%`;
            this.progressRemainingEl.style.width = `${100 - lifePercentage}%`;
            this.progressTotalEl.style.width = `${lifePercentage}%`;
            this.progress2025El.style.width = `${yearProgress.percentage}%`;
        });
    }
    
    updateVisualization() {
        // Clear existing grid
        this.weeksGrid.innerHTML = '';
        
        // Remove existing classes
        this.weeksGrid.classList.remove('fade-in');
        
        // Render based on current view
        switch (this.currentView) {
            case 'lifetime':
                this.renderLifetimeView();
                break;
            case 'year2025':
                this.render2025View();
                break;
            case 'monthly':
                this.renderMonthlyView();
                break;
        }
        
        // Add fade-in animation
        requestAnimationFrame(() => {
            this.weeksGrid.classList.add('fade-in');
        });
    }
    
    renderLifetimeView() {
        this.gridTitle.textContent = 'Your Life in Weeks (80 years)';
        const weeksLived = this.calculateWeeksLived();
        
        // Determine grid columns based on screen size
        const screenWidth = window.innerWidth;
        let columns;
        if (screenWidth < 480) {
            columns = 20;
        } else if (screenWidth < 768) {
            columns = 26;
        } else {
            columns = 52;
        }
        
        this.weeksGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        // Create week boxes
        for (let i = 0; i < this.totalLifeWeeks; i++) {
            const weekBox = document.createElement('div');
            weekBox.className = 'week-box';
            weekBox.setAttribute('data-week', i + 1);
            
            if (i < weeksLived) {
                weekBox.classList.add('week-box--lived');
                weekBox.textContent = '✓';
            } else if (i === weeksLived && weeksLived > 0) {
                weekBox.classList.add('week-box--current');
                weekBox.textContent = '●';
            } else {
                weekBox.classList.add('week-box--empty');
                weekBox.textContent = '';
            }
            
            // Add tooltip
            const year = Math.floor(i / this.weeksPerYear) + 1;
            const week = (i % this.weeksPerYear) + 1;
            weekBox.title = `Year ${year}, Week ${week}`;
            
            this.weeksGrid.appendChild(weekBox);
        }
    }
    
    render2025View() {
        this.gridTitle.textContent = '2025 Progress (52 weeks)';
        const currentWeek = this.calculateCurrentWeek();
        
        // Use fewer columns for year view
        const screenWidth = window.innerWidth;
        const columns = screenWidth < 768 ? 13 : 26;
        this.weeksGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        for (let i = 0; i < 52; i++) {
            const weekBox = document.createElement('div');
            weekBox.className = 'week-box';
            weekBox.setAttribute('data-week', i + 1);
            
            if (i < currentWeek - 1) {
                weekBox.classList.add('week-box--lived');
                weekBox.textContent = '✓';
            } else if (i === currentWeek - 1) {
                weekBox.classList.add('week-box--current');
                weekBox.textContent = '●';
            } else {
                weekBox.classList.add('week-box--empty');
                weekBox.textContent = '';
            }
            
            weekBox.title = `Week ${i + 1} of 2025`;
            this.weeksGrid.appendChild(weekBox);
        }
    }
    
    renderMonthlyView() {
        const selectedMonth = parseInt(this.monthSelect.value);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.gridTitle.textContent = `${monthNames[selectedMonth]} 2025`;
        
        const daysInMonth = new Date(this.currentYear, selectedMonth + 1, 0).getDate();
        const currentDay = selectedMonth === this.currentDate.getMonth() ? this.currentDate.getDate() : 0;
        
        // Calendar grid - 7 columns for days of week
        this.weeksGrid.style.gridTemplateColumns = `repeat(7, 1fr)`;
        
        // Calculate first day of month
        const firstDay = new Date(this.currentYear, selectedMonth, 1);
        const startingDayOfWeek = firstDay.getDay();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyBox = document.createElement('div');
            emptyBox.className = 'week-box';
            emptyBox.style.visibility = 'hidden';
            this.weeksGrid.appendChild(emptyBox);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayBox = document.createElement('div');
            dayBox.className = 'week-box';
            dayBox.textContent = day;
            
            // Determine if day is lived, current, or future
            if (selectedMonth === this.currentDate.getMonth()) {
                if (day < currentDay) {
                    dayBox.classList.add('week-box--lived');
                } else if (day === currentDay) {
                    dayBox.classList.add('week-box--current');
                } else {
                    dayBox.classList.add('week-box--empty');
                }
            } else if (selectedMonth < this.currentDate.getMonth()) {
                dayBox.classList.add('week-box--lived');
            } else {
                dayBox.classList.add('week-box--empty');
            }
            
            dayBox.title = `${monthNames[selectedMonth]} ${day}, 2025`;
            this.weeksGrid.appendChild(dayBox);
        }
    }
    
    displayRandomQuote() {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        this.quoteEl.textContent = randomQuote;
    }
}

// Initialize application
let app = null;

document.addEventListener('DOMContentLoaded', () => {
    app = new LifeInWeeks();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (app) {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            app.updateVisualization();
        }, 250);
    }
});

// Mobile touch support
document.addEventListener('touchstart', () => {}, { passive: true });