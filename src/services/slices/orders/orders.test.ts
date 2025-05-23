import {
  slice,
  initialState,
  fetchOrders,
  createOrder,
  fetchOrder
} from './index';
import { TOrder } from '@utils-types';

describe('Тестирование слайса заказов', () => {
  const sampleDate = '2023-05-15T12:00:00Z';
  
  const testOrder: TOrder = {
    _id: 'order123',
    ingredients: ['ing1', 'ing2'],
    status: 'created',
    name: 'Тестовый заказ',
    number: 12345,
    createdAt: sampleDate,
    updatedAt: sampleDate
  };

  const testOrdersList: TOrder[] = [
    testOrder,
    {
      ...testOrder,
      _id: 'order456',
      status: 'pending',
      number: 12346
    }
  ];

  describe('Получение списка заказов', () => {
    const testCases = [
      {
        name: 'начало загрузки',
        action: { type: fetchOrders.pending.type },
        check: (state: typeof initialState) => {
          expect(state.isOrdersLoading).toBe(true);
          expect(state.error).toBeNull();
        }
      },
      {
        name: 'ошибка загрузки',
        action: { 
          type: fetchOrders.rejected.type,
          error: { message: 'Ошибка сети' } 
        },
        check: (state: typeof initialState) => {
          expect(state.isOrdersLoading).toBe(false);
          expect(state.error).toEqual({ message: 'Ошибка сети' });
        }
      },
      {
        name: 'успешная загрузка',
        action: { 
          type: fetchOrders.fulfilled.type,
          payload: testOrdersList 
        },
        check: (state: typeof initialState) => {
          expect(state.isOrdersLoading).toBe(false);
          expect(state.data).toEqual(testOrdersList);
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

  describe('Создание нового заказа', () => {
    const newOrderResponse = {
      order: testOrder,
      name: 'Тестовый заказ'
    };

    const testCases = [
      {
        name: 'начало создания',
        action: { type: createOrder.pending.type },
        check: (state: typeof initialState) => {
          expect(state.orderRequest).toBe(true);
        }
      },
      {
        name: 'ошибка создания',
        action: { type: createOrder.rejected.type },
        check: (state: typeof initialState) => {
          expect(state.orderRequest).toBe(false);
        }
      },
      {
        name: 'успешное создание',
        action: { 
          type: createOrder.fulfilled.type,
          payload: newOrderResponse 
        },
        check: (state: typeof initialState) => {
          expect(state.orderRequest).toBe(false);
          expect(state.orderModalData).toEqual(testOrder);
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

  describe('Получение деталей заказа', () => {
    const testCases = [
      {
        name: 'начало загрузки',
        action: { type: fetchOrder.pending.type },
        check: (state: typeof initialState) => {
          expect(state.isOrderLoading).toBe(true);
        }
      },
      {
        name: 'ошибка загрузки',
        action: { type: fetchOrder.rejected.type },
        check: (state: typeof initialState) => {
          expect(state.isOrderLoading).toBe(false);
        }
      },
      {
        name: 'успешная загрузка',
        action: { 
          type: fetchOrder.fulfilled.type,
          payload: testOrder 
        },
        check: (state: typeof initialState) => {
          expect(state.isOrderLoading).toBe(false);
          expect(state.orderModalData).toEqual(testOrder);
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

  describe('Сброс данных модального окна', () => {
    test('очищает данные заказа', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: testOrder
      };

      const result = slice.reducer(
        stateWithOrder,
        slice.actions.resetOrderModalData()
      );
      
      expect(result.orderModalData).toBeNull();
    });
  });
});