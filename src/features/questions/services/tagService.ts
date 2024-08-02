import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';

class TagService {
  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getTags() {
    const response = await this.fetchingService.get('/tags?page=1&limit=100');
    return response.data.data;
  }
}

const tagService = new TagService();
export { tagService };
