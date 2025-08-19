export interface NavLinkType {
  link: string;
  label: string;
}

export const links: NavLinkType[] = [
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
