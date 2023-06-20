import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSearchPagesComponent } from './view-search-pages.component';

describe('ViewAllPagesComponent', () => {
  let component: ViewSearchPagesComponent;
  let fixture: ComponentFixture<ViewSearchPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSearchPagesComponent]
    });
    fixture = TestBed.createComponent(ViewSearchPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
