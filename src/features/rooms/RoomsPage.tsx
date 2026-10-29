
import {useRooms} from "../../hooks/useRooms.ts";
import { Loading,ErrorMessage,  } from "../../components/common/Common.tsx";
import { RoomCard } from "../../components/common/RoomCard.tsx";
import {useState} from "react";
import {TextInput} from "../../components/common/Common.tsx";
function RoomsPage() {
  const {data:rooms, isPending, isError} = useRooms();
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =useState("all");
   if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorMessage errorMessage="Error loading rooms." />;
  }

  const filteredRooms=rooms.filter(room =>
    room.title.toLowerCase().includes(searchText.toLowerCase())&&
  (selectedDifficulty==="all" || room.difficulty===selectedDifficulty)&&
  (selectedCategory==="all" || room.category===selectedCategory));

 
  return (
    <>
      <h1>Rooms Page</h1>
      <p>Welcome to the rooms page!</p>
      <div>
  <TextInput id="room-search" label="Search room"  value={searchText}
      onChange={setSearchText} placeholder="Enter room name..."/>

    <label htmlFor="difficulty-filter">Filter by difficulty</label>

      <select id="difficulty-filter" value={selectedDifficulty}
        onChange={(e)=>setSelectedDifficulty(e.target.value)}>
        <option value="all">All</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select> 

      <label htmlFor="category-filter">Filter by category</label>

      <select id="category-filter" value={selectedCategory}
        onChange={(e)=>setSelectedCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Mystery">Mystery</option>
        <option value="Adventure">Adventure</option>
      </select>
      <button type="button" onClick={() => {
      setSearchText(""); 
      setSelectedDifficulty("all"); 
      setSelectedCategory("all");}}>
      Reset filters </button>
      </div>
      <div>
      {filteredRooms.length === 0  && (<p> No rooms match your search.</p>)}

        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}

      </div>
    </>
  );
}
export default RoomsPage;


