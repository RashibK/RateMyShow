console.log('I am running from the site"s script');
let interval = null;

// browser.runtime.sendMessage({type: 'sync_media', category: 'anime', site: 'CR'})

// on page load:
console.log("Script injected into static.crunchyroll.com");
startProgressChecker();
getCurrentDuration();

async function startProgressChecker() {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(
    () => {
      getCurrentDuration();
    },
    30000 // check every minute
  );
}

// when something in dom changes:
function onChange(newURL) {
  console.log("URL Changed: ", newURL);
  startProgressChecker();
}
watchRouteChanges(onChange);

async function getCurrentDuration() {
  const videoEl = document.querySelector("#player0");
  console.log(videoEl);
  const currentDuration = videoEl.currentTime;
  const totalDuration = videoEl.duration;

  if (((currentDuration / totalDuration) * 100).toFixed(2) >= 80.0) {
    console.log("syncing the show rn");
    await syncTheShowCR();
  } else {
    console.log("not yet");
  }
}

function watchRouteChanges(onChange) {
  try {
    const videoEl = document.querySelector("#player0");
    let currentPlayerURL = videoEl.currentSrc;

    const checkForChange = () => {
      const videoEl = document.querySelector("#player0");
      let newPlayerURL = videoEl.currentSrc;
      if (newPlayerURL !== currentPlayerURL) {
        currentPlayerURL = newPlayerURL;
        onChange(newPlayerURL);
      }
    };

    const observer = new MutationObserver(() => {
      checkForChange();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } catch (err) {
    console.log("Error in watchRouteChanges: ", err);
  }
}

async function syncTheShowCR() {
  await browser.runtime.sendMessage({
    type: "sync_media",
    category: "anime",
    site: "CR",
  });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "stop_syncing" && message.site === "CR") {
    console.log("Hey I am inside of injectintoCR");
    clearInterval(interval);
  }
});
