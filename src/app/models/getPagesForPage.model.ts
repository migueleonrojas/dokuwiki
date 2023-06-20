import { Page } from "./page.model";

export interface GetPageForPage {
    status:          number;
    message:         string;
    pages_for_limit: number;
    total_pages:     number;
    current_page:    number;
    previous_page:   null;
    next_page:       null;
    pages:           Page[];
}