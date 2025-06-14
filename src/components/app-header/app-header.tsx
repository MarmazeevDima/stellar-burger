import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';

export const AppHeader: FC = () => {
  const { data } = useSelector((state) => state.userReducer);

  return <AppHeaderUI userName={data.name} />;
};
