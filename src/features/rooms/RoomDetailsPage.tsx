import { ErrorMessage, Loading } from "../../components/common/Common";
import {useRoom} from "../../hooks/useRoom.ts";
import {useParams,Link} from "react-router-dom";
import { Badge } from "../../components/common/Common";
import "../../index.css"
import { RoomImage } from "../../components/common/RoomImage.tsx";
import {  hotspots } from "../../data/hotspot.ts"

function RoomDetailsPage() {
  const {id}=useParams();
  const {data:room, isPending, isError}= useRoom(id!);
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorMessage errorMessage="Error loading room details." />;
  }
  if (!room)
    return <>
    <p>The room was not found</p>
    <Link to={"/rooms"}>Return to Catalog</Link>
    </>
  hotspots.filter(pot=>pot.roomId===room?.id)


  return (
    <>
    <h1> {room.title}</h1>
   <RoomImage imageUrl={room.imageUrl}hotspots={hotspots} solvedHotspotIds={[]}/>
    <p>{room.description}</p>
    <Badge text={room.difficulty}/>
    <Badge text = {room.category}/>
    <Link to={"/play/"+room.id}>Start to play</Link>
    </>
  );
}
export default RoomDetailsPage;