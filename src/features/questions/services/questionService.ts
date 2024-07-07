import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';
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

  async updateQuestion(id: string, { title, content }: { title: string; content: string }) {
    await this.fetchingService.patch(`/questions/${id}`, { title, content });
  }

  async deleteQuestion(id: string) {
    await this.fetchingService.delete(`/questions/${id}`);
  }
}

const questionService = new QuestionService();
export { questionService };
