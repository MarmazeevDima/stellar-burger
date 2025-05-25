import store, { rootReducer } from './index';

test('проверка rootReducer c несуществующим экшеном', () => {
  const expected = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(expected).toEqual(store.getState());
});
