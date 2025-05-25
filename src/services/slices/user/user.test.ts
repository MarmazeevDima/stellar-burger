import {
  slice,
  initialState,
  login,
  logout,
  register,
  updateUser,
  checkUserAuth,
  fetchUser
} from './index';

describe('Тестирование authSlice', () => {
  const testUser = {
    name: 'Тестовый Пользователь',
    email: 'test@example.com'
  };

  const updatedUser = {
    name: 'Обновленное Имя',
    email: 'updated@example.com'
  };

  describe('Авторизация пользователя', () => {
    const testCases = [
      {
        name: 'начало авторизации',
        action: { type: login.pending.type },
        check: (state: typeof initialState) => {
          expect(state.loginError).toBeUndefined();
        }
      },
      {
        name: 'ошибка авторизации',
        action: {
          type: login.rejected.type,
          error: undefined,
          meta: { rejectedWithValue: true }
        },
        check: (state: typeof initialState) => {
          expect(state.loginError).toEqual(undefined);
        }
      },
      {
        name: 'успешная авторизация',
        action: {
          type: login.fulfilled.type,
          payload: testUser
        },
        check: (state: typeof initialState) => {
          expect(state.isAuthenticated).toBe(true);
          expect(state.data).toEqual(testUser);
        }
      }
    ];

    testCases.forEach(({ name, action, check }) => {
      test(name, () => {
        const result = slice.reducer(initialState, action);
        check(result);
      });
    });
  });

  describe('Регистрация пользователя', () => {
    const testCases = [
      {
        name: 'начало регистрации',
        action: { type: register.pending.type },
        check: (state: typeof initialState) => {
          expect(state.registerError).toBeUndefined();
        }
      },
      {
        name: 'ошибка регистрации (email занят)',
        action: {
          type: register.rejected.type,
          payload: { message: 'Email уже используется' },
          error: { message: 'Email уже используется' },
          meta: { rejectedWithValue: true }
        },
        check: (state: typeof initialState) => {
          expect(state.registerError).toEqual({
            message: 'Email уже используется'
          });
        }
      },
      {
        name: 'успешная регистрация',
        action: {
          type: register.fulfilled.type,
          payload: testUser
        },
        check: (state: typeof initialState) => {
          expect(state.isAuthenticated).toBe(true);
          expect(state.data).toEqual(testUser);
        }
      }
    ];

    testCases.forEach(({ name, action, check }) => {
      test(name, () => {
        const result = slice.reducer(initialState, action);
        check(result);
      });
    });
  });

  describe('Проверка аутентификации', () => {
    test('успешная проверка', () => {
      const action = { type: checkUserAuth.fulfilled.type };
      const state = slice.reducer(initialState, action);
      expect(state.isAuthChecked).toBe(true);
    });

    test('пользователь не аутентифицирован', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = slice.reducer(initialState, action);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Обновление данных пользователя', () => {
    const stateWithUser = {
      ...initialState,
      isAuthenticated: true,
      data: testUser
    };

    test('успешное обновление', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = slice.reducer(stateWithUser, action);
      expect(state.data).toEqual(updatedUser);
    });
  });

  describe('Выход из системы', () => {
    const stateLoggedIn = {
      ...initialState,
      isAuthenticated: true,
      data: testUser
    };

    test('успешный выход', () => {
      const action = { type: logout.fulfilled.type };
      const state = slice.reducer(stateLoggedIn, action);
      expect(state.isAuthenticated).toBe(false);
      expect(state.data).toEqual({ name: '', email: '' });
    });
  });

  describe('Получение данных пользователя', () => {
    const testCases = [
      {
        name: 'начало загрузки',
        action: { type: fetchUser.pending.type },
        check: (state: typeof initialState) => {
          expect(state.isAuthenticated).toBe(false);
        }
      },
      {
        name: 'ошибка загрузки',
        action: { type: fetchUser.rejected.type },
        check: (state: typeof initialState) => {
          expect(state.isAuthChecked).toBe(true);
          expect(state.isAuthenticated).toBe(false);
        }
      },
      {
        name: 'успешная загрузка',
        action: {
          type: fetchUser.fulfilled.type,
          payload: testUser
        },
        check: (state: typeof initialState) => {
          expect(state.isAuthenticated).toBe(true);
          expect(state.data).toEqual(testUser);
        }
      }
    ];

    testCases.forEach(({ name, action, check }) => {
      test(name, () => {
        const result = slice.reducer(initialState, action);
        check(result);
      });
    });
  });
});
