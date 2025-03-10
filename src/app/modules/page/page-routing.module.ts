import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePageComponent } from './create-page/create-page.component';
import { ModifyPageComponent } from './modify-page/modify-page.component';
import { ViewAllPagesComponent } from './view-all-pages/view-all-pages.component';
import { ViewPageComponent } from './view-page/view-page.component';
import { ViewSearchPagesComponent } from './view-search-pages/view-search-pages.component';
import { ViewPageByParamIdComponent } from './view-page-by-param-id/view-page-by-param-id.component';
import { CanDeactivateGuard } from 'src/app/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: 'create-page',
    component: CreatePageComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'modify-page',
    component: ModifyPageComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'view-all-pages',
    component: ViewAllPagesComponent
  },
  {
    path: 'view-page',
    component: ViewPageComponent
  },
  {
    path: 'view-search-page',
    component: ViewSearchPagesComponent
  },
  {
    path: 'view-page-by-param-id',
    component: ViewPageByParamIdComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
