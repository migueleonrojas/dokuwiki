import { Page } from "./page.model";

export interface DeletePageResponse {
    status:  number;
    message: string;
    page:    Page;
}