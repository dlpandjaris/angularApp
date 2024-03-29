import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  // standalone: true,
})
export class ProjectCardComponent implements OnInit {

  @Input() project!: Project;

  constructor() { }

  ngOnInit(): void {
  }
}
