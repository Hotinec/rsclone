import { Router } from 'express';
import ScoreController from '../controllers/score';

const scoreRouter:Router = Router();

scoreRouter.get('/all', ScoreController.getAll);
scoreRouter.post('/add', ScoreController.addScore);

export default scoreRouter;
