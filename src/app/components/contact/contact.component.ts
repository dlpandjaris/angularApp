import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  name: string = 'Dylan Pandjaris';
  url: string = "https://www.linkedin.com/in/dylan-pandjaris-820885150/";
  image: string = '../../../assets/profile_pic.JPG';
  color: string = 'white';
  description: string = '<i class="fa-solid fa-phone"></i> (913) 206-5702<br/>'
                      + '<i class="fa-regular fa-envelope"></i> dlpandjaris@gmail.com';
  github: string = 'https://github.com/dlpandjaris';
}
