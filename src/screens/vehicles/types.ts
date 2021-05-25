
export enum TankType {
    MEDIUM = "mediumTank",
    HEAVY = "heavyTank",
    SPG = "spg",
    LIGHT = "lightTank",
    TD = "td"
}

export interface ClanEmblemPortal {
    portal: string;
}

export interface ClanEmblemWOWP {
    wowp: string;
}

export interface ClanEmblemWOT {
    wot: string;
}

export type ClanEmblemX32 = ClanEmblemPortal;
export type ClanEmblemX24 = ClanEmblemPortal;
export type ClanEmblemX256 = ClanEmblemWOWP;
export type ClanEmblemX64 = ClanEmblemWOT & ClanEmblemPortal
export type ClanEmblemX195 = ClanEmblemPortal

export interface ClanEmblems {
    x32: ClanEmblemX32,
    x24: ClanEmblemX24,
    x256: ClanEmblemX256,
    x64: ClanEmblemX64,
    x195: ClanEmblemX195
}

export interface User {
    role: string,
    role_i18n: string,
    joined_at: number,
    account_id: string,
    account_name: string
}


export interface ClanDetails {
    leader_id: number,
    color: string,
    updated_at: number,
    private: any,
    tag: string,
    members_count: number,
    description_html: string, // HTML
    accepts_join_requests: boolean,
    leader_name: string,
    emblems: ClanEmblems,
    clan_id: number,
    renamed_at: number,
    old_tag: string,
    description: string,
    members: User[],
    old_name: string,
    is_clan_disbanded: boolean,
    motto: string,
    name: string,
    creator_name: string,
    created_at: number,
    creator_id: number
}

export enum CrewMemberRole {
    COMMANDER = "Commander",

}

export interface CrewMember {
    member_id: string;
    roles: CrewMemberRole[];
}

export enum AmmoType {
    APCR = "ARMOR_PIERCING_CR"
}

export interface Ammo {
    damage: number[],
    penetration: number[],
    stun: any,
    type: AmmoType
}

export interface Armor {
    front: number,
    rear: number,
    sides: number
}

export type TankArmor = {
    hull: Armor,
    turret: Armor
}

export interface TankEngine {
    fire_chance: number,
    name: string,
    power: number,
    tag: string,
    tier: number,
    weight: number
}

export interface TankGun {
    aim_time: number,
    caliber: number,
    dispersion: number,
    fire_rate: number,
    move_down_arc: number,
    move_up_arc: number,
    name: string,
    reload_time: number,
    tag: string,
    tier: number,
    traverse_speed: number,
    weight: number
}

export interface Modules {
    engine_id: number
    gun_id: number
    radio_id: number
    suspension_id: number
    turret_id: number
}

export interface TankRadio {
    tier: number,
    signal_range: number,
    tag: string,
    name: string,
    weight: number
}

export interface TankSuspension {
    load_limit: number,
    name: string,
    steering_lock_angle: number,
    tag: string,
    tier: number,
    traverse_speed: number,
    weight: number
}

export interface TankTurret {
    hp: number,
    name: string,
    tag: string,
    tier: number,
    traverse_left_arc: number,
    traverse_right_arc: number,
    traverse_speed: number,
    view_range: number,
    weight: number
}

export type ModuleTree = {
    is_default: boolean,
    module_id: number,
    name: string,
    next_modules: number[],
    next_tanks: number[],
    price_credit: number,
    price_xp: number,
    type: string // "vehicleRadio" todo -> to type
}

export type VehicleResponse = Record<number, Vehicle>


export interface Vehicle {
    crew: CrewMember[],
    default_profile: {
        ammo: Ammo[],
        armor: TankArmor,
        engine: TankEngine,
        gun: TankGun,
        hp: number,
        hull_hp: number,
        hull_weight: number,
        max_ammo: number,
        max_weight: number,
        modules: Modules,
        radio: TankRadio,
        rapid: any,
        siege: any,
        speed_backward: 20,
        speed_forward: 60,
        suspension: TankSuspension,
        turret: TankTurret,
        weight: number
    }
    description: string,
    engines: number[],
    guns: number[],
    images: {
        small_icon: string,
        contour_icon: string,
        big_icon: string
    },
    is_gift: false,
    is_premium: false,
    is_premium_igr: false,
    is_wheeled: false,
    modules_tree: ModuleTree,
    multination: any,
    name: string,
    nation: string,
    next_tanks: any,
    price_credit: number,
    price_gold: number,
    prices_xp: { 2161: 208000 }
    provisions: number[],
    radios: number[],
    short_name: string,
    suspensions: number[],
    tag: string,
    tank_id: number,
    tier: number,
    turrets: number[],
    type: TankType
}


export class StunStatistics {
    stun_assisted_damage!: number;
    // Damage to enemy vehicles stunned by you

    stun_number!: number;
    // Number of times an enemy was stunned by you
}
export interface IStunStatistics extends StunStatistics { }
// Props type as an array, to be exported
export type StunStatisticsPropsArray = Array<keyof IStunStatistics>;

export class MaximumValuesStatistics {
    max_damage!: number;
    // Maximum damage caused in a battle

    max_frags!: number;
    // Maximum destroyed in battle

    max_xp!: number;
    // Maximum experience per battle
}
export interface IMaximumValuesStatistics extends MaximumValuesStatistics { }

export class HitsStatistics {
    direct_hits_received!: number;
    // Direct hits received

    explosion_hits!: number;
    // Hits on enemy as a result of splash damage

    explosion_hits_received!: number;
    // Hits received as a result of splash damage

    no_damage_direct_hits_received!: number;
    // Direct hits received that caused no damage

    piercings!: number;
    // Penetrations

    piercings_received!: number;
    // Penetrations received

    tanking_factor!: number;
    // Ratio of damage blocked by armor from AP, HEAT, and APCR shells to damage received from these types of shells.Value is calculated starting from version 9.0.
}
export interface IHitsStatistics extends HitsStatistics { }

export class BasicTankStatistics {
    battle_avg_xp!: number;
    // Average experience per battle

    // Average experience per battle
    // Average experience per battle
    // Average experience per battle
    battles!: number;
    // Battles fought

    // Battles fought
    // Battles fought
    // Battles fought
    survived_battles!: number;
    // Battles survived

    // Battles survived
    // Battles survived
    // Battles survived
    wins!: number;
    // Victories

    // Victories
    // Victories
    // Victories
    xp!: number;
    // Total experience

    // Total experience
    // Total experience
    // Total experience
    shots!: number;
    // Shots fired

    // Shots fired
    // Shots fired
    // Shots fired
    spotted!: number;
    // Enemies spotted

    // Enemies spotted
    // Enemies spotted
    // Enemies spotted
    damage_dealt!: number;
    // Damage caused

    // Damage caused
    // Damage caused
    // Damage caused
    damage_received!: number;
    // Damage received

    // Damage received
    // Damage received
    // Damage received
    battles_on_stunning_vehicles!: number;
    // Number of battles on vehicles that cause the stun effect

    // Number of battles on vehicles that cause the stun effect
    // Number of battles on vehicles that cause the stun effect
    // Number of battles on vehicles that cause the stun effect
    capture_points!: number;
    // Base capture points

    // Base capture points
    // Base capture points
    // Base capture points
    draws!: number;
    // Draws

    // Draws
    // Draws
    // Draws
    frags!: number;
    // Vehicles destroyed

    // Vehicles destroyed
    // Vehicles destroyed
    // Vehicles destroyed
    hits!: number;
    // hits

    // hits
    // hits
    // hits
    hits_percents!: number;
    // Hit ratio

    // Hit ratio
    // Hit ratio
    // Hit ratio
    losses!: number;
    // Defeats

    // Defeats
    // Defeats
    // Defeats
    dropped_capture_points!: number;
    // Base defense points
}
export interface IBasicTankStatistics extends BasicTankStatistics { }

export class TankCompanyBattlesTankStatistics implements IBasicTankStatistics, IStunStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}
export type TankCompanyBattlesTankStatisticsKey = keyof TankCompanyBattlesTankStatistics

export class ClanBattlesTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}

export class EpicBattlesTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}

export class RandomBattlesTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}

export interface IRankedBattlesTankStatistics extends IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics { }
export class RankedBattlesTankStatistics implements IRankedBattlesTankStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}

export class RegularTeamTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}

export class StrongholdBattlesTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics, IHitsStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
    direct_hits_received!: number;
    explosion_hits!: number;
    explosion_hits_received!: number;
    no_damage_direct_hits_received!: number;
    piercings!: number;
    piercings_received!: number;
    tanking_factor!: number;
}
export type StrongholdBattlesTankStatisticsKey = keyof StrongholdBattlesTankStatistics

export class SkirmishBattlesTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics, IHitsStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
    direct_hits_received!: number;
    explosion_hits!: number;
    explosion_hits_received!: number;
    no_damage_direct_hits_received!: number;
    piercings!: number;
    piercings_received!: number;
    tanking_factor!: number;
}

export class TeamBattlesTankStatistics implements IBasicTankStatistics, IMaximumValuesStatistics, IStunStatistics {
    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    max_damage!: number;
    max_frags!: number;
    max_xp!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
}

export class OverallTankStatistics implements IBasicTankStatistics, IStunStatistics, IHitsStatistics {
    avg_damage_blocked!: number;
    // Average damage blocked by armor per battle.Damage blocked by armor is damage received from shells(AP, HEAT and APCR) that hit a vehicle but caused no damage.Value is calculated starting from version 9.0.

    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
    direct_hits_received!: number;
    explosion_hits!: number;
    explosion_hits_received!: number;
    no_damage_direct_hits_received!: number;
    piercings!: number;
    piercings_received!: number;
    tanking_factor!: number;
}

export class FalloutBattlesTankStatistics implements IBasicTankStatistics, IStunStatistics, IHitsStatistics {
    avatar_damage_dealt!: number;
    // Damage caused by Combat Reserves

    // Damage caused by Combat Reserves
    avatar_frags!: number;
    // Destroyed by Combat Reserves

    // Destroyed by Combat Reserves
    avg_damage_assisted!: number;
    // Average damage caused with your assistance

    // Average damage caused with your assistance
    avg_damage_assisted_radio!: number;
    // Average damage upon your spotting

    // Average damage upon your spotting
    avg_damage_assisted_track!: number;
    // Average damage upon your shooting the track

    // Average damage upon your shooting the track
    avg_damage_blocked!: number;
    // Average damage blocked by armor per battle.Damage blocked by armor is damage received from shells(AP, HEAT and APCR) that hit a vehicle but caused no damage.Value is calculated starting from version 9.0.

    // Average damage blocked by armor per battle.Damage blocked by armor is damage received from shells(AP, HEAT and APCR) that hit a vehicle but caused no damage.Value is calculated starting from version 9.0.
    death_count!: number;
    // Deaths

    // Deaths
    flag_capture!: number;
    // Flags captured in platoon

    // Flags captured in platoon
    flag_capture_solo!: number;
    // Flags captured as solo player

    // Flags captured as solo player
    max_damage_with_avatar!: number;
    // Maximum damage caused in one battle including damage from avatar

    // Maximum damage caused in one battle including damage from avatar
    max_frags_with_avatar!: number;
    // Maximum destroyed in one battle including vehicles destroyed by avatar

    // Maximum destroyed in one battle including vehicles destroyed by avatar
    max_win_points!: number;
    // Maximum Victory Points earned in 

    // Maximum Victory Points earned in 
    resource_absorbed!: number;
    // Resources captured at resource points

    // Resources captured at resource points
    win_points!: number;
    // Victory Points

    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
    direct_hits_received!: number;
    explosion_hits!: number;
    explosion_hits_received!: number;
    no_damage_direct_hits_received!: number;
    piercings!: number;
    piercings_received!: number;
    tanking_factor!: number;
}

export class GlobalMapTankStatistics implements IBasicTankStatistics, IStunStatistics, IHitsStatistics {
    avg_damage_assisted!: number;
    // Average damage caused with your assistance

    avg_damage_assisted_radio!: number;
    // Average damage upon your spotting

    avg_damage_assisted_track!: number;
    // Average damage upon your shooting the track

    avg_damage_blocked!: number;
    // Average damage blocked by armor per battle.Damage blocked by armor is damage received from shells(AP, HEAT and APCR) that hit a vehicle but caused no damage.Value is calculated starting from version 9.0.

    battle_avg_xp!: number;
    battles!: number;
    survived_battles!: number;
    wins!: number;
    xp!: number;
    shots!: number;
    spotted!: number;
    damage_dealt!: number;
    damage_received!: number;
    battles_on_stunning_vehicles!: number;
    capture_points!: number;
    draws!: number;
    frags!: number;
    hits!: number;
    hits_percents!: number;
    losses!: number;
    dropped_capture_points!: number;
    stun_assisted_damage!: number;
    stun_number!: number;
    direct_hits_received!: number;
    explosion_hits!: number;
    explosion_hits_received!: number;
    no_damage_direct_hits_received!: number;
    piercings!: number;
    piercings_received!: number;
    tanking_factor!: number;
}

export type Statistic = GlobalMapTankStatistics |
    FalloutBattlesTankStatistics |
    OverallTankStatistics |
    TeamBattlesTankStatistics |
    SkirmishBattlesTankStatistics |
    StrongholdBattlesTankStatistics |
    RegularTeamTankStatistics |
    RankedBattlesTankStatistics |
    RandomBattlesTankStatistics |
    EpicBattlesTankStatistics |
    ClanBattlesTankStatistics |
    TankCompanyBattlesTankStatistics

export type StatisticKey = keyof Statistic

export class TankStatistics {
    account_id!: number;
    // Player account ID

    // Player account ID
    mark_of_mastery!: number;
    // Mastery Badges:
    // 0 — None
    // 1 — 3rd Class
    // 2 — 2nd Class
    // 3 — 1st Class
    // 4 — Ace Tanker

    // Mastery Badges:
    // 0 — None
    // 1 — 3rd Class
    // 2 — 2nd Class
    // 3 — 1st Class
    // 4 — Ace Tanker
    max_frags!: number;
    // Maximum destroyed in battle

    // Maximum destroyed in battle
    max_xp!: number;
    // Maximum experience per battle

    // Maximum experience per battle
    tank_id!: number;
    // Vehicle ID

    frags: any // associative array ??? Record ??
    // Details on vehicles destroyed.This data requires a valid access_token for the specified account.

    // Details on vehicles destroyed.This data requires a valid access_token for the specified account.
    in_garage!: boolean;
    // Availability of vehicle in the Garage.This data requires a valid access_token for the specified account.

    // Availability of vehicle in the Garage.This data requires a valid access_token for the specified account.
    all!: OverallTankStatistics;
    // Overall Statistics

    // Overall Statistics
    clan!: ClanBattlesTankStatistics;
    // Clan battles statistics

    // Clan battles statistics
    company!: TankCompanyBattlesTankStatistics;
    // Tank Company battles statistics

    // Tank Company battles statistics
    epic!: EpicBattlesTankStatistics;
    // Statistics in Grand Battles.
    // An extra field.

    // Statistics in Grand Battles.
    // An extra field.
    fallout!: FalloutBattlesTankStatistics;
    // Fallout statistics.
    // An extra field.

    // Fallout statistics.
    // An extra field.
    globalmap!: GlobalMapTankStatistics;
    // All battle statistics on the Global Map

    // All battle statistics on the Global Map
    random!: RandomBattlesTankStatistics;
    // Random battles statistics.
    // An extra field.

    ranked: any
    // removed ???
    // Statistics in Ranked Battles.
    // An extra field.

    // removed ???
    // Statistics in Ranked Battles.
    // An extra field.
    ranked_battles!: RankedBattlesTankStatistics;
    // Statistics: in Ranked Battles.
    //  An extra field.

    // Statistics: in Ranked Battles.
    //  An extra field.
    regular_team!: RegularTeamTankStatistics;
    // Battle statistics of permanent teams

    // Battle statistics of permanent teams
    stronghold_defense!: StrongholdBattlesTankStatistics;
    // General stats for player's battles in Stronghold defense

    // General stats for player's battles in Stronghold defense
    stronghold_skirmish!: SkirmishBattlesTankStatistics;
    // General stats for player's battles in Skirmishes

    // General stats for player's battles in Skirmishes
    team!: TeamBattlesTankStatistics;
    // Team battles statistics
}