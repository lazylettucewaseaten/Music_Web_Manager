
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {


    if(msg.type==="PICTURE_IN_DISPLAY"){
        const pipin=document.querySelector('button[data-testid="pip-toggle-button"]');
        if(pipin){
            pipin.click();
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
    }

    if(msg.type==="TAKE_BACK"){
        document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        keyCode: 39,
        which: 39,
        shiftKey: true,
        bubbles: true
        }));
    }



      if (msg.type === "SEARCH_AND_PLAY") {
            const query = msg.query;
            (async () => {
                try {
                    const searchInput = await document.querySelector('input[data-testid="search-input"]');

                    searchInput.focus();
                    searchInput.value = query;

                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    searchInput.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        bubbles: true,
                        cancelable: true
                    }));


                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const playbtn=document.querySelector('button[data-testid="play-button"][aria-label="Play"]');
                    if(playbtn){
                        playbtn.click();
                    }
                } catch (err) {
                    console.error("Search/play failed:", err);
                    sendResponse({ success: false, error: err });
                }
            })
    ();

    return true; 
    }



    if(msg.type==="GET_BUTTON_STATES"){
        const shuffleBtnch =await document.querySelector('button[data-testid="control-button-shuffle"]');
        const repeatBtnch=await document.querySelector('button[data-testid="control-button-repeat"]');
        if(shuffleBtnch){
            const isShuffled=shuffleBtnch.getAttribute('aria-checked')==='true';
            // console.log(isShuffled)
            if(isShuffled){
                target=1;
            }
            else{
                target=2;
            }
        }
        if(repeatBtnch){
            const isNotRepeated=repeatBtnch.getAttribute('aria-checked')==='false';
            const isRepeated=repeatBtnch.getAttribute('aria-checked')==='true';
            const isMixed=repeatBtnch.getAttribute('aria-checked')==='mixed';
            
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
    sendResponse({ trackName, artist ,image});
  }
  if (msg.type === "MUSIC_ACTION") {
    
    const { action } = msg;
    const playPauseBtn =  document.querySelector('button[data-testid="control-button-playpause"]');
    const nextBtn=document.querySelector('button[data-testid="control-button-skip-forward"]');
    const prevBtn = document.querySelector('button[data-testid="control-button-skip-back"]');
    const shuffleBtn =document.querySelector('button[data-testid="control-button-shuffle"]');
    const repeatBtn=document.querySelector('button[data-testid="control-button-repeat"]');

    if (action === "playPause" && playPauseBtn) playPauseBtn.click();
    if (action === "next" && nextBtn)  nextBtn.click();
    if (action === "prev" && prevBtn) prevBtn.click();
    if (action === "shuffle" && shuffleBtn){
         shuffleBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (action === "repeat" && repeatBtn){
         repeatBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    let target,val;

    const shuffleBtnch =await document.querySelector('button[data-testid="control-button-shuffle"]');
    const repeatBtnch=await document.querySelector('button[data-testid="control-button-repeat"]');
    if(shuffleBtnch){
        const isShuffled=await shuffleBtnch.getAttribute('aria-checked')==='true';
        // console.log(isShuffled)
        if(isShuffled){
            target=1;
        }
        else{
            target=2;
        }
    }


    if(repeatBtnch){
        const isNotRepeated=await repeatBtnch.getAttribute('aria-checked')==='false';
        const isRepeated=await repeatBtnch.getAttribute('aria-checked')==='true';
        const isMixed=await repeatBtnch.getAttribute('aria-checked')==='mixed';
        
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
return true;
});



function getTrackAndArtistAndImage() {
    const trackName=document.querySelector('a[data-testid="context-item-link"]').textContent;
    const artist=document.querySelector('a[data-testid="context-item-info-artist"]').textContent;
    const image=document.querySelectorAll('img[data-testid="cover-art-image"]')[1].src;
  return { trackName, artist,image };
}


