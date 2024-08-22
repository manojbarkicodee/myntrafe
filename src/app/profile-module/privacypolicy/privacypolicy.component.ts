import { Component } from '@angular/core';
import { privacyPolicy } from './staticdata';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent {
privacyPolicyData=privacyPolicy


}
