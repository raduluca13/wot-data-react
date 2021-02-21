
export enum TankType {
    MEDIUM = "mediumTank",
    HEAVY = "",
    SPG = "",
    LIGHT = "",
    TD = ""
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

export interface User { // TODO - rename to User
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