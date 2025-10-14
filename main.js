/** @format */

const artistsUrl = "https://ws.audioscrobbler.com/2.0/?";

// link to the button var
const searchInput = document.getElementById("search");

searchInput.addEventListener("blur", (e) => sendFetchRequest(e))

/**
 *  Function takes in search string
 *  Looks up artists in the api
 *  returns a list of objects [{artist data}]
 */

function sendFetchRequest() {
  //Make sure there is an actual search
  const search = searchInput.value; //input

  //make sure its not empty
  if(search.trim() == "") return;
    

  //send get request to the api
  const params = new URLSearchParams({
    method: "artist.search",
    artist: search,
    api_key: "db5ec8550e5bf1c9af19499c1651ad36",
    format: "json",
  });


  const data = fetch(artistsUrl + params)
    .then((response) => {
      // console.log(response.json())
      return response.json();

    })
    .then((data) => {
      console.log(data.results.artistmatches);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      updateResponseDisplay("Error:" + error.message);
    });

  // responseOutput.textContent =
}

// sendFetchRequest();

// Function to update the response display area
// function updateResponseDisplay(content) {
//     const responseOutput = document.getElementById('response-output');
//     responseOutput.textContent = content; // Display formatted content
// }

// // Fetch request using the Fetch API
// function sendFetchRequest() {
//     const username = document.getElementById("username").value;

//     if (username) {
//         const url = `https://api.github.com/users/${username}/repos`;

//THISS HERE
//         fetch(url)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("GitHub user not found or has no public repositories");
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 renderRepos(data);
//             })
//             .catch((error) => {
//                 console.error("Error:", error.message);
//                 updateResponseDisplay("Error: " + error.message);
//             });
//     } else {
//         updateResponseDisplay("Please enter a GitHub username.");
//     }
// }

// // Render relevant repo information (4 parameters of interest)
// const renderRepos = (repos) => {
//     const responseOutput = document.getElementById('response-output');
//     responseOutput.textContent = ''; // Clear any previous results

//     if (repos.length === 0) {
//         updateResponseDisplay("No repositories found for this user.");
//         return;
//     }

//     repos.forEach((repo) => {
//         // Prepare relevant data (4 parameters of interest)
//         const repoData = `
//             Repository: ${repo.full_name}
//             Visibility: ${repo.private ? 'Private' : 'Public'}
//             Owner: ${repo.owner.login}
//             Avatar URL: ${repo.owner.avatar_url}
//         `;
//         responseOutput.textContent += repoData + "\n\n"; // Add each repo's info with line breaks
//     });
// };

// // Attach event listeners to buttons
// document.getElementById("fetch").addEventListener("click", sendFetchRequest);
