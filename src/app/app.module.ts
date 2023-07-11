import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header-component/header-component';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './components/main-component/main-page.component';
import { CreatePageComponent } from './modules/page/create-page/create-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ViewAllPagesComponent } from './modules/page/view-all-pages/view-all-pages.component';
import { ViewPageComponent } from './modules/page/view-page/view-page.component';
import { CoreModule } from './core/core.module';
import { ModifyPageComponent } from './modules/page/modify-page/modify-page.component';
import { DateExactly } from './pipes/date.pipe';
import { DatePipe } from '@angular/common';
import { ViewSearchPagesComponent } from './modules/page/view-search-pages/view-search-pages.component';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { SizeFile } from './pipes/sizeFileConvert.pipe';
import { SanitizeHtml } from './pipes/sanitize.pipe';
import { MatDrawerElementsComponent } from './components/mat-drawer-elements/mat-drawer-elements.component';
import { ViewPageByParamIdComponent } from './modules/page/view-page-by-param-id/view-page-by-param-id.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    CreatePageComponent,
    ViewAllPagesComponent,
    ViewPageComponent,
    ViewPageByParamIdComponent,
    ModifyPageComponent,
    ViewSearchPagesComponent,
    DateExactly,
    DialogImageComponent,
    SizeFile,
    SanitizeHtml,
    MatDrawerElementsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [DateExactly, DatePipe, SizeFile, SanitizeHtml],
  bootstrap: [AppComponent]
})
export class AppModule { }
