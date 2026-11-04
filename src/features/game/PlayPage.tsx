import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { HotspotPanel } from "../../components/game/HotspotPanel";
import { Leaderboard } from "../../components/game/Leaderboard";
import Secret from "../../components/fx/Secret";
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

type LogEntry = { t: number; text: string; label?: string; sys?: boolean };

const STATE_ICON = { LOCKED: "🔒", AVAILABLE: "•", SOLVED: "✓" } as const;

function readNotes(key: string) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function Board({ room, game }: { room: RoomSummary; game: Game }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [hints, setHints] = useState<Record<string, string>>({});
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([{ t: 0, text: "הדלת ננעלה. בהצלחה", sys: true }]);
  const notesKey = `mysteria-notes-${room.id}`;
  const [notes, setNotes] = useState(() => readNotes(notesKey));
  const [winOpen, setWinOpen] = useState(true);

  const isCompleted = game.status === "COMPLETED";
  const finalId = game.hotspots.find((h) => h.isFinal)?.id ?? null;
  const seconds = useElapsed(game.startedAt, game.completedAt);

  const hotspot = useOpenHotspot(room.id, isCompleted ? finalId : selectedId);
  const submit = useSubmitAnswer(room.id);
  const hint = useHint(room.id);
  const restart = useRestartGame(room.id);

  const selected = game.hotspots.find((h) => h.id === selectedId) ?? null;
  const addLog = (text: string, label?: string, sys = false) =>
    setLog((prev) => [{ t: seconds, text, label, sys }, ...prev].slice(0, 40));

  useEffect(() => {
    try {
      localStorage.setItem(notesKey, notes);
    } catch {
      /* notes simply stay in memory when storage is unavailable */
    }
  }, [notes, notesKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function open(id: string) {
    if (isCompleted) return;
    const spot = game.hotspots.find((h) => h.id === id);
    setSelectedId(id);
    setAnswer("");
    setFeedback(null);
    if (spot) addLog("בדקת את", spot.label);
  }

  function checkAnswer() {
    if (!selectedId || !selected) return;
    submit.mutate(
      { hotspotId: selectedId, answer, revision: game.revision },
      {
        onSuccess: (result) => {
          if (result.correct) {
            setAnswer("");
            setFeedback({ text: "תשובה נכונה!", ok: true });
            addLog("פתרת את", selected.label, true);
          } else {
            setWrongAnswers((n) => n + 1);
            setFeedback({ text: "התשובה אינה נכונה, נסו שוב.", ok: false });
            addLog("ניסיון שגוי ב", selected.label);
          }
        },
        onError: (error) => setFeedback({ text: errorMessage(error), ok: false }),
      },
    );
  }

  function showHint() {
    if (!selectedId) return;
    const id = selectedId;
    hint.mutate(id, {
      onSuccess: ({ hint: text }) => {
        setHints((prev) => ({ ...prev, [id]: text ?? "אין רמז לחידה הזו." }));
        addLog("ביקשת רמז", undefined, true);
      },
      onError: (error) => setFeedback({ text: errorMessage(error), ok: false }),
    });
  }

  const hintsUsed = Object.keys(hints).length;
  const canHint = Boolean(selected && hotspot.data?.hasHint && !hints[selected.id]);

  return (
    <div className="play">
      {/* ── top bar ── */}
      <header className="play-bar">
        <div className="case">
          <div className="label">{room.category}</div>
          <h1>{room.title}</h1>
        </div>
        <div className={`timer${isCompleted ? " done" : ""}`}>
          <div className="label">זמן</div>
          <output dir="ltr">{formatTime(seconds)}</output>
          <div className="prog" aria-label={`נפתרו ${game.solvedCount} מתוך ${game.totalPuzzles}`}>
            {Array.from({ length: game.totalPuzzles }, (_, i) => (
              <i key={i} className={i < game.solvedCount ? "on" : ""} />
            ))}
          </div>
        </div>
        <div className="play-actions">
          <Link to="/rooms" className="ctl">
            ← יציאה
          </Link>
        </div>
      </header>

      <div className="play-main">
        {/* ── left: list of points ── */}
        <aside className="panel play-list">
          <div className="label">בחדר</div>
          <h2>נקודות חקירה</h2>
          <ul>
            {game.hotspots.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  className={`row-btn state-${h.state.toLowerCase()}`}
                  aria-current={h.id === selectedId}
                  onClick={() => open(h.id)}
                >
                  <i aria-hidden="true">{STATE_ICON[h.state]}</i>
                  {h.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="muted">לחצו על נקודה בחדר או בחרו מהרשימה.</p>
        </aside>

        {/* ── center: the room ── */}
        <div className="stage">
          <img src={room.imageUrl} alt={room.title} className="stage-img" />
          <div className="stage-shade" aria-hidden="true" />
          <div className="where label">
            חדר
            <b>{room.title}</b>
          </div>
          <div className="stage-secret" aria-hidden="true">
            <Secret>כל מה שנראה סתמי — לא סתמי</Secret>
          </div>

          {game.hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`hot hot-${h.state.toLowerCase()}`}
              style={{ left: `${h.xpercent}%`, top: `${h.ypercent}%` }}
              aria-label={h.label}
              aria-pressed={h.id === selectedId}
              disabled={isCompleted}
              onClick={() => open(h.id)}
            >
              <span>
                {h.state === "LOCKED" && "🔒 "}
                {h.label}
              </span>
            </button>
          ))}

          {!isCompleted && selectedId && (
            <>
              {hotspot.isPending ? (
                <div className="drawer">
                  <Loading />
                </div>
              ) : hotspot.isError ? (
                <div className="drawer">
                  <ErrorMessage errorMessage={errorMessage(hotspot.error)} />
                </div>
              ) : (
                <HotspotPanel
                  hotspot={hotspot.data}
                  userAnswer={answer}
                  feedback={feedback}
                  isBusy={submit.isPending}
                  onAnswerChange={setAnswer}
                  onCheckAnswer={checkAnswer}
                  onClose={() => setSelectedId(null)}
                />
              )}
            </>
          )}
        </div>

        {/* ── right: hints, notes, log ── */}
        <aside className="play-side">
          <div className="panel">
            <div className="label">רמזים</div>
            <h2>תקועים?</h2>
            {selected && hints[selected.id] ? (
              <p className="hintbox">{hints[selected.id]}</p>
            ) : null}
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!canHint || hint.isPending}
              onClick={showHint}
            >
              <span>
                {!selected
                  ? "בחרו נקודה לקבלת רמז"
                  : hotspot.data?.hasHint === false
                    ? "אין רמז לנקודה הזו"
                    : hints[selected.id]
                      ? "הרמז מוצג"
                      : "בקשת רמז"}
              </span>
            </button>
            <p className="muted">נעשה שימוש ב־{hintsUsed} רמזים</p>
          </div>

          <div className="panel">
            <div className="label">לוח אישי</div>
            <h2>הערות</h2>
            <textarea
              aria-label="הערות"
              placeholder="רשמו כאן קודים, מספרים ורעיונות…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="panel feed-panel">
            <div className="label">מה קורה בחדר</div>
            <h2>יומן</h2>
            <ul className="feed">
              {log.map((entry, i) => (
                <li key={`${entry.t}-${i}`} className={entry.sys ? "sys" : undefined}>
                  <time dir="ltr">{formatTime(entry.t)}</time>
                  <span>
                    {entry.text} {entry.label && <b>{entry.label}</b>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* ── win overlay ── */}
      {isCompleted &&
        winOpen &&
        createPortal(
          <div className="veil" role="status">
            <div className="veil-card">
              <div className="label">{room.title} · נפתר</div>
              <h2>הדלת נפתחה</h2>
              {hotspot.data?.content && <p className="veil-text">{hotspot.data.content}</p>}
              <div className="stats">
                <div>
                  <b>{formatTime(seconds)}</b>
                  <span>זמן</span>
                </div>
                <div>
                  <b>{hintsUsed}</b>
                  <span>רמזים</span>
                </div>
                <div>
                  <b>{wrongAnswers}</b>
                  <span>טעויות</span>
                </div>
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={restart.isPending}
                  onClick={() => restart.mutate(game.revision)}
                >
                  <span>לשחק שוב</span>
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setWinOpen(false)}>
                  <span>חזרה לחדר</span>
                </button>
                <Link to="/rooms" className="btn btn-ghost">
                  <span>לכל החדרים</span>
                </Link>
              </div>
              {restart.isError && <p role="alert">{errorMessage(restart.error)}</p>}
              <Leaderboard roomId={room.id} />
            </div>
          </div>,
          document.body,
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
