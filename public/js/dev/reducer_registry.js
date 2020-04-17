import {ADD_ALERT, REQUEST_END, ADD_APP_STATE, REMOVE_ALERT} from "./event-types.js"

let _emitChange = null;
let reducers = {
    alerts: (state = [], action) => {
        if (action.type === ADD_ALERT) {
            if (action.payload.alerts !== undefined) {
                return state.concat(action.payload.alerts);
            }
        }
        if (action.type === REMOVE_ALERT) {
            if (action.payload.alerts !== undefined) {
                return state.filter((a, i) => {
                    return action.payload.alerts.find((e) => e.id != a.id)
                });
            }
        }

        return state;
    },
    appState: (state = [], action = {}) => {
        if(action.type === ADD_APP_STATE) {
            let newState = action.payload.appState;
            if (newState !== undefined) {
                return {
                    ...state,
                    ...newState
                }
            }
        } else if(action.type === REQUEST_END) {
            if (_.get(action.payload, 'data.appState') !== undefined) {
                let newState = action.payload.data.appState;
                return {
                    ...state,
                    ...newState
                }
            }
        }
        return state;
    }
};
let ReducerRegistry = {};

ReducerRegistry.getReducers = function() {
    return {...reducers};
};

ReducerRegistry.register = function(name, reducer) {
    reducers = { ...reducers, [name]: reducer };
    if (_emitChange) {
        _emitChange(this.getReducers());
    }
};

ReducerRegistry.setChangeListener = function(listener) {
    _emitChange = listener;
};

export {ReducerRegistry}