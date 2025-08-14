// Washington Wine Trip Planner - Main Application Logic

class WineTripPlanner {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.userProfile = {
            preferences: {},
            favorites: [],
            tastingNotes: {},
            visitHistory: [],
            createdDate: new Date().toISOString()
        };
        this.map = null;
        this.wineryMarkers = [];
        this.currentItinerary = [];
        
        this.quizQuestions = [
            {
                id: 'experience',
                question: 'How would you describe your wine experience?',
                options: [
                    { value: 'beginner', text: 'New to wine - excited to learn!', description: 'Perfect for accessible tastings and educational experiences' },
                    { value: 'intermediate', text: 'I know what I like and want to explore more', description: 'Ready for diverse tastings and some premium experiences' },
                    { value: 'expert', text: 'Experienced - looking for unique discoveries', description: 'Seeking rare varietals and boutique wineries' },
                    { value: 'professional', text: 'Wine professional or serious collector', description: 'Access to exclusive tastings and limited releases' }
                ]
            },
            {
                id: 'wineTypes',
                question: 'Which wine styles excite you most?',
                multiple: true,
                options: [
                    { value: 'reds', text: 'Bold reds (Cabernet, Syrah, Merlot)', description: 'Full-bodied wines with rich flavors' },
                    { value: 'whites', text: 'Crisp whites (Riesling, Chardonnay, Sauvignon Blanc)', description: 'Fresh, aromatic, and food-friendly wines' },
                    { value: 'sparkling', text: 'Sparkling wines and Champagne-style', description: 'Bubbles for celebrations and special moments' },
                    { value: 'dessert', text: 'Sweet and dessert wines', description: 'Perfect endings to meals or standalone treats' },
                    { value: 'natural', text: 'Natural and biodynamic wines', description: 'Minimal intervention, terroir-focused wines' }
                ]
            },
            {
                id: 'duration',
                question: 'How long is your wine adventure?',
                options: [
                    { value: 'day', text: 'Perfect day trip (1 day)', description: '2 tastings with lunch' },
                    { value: 'weekend', text: 'Weekend getaway (2-3 days)', description: '4-6 wineries with dining and accommodation' },
                    { value: 'week', text: 'Extended vacation (4-7 days)', description: 'Comprehensive tour of multiple regions' },
                    { value: 'flexible', text: 'I\'m flexible with timing', description: 'We\'ll suggest the ideal duration' }
                ]
            },
            {
                id: 'travelStyle',
                question: 'What\'s your preferred travel style?',
                options: [
                    { value: 'luxury', text: 'Luxury experience with premium accommodations', description: 'Five-star service and exclusive experiences' },
                    { value: 'boutique', text: 'Boutique hotels and intimate experiences', description: 'Charming, unique properties with personal touch' },
                    { value: 'adventure', text: 'Road trip adventure with scenic stops', description: 'Exploring hidden gems and scenic routes' },
                    { value: 'budget', text: 'Great value while staying comfortable', description: 'Quality experiences without breaking the bank' }
                ]
            },
            {
                id: 'regions',
                question: 'Which Washington wine regions interest you?',
                multiple: true,
                options: [
                    { value: 'columbia_valley', text: '🏔️ Columbia Valley (diverse, largest region)', description: 'Wide variety of wines and landscapes' },
                    { value: 'walla_walla', text: '🌾 Walla Walla Valley (historic, prestigious)', description: 'Premium reds and charming town atmosphere' },
                    { value: 'yakima', text: '🍇 Yakima Valley (oldest region, diverse)', description: 'Pioneer region with established wineries' },
                    { value: 'woodinville', text: '🌲 Woodinville (convenient from Seattle)', description: 'Easy access with numerous tasting rooms' },
                    { value: 'surprise', text: '🎲 Surprise me with hidden gems!', description: 'Let us choose the perfect regions for you' }
                ]
            },
            {
                id: 'activities',
                question: 'Beyond wine tasting, what interests you?',
                multiple: true,
                options: [
                    { value: 'dining', text: '🍽️ Farm-to-table dining experiences', description: 'Local cuisine paired with regional wines' },
                    { value: 'nature', text: '🏞️ Hiking and outdoor activities', description: 'Scenic trails and natural beauty' },
                    { value: 'culture', text: '🎨 Local art and cultural experiences', description: 'Galleries, museums, and local artisans' },
                    { value: 'history', text: '📚 Wine history and educational tours', description: 'Learn about winemaking and regional heritage' },
                    { value: 'relaxation', text: '🧘 Spa and wellness experiences', description: 'Unwind with therapeutic treatments' }
                ]
            }
        ];
        
        this.loadProfile();
        this.bindEvents();
    }

    bindEvents() {
        // Auto-save profile periodically
        setInterval(() => this.saveProfile(), 30000);
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveProfile();
            }
        });
    }

    startQuiz() {
        this.showSection('quiz');
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.quizQuestions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quizQuestions.length) * 100;
        
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = 
            `Question ${this.currentQuestion + 1} of ${this.quizQuestions.length}`;

        let optionsHtml = '';
        question.options.forEach((option, index) => {
            const selected = question.multiple ? 
                (this.answers[question.id] && this.answers[question.id].includes(option.value)) :
                (this.answers[question.id] === option.value);
            
            optionsHtml += `
                <div class="quiz-option ${selected ? 'selected' : ''}" 
                     onclick="app.selectOption('${question.id}', '${option.value}', ${question.multiple || false})"
                     title="${option.description || ''}">
                    <div class="option-text">${option.text}</div>
                    ${option.description ? `<div class="option-description">${option.description}</div>` : ''}
                </div>
            `;
        });

        document.getElementById('quizContent').innerHTML = `
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
                ${question.multiple ? '<p class="quiz-hint">💡 You can select multiple options</p>' : ''}
            </div>
        `;

        document.getElementById('prevBtn').style.display = this.currentQuestion > 0 ? 'inline-block' : 'none';
        document.getElementById('nextBtn').textContent = 
            this.currentQuestion < this.quizQuestions.length - 1 ? 'Next' : 'Create My Itinerary ✨';
    }

    selectOption(questionId, value, multiple) {
        if (multiple) {
            if (!this.answers[questionId]) this.answers[questionId] = [];
            const index = this.answers[questionId].indexOf(value);
            if (index > -1) {
                this.answers[questionId].splice(index, 1);
            } else {
                this.answers[questionId].push(value);
            }
        } else {
            this.answers[questionId] = value;
        }
        
        this.userProfile.preferences = this.answers;
        this.displayQuestion();
    }

    nextQuestion() {
        if (this.currentQuestion < this.quizQuestions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.generateItinerary();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    async generateItinerary() {
        this.showLoadingOverlay('Crafting your perfect wine journey...');
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.showSection('results');
        this.hideLoadingOverlay();
        
        const recommendedWineries = this.filterWineries();
        const itinerary = this.createItinerary(recommendedWineries);
        
        this.currentItinerary = itinerary;
        this.displayItinerarySummary(itinerary);
        this.displayItinerary(itinerary);
        this.initializeMap(recommendedWineries);
        this.displayRecommendations();
        
        this.showToast('Your personalized itinerary is ready! 🍷');
    }

    filterWineries() {
        const { wineries } = window.wineData;
        
        return wineries.map(winery => {
            let score = 0;
            
            // Experience level matching
            if (winery.suitedFor.includes(this.answers.experience)) {
                score += 3;
            }
            
            // Wine type preferences
            if (this.answers.wineTypes) {
                this.answers.wineTypes.forEach(type => {
                    if (winery.wineTypes.includes(type)) {
                        score += 2;
                    }
                });
            }
            
            // Travel style and price level matching
            const priceMatches = {
                'luxury': ['luxury', 'premium'],
                'boutique': ['premium', 'moderate'],
                'adventure': ['moderate', 'budget'],
                'budget': ['budget', 'moderate']
            };
            
            if (priceMatches[this.answers.travelStyle]?.includes(winery.priceLevel)) {
                score += 2;
            }
            
            // Region preferences
            if (this.answers.regions) {
                const regionMap = {
                    'columbia_valley': 'Columbia Valley',
                    'walla_walla': 'Walla Walla',
                    'woodinville': 'Woodinville',
                    'yakima': 'Yakima',
                    'red_mountain': 'Red Mountain'
                };
                
                this.answers.regions.forEach(region => {
                    if (regionMap[region] === winery.region || region === 'surprise') {
                        score += 1;
                    }
                });
            }
            
            return { ...winery, score };
        })
        .filter(winery => winery.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12); // Limit to top 12 matches
    }

    createItinerary(wineries) {
        const durationMap = {
            'day': { days: 1, wineriesPerDay: 2 },
            'weekend': { days: 2, wineriesPerDay: 2 },
            'week': { days: 5, wineriesPerDay: 2 },
            'flexible': { days: 3, wineriesPerDay: 2 }
        };
        
        const config = durationMap[this.answers.duration] || durationMap.flexible;
        const itinerary = [];
        
        // Group wineries by region for logical routing
        const wineriesByRegion = this.groupWineriesByRegion(wineries);
        const sortedRegions = this.sortRegionsByDistance(Object.keys(wineriesByRegion));
        
        let wineryIndex = 0;
        
        for (let day = 0; day < config.days && wineryIndex < wineries.length; day++) {
            const dayWineries = [];
            const targetRegion = sortedRegions[day % sortedRegions.length];
            
            // First, try to fill from the target region
            if (wineriesByRegion[targetRegion]) {
                const regionWineries = wineriesByRegion[targetRegion].slice(0, config.wineriesPerDay);
                dayWineries.push(...regionWineries);
                wineryIndex += regionWineries.length;
            }
            
            // Fill remaining slots with highest-scored wineries
            while (dayWineries.length < config.wineriesPerDay && wineryIndex < wineries.length) {
                if (!dayWineries.find(w => w.id === wineries[wineryIndex].id)) {
                    dayWineries.push(wineries[wineryIndex]);
                }
                wineryIndex++;
            }
            
            itinerary.push({
                day: day + 1,
                wineries: dayWineries,
                activities: this.generateDayActivities(dayWineries),
                region: targetRegion,
                estimatedDriving: this.calculateDrivingTime(dayWineries)
            });
        }
        
        return itinerary;
    }

    groupWineriesByRegion(wineries) {
        return wineries.reduce((groups, winery) => {
            const region = winery.region;
            if (!groups[region]) groups[region] = [];
            groups[region].push(winery);
            return groups;
        }, {});
    }

    sortRegionsByDistance(regions) {
        // Simple sorting by convenience - in a real app, this would use actual distances
        const regionPriority = {
            'Woodinville': 1,
            'Columbia Valley': 2,
            'Walla Walla': 3,
            'Red Mountain': 4,
            'Yakima Valley': 5
        };
        
        return regions.sort((a, b) => (regionPriority[a] || 6) - (regionPriority[b] || 6));
    }

    calculateDrivingTime(wineries) {
        // Simplified calculation - in production, use real routing API
        const baseTime = 30; // Base time for local driving
        const timePerWinery = 45; // Time between wineries including tasting
        return baseTime + (wineries.length - 1) * timePerWinery;
    }

    calculateDrivingTimeBetween(winery1, winery2) {
        // Calculate distance using Haversine formula
        const R = 3959; // Earth's radius in miles
        const lat1 = winery1.coords[0] * Math.PI / 180;
        const lat2 = winery2.coords[0] * Math.PI / 180;
        const deltaLat = (winery2.coords[0] - winery1.coords[0]) * Math.PI / 180;
        const deltaLng = (winery2.coords[1] - winery1.coords[1]) * Math.PI / 180;

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in miles

        // Convert to driving time (assuming average speed of 45 mph including stops)
        const drivingTimeHours = distance / 45;
        const drivingTimeMinutes = Math.round(drivingTimeHours * 60);
        
        return {
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal
            drivingTime: drivingTimeMinutes,
            isLongDistance: drivingTimeMinutes > 45 // Warning if over 45 minutes
        };
    }

    generateDayActivities(dayWineries) {
        const activities = [];
        
        if (this.answers.activities) {
            if (this.answers.activities.includes('dining')) {
                activities.push({
                    type: 'dining',
                    description: 'Lunch at recommended restaurant',
                    icon: '🍽️'
                });
            }
            if (this.answers.activities.includes('nature')) {
                activities.push({
                    type: 'nature',
                    description: 'Scenic drive through wine country',
                    icon: '🏞️'
                });
            }
            if (this.answers.activities.includes('culture')) {
                activities.push({
                    type: 'culture',
                    description: 'Visit local art gallery',
                    icon: '🎨'
                });
            }
        }
        
        return activities;
    }

    displayItinerarySummary(itinerary) {
        const totalWineries = itinerary.reduce((sum, day) => sum + day.wineries.length, 0);
        const regions = [...new Set(itinerary.map(day => day.region))];
        
        document.getElementById('itinerarySummary').innerHTML = `
            <h3>Your ${itinerary.length}-Day Wine Adventure</h3>
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-number">${totalWineries}</span>
                    <span class="stat-label">Wineries</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${regions.length}</span>
                    <span class="stat-label">Regions</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${itinerary.length}</span>
                    <span class="stat-label">Days</span>
                </div>
            </div>
            <p>Curated based on your preferences: ${this.answers.experience} level, ${Array.isArray(this.answers.wineTypes) ? this.answers.wineTypes.join(' & ') : this.answers.wineTypes} wines, ${this.answers.travelStyle} style</p>
        `;
    }

    displayItinerary(itinerary) {
        let html = '';
        
        itinerary.forEach(day => {
            html += `
                <div class="route-info">
                    <h3>🗓️ Day ${day.day} - ${day.region}</h3>
                    <div class="day-summary">
                        <p><strong>🚗 Estimated driving:</strong> ${day.estimatedDriving} minutes</p>
                        <p><strong>🍷 Tastings:</strong> ${day.wineries.length} wineries</p>
                    </div>
                    <div class="recommendations">
            `;
            
            day.wineries.forEach((winery, index) => {
                const isFavorited = this.userProfile.favorites.includes(winery.name);
                const timeSlots = ['10:30 AM', '2:30 PM'];
                const currentTime = timeSlots[index] || `${index + 1}:00 PM`;
                
                html += `
                    <div class="winery-card chronological-item" data-winery-id="${winery.id}">
                        <div class="timeline-marker">
                            <div class="time-badge">${currentTime}</div>
                            <div class="timeline-dot"></div>
                        </div>
                        <div class="winery-content">
                            <div class="winery-header">
                                <span class="winery-name">${index + 1}. ${winery.name}</span>
                                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                                        onclick="app.toggleFavorite('${winery.name}')"
                                        title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                                </button>
                            </div>
                        <div class="winery-details">
                            <div class="winery-detail">
                                <span class="icon">📍</span>
                                <strong>Region:</strong> ${winery.region}
                            </div>
                            <div class="winery-detail">
                                <span class="icon">🍇</span>
                                <strong>Specialty:</strong> ${winery.specialty}
                            </div>
                            <div class="winery-detail">
                                <span class="icon">💰</span>
                                <strong>Tasting fee:</strong> $${winery.tastingFee}
                            </div>
                            <div class="winery-detail">
                                <span class="icon">🕒</span>
                                <strong>Hours:</strong> ${winery.hours}
                            </div>
                            <div class="winery-detail">
                                <span class="icon">⭐</span>
                                <strong>Rating:</strong> ${winery.rating}/5
                            </div>
                            <div class="winery-detail">
                                <span class="icon">📞</span>
                                <strong>Phone:</strong> ${winery.phone}
                            </div>
                        </div>
                        <p class="winery-description">${winery.description}</p>
                        <div class="winery-features">
                            ${winery.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                            <textarea class="wine-notes" 
                                     placeholder="Add your tasting notes for ${winery.name}..."
                                     onchange="app.saveTastingNote('${winery.name}', this.value)">${this.userProfile.tastingNotes[winery.name] || ''}</textarea>
                        </div>
                    </div>
                `;
                
                // Add driving time to next winery if not the last one
                if (index < day.wineries.length - 1) {
                    const nextWinery = day.wineries[index + 1];
                    const drivingInfo = this.calculateDrivingTimeBetween(winery, nextWinery);
                    const warningClass = drivingInfo.isLongDistance ? ' warning' : '';
                    const warningIcon = drivingInfo.isLongDistance ? '⚠️' : '🚗';
                    const warningText = drivingInfo.isLongDistance ? 
                        ` - Consider replacing one winery with a closer option` : '';
                    
                    html += `
                        <div class="driving-info${warningClass}">
                            <span class="icon">${warningIcon}</span>
                            <strong>Drive to next winery:</strong> ${drivingInfo.drivingTime} minutes 
                            (${drivingInfo.distance} miles)${warningText}
                        </div>
                    `;
                }
            });
            
            // Add activities for the day
            if (day.activities.length > 0) {
                html += `
                    <div class="day-activities">
                        <h4>🎯 Recommended Activities</h4>
                        ${day.activities.map(activity => `
                            <div class="activity-item">
                                <span class="activity-icon">${activity.icon}</span>
                                <span class="activity-description">${activity.description}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        document.getElementById('itineraryContent').innerHTML = html;
    }

    initializeMap(wineries) {
        if (this.map) {
            this.map.remove();
        }
        
        // Center map on Washington State
        this.map = L.map('map').setView([47.0379, -120.8017], 7);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Clear existing markers
        this.wineryMarkers = [];
        
        // Add markers for each winery
        wineries.forEach((winery, index) => {
            const marker = L.marker(winery.coords)
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <strong>${winery.name}</strong><br>
                        <em>${winery.region}</em><br>
                        <strong>Specialty:</strong> ${winery.specialty}<br>
                        <strong>Rating:</strong> ⭐ ${winery.rating}/5<br>
                        <strong>Tasting Fee:</strong> $${winery.tastingFee}<br>
                        <a href="${winery.website}" target="_blank">Visit Website</a>
                    </div>
                `);
            
            this.wineryMarkers.push(marker);
        });
        
        // Adjust map bounds to show all markers
        if (wineries.length > 0) {
            const group = new L.featureGroup(this.wineryMarkers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    displayRecommendations() {
        const { restaurants, accommodations } = window.wineData;
        
        // Filter recommendations based on user preferences
        const matchedRestaurants = restaurants.filter(restaurant => {
            if (this.answers.travelStyle === 'luxury') {
                return restaurant.priceLevel === 'luxury';
            } else if (this.answers.travelStyle === 'budget') {
                return restaurant.priceLevel === 'budget';
            }
            return true;
        });
        
        const matchedAccommodations = accommodations.filter(accommodation => {
            if (this.answers.travelStyle === 'luxury') {
                return accommodation.priceLevel === 'luxury';
            } else if (this.answers.travelStyle === 'boutique') {
                return accommodation.priceLevel === 'boutique';
            } else if (this.answers.travelStyle === 'budget') {
                return accommodation.priceLevel === 'budget';
            }
            return true;
        });
        
        let html = `
            <div class="recommendations-section">
                <h3>🍽️ Recommended Dining</h3>
                <div class="recommendations">
        `;
        
        matchedRestaurants.forEach(restaurant => {
            html += `
                <div class="recommendation-card">
                    <h4>${restaurant.name}</h4>
                    <div class="recommendation-details">
                        <p><strong>📍 Location:</strong> ${restaurant.location}</p>
                        <p><strong>🍴 Cuisine:</strong> ${restaurant.cuisine}</p>
                        <p><strong>💰 Price Level:</strong> ${restaurant.priceLevel}</p>
                        <p><strong>⭐ Rating:</strong> ${restaurant.rating}/5</p>
                        <p><strong>📞 Phone:</strong> ${restaurant.phone}</p>
                    </div>
                    <p class="recommendation-description">${restaurant.description}</p>
                    <div class="recommendation-features">
                        ${restaurant.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <h3>🏨 Recommended Accommodations</h3>
                <div class="recommendations">
        `;
        
        matchedAccommodations.forEach(accommodation => {
            html += `
                <div class="recommendation-card">
                    <h4>${accommodation.name}</h4>
                    <div class="recommendation-details">
                        <p><strong>📍 Location:</strong> ${accommodation.location}</p>
                        <p><strong>🏨 Type:</strong> ${accommodation.type}</p>
                        <p><strong>💰 Price Level:</strong> ${accommodation.priceLevel}</p>
                        <p><strong>⭐ Rating:</strong> ${accommodation.rating}/5</p>
                    </div>
                    <p class="recommendation-description">${accommodation.description}</p>
                    <div class="recommendation-features">
                        ${accommodation.amenities.map(amenity => `<span class="feature-tag">${amenity}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        document.getElementById('recommendationsContent').innerHTML = html;
    }

    toggleFavorite(wineryName) {
        const index = this.userProfile.favorites.indexOf(wineryName);
        if (index > -1) {
            this.userProfile.favorites.splice(index, 1);
            this.showToast(`Removed ${wineryName} from favorites`, 'warning');
        } else {
            this.userProfile.favorites.push(wineryName);
            this.showToast(`Added ${wineryName} to favorites! ❤️`);
        }
        
        // Update all favorite buttons for this winery
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(wineryName)) {
                btn.classList.toggle('favorited');
                const isFavorited = btn.classList.contains('favorited');
                btn.title = isFavorited ? 'Remove from favorites' : 'Add to favorites';
            }
        });
        
        this.saveProfile();
    }

    saveTastingNote(wineryName, note) {
        this.userProfile.tastingNotes[wineryName] = note;
        this.saveProfile();
        
        if (note.trim()) {
            this.showToast(`Tasting note saved for ${wineryName} 📝`);
        }
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        
        if (sectionId === 'profile') {
            this.displayProfile();
        }
    }

    displayProfile() {
        // Display preferences
        let preferencesHtml = '<div class="preferences-grid">';
        for (const [key, value] of Object.entries(this.userProfile.preferences)) {
            const questionLabel = this.quizQuestions.find(q => q.id === key)?.question || key;
            let displayValue = value;
            
            if (Array.isArray(value)) {
                displayValue = value.join(', ');
            }
            
            preferencesHtml += `
                <div class="preference-item">
                    <strong>${questionLabel}:</strong>
                    <span>${displayValue}</span>
                </div>
            `;
        }
        preferencesHtml += '</div>';
        document.getElementById('profilePreferences').innerHTML = preferencesHtml;
        
        // Display favorites
        const favoritesHtml = this.userProfile.favorites.length > 0 ?
            `<div class="favorites-list">
                ${this.userProfile.favorites.map(fav => `
                    <div class="favorite-item">
                        <span>❤️ ${fav}</span>
                        <button class="btn btn-small" onclick="app.removeFavorite('${fav}')">Remove</button>
                    </div>
                `).join('')}
            </div>` :
            '<p class="empty-state">No favorites yet. Start exploring wineries to add them! 🍷</p>';
        document.getElementById('favoriteWineries').innerHTML = favoritesHtml;
        
        // Display tasting notes
        let notesHtml = '';
        const notesCount = Object.keys(this.userProfile.tastingNotes).filter(key => 
            this.userProfile.tastingNotes[key].trim()).length;
        
        if (notesCount > 0) {
            notesHtml = '<div class="tasting-notes-list">';
            for (const [winery, note] of Object.entries(this.userProfile.tastingNotes)) {
                if (note.trim()) {
                    notesHtml += `
                        <div class="tasting-note-item">
                            <h4>${winery}</h4>
                            <p>${note}</p>
                            <small>Last updated: ${new Date().toLocaleDateString()}</small>
                        </div>
                    `;
                }
            }
            notesHtml += '</div>';
        } else {
            notesHtml = '<p class="empty-state">No tasting notes yet. Visit wineries and add your thoughts! 📝</p>';
        }
        document.getElementById('tastingNotes').innerHTML = notesHtml;
        
        // Display profile statistics
        const stats = this.calculateProfileStats();
        document.getElementById('profileStats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number">${stats.favoriteCount}</span>
                    <span class="stat-label">Favorite Wineries</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.notesCount}</span>
                    <span class="stat-label">Tasting Notes</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.regionsVisited}</span>
                    <span class="stat-label">Regions Explored</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.memberSince}</span>
                    <span class="stat-label">Member Since</span>
               </div>
           </div>
       `;
   }

   calculateProfileStats() {
       const favoriteCount = this.userProfile.favorites.length;
       const notesCount = Object.keys(this.userProfile.tastingNotes)
           .filter(key => this.userProfile.tastingNotes[key].trim()).length;
       
       // Get unique regions from favorites
       const { wineries } = window.wineData;
       const favoriteWineries = wineries.filter(w => this.userProfile.favorites.includes(w.name));
       const regionsVisited = [...new Set(favoriteWineries.map(w => w.region))].length;
       
       const memberSince = new Date(this.userProfile.createdDate).getFullYear();
       
       return { favoriteCount, notesCount, regionsVisited, memberSince };
   }

   removeFavorite(wineryName) {
       const index = this.userProfile.favorites.indexOf(wineryName);
       if (index > -1) {
           this.userProfile.favorites.splice(index, 1);
           this.saveProfile();
           this.displayProfile();
           this.showToast(`Removed ${wineryName} from favorites`, 'warning');
       }
   }

   exportProfile() {
       const exportData = {
           ...this.userProfile,
           exportDate: new Date().toISOString(),
           itinerary: this.currentItinerary
       };
       
       const dataStr = JSON.stringify(exportData, null, 2);
       const dataBlob = new Blob([dataStr], { type: 'application/json' });
       const url = URL.createObjectURL(dataBlob);
       
       const link = document.createElement('a');
       link.href = url;
       link.download = `wine-journey-profile-${new Date().toISOString().split('T')[0]}.json`;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(url);
       
       this.showToast('Profile exported successfully! 📄');
   }

   exportItinerary() {
       if (!this.currentItinerary.length) {
           this.showToast('No itinerary to export. Create one first!', 'warning');
           return;
       }
       
       let exportText = `🍷 Washington Wine Country Itinerary\n`;
       exportText += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
       
       this.currentItinerary.forEach(day => {
           exportText += `📅 Day ${day.day} - ${day.region}\n`;
           exportText += `🚗 Estimated driving: ${day.estimatedDriving} minutes\n\n`;
           
           day.wineries.forEach(winery => {
               exportText += `🍇 ${winery.name}\n`;
               exportText += `   📍 ${winery.region}\n`;
               exportText += `   🍷 ${winery.specialty}\n`;
               exportText += `   💰 Tasting fee: $${winery.tastingFee}\n`;
               exportText += `   🕒 ${winery.hours}\n`;
               exportText += `   📞 ${winery.phone}\n`;
               exportText += `   🌐 ${winery.website}\n\n`;
           });
           
           if (day.activities.length > 0) {
               exportText += `🎯 Activities:\n`;
               day.activities.forEach(activity => {
                   exportText += `   ${activity.icon} ${activity.description}\n`;
               });
               exportText += `\n`;
           }
           
           exportText += `${'='.repeat(50)}\n\n`;
       });
       
       const dataBlob = new Blob([exportText], { type: 'text/plain' });
       const url = URL.createObjectURL(dataBlob);
       
       const link = document.createElement('a');
       link.href = url;
       link.download = `washington-wine-itinerary-${new Date().toISOString().split('T')[0]}.txt`;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(url);
       
       this.showToast('Itinerary exported successfully! 📋');
   }

   clearProfile() {
       if (confirm('Are you sure you want to reset your profile? This will clear all favorites and tasting notes.')) {
           this.userProfile = {
               preferences: {},
               favorites: [],
               tastingNotes: {},
               visitHistory: [],
               createdDate: new Date().toISOString()
           };
           this.answers = {};
           this.currentQuestion = 0;
           this.saveProfile();
           this.showSection('welcome');
           this.showToast('Profile reset successfully', 'warning');
       }
   }

   saveProfile() {
       try {
           localStorage.setItem('wineProfile', JSON.stringify(this.userProfile));
       } catch (error) {
           console.error('Error saving profile:', error);
       }
   }

   loadProfile() {
       try {
           const saved = localStorage.getItem('wineProfile');
           if (saved) {
               this.userProfile = { ...this.userProfile, ...JSON.parse(saved) };
               this.answers = this.userProfile.preferences || {};
           }
       } catch (error) {
           console.error('Error loading profile:', error);
       }
   }

   showLoadingOverlay(message = 'Loading...') {
       const overlay = document.getElementById('loadingOverlay');
       const messageElement = overlay.querySelector('p');
       messageElement.textContent = message;
       overlay.classList.remove('hidden');
   }

   hideLoadingOverlay() {
       document.getElementById('loadingOverlay').classList.add('hidden');
   }

   showToast(message, type = 'success') {
       // Remove existing toasts
       document.querySelectorAll('.toast').forEach(toast => toast.remove());
       
       const toast = document.createElement('div');
       toast.className = `toast ${type}`;
       toast.textContent = message;
       document.body.appendChild(toast);
       
       // Show toast
       setTimeout(() => toast.classList.add('show'), 100);
       
       // Hide toast after 3 seconds
       setTimeout(() => {
           toast.classList.remove('show');
           setTimeout(() => toast.remove(), 300);
       }, 3000);
   }
}

// Initialize the application
const app = new WineTripPlanner();

// Global functions for HTML onclick handlers
function startQuiz() { app.startQuiz(); }
function nextQuestion() { app.nextQuestion(); }
function previousQuestion() { app.previousQuestion(); }
function showSection(sectionId) { app.showSection(sectionId); }
function exportProfile() { app.exportProfile(); }
function exportItinerary() { app.exportItinerary(); }
function clearProfile() { app.clearProfile(); }