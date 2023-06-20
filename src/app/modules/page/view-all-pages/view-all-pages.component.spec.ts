import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPagesComponent } from './view-all-pages.component';

describe('ViewAllPagesComponent', () => {
  let component: ViewAllPagesComponent;
  let fixture: ComponentFixture<ViewAllPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAllPagesComponent]
    });
    fixture = TestBed.createComponent(ViewAllPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
