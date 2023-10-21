import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terminal-button',
  templateUrl: './terminal-button.component.html',
  styleUrls: ['./terminal-button.component.scss']
})
export class TerminalButtonComponent implements OnInit {

  @Input() command!: string;
  @Input() btnClass!: string;
  @Output() onClick = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  emitEvent() {
    this.onClick.emit(this.command);
  }

}
