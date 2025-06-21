console.log('I am running from the site"s script');
let interval = null;

// on page load:
console.log("Script injected into static.crunchyroll.com");
startSync();
getCurrentDuration();

function startSync() {
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
  startSync();
}
watchRouteChanges(onChange);

function getCurrentDuration() {
  const videoEl = document.querySelector("#player0");
  console.log(videoEl);
  const currentDuration = videoEl.currentTime;
  const totalDuration = videoEl.duration;

  if (((currentDuration / totalDuration) * 100).toFixed(2) >= 80.0) {
    console.log("sync the show");
  } else {
    console.log('not yet');
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
