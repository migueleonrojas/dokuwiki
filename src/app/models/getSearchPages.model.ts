import { Page } from "./page.model";

export interface GetSearchPages {
    status:          number;
    message:         string;
    pages:           Page[];
}