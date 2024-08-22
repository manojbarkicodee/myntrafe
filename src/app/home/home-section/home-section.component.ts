import { Component, Input, OnInit } from '@angular/core';

interface images {
  image_url: string;
}
@Component({
  selector: 'app-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.scss'],
})
export class HomeSectionComponent {
  @Input() title!: string;
  @Input() images!: images[];
  @Input() section!: boolean;
}
