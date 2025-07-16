export const mockSeries = [
  {
    id: 1,
    name: "Breaking Bad",
    poster_path: "/series1.jpg",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer...",
    first_air_date: "2008-01-20",
    vote_average: 9.5,
    vote_count: 1500000,
    genre_ids: [18, 80]
  },
  {
    id: 2,
    name: "Game of Thrones",
    poster_path: "/series2.jpg",
    overview: "Seven noble families fight for control of the mythical land of Westeros...",
    first_air_date: "2011-04-17",
    vote_average: 9.2,
    vote_count: 2000000,
    genre_ids: [18, 10765, 10759]
  },
  {
    id: 3,
    name: "The Sopranos",
    poster_path: "/series3.jpg",
    overview: "New Jersey mob boss Tony Soprano deals with personal and professional issues...",
    first_air_date: "1999-01-10",
    vote_average: 9.2,
    vote_count: 800000,
    genre_ids: [18, 80]
  },
  {
    id: 4,
    name: "The Wire",
    poster_path: "/series4.jpg",
    overview: "The Baltimore drug scene, seen through the eyes of drug dealers and law enforcement...",
    first_air_date: "2002-06-02",
    vote_average: 9.3,
    vote_count: 600000,
    genre_ids: [18, 80]
  },
  {
    id: 5,
    name: "Friends",
    poster_path: "/series5.jpg",
    overview: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends...",
    first_air_date: "1994-09-22",
    vote_average: 8.9,
    vote_count: 1200000,
    genre_ids: [35, 18]
  }
];

export const mockSeriesDetails = [
    {
        id: 1,
        name: "Breaking Bad",
        poster_path: "/series1.jpg",
        backdrop_path: "/backdrop_series1.jpg",
        overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        first_air_date: "2008-01-20",
        last_air_date: "2013-09-29",
        number_of_episodes: 62,
        number_of_seasons: 5,
        vote_average: 9.5,
        vote_count: 1500000,
        status: "Ended",
        tagline: "Remember my name",
        genres: [
            { id: 18, name: "Drama" },
            { id: 80, name: "Crime" }
        ],
        created_by: [
            { id: 1, name: "Vince Gilligan", profile_path: "/creator1.jpg" }
        ],
        networks: [
            { id: 1, name: "AMC", logo_path: "/network1.png" }
        ],
        seasons: [
            {
                id: 1,
                season_number: 1,
                episode_count: 7,
                air_date: "2008-01-20",
                poster_path: "/season1.jpg"
            },
            {
                id: 2,
                season_number: 2,
                episode_count: 13,
                air_date: "2009-03-08",
                poster_path: "/season2.jpg"
            },
            {
                id: 3,
                season_number: 3,
                episode_count: 13,
                air_date: "2010-03-21",
                poster_path: "/season3.jpg"
            },
            {
                id: 4,
                season_number: 4,
                episode_count: 13,
                air_date: "2011-07-17",
                poster_path: "/season4.jpg"
            },
            {
                id: 5,
                season_number: 5,
                episode_count: 16,
                air_date: "2012-07-15",
                poster_path: "/season5.jpg"
            }
        ],
        credits: {
            cast: [
                {
                id: 1,
                name: "Bryan Cranston",
                character: "Walter White",
                profile_path: "/actor_series1.jpg"
                },
                {
                id: 2,
                name: "Aaron Paul",
                character: "Jesse Pinkman",
                profile_path: "/actor_series2.jpg"
                }
            ]
        }
    }
];

export const mockSeasonDetails = [
        {
        id: 1,
        series_id: 1,
        season_number: 1,
        name: "Season 1",
        overview: "High school chemistry teacher Walter White's life is suddenly transformed by a dire medical diagnosis.",
        air_date: "2008-01-20",
        episode_count: 7,
        poster_path: "/season1.jpg",
        episodes: [
        {
            id: 1,
            episode_number: 1,
            name: "Pilot",
            overview: "Walter White, a struggling high school chemistry teacher, is diagnosed with advanced lung cancer.",
            air_date: "2008-01-20",
            runtime: 58,
            vote_average: 8.2,
            still_path: "/episode1.jpg"
        },
        {
            id: 2,
            episode_number: 2,
            name: "Cat's in the Bag...",
            overview: "Walt and Jesse attempt to tie up loose ends.",
            air_date: "2008-01-27",
            runtime: 48,
            vote_average: 8.1,
            still_path: "/episode2.jpg"
        },
        {
            id: 3,
            episode_number: 3,
            name: "...And the Bag's in the River",
            overview: "Walt and Jesse clean up after the bathtub incident.",
            air_date: "2008-02-10",
            runtime: 48,
            vote_average: 8.3,
            still_path: "/episode3.jpg"
        }
        ]
    }
];
