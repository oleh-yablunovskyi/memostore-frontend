import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';

class CategoryService {
  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getCategories() {
    const response = await this.fetchingService.get('/categories?page=1&limit=100');
    return response.data.data;
  }
}

const categoryService = new CategoryService();
export { categoryService };
