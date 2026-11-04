export const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export const secondsBetween = (from: string, to: string | number = Date.now()) =>
  Math.max(0, Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 1000));
