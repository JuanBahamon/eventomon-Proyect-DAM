export const formatPrice = (precio: number): string => {
  return `${precio}€`;
};

export const calcTotal = (precio: number, cantidad: number): number => {
  return precio * cantidad;
};