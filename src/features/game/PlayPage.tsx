import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { RoomImage } from "../../components/common/RoomImage";
import { HotspotPanel } from "../../components/game/HotspotPanel";
import { Leaderboard } from "../../components/game/Leaderboard";
import {
  useGame,
  useHint,
  useOpenHotspot,
  useRestartGame,
  useSubmitAnswer,
} from "../../hooks/game";
import { useRoom } from "../../hooks/rooms";
import { useElapsed } from "../../hooks/useElapsed";
import { formatTime } from "../../lib/format";
import type { RoomSummary } from "../../types/escapeRoom";
import type { Game } from "../../types/game";

function Board({ room, game }: { room: RoomSummary; game: Game }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hints, setHints] = useState<Record<string, string>>({});
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const isCompleted = game.status === "COMPLETED";
  const finalId = game.hotspots.find((h) => h.isFinal)?.id ?? null;
  const seconds = useElapsed(game.startedAt, game.completedAt);

  const hotspot = useOpenHotspot(room.id, isCompleted ? finalId : selectedId);
  const submit = useSubmitAnswer(room.id);
  const hint = useHint(room.id);
  const restart = useRestartGame(room.id);

  function open(id: string) {
    setSelectedId(id);
    setAnswer("");
    setFeedback("");
  }

  function checkAnswer() {
    if (!selectedId) return;
    submit.mutate(
      { hotspotId: selectedId, answer, revision: game.revision },
      {
        onSuccess: (result) => {
          if (result.correct) {
            setAnswer("");
            setFeedback("תשובה נכונה!");
          } else {
            setWrongAnswers((n) => n + 1);
            setFeedback("התשובה אינה נכונה, נסה שוב.");
          }
        },
        onError: (error) => setFeedback(errorMessage(error)),
      },
    );
  }

  function showHint() {
    if (!selectedId) return;
    const id = selectedId;
    hint.mutate(id, {
      onSuccess: ({ hint: text }) =>
        setHints((prev) => ({ ...prev, [id]: text ?? "אין רמז לחידה הזו." })),
      onError: (error) => setFeedback(errorMessage(error)),
    });
  }

  return (
    <div className="play">
      <h1>{room.title}</h1>
      <div className="hud">
        <span className="chip">
          <small>זמן</small>
          <b>{formatTime(seconds)}</b>
        </span>
        <span className="chip">
          <small>חידות</small>
          <b>
            {game.solvedCount}/{game.totalPuzzles}
          </b>
        </span>
        {!isCompleted && (
          <>
            <span className="chip">
              <small>רמזים</small>
              <b>{Object.keys(hints).length}</b>
            </span>
            <span className="chip">
              <small>טעויות</small>
              <b>{wrongAnswers}</b>
            </span>
          </>
        )}
      </div>

      <RoomImage
        imageUrl={room.imageUrl}
        alt={room.title}
        hotspots={game.hotspots}
        onHotspotClick={(h) => !isCompleted && open(h.id)}
      />

      {isCompleted ? (
        <section role="status" className="victory">
          <h2>כל הכבוד! השלמת את החדר</h2>
          {hotspot.data?.content && (
            <p style={{ whiteSpace: "pre-line" }}>{hotspot.data.content}</p>
          )}
          <ul>
            <li>זמן: {formatTime(seconds)}</li>
            <li>רמזים שנעשה בהם שימוש: {Object.keys(hints).length}</li>
            <li>תשובות שגויות: {wrongAnswers}</li>
          </ul>
          <button
            type="button"
            disabled={restart.isPending}
            onClick={() => window.confirm("להתחיל את החדר מחדש?") && restart.mutate(game.revision)}
          >
            שחק שוב
          </button>{" "}
          <Link to="/rooms">חזרה לחדרים</Link>
          {restart.isError && <p role="alert">{errorMessage(restart.error)}</p>}
          <Leaderboard roomId={room.id} />
        </section>
      ) : selectedId ? (
        hotspot.isPending ? (
          <Loading />
        ) : hotspot.isError ? (
          <ErrorMessage errorMessage={errorMessage(hotspot.error)} />
        ) : (
          <HotspotPanel
            hotspot={hotspot.data}
            userAnswer={answer}
            feedback={feedback}
            hint={hints[selectedId]}
            isBusy={submit.isPending || hint.isPending}
            onAnswerChange={setAnswer}
            onCheckAnswer={checkAnswer}
            onShowHint={showHint}
            onClose={() => setSelectedId(null)}
          />
        )
      ) : null}
    </div>
  );
}

export default function PlayPage() {
  const { id } = useParams();
  const room = useRoom(id);
  const game = useGame(room.data?.isPlayable ? id : undefined);

  if (room.isPending) return <Loading />;
  if (room.isError)
    return <ErrorMessage errorMessage={errorMessage(room.error, "שגיאה בטעינת החדר.")} />;

  if (!room.data.isPlayable) {
    return (
      <>
        <p>החדר עדיין לא מוכן למשחק.</p>
        <Link to="/rooms">חזרה לחדרים</Link>
      </>
    );
  }

  if (game.isPending) return <Loading />;
  if (game.isError)
    return <ErrorMessage errorMessage={errorMessage(game.error, "לא ניתן להתחיל את המשחק.")} />;

  // Restarting gives a new startedAt, which also resets the local counters via the key.
  return <Board key={game.data.startedAt} room={room.data} game={game.data} />;
}
