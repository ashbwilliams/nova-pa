import type { NextConfig } from "next";

function mediaHost() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return { protocol: "https" as const, hostname: "**.supabase.co" };

  try {
    const url = new URL(value);
    return {
      protocol: url.protocol === "http:" ? ("http" as const) : ("https" as const),
      hostname: url.hostname,
    };
  } catch {
    return { protocol: "https" as const, hostname: "**.supabase.co" };
  }
}

const storage = mediaHost();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: storage.protocol,
        hostname: storage.hostname,
        port: "",
        pathname: "/storage/v1/object/public/site-media/**",
        search: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
