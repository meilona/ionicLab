import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CreatePage} from '../week10/create/create.page';

declare var google: any;

@Component({
  selector: 'app-loc-coordinate',
  templateUrl: './loc-coordinate.page.html',
  styleUrls: ['./loc-coordinate.page.scss'],
})
export class LocCoordinatePage implements OnInit {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  // @ViewChild('refresherRef') refresherRef;
  umnPos: any = {
    lat: -6.256081,
    lng: 106.618755
  };

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.initMap(this.umnPos);
  }

  initMap(pos: any) {
    const location = new google.maps.LatLng(pos.lat, pos.lng);
    const options = {
      center: location,
      zoom: 10,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // CreatePage the initial InfoWindow
    this.infoWindow = new google.maps.InfoWindow({
      content: 'Click the map to get Lat/Lng!',
      position: this.umnPos,
    });
    this.infoWindow.open();

    // Configure the click listener
    this.map.addListener('click', (mapsMouseEvent) => {
      // Close the current InfoWindow
      this.infoWindow.close();

      // Create a new InfoWindow.
      this.infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      this.infoWindow.setContent(
          JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      this.infoWindow.open(this.map);
    });
  }

}
