import { Point } from "../../../screens/tactics/components/interactive-map/InteractiveMap";
import { Changeable } from "../../decorators/PropertyChanged";
import { MapBaseNumber } from "../enums/MapBaseNumber.enum";
import { TacticType } from "../enums/TacticType.enum";

export interface Tactic extends Changeable<Tactic> {
    id: string;
    metadata: TacticMetadata;
    playerTacticRoles: PlayerTacticRole[];
    positionList: Point[] // will be extended
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
