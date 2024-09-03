import { AxiosInstance } from 'axios';
import { api } from '../../../shared/services/api/api';
import { ITagPayload } from '../types';

class TagService {
  constructor(
    private fetchingService: AxiosInstance = api,
  ) {}

  async getTags() {
    const response = await this.fetchingService.get('/tags?page=1&limit=100');
    return response.data.data;
  }

  async createTag(payload: ITagPayload) {
    await this.fetchingService.post('/tags', payload);
  }

  async updateTag(id: string, payload: ITagPayload) {
    await this.fetchingService.patch(`/tags/${id}`, payload);
  }

  async deleteTag(id: string) {
    await this.fetchingService.delete(`/tags/${id}`);
  }
}

const tagService = new TagService();
export { tagService };
