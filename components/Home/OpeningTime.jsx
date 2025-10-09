import React, { useState } from 'react';

import { formatTime, todaysDay } from '@/hook/model/helper';

const OpeningTime = ({ rest }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const abbrevDays = fullDays.map((day) => day.slice(0, 3).toLowerCase());

  const expandDays = (dayStr) => {
    if (dayStr === 'mon-sun') return fullDays;

    if (dayStr.includes('-')) {
      const [start, end] = dayStr.split('-');
      const startIndex = abbrevDays.indexOf(start.toLowerCase());
      const endIndex = abbrevDays.indexOf(end.toLowerCase());

      if (startIndex === -1 || endIndex === -1) return [];

      if (startIndex <= endIndex) {
        return fullDays.slice(startIndex, endIndex + 1);
      } else {
        return [...fullDays.slice(startIndex), ...fullDays.slice(0, endIndex + 1)];
      }
    }

    const idx = abbrevDays.indexOf(dayStr.toLowerCase());
    return idx !== -1 ? [fullDays[idx]] : [];
  };

  const hoursByDay = {};

  const toMinutes = (raw) => {
    if (!raw) return null;
    const [h, m] = raw.split(':').map((x) => parseInt(x, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  rest?.hours?.forEach((hour) => {
    const days = expandDays(hour.day);
    const startMin = toMinutes(hour.start);
    const endMin = toMinutes(hour.end);

    days.forEach((day) => {
      if (!hoursByDay[day]) {
        hoursByDay[day] = { start: hour.start, end: hour.end };
      } else {
        const curr = hoursByDay[day];
        const currStartMin = toMinutes(curr.start);
        const currEndMin = toMinutes(curr.end);
        if (startMin !== null && (currStartMin === null || startMin < currStartMin)) {
          curr.start = hour.start;
        }
        if (endMin !== null && (currEndMin === null || endMin > currEndMin)) {
          curr.end = hour.end;
        }
      }
    });
  });

  return (
    <div className='w-full mb-5 rounded-lg'>
      <button
        className='flex items-center justify-between w-full cursor-pointer bg-primary-light hover:bg-gray-50 py-3 px-3 sm:px-5'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center space-x-1 sm:space-x-2'>
          <span className='text-xl sm:text-2xl transition-transform duration-300'>
            {isOpen ? '−' : '+'}
          </span>
          <span className='font-extrabold mt-1'>Operating Hours</span>
        </div>
        <span
          className={`font-bold text-sm sm:text-lg ${rest?.currOpen ? 'text-green' : 'text-red'}`}
        >
          {rest?.currOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out px-0 sm:px-7 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='bg-white rounded-lg'>
          {fullDays.map((day) => {
            const range = hoursByDay[day];
            if (!range) return null;

            const isToday = day.toLowerCase() === todaysDay.toLowerCase();
            const start = formatTime(range.start);
            const end = formatTime(range.end);

            return (
              <div
                key={day}
                className={`flex justify-between gap-20 text-gray-400 text-sm transition-opacity duration-300 px-3 py-1 capitalize ${
                  isToday ? 'font-bold text-gray-600' : ''
                }`}
              >
                <li className='w-[80px] flex items-center text-nowrap'>
                  {day} {isToday ? '(Today)' : ''}
                </li>
                <li className='flex flex-col '>
                  <span>{`${start} - ${end}`}</span>
                </li>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OpeningTime;
