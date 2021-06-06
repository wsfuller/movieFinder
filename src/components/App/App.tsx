import React, { useEffect } from 'react';
import { batch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { Stack, ThemeProvider } from '@fluentui/react';

import useAppStyles from './App.styles';
import { darkTheme, lightTheme } from './themes';
import { getNowPlayingMovies, getPopularMovies, getUpcomingMovies } from '../../redux/movies/moviesActions';
import AppBar from '../AppBar';
import AppFooter from '../AppFooter';
import Section from '../Section';
import MoviesCarousel from '../MoviesCarousel';

import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { sortMoviesBy, SortMoviesBy } from '../../utils/helpers';

const App: React.FC = () => {
  const classes = useAppStyles();
  const appDispatch = useAppDispatch();
  const {
    appTheme: { isDarkMode },
    movies: { nowPlaying, popular, upcoming },
  } = useAppSelector((state) => state);
  const appTheme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    batch(() => {
      appDispatch(getNowPlayingMovies());
      appDispatch(getPopularMovies());
      appDispatch(getUpcomingMovies());
    });
  }, [appDispatch]);

  let nowPlayingMovies = null;
  let popularMovies = null;
  let upcomingMovies = null;
  const hasNowPlayingMovies = !isEmpty(nowPlaying.data);
  const hasPopularMovies = !isEmpty(popular.data);
  const hasUpcomingMovies = !isEmpty(upcoming.data);

  if (nowPlaying.isLoading) {
    nowPlayingMovies = 'LOADING';
  } else if (nowPlaying.error) {
    nowPlayingMovies = 'ERROR';
  } else if (!nowPlaying.isLoading && hasNowPlayingMovies) {
    const sortedNowPlayingMovies = sortMoviesBy(
      {
        key: SortMoviesBy.ReleaseDate,
        direction: 'ascending',
      },
      nowPlaying.data.results
    );
    nowPlayingMovies = (
      <Section title="Now Playing">
        <MoviesCarousel movies={sortedNowPlayingMovies} />
      </Section>
    );
  } else if (!nowPlaying.isLoading && !hasNowPlayingMovies) {
    nowPlayingMovies = 'NOW PLAYING EMPTY';
  }

  if (popular.isLoading) {
    popularMovies = 'LOADING';
  } else if (popular.error) {
    popularMovies = 'ERROR';
  } else if (!popular.isLoading && hasPopularMovies) {
    const sortedPopularMovies = sortMoviesBy(
      {
        key: SortMoviesBy.VoteAverage,
        direction: 'descending',
      },
      popular.data.results
    );

    popularMovies = (
      <Section title="Popular Movies">
        <MoviesCarousel movies={sortedPopularMovies} />
      </Section>
    );
  } else if (!popular.isLoading && !hasPopularMovies) {
    popularMovies = 'POPULAR MOVIES EMPTY';
  }

  if (upcoming.isLoading) {
    upcomingMovies = 'LOADING';
  } else if (upcoming.error) {
    upcomingMovies = 'ERROR';
  } else if (!upcoming.isLoading && hasUpcomingMovies) {
    const sortedUpcomingMovies = sortMoviesBy(
      {
        key: SortMoviesBy.VoteAverage,
        direction: 'descending',
      },
      upcoming.data.results
    );
    upcomingMovies = (
      <Section title="Upcoming Movies">
        <MoviesCarousel movies={sortedUpcomingMovies} />
      </Section>
    );
  } else if (!upcoming.isLoading && !hasUpcomingMovies) {
    upcomingMovies = 'UPCOMING MOVIES EMPTY';
  }

  return (
    <ThemeProvider applyTo="body" theme={appTheme} className={classes.root}>
      <Stack verticalAlign="space-between" className={classes.root}>
        <Stack.Item>
          <AppBar />
        </Stack.Item>
        <main className={classes.contentContainer}>
          <Stack.Item>{nowPlayingMovies}</Stack.Item>
          <Stack.Item>{upcomingMovies}</Stack.Item>
          <Stack.Item>{popularMovies}</Stack.Item>
        </main>
        <Stack.Item>
          <AppFooter />
        </Stack.Item>
      </Stack>
    </ThemeProvider>
  );
};

export default App;
