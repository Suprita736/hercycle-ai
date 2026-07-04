import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['en', 'hi'];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale)) {
    locale = 'en'; // default fallback
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
