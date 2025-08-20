self.addEventListener("push", (e) => {
  if (Notification.permission == "denied") {
    console.log(Notification.permission);
    console.log("Notification permission not granted");
    return;
  }

  // todo: store notification in database from here
  // todo: add ability to open notification to specific details page
  const data = e.data.json();
  const options = {
    body: data.message,
    icon: "/honk-favicon/favicon-96x96.png",
    badge: "/honk-favicon/favicon-96x96.png",
  };
  e.waitUntil(self.registration.showNotification(data.title, options));
});
