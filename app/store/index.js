import thunk from 'redux-thunk';
import {createStore,combineReducers,compose,applyMiddleware} from 'redux';
import reducers from '../reducers/';

export default createStore(reducers,compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
));