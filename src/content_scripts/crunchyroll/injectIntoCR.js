console.log('I am running from the site"s script');

setInterval(
  () => {
    getCurrentDuration();
  },
  60000 // check every minute
);

function getCurrentDuration() {
  const videoEl = document.querySelector("#player0");
  const currentDuration = videoEl.currentTime;
  const totalDuration = videoEl.duration;

  if (((currentDuration / totalDuration) * 100).toFixed(2) >= 80.0) {
    console.log("sync the show");
  }
}
