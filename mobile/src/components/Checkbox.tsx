import { TouchableOpacity, TouchableOpacityProps, View, Text, TextProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import colors from 'tailwindcss/colors';

export interface CheckboxRootProps extends TouchableOpacityProps { }

function CheckboxRoot({ children, ...rest }: CheckboxRootProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className='flex-row mb-2 items-center'
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}

export interface CheckboxContentProps {
  checked?: boolean
}

function CheckboxContent({ checked = false }: CheckboxContentProps) {
  if (checked) {
    return (
      <Animated.View
        className='h-8 w-8 bg-green-500 rounded-lg items-center justify-center'
        entering={ZoomIn}
        exiting={ZoomOut}
      >
        <Feather
          name='check'
          size={20}
          color={colors.white}
        />
      </Animated.View>
    )
  }

  return (
    <View className='h-8 w-8 rounded-lg bg-zinc-900 border-2 border-zinc-800' />
  )
}

export interface CheckboxLabelProps extends TextProps { }

function CheckboxLabel({ children, ...rest }: CheckboxLabelProps) {
  return (
    <Text
      className='text-white ml-3'
      {...rest}
    >
      {children}
    </Text>
  )
}

export const Checkbox ={
  Root: CheckboxRoot,
  Content: CheckboxContent,
  Label: CheckboxLabel
}