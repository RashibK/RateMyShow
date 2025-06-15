import { watchRouteChanges } from "../watchRouteChange";

console.log("crTracker loaded");

watchRouteChanges((newUrl) => {
  console.log("new url:", newUrl);
});
