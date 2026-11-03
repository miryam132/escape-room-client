import { useSearchParams } from "react-router-dom";
import { ErrorMessage, Loading, TextInput } from "../../components/common/Common";
import { RoomCard } from "../../components/common/RoomCard";
import { CATEGORIES, CATEGORY_LABELS, DIFFICULTIES, DIFFICULTY_LABELS } from "../../constants";
import { useRooms } from "../../hooks/rooms";

const FILTERS = [
  {
    key: "difficulty",
    label: "סינון לפי רמת קושי",
    options: DIFFICULTIES,
    names: DIFFICULTY_LABELS,
  },
  { key: "category", label: "סינון לפי קטגוריה", options: CATEGORIES, names: CATEGORY_LABELS },
] as const;

export default function RoomsPage() {
  const { data: rooms, isPending, isError } = useRooms();
  const [params, setParams] = useSearchParams();

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage="שגיאה בטעינת החדרים." />;

  const setParam = (key: string, value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const search = params.get("q") ?? "";
  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(search.toLowerCase()) &&
      (!params.get("difficulty") || room.difficulty === params.get("difficulty")) &&
      (!params.get("category") || room.category === params.get("category")),
  );

  return (
    <>
      <h1>חדרי בריחה</h1>
      <p>בחרו חדר והתחילו לשחק.</p>

      <div>
        <TextInput
          id="room-search"
          label="חיפוש חדר"
          value={search}
          onChange={(value) => setParam("q", value)}
          placeholder="הקלד שם חדר..."
        />

        {FILTERS.map(({ key, label, options, names }) => (
          <div key={key}>
            <label htmlFor={`${key}-filter`}>{label}</label>
            <select
              id={`${key}-filter`}
              value={params.get(key) ?? ""}
              onChange={(e) => setParam(key, e.target.value)}
            >
              <option value="">הכל</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {(names as Record<string, string>)[option]}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="button" onClick={() => setParams({}, { replace: true })}>
          איפוס סינון
        </button>
      </div>

      <div>
        {filteredRooms.length === 0 && <p>לא נמצאו חדרים התואמים לחיפוש.</p>}
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
}
