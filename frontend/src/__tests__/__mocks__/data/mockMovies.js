export const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/movie1.jpg",
    overview: "Two imprisoned men bond over a number of years...",
    release_date: "1994-09-23",
    vote_average: 9.3,
    vote_count: 2500000,
    genre_ids: [18, 80]
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/movie2.jpg",
    overview: "The aging patriarch of an organized crime dynasty...",
    release_date: "1972-03-24",
    vote_average: 9.2,
    vote_count: 1800000,
    genre_ids: [18, 80]
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/movie3.jpg",
    overview: "When the menace known as the Joker wreaks havoc...",
    release_date: "2008-07-18",
    vote_average: 9.0,
    vote_count: 2600000,
    genre_ids: [28, 80, 18]
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster_path: "/movie4.jpg",
    overview: "The lives of two mob hitmen, a boxer, a gangster...",
    release_date: "1994-10-14",
    vote_average: 8.9,
    vote_count: 2000000,
    genre_ids: [80, 18]
  },
  {
    id: 5,
    title: "Forrest Gump",
    poster_path: "/movie5.jpg",
    overview: "The presidencies of Kennedy and Johnson...",
    release_date: "1994-07-06",
    vote_average: 8.8,
    vote_count: 2100000,
    genre_ids: [18, 10749]
  }
];

export const mockMovieDetails = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/movie1.jpg",
    backdrop_path: "/backdrop1.jpg",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    release_date: "1994-09-23",
    runtime: 142,
    vote_average: 9.3,
    vote_count: 2500000,
    budget: 25000000,
    revenue: 16000000,
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ],
    production_companies: [
      { id: 1, name: "Castle Rock Entertainment", logo_path: "/company1.png" }
    ],
    spoken_languages: [
      { iso_639_1: "en", name: "English" }
    ],
    credits: {
      cast: [
        {
          id: 1,
          name: "Tim Robbins",
          character: "Andy Dufresne",
          profile_path: "/actor1.jpg"
        },
        {
          id: 2,
          name: "Morgan Freeman",
          character: "Ellis Boyd 'Red' Redding",
          profile_path: "/actor2.jpg"
        }
      ],
      crew: [
        {
          id: 3,
          name: "Frank Darabont",
          job: "Director",
          profile_path: "/director1.jpg"
        }
      ]
    }
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/movie2.jpg",
    backdrop_path: "/backdrop2.jpg",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    release_date: "1972-03-24",
    runtime: 175,
    vote_average: 9.2,
    vote_count: 1800000,
    budget: 6000000,
    revenue: 246120974,
    tagline: "An offer you can't refuse.",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ],
    production_companies: [
      { id: 2, name: "Paramount Pictures", logo_path: "/company2.png" }
    ],
    spoken_languages: [
      { iso_639_1: "en", name: "English" }
    ],
    credits: {
      cast: [
        {
          id: 4,
          name: "Marlon Brando",
          character: "Don Vito Corleone",
          profile_path: "/actor3.jpg"
        },
        {
          id: 5,
          name: "Al Pacino",
          character: "Michael Corleone",
          profile_path: "/actor4.jpg"
        }
      ],
      crew: [
        {
          id: 6,
          name: "Francis Ford Coppola",
          job: "Director",
          profile_path: "/director2.jpg"
        }
      ]
    }
  }
];
