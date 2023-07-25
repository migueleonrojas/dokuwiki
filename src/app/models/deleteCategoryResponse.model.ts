import { Category } from "./category";

export interface DeleteCategoryResponse {
 status:   number;
 message:  string;
 category: Category;
}
