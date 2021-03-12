import { MapTool } from "../../../screens/tactics/components/interactive-map/MapTools";
import { MapMarker } from "../../../slices/mapInteractionSlice";
import { Changeable } from "../../decorators/PropertyChanged";
import { MapBaseNumber } from "../enums/MapBaseNumber.enum";
import { TacticType } from "../enums/TacticType.enum";

export interface Tactic extends Changeable<Tactic> {
    id: string;
    metadata: TacticMetadata;
    playerTacticRoles: PlayerTacticRole[];
    activeTool: MapTool,
    positionList: MapMarker[] // will be extended
}

export interface TacticMetadata {
    mapName: string;
    baseNumber: MapBaseNumber;
    tacticType: TacticType;
    tacticReference: string;
}

export interface PlayerTacticRole extends UILayoutListItem {
    playerId: string;
    tankId: string;
}


// TODO - make a module for practices (like for selected element when using a list)
export type UILayoutListItem = {
    index: number
}
