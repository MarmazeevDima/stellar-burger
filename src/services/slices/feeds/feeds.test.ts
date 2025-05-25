import { slice, fetchFeeds, initialState } from './index';

describe('Тестирование слайса ленты заказов', () => {
  const mockFeeds = {
    orders: [
      {
        _id: 'feed_001',
        ingredients: ['ingredient_1', 'ingredient_2'],
        status: 'created',
        name: 'Тестовый заказ 1',
        number: 1001,
        createdAt: '2023-06-01T12:00:00Z',
        updatedAt: '2023-06-01T12:00:00Z'
      },
      {
        _id: 'feed_002',
        ingredients: ['ingredient_3', 'ingredient_4'],
        status: 'pending',
        name: 'Тестовый заказ 2',
        number: 1002,
        createdAt: '2023-06-01T13:00:00Z',
        updatedAt: '2023-06-01T13:00:00Z'
      }
    ],
    total: 100,
    totalToday: 10
  };

  describe('Загрузка ленты заказов', () => {
    const testCases = [
      {
        name: 'состояние загрузки',
        action: {
          type: fetchFeeds.pending.type
        },
        assertions: (state: typeof initialState) => {
          expect(state.isLoading).toBe(true);
          expect(state.error).toBeNull();
        }
      },
      {
        name: 'ошибка загрузки',
        action: {
          type: fetchFeeds.rejected.type,
          error: { message: 'Ошибка сети' }
        },
        assertions: (state: typeof initialState) => {
          expect(state.isLoading).toBe(false);
          expect(state.error).toEqual({ message: 'Ошибка сети' });
        }
      },
      {
        name: 'успешная загрузка',
        action: {
          type: fetchFeeds.fulfilled.type,
          payload: mockFeeds
        },
        assertions: (state: typeof initialState) => {
          expect(state.isLoading).toBe(false);
          expect(state.data).toEqual(mockFeeds);
          expect(state.error).toBeNull();
        }
      }
    ];

    testCases.forEach(({ name, action, assertions }) => {
      test(name, () => {
        const result = slice.reducer(initialState, action);
        assertions(result);
      });
    });
  });

  describe('Дополнительные сценарии', () => {
    test('сохранение данных при повторной загрузке', () => {
      const stateWithData = {
        ...initialState,
        data: mockFeeds,
        isLoading: false
      };

      const pendingAction = { type: fetchFeeds.pending.type };
      const newState = slice.reducer(stateWithData, pendingAction);

      expect(newState.data).toEqual(mockFeeds);
      expect(newState.isLoading).toBe(true);
    });
  });
});
