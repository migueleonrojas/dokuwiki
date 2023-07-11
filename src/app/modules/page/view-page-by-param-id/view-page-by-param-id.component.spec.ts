import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPageByParamIdComponent } from './view-page-by-param-id.component';

describe('ViewPageByParamIdComponent', () => {
  let component: ViewPageByParamIdComponent;
  let fixture: ComponentFixture<ViewPageByParamIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPageByParamIdComponent]
    });
    fixture = TestBed.createComponent(ViewPageByParamIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
