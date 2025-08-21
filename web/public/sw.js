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
    icon: "/favicon-96x96.png",
    badge: "/favicon-96x96.png",
  };
  e.waitUntil(self.registration.showNotification(data.title, options));
});

// todo: relocate manager icon to left of Honk
// todo: update details/form buttons on mobile
// todo: add height to header
// todo: don't need toast success for archive/unarchive
// todo: add better home page or remove
// todo: figure out why the app does not load in browswer on mobile
// todo: fix copy to clipboard in prod
// todo: figure out & fix bug with external services saying "failed" but notifications going through
// todo: add cron for automatically clearing archived notifications. (include ability for users to change this setting and edit frequency)
// todo: add "clear all" notifications button
