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
          // Simulando o ID do tenant do usuário após verificação real no banco
          return { 
            id: '1', 
            name: user, 
            email: `${user}@local`,
            tenantId: '11111111-1111-1111-1111-111111111111' 
          } as any
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
      if (user) {
        token.user = user
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any
        // Injeta na sessão para o Front-end capturar e enviar nos Headers da API
        (session as any).tenantId = token.tenantId
      }
      return session
    },
  },
})
