export const buildUrlWithCurrentParams = (
  basePath: string,
  searchParams: URLSearchParams
): string => {
  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};
