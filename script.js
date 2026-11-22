/**
 * Interactive recipe filters and session-only cooking timer.
 */
(function () {
    'use strict';

    const filters = document.querySelector('.filters');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const recipes = document.querySelectorAll('[data-category]');
    const filterStatus = document.querySelector('[data-filter-status]');
    const featuredRecipeLink = document.querySelector('[data-show-recipe]');
    const featuredRecipe = document.querySelector('#receta-semanal');
    const timer = document.querySelector('[data-timer]');
    const minutesInput = document.querySelector('#timer-minutes');
    const display = document.querySelector('[data-timer-display]');
    const startButton = document.querySelector('[data-timer-start]');
    const pauseButton = document.querySelector('[data-timer-pause]');
    const resetButton = document.querySelector('[data-timer-reset]');
    const timerStatus = document.querySelector('[data-timer-status]');

    if (!filters || !filterStatus || !featuredRecipeLink || !featuredRecipe ||
        !timer || !minutesInput || !display || !startButton || !pauseButton ||
        !resetButton || !timerStatus || !filterButtons.length || !recipes.length) {
        console.error('Premium controls could not be initialized: required elements are missing.');
        return;
    }

    function selectFilter(category) {
        let visibleCount = 0;

        recipes.forEach(function (recipe) {
            const visible = category === 'todas' || recipe.dataset.category === category;
            recipe.hidden = !visible;
            visibleCount += Number(visible);
        });

        filterButtons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.filter === category));
        });

        filterStatus.textContent = visibleCount === 1
            ? '1 receta disponible.'
            : `${visibleCount} recetas disponibles.`;
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            selectFilter(button.dataset.filter);
        });
    });

    featuredRecipeLink.addEventListener('click', function () {
        selectFilter('todas');
        const details = featuredRecipe.querySelector('details');
        if (details) {
            details.open = true;
        }
    });

    filters.hidden = false;

    let remainingSeconds = Number(minutesInput.value) * 60;
    let deadline = 0;
    let intervalId = null;
    let paused = false;

    function renderTime() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const minuteLabel = minutes === 1 ? 'minuto' : 'minutos';
        const secondLabel = seconds === 1 ? 'segundo' : 'segundos';
        display.setAttribute('aria-label', `Tiempo restante: ${minutes} ${minuteLabel} y ${seconds} ${secondLabel}`);
    }

    function clearTimer() {
        if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    }

    function updateTimer() {
        remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        renderTime();

        if (remainingSeconds === 0) {
            clearTimer();
            paused = false;
            minutesInput.disabled = false;
            startButton.disabled = false;
            startButton.textContent = 'Iniciar';
            pauseButton.disabled = true;
            timerStatus.textContent = 'Tiempo terminado.';
        }
    }

    function validMinutes() {
        return minutesInput.validity.valid && minutesInput.value !== '';
    }

    minutesInput.addEventListener('input', function () {
        timerStatus.textContent = '';
        if (validMinutes()) {
            remainingSeconds = Number(minutesInput.value) * 60;
            renderTime();
        } else {
            display.textContent = '--:--';
            display.setAttribute('aria-label', 'Tiempo no válido');
        }
    });

    startButton.addEventListener('click', function () {
        if (!validMinutes()) {
            timerStatus.textContent = 'Ingresa un número entero entre 1 y 180 minutos.';
            minutesInput.focus();
            return;
        }

        if (!paused) {
            remainingSeconds = Number(minutesInput.value) * 60;
        }
        paused = false;
        deadline = Date.now() + remainingSeconds * 1000;
        minutesInput.disabled = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
        timerStatus.textContent = 'Temporizador en marcha.';
        renderTime();
        intervalId = window.setInterval(updateTimer, 250);
    });

    pauseButton.addEventListener('click', function () {
        updateTimer();
        if (remainingSeconds === 0) {
            return;
        }
        clearTimer();
        paused = true;
        startButton.disabled = false;
        startButton.textContent = 'Continuar';
        pauseButton.disabled = true;
        timerStatus.textContent = 'Temporizador pausado.';
    });

    resetButton.addEventListener('click', function () {
        clearTimer();
        paused = false;
        minutesInput.disabled = false;
        startButton.disabled = false;
        startButton.textContent = 'Iniciar';
        pauseButton.disabled = true;
        if (validMinutes()) {
            remainingSeconds = Number(minutesInput.value) * 60;
            renderTime();
            timerStatus.textContent = 'Temporizador reiniciado.';
        } else {
            display.textContent = '--:--';
            display.setAttribute('aria-label', 'Tiempo no válido');
            timerStatus.textContent = 'Ingresa un número entero entre 1 y 180 minutos.';
        }
    });

    renderTime();
    timer.hidden = false;
}());
