import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'src/app/productsModule/model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit, OnChanges {
  @Input() images!: Image[];

  @ViewChild('carousel') ngCarousel!: NgbCarousel;
  @Input() indicators: boolean = false;
  @Input() ratings!: number;
  @Input() productDetails:boolean=false
  ngOnChanges(changes: SimpleChanges): void {
    let { indicators } = changes;
    if (indicators.currentValue && !indicators.firstChange) {
      this.ngCarousel.cycle();
    } else if (!indicators.currentValue && !indicators.firstChange) {
      this.ngCarousel.pause();
    }
  }
  ngAfterViewInit(): void {
    this.ngCarousel.pause();
  }
}
