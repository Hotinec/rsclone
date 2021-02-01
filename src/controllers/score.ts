import { Request, Response } from 'express';
import { IScore, scoreModel } from '../models/score';

class ScoreController {
  async getAll (req:Request, res:Response):Promise<void> {
    try {
      const scores:Array<IScore>|any = await scoreModel.find({});
      if (!scores) {
        res.status(404).send({ message: 'Scores not found' });
        return;
      }
      const sortedScores:Array<IScore> = scores.sort((a:IScore, b:IScore):number => Number(b.score) - Number(a.score));
      res.status(200).json(sortedScores);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async addScore (req:Request, res:Response):Promise<void> {
    try {
      const { name, score, time }:{name:string, score:number, time:string} = req.body;
      const newScoreItem:IScore|any = await scoreModel.create({
        name, score, time, date: Date.now()
      });
      console.log(newScoreItem);
      res.status(200).json(newScoreItem);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

export default new ScoreController();
