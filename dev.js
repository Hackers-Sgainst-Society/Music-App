/** @format */

const fmUrl = "https://ws.audioscrobbler.com/2.0/?";
const fmKey = "db5ec8550e5bf1c9af19499c1651ad36";

const main = document.getElementsByTagName("main").item(0);
const searchIn = document.getElementById("search");

searchIn.addEventListener("keydown", (e) => GetArtist(e));

/**
 * Helper function to get and parse fetch data
 * @param {string} url
 * @returns awaitable json parsed data
 */
const GetFetch = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

/**
 * Searches api for artists using the query input. calls **`RenderArtists(data)`** to render the results
 * @param {KeyboardEvent} event Looking out for enter press
 * @runs on search bar KeyDown
 */
async function GetArtist(event) {
  //Only run on enter key pressed
  if (event.key != "Enter") return;

  //Get value from search input
  const search = searchIn.value;

  //If empty, return
  if (search.trim() == "") {
    console.log("Empty Search");
    return;
  }

  //reset search input value
  searchIn.value = "";

  //create search params
  const params = new URLSearchParams({
    method: "artist.search",
    artist: search,
    limit: 15,
    api_key: fmKey,
    format: "json",
  });

  // const res = await fetch(artistsUrl + params);  //live api fetch <================================
  const res = await fetch("artistSearch.json"); //test fetch json
  const data = await res.json();

  //Array of matching artists
  const { artist } = data.results.artistmatches;
  RenderAritsts(artist);
}

/**
 * Replaces the children of **`<main>`** a container that has a list of links to artists
 * @param {[{name:string, listeners:string}]} artists Name or artist and Number of listeners
 */
function RenderAritsts(artists) {
  const container = document.createElement("ul");
  container.addEventListener("click", (e) => GetArtistPage(e));
  // assign class

  if (artists.length == 0) {
    const h2 = document.createElement("h2");
    h2.innerText = "No artists found!";
    container.appendChild(h2);
  } else {
    for (el of artists) {
      const li = document.createElement("li");
      li.name = el.name;
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      // assign class
      h3.innerText = el.name;
      p.innerText = "Listeners: " + el.listeners;
      li.appendChild(h3);
      li.appendChild(p);
      container.appendChild(li);
    }
  }

  main.replaceChildren(container);
}

/**
 * Calls **`GetArtistTags()`** to get tags. **`GetArtistTopAlbums()`** to get top albums (tracks really?).
 * Then calls **`RenderArtistPage()`** to display the data.
 * @param {*} event
 * @runs on artist link clicked
 */
async function GetArtistPage(event) {
  //Get and format name from parent Li
  const artistName = event.target
    .closest("li")
    .name.split(",")[0]
    .split("&")[0]
    .trim()
    .toLowerCase();

  //get artist tags
  const tags = await GetArtistTags(artistName);

  //get artist top albums (its tracks really?)
  const tracks = await GetArtistTopAlbums(artistName);

  // TODO: put data into html page
  RenderArtistPage(tags, tracks);
}

/**
 * @todo Get the artist tags to display in list. 
 * @todo Add artist name and listens to page
 * @todo get artist img?
 * @param {*} tags 
 * @param {*} tracks 
 */
function RenderArtistPage(tags, tracks) {
  const container = document.createElement("div");
  // const tagUl = document.createElement("ul");
  const trackUl = document.createElement("ul");

  for (el of tracks) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = el.image[2]["#text"];
    const h3 = document.createElement("h3");
    h3.innerText = el.name;
    const p = document.createElement("p");
    p.innerText = "Playcount: " + el.playcount;

    li.appendChild(img);
    li.appendChild(h3);
    li.appendChild(p);
    trackUl.appendChild(li);
  }

  container.appendChild(trackUl);
  main.replaceChildren(container);
}

/**
 * Gets the top albums (tracks really?) for an artist
 * @param {string} artistName
 * @returns {Promise<[{name:string, playcount:number, image:[{"#text":string}]}]>} #text is the image url. Use image[2].#text
 */
async function GetArtistTopAlbums(artistName) {
  //search api for artists albums
  const params = new URLSearchParams({
    method: "artist.gettopalbums",
    artist: artistName,
    limit: 20,
    api_key: fmKey,
    format: "json",
  });

  // const data = await GetFetch(fmUrl + params); //live api fetch <================================
  const data = await GetFetch("artistTopAlbums.json"); //test fetch json
  const { album } = data.topalbums;
  return album;
}

/**
 * Gets the top tags for an artist
 * @param {string} artistName
 * @returns {Promise<[{name:string}]>} could be empty[]
 */
async function GetArtistTags(artistName) {
  //search api for artists tags
  const params = new URLSearchParams({
    method: "artist.gettoptags",
    artist: artistName,
    limit: 20,
    api_key: fmKey,
    format: "json",
  });

  // const data = await GetFetch(fmUrl + params); //live api fetch <================================
  const data = await GetFetch("artistTopTags.json"); //test fetch json

  const { tag } = data.toptags;
  return tag;
}
