/* eslint-disable no-unused-vars */
/* global YT */

/* Playlist of songs */
var playlist = [
  {
    id: "D8j5Fm94_CE",
    artist: "Sabrina Carpenter",
    title: "Espresso",
  },
  {
    id: "1KWSBaxnZMo",
    artist: "YOUNG POSSE (영파씨)",
    title: "Macaroni Cheese",
  },
];
var curr_idx = 0;

// references to DOM elements
const playPauseButton = document.getElementById("play-pause-btn");
const playPauseIcon = document.getElementById("play-pause-icon");
const musicPrevBtn = document.getElementById("music-prev-btn");
const musicNextBtn = document.getElementById("music-next-btn");
const durationSlider = document.getElementById("duration-slider");

// global vars
var playing = false;

// Load YouTube iFrame API
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var musicPlayerScriptTag = document.getElementById("music-player-script");
musicPlayerScriptTag.parentNode.insertBefore(tag, musicPlayerScriptTag);

// Create YouTube player
var player;

function onPlayerStateChange(event) {
  if (
    event.data === YT.PlayerState.PLAYING ||
    event.data === YT.PlayerState.BUFFERING
  ) {
    playPauseIcon.classList.remove("gg-play-button-r");
    playPauseIcon.classList.add("gg-play-pause-r");

    durationSlider.setAttribute("max", player.getDuration());
    durationSlider.value = player.getCurrentTime();

    playing = true;
  } else if (event.data === YT.PlayerState.ENDED) {
    playNext();
  } else {
    playPauseIcon.classList.remove("gg-play-pause-r");
    playPauseIcon.classList.add("gg-play-button-r");

    playing = false;
  }
}

function onPlayerReady() {
  // Update the current time of the music
  setInterval(() => {
    if (playing) {
      durationSlider.value = parseInt(durationSlider.value) + 1;

      const mins = Math.floor(parseInt(durationSlider.value) / 60);
      const secs = Math.floor(parseInt(durationSlider.value) % 60);
      document.getElementById("music-current-time").textContent =
        String(mins).padStart(2, 0) + ":" + String(secs).padStart(2, 0);
    }
  }, 1000);

  // Play/pause button
  playPauseButton.addEventListener("click", () => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  // next/prev buttons
  musicNextBtn.addEventListener("click", cueNext);
  musicPrevBtn.addEventListener("click", cuePrev);

  durationSlider.addEventListener("input", () => {
    player.seekTo(durationSlider.value, false);
  });

  durationSlider.addEventListener("change", () => {
    player.seekTo(durationSlider.value, true);

    const mins = Math.floor(parseInt(durationSlider.value) / 60);
    const secs = Math.floor(parseInt(durationSlider.value) % 60);
    document.getElementById("music-current-time").textContent =
      String(mins).padStart(2, 0) + ":" + String(secs).padStart(2, 0);
  });

  // Enable the inputs
  musicPrevBtn.removeAttribute("disabled");
  playPauseButton.removeAttribute("disabled");
  musicNextBtn.removeAttribute("disabled");
  durationSlider.removeAttribute("disabled");
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    videoId: "D8j5Fm94_CE",
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function cueNext() {
  curr_idx = (curr_idx + 1) % playlist.length;
  player.cueVideoById(playlist[curr_idx].id);

  document.getElementById("music-player-title").textContent =
    playlist[curr_idx].title;
  document.getElementById("music-player-artist").textContent =
    playlist[curr_idx].artist;

  durationSlider.value = 0;
  document.getElementById("music-current-time").textContent = "00:00";
}

function playNext() {
  curr_idx = (curr_idx + 1) % playlist.length;
  player.loadVideoById(playlist[curr_idx].id);

  document.getElementById("music-player-title").textContent =
    playlist[curr_idx].title;
  document.getElementById("music-player-artist").textContent =
    playlist[curr_idx].artist;

  durationSlider.value = 0;
  document.getElementById("music-current-time").textContent = "00:00";
}

function cuePrev() {
  curr_idx = (curr_idx - 1 + playlist.length) % playlist.length;
  player.cueVideoById(playlist[curr_idx].id);

  document.getElementById("music-player-title").textContent =
    playlist[curr_idx].title;
  document.getElementById("music-player-artist").textContent =
    playlist[curr_idx].artist;

  durationSlider.value = 0;
  document.getElementById("music-current-time").textContent = "00:00";
}

// init title
document.getElementById("music-player-title").textContent =
  playlist[curr_idx].title;
document.getElementById("music-player-artist").textContent =
  playlist[curr_idx].artist;
