
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("📩 Message received in content.js:", msg);
  if (msg.type === "GET_STATUS") {
    const {trackName,artist}=getTrackAndArtist();
    sendResponse({ trackName, artist });
  }
  if (msg.type === "MUSIC_ACTION") {
    const { action } = msg;

    const playPauseBtn = getVisiblePlayPauseButton();
    console.log(playPauseBtn)
    const nextBtn=document.querySelector('amp-playback-controls-item-skip.next').shadowRoot.querySelector('button')
    // const prevBtn = document.querySelector('amp-playback-controls-item-skip.previous').shadowRoot.querySelector('button');
    // const shuffleBtn =document.querySelector('amp-playback-controls-item-shuffle').shadowRoot.querySelector('button');
    // const repeatBtn=document.querySelector('amp-playback-controls-repeat').shadowRoot.querySelector('button');

    if (action === "playPause" && playPauseBtn) playPauseBtn.click();
    if (action === "next" && nextBtn) nextBtn.click();
    if (action === "prev" && prevBtn) prevBtn.click();
    if (action === "shuffle" && shuffleBtn) shuffleBtn.click();
    if (action === "repeat" && repeatBtn) repeatBtn.click();
  }

});


function getVisiblePlayPauseButton() {
  const playBtn = document.querySelector('.playback-play__play[aria-hidden="false"], .playback-play__play:not([aria-hidden])');
  const pauseBtn = document.querySelector('.playback-play__pause[aria-hidden="false"], .playback-play__pause:not([aria-hidden])');

  return playBtn || pauseBtn;
}

function getTrackAndArtist() {
  const trackEl = document.querySelectorAll('.lcd-meta-line__fragment');
  const artistEl = document.querySelector('button.lcd-meta-line__fragment');

    const trackName = trackEl[0] ? trackEl[0].textContent.trim() : "Unknown";

  const artist = artistEl ? artistEl.textContent.trim() : "Unknown";

  return { trackName, artist };
}
