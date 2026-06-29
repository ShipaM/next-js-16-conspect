import 'server-only'

const MOCK_USERS = [
  { id: 1, name: 'Артем', email: 'artem@gmail.com' },
  { id: 2, name: 'Арина', email: 'arina@gmail.gmail' },
  { id: 3, name: 'Никита', email: 'nikita@gmail.com' },
  { id: 4, name: 'Дмитрий', email: 'dima@gmail.com' },
]

export const db = {
  query: {
    users: {
      findMany: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        return MOCK_USERS
      },
    },
  },
}
