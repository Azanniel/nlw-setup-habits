import './styles/global.css';

import { Habit } from './components/Habit'

export function App() {
  return (
    <div>
      <Habit completed={3} />
      <Habit completed={20} />
      <Habit completed={30} />
    </div>
  )
}