import { produce } from "immer";
import { shallowRef } from "vue";

export function useHistory(baseState){
    const state = shallowRef(baseState);
    const update = (updater)=>{
        const nextState = produce(state.value,updater);
        state.value = nextState;
    }
    const reset = ()=>{
        state.value = baseState;
    }
    return {
        state,
        update,
        reset
    }
}