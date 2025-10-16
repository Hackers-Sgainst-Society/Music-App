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
  // TODO: Error handling
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
    limit: 10,
    api_key: fmKey,
    format: "json",
  });

  const data = await GetFetch(fmUrl + params); //live api fetch <================================
  // const data = await GetFetch("artistSearch.json"); //test fetch json

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
  container.addEventListener("click", (e) => ArtistClick(e));
  // assign class

  if (artists.length == 0) {
    const h2 = document.createElement("h2");
    h2.style = "font-size:6rem;";
    h2.innerText = "No artists found!";
    main.replaceChildren(h2);
    return;
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
 * @param {string} event
 * @runs on artist link clicked
 */
async function GetArtistPage(artistName) {
  //Get info about artist
  const { info } = await GetArtistInfo(artistName);

  //get artist top albums (its tracks really?)
  const tracks = await GetArtistTopAlbums(artistName);

  // TODO: put data into html page
  RenderArtistPage(info, tracks);
}

/**
 * @todo Get the artist tags to display in list.
 * @todo Add artist name and listens to page
 * @todo get artist img?
 * @param {*} tags
 * @param {*} tracks
 */
function RenderArtistPage(info, tracks) {
  const container = document.createElement("div");
  container.className = "artist-page-container";

  // Generate HTML for Bio
  const bioDiv = document.createElement("div");
  bioDiv.className = "artist-info-container";
  const nameH1 = document.createElement("h1");
  nameH1.className = "artist-title";
  nameH1.innerText = info.name;
  const bioP = document.createElement("p");
  bioP.className = "artist-bio";
  bioP.innerHTML = info.bio;
  const listenersP = document.createElement("p");
  listenersP.className = "artist-listeners";
  listenersP.innerText = "Listeners: " + info.listeners;
  const tagUl = document.createElement("ul");
  tagUl.className = "artist-tag-list";
  tagUl.innerText = "Tags";
  for (el of info.tags) {
    const li = document.createElement("li");
    li.className = "artist-tag";
    li.innerText = el.name;
    tagUl.appendChild(li);
  }
  bioDiv.appendChild(nameH1);
  bioDiv.appendChild(listenersP);
  bioDiv.appendChild(bioP);
  bioDiv.appendChild(tagUl);

  // Generate HTML for artists tracks
  const trackUl = document.createElement("ul");
  trackUl.className = "track-list";
  for (el of tracks) {
    const li = document.createElement("li");
    li.className = "track-item";
    const img = document.createElement("img");
    img.className = "track-img";
    img.src =
      el.image[2]["#text"] == "" ? "./public/no-img.png" : el.image[2]["#text"];
    const h3 = document.createElement("h3");
    h3.className = "track-name";
    h3.innerText = el.name;
    const p = document.createElement("p");
    p.className = "track-p";
    p.innerText = "Playcount: " + el.playcount;

    li.appendChild(img);
    li.appendChild(h3);
    li.appendChild(p);
    trackUl.appendChild(li);
  }

  //Generate HTML for similar artists
  const similarUl = document.createElement("ul");
  similarUl.addEventListener("click", (e) => SimilarLiClick(e));
  similarUl.className = "artist-tag-list";
  similarUl.innerText = "Similar Artists";
  for (el of info.similar) {
    const li = document.createElement("li");
    li.className = "artist-tag";
    li.innerText = el.name;
    similarUl.appendChild(li);
  }

  // Bio
  container.appendChild(bioDiv);
  // Tracks
  container.appendChild(trackUl);
  // Similar
  container.appendChild(similarUl);

  // Append to main
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
    limit: 48,
    api_key: fmKey,
    format: "json",
  });

  const data = await GetFetch(fmUrl + params); //live api fetch <================================
  // const data = await GetFetch("artistTopAlbums.json"); //test fetch json
  const { album } = data.topalbums;
  return album;
}

/**
 *
 * @param {string} artistName
 * @returns {Promise<{name:string, listeners: number, playcount:number, bio:string, tags:[{name:string}], similar:[{name:string}] }>}
 */
async function GetArtistInfo(artistName) {
  const params = new URLSearchParams({
    method: "artist.getinfo",
    artist: artistName,
    api_key: fmKey,
    format: "json",
  });

  const data = await GetFetch(fmUrl + params); //live api fetch <================================
  // const data = await GetFetch("artistInfo.json"); //test fetch json
  const { artist } = data;

  return {
    info: {
      name: artist.name,
      listeners: artist.stats.listeners,
      playcount: artist.stats.playcount,
      bio: artist.bio.summary,
      tags: artist.tags.tag,
      similar: artist.similar.artist,
    },
  };
}

async function ArtistClick(event) {
  // Get and format name from parent Li
  const artistName = event.target
    .closest("li")
    .name // .name.split(",")[0]
    // .split("&")[0]
    .trim()
    .toLowerCase();

  GetArtistPage(artistName);
}

async function SimilarLiClick(event) {
  if (event.target.tagName != "LI") return;

  const name = event.target.innerText
    .split(",")[0]
    .split("&")[0]
    .trim()
    .toLowerCase();

  GetArtistPage(name);
}

async function GetTopArtist() {
  const params = new URLSearchParams({
    method: "chart.gettopartists",
    limit: 44,
    api_key: fmKey,
    format: "json",
  });

  const data = await GetFetch(fmUrl + params);
  const { artist } = data.artists;

  return artist;
}

function RenderHomePage(topArtist) {
  //make the ul element
  const container = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.style = "text-align:center; padding-top:1rem";
  h1.innerText = "Top Artists";
  const ul = document.createElement("ul");
  ul.addEventListener("click", (e) => ArtistClick(e));

  //loop over the array and turn into li
  for (el of topArtist) {
    const li = document.createElement("li");
    li.name = el.name;
    const h3 = document.createElement("h3");
    h3.innerText = el.name;
    const p = document.createElement("p");
    p.innerText = "Listeners: " + el.listeners;

    li.appendChild(h3);
    li.appendChild(p);
    ul.appendChild(li);
  }

  container.appendChild(h1);
  container.appendChild(ul);

  main.replaceChildren(container);
}

const onLoad = async () => {
  const topData = await GetTopArtist();
  RenderHomePage(topData);
};

onLoad();
