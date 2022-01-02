import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingsOverviewComponent } from './spendings-overview.component';

describe('SpendingsOverviewComponent', () => {
  let component: SpendingsOverviewComponent;
  let fixture: ComponentFixture<SpendingsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
