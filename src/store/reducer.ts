
import { ADD_TECH_ITEM, PayloadAction } from './type';

const initialState = {
    techs: ["HTML/CSS", "React", "VueJs", "NodeJs", "Typescript", "Java", "Python", "PHP", "Go", "C#"]
};

const findNodeJsIndex = (techs: string[]) => techs.findIndex((tech) => tech === 'NodeJs');

const reducer = (state = initialState, action: PayloadAction) => {
    switch (action.type) {
        case ADD_TECH_ITEM: return {
            ...state,
            techs: state.techs.includes(action.payload) ? 
                state.techs : 
                [...(state.techs.splice(findNodeJsIndex(state.techs) + 1, 0, action.payload), state.techs)]
        }
    
        default: return state;
    }
}

export default reducer;
