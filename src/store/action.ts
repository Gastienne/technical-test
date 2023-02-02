import { ADD_TECH_ITEM } from './type';

export const addTechItem = (techItem: string) => {
    return {
        type: ADD_TECH_ITEM,
        payload: techItem
    }
}
