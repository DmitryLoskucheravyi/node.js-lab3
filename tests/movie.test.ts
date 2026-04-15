import request from 'supertest';
import app from '../src/app';
import { resetStorage } from '../src/storage/movie';

beforeEach(() => {
  resetStorage();
});

describe('Movies API', () => {

  // 🔹 CREATE

  it('should create movie', async () => {
    const res = await request(app)
      .post('/api/movies')
      .send({
        title: 'Inception',
        year: 2010,
        genre: 'action',
        rating: 9
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should fail validation on create', async () => {
    await request(app)
      .post('/api/movies')
      .send({})
      .expect(400);
  });

  it('should fail validation with wrong types', async () => {
    await request(app)
      .post('/api/movies')
      .send({
        title: 'Test',
        year: 'wrong',
        genre: 'action',
        rating: 8
      })
      .expect(400);
  });

  // 🔹 GET ALL

  it('should return empty array', async () => {
    const res = await request(app)
      .get('/api/movies')
      .expect(200);

    expect(res.body).toEqual([]);
  });

  it('should get all movies', async () => {
    await request(app).post('/api/movies').send({
      title: 'Movie1',
      year: 2020,
      genre: 'action',
      rating: 8
    });

    const res = await request(app)
      .get('/api/movies')
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  // 🔹 GET BY ID

  it('should get movie by id', async () => {
    const create = await request(app)
      .post('/api/movies')
      .send({
        title: 'Movie',
        year: 2020,
        genre: 'action',
        rating: 8
      });

    const res = await request(app)
      .get(`/api/movies/${create.body.id}`)
      .expect(200);

    expect(res.body.id).toBe(create.body.id);
  });

  it('should return 404 for non-existing movie', async () => {
    await request(app)
      .get('/api/movies/123')
      .expect(404);
  });

  // 🔹 UPDATE

  it('should update movie', async () => {
    const create = await request(app)
      .post('/api/movies')
      .send({
        title: 'Movie',
        year: 2020,
        genre: 'action',
        rating: 8
      });

    const res = await request(app)
      .patch(`/api/movies/${create.body.id}`)
      .send({ rating: 9 })
      .expect(200);

    expect(res.body.rating).toBe(9);
  });

  it('should return 404 on update', async () => {
    await request(app)
      .patch('/api/movies/123')
      .send({ rating: 9 })
      .expect(404);
  });

  it('should validate update', async () => {
    const create = await request(app)
      .post('/api/movies')
      .send({
        title: 'Movie',
        year: 2020,
        genre: 'action',
        rating: 8
      });

    await request(app)
      .patch(`/api/movies/${create.body.id}`)
      .send({ rating: 'bad' })
      .expect(400);
  });

  // 🔹 DELETE

  it('should delete movie', async () => {
    const create = await request(app)
      .post('/api/movies')
      .send({
        title: 'Movie',
        year: 2020,
        genre: 'action',
        rating: 8
      });

    await request(app)
      .delete(`/api/movies/${create.body.id}`)
      .expect(204);
  });

  it('should return 404 on delete', async () => {
    await request(app)
      .delete('/api/movies/123')
      .expect(404);
  });

  // 🔹 FILTERS

  it('should filter by genre', async () => {
    await request(app).post('/api/movies').send({
      title: 'A',
      year: 2020,
      genre: 'action',
      rating: 8
    });

    await request(app).post('/api/movies').send({
      title: 'B',
      year: 2020,
      genre: 'comedy',
      rating: 7
    });

    const res = await request(app)
      .get('/api/movies?genre=action')
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  it('should filter by minRating', async () => {
    await request(app).post('/api/movies').send({
      title: 'A',
      year: 2020,
      genre: 'action',
      rating: 5
    });

    await request(app).post('/api/movies').send({
      title: 'B',
      year: 2020,
      genre: 'action',
      rating: 9
    });

    const res = await request(app)
      .get('/api/movies?minRating=8')
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  it('should combine filters', async () => {
    await request(app).post('/api/movies').send({
      title: 'A',
      year: 2020,
      genre: 'action',
      rating: 9
    });

    await request(app).post('/api/movies').send({
      title: 'B',
      year: 2020,
      genre: 'comedy',
      rating: 9
    });

    const res = await request(app)
      .get('/api/movies?genre=action&minRating=8')
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  // 🔹 CUSTOM ROUTE

  it('should get top movies', async () => {
    await request(app).post('/api/movies').send({
      title: 'Top',
      year: 2020,
      genre: 'action',
      rating: 9
    });

    await request(app).post('/api/movies').send({
      title: 'Low',
      year: 2020,
      genre: 'action',
      rating: 5
    });

    const res = await request(app)
      .get('/api/movies/top')
      .expect(200);

    expect(res.body.length).toBe(1);
  });

});