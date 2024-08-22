import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './homepage/home.component';
import { HomeSectionComponent } from './home-section/home-section.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent, HomeSectionComponent],
  imports: [CommonModule, SharedModule,RouterModule],
})
export class HomeModule {}
