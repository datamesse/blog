const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var timer = [0,0,0,0];
var interval;
var timerRunning = false;

// PERSONAL ADD-IN
var originText = null;
var wpmScores = new Array();

// PERSONAL ADD-IN
const typingPhrases = [
    "There is nothing more deceptive than an obvious fact.",
    "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
    "It is a capital mistake to theorise before one has data.",
    "When you have excluded the impossible, whatever remains, however improbable, must be the truth.",
    "Appear weak when you are strong, and strong when you are weak.",
    "The supreme art of war is to subdue the enemy without fighting.",
    "The best military policy is to attack strategies; the next to attack alliances; the next to attack soldiers.",
    "Nothing is more difficult, and therefore more precious, than to be able to decide.",
    "A leader is a dealer in hope.",
    "The reason most people fail instead of succeed is they trade what they want most for what they want at the moment.",
    "Those who are free from common prejudices acquire others.",
    "If you can't explain it to a six year old, you don't understand it yourself.",
    "Never memorize something that you can look up.",
    "A clever person solves a problem. A wise person avoids it.",
    "You never fail until you stop trying.",
    "The world is a dangerous place to live, not because of the people who are evil, but because of the people who don't do anything about it.",
    "The best way to cheer yourself is to cheer somebody else up."
];

// PERSONAL ADD-IN
testArea.value = "";
function randomOriginText() {
    let randomPhrase = Math.floor(Math.random() * typingPhrases.length);
    document.querySelector("#origin-text p").innerHTML = typingPhrases[randomPhrase];
    originText = document.querySelector("#origin-text p").innerHTML;
}
randomOriginText();
// countWords from: https://www.mediacollege.com/internet/javascript/text/count-words.html
function countWords(){
	s = originText;
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
    s = s.split(' ').length;
    return s
}
function matchScore(){
    let secondsCount = (timer[0] * 60) + timer[1] + (timer[2] * (.01) );
    let wordCount = countWords();
    let wordsPerMinute = Math.round(wordCount / secondsCount  * 60);
    wpmScores.push(wordsPerMinute);
    console.log(wpmScores);    
}


// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0,textEntered.length);

    if (textEntered == originText) {
        clearInterval(interval);
        testWrapper.style.borderColor = "#0fee08"; // turn border green
        matchScore();
    } else {
        if (textEntered == originTextMatch) {
            testWrapper.style.borderColor = "#65CCf3"; // turn border blue
        } else {
            testWrapper.style.borderColor = "#f51b05"; // turn border red
        }
    }

}

// Start the timer:
function start() {
    let textEnterdLength = testArea.value.length;
    if (textEnterdLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
    // console.log(textEnterdLength);
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    timerRunning = false;

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
    randomOriginText(); // PERSONAL ADD-IN
}

// Event listeners for keyboard input and the reset
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);
