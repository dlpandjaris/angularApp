import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-terminal-button',
  templateUrl: './terminal-button.component.html',
  styleUrls: ['./terminal-button.component.scss']
})
export class TerminalButtonComponent implements OnInit {

  @Input() command!: string;
  @Input() btnClass!: string;
  
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  emitEvent() {
    const event: CustomEvent = new CustomEvent('TerminalButtonClickedEvent', {
      bubbles: true,
      detail: this.command
    });

    this.elementRef.nativeElement.dispatchEvent(event);
  }

}
