import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements AfterViewInit {
  private map!: google.maps.Map;
  private originMarker: google.maps.Marker | null = null;
  private destinationMarker: google.maps.Marker | null = null;
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer();

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const mapElement = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(mapElement, {
      center: { lat: 19.4326, lng: -99.1332 }, // Coordenadas iniciales
      zoom: 14
    });

    this.directionsRenderer.setMap(this.map);

    // Añadir listener para clic en el mapa
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      this.handleMapClick(event);
    });
  }

  private handleMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;

    if (!this.originMarker) {
      // Configurar el origen
      this.originMarker = new google.maps.Marker({
        position: event.latLng.toJSON(), // Usar toJSON() para obtener LatLngLiteral
        map: this.map,
        title: 'Origen',
        draggable: true
      });
    } else if (!this.destinationMarker) {
      // Configurar el destino
      this.destinationMarker = new google.maps.Marker({
        position: event.latLng.toJSON(), // Usar toJSON() para obtener LatLngLiteral
        map: this.map,
        title: 'Destino',
        draggable: true
      });

      // Calcular y mostrar la ruta
      this.calculateRoute();
    }
  }

  private calculateRoute(): void {
    if (!this.originMarker || !this.destinationMarker) return;
  
    const request: google.maps.DirectionsRequest = {
      origin: this.originMarker.getPosition()!.toJSON(), // Usar toJSON() para obtener LatLngLiteral
      destination: this.destinationMarker.getPosition()!.toJSON(), // Usar toJSON() para obtener LatLngLiteral
      travelMode: 'DRIVING' as google.maps.TravelMode
    };
  
    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        alert('No se pudo calcular la ruta: ' + status);
      }
    });
  }
  
  searchRoute(): void {
    const originInput = (document.getElementById('origin-input') as HTMLInputElement).value;
    const destinationInput = (document.getElementById('destination-input') as HTMLInputElement).value;
  
    if (!originInput || !destinationInput) {
      alert('Por favor ingrese tanto el origen como el destino.');
      return;
    }
  
    const geocoder = new google.maps.Geocoder();
  
    // Geocodificar el origen
    geocoder.geocode({ address: originInput }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const originLocation: google.maps.LatLngLiteral = results[0].geometry.location.toJSON(); // Convertir a LatLngLiteral
        // Asegurarse de que el marcador de origen se coloque correctamente
        if (this.originMarker) {
          this.originMarker.setPosition(originLocation);
        } else {
          this.originMarker = new google.maps.Marker({
            position: originLocation, // La ubicación geocodificada como LatLngLiteral
            map: this.map,
            title: 'Origen',
            draggable: true
          });
        }
      } else {
        alert('No se pudo encontrar el origen: ' + status);
        return;
      }
  
      // Geocodificar el destino
      geocoder.geocode({ address: destinationInput }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const destinationLocation: google.maps.LatLngLiteral = results[0].geometry.location.toJSON(); // Convertir a LatLngLiteral
          // Asegurarse de que el marcador de destino se coloque correctamente
          if (this.destinationMarker) {
            this.destinationMarker.setPosition(destinationLocation);
          } else {
            this.destinationMarker = new google.maps.Marker({
              position: destinationLocation, // La ubicación geocodificada como LatLngLiteral
              map: this.map,
              title: 'Destino',
              draggable: true
            });
          }
  
          // Calcular y mostrar la ruta
          this.calculateRoute();
        } else {
          alert('No se pudo encontrar el destino: ' + status);
        }
      });
    });
  }
}  