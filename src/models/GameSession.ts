import mongoose from 'mongoose';

export interface IGameSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  level: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  }
});

export const GameSession = mongoose.model<IGameSession>('GameSession', gameSessionSchema); 