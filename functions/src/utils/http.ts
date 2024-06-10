export const validateHttpCode = (code: number): boolean => {
  return code >= 100 && code < 600;
}