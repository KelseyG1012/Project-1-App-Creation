const episodesUrl = 'https://api.tvmaze.com/shows/431/episodes';
const castUrl = 'https://api.tvmaze.com/shows/431/cast';  // Cast API URL

let score = 0;
let questionsAsked = []; // To track the questions that have been asked
const maxQuestions = 20; // Limit the game to 20 questions

// Function to fetch Friends episodes from the API
async function fetchFriendsEpisodes() {
  try {
    const response = await fetch(episodesUrl);
    const episodes = await response.json();
    return episodes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

// Function to fetch Friends cast from the API
async function fetchFriendsCast() {
  try {
    const response = await fetch(castUrl);
    const cast = await response.json();
    return cast;
  } catch (error) {
    console.error("Error fetching cast information:", error);
  }
}

// Utility function to shuffle an array (to randomize multiple-choice answers)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to generate trivia questions based on episodes or cast data
function generateTriviaQuestion(episode, episodes, cast) {
  const questionType = Math.floor(Math.random() * 5); // Randomly choose between episode and cast questions
  let questionText = '';
  let correctAnswer = '';
  let incorrectAnswers = [];

  if (questionType < 3) {
    // Episode-based question
    switch (questionType) {
      case 0:
        questionText = `Guess the title of this episode from the description: \n\n ${episode.summary.replace(/<\?p>/g, "")}`;
        correctAnswer = episode.name;
        incorrectAnswers = episodes.filter(e => e.id !== episode.id).map(e => e.name).slice(0, 3);
        break;
      case 1:
        questionText = `Which season does this episode belong to: "${episode.name}"?`;
        correctAnswer = episode.season.toString();
        incorrectAnswers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(s => s !== episode.season).map(s => s.toString()).slice(0, 3);
        break;
      case 2:
        questionText = `What was the air date of the episode: "${episode.name}"?`;
        correctAnswer = episode.airdate;
        incorrectAnswers = episodes.filter(e => e.id !== episode.id).map(e => e.airdate).slice(0, 3);
        break;
    }
  } else {
    // Cast-based question
    const randomCast = cast[Math.floor(Math.random() * cast.length)];
    const randomActor = randomCast.person.name;
    const randomCharacter = randomCast.character.name;

    if (questionType === 3) {
      questionText = `Who plays the character "${randomCharacter}"?`;
      correctAnswer = randomActor;
      incorrectAnswers = cast.filter(c => c.character.name !== randomCharacter).map(c => c.person.name).slice(0, 3);
    } else if (questionType === 4) {
      questionText = `Which character is played by the actor "${randomActor}"?`;
      correctAnswer = randomCharacter;
      incorrectAnswers = cast.filter(c => c.person.name !== randomActor).map(c => c.character.name).slice(0, 3);
    }
  }

  const choices = shuffleArray([correctAnswer, ...incorrectAnswers]);
  return { questionText, correctAnswer, choices };
}

// Function to display the trivia question
function displayTriviaQuestion(episode, episodes, cast) {
  const { questionText, correctAnswer, choices } = generateTriviaQuestion(episode, episodes, cast);

  document.getElementById('questionText').textContent = questionText;
  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = ''; // Clear previous choices

  choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.onclick = () => checkAnswer(choice, correctAnswer); // Check guess on click
    choicesContainer.appendChild(button);
  });

  // Hide the "Next Question" button until the user answers
  document.getElementById('nextQuestionButton').style.display = 'none';
}

// Function to check the user's answer
function checkAnswer(selectedAnswer, correctAnswer) {
  const resultText = document.getElementById('resultText');
  if (selectedAnswer === correctAnswer) {
    resultText.textContent = "Correct! Well done.";
    resultText.style.color = "green";
    score += 1;
  } else {
    resultText.textContent = `Wrong! The correct answer was "${correctAnswer}".`;
    resultText.style.color = "red";
  }

  document.getElementById('scoreText').textContent = `Score: ${score}`;

  // Show the "Next Question" button after answering
  document.getElementById('nextQuestionButton').style.display = 'block';
}

// Function to load a new question
function loadNewQuestion(episodes, cast) {
  // Check if the max question limit is reached
  if (questionsAsked.length >= maxQuestions) {
    endGame();
    return;
  }

  // Clear the previous result
  document.getElementById('resultText').textContent = '';

  let nextEpisode;

  // Ensure no repeated questions
  do {
    nextEpisode = getRandomEpisode(episodes);
  } while (questionsAsked.includes(nextEpisode.id));

  // Mark the question as asked
  questionsAsked.push(nextEpisode.id);

  // Display the new question
  displayTriviaQuestion(nextEpisode, episodes, cast);
}

// Function to get a random episode
function getRandomEpisode(episodes) {
  const randomIndex = Math.floor(Math.random() * episodes.length);
  return episodes[randomIndex];
}

// Function to end the game after 20 questions
function endGame() {
  document.getElementById('questionText').textContent = `Game Over! Your final score is ${score}.`;
  document.getElementById('choices').innerHTML = ''; // Clear choices
  document.getElementById('nextQuestionButton').style.display = 'none'; // Hide next question button
}

// Function to start the trivia game
async function startTriviaGame() {
  const episodes = await fetchFriendsEpisodes(); // Fetch episodes from the API
  const cast = await fetchFriendsCast(); // Fetch cast information from the API

  if (episodes && cast && episodes.length > 0 && cast.length > 0) {
    const episode = getRandomEpisode(episodes); // Get a random episode to start with
    displayTriviaQuestion(episode, episodes, cast);

    // Add event listener for the "Next Question" button
    document.getElementById('nextQuestionButton').onclick = function() {
      loadNewQuestion(episodes, cast); // Load the next question when the button is clicked
    };
  } else {
    document.getElementById('questionText').textContent = "Error loading data. Please try again later.";
  }
}

// Start the game when the window is loaded
window.onload = function() {
  startTriviaGame();
};


