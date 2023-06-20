import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPageComponent } from './modify-page.component';

describe('CreatePageComponent', () => {
  let component: ModifyPageComponent;
  let fixture: ComponentFixture<ModifyPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyPageComponent]
    });
    fixture = TestBed.createComponent(ModifyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
