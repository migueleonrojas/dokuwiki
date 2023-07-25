import { Category } from "./category";

export interface GetAllCategoryResponse {
 status:     number;
 message:    string;
 categories: Category[];
}
