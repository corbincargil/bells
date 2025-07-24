export interface NavLink {
  link: string;
  label: string;
}

export const links: NavLink[] = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "/notifications",
    label: "Notifications",
  },
  {
    link: "/webhooks",
    label: "Webhooks",
  },
  {
    link: "/settings",
    label: "Settings",
  },
];
