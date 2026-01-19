export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  system: boolean;
  key: string;
}

export interface CategoryCreateRequest {
  name: string;
  color: string;
  icon: string;
}

export type CategoryUpdateRequest = Partial<CategoryCreateRequest>;
