import { CanDeactivateType } from "../types/can-deactivate-type.type";

export interface CanComponentDeactivate {
  canDeactivate: () => CanDeactivateType;
}