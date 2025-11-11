import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteStop } from '../../types/api.types';

// Fix para los iconos de Leaflet en producción
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const depotIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface RouteMapProps {
  stops: RouteStop[];
  depotPosition?: [number, number];
}

export function RouteMap({ stops, depotPosition = [-12.046374, -77.042793] }: RouteMapProps) {
  // Crear array de posiciones para la polyline
  const routePositions: [number, number][] = [];
  
  // Agregar depot al inicio
  routePositions.push(depotPosition);
  
  // Agregar todas las paradas
  stops.forEach((stop) => {
    if (stop.latitud && stop.longitud) {
      routePositions.push([stop.latitud, stop.longitud]);
    }
  });
  
  // Regresar al depot
  routePositions.push(depotPosition);

  // Colores para diferentes vehículos
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <MapContainer
      center={depotPosition}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador del depot */}
      <Marker position={depotPosition} icon={depotIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold">🏢 Depot Central</h3>
            <p className="text-sm">Punto de inicio y fin</p>
          </div>
        </Popup>
      </Marker>

      {/* Marcadores de las paradas */}
      {stops.map((stop) => {
        if (!stop.latitud || !stop.longitud) return null;
        
        return (
          <Marker
            key={stop.id}
            position={[stop.latitud, stop.longitud]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Parada #{stop.secuencia}</h3>
                <p className="text-sm">{stop.orderNombre}</p>
                <p className="text-xs text-gray-600 mt-1">
                  ETA: {new Date(stop.eta).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-600">
                  ETD: {new Date(stop.etd).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-600">
                  Distancia: {stop.distanciaKmDesdeAnterior.toFixed(1)} km
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Línea de la ruta */}
      {routePositions.length > 1 && (
        <Polyline
          positions={routePositions}
          color={colors[0]}
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}
