import { time } from "motion";
import { watchRouteChanges } from "../watchRouteChange";

watchRouteChanges((newUrl) => {
  console.log("new url:", newUrl);
});

// when page is loaded

if (url.pathname.includes("/watch/")) {
  console.log("user is on the watch page!!");
}

async function startCRTracker() {
  const url = new URL(window.location.href);
  if (!url.pathname.includes("/watch/")) return;

  console.log("User is on watch page");
  const info = await extractAnimeInfoFromCR();
}

async function extractAnimeInfoFromCR() {}

async function waitForElementtoLoad(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // automatically rejects the promise after 5000 ms
    const timer = setTimeout(() => {
      reject(new Error(`Element not found: ${selector}`));
    }, timeout);

    // check the DOM every 100ms to see if the element is available
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval); // stop setInterval
        clearTimeout(timer); // cancel the timer
        resolve(el); // sends resolve
      }
    }, 100);
  });
}
