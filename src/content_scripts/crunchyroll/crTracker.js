import { time } from "motion";
import { watchRouteChanges } from "../watchRouteChange";

watchRouteChanges((newUrl) => {
  console.log("new url:", newUrl);
  extractAnimeInfoFromCR();
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

async function extractAnimeInfoFromCR() {
  const animeTitleEl = await waitForElementtoLoad("a.show-title-link > h4");
  const epNumberNameEl = await waitForElementtoLoad(
    "div.erc-current-media-info > h1"
  );

  const isMovie = isItAMovieCR(epNumberNameEl);
  console.log(" is it a movie: ", isMovie);
  if (isMovie) {
    //removes " (English Dub)" if present from movie Title name
    const re = /\s*\(\s*English\s+Dub\s*\)/i;

    let movieName = epNumberNameEl.textContent.trim();
    movieName = movieName.replace(re, "").trim();

    console.log("Here is movie name:", movieName);
  } else if (isMovie === false) {
    const animeTitle = animeTitleEl.textContent.trim();

    const epNameWhole = epNumberNameEl.textContent.trim();

    // captures string where first group is EpNumber, and second one is Episode Name
    const re = /^E(\d+)\s+[-—]\s+(.+)/;
    const result = epNameWhole.match(re);

    const epNumber = result?.[1];
    const epName = result?.[2];
  }
}

function isItAMovieCR(epNumberNameEl) {
  console.log("hello");
  const epNumberName = epNumberNameEl.textContent.trim();
  const re = /^E\d+(\.)?\d+\s*[-—]\s+/;

  const result = epNumberName.match(re);

  if (!result) {
    return true;
  } else {
    if (result?.[1] === ".") {
      return "skip";
    } else {
      return false;
    }
  }
}

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
