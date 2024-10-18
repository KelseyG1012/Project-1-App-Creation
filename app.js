// Define the API endpoint for Friends episodes
const episodesUrl = 'https://api.tvmaze.com/shows/431/episodes';
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

// Add event listener for search button click
document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchBar').value.trim();
    filterEpisodes(searchTerm); // Perform the search when the button is clicked
});

// Add event listener for 'Enter' key press in the search input field
document.getElementById('searchBar').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('searchBar').value.trim();
        filterEpisodes(searchTerm); // Perform the search when the 'Enter' key is pressed
    }
});

// Add event listener for reset button click
document.getElementById('resetButton').addEventListener('click', () => {
    document.getElementById('searchBar').value = ''; // Clear the search bar
    displayEpisodes(allEpisodes); // Reset to display all episodes
});

// Call the fetchEpisodes function when the page loads
document.addEventListener('DOMContentLoaded', fetchEpisodes);