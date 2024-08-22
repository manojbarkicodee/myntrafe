import { Component } from '@angular/core';
import { terms } from './staticdata';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {
termsData=terms
}
