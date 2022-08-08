

import { createReducer, on } from "@ngrx/store";
import { home } from "../actions/home.actions";

export enum session { Start, Continue, Completed, Locked }

const initialState = {
    sessionState: session.Start,
}


const _homeReducer = createReducer(initialState,
    on(home.updateSessionState, (state, data: { session: session } ): any => {
        return {
            sessionState: data.session,
        }
    }),
)


export function homeReducer(state:any, action:any) {
    return _homeReducer(state, action);
}