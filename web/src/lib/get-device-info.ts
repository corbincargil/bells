import type { DeviceInfo } from "@/types/subscription";

const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;

  let browser = "Unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  let platform = "Unknown";
  if (ua.includes("Mac")) platform = "macOS";
  else if (ua.includes("Windows")) platform = "Windows";
  else if (ua.includes("Linux")) platform = "Linux";
  else if (ua.includes("iPhone") || ua.includes("iPad")) platform = "iOS";
  else if (ua.includes("Android")) platform = "Android";

  const name = `${browser} on ${platform}`;

  return { name, browser, platform };
};

export default getDeviceInfo;
