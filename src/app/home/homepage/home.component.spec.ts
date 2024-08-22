import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { HomeSectionComponent } from '../home-section/home-section.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent,HomeSectionComponent],
            imports: [HttpClientTestingModule],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call toSetDeals, toSetBrands, toSetAtPrices, toSetTrendingPicks, and toSetCategory', () => {
      spyOn(component, 'toSetDeals');
      spyOn(component, 'toSetBrands');
      spyOn(component, 'toSetAtPrices');
      spyOn(component, 'toSetTrendingPicks');
      spyOn(component, 'toSetCategory');

      component.ngOnInit();

      expect(component.toSetDeals).toHaveBeenCalled();
      expect(component.toSetBrands).toHaveBeenCalled();
      expect(component.toSetAtPrices).toHaveBeenCalled();
      expect(component.toSetTrendingPicks).toHaveBeenCalled();
      expect(component.toSetCategory).toHaveBeenCalled();
    });
  });

  describe('toSetDeals', () => {
    it('should set titleAtDeals and imagesAtDeals', () => {
      component.toSetDeals();

      expect(component.titleAtDeals).toBeDefined();
      expect(component.imagesAtDeals).toBeDefined();
      expect(component.imagesAtDeals.length).toBeGreaterThan(0);
    });
  });

  describe('toSetBrands', () => {
    it('should set titlebrands and imagesbrands', () => {
      component.toSetBrands();

      expect(component.titlebrands).toBeDefined();
      expect(component.imagesbrands).toBeDefined();
      expect(component.imagesbrands.length).toBeGreaterThan(0);
    });
  });

  describe('toSetAtPrices', () => {
    it('should set titleAtPrices and imagesAtPrices', () => {
      component.toSetAtPrices();

      expect(component.titleAtPrices).toBeDefined();
      expect(component.imagesAtPrices).toBeDefined();
      expect(component.imagesAtPrices.length).toBeGreaterThan(0);
    });
  });

  describe('toSetTrendingPicks', () => {
    it('should set titleAtTrendyPicks and imagesAtTrendyPicks', () => {
      component.toSetTrendingPicks();

      expect(component.titleAtTrendyPicks).toBeDefined();
      expect(component.imagesAtTrendyPicks).toBeDefined();
      expect(component.imagesAtTrendyPicks.length).toBeGreaterThan(0);
    });
  });

  describe('toSetCategory', () => {
    it('should set titleAtCategory and imagesAtCategory', () => {
      component.toSetCategory();

      expect(component.titleAtCategory).toBeDefined();
      expect(component.imagesAtCategory).toBeDefined();
      expect(component.imagesAtCategory.length).toBeGreaterThan(0);
    });
  });
});
