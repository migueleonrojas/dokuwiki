import { Observable, of } from 'rxjs';
import { UrlTree } from '@angular/router';


export type CanDeactivateType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |boolean | UrlTree ;