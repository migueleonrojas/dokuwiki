import { Component } from '@angular/core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent {
  faClipboard = faClipboard;
  searchFormControl = new FormControl('');

  search() {
    
    console.log('bsucando');
  }
}
