import { ProjectType } from "../components/DnDComponents/types";

export const orderFunc = (array: any, keys: any, orders: any) => {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i];

      if (a[key] < b[key]) {
        return order === "asc" ? -1 : 1;
      } else if (a[key] > b[key]) {
        return order === "asc" ? 1 : -1;
      }
    }
    return 0; // If values are equal, move to the next key
  });
};

