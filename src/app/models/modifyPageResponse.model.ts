import { Page } from "./page.model";

export interface ModifyPageResponse {
    status:  number;
    message: string;
    page:    Page;
}