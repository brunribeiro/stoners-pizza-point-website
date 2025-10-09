const ironOptions = {
  cookieName: 'restaurant_user',
  // secure: process.env.NODE_ENV === "production",
  password: 'restaurantUser-restaurantUser-restaurantUser-restaurantUser',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
  },
};

export default ironOptions;
