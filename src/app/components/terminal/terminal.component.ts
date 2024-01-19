import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Typewriter } from '@uiloos/core';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {

  command: string = 'cat welcome.txt';
  history: Array<[string, string]> = [];
  edit: boolean = false;
  commandForm!: FormGroup;

  commandMap: Map<string, string> = new Map([
    ['help', 'Type or click the following commands:'],
    ['cat welcome.txt', 'Welcome to my website! As you can see, I\'m no front end engineer, '
                       +'but needed a place to host things I enjoy working on.<br><br>'
                       +'Use the <b><code>help</code></b> command for more info:<br>'],
    ['cat experience.txt', 'J.B. Hunt Transportation.......................................Lowell, AR<br>'
                          +'&emsp;Data Scientist I......................................Jan 2022 - Present<br>'
                          +'&emsp;Logistics Engineer I................................June 2021 - Dec 2022<br>'
                          +'<br>'
                          +'Textron Aviantion.............................................Wichita, KS<br>'
                          +'&emsp;IT Developer Intern...................................June - August 2020<br>'
                          +'<br>'
                          +'Kansas State University.....................................Manhattan, KS<br>'
                          +'&emsp;Research Associate..................................Sept 2019 - May 2021<br>'],
    ['cat education.txt', 'Kansas State University<br/>'
                         +'Major: Industrial Manufacturing & Systems Engineering<br/>'
                         +'Minors: Statistics, Business Administration<br/>'
                         +'Duration: Aug 2017 - May 2021'],
    ['ls', ''],
    ['cd projects', ''],
    ['cd resume', ''],
    ['cd \'contact me\'', ''],
    ['cd contact me', ''],
    ['', ''],
    ['cat boobs', '80085'],
    ['clear', '']
  ]);
  
  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private router: Router) { }

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

  constructActions(command: string) {
    this.edit = false;
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
      let command = this.typewriter.text.toLowerCase();
      if (command.slice(0, 2) == 'cd') {
        let destination = command.slice(3);
        if (destination == '\'contact me\'') {
          this.router.navigateByUrl('contact');
        } else {
          if (this.commandMap.has(command)) {
            this.router.navigateByUrl(destination);
          }
        }
      }
      if (this.commandMap.has(command)) {
        this.history.push([command, this.commandMap.get(command)!]);
        if (command == 'clear') {
          this.history = [];
        }
      } else {
        this.history.push([command, 'command not recognized']);
      }
      this.typewriter.text = '';
    }
  }

  onWelcomeButtonClick(e:HTMLElement) {
    console.log(e.innerHTML);
  }
}
