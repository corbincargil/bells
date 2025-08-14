self.addEventListener("push", (e) => {
  if (Notification.permission == "denied") {
    console.log(Notification.permission);
    console.log("Notification permission not granted");
    return;
  }
  const options = {
    body: e.data.text(),
    icon: "/logo.png",
  };
  e.waitUntil(self.registration.showNotification("Hello from Bells", options));
});
