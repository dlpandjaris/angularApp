import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-terminal-content',
  templateUrl: './terminal-content.component.html',
  styleUrls: ['./terminal-content.component.scss']
})
export class TerminalContentComponent implements OnInit {

  @Input() command: string = ''
  @Output() onClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
}
