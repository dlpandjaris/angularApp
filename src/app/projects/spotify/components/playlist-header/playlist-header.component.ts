import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-playlist-header',
  templateUrl: './playlist-header.component.html',
  styleUrl: './playlist-header.component.scss'
})
export class PlaylistHeaderComponent {

  @Input() coverImageUrl!: string;
  // @Input() bigCoverImageUrl!: string;
  @Input() type: string = 'Feature';
  @Input() title: string = '';
  @Input() author!: UserProfile;
  @Input() countLabel!: string;
  @Input() durationLabel!: string;

  @ViewChild('mainHeader') mainHeaderRef!: ElementRef;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.get_background_color();
  }

  @HostListener('setHeaderTitleSize')
  resizeHeaderText(): void {
    console.log(this.mainHeaderRef.nativeElement.clientWidth);
  }

  set_background_color(color: string) {
    const event: CustomEvent = new CustomEvent('setBackgroundColor', {
      bubbles: true,
      detail: color
    });
    this.elementRef.nativeElement.dispatchEvent(event);
  }

  set_color_palette(colors: number[][]) {
    const event: CustomEvent = new CustomEvent('setColorPalette', {
      bubbles: true,
      detail: colors
    });
    console.log('setting color palette');
    this.elementRef.nativeElement.dispatchEvent(event);
  }

  get_background_color() {
    const coverImage = document.getElementById('coverImage') as HTMLImageElement;
    coverImage.setAttribute('crossOrigin', '');
    
    coverImage.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = coverImage.clientWidth;
      canvas.height = coverImage.clientHeight;
      
      const context = canvas.getContext('2d');
      context?.drawImage(coverImage, 0, 0);
      
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
  
      if (imageData) {
        const imageRGB = this.buildRGB(imageData.data);
  
        const initialPalette = this.quantization(imageRGB, 0);
        // const vibrantPalette = this.removeNeutralColors(initialPalette);
        // const color = this.orderByLuminance(vibrantPalette)[0];
        const colors = this.orderByVibrance(initialPalette);
        this.set_background_color(`rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`);
        this.set_color_palette(colors);
      }
    }
  }

  buildRGB(imageData: Uint8ClampedArray): number[][] {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
      rgbValues.push([
        imageData[i], imageData[i+1], imageData[i+2]
      ]);
    }
    return rgbValues;
  };

  findBiggestColorRange(
    rgbValues: number[][]
  ): number {

    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;
  
    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;
  
    rgbValues.forEach((pixel) => {
      rMin = Math.min(rMin, pixel[0]);
      gMin = Math.min(gMin, pixel[1]);
      bMin = Math.min(bMin, pixel[2]);
  
      rMax = Math.max(rMax, pixel[0]);
      gMax = Math.max(gMax, pixel[1]);
      bMax = Math.max(bMax, pixel[2]);
    });
  
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
  
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return 0;
    } else if (biggestRange === gRange) {
      return 1;
    } else {
      return 2;
    }
  };

  quantization(rgbValues: number[][], depth: number): number[][] {
    const MAX_DEPTH = 4;
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev: number[], curr: number[]) => {
          prev[0] += curr[0];
          prev[1] += curr[1];
          prev[2] += curr[2];

          return prev;
        }
      );
      color[0] = Math.round(color[0] / rgbValues.length);
      color[1] = Math.round(color[1] / rgbValues.length);
      color[2] = Math.round(color[2] / rgbValues.length);
      return [color];
    }

    const componentToSortBy: number = this.findBiggestColorRange(rgbValues);
    rgbValues.sort((a, b) => a[componentToSortBy] > b[componentToSortBy] ? 1 : -1);
  
    const mid = rgbValues.length / 2;
    return [
      ...this.quantization(rgbValues.slice(0, mid), depth + 1),
      ...this.quantization(rgbValues.slice(mid + 1), depth + 1),
    ];
  }

  calculateLuminance(p: number[]): number {
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  };

  removeNeutralColors(rgbValues: number[][]): number[][] {
    console.log(rgbValues);
    return rgbValues.filter((rgb) => Math.max(...rgb) - Math.min(...rgb) > 50);
  };

  orderByVibrance(rgbValues: number[][]): number[][] {
    return rgbValues.sort((p1, p2) => {
      return (Math.max(...p2) - Math.min(...p2)) - (Math.max(...p1) - Math.min(...p1));
    });
  };

  orderByLuminance(rgbValues: number[][]): number[][] {
    return rgbValues.sort((p1, p2) => {
      return this.calculateLuminance(p2) - this.calculateLuminance(p1);
    });
  };
}
