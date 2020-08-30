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
var typingAttempt = 1;
var typingAttempts = new Array();
var timeScore = null;

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
    "The best way to cheer yourself is to cheer somebody else up.",
    "We have always held to the hope, the belief, the conviction that there is a better life, a better world, beyond the horizon.",
    "The measure of intelligence is the ability to change.",
    "Freedom is the open window through which pours the sunlight of the human spirit and human dignity.",
    "Anything is possible when you have the right people there to support you.",
    "Share your smile with the world. It's a symbol of friendship and peace.",
    "Many people will walk in and out of your life, but only true friends will leave footprints in your heart.",
    "A good friend is like a four-leaf clover: hard to find and lucky to have.",
    "Awards become corroded. Friends gather no dust."
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
    return Math.round(wordCount / secondsCount  * 60);
}
// https://www.linkedin.com/learning/d3-js-essential-training-for-data-scientists/creating-a-linear-axis
function drawLineGraph() {
    var linegraphheight = 220;
    var linegraphwidth = 500;
    var margin = { left: 50, right: 50, top: 40, bottom: 0 };
    var y = d3.scaleLinear()
        .domain([0,200])
        .range([linegraphheight,0]);
    var yAxis = d3.axisLeft(y);
    var area = d3.area()
        .x(function(d,i){ return i*20; })
        .y0(linegraphheight)
        .y1(function(d){ return y(d); });
    var svg = d3.select("#line-graph").append("svg")
        .attr("height","270")
        .attr("width","100%");
    var chartGroup = svg.append("g")
        .attr("transform","translate("+margin.left+","+margin.top+")");
    chartGroup.append("path")
        .attr("stroke","#0D1B2E")
        .attr("stroke-width",2)
        .attr("fill","#0a4392")
        .attr("d",area(wpmScores));
    chartGroup.append("g")
        .attr("class","axis y")
        .call(yAxis);
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
        timeScore = matchScore();
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

    wpmScores.push(timeScore);
    timeScore = null;
    typingAttempts.push(typingAttempt);
    console.log(wpmScores);
    console.log(typingAttempts);
    typingAttempt += 1; // PERSONAL ADD-IN 
    randomOriginText(); // PERSONAL ADD-IN
    var s = d3.select("#line-graph").select("svg");
    s = s.remove();
    drawLineGraph();
}

// Event listeners for keyboard input and the reset
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);
