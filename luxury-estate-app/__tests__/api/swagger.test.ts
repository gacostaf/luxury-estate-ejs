import { describe, it, expect } from '@jest/globals';
import { GET } from '@/app/api/swagger/route';

describe('Swagger API', () => {
  describe('GET /api/swagger', () => {
    it('should return swagger spec', async () => {
      const res = await GET();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.openapi).toBe('3.0.0');
      expect(json.info.title).toBe('Luxury Estate API');
      expect(json.paths).toBeDefined();
    });
  });
});
