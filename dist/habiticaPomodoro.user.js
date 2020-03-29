// ==UserScript== 
// @name        habiticaPomodoro 
// @version     1.0.0 
// @description Creates a timer on a pomodoro task 
// @include     http*://habitica.com* 
// @run-at 	    document-idle 
// @author      Marcelo 'Mark' Kopmann 
// ==/UserScript== 

(function () {
    'use strict';

    /**
     * Logs a message and objects passed as arguments
     */
    function logs() {
        const [message, ...details] = [...arguments];
        const warning = details.reduce((parsedObject, object) => ({ ...parsedObject, ...object }), {});
        console.warn({ message, ...warning });
    }

    /**
     * Wait for the existance of a value
     * @param { function } getValueFunction function that returns the value
     * @param { number } time wait time before trying again
     * @param { number } maxTries max tries before stop waiting
     * @returns { Promise }
     */
    function waitForExistance(getValueFunction, time = 200, maxTries = 10) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            let interval = setInterval(() => {
                const value = getValueFunction();
                if (!value) {
                    tries += 1;
                    return
                }

                if (tries >= maxTries) {
                    logs(`No value was found after ${tries} tries`, { getValueFunction });
                    clearInterval(interval);
                    return reject(null)
                }

                clearInterval(interval);
                return resolve(value)
            }, time);
        })
    }

    const settings = {
        workTime: 25,
        breakTime: 5,
        noSounds: false,
        playSvg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M4 3.532l14.113 8.468-14.113 8.468v-16.936zm-2-3.532v24l20-12-20-12z"/></svg>',
        stopSvg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z"/></svg>',
        pauseSvg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M18 2v20h-2v-20h2zm-10 0v20h-2v-20h2zm12-2h-6v24h6v-24zm-10 0h-6v24h6v-24z"/></svg>',
    };

    /**
     * @typedef CustomTimes
     * @param { Number } workTime
     * @param { Number } breakTime
     */

    /**
     * Get work and break times from a text string
     * @param { String } text
     * @returns { CustomTimes }
     */
    const parseNotes = text => {
        text = text.replace(/\:[0-9]*/g, '');
        const [workTime, breakTime] = Array.from(text.match(/\d{1,2}/g) || []).map(Number);
        if (workTime && breakTime) {
            return { workTime, breakTime }
        }
        return null
    };

    /**
     * Get custom times from task notes
     * @returns { CustomTimes }
     */
    const getTimesFromTaskNotes = () => {
        const taskNotes = document.querySelector('.pomodoro-task .task-notes') || {};
        const text = taskNotes.innerText || '';
        return parseNotes(text)
    };

    /**
     * Update settings with custom times
     */
    const updateCustomTimes = () => {
        const customTimes = getTimesFromTaskNotes();
        if (customTimes) {
            settings.workTime = customTimes.workTime;
            settings.breakTime = customTimes.breakTime;
        }
    };

    /**
     * Plays a sound
     * Habitica Sounds Names:
     * 'Achievement_Unlocked','Chat','Daily','Death',
     * 'Item_Drop','Level_Up','Minus_Habit','Plus_Habit',
     * 'Reward','Todo'
     * @param { String } sound name
     */
    const playSound = sound => {
        const { noSounds } = settings;
        if (noSounds) {
            return
        }

        let audioPlayer = document.querySelector('#player');
        if (!audioPlayer) {
            audioPlayer = document.createElement('audio');
            audioPlayer.id = 'player';
        }
        audioPlayer.src = `https://habitica.com/static/audio/danielTheBard/${sound}.ogg`;
        audioPlayer.play();
    };

    const { playSvg, pauseSvg } = settings;
    const minuteInSeconds = 60;
    let seconds = 0;
    let isPaused = true;
    let isResting = false;
    let interval = null;
    let clock = 0;

    const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];

    /**
     * When the left side (Play/Pause) is clicked
     */
    const onLeftControlClick = () => {
        const { breakTime, workTime } = settings;
        const initialTime = isResting ? breakTime : workTime;
        const hasStarted = seconds !== initialTime * minuteInSeconds;
        const hasEnded = seconds <= 0;

        if (!hasStarted || hasEnded) {
            startTimer();
        } else {
            togglePaused();
        }
    };

    /**
     * When the right side (Stop) is clicked
     */
    const onRightControlClick = () => {
        updateCustomTimes();
        isResting = false;
        resetTimer();
    };

    /**
     * A high order function to return the function that runs
     * on every interval's tick
     * @returns { Function }
     */
    const tickOneSecond = () => {
        const taskTitle = document.querySelector('.pomodoro-task .task-title');
        return () => {
            if (isPaused) {
                return
            }
            seconds--;
            const minutes = Math.floor(seconds / 60);
            const secondsToShow = Math.trunc(seconds % 60);
            const isOneDigit = String(secondsToShow).length === 1;
            const zeroDigit = isOneDigit ? '0' : '';
            const extraText = isResting ? 'Descansando...' : 'Colhendo um pomoro';

            taskTitle.innerText = `${clocks[clock]} ${minutes}:${zeroDigit}${secondsToShow} - ${extraText}`;

            const isLastClock = clock === clocks.length - 1;
            if (isLastClock) {
                clock = 0;
            } else {
                clock++;
            }

            const hasEnded = seconds < 0;
            if (hasEnded) {
                if (!isResting) {
                    playSound('Todo');
                    isResting = true;
                    resetTimer();
                    startTimer();
                } else {
                    playSound('Chat');
                    isResting = false;
                    window.scoreGoodHabit();
                    resetTimer();
                }
            }
        }
    };

    /**
     * Start timer
     */
    const startTimer = () => {
        const { breakTime, workTime } = settings;
        const initialTime = isResting ? breakTime : workTime;
        seconds = initialTime * minuteInSeconds;
        const leftControl = document.querySelector('.pomodoro-task .left-control');
        leftControl.innerHTML = pauseSvg;
        isPaused = false;
        tickOneSecond()();
        interval = setInterval(tickOneSecond(), 1000);
    };

    /**
     * Changes between paused and running
     */
    const togglePaused = () => {
        isPaused = !isPaused;
        const leftControl = document.querySelector('.pomodoro-task .left-control');
        leftControl.innerHTML = isPaused ? playSvg : pauseSvg;
    };

    /**
     * Resets timer
     */
    const resetTimer = () => {
        const { breakTime, workTime } = settings;
        isPaused = true;

        const leftControl = document.querySelector('.pomodoro-task .left-control');
        leftControl.innerHTML = playSvg;
        const taskTitle = document.querySelector('.pomodoro-task .task-title');

        const time = isResting ? breakTime : workTime;
        taskTitle.innerText = `🕐 ${time}:00`;
        seconds = time * minuteInSeconds;

        clearInterval(interval);
    };

    const { playSvg: playSvg$1, stopSvg } = settings;

    /**
     * Get task with title #pomodoro
     * @returns { HTMLDivElement } habit task
     */
    function getPomodoroTask() {
        const habitTasks = Array.from(document.querySelectorAll('.task.type_habit'));
        const pomodoroTask = habitTasks.find(task => {
            const title = task.querySelector('p');
            const text = title.innerHTML;
            const hasPomodoroTitle = text === '#pomodoro';
            return hasPomodoroTitle
        });
        return pomodoroTask
    }

    /**
     * Clicks and counts the given Pomodoro Task as a good habit
     * @returns { Boolean } true if extract to window is successfull
     */
    function extractClick(pomodoroTask) {
        const plusSign = pomodoroTask.querySelector('.left-control .task-control');

        if (!plusSign) return null

        const click = plusSign.click;
        const isClickFunction = typeof click === 'function';

        if (!isClickFunction) return null

        return () => plusSign.click()
    }

    /**
     * Convert task to timer
     * @param { HTMLElement } task
     * @returns { HTMLElement }
     */
    const convertTask = task => {
        task.classList.add('pomodoro-task');
        updateCustomTimes();
        window.scoreGoodHabit = extractClick(task);

        const style =
            'background-color: gray !important; cursor: pointer; transition-duration: .15s; transition-property: border-color,background,color; transition - timing - function: ease-in;';

        const leftControl = task.querySelector('.left-control');
        leftControl.innerHTML = playSvg$1;
        leftControl.setAttribute('style', style);
        leftControl.onclick = onLeftControlClick;

        const rightControl = task.querySelector('.right-control');
        rightControl.innerHTML = stopSvg;
        rightControl.setAttribute('style', style);
        rightControl.onclick = onRightControlClick;

        const taskTitle = task.querySelector('.task-title');
        const { workTime } = settings;
        taskTitle.innerText = `🕐 ${workTime}:00`;

        return task
    };

    /**
     * Execute this script
     */
    async function main() {
        try {
            logs('Starting habiticaPomodoro script');
            const pomodoroTask = await waitForExistance(getPomodoroTask);
            convertTask(pomodoroTask);
        } catch (error) {
            logs('Error on habiticaPomodoro.user.js', { error });
        }
    }
    main();

}());
