export function parseApiError(error, fallback = "Ocorreu um erro inesperado.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
