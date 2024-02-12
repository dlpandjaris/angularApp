import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-top-term-button',
  templateUrl: './top-term-button.component.html',
  styleUrl: './top-term-button.component.scss'
})
export class TopTermButtonComponent {

  @Input() term: string = 'medium_term';

  constructor(
    private elementRef: ElementRef
  ) {}

  setTerm(term: string): void {
    const event: CustomEvent = new CustomEvent('setTopTerm', {
      bubbles: true,
      detail: term
    });
    this.elementRef.nativeElement.dispatchEvent(event);
  }
}
