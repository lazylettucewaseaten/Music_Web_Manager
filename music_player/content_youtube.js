(function () {
  // Patch native alert/confirm/prompt early
  ['alert', 'confirm', 'prompt'].forEach(fn => {
    window[fn] = () => null;
  });

  // Patch window.open to block popups
  window.open = () => {
    console.warn("Blocked window.open");
    return null;
  };

  // Prevent onbeforeunload prompts
  const blockUnload = () => {
    window.onbeforeunload = null;

    // Monkey-patch addEventListener to block 'beforeunload'
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (type, listener, options) {
      if (type === 'beforeunload') {
        console.warn("Blocked beforeunload listener.");
        return;
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Remove any existing beforeunload listeners
    window.removeEventListener('beforeunload', () => {}, true);
  };

  blockUnload();

  // Keep overriding just in case the page tries to reassign it again later
  const overrideLoop = setInterval(() => {
    blockUnload();
  }, 1000);
})();

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {



        if(msg.type==="PICTURE_IN_DISPLAY"){

            const video = document.querySelector('video');
            if (document.pictureInPictureElement) {
  document.exitPictureInPicture();
} else if (video && document.pictureInPictureEnabled) {
  video.requestPictureInPicture();
}

            return true;
    }



    if(msg.type==="TAKE_FRONT"){
        document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
        which: 39,
        shiftKey: true,
        bubbles: true
        }));
                return true;
    }

    if(msg.type==="TAKE_BACK"){
        document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        keyCode: 37,
        which: 37,
        shiftKey: true,
        bubbles: true
        }));
        return true;
    }

    if (msg.type === "SEARCH_AND_PLAY") {

            const query = encodeURIComponent(msg.query);
            window.location.href = `https://music.youtube.com/search?q=${query}`;
                sessionStorage.setItem("reloaded","true");
    return true; 
    }

    if(msg.type==="RUN_NOW"){
        await new Promise(resolve => setTimeout(resolve, 1000));
        const playbtn=document.querySelector('button[aria-label="Play"]')
        const isreloaded=sessionStorage.getItem("reloaded");
        if(playbtn && isreloaded==="true"){
            sessionStorage.removeItem("reloaded");
            playbtn.click();
        }
        return true;
    }

    if(msg.type==="GET_BUTTON_STATES"){
        const target=1;
        const repeatBtnch=await document.querySelector('button[aria-label^="Repeat"]');
    

    if(repeatBtnch){
        const isNotRepeated=await repeatBtnch.getAttribute('aria-label')==='Repeat off';
        const isRepeated=await repeatBtnch.getAttribute('aria-label')==='Repeat all';
        const isMixed=await repeatBtnch.getAttribute('aria-label')==='Repeat one';
        
        if(isNotRepeated){
            val=3;
        }
        if(isRepeated){
            val=4;
        }
        if(isMixed){
            val=5;
        }
    }
        sendResponse({target,val});
    }
  if (msg.type === "GET_STATUS") {
    const {trackName,artist,image}=getTrackAndArtistAndImage();
    // console.log({trackName,artist,image})
    sendResponse({ trackName, artist ,image});
    return true;
  }
  if (msg.type === "MUSIC_ACTION") {
    
    const { action } = msg;
    const playPauseBtn =  await getVisiblePlayPauseButton()
    const nextBtn=document.querySelector('yt-icon-button.next-button > button[aria-label="Next"]');
    const prevBtn = document.querySelector('yt-icon-button.previous-button > button[aria-label="Previous"]');

    const shuffleBtn =document.querySelector('button[aria-label^="Shuffle"]');
    const repeatBtn=document.querySelector('button[aria-label^="Repeat"]');

    if (action === "playPause" && playPauseBtn) playPauseBtn.click();
    if (action === "next" && nextBtn)  nextBtn.click();
    if (action === "prev" && prevBtn) prevBtn.click();
    if (action === "shuffle" && shuffleBtn){
         shuffleBtn.click();
    }
    if (action === "repeat" && repeatBtn){
         repeatBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const target=1
    let val;

    const repeatBtnch=await document.querySelector('button[aria-label^="Repeat"]');
    


    if(repeatBtnch){
        const isNotRepeated=await repeatBtnch.getAttribute('aria-label')==='Repeat off';
        const isRepeated=await repeatBtnch.getAttribute('aria-label')==='Repeat all';
        const isMixed=await repeatBtnch.getAttribute('aria-label')==='Repeat one';
        
        if(isNotRepeated){
            val=3;
        }
        if(isRepeated){
            val=4;
        }
        if(isMixed){
            val=5;
        }
    }
    await sendResponse({target,val});
  }

});



function getVisiblePlayPauseButton(){
    const play=document.querySelector('ytmusic-player-bar button[aria-label="Play"]');
    const pause=document.querySelector('ytmusic-player-bar button[aria-label="Pause"]');
    return play || pause;
}

function getTrackAndArtistAndImage() {
    const trackName=document.querySelector('ytmusic-player-bar yt-formatted-string.title')?.textContent.trim();;
    const final=document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string')?.textContent.trim()
    let artist=""
    if(final){
        artist=final;
    }

    const image=document.querySelector('img.image.style-scope.ytmusic-player-bar').src
    // console.log({trackName,artist,image})
  return { trackName, artist,image };
}







//shit backward 10 sec

// document.dispatchEvent(new KeyboardEvent('keydown', {
//   key: 'ArrowLeft',
//   code: 'ArrowLeft',
//   keyCode: 39,
//   which: 39,
//   shiftKey: true,
//   bubbles: true
// }));