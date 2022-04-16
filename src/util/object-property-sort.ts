export const objectPropertySort = (obj: object): object => {
  const sorted = Object.entries(obj).sort();

  return sorted.reduce((p, [key, value]) => {
    if (value instanceof Date) {
      return { ...p, [key]: value };
    }

    if (value instanceof Array) {
      return { ...p, [key]: value.map((e) => objectPropertySort(e)) };
    }

    if (typeof value === "object") {
      return { ...p, [key]: objectPropertySort(value) };
    }

    return { ...p, [key]: value };
  }, {});
};
