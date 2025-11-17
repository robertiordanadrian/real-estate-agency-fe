export const getEnumOptions = <T extends Record<string, string>>(
  enumObj: T,
  labels: Record<string, string>,
) => {
  return Object.values(enumObj).map((value) => ({
    value,
    label: labels[value] ?? value,
  }));
};

export function getEnumLabel<T extends Record<string, string>>(labels: T, key: string): string {
  return labels[key as keyof T] ?? key;
}
