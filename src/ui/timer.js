let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let currentTimerId = "timer";

export function updateTimerDisplay(){

    const timerElement =
        document.querySelector(`#${currentTimerId}`);

    if(!timerElement)
        return;

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timerElement.textContent = `Time: ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

export function startTimer(id="timer"){
    currentTimerId = id;

    if(isRunning)
        return;

    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(()=>{
        elapsedTime = Date.now() - startTime;
        updateTimerDisplay();
    },100);
}

export function stopTimer(){

    clearInterval(timerInterval);
    isRunning = false;
}

export function resetTimer(id="timer"){
    
    currentTimerId = id;
    stopTimer();
    elapsedTime = 0;
    updateTimerDisplay();
}

export function getTimerState() {

    return isRunning;
}

export function getElapsedTime(){

    return elapsedTime;

}