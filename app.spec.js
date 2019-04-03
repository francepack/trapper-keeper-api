import request from 'supertest';
import '@babel/polyfill';
import app from './app';

describe('api', () => {
  let notes;
  beforeEach(() => {
    notes = [
      { id: 1, title: 'MockNote1', items: ['a', 'b', 'c'] },
      { id: 2, title: 'MockNote2', items: ['d', 'e', 'f'] },
      { id: 3, title: 'MockNote3', items: ['g', 'h', 'i'] }
    ];
  });

  describe('get /api/v1/pets', () => {
    it('should', () => {

    });

  });

  describe('get /api/v1/pets/:id', () => {

    
  });

  describe('post /api/v1/pets', () => {

    
  });

  describe('put /api/v1/pets/:id', () => {

    
  });

  describe('delete /api/v1/pets/:id', () => {

    
  });
});