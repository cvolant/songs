import React from 'react';
import dayjs from 'dayjs';
import calendarPlugin from 'dayjs/plugin/calendar';
import fr from 'dayjs/locale/fr';

dayjs.extend(calendarPlugin);

interface IFrProps {
  date?: Date;
}

const Fr: React.FC<IFrProps> = ({ date }) => {
  const calendar = {
    sameDay: "[Aujourd'hui]",
    nextDay: '[Demain]',
    nextWeek: 'dddd',
    lastDay: '[Hier]',
    lastWeek: 'dddd [dernier]',
    sameElse: 'DD/MM/YYYY',
  };
  return (
    <>
      {date ? dayjs(date).locale({ ...fr, calendar }).calendar() : ''}
    </>
  );
};

export default Fr;
