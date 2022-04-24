import _ from "lodash";
import product from "cartesian-product";

export function findAnswer(a, b, operation) {
  if (operation === "AxB") return product([a, b]);
  if (operation === "A-B") return _.difference(a, b);
  if (operation === "B-A") return _.difference(b, a);
  if (operation === "A∪B") return _.union(a, b);
  if (operation === "A∩B") return _.intersection(b, a);
}
