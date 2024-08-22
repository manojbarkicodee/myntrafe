import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navtologin',
  templateUrl: './navtologin.component.html',
  styleUrls: ['./navtologin.component.scss'],
})
export class NavtologinComponent implements OnInit {
  @Input() page: string = '';
  url!: string;
  @Input() dynamicCompData!: {
    header: string;
    paragraph: string;
    buttonText: string;
  };
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe((data) => {
      this.url = data[0].path;
    });
  }
  navigateTo() {
    if (this.dynamicCompData.header === 'PLEASE LOG IN') {
      let url = this.url;
      this.router.navigate(['/login'], {
        queryParams: { reference: this.url },
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
