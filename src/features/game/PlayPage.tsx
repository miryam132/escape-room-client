import { useState } from "react";
import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { Icon } from "../../components/common/Icon";
import { RoomImage } from "../../components/common/RoomImage";
import { HotspotPanel, PanelFrame } from "../../components/game/HotspotPanel";
import type { PanelFeedback } from "../../components/game/HotspotPanel";
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
  const [feedback, setFeedback] = useState<PanelFeedback | null>(null);
  const say = (text: string, ok: boolean) => setFeedback({ text, ok, n: Date.now() });
  const [hints, setHints] = useState<Record<string, string>>({});
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const isCompleted = game.status === "COMPLETED";
  // The "you escaped" pop-up appears the moment the last puzzle is solved (not when you
  // come back to a room you already finished).
  const [startedActive] = useState(game.status === "ACTIVE");
  const [celebrationClosed, setCelebrationClosed] = useState(false);
  const celebrate = isCompleted && startedActive && !celebrationClosed;
  const finalId = game.hotspots.find((h) => h.isFinal)?.id ?? null;
  const seconds = useElapsed(game.startedAt, game.completedAt);

  const hotspot = useOpenHotspot(room.id, isCompleted ? finalId : selectedId);
  const submit = useSubmitAnswer(room.id);
  const hint = useHint(room.id);
  const restart = useRestartGame(room.id);

  function open(id: string) {
    setSelectedId(id);
    setAnswer("");
    setFeedback(null);
  }

  function checkAnswer() {
    if (!selectedId) return;
    submit.mutate(
      { hotspotId: selectedId, answer, revision: game.revision },
      {
        onSuccess: (result) => {
          if (result.correct) {
            setAnswer("");
            say("תשובה נכונה!", true);
          } else {
            setWrongAnswers((n) => n + 1);
            say("התשובה אינה נכונה, נסה שוב.", false);
          }
        },
        onError: (error) => say(errorMessage(error), false),
      },
    );
  }

  function showHint() {
    if (!selectedId) return;
    const id = selectedId;
    hint.mutate(id, {
      onSuccess: ({ hint: text }) =>
        setHints((prev) => ({ ...prev, [id]: text ?? "אין רמז לחידה הזו." })),
      onError: (error) => say(errorMessage(error), false),
    });
  }

  const progress = game.totalPuzzles ? (game.solvedCount / game.totalPuzzles) * 100 : 0;
  const closePanel = () => setSelectedId(null);

  return (
    <div className="play">
      <div className="hud">
        <div className="hud-top">
          <div>
            <Link to="/rooms" className="back-link">
              <Icon name="arrow" size={16} />
              יציאה לחדרים
            </Link>
            <h1>{room.title}</h1>
          </div>
          <div className="hud-timer" aria-label="זמן במשחק">
            <Icon name="clock" size={20} />
            <span className="mono">{formatTime(seconds)}</span>
          </div>
        </div>

        <div className="hud-bottom">
          <div
            className="progress"
            role="progressbar"
            aria-label="התקדמות"
            aria-valuemin={0}
            aria-valuemax={game.totalPuzzles}
            aria-valuenow={game.solvedCount}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="hud-stats">
            <span>
              נפתרו <b>{game.solvedCount}</b> מתוך <b>{game.totalPuzzles}</b> חידות
            </span>
            {!isCompleted && (
              <>
                <span>
                  רמזים: <b>{Object.keys(hints).length}</b>
                </span>
                <span>
                  טעויות: <b>{wrongAnswers}</b>
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="frame frame-play">
        <RoomImage
          imageUrl={room.imageUrl}
          alt={room.title}
          hotspots={game.hotspots}
          onHotspotClick={(h) => !isCompleted && open(h.id)}
        />
      </div>

      {isCompleted ? (
        <section role="status" className="victory">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} style={{ "--k": i } as CSSProperties} />
            ))}
          </div>
          <span className="victory-icon">
            <Icon name="door" size={34} />
          </span>
          <h2>כל הכבוד! השלמת את החדר</h2>
          {hotspot.data?.content && <p className="victory-text">{hotspot.data.content}</p>}
          <ul className="victory-stats">
            <li>
              <span className="mono">{formatTime(seconds)}</span>
              <small>זמן</small>
            </li>
            <li>
              <span className="mono">{Object.keys(hints).length}</span>
              <small>רמזים שנעשה בהם שימוש</small>
            </li>
            <li>
              <span className="mono">{wrongAnswers}</span>
              <small>תשובות שגויות</small>
            </li>
          </ul>
          <div className="victory-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={restart.isPending}
              onClick={() =>
                window.confirm("להתחיל את החדר מחדש?") && restart.mutate(game.revision)
              }
            >
              שחק שוב
            </button>
            <Link to="/rooms" className="btn btn-ghost">
              חזרה לחדרים
            </Link>
          </div>
          {restart.isError && <p role="alert">{errorMessage(restart.error)}</p>}
          <Leaderboard roomId={room.id} />
        </section>
      ) : selectedId ? (
        hotspot.isPending ? (
          <PanelFrame title="טוען" onClose={closePanel}>
            <Loading />
          </PanelFrame>
        ) : hotspot.isError ? (
          <PanelFrame title="שגיאה" onClose={closePanel}>
            <ErrorMessage errorMessage={errorMessage(hotspot.error)} />
          </PanelFrame>
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
            onClose={closePanel}
          />
        )
      ) : null}

      {celebrate && (
        <PanelFrame
          title="השלמת את החדר"
          className="victory-dialog"
          onClose={() => setCelebrationClosed(true)}
        >
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} style={{ "--k": i } as CSSProperties} />
            ))}
          </div>
          <span className="victory-icon">
            <Icon name="door" size={34} />
          </span>
          <h2>כל הכבוד! השלמת את החדר</h2>
          {hotspot.data?.content && <p className="victory-text">{hotspot.data.content}</p>}
          <ul className="victory-stats">
            <li>
              <span className="mono">{formatTime(seconds)}</span>
              <small>זמן</small>
            </li>
            <li>
              <span className="mono">{Object.keys(hints).length}</span>
              <small>רמזים</small>
            </li>
            <li>
              <span className="mono">{wrongAnswers}</span>
              <small>טעויות</small>
            </li>
          </ul>
          <div className="victory-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCelebrationClosed(true)}
            >
              <Icon name="trophy" size={18} />
              לוח התוצאות
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={restart.isPending}
              onClick={() => restart.mutate(game.revision)}
            >
              שחק שוב
            </button>
            <Link to="/rooms" className="btn btn-ghost">
              חזרה לחדרים
            </Link>
          </div>
        </PanelFrame>
      )}
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
      <div className="empty">
        <p>החדר עדיין לא מוכן למשחק.</p>
        <Link to="/rooms" className="btn btn-ghost">
          חזרה לחדרים
        </Link>
      </div>
    );
  }

  if (game.isPending) return <Loading />;
  if (game.isError)
    return <ErrorMessage errorMessage={errorMessage(game.error, "לא ניתן להתחיל את המשחק.")} />;

  // Restarting gives a new startedAt, which also resets the local counters via the key.
  return <Board key={game.data.startedAt} room={room.data} game={game.data} />;
}
