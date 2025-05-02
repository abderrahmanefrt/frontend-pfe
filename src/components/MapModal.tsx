import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapModalProps {
  onConfirm: (coords: { lat: number; lng: number }, placeName: string) => void;
  onClose: () => void;
}

// Note: this stub uses Leaflet.js (make sure to install leaflet and react-leaflet if using in real app)
const MapModal: React.FC<MapModalProps> = ({ onConfirm, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map>();
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [placeName, setPlaceName] = useState<string>("");

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
        // Initialize Leaflet map
        leafletMap.current = L.map(mapRef.current).setView([36.75, 3.06], 12);
  
        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(leafletMap.current);
  
        // Click handler to select a point
        leafletMap.current.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setSelectedCoords({ lat, lng });
          setPlaceName(`Lat ${lat.toFixed(3)}, Lng ${lng.toFixed(3)}`);
  
          // Remove existing marker, then add new marker
          leafletMap.current!.eachLayer(layer => {
            if ((layer as any).options && (layer as any).options.pane === "markerPane") {
              leafletMap.current!.removeLayer(layer);
            }
          });
          L.marker([lat, lng]).addTo(leafletMap.current!);
        });
      }
    }, []);
  
    const handleUseMyLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setSelectedCoords(coords);
          setPlaceName("Your Location");
          // center map and add marker
          leafletMap.current?.setView([coords.lat, coords.lng], 14);
          L.marker([coords.lat, coords.lng]).addTo(leafletMap.current!);
        },
        (err) => alert("Geolocation error: " + err.message)
      );
    };
  
    return createPortal(
      <div className="modal-backdrop">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Location</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div ref={mapRef} style={{ height: "400px" }} />
              <button className="btn btn-outline-secondary mt-3" onClick={handleUseMyLocation}>
                Use My Current Location
              </button>
              {selectedCoords && (
                <p className="mt-2">
                  Selected: {placeName}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => selectedCoords && onConfirm(selectedCoords, placeName)}
                disabled={!selectedCoords}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };
  
  export default MapModal;
  