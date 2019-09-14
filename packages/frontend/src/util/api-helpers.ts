export const createImage = async (api, uri?) => {
  if (!uri) {
    return null;
  }
  const blob = await api.service('blobs').create({ uri: uri });
  return api.service('uploads').create({ path: blob.uri });
};

const createDogObject = (dog, image) => {
  const result = Object.assign({}, dog);

  if (image) {
    dog.pictureId = image.id;
  }

  return result;
};

export const createDog = async (api, dog, uri?) => {
  const image = await createImage(api, uri);
  const payload = createDogObject(dog, image);
  return api.service('dogs').create(payload);
};

export const getDogByNameAndGender = async (api, ownerId, name, gender) => {
  const params = {
    query: {
      name: { $like: `%${name}%` },
      gender: gender,
      ownerId: ownerId,
      $limit: 1,
      $sort: {
        updatedAt: -1
      }
    }
  };
  const { data } = await api.service('dogs').find(params);
  console.log(data);
  return data.length > 0 ? data[0] : {};
};
