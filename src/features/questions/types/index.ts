export interface IQuestion {
  id: number;
  title: string;
  content: string;
  category: ICategory;
  tags: ITag[];
  createdDate: string;
}

export interface ICategory {
  id: number;
  name: string;
  parent: ICategory | null;
  children: ICategory[] | null;
}

export interface ICategoryWithLevel extends ICategory {
  level?: number;
}

export interface ITag {
  id: number;
  name: string;
}

export interface IQuestionFormData {
  title: string;
  content: string;
  category: ICategoryWithLevel | null;
  tags: ITag[];
}

export interface IQuestionPayload {
  title: string;
  content: string;
  categoryId: number;
  tagIds: number[];
}

export interface ICategoryFormData {
  name: string;
  parentCategory: ICategoryWithLevel | null;
}

export interface ICategoryPayload {
  name: string;
  parentId: number | null;
}

export interface ITagFormData {
  name: string;
}

export interface ITagPayload {
  name: string;
}
