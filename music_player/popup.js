const shuffle=document.getElementById('shuffle');
const repeat=document.getElementById('repeat');

const backward=document.getElementById('skip-backward');
const forward=document.getElementById('skip-forward');
const pipntn=document.getElementById('pip');

document.getElementById("play").addEventListener("click", function () {
  const icon = this.querySelector("i");
  if (icon.classList.contains("fa-play")) {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  } else {
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }
});

try {
    pipntn.addEventListener("click", async ()=>{
     await sendToContent({type:"PICTURE_IN_DISPLAY"});
})    
} catch (error) {
  console.log(error)  
}


// forward 10
try {
    backward.addEventListener("click",async()=>{
        await sendToContent({type:"TAKE_BACK"})
    })
} catch (error) {
    console.log(error)
}


try {
    forward.addEventListener("click",async()=>{
        await sendToContent({type:"TAKE_FRONT"})
    })
} catch (error) {
    console.log(error)
}


//backward 10


document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    try {
        await sendToContent({ type: "SEARCH_AND_PLAY", query });
    } catch (err) {
        console.error("Search failed:", err);
    }
});



async function getMusicTab() {
    const tabs=await chrome.tabs.query({url:"*://open.spotify.com/*"}) 
    const tab2= await chrome.tabs.query({url:"*://music.youtube.com/*"})  
    // const tab2=await chrome.tabs.query({url:"*://open.spotify.com/*"})
    console.log(tabs)
    console.log(tab2)
    if(tabs.length>0){
        return tabs[0];
    }
    return tab2[0];
}

async function sendToContent(msg) {
  const tab = await getMusicTab();
  if (!tab) {
    document.getElementById("track-info").textContent = "Nothing is Open";
    return;
  }

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, msg, (response) => {
  if (chrome.runtime.lastError) {
    reject(chrome.runtime.lastError.message);
    return;
  }
  resolve(response);
});
  });
}




async function getInitialButtonStates() {
    try {
        const buttonStates = await sendToContent({type: "GET_BUTTON_STATES"});
        if (buttonStates) {
            updateButtonStates(buttonStates);
        }
    } catch (error) {
        console.error("Failed to get button states:", error);
    }
}


async function updateButtonStates(states) {
    if (states.target === 1) {
        await shuffle.classList.add('shuffle-active');
    } else {
       await shuffle.classList.remove('shuffle-active');
    }
    
   await repeat.classList.remove('repeat-single', 'repeat-playlist');
    if (states.val === 4) {
     await   repeat.classList.add('repeat-playlist');
    } else if (states.val === 5) {
        await repeat.classList.add('repeat-single');
    }
}


async function updateTrackInfo() {
    try {
        const status = await sendToContent({type:"GET_STATUS"});
        if(status){
            // console.log("now changing name")
             document.getElementById("track-info").textContent = `${status.trackName} - ${status.artist}`
            //  if(status.image){
                 document.getElementById("trackimage").src = status.image
            //  }
        }
    } catch (error) {
        console.error("Failed to update track info:", error);
        document.getElementById("track-info").textContent = "Failed to get track info";
    }
}

async function handleMusicAction(action) {
    try {
        const response=await sendToContent({ type: "MUSIC_ACTION", action: action });
        const { target, val } = response;
        await updateButtonStates({target,val});
        
    } catch (error) {
        console.error(`Failed to execute ${action}:`, error);
    }
}


async function runatsight() {
    await new Promise((resolve)=>setTimeout(resolve,100));
    sendToContent({type:"RUN_NOW"});

}
document.addEventListener("DOMContentLoaded",async()=>{
     await updateTrackInfo();
     await getInitialButtonStates();
     await runatsight();
    document.getElementById("shuffle").addEventListener("click",async () => {
        await handleMusicAction("shuffle");

        setTimeout(async () => {
            await  getInitialButtonStates();
        }, 800);

     });

    document.getElementById("prev").addEventListener("click",async () => {

        await handleMusicAction("prev");
        setTimeout(async () => {
            await updateTrackInfo();
        }, 800);
    });

    document.getElementById("play").addEventListener("click", () => {
         handleMusicAction("playPause");
    });

    document.getElementById("next").addEventListener("click",async () => {

        await handleMusicAction("next");
        setTimeout(async () => {
            await updateTrackInfo();
        }, 800);
    });

    document.getElementById("repeat").addEventListener("click",async () => {
       await  handleMusicAction("repeat");
      
      setTimeout(async () => {
            await  getInitialButtonStates();
        }, 800);
    });

})