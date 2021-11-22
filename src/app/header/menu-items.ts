export const MenuItems = [
  {
    title: 'Home',
    route: 'home',
  },
  {
    title: 'Find A Business',
    route: 'find-a-business',
  },
  {
    title: 'News',
    route: 'news',
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
