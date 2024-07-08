export interface IQuestion {
  id: number;
  title: string;
  content: string;
  category: ICategory
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IQuestionFormData {
  title: string;
  content: string;
  category: ICategory | null;
}

export interface IQuestionPayload {
  title: string;
  content: string;
  categoryId: number;
}
