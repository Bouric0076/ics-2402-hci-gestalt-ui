document.addEventListener('DOMContentLoaded', () => {
    // Gestalt Laws Data with Visual Examples
    const gestaltLaws = {
        'proximity': {
            id: 1,
            title: 'Law of Proximity',
            description: 'Objects that are close to each other tend to be grouped together as a single unit.',
            visual: `
                <div style="display: grid; grid-template-columns: repeat(4, 30px); gap: 10px 40px;">
                    ${Array(16).fill('<div style="width: 30px; height: 30px; background: #2563eb; border-radius: 4px;"></div>').join('')}
                </div>
            `
        },
        'similarity': {
            id: 2,
            title: 'Law of Similarity',
            description: 'Elements that look similar (in color, shape, or size) are perceived as part of the same group.',
            visual: `
                <div style="display: grid; grid-template-columns: repeat(4, 30px); gap: 20px;">
                    ${Array(16).fill(0).map((_, i) => {
                        const isCircle = i % 2 === 0;
                        return `<div style="width: 30px; height: 30px; background: ${isCircle ? '#2563eb' : '#10b981'}; border-radius: ${isCircle ? '50%' : '4px'};"></div>`;
                    }).join('')}
                </div>
            `
        },
        'closure': {
            id: 3,
            title: 'Law of Closure',
            description: 'Our brains tend to fill in missing information to perceive a complete, whole shape or image.',
            visual: `
                <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#2563eb" stroke-width="8" fill="none" stroke-dasharray="20 10" />
                    <path d="M 30 50 L 70 50 M 50 30 L 50 70" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
                </svg>
            `
        },
        'continuity': {
            id: 4,
            title: 'Law of Continuity',
            description: 'The eye is naturally drawn to follow a continuous line or curve, even if it is interrupted.',
            visual: `
                <svg width="200" height="100" viewBox="0 0 200 100">
                    <path d="M 10 80 Q 50 10 100 50 T 190 20" stroke="#2563eb" stroke-width="6" fill="none" stroke-dasharray="15 5" />
                    <circle cx="100" cy="50" r="10" fill="#10b981" />
                </svg>
            `
        },
        'figure-ground': {
            id: 5,
            title: 'Law of Figure-Ground',
            description: 'Our perception tends to separate objects (the figure) from their surrounding background (the ground).',
            visual: `
                <div style="width: 120px; height: 120px; background: #0f172a; border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                    <div style="width: 60px; height: 60px; background: white; transform: rotate(45deg);"></div>
                    <div style="position: absolute; width: 30px; height: 30px; background: #2563eb; top: 0; left: 0;"></div>
                    <div style="position: absolute; width: 30px; height: 30px; background: #2563eb; bottom: 0; right: 0;"></div>
                </div>
            `
        },
        'parallelism': {
            id: 6,
            title: 'Law of Parallelism',
            description: 'Elements that move or point in the same direction are perceived as more related than elements that don\'t.',
            visual: `
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="width: 150px; height: 8px; background: #2563eb; transform: skewX(-30deg); border-radius: 4px;"></div>
                    <div style="width: 150px; height: 8px; background: #2563eb; transform: skewX(-30deg); border-radius: 4px;"></div>
                    <div style="width: 100px; height: 8px; background: #10b981; transform: skewX(30deg); border-radius: 4px; margin-left: 20px;"></div>
                    <div style="width: 150px; height: 8px; background: #2563eb; transform: skewX(-30deg); border-radius: 4px;"></div>
                </div>
            `
        }
    };

    // Session-based progress tracking (no persistence to ensure fresh state)
    let viewedLaws = new Set();
    const totalLaws = Object.keys(gestaltLaws).length;

    // DOM Elements
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));
    const welcomeMessage = document.getElementById('welcome-message');
    const definitionCard = document.getElementById('definition-card');
    const lawTitle = document.getElementById('law-title');
    const lawDescription = document.getElementById('law-description');
    const lawNumber = document.getElementById('law-number');
    const lawVisual = document.getElementById('law-visual');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentageText = document.getElementById('progress-percentage');

    let currentActiveIndex = -1;

    // Function to update the progress bar and percentage
    function updateProgress() {
        const viewedCount = viewedLaws.size;
        const progressPercentage = Math.round((viewedCount / totalLaws) * 100);
        
        // Rapid Feedback: Smoothly update the visual progress bar width
        progressFill.style.width = `${progressPercentage}%`;
        
        // Rapid Feedback: Update the percentage text display
        progressPercentageText.textContent = `${progressPercentage}%`;

        // Incremental Action: Change bar color once 100% is reached
        if (progressPercentage === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            progressPercentageText.style.color = '#10b981';
        } else {
            // Reset to original color if not 100%
            progressFill.style.background = '';
            progressPercentageText.style.color = '';
        }
    }

    // Handles selecting a specific law
    function selectLaw(index) {
        if (index < 0 || index >= menuItems.length) return;
        
        currentActiveIndex = index;
        const item = menuItems[index];
        const lawKey = item.getAttribute('data-law');
        const lawData = gestaltLaws[lawKey];

        if (lawData) {
            // Rapid Feedback 1: Highlight the menu item immediately
            menuItems.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');

            // Rapid Feedback 2: Show the definition card and hide welcome message
            welcomeMessage.classList.add('hidden');
            definitionCard.classList.remove('hidden');
            
            // Re-trigger animation for visual feedback on change
            definitionCard.style.animation = 'none';
            definitionCard.offsetHeight; 
            definitionCard.style.animation = null;

            // Rapid Feedback 3: Update the title, description, and visual illustration
            lawTitle.textContent = lawData.title;
            lawDescription.textContent = lawData.description;
            lawNumber.textContent = lawData.id;
            lawVisual.innerHTML = lawData.visual;

            // Incremental Action: Add to viewed set if it's the first time
            if (!viewedLaws.has(lawKey)) {
                viewedLaws.add(lawKey);
                // Feedback: Update the progress bar only on first view
                updateProgress();
            }
        }
    }

    // Event listeners for menu clicks
    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Rapid feedback on click
            selectLaw(index);
        });
    });

    // Support Keyboard Navigation (Up/Down Arrows)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentActiveIndex + 1) % menuItems.length;
            selectLaw(nextIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentActiveIndex - 1 + menuItems.length) % menuItems.length;
            selectLaw(prevIndex);
        }
    });

    // Initialize with 0% progress on load
    updateProgress();
});
