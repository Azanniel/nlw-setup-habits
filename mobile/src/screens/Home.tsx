import { Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { HabitDay, daySize } from '../components/HabitDay';

import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

export function Home() {
  const {navigate} = useNavigation();

  function handleNavigateToHabitDetails(date: string) {
    navigate('habit', { date });
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
            return (
              <HabitDay
                key={date.toISOString()}
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