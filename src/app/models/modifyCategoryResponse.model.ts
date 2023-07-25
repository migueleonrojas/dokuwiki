import { Category } from "./category";

export interface ModifyCategoryResponse {
 status:   number;
 message:  string;
 category: Category;
}