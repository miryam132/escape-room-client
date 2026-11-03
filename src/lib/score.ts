import { SCORING } from "../constants";

export type GameStats = { seconds: number; hintsUsed: number; wrongAnswers: number };

export const calcScore = ({ seconds, hintsUsed, wrongAnswers }: GameStats) =>
  Math.max(
    0,
    SCORING.base -
      seconds * SCORING.perSecond -
      hintsUsed * SCORING.perHint -
      wrongAnswers * SCORING.perWrongAnswer,
  );

export const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
