document.addEventListener('DOMContentLoaded', function() {
    // References to DOM elements
    const searchInput = document.getElementById('doctorSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dayFilterButtons = document.querySelectorAll('.day-filter-btn');
    const doctorCards = document.querySelectorAll('.doctor-card');
    const printBtn = document.getElementById('printBtn');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.querySelector('.chatbot-messages');
    
    // Current filter states
    let currentCategoryFilter = 'all';
    let currentDayFilter = 'all';
    
    // Specialty filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentCategoryFilter = this.getAttribute('data-filter');
            applyFilters();
        });
    });
    
    // Day filter functionality
    dayFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            dayFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentDayFilter = this.getAttribute('data-day');
            applyFilters();
        });
    });
    
    // Apply both category and day filters
    function applyFilters() {
        doctorCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const days = card.getAttribute('data-days');
            
            const matchesCategory = currentCategoryFilter === 'all' || category === currentCategoryFilter;
            const matchesDay = currentDayFilter === 'all' || days.includes(currentDayFilter);
            
            if (matchesCategory && matchesDay) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide specialty sections based on visible cards
        updateSectionVisibility();
    }
    
    // Update section visibility based on visible cards
    function updateSectionVisibility() {
        const specialtySections = document.querySelectorAll('.specialty-section');
        specialtySections.forEach(section => {
            const cardsInSection = section.querySelectorAll('.doctor-card');
            let hasVisibleCard = false;
            
            cardsInSection.forEach(card => {
                if (card.style.display !== 'none') {
                    hasVisibleCard = true;
                }
            });
            
            section.style.display = hasVisibleCard ? 'block' : 'none';
        });
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        doctorCards.forEach(card => {
            const doctorName = card.querySelector('h3').textContent.toLowerCase();
            const doctorSpecialty = card.querySelector('.specialty').textContent.toLowerCase();
            const schedule = card.querySelector('.schedule').textContent.toLowerCase();
            
            if (doctorName.includes(searchTerm) || 
                doctorSpecialty.includes(searchTerm) || 
                schedule.includes(searchTerm)) {
                
                // Still respect the current filters
                const category = card.getAttribute('data-category');
                const days = card.getAttribute('data-days');
                
                const matchesCategory = currentCategoryFilter === 'all' || category === currentCategoryFilter;
                const matchesDay = currentDayFilter === 'all' || days.includes(currentDayFilter);
                
                card.style.display = (matchesCategory && matchesDay) ? 'block' : 'none';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateSectionVisibility();
    });
    
    // Print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Chatbot toggle
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('open');
        if (chatbotContainer.classList.contains('open')) {
            chatInput.focus();
        }
    });
    
    // Initialize the chatbot
    const chatbotHeader = document.querySelector('.chatbot-header');
    chatbotHeader.addEventListener('click', function(e) {
        if (e.target !== chatbotToggle && e.target.parentElement !== chatbotToggle) {
            chatbotContainer.classList.toggle('open');
            if (chatbotContainer.classList.contains('open')) {
                chatInput.focus();
            }
        }
    });
    
    // Chatbot send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message and respond with delay to simulate thinking
        setTimeout(() => {
            processChatbotQuery(message);
        }, getRandomThinkingTime());
    }
    
    // Generate random thinking time between 1.5 and 3 seconds
    function getRandomThinkingTime() {
        return Math.floor(Math.random() * 1500) + 1500; // 1.5s to 3s
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        typingIndicator.id = 'typingIndicator';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Map day names to numerical values
    const dayMap = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
    };
    
    // Get the current day of the week
    function getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const date = new Date();
        return days[date.getDay()];
    }
    
    // Get the day name for tomorrow
    function getTomorrowDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const date = new Date();
        let tomorrowIndex = date.getDay() + 1;
        if (tomorrowIndex > 6) tomorrowIndex = 0;
        return days[tomorrowIndex];
    }
    
    // Convert day reference to actual day name
    function resolveDayReference(query) {
        query = query.toLowerCase();
        const today = getCurrentDay();
        const tomorrow = getTomorrowDay();
        
        if (query.includes('today')) {
            return today;
        } else if (query.includes('tomorrow')) {
            return tomorrow;
        } else if (query.includes('monday')) {
            return 'monday';
        } else if (query.includes('tuesday')) {
            return 'tuesday';
        } else if (query.includes('wednesday')) {
            return 'wednesday';
        } else if (query.includes('thursday')) {
            return 'thursday';
        } else if (query.includes('friday')) {
            return 'friday';
        } else if (query.includes('saturday')) {
            return 'saturday';
        } else if (query.includes('sunday')) {
            return 'sunday';
        }
        
        // Default to today if no day is specified
        return today;
    }
    
    // Detect specialty in query
    function detectSpecialty(query) {
        query = query.toLowerCase();
        
        // Define specialty keywords to match
        const specialtyKeywords = {
            'internal': 'internal',
            'internal medicine': 'internal',
            'general': 'general',
            'general medicine': 'general',
            'ent': 'ent',
            'ear': 'ent',
            'nose': 'ent',
            'throat': 'ent',
            'otorhinolaryngology': 'ent',
            'pediatric': 'pediatrics',
            'pediatrician': 'pediatrics',
            'children': 'pediatrics',
            'child': 'pediatrics',
            'kid': 'pediatrics',
            'kids': 'pediatrics',
            'obgyn': 'obgyn',
            'ob': 'obgyn',
            'gyn': 'obgyn',
            'gynecology': 'obgyn',
            'obstetrics': 'obgyn',
            'obstetrician': 'obgyn',
            'gynecologist': 'obgyn',
            'pregnancy': 'obgyn',
            'pregnant': 'obgyn',
            'ultrasound': 'ultrasound',
            'sonolog': 'ultrasound',
            'sonography': 'ultrasound',
            'scan': 'ultrasound',
            'imaging': 'ultrasound',
            'radiology': 'ultrasound'
        };
        
        // Check if any specialty keyword is in the query
        for (const [keyword, specialty] of Object.entries(specialtyKeywords)) {
            if (query.includes(keyword)) {
                return specialty;
            }
        }
        
        return null;
    }
    
    // Add variety to responses with friendly phrases
    function getRandomGreeting() {
        const greetings = [
            "I'd be happy to help you with that!",
            "Let me check that for you.",
            "Great question!",
            "I can certainly help with that.",
            "Thanks for asking! Here's what I found:",
            "I'd be glad to assist with that."
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    function getRandomFollowUp() {
        const followUps = [
            "Is there anything else you'd like to know?",
            "Do you have any other questions about our doctors?",
            "Would you like me to help you with anything else?",
            "Let me know if you need more information!",
            "Feel free to ask if you have other questions.",
            "I'm here if you need more assistance with scheduling."
        ];
        return followUps[Math.floor(Math.random() * followUps.length)];
    }
    
    function humanizeResponse(response) {
        // Don't modify error responses
        if (response.includes("I'm sorry") || response.includes("I couldn't find")) {
            return response;
        }
        
        // Make sure there's a space after any colon followed by text
        response = response.replace(/(\w):(\w)/g, '$1: $2');
        
        // Make sure responses end with appropriate punctuation
        if (!response.endsWith('.') && !response.endsWith('?') && !response.endsWith('!') && 
            !response.endsWith('.<br>') && !response.endsWith('?<br>') && !response.endsWith('!<br>')) {
            // Add period only if doesn't already end with punctuation
            response = response.replace(/([^.!?])$/, '$1.');
            // Also handle lines ending with <br> but no punctuation
            response = response.replace(/([^.!?])<br>/g, '$1.<br>');
        }
        
        // Add greeting and follow-up for most responses
        if (response.length > 20 && !response.includes("Would you like")) {
            return `${getRandomGreeting()} ${response} ${getRandomFollowUp()}`;
        }
        
        return response;
    }
    
    function processChatbotQuery(query) {
        query = query.toLowerCase();
        
        // Hide typing indicator before showing the response
        hideTypingIndicator();
        
        // Create response based on query
        let response = '';
        
        // Check for complex day + specialty queries like "Who's available for pediatrics today?"
        const day = resolveDayReference(query);
        const specialty = detectSpecialty(query);
        
        if (specialty && (query.includes('available') || query.includes('who') || query.includes('which'))) {
            if (day === 'sunday') {
                response = "I'm sorry, but our clinic is closed on Sundays. Would you like to know about doctors available on another day?";
            } else {
                response = getDoctorsForSpecialtyOnDay(specialty, day);
            }
        }
        // Check for day queries
        else if (query.includes('today') || query.includes('tomorrow') || 
                 query.includes('available today') || query.includes('available tomorrow')) {
            
            if (day === 'sunday') {
                response = "I'm sorry, but our clinic is closed on Sundays. Our doctors are available Monday through Saturday though. Would you like to know who's available on Monday?";
            } else {
                response = getDoctorsAvailableOnDay(day);
            }
        }
        else if (query.includes('monday') || query.includes('on monday')) {
            response = getDoctorsAvailableOnDay('monday');
        } 
        else if (query.includes('tuesday') || query.includes('on tuesday')) {
            response = getDoctorsAvailableOnDay('tuesday');
        }
        else if (query.includes('wednesday') || query.includes('on wednesday')) {
            response = getDoctorsAvailableOnDay('wednesday');
        }
        else if (query.includes('thursday') || query.includes('on thursday')) {
            response = getDoctorsAvailableOnDay('thursday');
        }
        else if (query.includes('friday') || query.includes('on friday')) {
            response = getDoctorsAvailableOnDay('friday');
        }
        else if (query.includes('saturday') || query.includes('on saturday')) {
            response = getDoctorsAvailableOnDay('saturday');
        }
        else if (query.includes('sunday') || query.includes('on sunday')) {
            response = "I'm sorry, but our clinic is closed on Sundays. Our doctors are available Monday through Saturday though. Would you like to know who's available on Monday?";
        }
        
        // Check for doctor name queries
        else if (query.includes('dr.') || query.includes('doctor') || 
                 query.match(/when does .* work/) || query.match(/schedule for .*/)) {
            response = getDoctorSchedule(query);
        }
        
        // Check for specialty queries
        else if (query.includes('pediatric') || query.includes('pediatrician') || query.includes('children') || query.includes('child')) {
            response = "Our pediatricians include:<br><br>Dr. Ivy Avilla-Bergunio (Mon, Tue, Wed, Fri, Sat: 10AM-12NN)<br>Dr. Maria Cristina Gorospe-Murallon (Mon, Wed, Fri: 10AM-12NN)<br>Dr. Eireen S. Periodico (Tue, Thu, Sat: 10AM-12NN)<br>Dr. Laurace Stephanie R. Crizaldo (Mon, Tue, Wed: 1PM-3PM, Fri: 10AM-12NN, Sat: 12NN-2PM)";
        }
        else if (query.includes('obgyn') || query.includes('ob') || query.includes('gyn') || query.includes('gynecolog') || query.includes('obstetric')) {
            response = "We have multiple OB-GYN specialists available throughout the week. Would you like me to tell you which ones are available on a specific day? Or is there a particular doctor you're looking for?";
        }
        else if (query.includes('internal medicine')) {
            response = "For Internal Medicine, Dr. Jackie-Lou Lontoc-Endozo is available on Tuesdays from 5:00PM to 7:00PM. Would you like me to check if there's an available slot for your appointment?";
        }
        else if (query.includes('general medicine')) {
            response = "For General Medicine, Dr. Chona P. Marquez is available every weekday (Monday to Friday) from 12:00NN to 2:00PM. She's a great choice for regular check-ups and general health concerns.";
        }
        else if (query.includes('ent') || query.includes('otorhinolaryngology') || query.includes('ear') || query.includes('nose') || query.includes('throat')) {
            response = "Our ENT specialist, Dr. Lloyd Paolo R. Crizaldo, is available on Mondays and Wednesdays from 1:00PM to 2:00PM. He specializes in treating conditions related to the ear, nose, and throat.";
        }
        else if (query.includes('ultrasound') || query.includes('sonolog') || query.includes('scan') || query.includes('imaging')) {
            response = "For ultrasound services, we have:<br><br>Dr. Tomas C. Lim (Wed: 1PM-3PM)<br>Dr. Charleen Joy Beredo-Colada (Mon: 1PM-3PM)<br>Dr. June Jonabelle Gaballdon (Tue & Fri: 4:30PM)<br>Dr. Cristine Gerryfe Santos-Ruiz (Thu & Sat: 11AM-1PM)<br><br>Just a reminder that registration for ultrasound starts at 8:00AM. Would you like me to check if there's availability on a particular day?";
        }
        
        // Check for hour/time queries
        else if (query.includes('morning') || query.includes('am')) {
            response = "In the morning hours, we have several doctors available, particularly pediatricians and OB-GYN specialists. Most of our morning consultations start at 10:00AM. Would you like to know about a specific specialty or day in the morning?";
        }
        else if (query.includes('afternoon') || query.includes('pm')) {
            response = "For afternoon appointments, we have Dr. Lontoc-Endozo (Internal Medicine), several OB-GYN specialists, and our ultrasound services. Is there a particular afternoon slot you're interested in?";
        }
        
        // Help/general queries
        else if (query.includes('help') || query.includes('what can you do')) {
            response = "I'm here to help you with information about our doctors' schedules at ERS Maternity and Pediatric Care Clinic. You can ask me questions like:<br><br>- Who's available for (specialty) today/tomorrow?<br>- Which doctors are available on Monday?<br>- When does Dr. Sierra-Sepacio work?<br>- Tell me about your pediatricians<br>- Are there morning appointments available?<br><br>Feel free to ask in your own words, and I'll do my best to help!";
        }
        else if (query.includes('thank')) {
            response = "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about our clinic or doctor schedules?";
        }
        else if (query.includes('hi') || query.includes('hello')) {
            response = "Hello there! Welcome to ERS Maternity and Pediatric Care Clinic's virtual assistant. How may I help you with your scheduling needs today?";
        }
        else if (query.includes('clinic') || query.includes('hospital') || query.includes('about')) {
            response = "ERS Maternity and Pediatric Care Clinic specializes in women's health and pediatric care. We have specialists in OB-GYN, Pediatrics, Internal Medicine, General Medicine, ENT, and Ultrasound services. Our doctors are available Monday through Saturday with various schedules. How can I help you find the right doctor?";
        }
        
        // Default response
        else {
            response = "I'm not quite sure I understand what you're asking. You can ask me about our doctors, their specialties, or when they're available. For example, you could ask 'Who's available on Monday?' or 'When does Dr. Lontoc work?'";
        }
        
        // Humanize response except for specific types
        if (!query.includes('help') && !query.includes('hi') && !query.includes('hello') && !query.includes('thank')) {
            response = humanizeResponse(response);
        }
        
        // Add bot response
        addMessageToChat(response, 'bot');
    }
    
    // Get doctors for a specific specialty on a specific day
    function getDoctorsForSpecialtyOnDay(specialty, day) {
        let availableDoctors = [];
        
        doctorCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const days = card.getAttribute('data-days');
            const doctorName = card.querySelector('h3').textContent;
            const doctorSpecialty = card.querySelector('.specialty').textContent;
            
            if (cardCategory === specialty && days.includes(day)) {
                // Extract schedule for this day
                const scheduleItems = card.querySelectorAll('.schedule p');
                let schedule = '';
                
                for (let i = 0; i < scheduleItems.length; i += 2) {
                    const dayText = scheduleItems[i].textContent.toLowerCase();
                    
                    if (dayText.includes(day)) {
                        if (i + 1 < scheduleItems.length) {
                            schedule = scheduleItems[i + 1].textContent.replace('far fa-clock', '').trim();
                        }
                        break;
                    }
                }
                
                availableDoctors.push(`${doctorName} - ${schedule}.`);
            }
        });
        
        if (availableDoctors.length === 0) {
            return `I couldn't find any ${getSpecialtyFullName(specialty)} doctors available on ${day.charAt(0).toUpperCase() + day.slice(1)}. Would you like to check another day?`;
        }
        
        const dayLabel = day === getCurrentDay() ? 'today' : (day === getTomorrowDay() ? 'tomorrow' : day);
        return `${getSpecialtyFullName(specialty)} doctors available ${dayLabel}:<br><br>${availableDoctors.join('<br>')}`;
    }
    
    // Get full name of specialty from code
    function getSpecialtyFullName(specialtyCode) {
        const specialtyNames = {
            'internal': 'Internal Medicine',
            'general': 'General Medicine',
            'ent': 'ENT/Otorhinolaryngology',
            'pediatrics': 'Pediatric',
            'obgyn': 'OB-GYN',
            'ultrasound': 'Ultrasound'
        };
        
        return specialtyNames[specialtyCode] || specialtyCode;
    }
    
    function getDoctorsAvailableOnDay(day) {
        let availableDoctors = [];
        
        doctorCards.forEach(card => {
            const days = card.getAttribute('data-days');
            const doctorName = card.querySelector('h3').textContent;
            const specialty = card.querySelector('.specialty').textContent;
            
            if (days.includes(day)) {
                // Extract schedule for this day
                const scheduleItems = card.querySelectorAll('.schedule p');
                let schedule = '';
                
                for (let i = 0; i < scheduleItems.length; i += 2) {
                    const dayText = scheduleItems[i].textContent.toLowerCase();
                    
                    if (dayText.includes(day)) {
                        if (i + 1 < scheduleItems.length) {
                            schedule = scheduleItems[i + 1].textContent.replace('far fa-clock', '').trim();
                        }
                        break;
                    }
                }
                
                availableDoctors.push(`${doctorName} (${specialty}) - ${schedule}.`);
            }
        });
        
        if (availableDoctors.length === 0) {
            return `I couldn't find any doctors available on ${day}. Would you like to check another day?`;
        }
        
        const dayLabel = day === getCurrentDay() ? 'today' : (day === getTomorrowDay() ? 'tomorrow' : day);
        return `Doctors available ${dayLabel}:<br><br>${availableDoctors.join('<br>')}`;
    }
    
    function getDoctorSchedule(query) {
        query = query.toLowerCase();
        let found = false;
        let response = '';
        let bestMatch = null;
        let bestMatchScore = 0;
        
        // Extract potential doctor name from query patterns like "when does X work"
        let potentialName = query;
        if (query.includes('dr.')) {
            potentialName = query.split('dr.')[1].trim();
        } else if (query.includes('doctor')) {
            potentialName = query.split('doctor')[1].trim();
        } else if (query.match(/when does (.*) work/)) {
            potentialName = query.match(/when does (.*) work/)[1].trim();
        } else if (query.match(/schedule for (.*)/)) {
            potentialName = query.match(/schedule for (.*)/)[1].trim();
        }
        
        // Remove common endings that might be in the query
        potentialName = potentialName.replace(/('s|s') schedule/, '')
                                    .replace(/ work\??$/, '')
                                    .replace(/ available\??$/, '')
                                    .replace(/\?/, '')
                                    .trim();
        
        doctorCards.forEach(card => {
            const doctorFullName = card.querySelector('h3').textContent;
            const doctorNameLower = doctorFullName.toLowerCase();
            
            // Try to extract name components for better matching
            let firstName = '';
            let lastName = '';
            let middleName = '';
            
            // Extract name parts, handling hyphenated names
            const nameParts = doctorNameLower.split(' ').map(part => part.replace(/,.*/, '').trim());
            
            if (nameParts.length >= 2) {
                // Assume the first part is the first name
                firstName = nameParts[0];
                
                // Check if the last part contains M.D. or similar and take the part before it
                if (nameParts[nameParts.length - 1].includes('m.d')) {
                    lastName = nameParts[nameParts.length - 2];
                } else {
                    lastName = nameParts[nameParts.length - 1];
                }
                
                // Check for hyphenated last names
                if (lastName.includes('-')) {
                    const hyphenParts = lastName.split('-');
                    // Add the hyphenated parts as individual possible last names
                    nameParts.push(hyphenParts[0]);
                    nameParts.push(hyphenParts[1]);
                }
                
                // If there are more than 2 parts, the middle ones could be middle names
                if (nameParts.length > 2) {
                    for (let i = 1; i < nameParts.length - 1; i++) {
                        if (!nameParts[i].includes('m.d')) {
                            middleName += nameParts[i] + ' ';
                        }
                    }
                    middleName = middleName.trim();
                }
            }
            
            // Calculate match score based on various factors
            let score = 0;
            
            // Exact match gets highest score
            if (doctorNameLower.includes(potentialName)) {
                score += 100;
            }
            
            // Check if query contains parts of the doctor's name
            nameParts.forEach(part => {
                if (potentialName.includes(part) && part.length > 2) {
                    score += 20 * part.length; // Longer matches are more significant
                }
            });
            
            // Additional score for matching first or last name
            if (potentialName.includes(firstName) && firstName.length > 2) {
                score += 30;
            }
            if (potentialName.includes(lastName) && lastName.length > 2) {
                score += 50; // Last name matches are more important
            }
            
            // If the doctor's name contains the query (partial match)
            if (score === 0) {
                nameParts.forEach(part => {
                    if (part.includes(potentialName) && potentialName.length > 2) {
                        score += 10 * potentialName.length;
                    }
                });
            }
            
            // If we have a better match than previous ones
            if (score > bestMatchScore) {
                bestMatchScore = score;
                bestMatch = card;
            }
        });
        
        // If we found a decent match
        if (bestMatch && bestMatchScore > 30) {
            const specialty = bestMatch.querySelector('.specialty').textContent;
            const scheduleItems = bestMatch.querySelectorAll('.schedule p');
            let scheduleText = [];
            const doctorFullName = bestMatch.querySelector('h3').textContent;
            
            for (let i = 0; i < scheduleItems.length; i++) {
                scheduleText.push(scheduleItems[i].textContent.replace('far fa-calendar-alt', '').replace('far fa-clock', '').trim());
            }
            
            response = `${doctorFullName} (${specialty}) is available on:<br><br>`;
            
            for (let i = 0; i < scheduleText.length; i += 2) {
                if (i + 1 < scheduleText.length) {
                    response += `${scheduleText[i]}: ${scheduleText[i + 1]}.<br>`;
                } else {
                    response += `${scheduleText[i]}.<br>`;
                }
            }
            
            found = true;
        }
        
        if (!found) {
            return "I'm sorry, but I couldn't find a doctor matching that name. Could you please check the spelling or provide their full name? You can also ask me about a specialty like 'Who are the pediatricians?'";
        }
        
        return response;
    }
    
    // Add hover effects
    doctorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('.specialty-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            section.style.opacity = 0;
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(section);
        });
    };
    
    // Initialize animations and chatbot
    animateOnScroll();
});
