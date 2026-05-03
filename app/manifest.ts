import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "AI-Trainer — Interview Prep",
    short_name:       "AI-Trainer",
    description:      "Practice technical interviews with an AI mentor. Mock sessions, CV builder, voice mode, and analytics.",
    start_url:        "/dashboard",
    display:          "standalone",
    background_color: "#08080e",
    theme_color:      "#fbbf24",
    icons: [
      { src: "/favicon.ico", sizes: "any",     type: "image/x-icon" },
      { src: "/favicon.ico", sizes: "192x192", type: "image/png"    },
      { src: "/favicon.ico", sizes: "512x512", type: "image/png"    },
    ],
  };
}
