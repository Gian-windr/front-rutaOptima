import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VehicleRoute } from '../../types/api.types';

// Iconos de Leaflet
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
  routes: VehicleRoute[];
  depotPosition?: [number, number];
}

const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return 'N/A';
  }
};

export function RouteMap({ routes, depotPosition = [-12.046374, -77.042793] }: RouteMapProps) {
  // Calcular centro del mapa basado en todas las paradas
  const allStops = routes.flatMap(route => route.stops);
  
  const center: [number, number] = allStops.length > 0
    ? [
        allStops.reduce((sum, stop) => sum + stop.latitude, 0) / allStops.length,
        allStops.reduce((sum, stop) => sum + stop.longitude, 0) / allStops.length
      ]
    : depotPosition;

  return (
    <MapContainer
      center={center}
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
            <h3 className="font-semibold">Depot Central</h3>
            <p className="text-sm">Punto de inicio y fin</p>
          </div>
        </Popup>
      </Marker>

      {/* Rutas por vehículo */}
      {routes.map((route) => {
        // Crear polyline para esta ruta
        const routePositions: [number, number][] = [depotPosition];
        
        route.stops.forEach((stop) => {
          routePositions.push([stop.latitude, stop.longitude]);
        });
        
        routePositions.push(depotPosition);

        return (
          <>
            {/* Polyline de la ruta con el color del vehículo */}
            {routePositions.length > 1 && (
              <Polyline
                key={`polyline-${route.vehicleId}`}
                positions={routePositions}
                color={route.color}
                weight={3}
                opacity={0.7}
              />
            )}

            {/* Marcadores de las paradas */}
            {route.stops.map((stop) => (
              <Marker
                key={`${route.vehicleId}-${stop.sequence}`}
                position={[stop.latitude, stop.longitude]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="p-2">
                    <div 
                      className="w-3 h-3 rounded-full inline-block mr-1"
                      style={{ backgroundColor: route.color }}
                    />
                    <h3 className="font-semibold inline">Parada #{stop.sequence}</h3>
                    <p className="text-sm mt-1">{stop.customerName}</p>
                    <div className="mt-2 text-xs">
                      <p><strong>Vehículo:</strong> {route.vehicleName}</p>
                      <p><strong>Conductor:</strong> {route.conductor}</p>
                      <p><strong>Zona:</strong> {route.zona}</p>
                      <p><strong>Llegada:</strong> {formatTime(stop.eta)}</p>
                      <p><strong>Salida:</strong> {formatTime(stop.etd)}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        );
      })}
    </MapContainer>
  );
}
