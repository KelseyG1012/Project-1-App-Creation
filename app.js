
// Define the API endpoints for Friends
const castUrl = 'https://api.tvmaze.com/shows/431/cast';
const episodesUrl = 'https://api.tvmaze.com/shows/431/episodes';

// Episodes HTML

let allEpisodes = []; // This will store all episodes fetched from the API

// Function to fetch episodes from the API
function fetchEpisodes() {
    fetch(episodesUrl)
        .then(response => response.json()) // Convert response to JSON
        .then(episodes => {
            allEpisodes = episodes; // Store all episodes in the global array
            displayEpisodes(allEpisodes); // Display all episodes by default
        })
        .catch(error => {
            console.error('Error fetching episodes:', error);
        });
}

// Function to display episodes on the page
function displayEpisodes(episodes) {
    const episodeList = document.getElementById('episodeList'); // Select the episode list container

    if (!episodeList) return; // If the episode list doesn't exist, exit function

    episodeList.innerHTML = ''; // Clear any existing content

    // If no episodes are found, display a "No episodes found" message
    if (episodes.length === 0) {
        episodeList.innerHTML = '<p>No episodes found</p>';
        return;
    }

    // Loop through the episodes array and create HTML for each episode
    episodes.forEach(episode => {
        const episodeDiv = document.createElement('div');
        episodeDiv.classList.add('col-md-4', 'mb-4'); // Add Bootstrap classes for layout

        // Create episode card with title, air date, and summary
        episodeDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${episode.name}</h5>
                    <p class="card-text">Season ${episode.season}, Episode ${episode.number}</p>
                    <p class="card-text"><small class="text-muted">Air date: ${episode.airdate}</small></p>
                    <p class="card-text">${episode.summary ? episode.summary.replace(/<[^>]+>/g, '') : 'No summary available.'}</p>
                </div>
            </div>
        `;

        // Append the created card to the episode list
        episodeList.appendChild(episodeDiv);
    });
}

// Function to filter episodes based on the search term
function filterEpisodes(searchTerm) {
    const filteredEpisodes = allEpisodes.filter(episode => {
        const episodeName = episode.name.toLowerCase();
        const episodeSummary = episode.summary ? episode.summary.toLowerCase() : '';
        return episodeName.includes(searchTerm.toLowerCase()) || episodeSummary.includes(searchTerm.toLowerCase());
    });

    displayEpisodes(filteredEpisodes); // Display the filtered episodes
}

// Event listeners for episode page
function setupEpisodeEvents() {
    const searchButton = document.getElementById('searchButton');
    const searchBar = document.getElementById('searchBar');
    const resetButton = document.getElementById('resetButton');

    if (searchButton && searchBar && resetButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchBar.value.trim();
            filterEpisodes(searchTerm); // Perform the search when the button is clicked
        });

        searchBar.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const searchTerm = searchBar.value.trim();
                filterEpisodes(searchTerm); // Perform the search when the 'Enter' key is pressed
            }
        });

        resetButton.addEventListener('click', () => {
            searchBar.value = ''; // Clear the search bar
            displayEpisodes(allEpisodes); // Reset to display all episodes
        });

        // Call the fetchEpisodes function when the page loads
        fetchEpisodes();
    }
}


// Cast HTML

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.tvmaze.com/shows/431/cast')
        .then(response => response.json())
        .then(data => {
            displayCast(data);
        })
        .catch(error => {
            console.error('Error fetching cast data:', error);
        });
});

function displayCast(castData) {
    const castList = document.querySelector('.cast-list');
    castList.innerHTML = '';

    castData.forEach(castMember => {
        const castMemberDiv = document.createElement('div');
        castMemberDiv.classList.add('cast-member');

        const castMemberInner = document.createElement('div');
        castMemberInner.classList.add('cast-member-inner');

        const castImage = castMember.person.image ? castMember.person.image.medium : 'https://via.placeholder.com/150';
        const frontHTML = `
            <div class="cast-member-front">
                <img src="${castImage}" alt="${castMember.person.name}">
                <h2>${castMember.person.name}</h2>
                <p>As ${castMember.character.name}</p>
            </div>
        `;

        const backHTML = `
            <div class="cast-member-back">
                <h2>More Info</h2>
                <p>Birthdate: ${castMember.person.birthday || 'N/A'}</p>
                <p>Country: ${castMember.person.country ? castMember.person.country.name : 'N/A'}</p>
            </div>
        `;

        // Create the front and back sides
        const castMemberFront = document.createElement('div');
        castMemberFront.innerHTML = frontHTML;

        const castMemberBack = document.createElement('div');
        castMemberBack.innerHTML = backHTML;

        // Append both sides to the inner div
        castMemberInner.appendChild(castMemberFront);
        castMemberInner.appendChild(castMemberBack);

        // Append the inner div to the cast member container
        castMemberDiv.appendChild(castMemberInner);

        // Append the cast member to the list
        castList.appendChild(castMemberDiv);

        // Add a click event to flip the card
        castMemberDiv.addEventListener('click', () => {
            castMemberDiv.classList.toggle('is-flipped');
        });
    });
}

// Detect if it's the episodes or cast page and run the appropriate logic
document.addEventListener('DOMContentLoaded', () => {
    const episodeList = document.getElementById('episodeList');
    const castContainer = document.getElementById('castContainer');

    if (episodeList) {
        setupEpisodeEvents();
    }

    if (castContainer) {
        fetchCast();
    }
});