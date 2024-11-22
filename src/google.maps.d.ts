declare namespace google.maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      addListener(eventName: string, handler: (event: MapMouseEvent) => void): void;
    }
  
    interface MapOptions {
      center: LatLngLiteral;
      zoom: number;
    }
  
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | null;
      setPosition(position: LatLng | LatLngLiteral): void;  // Aquí añadimos setPosition

    }
  
    interface MarkerOptions {
      position: LatLngLiteral;
      map: Map;
      title?: string;
    }
  
    class DirectionsService {
      route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void;
    }
  
    class DirectionsRenderer {
      setMap(map: Map): void;
      setDirections(result: DirectionsResult): void;
    }
  
    interface DirectionsRequest {
      origin: LatLng | LatLngLiteral | string;
      destination: LatLng | LatLngLiteral | string;
      travelMode: TravelMode;
    }
  
    interface DirectionsResult {
      routes: DirectionsRoute[];
    }
  
    interface DirectionsRoute {
      legs: DirectionsLeg[];
    }
  
    interface DirectionsLeg {
      start_address: string;
      end_address: string;
      distance: Distance;
      duration: Duration;
    }
  
    interface Distance {
      text: string;
      value: number;
    }
  
    interface Duration {
      text: string;
      value: number;
    }
  
    interface MapMouseEvent {
      latLng: LatLng | null;
    }
  
    class LatLng {
      constructor(lat: number, lng: number);
      toJSON(): LatLngLiteral;
    }
  
    type DirectionsStatus =
      | 'OK'
      | 'NOT_FOUND'
      | 'ZERO_RESULTS'
      | 'MAX_WAYPOINTS_EXCEEDED'
      | 'INVALID_REQUEST'
      | 'OVER_QUERY_LIMIT'
      | 'REQUEST_DENIED'
      | 'UNKNOWN_ERROR';
  
    type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  }
  