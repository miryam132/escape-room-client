import { useSearchParams } from "react-router-dom";
import { ErrorMessage, Loading, TextInput } from "../../components/common/Common";
import { RoomCard } from "../../components/common/RoomCard";
import { CATEGORIES, DIFFICULTIES } from "../../constants";
import { useRooms } from "../../hooks/rooms";

const FILTERS = [
  { key: "difficulty", label: "Filter by difficulty", options: DIFFICULTIES },
  { key: "category", label: "Filter by category", options: CATEGORIES },
] as const;

export default function RoomsPage() {
  const { data: rooms, isPending, isError } = useRooms();
  const [params, setParams] = useSearchParams();

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage="Error loading rooms." />;

  const setParam = (key: string, value: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });

  const search = params.get("q") ?? "";
  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(search.toLowerCase()) &&
      (!params.get("difficulty") || room.difficulty === params.get("difficulty")) &&
      (!params.get("category") || room.category === params.get("category")),
  );

  return (
    <>
      <h1>Rooms Page</h1>
      <p>Welcome to the rooms page!</p>

      <div>
        <TextInput
          id="room-search"
          label="Search room"
          value={search}
          onChange={(value) => setParam("q", value)}
          placeholder="Enter room name..."
        />

        {FILTERS.map(({ key, label, options }) => (
          <div key={key}>
            <label htmlFor={`${key}-filter`}>{label}</label>
            <select
              id={`${key}-filter`}
              value={params.get(key) ?? ""}
              onChange={(e) => setParam(key, e.target.value)}
            >
              <option value="">All</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="button" onClick={() => setParams({}, { replace: true })}>
          Reset filters
        </button>
      </div>

      <div>
        {filteredRooms.length === 0 && <p>No rooms match your search.</p>}
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
}
