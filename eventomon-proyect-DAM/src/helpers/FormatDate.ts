export const formatDate = (fecha: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };
  return new Date(fecha).toLocaleDateString('es-ES', options);
};

export const formatTime = (fecha: string): string => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};