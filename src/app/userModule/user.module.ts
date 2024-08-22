import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './Auth/signup.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SignupComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [],
})
export class UserModule {}
