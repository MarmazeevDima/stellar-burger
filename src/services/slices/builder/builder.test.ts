import {
  slice,
  addIngredient,
  initialState,
  moveIngredient,
  setBun,
  removeIngredient,
  resetConstructor
} from './index';
import { TIngredient } from '@utils-types';

describe('тестирование конструктора бургера', () => {
  const mockBun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
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
  };

  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
  };

  describe('тестирование изменения булки', () => {
    test('установка булки', () => {
      const newState = slice.reducer(initialState, setBun(mockBun));
      expect(newState.bun).toEqual(mockBun);
    });

    test('сброс булки', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newState = slice.reducer(stateWithBun, setBun(null));
      expect(newState.bun).toBeNull();
    });
  });

  describe('тестирование добавления игредиента', () => {
    test('добавление ингредиента в массив ingredients', () => {
      const newState = slice.reducer(
        initialState,
        addIngredient(mockIngredient)
      );
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String)
      });
    });

    test('добавление булки через addIngredient', () => {
      const newState = slice.reducer(initialState, addIngredient(mockBun));
      expect(newState.bun).toMatchObject({
        ...mockBun,
        id: expect.any(String)
      });
      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('тестирование удаления игредиента', () => {
    const mockConstructorIngredient = {
      ...mockIngredient,
      id: 'test-id'
    };

    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockConstructorIngredient]
    };

    test('удаление ингредиента из конструктора', () => {
      const newState = slice.reducer(
        stateWithIngredients,
        removeIngredient('test-id')
      );
      expect(newState.ingredients).toHaveLength(0);
    });

    test('удаление несуществующего ингредиента', () => {
      const newState = slice.reducer(
        stateWithIngredients,
        removeIngredient('wrong-id')
      );
      expect(newState.ingredients).toHaveLength(1);
    });
  });

  describe('тестирование перемещения игредиента', () => {
    const mockIngredients = [
      {
        ...mockIngredient,
        id: '1',
        _id: '643d69a5c3f7b9001cfa0943'
      },
      {
        _id: '643d69a5c3f7b9001cfa0946',
        name: 'Хрустящие минеральные кольца',
        type: 'main',
        proteins: 808,
        fat: 689,
        carbohydrates: 609,
        calories: 986,
        price: 300,
        image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
        image_large:
          'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
        id: '2'
      }
    ];

    const stateWithMultipleIngredients = {
      ...initialState,
      ingredients: [...mockIngredients]
    };

    test('перемещение ингредиента вверх', () => {
      const newState = slice.reducer(
        stateWithMultipleIngredients,
        moveIngredient({ index: 1, upwards: true })
      );
      expect(newState.ingredients[0].id).toBe('2');
      expect(newState.ingredients[1].id).toBe('1');
    });

    test('перемещение ингредиента вниз', () => {
      const newState = slice.reducer(
        stateWithMultipleIngredients,
        moveIngredient({ index: 0, upwards: false })
      );
      expect(newState.ingredients[0].id).toBe('2');
      expect(newState.ingredients[1].id).toBe('1');
    });

    test('попытка переместить первый ингредиент вверх', () => {
      const originalIngredients = [...stateWithMultipleIngredients.ingredients];
      const newState = slice.reducer(
        stateWithMultipleIngredients,
        moveIngredient({ index: 0, upwards: true })
      );
      expect(newState.ingredients).toEqual(originalIngredients);
    });

    test('попытка переместить последний ингредиент вниз', () => {
      const originalIngredients = [...stateWithMultipleIngredients.ingredients];
      const newState = slice.reducer(
        stateWithMultipleIngredients,
        moveIngredient({
          index: originalIngredients.length - 1,
          upwards: false
        })
      );
      expect(newState.ingredients).toEqual(originalIngredients);
    });
  });

  describe('тестирование сброса конструктора', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [
        { ...mockIngredient, id: '1' },
        { ...mockIngredient, id: '2' }
      ]
    };

    test('сброс конструктора', () => {
      const newState = slice.reducer(stateWithData, resetConstructor());
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });
});
