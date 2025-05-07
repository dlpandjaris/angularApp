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
  search_holes: number = 0;
  search_marker: {
      position: {
        lat: number,
        lng: number
      },
      title: string,
      label: string,
      icon: string
      options: {
        animation: google.maps.Animation
      }
    } | null = null;
  isLoading = false;
  isDarkMode = false;
  isListView = false;

  // Time range filter
  timeRanges = [
    { label: 'Early Morning (6AM - 9AM)', start: 6, end: 9 },
    { label: 'Late Morning (9AM - 12PM)', start: 9, end: 12 },
    { label: 'Early Afternoon (12PM - 3PM)', start: 12, end: 15 },
    { label: 'Late Afternoon (3PM - 6PM)', start: 15, end: 18 },
    { label: 'Evening (6PM - 8PM)', start: 18, end: 20 }
  ];
  selectedTimeRange: { start: number; end: number } | null = null;

  // Holes options
  holesOptions = [
    { value: 0, label: 'Any' },
    { value: 9, label: '9 Holes' },
    { value: 18, label: '18 Holes' }
  ];

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

  // Sorting properties
  sortConfig: { column: string; direction: 'asc' | 'desc' }[] = [];
  sortableColumns = [
    { key: 'course', label: 'Course' },
    { key: 'tee_time', label: 'Time' },
    { key: 'players', label: 'Players' },
    { key: 'holes', label: 'Holes' },
    { key: 'price', label: 'Price' }
  ];

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
    const coords = {
      min_lat: this.map?.getBounds()?.getSouthWest().lat(),
      min_lon: this.map?.getBounds()?.getSouthWest().lng(),
      max_lat: this.map?.getBounds()?.getNorthEast().lat(),
      max_lon: this.map?.getBounds()?.getNorthEast().lng()
    }
    this.teeTimeService.getTeeTimes(this.search_date, this.search_players, coords).subscribe({
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
    this.loadTeeTimes();
  }

  onHolesChange() {
    this.loadTeeTimes();
  }

  onTimeRangeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
  
    // Because you're using [ngValue], the value is already bound to the object in ngModel.
    // So this function is likely unnecessary, unless you're doing extra logic here.
    this.filterTeeTimes();
  }

  onMapBoundsChanged() {
    const center = this.map?.getCenter();
    const usBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(24.396308, -124.848974), // Southwest corner (California/Florida Keys)
      new google.maps.LatLng(49.384358, -66.93457)    // Northeast corner (Maine/North Dakota)
    );

    const bounds = this.map?.getBounds();

    if (usBounds.contains(center!)) {
      if (bounds) {
        this.mapBounds = bounds;
        this.filterTeeTimes();
      }
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

  toggleSort(column: string) {
    const existingSort = this.sortConfig.find(sort => sort.column === column);
    
    if (existingSort) {
      // If already sorting by this column, cycle through: asc -> desc -> remove
      if (existingSort.direction === 'asc') {
        existingSort.direction = 'desc';
      } else {
        this.sortConfig = this.sortConfig.filter(sort => sort.column !== column);
      }
    } else {
      // Add new sort
      this.sortConfig.push({ column, direction: 'asc' });
    }

    this.filterTeeTimes();
  }

  getSortIcon(column: string): string {
    const sort = this.sortConfig.find(s => s.column === column);
    if (!sort) return 'fa-sort';
    return sort.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  private filterTeeTimes(): void {
    if (!this.mapBounds) {
      this.filtered_tee_times = this.all_tee_times;
      return;
    }

    let filtered = this.all_tee_times.filter(tee => {
      const position = new google.maps.LatLng(tee.lat, tee.lon);
      const isInBounds = this.mapBounds!.contains(position);
      const meetsPlayerCount = this.search_players <= tee.players;
      const matchesCourse = !this.search_course || this.search_course === tee.course;
      const matchesHoles = !this.search_holes || tee.holes === this.search_holes;
      
      // Time range filter
      const teeTime = new Date(tee.tee_time);
      const teeHour = teeTime.getHours();
      const matchesTimeRange = !this.selectedTimeRange || 
        (teeHour >= this.selectedTimeRange.start && teeHour < this.selectedTimeRange.end);

      return isInBounds && meetsPlayerCount && matchesCourse && matchesTimeRange && matchesHoles;
    });

    // Apply sorting
    if (this.sortConfig.length > 0) {
      filtered.sort((a, b) => {
        for (const sort of this.sortConfig) {
          let comparison = 0;
          
          switch (sort.column) {
            case 'course':
              comparison = a.course.localeCompare(b.course);
              break;
            case 'tee_time':
              comparison = new Date(a.tee_time).getTime() - new Date(b.tee_time).getTime();
              break;
            case 'players':
              comparison = a.players - b.players;
              break;
            case 'holes':
              comparison = a.holes - b.holes;
              break;
            case 'price':
              comparison = a.price - b.price;
              break;
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    this.filtered_tee_times = filtered;
  }

  onMarkerClick(marker: any) { //courseName: string): void {
    console.log('marker clicked:', marker); 
    if (this.search_marker !== marker || this.search_marker === null) {
      console.log('marker new');
      this.search_marker = marker;
      // Center the map on the selected marker
      const selectedMarker = this.markers.find(m => m === marker);
      if (selectedMarker?.position) {
        this.center = selectedMarker.position as google.maps.LatLngLiteral;

        if (this.map?.getCenter()) {
          this.last_center = { lat: this.map.getCenter()!.lat(), lng: this.map.getCenter()!.lng() };
        }
        this.last_zoom = this.zoom;
        this.zoom = 20; // Zoom in when selecting a course
    }
    } else {
      this.search_marker = null;
      // Reset zoom and center when deselecting
      this.center = this.last_center || { lat: 39.1011, lng: -94.5825 }; // Kansas City
      this.zoom = this.last_zoom || 9; // Default zoom
    }
    this.filterTeeTimes();
  }

  toggleView() {
    this.isListView = !this.isListView;
  }
}
