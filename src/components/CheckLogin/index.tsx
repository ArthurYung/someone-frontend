import { FC } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
  const { write, asyncWrite } = useSomeoneEditor();
  console.log(Date.now())
  write(`init, wel<style|opacity: 0.6;color: red>[ecome] to bruce gpt
  and then, you <class|test>[are] welecome
  `, 2000);
  write(`init, welecome to bruce gpt
  an`);
  asyncWrite('wowowowowo <style|color:green;font-size:24px>[this is my shit]fdsa');
  return children;
}

