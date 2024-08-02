import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';
import { IQuestionPayload } from '../types';

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

  async createQuestion(payload: IQuestionPayload) {
    await this.fetchingService.post('/questions', payload);
  }

  async updateQuestion(id: string, payload: IQuestionPayload) {
    await this.fetchingService.patch(`/questions/${id}`, payload);
  }

  async deleteQuestion(id: string) {
    await this.fetchingService.delete(`/questions/${id}`);
  }
}

const questionService = new QuestionService();
export { questionService };
