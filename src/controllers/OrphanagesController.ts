import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import OrphanageView from '../views/orphanages_view';

/* INDEX, SHOW, CREATE, UPDATE, DELETE */

export default {
  async index(request: Request, response: Response){
    const orphanageRepository = getRepository(Orphanage);
    const orphanages = await orphanageRepository.find({
      relations: ['images']
    });

    return response.json(OrphanageView.renderMany(orphanages));
  },

  async show(request: Request, response: Response){
    const { id } = request.params;
    const orphanageRepository = getRepository(Orphanage);
    const orphanage = await orphanageRepository.findOneOrFail(id, { 
      relations: ['images']
    });

    return response.json(OrphanageView.render(orphanage));
  },

  async create(request: Request, response: Response){
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body;
  
    const orphanagesRepository = getRepository(Orphanage);
    
    const requestImages =  request.files as Express.Multer.File[];
    const images = requestImages.map( image => {
      return { path: image.filename }
    });

    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    });
  
    await orphanagesRepository.save(orphanage);
    return response.status(201).json(orphanage);
  }
};