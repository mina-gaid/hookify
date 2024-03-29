const request = new XMLHttpRequest();

const toggleElement = (eleToHide, eleToShow) => {
  document.getElementById(eleToHide).style.display = "none";
  document.getElementById(eleToShow).style.display = "block";
};

document
  .getElementById("searchTypeSelector")
  .addEventListener("input", function (evt) {
    if (this.value === "genre") {
      toggleElement("searchField", "genreDropdown");
    } else {
      toggleElement("genreDropdown", "searchField");
    }
  });

window.onload = () => {
  request.open("POST", "/genres", true);
  request.onload = () => {
    if (request.status === 200 || request.status === 0) {
      let resp = JSON.parse(request.responseText);
      loadGenres(resp);
    } else {
      displayAlert(request.responseText, "alert-danger");
    }
  };

  request.send(null);
};

const toTitleCase = (phrase) =>
  phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const loadGenres = (genres) => {
  const shuffled = genres.sort(() => 0.5 - Math.random());
  let selected = shuffled.slice(0, 1).join();
  request.open(
    "POST",
    `/recommendations?q=${selected}&t=genre&min_popularity=40`,
    true
  );
  request.send();
  request.onload = () => {
    if (request.status == 200) {
      displayAlert(
        `<i class="fas fa-headphones-alt fa-lg mr-3"></i> Here's some ${toTitleCase(
          selected.replace("-", " ")
        )} tracks recommended for you...`
      );
      displayRecommendations(JSON.parse(request.responseText));
    } else {
      displayAlert(request.responseText, "alert-danger");
    }
  };
};

const hideAlert = () => {
  document.getElementById("alertBox").style.display = "none";
  document.getElementById("alertMessage").innerHTML = "";
};

const displayAlert = (alertMessage, alertType) => {
  document.getElementById("alertBox").style.display = "block";
  document.getElementById("alertBox").classList.add(alertType);
  document.getElementById("alertMessage").innerHTML = alertMessage;
};

const displayRecommendations = (recommendations) => {
  let tracks = recommendations.tracks;
  let content = "";
  const theDiv = document.getElementById("resultsArea");
  content += "<table class='table table-hover'>";
  content += "<thead class='thead-light'>";
  content += "<tr>";
  content += '<th scope="col">#</th>';
  content += '<th scope="col">Track</th>';
  content += '<th scope="col">Artist</th>';
  content += "</tr>";
  content += "</thead>";
  content += "<tbody>";
  let count = 1;
  tracks.forEach(({ name, artists, external_urls }) => {
    let displayName = `${name} - ${artists[0].name}`;
    let cleanDisplayName = displayName.replace(/["']/g, "");
    content += `<tr style='cursor:pointer' onclick='playSong("${cleanDisplayName}")'>`;
    content += `<th scope="row">${count}</th>`;
    content += `<td>${name}</th>`;
    content += `<td>${artists[0].name}</th>`;
    content += "</tr>";
    count += 1;
  });
  content += "</tbody>";
  content += "</table>";
  theDiv.innerHTML = content;
  displayResults();
};

const searchRecommendations = (e) => {
  e.preventDefault();
  let searchQuery = "";
  let searchType = document.getElementById("searchTypeSelector").value;
  if (searchType === "genre") {
    searchQuery = document.getElementById("genreSelector").value;
  } else {
    searchQuery = document.getElementById("searchQuery").value;
    if (searchQuery.length === 0 || !searchQuery.trim()) {
      displayAlert("Search query can't be empty.", "alert-warning");
      return false;
    }
  }
  request.open(
    "POST",
    `/recommendations?q=${searchQuery}&t=${searchType}`,
    true
  );
  request.onload = () => {
    if (request.status == 200) {
      parsed = JSON.parse(request.responseText);
      if (parsed.hasOwnProperty("error")) {
        displayAlert(parsed.error.message, "alert-warning");
      } else {
        displayRecommendations(parsed);
      }
    } else {
      parsed = JSON.parse(request.responseText);
      displayAlert(parsed.error, "alert-warning");
    }
  };
  request.send();
};

const loadYoutubeFrame = (videoId) => {
  const url = `https://youtube.com/embed/${videoId}?autoplay=1`;
  document.getElementById("video").src = url;
};

const displayResults = () => {
  toggleElement("videoArea", "resultsArea");
};

const displayVideo = () => {
  toggleElement("resultsArea", "videoArea");
};

const findSimilarTracks = () => {
  let track = document.getElementById("moreLikeThis").name;
  request.open("POST", `/recommendations?q=${track}&t=track`, true);
  request.onload = () => {
    if (request.status == 200) {
      let parsed = JSON.parse(request.responseText);
      if (parsed.hasOwnProperty("error")) {
        displayAlert(
          `Status: ${parsed.error.status}Error: ${parsed.error.message}`,
          "alert-danger"
        );
      } else {
        displayRecommendations(parsed);
      }
    } else {
      displayAlert(request.responseText, "alert-warning");
    }
  };
  request.send();
};

const playSong = (e) => {
  hideAlert();
  request.open("POST", `/play?track=${e}`, true);
  request.onload = () => {
    if (request.status == 200) {
      let resp = request.responseText;
      let data = JSON.parse(resp);
      displayVideo();
      loadYoutubeFrame(data.id);
      displayAlert(
        `<i class='fas fa-play mr-3'></i> Playing <a href='#' onclick='displayVideo()'>${e}</a>.`
      );
      document.getElementById("moreLikeThis").name = e;
    } else {
      displayAlert(
        '<i class="fas fa-exclamation-triangle mr-3"></i> Could not load video.',
        "alert-danger"
      );
    }
  };
  request.onerror = () => {
    parsed = JSON.parse(request.responseText);
    displayAlert(parsed.error, "alert-danger");
  };
  request.send();
};

const form = document.getElementById("searchForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchRecommendations(e);
});

const ele = document.getElementById("findRecommendations");
ele.onclick = searchRecommendations;
