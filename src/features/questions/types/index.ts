export interface IQuestion {
  id: number;
  title: string;
  content: string;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface ICreateQuestionParams {
  title: string;
  content: string;
  categoryId: number;
}
