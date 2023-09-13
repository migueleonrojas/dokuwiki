import { Injectable } from '@angular/core';
import { CanComponentDeactivate } from 'src/app/models/CanComponentDeactivate.model'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateType } from '../types/can-deactivate-type.type';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard  {

  canDeactivate(
    component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): CanDeactivateType {
      
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  
}