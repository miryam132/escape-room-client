import { useSearchParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading, PageTitle } from "../../components/common/Common";
import { Icon } from "../../components/common/Icon";
import { RoomCard } from "../../components/common/RoomCard";
import { DIFFICULTIES, DIFFICULTY_LABELS, SUGGESTED_CATEGORIES } from "../../constants";
import { useRooms } from "../../hooks/rooms";

const PAGE_SIZE = 12;

export default function RoomsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const difficulty = params.get("difficulty") ?? "";
  const page = Number(params.get("page")) || 1;

  // Filtering and paging happen on the server.
  const { data, isPending, isError, error } = useRooms({
    search,
    category,
    difficulty,
    page,
    pageSize: PAGE_SIZE,
  });

  const setParam = (key: string, value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page"); // a new filter starts from the first page
        return next;
      },
      { replace: true },
    );

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage={errorMessage(error, "שגיאה בטעינת החדרים.")} />;

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hasFilters = Boolean(search || category || difficulty);

  return (
    <>
      <PageTitle eyebrow="הקטלוג" title="חדרי בריחה">
        <p className="lead">בחרו חדר והתחילו לשחק.</p>
      </PageTitle>

      <div className="filters">
        <div className="form-field filter-search">
          <label htmlFor="room-search">חיפוש חדר</label>
          <div className="input-icon">
            <Icon name="search" size={18} />
            <input
              id="room-search"
              type="search"
              value={search}
              placeholder="הקלד שם או תיאור..."
              onChange={(e) => setParam("q", e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="category-filter">קטגוריה</label>
          <input
            id="category-filter"
            list="category-options"
            value={category}
            placeholder="הכל"
            onChange={(e) => setParam("category", e.target.value)}
          />
          <datalist id="category-options">
            {SUGGESTED_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="form-field">
          <span className="field-label" id="difficulty-label">
            רמת קושי
          </span>
          <div className="chips" role="group" aria-labelledby="difficulty-label">
            <button
              type="button"
              className="chip"
              aria-pressed={!difficulty}
              onClick={() => setParam("difficulty", "")}
            >
              הכל
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`chip chip-${d}`}
                aria-pressed={difficulty === d}
                onClick={() => setParam("difficulty", d)}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm filters-reset"
            onClick={() => setParams({}, { replace: true })}
          >
            איפוס סינון
          </button>
        )}
      </div>

      {data.items.length === 0 && (
        <div className="empty">
          <Icon name="search" size={28} />
          <p>לא נמצאו חדרים התואמים לחיפוש.</p>
        </div>
      )}

      <div className="room-grid">
        {data.items.map((room, i) => (
          <RoomCard key={room.id} room={room} index={i} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pager" aria-label="עמודים">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
          >
            הקודם
          </button>
          <span>
            עמוד {page} מתוך {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= totalPages}
            onClick={() => setParam("page", String(page + 1))}
          >
            הבא
          </button>
        </nav>
      )}
    </>
  );
}
