import { useCallback, useState } from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { HabitDay, daySize } from '../components/HabitDay';

import { api } from '../lib/axios';
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

interface Summary {
  id: string;
  date: string;
  completed: number;
  amount: number;
}

export function Home() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [isFetchingSummary, setIsFetchingSummary] = useState(true);

  const {navigate} = useNavigation();

  function handleNavigateToHabitDetails(date: string) {
    navigate('habit', { date });
  }

  async function fetchSummaryData() {
    try {
      setIsFetchingSummary(true);

      const response = await api.get('/summary');

      setSummary(response.data);
    } catch (error) {
      Alert.alert('Ops!', 'Não foi possível carregar o sumário de hábitos.');
      console.log(error);
    } finally {
      setIsFetchingSummary(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchSummaryData()
  }, []));

  if(isFetchingSummary) {
    return <Loading />
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <Header />

      <View className='flex-row mt-6 mb-2'>
        {weekDays.map((weekDay, i) => {
          return (
            <Text
              key={`${weekDay}-${i}`}
              className='text-zinc-400 text-xl font-bold text-center mx-1'
              style={{ width: daySize }}
            >
              {weekDay}
            </Text>
          )
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100
        }}
      >
        <View className='flex-row flex-wrap'>
          {datesFromYearStart.map(date => {
            const dayWithHabits = summary.find(day => {
              return dayjs(date).isSame(day.date, 'day');
            });

            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amount={dayWithHabits?.amount}
                completed={dayWithHabits?.completed}
                onPress={() => handleNavigateToHabitDetails(date.toISOString())}
              />
            )
          })}

          {
            amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, i) => {
                return (
                  <View
                    key={i.toString()}
                    className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                    style={{
                      width: daySize,
                      height: daySize
                    }}
                  />
                )
              })
          }
        </View>
      </ScrollView>
    </View>
  )
}