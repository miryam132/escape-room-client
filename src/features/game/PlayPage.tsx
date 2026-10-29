import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ErrorMessage,
  Loading,
} from "../../components/common/Common";
import { RoomImage } from "../../components/common/RoomImage";
import { HotspotPanel } from "../../components/game/HotspotPanel";
import { useRoom } from "../../hooks/useRoom";
import { hotspots } from "../../data/hotspot";
import type { Hotspot } from "../../types/hotspot";

function PlayPage() {
  const [selectedHotspot,setSelectedHotspot]=useState<Hotspot | null>(null);
  const [userAnswer,setUserAnswer]=useState("")
   const [answerFeedback, setAnswerFeedback] = useState("");
   const [solvedHotspotIds, setSolvedHotspotIds] = useState<string[]>([]);
   const [isHintVisible, setIsHintVisible] = useState(false);
   const [isGameCompleted, setIsGameCompleted] = useState(false);
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
const roomHotspots = hotspots.filter(
  (hotspot) => hotspot.roomId === room.id
); 

const checkAnswer = () => {
  if (!selectedHotspot || selectedHotspot.type !== "puzzle") {
    return;
  }

  const normalizedInput = userAnswer.trim().toLowerCase();
  const normalizedAnswer = selectedHotspot.answer.trim().toLowerCase();

  if (normalizedInput === normalizedAnswer) {
    setAnswerFeedback("תשובה נכונה!");

    setSolvedHotspotIds((previousIds) =>
      previousIds.includes(selectedHotspot.id)
        ? previousIds
        : [...previousIds, selectedHotspot.id]
    );
    if (selectedHotspot.isFinal) {
  setIsGameCompleted(true);
  setSelectedHotspot(null);
}
  } else {
    setAnswerFeedback("התשובה אינה נכונה, נסה שוב.");
  }
};
const handleHotspotClick = (hotspot: Hotspot) => {
  if (isGameCompleted) {
  return;
}
  if (
    hotspot.requiresHotspotId &&
    !solvedHotspotIds.includes(hotspot.requiresHotspotId)
  ) {
    alert("צריך לפתור קודם את החידה הקודמת");
    return;
  }

  setUserAnswer("");
  setAnswerFeedback("");
  setIsHintVisible(false);
  setSelectedHotspot(hotspot);
};
  return (
    <div>
       <h1> {room.title}</h1>
      {isGameCompleted && (
    <div role="status">
    <h2>כל הכבוד!</h2>
    <p>השלמת את החדר בהצלחה.</p>
    </div>

  
)}
      <RoomImage 
      imageUrl={room.imageUrl}hotspots={roomHotspots}
       solvedHotspotIds={solvedHotspotIds} onHotspotClick={handleHotspotClick}/>
       {selectedHotspot && (
  <HotspotPanel
    hotspot={selectedHotspot}
    userAnswer={userAnswer}
    answerFeedback={answerFeedback}
    isHintVisible={isHintVisible}
    onAnswerChange={setUserAnswer}
    onCheckAnswer={checkAnswer}
    onShowHint={() => setIsHintVisible(true)}
    onClose={() => setSelectedHotspot(null)}
  />
)}
    </div>
  );
}
export default PlayPage;