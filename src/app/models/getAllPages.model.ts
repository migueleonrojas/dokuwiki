import { Page } from "./page.model";

export interface GetAllPages {
    status:  number;
    message: string;
    pages:   Page[];
}