export enum Events {
    DESCRIPTION_CHANGED = 'descriptionChanged',
    NUMBER_OF_PLAYERS_CHANGED = 'numberOfPlayersChanged',
    TOTAL_PRIZE_CHANGED = 'totalPrizeChanged',
    BATTLE_FORMAT_CHANGED = 'battleFormatChanged',
    TOURNAMENT_ADDED = 'tournamentAdded'
    // use an enum to keep track of events similar to action types set as variables in redux
}
// type EventsState = [T keyof Events: Function] 
export const EventEmitter = {
    _events: {} as any,
    dispatch(event: Events, data: any) {
        if (!this._events[event]) return;
        this._events[event].forEach((callback: (arg0: any) => any) => callback(data))
    },
    subscribe(event: Events, callback: (data: any) => any) {
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(callback);
    },
    unsubscribe(event: Events) {
        if (!this._events[event]) return;
        delete this._events[event];
    }
}