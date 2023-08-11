import { Page } from "./page.model";

export interface GetPageById {
  status:  number;
  message: string;
  page:    Page;
}