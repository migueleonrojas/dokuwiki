import { Category } from "./category";

export interface CreateCategoryResponse {
 status:   number;
 message:  string;
 category: Category;
}