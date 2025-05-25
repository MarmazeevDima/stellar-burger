import { slice, fetchIngredients, initialState } from './index';
import { TIngredient } from '@utils-types';

describe('Тестирование слайса ингредиентов', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '60d3b41abdacab0026a733c6',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '60d3b41abdacab0026a733cc',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  ];

  const testCases = [
    {
      name: 'состояние загрузки',
      action: {
        type: fetchIngredients.pending.type
      },
      assertions: (state: typeof initialState) => {
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      }
    },
    {
      name: 'ошибка загрузки',
      action: {
        type: fetchIngredients.rejected.type,
        error: { message: 'Сервер не доступен' }
      },
      assertions: (state: typeof initialState) => {
        expect(state.isLoading).toBe(false);
        expect(state.error).toEqual({ message: 'Сервер не доступен' });
      }
    },
    {
      name: 'успешная загрузка',
      action: {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      },
      assertions: (state: typeof initialState) => {
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.data).toEqual(mockIngredients);
      }
    }
  ];

  testCases.forEach(({ name, action, assertions }) => {
    test(name, () => {
      const newState = slice.reducer(initialState, action);
      assertions(newState);
    });
  });

  describe('Дополнительные сценарии', () => {
    test('сохранение предыдущих данных при ошибке', () => {
      const stateWithData = {
        ...initialState,
        data: mockIngredients,
        isLoading: false
      };

      const errorAction = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Временная ошибка' }
      };

      const newState = slice.reducer(stateWithData, errorAction);

      expect(newState.data).toEqual(mockIngredients);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toEqual({ message: 'Временная ошибка' });
    });
  });
});
