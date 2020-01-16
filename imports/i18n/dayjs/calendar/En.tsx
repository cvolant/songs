import React from 'react';
import dayjs from 'dayjs';
import calendarPlugin from 'dayjs/plugin/calendar';
import en from 'dayjs/locale/en';

dayjs.extend(calendarPlugin);

interface IEnProps {
  date?: Date;
}

const En: React.FC<IEnProps> = ({ date }) => {
  const calendar = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY',
  };
  return (
    <>
      {date ? dayjs(date).locale({ ...en, calendar }).calendar() : ''}
    </>
  );
};

export default En;
