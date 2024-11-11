import { BasePostItem } from "./base-post";

export interface MarketplaceItem extends BasePostItem {
  submitCount: number;
  startDate?: any;
  endDate?: any;
  budgetMin?: number;
  budgetMax?: number;
}
