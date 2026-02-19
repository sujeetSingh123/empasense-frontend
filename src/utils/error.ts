export const getErrorMessage = (e: unknown): string => {
  // Small helper to safely extract common error messages from axios-like errors.
  // We allow a single explicit any use here because we can't type the upstream shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maybe = e as any;
  return maybe?.response?.data?.message ?? maybe?.message ?? String(e);
};
