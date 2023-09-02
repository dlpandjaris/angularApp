import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Typewriter, TypewriterAction } from '@uiloos/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  page: string = 'Home';
  command: string = 'cat welcome.txt';
  history: Array<string> = [];

  constructor(private ref: ChangeDetectorRef) { }

  public typewriter = new Typewriter(
    {
      repeat: false,
      repeatDelay: 1000,
      autoPlay: true,
      text: '>>> ',
      cursors: [{
        position: 4,
        data: {
          name: "Cursor #1"
        }
      }],
      actions:
        [{ type: "keyboard", cursor: 0, text: "", delay: 100 }]
    },
    () => {
      this.ref.markForCheck();
    }
  )

  ngOnInit(): void {
    this.constructActions(this.command);
    console.log(this.typewriter.actions)
  }

  setPage(page: string) {
    this.page = page;
  }

  constructActions(command: string) {
    command.split('').forEach(char => {
      this.typewriter.actions.push(
        { type: "keyboard", cursor: 0, text: char, delay: 100 }
      )
    });
  }
}
