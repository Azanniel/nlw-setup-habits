import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { Loading } from '../components/Loading';

import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { HabitsEmpty } from '../components/HabitsEmpty';

interface Params {
  date: string
}

interface DayInfoProps {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0;

  async function fetchHabits() {
    try {
      setIsLoading(true);

      const response = await api.get('/day', {
        params: {
          date
        }
      });

      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      const isHabitAlreadyExist = completedHabits.includes(habitId);

      if (isHabitAlreadyExist) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito');
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 48
        }}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        <Text className='mt-4 mb-2 text-zinc-400 font-bold text-base lowercase'>
          {dayOfWeek}
        </Text>

        <Text className='text-white font-extrabold text-4xl lowercase mb-4'>
          {dayAndMonth}
        </Text>

        <ProgressBar
          progress={habitsProgress}
        />

        <View className={clsx('mt-6', {
          'opacity-50': isDateInPast
        })}>
          {dayInfo?.possibleHabits.length !== 0 ? dayInfo.possibleHabits.map(day => {
            const isHabitCompleted = completedHabits.includes(day.id);

            return (
              <Checkbox.Root
                key={day.id}
                onPress={() => handleToggleHabit(day.id)}
                disabled={isDateInPast}
              >
                <Checkbox.Content
                  checked={isHabitCompleted}
                />

                <Checkbox.Label
                  className={clsx('font-semibold text-xl', {
                    'line-through text-zinc-400': isHabitCompleted
                  })}
                >
                  {day.title}
                </Checkbox.Label>
              </Checkbox.Root>
            )
          }) : (
            <HabitsEmpty />
          )}
        </View>

        {
          (isDateInPast && dayInfo?.possibleHabits.length !== 0) && (
            <Text className='text-white mt-10 text-center'>
              Você não pode editar hábitos de uma data passada.
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}