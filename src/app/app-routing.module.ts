import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-component/main-page.component';
import { CreatePageComponent } from './modules/page/create-page/create-page.component';



const routes: Routes = [
  {
    path: 'main-component',
    component: MainPageComponent
  },
  {
    path: 'create-page',
    component: CreatePageComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
