import { Component, Input } from '@angular/core';
import { similarProducts } from '../../model';
import { Router } from '@angular/router';
import { httpService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-similar-products',
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.scss'],
})
export class SimilarProductsComponent {
  @Input() similarProducts!: similarProducts[];
  @Input() category!: string;

  constructor(private router: Router, private scrollTo: httpService) {}

  navigateToProductDetails(id: Number) {
    this.router.navigate(['/products', this.category, id]);
    this.scrollTo.scrollToTop();
  }
}
