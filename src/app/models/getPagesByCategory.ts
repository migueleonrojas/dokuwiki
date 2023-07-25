import { Page } from "./page.model";

export interface GetPagesByCategory {
 status:  number;
 message: string;
 pages:   Page[];
}