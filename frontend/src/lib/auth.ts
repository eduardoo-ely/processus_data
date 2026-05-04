import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const user = process.env.APP_USER ?? 'admin'
        const pass = process.env.APP_PASSWORD ?? 'admin'

        if (
          credentials?.username === user &&
          credentials?.password === pass
        ) {
          return { id: '1', name: user, email: `${user}@local` }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as typeof session.user
      return session
    },
  },
})
