export function watchRouteChanges(onChange) {
  let currentURL = location.href;

  const checkForChange = () => {
    const newURL = location.href;
    if (newURL !== currentURL) {
      console.log("change detected", currentURL);
      currentURL = newURL;
      onChange(newURL);
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
