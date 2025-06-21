console.log('I am running from the site"s script');
let interval = null;

browser.runtime.sendMessage({type: 'sync_media', category: 'anime', site: 'CR'})
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
    60000 // check every minute
  );
}

// when something in dom changes:
function onChange() {
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
}

async function syncTheShowCR() {
  await browser.runtime.sendMessage({type: 'sync_media', category: 'anime', site: 'CR'})
}
