import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-component',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  constructor(
    private router: Router
  ) {
    
  }

  addPage() {
    this.router.navigate(['/page/create-page']);
  }

}
