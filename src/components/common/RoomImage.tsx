import type{ Hotspot } from "../../types/hotspot"
import "../../index.css"
export function RoomImage ({imageUrl,hotspots,solvedHotspotIds,onHotspotClick}:
    {imageUrl:string,hotspots:Hotspot[],solvedHotspotIds:string[],onHotspotClick:(hotspot:Hotspot)=>void}){
    return  <div className="room-image-container">
        <img src={imageUrl} className="room-image"/>
        {hotspots.map(pot=>
        <button key={pot.id} onClick={()=>onHotspotClick(pot)} className= {solvedHotspotIds.includes(pot.id)? "hotspot hotspot-solved" :"hotspot"}
            style={{left: pot.xPercent + "%", top: pot.yPercent + "%"}}>
            {pot.label}</button>)}
     </div>

}