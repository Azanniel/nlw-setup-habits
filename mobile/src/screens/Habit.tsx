import { View, ScrollView, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';

interface Params {
  date: string
}

export function Habit() {
  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

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
          progress={50}
        />

        <View className='mt-6'>
          <Checkbox.Root>
            <Checkbox.Content checked={true} />

            <Checkbox.Label className='font-semibold'>
              Beber 2L de água
            </Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root>
            <Checkbox.Content checked={false} />

            <Checkbox.Label className='font-semibold'>
              Caminhar
            </Checkbox.Label>
          </Checkbox.Root>
        </View>
      </ScrollView>
    </View>
  )
}