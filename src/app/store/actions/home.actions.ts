import { createAction, props } from '@ngrx/store'
import { session } from '../reducers/home.reducer'

export const home = {
    updateSessionState: createAction('[Home] Update Session', props<{ session: session }>()),
}