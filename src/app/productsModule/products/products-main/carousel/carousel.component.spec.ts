import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CarouselComponent } from './carousel.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimpleChange } from '@angular/core';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      imports: [HttpClientTestingModule, SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should call ngCarousel.cycle() when indicators are true', () => {
      spyOn(component.ngCarousel, 'cycle');
      const changes = {
        indicators: {
          currentValue: true,
          firstChange: false,
        } as SimpleChange,
      };

      component.ngOnChanges(changes);

      expect(component.ngCarousel.cycle).toHaveBeenCalled();
    });

    it('should call ngCarousel.pause() when indicators are false', () => {
      spyOn(component.ngCarousel, 'pause');
      const changes = {
        indicators: {
          currentValue: false,
          firstChange: false,
        } as SimpleChange,
      };

      component.ngOnChanges(changes);

      expect(component.ngCarousel.pause).toHaveBeenCalled();
    });

    it('should not call ngCarousel methods on the first change', () => {
      spyOn(component.ngCarousel, 'cycle');
      spyOn(component.ngCarousel, 'pause');
      const changes = {
        indicators: {
          currentValue: true,
          firstChange: true,
        } as SimpleChange,
      };

      component.ngOnChanges(changes);

      expect(component.ngCarousel.cycle).not.toHaveBeenCalled();
      expect(component.ngCarousel.pause).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call ngCarousel.pause()', () => {
      spyOn(component.ngCarousel, 'pause');
      component.ngAfterViewInit();
      expect(component.ngCarousel.pause).toHaveBeenCalled();
    });
  });
});
