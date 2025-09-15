import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for different marker types
const createCustomIcon = (color: string, symbol: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${symbol}</div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

const originIcon = createCustomIcon('#10B981', 'S') // Start - Green
const pickupIcon = createCustomIcon('#F59E0B', 'P') // Pickup - Amber  
const destinationIcon = createCustomIcon('#EF4444', 'D') // Destination - Red
const fuelIcon = createCustomIcon('#3B82F6', '⛽') // Fuel - Blue
const restIcon = createCustomIcon('#8B5CF6', '🛏️') // Rest - Purple

interface RoutePoint {
  lat: number
  lng: number
  name: string
  type: 'origin' | 'pickup' | 'destination' | 'fuel' | 'rest'
  description?: string
}

interface RouteMapProps {
  points: RoutePoint[]
  routeCoordinates?: [number, number][]
  className?: string
}

export function RouteMap({ points, routeCoordinates, className = '' }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Calculate map bounds to fit all points
  const bounds = React.useMemo(() => {
    if (points.length === 0) return undefined
    
    const lats = points.map(p => p.lat)
    const lngs = points.map(p => p.lng)
    
    return L.latLngBounds([
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ])
  }, [points])

  const getIcon = (type: RoutePoint['type']) => {
    switch (type) {
      case 'origin': return originIcon
      case 'pickup': return pickupIcon
      case 'destination': return destinationIcon
      case 'fuel': return fuelIcon
      case 'rest': return restIcon
      default: return originIcon
    }
  }

  const getMarkerTitle = (type: RoutePoint['type']) => {
    switch (type) {
      case 'origin': return 'Starting Location'
      case 'pickup': return 'Pickup Location'
      case 'destination': return 'Destination'
      case 'fuel': return 'Fuel Stop'
      case 'rest': return 'Rest Break'
      default: return 'Location'
    }
  }

  useEffect(() => {
    // Fit map to bounds when points change
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [bounds])

  if (points.length === 0) {
    return (
      <div className={`h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🗺️</div>
          <p>Route map will appear here after trip planning</p>
        </div>
      </div>
    )
  }

  // Default center (fallback)
  const center: [number, number] = points.length > 0 
    ? [points[0].lat, points[0].lng] 
    : [39.8283, -98.5795] // Geographic center of US

  return (
    <div className={`h-96 rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        bounds={bounds}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline 
            positions={routeCoordinates}
            color="#2563EB"
            weight={4}
            opacity={0.7}
          />
        )}
        
        {/* Location markers */}
        {points.map((point, index) => (
          <Marker
            key={`${point.type}-${index}`}
            position={[point.lat, point.lng]}
            icon={getIcon(point.type)}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {getMarkerTitle(point.type)}
                </h3>
                <p className="text-gray-700 mb-1">{point.name}</p>
                {point.description && (
                  <p className="text-gray-600 text-xs">{point.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default RouteMap