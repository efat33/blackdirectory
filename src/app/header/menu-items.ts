export const MenuItems = [
  {
    title: 'Home',
    route: 'home',
  },
  {
    title: 'Businesses',
    route: 'listing',
  },
  {
    title: 'News',
    route: 'news',
    children: [
      {
        title: 'Business',
        route: 'news/business',
      },
      {
        title: 'Celebrity News',
        route: 'news/celebrity-news',
      },
      {
        title: 'Community',
        route: 'news/community',
      },
      {
        title: 'Entertainment',
        route: 'news/entertainment',
      },
      {
        title: 'Health',
        route: 'news/health',
      },
      {
        title: 'Jobs',
        route: 'news/jobs',
      },
      {
        title: 'Music',
        route: 'news/music',
      },
      {
        title: 'Sport',
        route: 'news/sport',
      },
      {
        title: 'World News',
        route: 'news/world-news',
      },
    ]
  },
  {
    title: 'Events',
    route: 'events',
  },
  {
    title: 'Careers',
    route: 'jobs',
  },
  {
    title: 'Finance',
    route: 'finance',
  },
  {
    title: 'Mobiles',
    route: 'mobiles',
    children: [
      {
        title: 'Contract Phones',
        route: 'mobiles/contract-phones',
      },
      {
        title: 'Sim Only',
        route: 'mobiles/sim-only',
      },
      {
        title: 'Upgrades',
        route: 'mobiles/upgrades',
      },
      {
        title: 'Broadband',
        route: 'mobiles/broadband',
      },
    ]
  },
  {
    title: 'Travel',
    route: 'travel',
  },
  {
    title: 'Deals & Shopping',
    route: 'deals',
  },
  {
    title: 'Forum',
    route: 'forums',
  },
  {
    title: 'BD Market',
    route: 'shop',
  },
];

export const ProfileMenus = [
  {
    title: 'Account',
    route: 'dashboard',
  },
  {
    title: 'Logout',
    route: 'logout',
    callback: 'logUserOut',
  },
];
