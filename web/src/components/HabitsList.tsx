import { useEffect, useState } from 'react';
import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';

import { api } from '../lib/axios';

interface Habit {
  id: string;
  title: string;
  created_at: string;
}

interface HabitsInfo {
  possibleHabits: Habit[];
  completedHabits: string[];
}

interface HabitsListProps {
  date: Date,
  onCompletedChange: (completed: number) => void;
}

export function HabitsList({ date, onCompletedChange }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = [];

    if(isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits
    });

    onCompletedChange(completedHabits.length);
  }

  useEffect(() => {
    api.get('/day', {
      params: {
        date: date.toISOString()
      }
    }).then(response => {
      setHabitsInfo(response.data);
    });
  }, []);

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {habitsInfo?.possibleHabits.map(habit => {
        return (
          <Checkbox.Root
            key={habit.id}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
            checked={habitsInfo.completedHabits.includes(habit.id)}
            disabled={isDateInPast}
          >
            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-all group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background'>
              <Checkbox.Indicator>
                <Check size={20} className='text-white' />
              </Checkbox.Indicator>
            </div>

            <span className='font-semibold text-xl leading-tight text-white group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}