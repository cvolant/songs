import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

const CalendarDateLocales = {
  en: React.lazy(() => import('../../i18n/dayjs/calendar/En')),
  fr: React.lazy(() => import('../../i18n/dayjs/calendar/Fr')),
};

interface ICalendarDateProps {
  date?: Date;
}

export const CalendarDate: React.FC<ICalendarDateProps> = ({ date }) => {
  const { i18n } = useTranslation();
  const LocalCalendarDate = CalendarDateLocales[i18n.language as 'en' | 'fr'];
  return (
    <Suspense fallback="...">
      <LocalCalendarDate date={date} />
    </Suspense>
  );
};

export default CalendarDate;
