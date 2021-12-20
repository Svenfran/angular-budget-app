import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormularComponent } from './login-formular.component';

describe('LoginFormularComponent', () => {
  let component: LoginFormularComponent;
  let fixture: ComponentFixture<LoginFormularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFormularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
