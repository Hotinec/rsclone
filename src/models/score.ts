import { model, Schema, Model, Document } from 'mongoose';

export interface IScore extends Document {
  name: string;
  time: string;
  score: number;
  date: Date;
}

const ScoreSchema: Schema = new Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, required: true }
});

export const scoreModel: Model<IScore> = model('score', ScoreSchema);
