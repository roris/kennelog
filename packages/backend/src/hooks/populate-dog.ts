import { Hook, HookContext } from '@feathersjs/feathers';

const populateDog_ = async (measure, app) => {
  const measure_ = measure;
  measure_.dog = await app.service('dogs').get(measure_.dogId);
  return measure_;
};

// eslint-disable-next no-unsed-vars,@typescript-eslint/no-unused-vars
export const populateDog = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const measures = method === 'find' ? result.data : [result];
    await Promise.all(measures.map(measure => populateDog_(measure, app)));
    return context;
  };
};
