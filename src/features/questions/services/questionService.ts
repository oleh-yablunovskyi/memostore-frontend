import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';
import { IGetQuestionsParams, IQuestionPayload } from '../types';

class QuestionService {
  private baseUrl = '/questions';

  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getQuestions({ page = 1, limit = 100, search = '', categoryId = '' }: IGetQuestionsParams) {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search.trim()) {
      params.append('search', search.trim());
    }
    if (categoryId) {
      params.append('categoryId', categoryId.toString());
    }

    const response = await this.fetchingService.get(`${this.baseUrl}?${params.toString()}`);
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
