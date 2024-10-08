import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';
import { ICategoryPayload } from '../types';

class CategoryService {
  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getCategories() {
    const response = await this.fetchingService.get('/categories?page=1&limit=1000');
    return response.data.data;
  }

  async createCategory(payload: ICategoryPayload) {
    await this.fetchingService.post('/categories', payload);
  }

  async updateCategory(id: string, payload: ICategoryPayload) {
    await this.fetchingService.patch(`/categories/${id}`, payload);
  }

  async deleteCategory(id: string) {
    await this.fetchingService.delete(`/categories/${id}`);
  }
}

const categoryService = new CategoryService();
export { categoryService };
