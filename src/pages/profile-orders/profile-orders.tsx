import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchOrders } from '../../services/slices/orders';
import { useDispatch, useSelector } from '@store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { data: orders } = useSelector((store) => store.ordersReducer);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
