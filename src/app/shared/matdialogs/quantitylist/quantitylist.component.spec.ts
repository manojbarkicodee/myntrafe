import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitylistComponent } from './quantitylist.component';

describe('QuantitylistComponent', () => {
  let component: QuantitylistComponent;
  let fixture: ComponentFixture<QuantitylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantitylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
