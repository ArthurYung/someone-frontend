import { FC } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
  const { write, asyncWrite } = useSomeoneEditor();
  write(`init, welecome to bruce gpt
  and then, you are welecome
  `, 2000);
  write(`init, welecome to bruce gpt
  an`);
  asyncWrite('wowowowowo');
  return children;
}

