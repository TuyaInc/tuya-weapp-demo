import { createStore, applyMiddleware } from '../../libs/redux';
import thunkMiddlewares from '../../libs/redux-thunk.min';
import { createLogger } from '../../libs/redux-logger';
import rootReducer from './reducer/index';

const middlewares = [thunkMiddlewares, createLogger()];

let dispatch;

export function configStore() {
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  dispatch = store.dispatch;
  return store;
}

export function getDispatch() {
  return dispatch;
}

export default {
  configStore,
  getDispatch() {
    return dispatch;
  }
};