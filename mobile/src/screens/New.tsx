import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';

import { api } from '../lib/axios';

const availableWeekDays = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira',
  'Sexta-feira', 'Sábado'
];

export function New() {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<number[]>([]);

  const { goBack } = useNavigation();

  function handleToggleWeekDay(weekDayIndex: number) {
    if(weekDays.includes(weekDayIndex)){
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
    }else{
      setWeekDays(prevState => [...prevState, weekDayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if(!title.trim()) {
        return Alert.alert('Novo hábito', 'Informe o nome do hábito');
      }

      if(weekDays.length === 0) {
        return Alert.alert('Novo hábito', 'Selecione ao menos um dia da semana');
      }

      await api.post('/habits', {
        title,
        weekDays
      });

      setTitle('');
      setWeekDays([]);

      Alert.alert('Novo hábito', 'Hábito criado com sucesso');

      return goBack();
    } catch (error) {
      console.log(error);
      return Alert.alert('Ops!', 'Não foi possível criar o novo hábito');
    }
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

        <Text className='mt-4 text-white font-extrabold text-3xl'>
          Criar hábito
        </Text>

        <Text className='mt-6 text-white font-semibold text-base'>
          Qual seu comprometimento?
        </Text>

        <TextInput
          className='h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600'
          placeholder='Exercícios, dormi bem, etc...'
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className='mt-4 mb-3 text-white font-semibold text-base'>
          Qual a recorrência?
        </Text>

        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox.Root
              key={weekDay}
              onPress={() => handleToggleWeekDay(index)}
            >
              <Checkbox.Content checked={weekDays.includes(index)} />

              <Checkbox.Label>
                {weekDay}
              </Checkbox.Label>
            </Checkbox.Root>
          )
        })}

        <TouchableOpacity
          className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather
            name='check'
            size={20}
            color={colors.white}
          />

          <Text className='font-semibold text-base text-white ml-2'>
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}