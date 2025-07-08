import { getAnimeTitleinCR } from "../../utils/animeUtils.js";
import { escapeRegExp } from "../../utils/regexUtils.js";

async function extractAnimeInfoFromCR() {
  let animeTitleEl;
  let epNumberNameEl;

  try {
    animeTitleEl = await waitForElementtoLoad("a.show-title-link > h4");
    epNumberNameEl = await waitForElementtoLoad(
      "div.erc-current-media-info > h1"
    );
  } catch (err) {
    console.log("Error in crTracker extractAnimeInfoFromCR function: ", err);
    epNumberNameEl = await waitForElementtoLoad("div.show-heading-line > h1");
  }

  const isMovie = isItAMovieCR(epNumberNameEl);
  console.log(" is it a movie: ", isMovie);
  if (isMovie) {
    //removes " (English Dub)" if present from movie Title name
    const re = /\s*\(\s*English\s+Dub\s*\)/i;

    let movieName = epNumberNameEl.textContent.trim();
    movieName = movieName.replace(re, "").trim();

    console.log("Here is movie name:", movieName);
    console.log("what I returning");
    return {
      provider: "CR",
      category: "anime",
      media_type: "movie",
      title: movieName,
      fallback_title: animeTitleEl?.textContent?.trim() || null,
      episode_number: null,
      episode_title: null,
      progress: 85.0,
    };
  } else if (isMovie === false) {
    try {
      let animeTitleWhole = document.title;

      const epNameWhole = epNumberNameEl.textContent.trim();

      // captures string where first group is EpNumber, and second one is Episode Name
      const re = /^E(\d+)\s+[-—]\s+(.+)/;
      const result = epNameWhole.match(re);

      const epNumber = result?.[1];
      let epName = result?.[2].trim();

      epName = escapeRegExp(epName);
      console.log('Anime NAme and ep name" ', animeTitleWhole, epName);
      const animeTitle = getAnimeTitleinCR(animeTitleWhole, epName);

      console.log("anime title", animeTitle);
      return {
        provider: "CR",
        category: "anime",
        media_type: null,
        title: animeTitle,
        fallback_title: animeTitleEl.textContent.trim() || null,
        episode_number: Number(epNumber),
        episode_title: epName,
        progress: 85.0,
      };
    } catch (err) {
      console.log("Error in crTracker: ", err);
    }
  }
}

function isItAMovieCR(epNumberNameEl) {
  console.log("hello");
  const epNumberName = epNumberNameEl.textContent.trim();
  const re = /^E\d+(\.)?\d*\s*[-—]\s+/;

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
function showToast(message, type = "warning") {
  const toast = document.createElement("div");

  const icons = {
    warning: { symbol: "⚠️", color: "#ff9800" },
    error: { symbol: "❌", color: "#f44336" },
    success: { symbol: "✅", color: "#4caf50" },
    info: { symbol: "ℹ️", color: "#2196f3" },
  };

  const config = icons[type] || icons.warning;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="
        font-size: 20px;
        flex-shrink: 0;
      ">${config.symbol}</div>
      <span style="flex: 1; line-height: 1.4;">${message}</span>
    </div>
  `;

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translate(-50%, -100%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    border-left: 4px solid ${config.color};
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 400px;
    min-width: 320px;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    backdrop-filter: blur(10px);
  `;

  document.body.appendChild(toast);

  // Animate in - slide down from top
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, 0)";
  }, 10);

  // Auto remove after 4 seconds - slide back up
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -100%)";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// message listener
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "get_metadata" && message.site === "CR") {
    (async () => {
      try {
        console.log("I am inside of content script");
        const info = await extractAnimeInfoFromCR();
        sendResponse(info);
      } catch (err) {
        sendResponse({ message: "error", error: err });
      }
    })();
    return true;
  } else if (message.type === "send_alert") {
    showToast(message.message);
  }
});
