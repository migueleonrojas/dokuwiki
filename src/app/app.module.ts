import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponentComponent } from './components/header-component/header-component.component';
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



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    MainPageComponent,
    CreatePageComponent,
    ViewAllPagesComponent,
    ViewPageComponent,
    ModifyPageComponent,
    ViewSearchPagesComponent,
    DateExactly,
    DialogImageComponent,
    SizeFile,
    SanitizeHtml
    
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
