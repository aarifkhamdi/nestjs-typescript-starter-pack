import { AsyncLocalStorage } from 'async_hooks';
import type { Request } from 'express';
import { Logger } from 'winston';

type AsyncStorage = {
  logger: Logger;
  request: Request;
};

export const asyncStorage = new AsyncLocalStorage<AsyncStorage>();
export const getAsyncStorage = asyncStorage.getStore.bind(
  asyncStorage,
) as () => ReturnType<typeof asyncStorage.getStore>;
