export type GameResult = {
  id: string;
  roomId: string;
  roomTitle: string;
  userId: string;
  userName: string;
  seconds: number;
  hintsUsed: number;
  wrongAnswers: number;
  score: number;
  finishedAt: string;
};
