import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    testSessionId?: string;
  }
}

export function createSessionMiddleware(): ReturnType<typeof session> {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

  return session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
    },
    name: 'personality_test_session',
  });
}
