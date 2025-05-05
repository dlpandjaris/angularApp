import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { TeeTime } from '../models/tee-time';
import { TeeTimeService } from '../services/tee-time.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-one-tee-sheet-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './one-tee-sheet-layout.component.html',
  styleUrl: './one-tee-sheet-layout.component.scss'
})
export class OneTeeSheetLayoutComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  all_tee_times: TeeTime[] = [];
  filtered_tee_times: TeeTime[] = [];
  search_date = new Date().toISOString().split('T')[0];
  search_players = 4;
  search_course = '';
  isLoading = false;
  isDarkMode = false;

  // Time range filter
  timeRanges = [
    { label: 'Early Morning (6AM - 9AM)', start: 6, end: 9 },
    { label: 'Late Morning (9AM - 12PM)', start: 9, end: 12 },
    { label: 'Early Afternoon (12PM - 3PM)', start: 12, end: 15 },
    { label: 'Late Afternoon (3PM - 6PM)', start: 15, end: 18 },
    { label: 'Evening (6PM - 8PM)', start: 18, end: 20 }
  ];
  selectedTimeRange: { start: number; end: number } | null = null;

  // Google Maps properties
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  zoom = 9;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
    // backgroundColor: this.isDarkMode ? 'black' : null,
    clickableIcons: true,
  };
  markers: google.maps.MarkerOptions[] = [];
  mapBounds: google.maps.LatLngBounds | null = null;
  last_center: { lat: number; lng: number; } | undefined;
  last_zoom: number | undefined;

  constructor(
    private teeTimeService: TeeTimeService
  ) { }

  ngOnInit() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.loadTeeTimes();
        },
        (error) => {
          console.error('Error getting location:', error);
          this.center = { lat: 39.1011, lng: -94.5825 }; // Kansas City
          this.loadTeeTimes();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.center = { lat: 39.1011, lng: -94.5825 }; // Kansas City
      this.loadTeeTimes();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  loadTeeTimes() {
    this.isLoading = true;
    this.teeTimeService.getTeeTimes(this.search_date, this.search_players).subscribe({
      next: (data: TeeTime[]) => {
        this.all_tee_times = data;
        this.updateMarkers();
        this.filterTeeTimes();
      },
      error: (error) => {
        console.error('Error loading tee times:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onDateChange() {
    this.loadTeeTimes();
  }

  onPlayersChange() {
    this.filterTeeTimes();
  }

  // onTimeRangeChange(range: { start: number; end: number } | null) {
  //   this.selectedTimeRange = range;
  //   this.filterTeeTimes();
  // }

  onTimeRangeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
  
    // Because you're using [ngValue], the value is already bound to the object in ngModel.
    // So this function is likely unnecessary, unless you're doing extra logic here.
    this.filterTeeTimes();
  }

  onMapBoundsChanged() {
    const bounds = this.map?.getBounds();
    if (bounds) {
      this.mapBounds = bounds;
      this.filterTeeTimes();
    }
    return bounds;
  }

  private updateMarkers() {
    this.markers = this.all_tee_times.map(tee => ({
      position: {
        lat: tee.lat,
        lng: tee.lon
      },
      title: tee.course,
      label: tee.course,
      icon: 'https://maps.google.com/mapfiles/kml/shapes/golf.png',
      options: {
        animation: google.maps.Animation.DROP
      }
    }));
  }

  private filterTeeTimes(): void {
    if (!this.mapBounds) {
      this.filtered_tee_times = this.all_tee_times;
      return;
    }

    this.filtered_tee_times = this.all_tee_times.filter(tee => {
      const position = new google.maps.LatLng(tee.lat, tee.lon);
      const isInBounds = this.mapBounds!.contains(position);
      const meetsPlayerCount = this.search_players >= tee.players;
      const matchesCourse = !this.search_course || this.search_course === tee.course;
      
      // Time range filter
      const teeTime = new Date(tee.tee_time);
      const teeHour = teeTime.getHours();
      const matchesTimeRange = !this.selectedTimeRange || 
        (teeHour >= this.selectedTimeRange.start && teeHour < this.selectedTimeRange.end);

      return isInBounds && meetsPlayerCount && matchesCourse && matchesTimeRange;
    });
  }

  onMarkerClick(courseName: string): void {
    console.log('Marker clicked:', courseName);
    if (this.search_course !== courseName) {
      this.search_course = courseName;
      // Center the map on the selected course
      const selectedTeeTime = this.all_tee_times.find(tee => tee.course === courseName);
      if (selectedTeeTime) {
        this.center = {
          lat: selectedTeeTime.lat,
          lng: selectedTeeTime.lon
        };
        if (this.map?.getCenter()) {
          this.last_center = { lat: this.map.getCenter()!.lat(), lng: this.map.getCenter()!.lng() };
        }
        this.last_zoom = this.zoom;
        this.zoom = 20; // Zoom in when selecting a course
    }
    } else {
      this.search_course = '';
      // Reset zoom and center when deselecting
      this.center = this.last_center || { lat: 39.1011, lng: -94.5825 }; // Kansas City
      this.zoom = this.last_zoom || 9; // Default zoom
    }
    this.filterTeeTimes();
  }
}
