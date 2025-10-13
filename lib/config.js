const ironOptions = {
  cookieName: 'restaurant_user',
  password:
    process.env.SESSION_SECRET || 'restaurantUser-restaurantUser-restaurantUser-restaurantUser',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  ttl: 60 * 60 * 24 * 7, // 1 week
};

export default ironOptions;
