import { Page } from "./page.model";

export interface CreatePageResponse {
    status:  number;
    message: string;
    page:    Page;
}