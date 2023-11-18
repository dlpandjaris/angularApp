import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Typewriter } from '@uiloos/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  page: string = 'Home';
  command: string = 'cat welcome.txt';
  history: Array<[string, string]> = new Array();
  edit: boolean = false;

  commandMap: Map<string, string> = new Map([
    ['cat welcome.txt', 'Welcome to my website! Use the command "help" for more info<br>'],
    ['cat experience.txt', 'JB Hunt...<br>Textron Aviantion...'],
    ['help', 'Type or click the following commands:'],
    ['cat education.txt', 'Kansas State University<br/>'
                         +'Major: Industrial Manufacturing & Systems Engineering<br/>'
                         +'Minors: Statistics, Business Administration<br/>'
                         +'Duration: Aug 2017 - May 2021']
  ])

  commandForm!: FormGroup;

  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder) { }

  public typewriter = new Typewriter(
    {
      repeat: false,
      repeatDelay: 1000,
      autoPlay: false,
      text: '',
      cursors: [{
        position: 0,
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
    this.commandForm = this.formBuilder.group({
      command: ['']
    })

    this.constructActions(this.command);
    this.typewriter.subscribe(() => {
      if (this.typewriter.isFinished) {
        this.runCommand();
      }
    });
  }

  setPage(page: string) {
    this.page = page;
  }

  constructActions(command: string) {
    this.edit = false;
    console.log(command);
    command.split('').forEach(char => {
      this.typewriter.actions.push(
        { type: "keyboard", cursor: 0, text: char, delay: 100 }
      )
    });
    this.typewriter.play();
  }

  clickedTerminal() {
    this.typewriter.pause();
    this.edit = true;
  }



  @HostListener('TerminalButtonClickedEvent', ['$event'])
  onTerminalButtonClicked(event: any) {
    this.typewriter.text = event.detail;
    this.runCommand()
  }

  runCommand() {
    if (this.typewriter.text != '') {
      let command = this.typewriter.text;
      if (this.commandMap.has(command)) {
        this.history.push([command, this.commandMap.get(command)!]);
      } else {
        this.history.push([command, 'command not recognized'])
      }
      this.typewriter.text = '';
    }
  }

  onWelcomeButtonClick(e:HTMLElement) {
    console.log(e.innerHTML);
  }
}
