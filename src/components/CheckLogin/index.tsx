import { FC } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
  const { write, asyncWrite } = useSomeoneEditor();

  write('wowowowowo <style|color:green;font-size:24px>[%this is my shit%]fdsa\n');
  asyncWrite(`<style|color: green>[%someone: %]`);
  return children;
}

