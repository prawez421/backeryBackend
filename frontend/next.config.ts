import type { NextConfig } from "next";

const storageUrl = new URL(
  process.env.NEXT_PUBLIC_STORAGE_URL ||
    "http://127.0.0.1:8000/storage"
);
const storageProtocol = storageUrl.protocol.slice(0, -1);

if (storageProtocol !== "http" && storageProtocol !== "https") {
  throw new Error("NEXT_PUBLIC_STORAGE_URL must use http or https");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: storageProtocol,
        hostname: storageUrl.hostname,
        port: storageUrl.port,
        pathname: `${storageUrl.pathname.replace(/\/+$/, "")}/**`,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;