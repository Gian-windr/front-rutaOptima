import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VehicleRoute } from '../../types/api.types';

// Función para crear iconos numerados personalizados
const createNumberedIcon = (number: number, color: string = '#1976d2'): DivIcon => {
  return new DivIcon({
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">${number}</div>
    `,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Icono del depot (punto de inicio/fin)
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
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
  // Validar que routes exista y tenga elementos
  if (!routes || routes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay rutas para mostrar</p>
      </div>
    );
  }

  // Calcular centro del mapa basado en todas las paradas
  const allStops = routes.flatMap(route => route.stops || []);
  
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
        if (!route.stops || route.stops.length === 0) return null;
        
        // NUEVO: Usar routeGeometry si existe (rutas siguiendo calles)
        let routePositions: [number, number][] = [];
        
        if (route.routeGeometry?.coordinates && route.routeGeometry.coordinates.length > 0) {
          // ✅ Usar geometría OSRM (rutas siguiendo calles reales)
          // IMPORTANTE: Backend envía [lng, lat], Leaflet espera [lat, lng]
          routePositions = route.routeGeometry.coordinates.map(coord => [
            coord[1], // latitude
            coord[0]  // longitude
          ]);
          
          console.log(`🗺️ ${route.vehicleName}: Usando routeGeometry con ${routePositions.length} waypoints`);
        } else {
          // ❌ Fallback: líneas rectas (solo si no hay routeGeometry)
          console.warn(`⚠️ ${route.vehicleName}: routeGeometry no disponible, usando líneas rectas`);
          routePositions = [depotPosition];
          
          route.stops.forEach((stop) => {
            if (stop.latitude && stop.longitude) {
              routePositions.push([stop.latitude, stop.longitude]);
            }
          });
          
          routePositions.push(depotPosition);
        }

        return (
          <React.Fragment key={route.vehicleId}>
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
            {route.stops.map((stop) => {
              if (!stop.latitude || !stop.longitude) {
                console.warn('⚠️ Stop sin coordenadas:', stop);
                return null;
              }
              
              return (
              <Marker
                key={`${route.vehicleId}-${stop.sequence}`}
                position={[stop.latitude, stop.longitude]}
                icon={createNumberedIcon(stop.sequence, route.color)}
              >
                {/* TOOLTIP: Etiqueta siempre visible */}
                <Tooltip 
                  permanent 
                  direction="top" 
                  offset={[0, -20]}
                  className="custom-tooltip"
                >
                  <div style={{ 
                    textAlign: 'center', 
                    fontSize: '11px',
                    fontWeight: 'bold',
                    lineHeight: '1.3'
                  }}>
                    {stop.customerName}<br/>
                    <span style={{ color: route.color }}>
                      {stop.serviceTimeMin} min
                    </span>
                  </div>
                </Tooltip>
                
                {/* POPUP: Información detallada al hacer click */}
                <Popup maxWidth={300}>
                  <div style={{ fontFamily: 'Arial, sans-serif' }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '16px',
                      color: route.color,
                      borderBottom: `2px solid ${route.color}`,
                      paddingBottom: '8px'
                    }}>
                      Parada #{stop.sequence}
                    </h3>
                    
                    <div style={{ fontSize: '13px' }}>
                      <p style={{ margin: '8px 0' }}>
                        <strong>Tienda:</strong><br/>
                        {stop.customerName}
                      </p>
                      
                      <p style={{ margin: '8px 0' }}>
                        <strong>Dirección:</strong><br/>
                        {stop.direccion}
                      </p>
                      
                      <p style={{ margin: '8px 0' }}>
                        <strong>Tiempo de Descarga:</strong><br/>
                        <span style={{ 
                          color: route.color, 
                          fontWeight: 'bold',
                          fontSize: '15px'
                        }}>
                          {stop.serviceTimeMin} minutos
                        </span>
                      </p>
                      
                      <p style={{ margin: '8px 0' }}>
                        <strong>Llegada:</strong> {formatTime(stop.eta)}<br/>
                        <strong>Salida:</strong> {formatTime(stop.etd)}
                      </p>
                      
                      <p style={{ margin: '8px 0' }}>
                        <strong>Cantidad:</strong> {stop.cantidad} unidades
                      </p>
                      
                      {stop.volumen && stop.volumen > 0 && (
                        <p style={{ margin: '8px 0' }}>
                          <strong>Volumen:</strong> {stop.volumen.toFixed(2)} m³
                        </p>
                      )}
                      
                      {stop.peso && stop.peso > 0 && (
                        <p style={{ margin: '8px 0' }}>
                          <strong>Peso:</strong> {stop.peso.toFixed(2)} kg
                        </p>
                      )}
                      
                      <p style={{ margin: '8px 0' }}>
                        <strong>Desde anterior:</strong><br/>
                        {stop.distanceKmFromPrev.toFixed(2)} km • {stop.travelTimeMinFromPrev} min viaje
                      </p>
                      
                      {stop.waitTimeMin && stop.waitTimeMin > 0 && (
                        <p style={{ margin: '8px 0' }}>
                          <strong>Tiempo espera:</strong> {stop.waitTimeMin} min
                        </p>
                      )}
                      
                      <p style={{ 
                        margin: '12px 0 0 0', 
                        paddingTop: '8px',
                        borderTop: '1px solid #ddd',
                        color: '#666',
                        fontSize: '12px'
                      }}>
                        Vehículo: {route.vehicleName}<br/>
                        Conductor: {route.conductor}<br/>
                        Zona: {route.zona}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
              );
            })}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
