import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtml implements PipeTransform {

  constructor(private _sanitizer:DomSanitizer) {
  }

  transform(v:string = ""):SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(v);
  }
}