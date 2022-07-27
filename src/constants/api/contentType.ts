export const ApplicationJsonContentType = () => {
  return {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
  };
};