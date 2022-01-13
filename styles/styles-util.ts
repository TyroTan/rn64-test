type CssRule = [string, string];

export const cssToTuples = (css: string): CssRule[] => {
  const rules = css.split(";");
  const tuples = rules
    .map((rule) => {
      let [key, value] = rule.split(":");

      if (key && value) {
        key = key.trim();
        value = value.trim();
        return [key, value];
      } else {
        return null;
      }
    })
    .filter((x) => {
      return x != null;
    });

  return (tuples ?? []) as CssRule[];
};
