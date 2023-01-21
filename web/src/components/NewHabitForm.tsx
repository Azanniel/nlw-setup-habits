import { FormEvent, useState } from 'react';
import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';

import { api } from '../lib/axios';

const availableWeekDays = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira',
  'Sexta-feira', 'Sábado'
];

export function NewHabitForm() {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if(!title || weekDays.length === 0) {
      return;
    }

    await api.post('/habits', {
      title,
      weekDays
    });

    setTitle('');
    setWeekDays([]);

    alert('Hábito criado com sucesso!');
  }

  function handleToggleWeekDay(weekDay: number) {
    if(weekDays.includes(weekDay)) {
      setWeekDays(prevState => prevState.filter(day => day !== weekDay));
    }else {
      setWeekDays(prevState => [...prevState, weekDay]);
    }
  }

  return (
    <form onSubmit={createNewHabit} className='w-full flex flex-col mt-6'>
      <label htmlFor='title' className='font-semibold leading-tight'>
        Qual seu comprometimento?
      </label>

      <input
        className='p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900'
        type='text'
        id='title'
        placeholder='ex.: Execícios, dormir bem, etc...'
        autoFocus
        onChange={event => setTitle(event.target.value)}
        value={title}
      />

      <label className='font-semibold leading-tight mt-4'>
        Qual a recorrência?
      </label>

      <div className='mt-3 flex flex-col gap-2'>
        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox.Root
              key={weekDay}
              className='flex items-center gap-3 group focus:outline-none'
              checked={weekDays.includes(index)}
              onCheckedChange={() => handleToggleWeekDay(index)}
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-all group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900'>
                <Checkbox.Indicator>
                  <Check size={20} className='text-white' />
                </Checkbox.Indicator>
              </div>

              <span className='leading-tight text-white'>
                {weekDay}
              </span>
            </Checkbox.Root>
          )
        })}
      </div>

      <button
        className='mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900'
        type='submit'
      >
        <Check size={20} weight='bold' />
        Confirmar
      </button>
    </form>
  )
}