import { useSearchParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading, TextInput } from "../../components/common/Common";
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

  return (
    <>
      <h1>חדרי בריחה</h1>
      <p>בחרו חדר והתחילו לשחק.</p>

      <div className="filters">
        <TextInput
          id="room-search"
          label="חיפוש חדר"
          value={search}
          onChange={(value) => setParam("q", value)}
          placeholder="הקלד שם או תיאור..."
        />

        <div>
          <label htmlFor="category-filter">קטגוריה</label>
          <input
            id="category-filter"
            list="category-options"
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
          />
          <datalist id="category-options">
            {SUGGESTED_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="difficulty-filter">רמת קושי</label>
          <select
            id="difficulty-filter"
            value={difficulty}
            onChange={(e) => setParam("difficulty", e.target.value)}
          >
            <option value="">הכל</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABELS[d]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn-ghost"
          onClick={() => setParams({}, { replace: true })}
        >
          איפוס סינון
        </button>
      </div>

      <div className="room-grid">
        {data.items.length === 0 && <p>לא נמצאו חדרים התואמים לחיפוש.</p>}
        {data.items.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
          >
            הקודם
          </button>{" "}
          עמוד {page} מתוך {totalPages}{" "}
          <button
            type="button"
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
