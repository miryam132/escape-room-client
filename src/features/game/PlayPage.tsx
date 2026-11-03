import { Link, useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { RoomImage } from "../../components/common/RoomImage";
import { HotspotPanel } from "../../components/game/HotspotPanel";
import { useRoom, useRoomHotspots } from "../../hooks/rooms";
import { useGame } from "../../hooks/useGame";

export default function PlayPage() {
  const { id } = useParams();
  const { data: room, isPending, isError } = useRoom(id);
  const { data: hotspots = [], isError: isHotspotsError } = useRoomHotspots(id);
  const game = useGame(hotspots);

  if (isPending) return <Loading />;
  if (isError || isHotspotsError) return <ErrorMessage errorMessage="Error loading room details." />;
  if (!room) {
    return (
      <>
        <p>The room was not found</p>
        <Link to="/rooms">Return to Catalog</Link>
      </>
    );
  }

  return (
    <div>
      <h1>{room.title}</h1>

      {game.isCompleted && (
        <div role="status">
          <h2>כל הכבוד!</h2>
          <p>השלמת את החדר בהצלחה.</p>
        </div>
      )}

      <RoomImage
        imageUrl={room.imageUrl}
        alt={room.title}
        hotspots={hotspots}
        solvedHotspotIds={game.solvedIds}
        onHotspotClick={game.select}
      />

      {game.selected ? (
        <HotspotPanel
          hotspot={game.selected}
          userAnswer={game.answer}
          answerFeedback={game.feedback}
          isHintVisible={game.isHintVisible}
          onAnswerChange={game.setAnswer}
          onCheckAnswer={game.check}
          onShowHint={game.showHint}
          onClose={game.close}
        />
      ) : (
        <p role="status">{game.feedback}</p>
      )}
    </div>
  );
}
