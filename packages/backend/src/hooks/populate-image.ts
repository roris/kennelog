import { Hook, HookContext } from '@feathersjs/feathers';

const populateImage_ = async (dog, app, host, port) => {
  const dog_ = dog;
  const uploads = await app.service('uploads').get(dog_.pictureId);
  const pictureUrl = `http://${host}:${port}/uploads/${uploads.path}`;
  dog_.pictureUrl = pictureUrl;
  return dog_;
};

// eslint-disable-next @typescript-eslint/no-unused-vars
export const populateImage = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const dogs = method === 'find' ? result.data : [result];
    const host = app.get('host');
    const port = app.get('port');
    const filtered = dogs.filter(pair => !!pair.pictureId);
    await Promise.all(
      filtered.map(pair => populateImage_(pair, app, host, port))
    );

    return context;
  };
};
