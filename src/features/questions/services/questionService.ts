import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';
import { IQuestionPayload } from '../types';

class QuestionService {
  private baseUrl = '/questions';

  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getQuestions(page = 1, limit = 100) {
    const response = await this.fetchingService.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getQuestionById(id: string) {
    const response = await this.fetchingService.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createQuestion(payload: IQuestionPayload) {
    await this.fetchingService.post(this.baseUrl, payload);
  }

  async updateQuestion(id: string, payload: IQuestionPayload) {
    await this.fetchingService.patch(`${this.baseUrl}/${id}`, payload);
  }

  async deleteQuestion(id: string) {
    await this.fetchingService.delete(`${this.baseUrl}/${id}`);
  }
}

const questionService = new QuestionService();
export { questionService };
