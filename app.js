// PROJECT ELIAH LOUNGE - JavaScript Application Logic

// DEFAULT DATA
const DEFAULT_TASKS = [
    { id: 1, title: 'Zimmer komplett ausräumen', who: 'both', checked: false },
    { id: 2, title: 'Parkettboden abschleifen', who: 'both', checked: false },
    { id: 3, title: 'Holzboden ölen und trocknen lassen', who: 'both', checked: false },
    { id: 4, title: 'Wände streichen (Farbton abstimmen)', who: 'papa', checked: false },
    { id: 5, title: 'Wohnzimmer-Couch integrieren & reinigen', who: 'both', checked: false },
    { id: 6, title: 'TV- & Lounge-Bereich planen & verkabeln', who: 'eliah', checked: false },
    { id: 7, title: 'Smart-LED Lichtkonzept aufbauen', who: 'both', checked: false },
    { id: 8, title: 'Option: Gaming-Touch hinzufügen', who: 'eliah', checked: false },
    { id: 9, title: 'Option: Getränkekühlschrank einrichten', who: 'eliah', checked: false },
    { id: 10, title: 'Raum final aufbauen und einweihen', who: 'both', checked: false }
];

const DEFAULT_BUDGET = {
    paint: 80,
    floor: 150,
    light: 70,
    drinks: 100,
    ownBudget: 150,
    customItems: []
};

// APP STATE
let state = {
    tasks: [],
    budget: {},
    signatures: {
        eliah: { signed: false, date: null },
        papa: { signed: false, date: null }
    },
    released: false,
    releaseDate: null,
    design: {
        wallPaint: 'none',
        ledOn: false,
        ledHue: 180,
        ledBrightness: 80,
        sliderPos: 50,
        activeImage: 'assets/renders/lounge_render_variant_a.png',
        activeImageType: 'render',
        layout: 'a'
    }
};

// DOM ELEMENTS - CORE
const projectStatusBadge = document.getElementById('project-status-badge');
const budgetSpentEl = document.getElementById('budget-spent');
const budgetLeftEl = document.getElementById('budget-left');
const budgetProgressBar = document.getElementById('budget-progress-bar');
const budgetAlert = document.getElementById('budget-alert');
const tasksPercentEl = document.getElementById('tasks-percent');
const tasksProgressBar = document.getElementById('tasks-progress-bar');
const tasksBody = document.getElementById('tasks-body');

const signCardEliah = document.getElementById('sign-card-eliah');
const signStatusEliah = document.getElementById('sign-status-eliah');
const btnSignEliah = document.getElementById('btn-sign-eliah');

const signCardPapa = document.getElementById('sign-card-papa');
const signStatusPapa = document.getElementById('sign-status-papa');
const btnSignPapa = document.getElementById('btn-sign-papa');

const sealContainer = document.getElementById('seal-container');
const releaseDateEl = document.getElementById('release-date');
const btnReset = document.getElementById('btn-reset');
const signaturesContainer = document.querySelector('.signatures-container');

// DOM ELEMENTS - DESIGN STUDIO
const sliderContainer = document.getElementById('slider-container');
const afterContainer = document.getElementById('after-container');
const sliderHandle = document.getElementById('slider-handle');
const imgBefore = document.querySelector('.img-before');
const imgAfterDay = document.getElementById('img-after-day');
const imgAfterNight = document.getElementById('img-after-night');
const wallPaintOverlay = document.getElementById('wall-paint-overlay');
const ledColorOverlay = document.getElementById('led-color-overlay');

const paintBtns = document.querySelectorAll('.paint-btn');
const layoutBtns = document.querySelectorAll('.layout-btn');
const thumbBtns = document.querySelectorAll('.thumb-btn');

// DOM ELEMENTS - SMART LED CONSOLE
const ledToggle = document.getElementById('led-toggle');
const smartLedPanel = document.getElementById('smart-led-panel');
const ledHueSlider = document.getElementById('led-hue-slider');
const ledBrightnessSlider = document.getElementById('led-brightness-slider');
const ledColorValue = document.getElementById('led-color-value');
const ledBrightnessValue = document.getElementById('led-brightness-value');
const sceneBtns = document.querySelectorAll('.scene-btn');
const btnSceneLoop = document.getElementById('btn-scene-loop');

// DOM ELEMENTS - EXPANDED BUDGET SIMULATOR
const ownBudgetInput = document.getElementById('own-budget');
const totalBudgetLabel = document.getElementById('total-budget-label');
const dynamicCostsList = document.getElementById('dynamic-costs-list');
const btnAddCost = document.getElementById('btn-add-cost');

// RAINBOW LOOP TIMER ID
let rainbowIntervalId = null;

// INITIALIZATION
function init() {
    loadState();
    renderBudget();
    renderCustomBudgetItems();
    renderTasks();
    renderSignatures();
    initDesignStudio();
    setupEventListeners();
    
    if (state.released) {
        checkRelease();
    }
}

// LOCAL STORAGE MANAGEMENT
function saveState() {
    localStorage.setItem('eliah_lounge_state', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('eliah_lounge_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            if (!state.tasks || state.tasks.length === 0) state.tasks = [...DEFAULT_TASKS];
            if (!state.budget) state.budget = {...DEFAULT_BUDGET};
            if (!state.budget.customItems) state.budget.customItems = [];
            if (state.budget.ownBudget === undefined) state.budget.ownBudget = DEFAULT_BUDGET.ownBudget;
            if (!state.design) {
                state.design = {
                    wallPaint: 'none',
                    ledOn: false,
                    ledHue: 180,
                    ledBrightness: 80,
                    sliderPos: 50,
                    activeImage: 'assets/renders/lounge_render_variant_a.png',
                    activeImageType: 'render',
                    layout: 'a'
                };
            }
        } catch (e) {
            console.error('Error parsing state, resetting to defaults.', e);
            resetState();
        }
    } else {
        resetState();
    }
}

function resetState() {
    state.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    state.budget = JSON.parse(JSON.stringify(DEFAULT_BUDGET));
    state.signatures = {
        eliah: { signed: false, date: null },
        papa: { signed: false, date: null }
    };
    state.released = false;
    state.releaseDate = null;
    state.design = {
        wallPaint: 'none',
        ledOn: false,
        ledHue: 180,
        ledBrightness: 80,
        sliderPos: 50,
        activeImage: 'assets/renders/lounge_render_variant_a.png',
        activeImageType: 'render',
        layout: 'a'
    };
    if (rainbowIntervalId) {
        clearInterval(rainbowIntervalId);
        rainbowIntervalId = null;
    }
    saveState();
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Standard Budget Inputs
    const budgetInputs = ['cost-paint', 'cost-floor', 'cost-light', 'cost-drinks'];
    budgetInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const key = id.replace('cost-', '');
            input.value = state.budget[key] || 0;
            
            input.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 0;
                state.budget[key] = val;
                saveState();
                renderBudget();
            });
        }
    });

    // Own Budget Input
    ownBudgetInput.value = state.budget.ownBudget;
    ownBudgetInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        state.budget.ownBudget = val;
        saveState();
        renderBudget();
    });

    // Add Dynamic Cost Item Button
    btnAddCost.addEventListener('click', () => {
        const newItem = {
            id: Date.now(),
            name: 'Neuer Posten',
            cost: 0
        };
        state.budget.customItems.push(newItem);
        saveState();
        renderCustomBudgetItems();
        renderBudget();
    });

    // Signature Buttons
    btnSignEliah.addEventListener('click', () => sign('eliah'));
    btnSignPapa.addEventListener('click', () => sign('papa'));

    // Reset Button
    btnReset.addEventListener('click', () => {
        if (confirm('Möchtest du das Projekt wirklich in den Entwurfsstatus zurücksetzen? Alle Haken und Unterschriften werden gelöscht.')) {
            resetState();
            budgetInputs.forEach(id => {
                const key = id.replace('cost-', '');
                document.getElementById(id).value = state.budget[key];
            });
            ownBudgetInput.value = state.budget.ownBudget;
            init();
        }
    });

    // --- DESIGN STUDIO EVENTS ---
    
    // Slider Drag & Drop
    let isDragging = false;
    
    const startDrag = (e) => {
        if (state.design.activeImageType !== 'render') return;
        isDragging = true;
        drag(e);
    };
    
    const stopDrag = () => {
        isDragging = false;
    };
    
    const drag = (e) => {
        if (!isDragging) return;
        const rect = sliderContainer.getBoundingClientRect();
        let clientX = e.clientX;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
        }
        let x = clientX - rect.left;
        let percent = (x / rect.width) * 100;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        
        state.design.sliderPos = percent;
        updateSliderUI();
        saveState();
    };

    sliderContainer.addEventListener('mousedown', startDrag);
    sliderContainer.addEventListener('touchstart', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    // Wall Paint selection
    paintBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.design.activeImageType !== 'render') return;
            
            paintBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const color = btn.dataset.color;
            state.design.wallPaint = color;
            applyWallPaint(color);
            saveState();
        });
    });

    // Layout selection (Variant A or B)
    layoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.design.activeImageType !== 'render') return;
            
            layoutBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const layout = btn.dataset.layout;
            state.design.layout = layout;
            
            const newImgPath = `assets/renders/lounge_render_variant_${layout}.png`;
            state.design.activeImage = newImgPath;
            
            const renderThumb = document.querySelector('.thumb-btn[data-type="render"]');
            if (renderThumb) {
                renderThumb.dataset.img = newImgPath;
                renderThumb.querySelector('img').src = newImgPath;
            }
            
            switchImageScenario(newImgPath, 'render');
            saveState();
        });
    });

    // Thumbnail Gallery selection
    thumbBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            thumbBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const imgPath = btn.dataset.img;
            const type = btn.dataset.type;
            
            state.design.activeImage = imgPath;
            state.design.activeImageType = type;
            
            switchImageScenario(imgPath, type);
            saveState();
        });
    });

    // --- SMART LED EVENTS ---

    // Master Toggle
    ledToggle.addEventListener('change', (e) => {
        if (state.design.activeImageType !== 'render') return;
        
        const isChecked = e.target.checked;
        state.design.ledOn = isChecked;
        
        if (isChecked) {
            smartLedPanel.classList.remove('disabled');
            applySmartLED();
        } else {
            smartLedPanel.classList.add('disabled');
            disableSmartLED();
            
            if (rainbowIntervalId) {
                clearInterval(rainbowIntervalId);
                rainbowIntervalId = null;
                btnSceneLoop.classList.remove('active');
            }
        }
        saveState();
    });

    // Hue Color Slider
    ledHueSlider.addEventListener('input', (e) => {
        if (state.design.activeImageType !== 'render' || !state.design.ledOn) return;
        
        if (rainbowIntervalId) {
            clearInterval(rainbowIntervalId);
            rainbowIntervalId = null;
            btnSceneLoop.classList.remove('active');
        }
        
        state.design.ledHue = parseInt(e.target.value);
        applySmartLED();
        saveState();
    });

    // Brightness Slider
    ledBrightnessSlider.addEventListener('input', (e) => {
        if (state.design.activeImageType !== 'render' || !state.design.ledOn) return;
        
        state.design.ledBrightness = parseInt(e.target.value);
        applySmartLED();
        saveState();
    });

    // Scene Buttons
    sceneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.design.activeImageType !== 'render' || !state.design.ledOn) return;
            
            if (rainbowIntervalId) {
                clearInterval(rainbowIntervalId);
                rainbowIntervalId = null;
                btnSceneLoop.classList.remove('active');
            }
            
            sceneBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const scene = btn.dataset.scene;
            
            if (scene === 'movie') {
                state.design.ledHue = 220; // Cozy Blue/Indigo
                state.design.ledBrightness = 35; // Dimmed
            } else if (scene === 'gaming') {
                state.design.ledHue = 300; // Neon Violet/Pink
                state.design.ledBrightness = 95; // Bright
            } else if (scene === 'chill') {
                state.design.ledHue = 38; // Warm Golden Amber
                state.design.ledBrightness = 60; // Soft Warm
            }
            
            // Sync DOM inputs
            ledHueSlider.value = state.design.ledHue;
            ledBrightnessSlider.value = state.design.ledBrightness;
            
            applySmartLED();
            saveState();
        });
    });

    // Rainbow Scene Loop
    btnSceneLoop.addEventListener('click', () => {
        if (state.design.activeImageType !== 'render' || !state.design.ledOn) return;
        
        if (rainbowIntervalId) {
            // Stop loop
            clearInterval(rainbowIntervalId);
            rainbowIntervalId = null;
            btnSceneLoop.classList.remove('active');
        } else {
            // Start loop
            sceneBtns.forEach(b => b.classList.remove('active'));
            btnSceneLoop.classList.add('active');
            
            rainbowIntervalId = setInterval(() => {
                state.design.ledHue = (state.design.ledHue + 2) % 360;
                ledHueSlider.value = state.design.ledHue;
                applySmartLED();
            }, 60);
        }
    });

    // --- GIFT BANNER ACCORDION EVENT ---
    const giftHeader = document.getElementById('gift-header');
    const giftBody = document.getElementById('gift-body');
    const giftBanner = document.getElementById('gift-banner');
    const giftArrow = document.getElementById('gift-arrow');
    
    if (giftHeader && giftBody && giftBanner && giftArrow) {
        giftHeader.addEventListener('click', () => {
            const isHidden = giftBody.classList.contains('hide');
            if (isHidden) {
                giftBody.classList.remove('hide');
                giftBanner.classList.add('opened');
                giftArrow.textContent = '▲';
                // Trigger minor confetti blast
                confetti.start();
                setTimeout(() => confetti.stop(), 2500);
            } else {
                giftBody.classList.add('hide');
                giftBanner.classList.remove('opened');
                giftArrow.textContent = '▼';
            }
        });
    }
}

// INITIALIZE DESIGN STUDIO STATE UI
function initDesignStudio() {
    // 1. Setup Slider positions
    updateSliderUI();
    adjustImageWidth();

    // 2. Set Wall Paint
    paintBtns.forEach(btn => {
        if (btn.dataset.color === state.design.wallPaint) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    applyWallPaint(state.design.wallPaint);

    // 3. Set Layout active button
    layoutBtns.forEach(btn => {
        if (btn.dataset.layout === state.design.layout) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 4. Set Image scenario
    thumbBtns.forEach(btn => {
        if (btn.dataset.img === state.design.activeImage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    switchImageScenario(state.design.activeImage, state.design.activeImageType);

    // 5. Initialize Smart LED controls
    ledToggle.checked = state.design.ledOn;
    ledHueSlider.value = state.design.ledHue;
    ledBrightnessSlider.value = state.design.ledBrightness;
    
    if (state.design.ledOn) {
        smartLedPanel.classList.remove('disabled');
        applySmartLED();
    } else {
        smartLedPanel.classList.add('disabled');
        disableSmartLED();
    }
    checkFeatureLocks();
}

// DESIGN STUDIO FUNCTIONS
function updateSliderUI() {
    afterContainer.style.width = state.design.sliderPos + '%';
    sliderHandle.style.left = state.design.sliderPos + '%';
}

function adjustImageWidth() {
    const containerWidth = sliderContainer.offsetWidth;
    if (containerWidth > 0) {
        if (imgAfterDay) imgAfterDay.style.width = containerWidth + 'px';
        if (imgAfterNight) imgAfterNight.style.width = containerWidth + 'px';
    }
}

function applyWallPaint(color) {
    wallPaintOverlay.className = 'overlay-wall-paint'; // reset
    if (color !== 'none') {
        wallPaintOverlay.classList.add(color);
    }
}

// SMART LED CONTROLS
function applySmartLED() {
    // 1. Set CSS properties on slider container
    sliderContainer.style.setProperty('--led-hue', state.design.ledHue);
    sliderContainer.style.setProperty('--led-brightness', state.design.ledBrightness);
    
    // 2. Control day/night image blend and color layer opacity
    const opacity = state.design.ledBrightness / 100;
    if (imgAfterNight) imgAfterNight.style.opacity = opacity;
    if (ledColorOverlay) {
        ledColorOverlay.style.opacity = opacity;
        ledColorOverlay.classList.add('active');
    }
    sliderContainer.classList.add('led-active'); // activate night scene filter
    
    // 3. Update labels text & color
    ledBrightnessValue.textContent = `${state.design.ledBrightness}%`;
    
    // Hue color mapping name
    let colorName = 'Aktiv';
    const h = state.design.ledHue;
    if (h >= 345 || h < 15) { colorName = 'Rot'; ledColorValue.style.color = '#ef4444'; }
    else if (h >= 15 && h < 45) { colorName = 'Orange'; ledColorValue.style.color = '#f97316'; }
    else if (h >= 45 && h < 75) { colorName = 'Gelb'; ledColorValue.style.color = '#eab308'; }
    else if (h >= 75 && h < 155) { colorName = 'Grün'; ledColorValue.style.color = '#22c55e'; }
    else if (h >= 155 && h < 205) { colorName = 'Cyan'; ledColorValue.style.color = '#06b6d4'; }
    else if (h >= 205 && h < 265) { colorName = 'Blau'; ledColorValue.style.color = '#3b82f6'; }
    else if (h >= 265 && h < 315) { colorName = 'Violett'; ledColorValue.style.color = '#a855f7'; }
    else if (h >= 315 && h < 345) { colorName = 'Pink'; ledColorValue.style.color = '#ec4899'; }
    
    ledColorValue.textContent = colorName;
}

function disableSmartLED() {
    if (imgAfterNight) imgAfterNight.style.opacity = 0;
    if (ledColorOverlay) {
        ledColorOverlay.style.opacity = 0;
        ledColorOverlay.classList.remove('active');
    }
    sliderContainer.classList.remove('led-active'); // deactivate night scene filter
    ledColorValue.textContent = 'Aus';
    ledColorValue.style.color = 'var(--text-muted)';
}

function switchImageScenario(imgPath, type) {
    const paintControls = document.querySelector('.paint-selectors');
    const ledContainer = document.querySelector('.led-controls');
    const layoutSelectors = document.querySelector('.layout-selectors');
    
    if (type === 'render') {
        imgBefore.src = 'assets/room/room_empty_1.jpeg';
        
        // Update both day and night foreground images
        imgAfterDay.src = imgPath;
        imgAfterNight.src = imgPath.replace('.png', '_night.png');
        
        sliderHandle.style.display = 'block';
        updateSliderUI();
        
        paintControls.classList.remove('disabled');
        ledContainer.classList.remove('disabled');
        layoutSelectors.classList.remove('disabled');
        
        applyWallPaint(state.design.wallPaint);
        if (state.design.ledOn) {
            applySmartLED();
        }
        
        setTimeout(adjustImageWidth, 50);
    } else {
        // Photo scenario (Original room or Couch photo)
        imgBefore.src = imgPath;
        sliderHandle.style.display = 'none';
        afterContainer.style.width = '0%';
        
        paintControls.classList.add('disabled');
        ledContainer.classList.add('disabled');
        layoutSelectors.classList.add('disabled');
        
        applyWallPaint('none');
        disableSmartLED();
    }
}

// EXPANDED BUDGET CALCULATOR
function renderBudget() {
    const sponsorBudget = 500.00;
    const ownBudget = state.budget.ownBudget || 0;
    const totalBudget = sponsorBudget + ownBudget;
    
    let spent = 0;
    
    // Add default costs
    const budgetInputs = ['paint', 'floor', 'light', 'drinks'];
    budgetInputs.forEach(key => {
        spent += state.budget[key] || 0;
    });

    // Add custom costs
    state.budget.customItems.forEach(item => {
        spent += item.cost || 0;
    });
    
    const left = totalBudget - spent;
    const percent = Math.min((spent / totalBudget) * 100, 100);

    totalBudgetLabel.textContent = totalBudget.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    budgetSpentEl.textContent = spent.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    budgetLeftEl.textContent = left.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

    budgetProgressBar.style.width = `${percent}%`;
    
    if (left < 0) {
        budgetLeftEl.className = 'text-red';
        budgetProgressBar.className = 'progress-bar-fill red-gradient';
        budgetAlert.classList.remove('hide');
    } else {
        budgetLeftEl.className = 'text-green';
        budgetProgressBar.className = 'progress-bar-fill green-gradient';
        budgetAlert.classList.add('hide');
    }
}

function renderCustomBudgetItems() {
    dynamicCostsList.innerHTML = '';
    
    if (state.budget.customItems.length === 0) {
        dynamicCostsList.innerHTML = '<div class="text-center font-size-0.8 text-muted py-2" style="font-size: 0.75rem; text-align: center; color: var(--text-muted);">Keine eigenen Posten vorhanden.</div>';
        return;
    }

    state.budget.customItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'dynamic-cost-row';
        row.innerHTML = `
            <input type="text" value="${item.name}" placeholder="Posten-Name" class="budget-input dynamic-cost-name">
            <input type="number" value="${item.cost}" min="0" step="5" class="budget-input dynamic-cost-value">
            <button type="button" class="btn-delete" title="Löschen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        // Input events for Name
        const nameInput = row.querySelector('.dynamic-cost-name');
        nameInput.addEventListener('input', (e) => {
            item.name = e.target.value;
            saveState();
        });

        // Input events for Cost
        const costInput = row.querySelector('.dynamic-cost-value');
        costInput.addEventListener('input', (e) => {
            item.cost = parseFloat(e.target.value) || 0;
            saveState();
            renderBudget();
        });

        // Delete button event
        const btnDelete = row.querySelector('.btn-delete');
        btnDelete.addEventListener('click', () => {
            state.budget.customItems = state.budget.customItems.filter(i => i.id !== item.id);
            saveState();
            renderCustomBudgetItems();
            renderBudget();
        });

        dynamicCostsList.appendChild(row);
    });
}

// TASKS RENDERING
function renderTasks() {
    tasksBody.innerHTML = '';
    let checkedCount = 0;
    
    state.tasks.forEach(task => {
        if (task.checked) checkedCount++;
        
        const tr = document.createElement('tr');
        if (task.checked) tr.className = 'row-checked';
        
        let whoText = 'Beide';
        let whoClass = 'both';
        if (task.who === 'eliah') {
            whoText = 'Eliah';
            whoClass = 'eliah';
        } else if (task.who === 'papa') {
            whoText = 'Papa';
            whoClass = 'papa';
        }

        tr.innerHTML = `
            <td class="col-check">
                <label class="checkbox-container">
                    <input type="checkbox" ${task.checked ? 'checked' : ''} data-id="${task.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="col-task">
                <span class="task-title">${task.title}</span>
            </td>
            <td class="col-who">
                <span class="assigned-toggle ${whoClass}" data-id="${task.id}">${whoText}</span>
            </td>
        `;

        const checkbox = tr.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            task.checked = e.target.checked;
            saveState();
            renderTasks();
        });

        const whoToggle = tr.querySelector('.assigned-toggle');
        whoToggle.addEventListener('click', () => {
            if (task.who === 'eliah') task.who = 'papa';
            else if (task.who === 'papa') task.who = 'both';
            else task.who = 'eliah';
            
            saveState();
            renderTasks();
        });

        tasksBody.appendChild(tr);
    });

    const totalTasks = state.tasks.length;
    const progressPercent = totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0;
    
    tasksPercentEl.textContent = `${progressPercent}%`;
    tasksProgressBar.style.width = `${progressPercent}%`;
    checkFeatureLocks();
}

// SIGNATURES WORKFLOW
function sign(party) {
    if (state.signatures[party]) {
        state.signatures[party].signed = true;
        const now = new Date();
        const formattedDate = now.toLocaleDateString('de-DE') + ' um ' + now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
        state.signatures[party].date = formattedDate;
        
        saveState();
        renderSignatures();
        checkRelease();
    }
}

function renderSignatures() {
    if (state.signatures.eliah.signed) {
        signCardEliah.classList.add('signed');
        signStatusEliah.textContent = `Signiert am: ${state.signatures.eliah.date}`;
        btnSignEliah.disabled = true;
        btnSignEliah.textContent = 'Projekt freigegeben ✓';
    } else {
        signCardEliah.classList.remove('signed');
        signStatusEliah.textContent = 'Ausstehend';
        btnSignEliah.disabled = false;
        btnSignEliah.textContent = 'Projekt freigegeben';
    }

    if (state.signatures.papa.signed) {
        signCardPapa.classList.add('signed');
        signStatusPapa.textContent = `Signiert am: ${state.signatures.papa.date}`;
        btnSignPapa.disabled = true;
        btnSignPapa.textContent = 'Finanzierung freigegeben ✓';
    } else {
        signCardPapa.classList.remove('signed');
        signStatusPapa.textContent = 'Ausstehend';
        btnSignPapa.disabled = false;
        btnSignPapa.textContent = 'Finanzierung freigegeben';
    }
}

function checkRelease() {
    if (state.signatures.eliah.signed && state.signatures.papa.signed) {
        if (!state.released) {
            state.released = true;
            const now = new Date();
            state.releaseDate = now.toLocaleDateString('de-DE') + ' - ' + now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
            saveState();
            triggerReleaseUI(true);
        } else {
            triggerReleaseUI(false);
        }
    } else {
        sealContainer.classList.add('hide');
        signaturesContainer.classList.remove('hide');
        projectStatusBadge.className = 'badge badge-planning';
        projectStatusBadge.innerHTML = '<span class="pulse-dot"></span> In Planung';
    }
}

function triggerReleaseUI(justNow) {
    sealContainer.classList.remove('hide');
    signaturesContainer.classList.add('hide');
    releaseDateEl.textContent = `Freigegeben am: ${state.releaseDate}`;
    
    projectStatusBadge.className = 'badge badge-active';
    projectStatusBadge.innerHTML = '<span class="pulse-dot"></span> PROJEKT AKTIV';
    
    if (justNow) {
        confetti.start();
        setTimeout(() => confetti.stop(), 5000);
    }
}

// NATIVE CANVAS CONFETTI SYSTEM
const confetti = {
    maxCount: 150,
    speed: 2,
    frameInterval: 15,
    colors: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#a855f7'],
    active: false,
    particles: [],
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    animationId: null,

    init: function() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize(), true);
    },

    resize: function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    randomRange: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    createParticle: function() {
        return {
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            x: Math.random() * this.width,
            y: Math.random() * this.height - this.height,
            r: this.randomRange(4, 10),
            d: Math.random() * this.maxCount,
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        };
    },

    start: function() {
        if (!this.canvas) this.init();
        
        this.active = true;
        this.particles = [];
        for (let i = 0; i < this.maxCount; i++) {
            this.particles.push(this.createParticle());
        }
        
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.run();
    },

    stop: function() {
        this.active = false;
    },

    run: function() {
        if (!this.active && this.particles.length === 0) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.animationId = null;
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2 * this.speed;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

            if (p.y > this.height || p.x > this.width + 10 || p.x < -10) {
                if (this.active) {
                    this.particles[i] = this.createParticle();
                } else {
                    this.particles.splice(i, 1);
                    continue;
                }
            }

            this.ctx.beginPath();
            this.ctx.lineWidth = p.r;
            this.ctx.strokeStyle = p.color;
            this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            this.ctx.stroke();
        }

        this.animationId = requestAnimationFrame(() => this.run());
    }
};

function checkFeatureLocks() {
    const task1 = state.tasks.find(t => t.id === 1);
    const task2 = state.tasks.find(t => t.id === 2);
    
    const task1Checked = task1 ? task1.checked : false;
    const task2Checked = task2 ? task2.checked : false;
    
    const isUnlocked = task1Checked && task2Checked;
    
    const lockPaint = document.getElementById('lock-paint');
    const lockLED = document.getElementById('lock-led');
    
    if (isUnlocked) {
        if (lockPaint) lockPaint.classList.add('hide');
        if (lockLED) lockLED.classList.add('hide');
    } else {
        if (lockPaint) lockPaint.classList.remove('hide');
        if (lockLED) lockLED.classList.remove('hide');
        
        // Auto-disable active designs if it gets locked
        if (state.design.ledOn) {
            state.design.ledOn = false;
            const ledToggle = document.getElementById('led-toggle');
            if (ledToggle) ledToggle.checked = false;
            disableSmartLED();
            const smartLedPanel = document.getElementById('smart-led-panel');
            if (smartLedPanel) smartLedPanel.classList.add('disabled');
            saveState();
        }
        if (state.design.wallPaint !== 'none') {
            state.design.wallPaint = 'none';
            applyWallPaint('none');
            paintBtns.forEach(btn => {
                if (btn.dataset.color === 'none') btn.classList.add('active');
                else btn.classList.remove('active');
            });
            saveState();
        }
    }
}

// RUN APP ON PAGE LOAD
window.addEventListener('DOMContentLoaded', () => {
    init();
});
