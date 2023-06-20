import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-component/main-page.component';
import { CreatePageComponent } from './modules/page/create-page/create-page.component';
import { ViewPageComponent } from './modules/page/view-page/view-page.component';
import { ModifyPageComponent } from './modules/page/modify-page/modify-page.component';
import { ViewSearchPagesComponent } from './modules/page/view-search-pages/view-search-pages.component';




const routes: Routes = [
  {
    path: 'main-component',
    component: MainPageComponent
  },
  {
    path: 'create-page',
    component: CreatePageComponent
  },
  {
    path: 'view-page',
    component: ViewPageComponent
  },
  {
    path: 'modify-page',
    component: ModifyPageComponent
  },
  {
    path: 'view-search-page',
    component: ViewSearchPagesComponent
  }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
