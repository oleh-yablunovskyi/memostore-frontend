export interface IQuestion {
  id: number;
  title: string;
  content: string;
  category: ICategory;
  tags: ITag[];
}

export interface ICategory {
  id: number;
  name: string;
}

export interface ITag {
  id: number;
  name: string;
}

export interface IQuestionFormData {
  title: string;
  content: string;
  category: ICategory | null;
  tags: ITag[];
}

export interface IQuestionPayload {
  title: string;
  content: string;
  categoryId: number;
  tagIds: number[];
}
