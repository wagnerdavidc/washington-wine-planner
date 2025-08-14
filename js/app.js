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
                                <div class="winery-actions">
                                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                                            onclick="app.toggleFavorite('${winery.name}')"
                                            title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                                    </button>
                                    <button class="replace-btn" 
                                            onclick="app.showWineryReplacements(${day.day}, ${index}, ${winery.id})"
                                            title="Replace this winery">
                                        🔄 Replace
                                    </button>
                                </div>
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
        
        // Create custom icons
        const wineryIcon = L.divIcon({
            html: '<div style="background: #8B0000; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🍷</div>',
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const restaurantIcon = L.divIcon({
            html: '<div style="background: #ff6b6b; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🍽️</div>',
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const hotelIcon = L.divIcon({
            html: '<div style="background: #4ecdc4; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏨</div>',
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Clear existing markers
        this.allMarkers = [];
        
        // Add markers for each winery
        wineries.forEach((winery, index) => {
            const marker = L.marker(winery.coords, { icon: wineryIcon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 20px;">🍷</span>
                            <strong style="color: #8B0000;">${winery.name}</strong>
                        </div>
                        <em>${winery.region}</em><br>
                        <strong>Specialty:</strong> ${winery.specialty}<br>
                        <strong>Rating:</strong> ⭐ ${winery.rating}/5<br>
                        <strong>Tasting Fee:</strong> $${winery.tastingFee}<br>
                        <a href="${winery.website}" target="_blank" style="color: #8B0000;">Visit Website</a>
                    </div>
                `);
            
            this.allMarkers.push(marker);
        });

        // Add restaurant markers
        const { restaurants, accommodations } = window.wineData;
        const matchedRestaurants = restaurants.filter(restaurant => {
            if (this.answers.travelStyle === 'luxury') {
                return restaurant.priceLevel === 'luxury';
            } else if (this.answers.travelStyle === 'budget') {
                return restaurant.priceLevel === 'budget';
            }
            return true;
        });

        matchedRestaurants.forEach(restaurant => {
            const marker = L.marker(restaurant.coords, { icon: restaurantIcon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 20px;">🍽️</span>
                            <strong style="color: #ff6b6b;">${restaurant.name}</strong>
                        </div>
                        <em>${restaurant.location}</em><br>
                        <strong>Cuisine:</strong> ${restaurant.cuisine}<br>
                        <strong>Rating:</strong> ⭐ ${restaurant.rating}/5<br>
                        <strong>Price Level:</strong> ${restaurant.priceLevel}<br>
                        <strong>Phone:</strong> ${restaurant.phone}
                    </div>
                `);
            
            this.allMarkers.push(marker);
        });

        // Add accommodation markers
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

        matchedAccommodations.forEach(accommodation => {
            const marker = L.marker(accommodation.coords, { icon: hotelIcon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 20px;">🏨</span>
                            <strong style="color: #4ecdc4;">${accommodation.name}</strong>
                        </div>
                        <em>${accommodation.location}</em><br>
                        <strong>Type:</strong> ${accommodation.type}<br>
                        <strong>Rating:</strong> ⭐ ${accommodation.rating}/5<br>
                        <strong>Price Level:</strong> ${accommodation.priceLevel}
                    </div>
                `);
            
            this.allMarkers.push(marker);
        });
        
        // Adjust map bounds to show all markers
        if (this.allMarkers.length > 0) {
            const group = new L.featureGroup(this.allMarkers);
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

   showWineryReplacements(dayIndex, wineryIndex, currentWineryId) {
       const { wineries } = window.wineData;
       const currentWinery = wineries.find(w => w.id === currentWineryId);
       
       // Get alternative wineries (exclude current one and ones already in itinerary)
       const usedWineryIds = this.currentItinerary.flatMap(day => day.wineries.map(w => w.id));
       const alternatives = this.filterWineries()
           .filter(w => w.id !== currentWineryId && !usedWineryIds.includes(w.id))
           .slice(0, 6); // Show top 6 alternatives

       const modal = document.createElement('div');
       modal.className = 'replacement-modal';
       modal.innerHTML = `
           <div class="replacement-content">
               <div class="replacement-header">
                   <h3>Replace Winery - Day ${dayIndex}</h3>
                   <button class="close-btn" onclick="this.closest('.replacement-modal').remove()">×</button>
               </div>
               <div class="replacement-body">
                   <div class="comparison-section">
                       <div class="current-winery">
                           <div class="winery-comparison-header">📍 Current Selection</div>
                           <div class="comparison-grid">
                               <div class="comparison-item">
                                   <strong>Name:</strong>
                                   <span>${currentWinery.name}</span>
                               </div>
                               <div class="comparison-item">
                                   <strong>Region:</strong>
                                   <span>${currentWinery.region}</span>
                               </div>
                               <div class="comparison-item">
                                   <strong>Specialty:</strong>
                                   <span>${currentWinery.specialty}</span>
                               </div>
                               <div class="comparison-item">
                                   <strong>Rating:</strong>
                                   <span>⭐ ${currentWinery.rating}/5</span>
                               </div>
                               <div class="comparison-item">
                                   <strong>Tasting Fee:</strong>
                                   <span>$${currentWinery.tastingFee}</span>
                               </div>
                               <div class="comparison-item">
                                   <strong>Price Level:</strong>
                                   <span>${currentWinery.priceLevel}</span>
                               </div>
                           </div>
                       </div>
                       <div class="replacement-winery" id="selected-replacement">
                           <div class="winery-comparison-header">🔄 Select Replacement</div>
                           <div class="comparison-grid">
                               <div style="text-align: center; color: #666; font-style: italic; padding: 40px 0;">
                                   Click on a winery below to compare
                               </div>
                           </div>
                       </div>
                   </div>
                   <div class="alternatives-section">
                       <h4>Alternative Wineries</h4>
                       <div class="alternatives-grid">
                           ${alternatives.map(winery => `
                               <div class="alternative-card" onclick="app.selectReplacement(${winery.id}, ${dayIndex}, ${wineryIndex})">
                                   <h4>${winery.name}</h4>
                                   <div class="alternative-details">
                                       <div><strong>Region:</strong> ${winery.region}</div>
                                       <div><strong>Rating:</strong> ⭐ ${winery.rating}/5</div>
                                       <div><strong>Fee:</strong> $${winery.tastingFee}</div>
                                       <div><strong>Level:</strong> ${winery.priceLevel}</div>
                                   </div>
                                   <p style="font-size: 0.9em; color: #666; margin: 10px 0;">${winery.description.substring(0, 100)}...</p>
                                   <div class="alternative-actions">
                                       <button class="select-btn">Select This Winery</button>
                                   </div>
                               </div>
                           `).join('')}
                       </div>
                   </div>
               </div>
           </div>
       `;

       document.body.appendChild(modal);
   }

   selectReplacement(wineryId, dayIndex, wineryIndex) {
       const { wineries } = window.wineData;
       const selectedWinery = wineries.find(w => w.id === wineryId);
       
       // Update comparison panel
       const comparisonPanel = document.getElementById('selected-replacement');
       if (comparisonPanel) {
           comparisonPanel.innerHTML = `
               <div class="winery-comparison-header">✨ Selected Replacement</div>
               <div class="comparison-grid">
                   <div class="comparison-item">
                       <strong>Name:</strong>
                       <span>${selectedWinery.name}</span>
                   </div>
                   <div class="comparison-item">
                       <strong>Region:</strong>
                       <span>${selectedWinery.region}</span>
                   </div>
                   <div class="comparison-item">
                       <strong>Specialty:</strong>
                       <span>${selectedWinery.specialty}</span>
                   </div>
                   <div class="comparison-item">
                       <strong>Rating:</strong>
                       <span>⭐ ${selectedWinery.rating}/5</span>
                   </div>
                   <div class="comparison-item">
                       <strong>Tasting Fee:</strong>
                       <span>$${selectedWinery.tastingFee}</span>
                   </div>
                   <div class="comparison-item">
                       <strong>Price Level:</strong>
                       <span>${selectedWinery.priceLevel}</span>
                   </div>
               </div>
               <div style="text-align: center; margin-top: 15px;">
                   <button class="btn btn-primary" onclick="app.confirmReplacement(${wineryId}, ${dayIndex}, ${wineryIndex})">
                       Confirm Replacement
                   </button>
               </div>
           `;
       }

       // Highlight selected card
       document.querySelectorAll('.alternative-card').forEach(card => {
           card.style.borderColor = 'var(--border-color)';
           card.style.background = 'white';
       });
       event.currentTarget.style.borderColor = 'var(--info-color)';
       event.currentTarget.style.background = '#f0f8ff';
   }

   confirmReplacement(newWineryId, dayIndex, wineryIndex) {
       const { wineries } = window.wineData;
       const newWinery = wineries.find(w => w.id === newWineryId);
       const oldWinery = this.currentItinerary[dayIndex - 1].wineries[wineryIndex];
       
       // Replace the winery in the itinerary
       this.currentItinerary[dayIndex - 1].wineries[wineryIndex] = newWinery;
       
       // Close modal
       document.querySelector('.replacement-modal').remove();
       
       // Refresh the itinerary display
       this.displayItinerary(this.currentItinerary);
       
       // Update map with new wineries
       const allWineries = this.currentItinerary.flatMap(day => day.wineries);
       this.initializeMap(allWineries);
       
       this.showToast(`Replaced ${oldWinery.name} with ${newWinery.name}! 🔄`);
   }

   // Admin functionality
   initializeAdmin() {
       this.adminData = {
           wineries: window.wineData.wineries.map(w => ({...w, enabled: w.enabled !== false})),
           restaurants: window.wineData.restaurants.map(r => ({...r, enabled: r.enabled !== false})),
           accommodations: window.wineData.accommodations.map(a => ({...a, enabled: a.enabled !== false}))
       };
   }

   displayAdminItems(type) {
       const data = this.adminData[type];
       const container = document.getElementById(`${type}Admin`);
       
       let html = '';
       data.forEach(item => {
           const isEnabled = item.enabled !== false;
           html += `
               <div class="admin-item ${!isEnabled ? 'disabled' : ''}" data-id="${item.id}">
                   <div class="admin-item-info">
                       <div class="admin-item-name">${item.name}</div>
                       <div class="admin-item-details">
                           ${type === 'wineries' ? 
                               `${item.region} • ${item.specialty} • $${item.tastingFee}` :
                           type === 'restaurants' ? 
                               `${item.location} • ${item.cuisine} • ${item.priceLevel}` :
                               `${item.location} • ${item.type} • ${item.priceLevel}`
                           }
                       </div>
                   </div>
                   <label class="admin-toggle">
                       <input type="checkbox" ${isEnabled ? 'checked' : ''} 
                              onchange="app.toggleItemEnabled('${type}', ${item.id}, this.checked)">
                       <span class="admin-slider"></span>
                   </label>
                   <button class="admin-btn-small admin-btn-edit" 
                           onclick="app.editItem('${type}', ${item.id})">
                       Edit
                   </button>
                   <button class="admin-btn-small admin-btn-delete" 
                           onclick="app.deleteItem('${type}', ${item.id})">
                       Delete
                   </button>
               </div>
           `;
       });
       
       container.innerHTML = html;
   }

   toggleItemEnabled(type, id, enabled) {
       const item = this.adminData[type].find(item => item.id === id);
       if (item) {
           item.enabled = enabled;
           this.showToast(`${item.name} ${enabled ? 'enabled' : 'disabled'}`, enabled ? 'success' : 'warning');
       }
   }

   editItem(type, id) {
       const item = this.adminData[type].find(item => item.id === id);
       if (!item) return;

       const modal = document.createElement('div');
       modal.className = 'admin-edit-modal';
       
       const fields = this.getEditFields(type, item);
       
       modal.innerHTML = `
           <div class="admin-edit-content">
               <div class="admin-edit-header">
                   <h3>Edit ${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}</h3>
                   <button class="close-btn" onclick="this.closest('.admin-edit-modal').remove()">×</button>
               </div>
               <div class="admin-edit-body">
                   <form id="adminEditForm" class="admin-form-grid">
                       ${fields}
                   </form>
                   <div class="admin-form-actions">
                       <button class="btn btn-secondary" onclick="this.closest('.admin-edit-modal').remove()">Cancel</button>
                       <button class="btn btn-primary" onclick="app.saveItemEdit('${type}', ${id})">Save Changes</button>
                   </div>
               </div>
           </div>
       `;

       document.body.appendChild(modal);
   }

   getEditFields(type, item) {
       if (type === 'wineries') {
           return `
               <div class="form-group">
                   <label>Name:</label>
                   <input type="text" name="name" value="${item.name}" required>
               </div>
               <div class="admin-form-row">
                   <div class="form-group">
                       <label>Region:</label>
                       <input type="text" name="region" value="${item.region}" required>
                   </div>
                   <div class="form-group">
                       <label>Price Level:</label>
                       <select name="priceLevel" required>
                           <option value="budget" ${item.priceLevel === 'budget' ? 'selected' : ''}>Budget</option>
                           <option value="moderate" ${item.priceLevel === 'moderate' ? 'selected' : ''}>Moderate</option>
                           <option value="premium" ${item.priceLevel === 'premium' ? 'selected' : ''}>Premium</option>
                           <option value="luxury" ${item.priceLevel === 'luxury' ? 'selected' : ''}>Luxury</option>
                       </select>
                   </div>
               </div>
               <div class="form-group">
                   <label>Specialty:</label>
                   <input type="text" name="specialty" value="${item.specialty}" required>
               </div>
               <div class="admin-form-row">
                   <div class="form-group">
                       <label>Tasting Fee:</label>
                       <input type="number" name="tastingFee" value="${item.tastingFee}" required>
                   </div>
                   <div class="form-group">
                       <label>Rating:</label>
                       <input type="number" step="0.1" min="1" max="5" name="rating" value="${item.rating}" required>
                   </div>
               </div>
               <div class="form-group">
                   <label>Hours:</label>
                   <input type="text" name="hours" value="${item.hours}" required>
               </div>
               <div class="form-group">
                   <label>Phone:</label>
                   <input type="text" name="phone" value="${item.phone}" required>
               </div>
               <div class="form-group">
                   <label>Website:</label>
                   <input type="url" name="website" value="${item.website}" required>
               </div>
               <div class="form-group">
                   <label>Description:</label>
                   <textarea name="description" rows="3" required>${item.description}</textarea>
               </div>
           `;
       } else if (type === 'restaurants') {
           return `
               <div class="form-group">
                   <label>Name:</label>
                   <input type="text" name="name" value="${item.name}" required>
               </div>
               <div class="admin-form-row">
                   <div class="form-group">
                       <label>Location:</label>
                       <input type="text" name="location" value="${item.location}" required>
                   </div>
                   <div class="form-group">
                       <label>Cuisine:</label>
                       <input type="text" name="cuisine" value="${item.cuisine}" required>
                   </div>
               </div>
               <div class="admin-form-row">
                   <div class="form-group">
                       <label>Price Level:</label>
                       <select name="priceLevel" required>
                           <option value="budget" ${item.priceLevel === 'budget' ? 'selected' : ''}>Budget</option>
                           <option value="moderate" ${item.priceLevel === 'moderate' ? 'selected' : ''}>Moderate</option>
                           <option value="luxury" ${item.priceLevel === 'luxury' ? 'selected' : ''}>Luxury</option>
                       </select>
                   </div>
                   <div class="form-group">
                       <label>Rating:</label>
                       <input type="number" step="0.1" min="1" max="5" name="rating" value="${item.rating}" required>
                   </div>
               </div>
               <div class="form-group">
                   <label>Phone:</label>
                   <input type="text" name="phone" value="${item.phone}" required>
               </div>
               <div class="form-group">
                   <label>Description:</label>
                   <textarea name="description" rows="3" required>${item.description}</textarea>
               </div>
           `;
       } else { // accommodations
           return `
               <div class="form-group">
                   <label>Name:</label>
                   <input type="text" name="name" value="${item.name}" required>
               </div>
               <div class="admin-form-row">
                   <div class="form-group">
                       <label>Location:</label>
                       <input type="text" name="location" value="${item.location}" required>
                   </div>
                   <div class="form-group">
                       <label>Type:</label>
                       <input type="text" name="type" value="${item.type}" required>
                   </div>
               </div>
               <div class="admin-form-row">
                   <div class="form-group">
                       <label>Price Level:</label>
                       <select name="priceLevel" required>
                           <option value="budget" ${item.priceLevel === 'budget' ? 'selected' : ''}>Budget</option>
                           <option value="moderate" ${item.priceLevel === 'moderate' ? 'selected' : ''}>Moderate</option>
                           <option value="boutique" ${item.priceLevel === 'boutique' ? 'selected' : ''}>Boutique</option>
                           <option value="luxury" ${item.priceLevel === 'luxury' ? 'selected' : ''}>Luxury</option>
                       </select>
                   </div>
                   <div class="form-group">
                       <label>Rating:</label>
                       <input type="number" step="0.1" min="1" max="5" name="rating" value="${item.rating}" required>
                   </div>
               </div>
               <div class="form-group">
                   <label>Description:</label>
                   <textarea name="description" rows="3" required>${item.description}</textarea>
               </div>
           `;
       }
   }

   saveItemEdit(type, id) {
       const form = document.getElementById('adminEditForm');
       const formData = new FormData(form);
       const item = this.adminData[type].find(item => item.id === id);
       
       if (item) {
           // Update item with form data
           for (let [key, value] of formData.entries()) {
               if (key === 'tastingFee' || key === 'rating') {
                   item[key] = parseFloat(value);
               } else {
                   item[key] = value;
               }
           }
           
           document.querySelector('.admin-edit-modal').remove();
           this.displayAdminItems(type);
           this.showToast(`${item.name} updated successfully!`);
       }
   }

   deleteItem(type, id) {
       const item = this.adminData[type].find(item => item.id === id);
       if (item && confirm(`Are you sure you want to delete ${item.name}?`)) {
           const index = this.adminData[type].findIndex(item => item.id === id);
           this.adminData[type].splice(index, 1);
           this.displayAdminItems(type);
           this.showToast(`${item.name} deleted successfully!`, 'warning');
       }
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

// Admin functions
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === 'admin' && password === 'admin') {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        
        // Initialize admin data and display
        app.initializeAdmin();
        app.displayAdminItems('wineries');
        
        app.showToast('Admin login successful!');
    } else {
        app.showToast('Invalid username or password', 'error');
    }
}

function adminLogout() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    app.showToast('Logged out successfully', 'warning');
}

function showAdminTab(tabName) {
    // Update tab active states
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content active states
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
    
    // Display items for the selected tab
    const typeMap = {
        'wineries': 'wineries',
        'restaurants': 'restaurants', 
        'hotels': 'accommodations'
    };
    app.displayAdminItems(typeMap[tabName]);
}

function addNewItem(type) {
    app.showToast('Add new item functionality would be implemented here', 'info');
}

function saveAdminChanges() {
    app.showToast('Changes saved successfully! (In production, this would sync with the database)', 'success');
}