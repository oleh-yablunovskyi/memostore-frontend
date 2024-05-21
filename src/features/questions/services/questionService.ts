import { AxiosInstance } from 'axios';
import { api } from '../../../services/api/api';
import { ICreateQuestionParams } from '../types';

class QuestionService {
  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getQuestions() {
    const response = await this.fetchingService.get('/questions?page=1&limit=100');
    return response.data.data;
  }

  async getQuestionById(id: string) {
    const response = await this.fetchingService.get(`/questions/${id}`);
    return response.data;
  }

  async createQuestion({ title, content, categoryId }: ICreateQuestionParams) {
    await this.fetchingService.post('/questions', { title, content, categoryId });
  }

  async deleteQuestion(id: string) {
    await this.fetchingService.delete(`/questions/${id}`);
  }
}

const questionService = new QuestionService();
export { questionService };
