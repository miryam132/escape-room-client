import { Link, useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { RoomImage } from "../../components/common/RoomImage";
import { HotspotPanel } from "../../components/game/HotspotPanel";
import { ResultSummary } from "../../components/game/ResultSummary";
import { useAuth } from "../auth/authContext";
import { useRoom, useRoomHotspots } from "../../hooks/rooms";
import { useSaveResult } from "../../hooks/results";
import { useGame } from "../../hooks/useGame";
import { calcScore, formatTime } from "../../lib/score";
import type { GameStats } from "../../lib/score";
import type { EscapeRoom } from "../../types/escapeRoom";
import type { Hotspot } from "../../types/hotspot";
import { useState } from "react";

function Game({ room, hotspots }: { room: EscapeRoom; hotspots: Hotspot[] }) {
  const { user } = useAuth();
  const saveResult = useSaveResult();
  const [stats, setStats] = useState<GameStats | null>(null);

  const game = useGame(hotspots, (finalStats) => {
    setStats(finalStats);
    saveResult.mutate({
      ...finalStats,
      score: calcScore(finalStats),
      roomId: room.id,
      roomTitle: room.title,
      userId: user!.id,
      userName: user!.name,
    });
  });

  return (
    <div>
      <h1>{room.title}</h1>
      <p>
        ⏱ {formatTime(game.seconds)} · רמזים: {game.hintsUsed} · טעויות: {game.wrongAnswers}
      </p>

      <RoomImage
        imageUrl={room.imageUrl}
        alt={room.title}
        hotspots={hotspots}
        solvedHotspotIds={game.solvedIds}
        lockedHotspotIds={game.lockedIds}
        onHotspotClick={game.select}
      />

      {game.isCompleted && stats ? (
        <ResultSummary
          roomId={room.id}
          stats={stats}
          onReplay={() => {
            setStats(null);
            game.reset();
          }}
        />
      ) : game.selected ? (
        <HotspotPanel
          hotspot={game.selected}
          userAnswer={game.answer}
          answerFeedback={game.feedback}
          isHintVisible={game.isHintVisible}
          onAnswerChange={game.setAnswer}
          onCheckAnswer={game.check}
          onShowHint={game.showHint}
          onClose={game.close}
        />
      ) : (
        <p role="status">{game.feedback}</p>
      )}
    </div>
  );
}

export default function PlayPage() {
  const { id } = useParams();
  const room = useRoom(id);
  const hotspots = useRoomHotspots(id);

  if (room.isPending || hotspots.isPending) return <Loading />;
  if (room.isError || hotspots.isError) return <ErrorMessage errorMessage="שגיאה בטעינת החדר." />;
  if (!room.data) {
    return (
      <>
        <p>החדר לא נמצא</p>
        <Link to="/rooms">חזרה לחדרים</Link>
      </>
    );
  }

  return <Game key={room.data.id} room={room.data} hotspots={hotspots.data} />;
}
