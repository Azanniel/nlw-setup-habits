import { TouchableOpacity, Dimensions, TouchableOpacityProps } from 'react-native';
import clsx from 'clsx';

import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import dayjs from 'dayjs';

const daysOfTheWeek = 7;
const screenHorizontalPadding = (32 * 2) / 5;

export const dayMarginBetween = 8;
export const daySize = (Dimensions.get('screen').width / daysOfTheWeek) - (screenHorizontalPadding + 5);

interface HabitDayProps extends TouchableOpacityProps {
  date: Date;
  amount?: number;
  completed?: number;
}

export function HabitDay({
  date, amount = 0, completed = 0, ...rest
}: HabitDayProps) {

  const amountAccomplishedPercentage = amount > 0 ? generateProgressPercentage(amount, completed) : 0;
  const isCurrentDay = dayjs().isSame(date, 'day');

  return (
    <TouchableOpacity
      className={clsx('border-2 rounded-lg m-1', {
        'bg-zinc-900 border-zinc-800': amountAccomplishedPercentage === 0,
        'bg-violet-900 border-violet-700': amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
        'bg-violet-800 border-violet-600': amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
        'bg-violet-700 border-violet-500': amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
        'bg-violet-600 border-violet-500': amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
        'bg-violet-500 border-violet-400': amountAccomplishedPercentage >= 80,
        'border-white border-4': isCurrentDay
      })}
      style={{
        width: daySize,
        height: daySize
      }}
      activeOpacity={0.7}
      {...rest}
    />
  )
}