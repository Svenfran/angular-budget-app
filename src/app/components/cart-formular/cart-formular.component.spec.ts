import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFormularComponent } from './cart-formular.component';

describe('CartFormularComponent', () => {
  let component: CartFormularComponent;
  let fixture: ComponentFixture<CartFormularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartFormularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
