import { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'ru' | 'arm';

// Define translation keys structure
type TranslationKeys = {
  common: {
    home: string;
    movies: string;
    categories: string;
    search: string;
    login: string;
    logout: string;
    register: string;
    profile: string;
    settings: string;
    about: string;
    contact: string;
    admin: string;
    [key: string]: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    rememberMe: string;
    forgotPassword: string;
    loginButton: string;
    registerButton: string;
    orContinueWith: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    [key: string]: string;
  };
  movies: {
    featured: string;
    trending: string;
    newReleases: string;
    recommended: string;
    watchNow: string;
    details: string;
    cast: string;
    director: string;
    genre: string;
    releaseDate: string;
    duration: string;
    rating: string;
    [key: string]: string;
  };
  admin: {
    dashboard: string;
    users: string;
    content: string;
    analytics: string;
    security: string;
    settings: string;
    statistics: string;
    totalUsers: string;
    totalMovies: string;
    [key: string]: string;
  };
  [key: string]: { [key: string]: string };
};

// Define translations object
const translations: Record<Language, TranslationKeys> = {
  en: {
    common: {
      home: 'Home',
      movies: 'Movies',
      categories: 'Categories',
      search: 'Search',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      profile: 'Profile',
      settings: 'Settings',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin',
    },
    auth: {
      loginTitle: 'Login to your account',
      registerTitle: 'Create new account',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginButton: 'Login',
      registerButton: 'Register',
      orContinueWith: 'Or continue with',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
    },
    movies: {
      featured: 'Featured',
      trending: 'Trending',
      newReleases: 'New Releases',
      recommended: 'Recommended',
      watchNow: 'Watch Now',
      details: 'Details',
      cast: 'Cast',
      director: 'Director',
      genre: 'Genre',
      releaseDate: 'Release Date',
      duration: 'Duration',
      rating: 'Rating',
    },
    admin: {
      dashboard: 'Dashboard',
      users: 'Users',
      content: 'Content',
      analytics: 'Analytics',
      security: 'Security',
      settings: 'Settings',
      statistics: 'Statistics',
      totalUsers: 'Total Users',
      totalMovies: 'Total Movies',
    },
  },
  ru: {
    common: {
      home: 'Главная',
      movies: 'Фильмы',
      categories: 'Категории',
      search: 'Поиск',
      login: 'Вход',
      logout: 'Выход',
      register: 'Регистрация',
      profile: 'Профиль',
      settings: 'Настройки',
      about: 'О нас',
      contact: 'Контакты',
      admin: 'Админ',
    },
    auth: {
      loginTitle: 'Вход в аккаунт',
      registerTitle: 'Создать новый аккаунт',
      username: 'Имя пользователя',
      email: 'Электронная почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      rememberMe: 'Запомнить меня',
      forgotPassword: 'Забыли пароль?',
      loginButton: 'Войти',
      registerButton: 'Зарегистрироваться',
      orContinueWith: 'Или продолжить с',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      dontHaveAccount: 'Нет аккаунта?',
    },
    movies: {
      featured: 'Рекомендуемые',
      trending: 'Популярные',
      newReleases: 'Новинки',
      recommended: 'Советуем посмотреть',
      watchNow: 'Смотреть',
      details: 'Детали',
      cast: 'В ролях',
      director: 'Режиссер',
      genre: 'Жанр',
      releaseDate: 'Дата выхода',
      duration: 'Продолжительность',
      rating: 'Рейтинг',
    },
    admin: {
      dashboard: 'Панель управления',
      users: 'Пользователи',
      content: 'Контент',
      analytics: 'Аналитика',
      security: 'Безопасность',
      settings: 'Настройки',
      statistics: 'Статистика',
      totalUsers: 'Всего пользователей',
      totalMovies: 'Всего фильмов',
    },
  },
  arm: {
    common: {
      home: 'Գլխավոր',
      movies: 'Ֆիլմեր',
      categories: 'Կատեգորիաներ',
      search: 'Որոնել',
      login: 'Մուտք',
      logout: 'Ելք',
      register: 'Գրանցվել',
      profile: 'Պրոֆիլ',
      settings: 'Կարգավորումներ',
      about: 'Մեր մասին',
      contact: 'Կապ',
      admin: 'Ադմին',
    },
    auth: {
      loginTitle: 'Մուտք ձեր հաշիվ',
      registerTitle: 'Ստեղծել նոր հաշիվ',
      username: 'Օգտանուն',
      email: 'Էլ. փոստ',
      password: 'Գաղտնաբառ',
      confirmPassword: 'Հաստատեք գաղտնաբառը',
      rememberMe: 'Հիշել ինձ',
      forgotPassword: 'Մոռացե՞լ եք գաղտնաբառը',
      loginButton: 'Մուտք',
      registerButton: 'Գրանցվել',
      orContinueWith: 'Կամ շարունակեք',
      alreadyHaveAccount: 'Արդեն ունե՞ք հաշիվ',
      dontHaveAccount: 'Չունե՞ք հաշիվ',
    },
    movies: {
      featured: 'Ընտրված',
      trending: 'Ժողովրդականություն',
      newReleases: 'Նոր թողարկումներ',
      recommended: 'Առաջարկվող',
      watchNow: 'Դիտել հիմա',
      details: 'Մանրամասներ',
      cast: 'Դերասաններ',
      director: 'Ռեժիսոր',
      genre: 'Ժանր',
      releaseDate: 'Թողարկման ամսաթիվ',
      duration: 'Տևողություն',
      rating: 'Վարկանիշ',
    },
    admin: {
      dashboard: 'Կառավարման վահանակ',
      users: 'Օգտատերեր',
      content: 'Բովանդակություն',
      analytics: 'Վերլուծություն',
      security: 'Անվտանգություն',
      settings: 'Կարգավորումներ',
      statistics: 'Վիճակագրություն',
      totalUsers: 'Ընդհանուր օգտատերեր',
      totalMovies: 'Ընդհանուր ֆիլմեր',
    },
  },
};

// Create context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (category: keyof TranslationKeys, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (category: keyof TranslationKeys, key: string): string => {
    try {
      const text = translations[language][category][key];
      return text || key;
    } catch (error) {
      console.error(`Translation missing for [${language}][${category}][${key}]`);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Create hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}