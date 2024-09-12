let wpm = 0;
const wpmElement = document.getElementById('score');
const RANDOM_QUOTE_API_URL = 'https://api.adviceslip.com/advice'; // New API for advice quotes
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
let startTime;
let timerStarted = false;

function updateWPM() {
  const elapsedTime = getTimerTime() / 60;  // Convert seconds to minutes
  
  if (elapsedTime === 0) {
    wpm = 0;
  } else {
    wpm = Math.floor((quoteInputElement.value.length / 5) / elapsedTime);
  }
  
  wpmElement.innerText = "WPM: " + wpm;
}

async function getRandomQuote() {
  try {
    const response = await fetch(RANDOM_QUOTE_API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }
    const data = await response.json();
    console.log("Quote fetched:", data.slip.advice); // Log the fetched advice
    return data.slip.advice; // Use the 'advice' field from the new API
  } catch (error) {
    console.error("Error fetching quote: ", error);
    
    // Fallback quote in case the API fails
    return "This is a fallback quote because the API failed to load a new quote.";
  }
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

let timerInterval;
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerElement.innerText = 0;
  startTime = new Date();
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function displayFinalWPM(wpm) {
  const finalWPMDiv = document.createElement('div');
  finalWPMDiv.id = 'finalWPM';
  finalWPMDiv.innerText = 'Your typing speed is ' + wpm + ' WPM!';
  document.body.appendChild(finalWPMDiv);
  
  setTimeout(() => {
    document.body.removeChild(finalWPMDiv);
  }, 3000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

quoteInputElement.addEventListener('input', () => {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  updateWPM();

  if (correct && quoteInputElement.value.length === arrayQuote.length) {
    clearInterval(timerInterval);  
    displayFinalWPM(wpm);
    renderNewQuote();
    timerStarted = false;
  }
});

renderNewQuote();
