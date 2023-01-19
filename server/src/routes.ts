import { FastifyInstance } from 'fastify';
import dayjs from 'dayjs';
import { prisma } from './lib/prisma';
import { createHabitBody } from './dtos/create-habit-body';
import { getDayParams } from './dtos/get-day-params';
import { toggleHabitParams } from './dtos/toggle-habit-params';

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (request, response) => {
    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf('day').toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay
            }
          })
        }
      }
    });

    return response.status(201).send();
  });

  app.get('/day', async (request) => {
    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf('day');
    const weekDay = parsedDate.get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true
      }
    });

    const completedHabits = day ? day.dayHabits.map(dayHabit => {
      return dayHabit.habit_id;
    }) : [];

    return {
      possibleHabits,
      completedHabits
    }
  });

  app.patch('/habits/:id/toggle', async (request) => {
    const { id } = toggleHabitParams.parse(request.params);
    const today = dayjs().startOf('day').toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    });

    if(!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    });

    if(dayHabit) {
      // Remover a marcação de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      });
    }else{
      // Completar o hábito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      });
    }
  });
}