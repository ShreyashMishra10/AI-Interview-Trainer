import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "AI-Trainer — Ace Your Technical Interview With an AI Mentor";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Amber glow — top left */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background: "rgba(251,191,36,0.09)",
            filter: "blur(90px)",
          }}
        />

        {/* Amber glow — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(251,191,36,0.06)",
            filter: "blur(80px)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: "100px",
            padding: "6px 18px",
            marginBottom: "36px",
          }}
        >
          <span
            style={{
              color: "#f59e0b",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            AI-Powered Interview Training
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "68px",
            fontWeight: "800",
            color: "#fafafa",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "28px",
            maxWidth: "860px",
          }}
        >
          Nail Your Next Interview{" "}
          <br />
          With an{" "}
          <span style={{ color: "#f59e0b" }}>AI Mentor</span>
        </div>

        {/* Sub-description */}
        <div
          style={{
            fontSize: "22px",
            color: "#a1a1aa",
            marginBottom: "56px",
            maxWidth: "680px",
            lineHeight: 1.55,
          }}
        >
          Mock interviews · CV builder · Voice mode · Analytics — free to start.
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
          {[
            { value: "10K+", label: "Interviews Done" },
            { value: "20+",  label: "Job Roles"       },
            { value: "500+", label: "Mock Scenarios"  },
            { value: "4.9★", label: "User Rating"     },
          ].map((s, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: "#f59e0b",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: "600",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Logo — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "18px" }}>⚡</span>
          </div>
          <span
            style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#fafafa",
              letterSpacing: "-0.04em",
            }}
          >
            AI-Trainer
          </span>
        </div>

        {/* Subtle bottom border line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
