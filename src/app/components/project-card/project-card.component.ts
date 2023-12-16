import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  @Input() project!: Project;

  constructor(
    private router: Router,) { }

  ngOnInit(): void {
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

}
