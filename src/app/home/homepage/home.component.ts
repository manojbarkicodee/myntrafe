import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
interface images {
  image_url: string;
}

let imgCommonUrl = '../../assets/homepageImages/';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  section: boolean = false;

  titleAtDeals!: string;
  imagesAtDeals!: images[];
  titlebrands!: string;
  imagesbrands!: images[];
  titleAtPrices!: string;
  imagesAtPrices!: images[];
  titleAtTrendyPicks!: string;
  imagesAtTrendyPicks!: images[];
  titleAtCategory!: string;
  imagesAtCategory!: images[];

  constructor() {}
  ngOnInit(): void {
    this.toSetDeals();
    this.toSetBrands();
    this.toSetAtPrices();
    this.toSetTrendingPicks();
    this.toSetCategory();
  }

  toSetDeals() {
    this.titleAtDeals = `${imgCommonUrl}deals_img/title-img.webp`;
    this.imagesAtDeals = [
      { image_url: `${imgCommonUrl}deals_img/img-1.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-2.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-3.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-4.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-5.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-6.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-7.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-8.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-9.webp` },
      { image_url: `${imgCommonUrl}deals_img/img-10.webp` },
    ];
  }
  toSetBrands() {
    this.titlebrands = `${imgCommonUrl}loved_brands_img/title-img.webp`;
    this.imagesbrands = [
      { image_url: `${imgCommonUrl}loved_brands_img/img-1.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-2.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-3.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-4.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-5.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-6.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-7.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-8.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-9.webp` },
      { image_url: `${imgCommonUrl}loved_brands_img/img-10.webp` },
    ];
  }
  toSetAtPrices() {
    this.titleAtPrices = `${imgCommonUrl}brands_at_best_price_img/title-img.webp`;
    this.imagesAtPrices = [
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-1.jpeg` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-2.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-3.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-4.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-5.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-6.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-7.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-8.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-9.webp` },
      { image_url: `${imgCommonUrl}brands_at_best_price_img/img-10.webp` },
    ];
  }

  toSetTrendingPicks() {
    this.titleAtTrendyPicks = `${imgCommonUrl}trendy_picks/title-img.webp`;
    this.imagesAtTrendyPicks = [
      { image_url: `${imgCommonUrl}trendy_picks/img-1.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-2.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-3.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-4.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-5.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-6.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-7.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-8.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-9.webp` },
      { image_url: `${imgCommonUrl}trendy_picks/img-10.webp` },
    ];
  }
  toSetCategory() {
    this.titleAtCategory = `${imgCommonUrl}shop_by_category/title-img.webp`;
    this.imagesAtCategory = [
      { image_url: `${imgCommonUrl}shop_by_category/img-1.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-2.jpg` },
      { image_url: `${imgCommonUrl}shop_by_category/img-3.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-4.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-5.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-6.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-7.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-8.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-9.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-10.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-11.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-12.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-13.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-14.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-15.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-16.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-17.webp` },
      { image_url: `${imgCommonUrl}shop_by_category/img-18.webp` },
    ];
  }
}
