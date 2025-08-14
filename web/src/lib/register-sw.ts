export default function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("SW registered");
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });
  }
}
