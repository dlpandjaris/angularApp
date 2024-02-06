import { Component } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  // imports: [ProjectCardComponent]
})
export class ProjectsComponent {

  projects: Project[] = [
    {
      title: 'Spotify Analytics',
      url: "/projects/spotify/auth",
      image: '../../../assets/Spotify_logo_without_text.svg.png',
      color: 'black',
      description: 'Inspired by Spotify Wrapped, this tool is aimed at visualizing your listening trends year-round.' 
                  +'<br><br>Login required, but rest assured that none of your data is saved here.<br>'
                  +'More on: <a href="https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow" target="_blank">Authorization Code with PKCE</a>',
      github: 'https://github.com/dlpandjaris/angularApp/tree/main/src/app/projects/spotify'
    },
    {
      title: 'Gift Registry',
      url: "/projects/gift-registry",
      image: '../../../assets/gift-512.png',
      color: 'red',
      description: 'The goal of this project is to make gift-giving a more collaborative effort, '
                  +'by allowing everyone to collectively brainstorm & reserve gift ideas without spoiling it.'
                  +'<br><br>Inspired by my annual inquiries to my mother, concerning what I should get my little sister.',
      github: 'https://github.com/dlpandjaris/giftService'
    }
  ];
}
