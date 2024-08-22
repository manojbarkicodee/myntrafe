import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarProductsComponent } from './similar-products.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { httpService } from 'src/app/services/products/products.service';

describe('SimilarProductsComponent', () => {
  let component: SimilarProductsComponent;
  let fixture: ComponentFixture<SimilarProductsComponent>;
  let scrollSerive: jasmine.SpyObj<httpService>;
  let router: any;
  beforeEach(async () => {
    router = { navigate: jasmine.createSpy('navigate') };
    scrollSerive = jasmine.createSpyObj('httpService', ['scrollToTop']);
    await TestBed.configureTestingModule({
      declarations: [SimilarProductsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: httpService, useValue: scrollSerive },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SimilarProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateToProductDetails',()=>{
    it('should navigate to indivisual product page',()=>{
      component.category='/mens'
      component.navigateToProductDetails(1)
      expect(router.navigate).toHaveBeenCalledWith(['/products',component.category,1])
      expect(scrollSerive.scrollToTop).toHaveBeenCalled()
    })
   
  })
});
