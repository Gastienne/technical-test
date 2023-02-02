export const ADD_TECH_ITEM = 'ADD_TECH_ITEM';

export interface PayloadAction {
    type: string,
    payload?: any
}

export interface TechState {
    techs: string[]
}
