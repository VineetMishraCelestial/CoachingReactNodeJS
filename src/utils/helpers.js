export const toPlainObject = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) {
    return doc.map(d => addId(d));
  }
  return addId(doc);
};

const addId = (obj) => {
  if (!obj) return obj;
  const { _id, ...rest } = obj;
  return { id: _id?.toString(), ...rest };
};

export default { toPlainObject };
