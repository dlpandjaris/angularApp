import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Typewriter, TypewriterAction } from '@uiloos/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  page: string = 'Home';
  command: string = 'python -c "print("hello world!")"'
  commandArray: Array<TypewriterAction> = []

  constructor(private ref: ChangeDetectorRef) { }

  public typewriter = new Typewriter(
    {
      repeat: true,
      repeatDelay: 1000,
      autoPlay: true,
      text: '>>> ',
      cursors: [{
        position: 4,
        data: {
          name: "Cursor #1"
        }
      }],
      actions: //this.commandArray
        [{ type: "keyboard", cursor: 0, text: "H", delay: 100 },
        { type: "keyboard", cursor: 0, text: "e", delay: 100 },
        { type: "keyboard", cursor: 0, text: "l", delay: 100 },
        { type: "keyboard", cursor: 0, text: "l", delay: 100 },
        { type: "keyboard", cursor: 0, text: "o", delay: 100 },
        { type: "keyboard", cursor: 0, text: " ", delay: 100 },
        { type: "keyboard", cursor: 0, text: "W", delay: 100 },
        { type: "keyboard", cursor: 0, text: "o", delay: 100 },
        { type: "keyboard", cursor: 0, text: "r", delay: 100 },
        { type: "keyboard", cursor: 0, text: "l", delay: 100 },
        { type: "keyboard", cursor: 0, text: "d", delay: 100 },
        { type: "keyboard", cursor: 0, text: "!", delay: 100 }]
    }
    // ,
    // () => {
    //   this.ref.markForCheck();
    // }
  )

  ngOnInit(): void {
    this.constructActions(this.command);
    console.log(this.commandArray)
  }

  setPage(page: string) {
    this.page = page;
  }

  constructActions(command: string) {
    command.split('').forEach(char => {
      this.commandArray.push(
        { type: "keyboard", cursor: 0, text: char, delay: 100 }
      )
    });
  }
}
