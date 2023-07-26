import { useSomeoneEditor } from "./context";

export type WriteSchema<T = any> = {
  text: string | ((data: T) => string);
  sleep?: number;
  async?: boolean;
}[];

export function CreateWriteSchema<T = any>(schema: WriteSchema<T>): WriteSchema<T> {
  return schema;
}

export const useWriteWithSchema = () => {
  const { write, asyncWrite } = useSomeoneEditor();
  function writeSchema<T extends Object>(schema: WriteSchema<T>, data?: T) {
    schema.forEach(item => {
      let text = item.text;
      if (typeof item.text === 'function') {
        text = item.text(data!);
      }
  
      return item.async ? asyncWrite(text as string, item.sleep) : write(text as string, item.sleep);
    });
  }

  function asyncCallback(callback: () => any) {
    return asyncWrite('').then(callback);
  }

  return {
    writeSchema,
    asyncCallback,
  }
}