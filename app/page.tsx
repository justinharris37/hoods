"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState<string>("Initializing…");

  useEffect(() => {
    (async () => {
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined;
        console.log("Token present?", !!token, token?.slice(0, 10) + "…");
        if (!token || token.length < 40 || !token.startsWith("pk.")) {
          setStatus("Missing/short token. Update NEXT_PUBLIC_MAPBOX_TOKEN in .env.local and restart the server.");
          return;
        }

        const mapboxgl = (await import("mapbox-gl")).default;
        const supported = mapboxgl.supported({ failIfMajorPerformanceCaveat: false });
        console.log("WebGL supported?", supported);
        if (!supported) {
          setStatus("WebGL not supported. Click Ports → globe to open in full browser, not the embedded preview.");
          return;
        }

        mapboxgl.accessToken = token;
        if (!mapContainer.current || mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-97.7431, 30.2672], // Austin
          zoom: 10
        });

        // Controls + marker so we have something to see
        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        mapRef.current.on("load", () => {
          console.log("Map load event fired");
          new mapboxgl.Marker().setLngLat([-97.7431, 30.2672]).addTo(mapRef.current);
          setStatus(""); // clear status
          mapRef.current.resize();
        });

        // Extra diagnostics
        mapRef.current.on("styledata", (e: any) => console.log("styledata", e));
        mapRef.current.on("sourcedata", (e: any) => console.log("sourcedata", e));
        mapRef.current.on("error", (e: any) => {
          console.error("Mapbox error:", e?.error || e);
          setStatus("Map error — open DevTools Console for details (likely token or URL restriction).");
        });

      } catch (err: any) {
        console.error(err);
        setStatus("Map failed to initialize. See DevTools Console for details.");
      }
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Hoods</h1>
        <p style={{ opacity: 0.7 }}>Austin, TX — prototype</p>
      </header>

      <div style={{ padding: 16 }}>
        {status ? (
          <div style={{ marginBottom: 12, padding: 12, border: "1px solid #f59e0b", background: "#fff7ed", borderRadius: 8 }}>
            {status}
          </div>
        ) : null}
        <div ref={mapContainer} style={{ width: "100%", height: "70vh", borderRadius: 12, border: "1px solid #ddd" }} />
      </div>
    </main>
  );
}
