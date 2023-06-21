
const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  uuid = require('uuid');

const app = express();

//parse json to js object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Require mongoose package and models
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//require authen logic, app to ensure Express is available in auth.js
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//Allow mongoose to connect to the database for CRUD
mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });



let users = [
  { _id: "1", Username: "Kevin Guevara", Email: "Kevin.Guevara@gmail.com", Birthday: 1985, FavoriteMovies: [] },
  { _id: "2", Username: "Mercedes Patrick", Email: "Mercedes.Patrick@hotmail.com", Birthday: 1997, FavoriteMovies: [] },
  { _id: "3", Username: "Katharine Deleon", Email: "Katharine.Deleon@yahoo.com", Birthday: 1989, FavoriteMovies: [] }
  // { _id: { $oid: "61db360bff9ee903a9bf9b10" }, Username: "Katharine Deleon", "Password": "x34vbJ", "Email": "Katharine.Deleon@yahoo.com", Birthday: { $date: "1989-09-15T00:00:00Z" }, FavoriteMovies: [] },
  // { _id: { $oid: "61db4fefbcdbdda698333b4b" }, Username: "Colby Lindsay", "Password": "EMKYfc", "Email": "Colby.Lindsay@hotmail.com", Birthday: { $date: "1977-01-05T00:00:00Z" }, FavoriteMovies: [] },
  // { _id: { $oid: "61fe07a263f4d6bbaa200bcd" }, Username: "test", "Password": "testpass", "Email": "test@hotmail.com", Birthday: { $date: "2000-05-01T00:00:00Z" }, FavoriteMovies: [] }
];

let topMovies = [
  {
    _id: { $oid: '61db1a498a86b50b628b9d3e' },
    Title: "Paper Spiders",
    Description: "Faced with impending solitude as her daughter prepares to leave for college, a widow's slow descent into paranoia threatens to mar her relationships.",
    Genre: {
      Name: "Drama",
      Description: "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy)."
    },
    Director: {
      Name: "Inon Shampanier",
      Bio: "Known For. Paper Spiders Writer (2020) · The Millionaire Tour Writer (2012",
      Birth: null,
      Death: null
    },
    ImagePath: "https://www.cinemaclock.com/images/posters/1000x1500/28/paper-spiders-2020-us-poster.jpg",
    Featured: false
  },
  {
    _id: { $oid: "61db19828a86b50b628b9d3a" },
    Title: "Parallel Mothers",
    Description: "Two single women meet in a hospital room where they are both going to give birth. One is middle aged and doesn't regret it, while the other is adolescent and scared. The two women form a strong bond with one another as they both confront motherhood.",
    Genre: {
      Name: "Drama",
      Description: "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy)."
    },
    Director: {
      Name: "Pedro Almodóvar",
      Bio: "Pedro Mercedes Almodóvar Caballero is a Spanish film director, screenwriter, producer, and former actor. His films are marked by melodrama, irreverent humour, bold colour, glossy décor, quotations from popular culture, and complex narratives.", Birth: 1949,
      Death: null
    },
    ImagePath: "https://www.cinemaclock.com/images/posters/1000x1500/39/parallel-mothers-2021-poster.jpg",
    Featured: false
  },
  {
    _id: {
      $oid: "61db17688a86b50b628b9d37"
    },
    Title: "Quo Vadis, Aida",
    Description: "During the Srebrenica massacre, Aida, an English teacher and translator, strives to save her husband and children from the invading Serbian forces by taking refuge in a United Nations camp.",
    Genre: {
      Name: "War",
      Description: "War film is a film genre concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama. It has been strongly associated with the 20th century."
    },
    Director: {
      Name: "Jasmila Zbanic",
      Bio: "Jasmila Žbanić is a Bosnian film director, screenwriter and producer, best known for having written and directed Quo Vadis, Aida?, which earned her nominations for the Academy Award for Best Foreign Language Film, the BAFTA Award for Best Film Not in the English Language, and the BAFTA Award for Best Direction.Jasmila Zbanic was born on December 19, 1974 in Sarajevo, Bosnia and Herzegovina, Yugoslavia.",
      Birth: 1974,
      Death: null
    },
    ImagePath: "https://www.cinemaclock.com/images/posters/1000x1500/19/quo-vadis-aida-2020-i-movie-poster.jpg",
    Featured: false
  }
];


//Middleware
app.use(express.static('public'));
app.use(morgan('common'));

// GET landing page
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});
// GET API documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});
// GET all movies internal data
// app.get('/movies', (req, res) => {
//   res.status(200).json(topMovies);
// });
// GET all movies external data by mongoose
//add authentication
app.get('/movies', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(400).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
  });

// GET one movie data by title internal data
// app.get('/movies/:title', (req, res) => {
//   const { title } = req.params;
//   const movie = topMovies.find(movie => movie.Title === title);
//   if (movie) {
//     return res.status(200).json(movie);
//   } else {
//     res.status(400).send("No such movie");
//   }
// });
// GET one movie data by title external data by mongoose
app.get('/movies/:title', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.status(400).json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
  });

// GET genre by name
// app.get('/movies/genres/:genreName', (req, res) => {
//   const { genreName } = req.params;
//   const genre = topMovies.find(movie => movie.Genre.Name === genreName).Genre;
//   if (genre) {
//     return res.status(200).json(genre);
//   } else {
//     res.status(400).send("No such genre");
//   }
// });
// GET genre by name external data by mongoose
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
  });


// GET director by name
// app.get('/movies/directors/:directorName', (req, res) => {
//   const { directorName } = req.params;
//   // Access properties of object by dot syntax
//   const director = topMovies.find(movie => movie.Director.Name === directorName).Director;
//   if (director) {
//     return res.status(200).json(director);
//   } else {
//     res.status(400).send("No such director");
//   }
// });
// GET director by name external data by mongoose
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
  });


// GET all users internal data
// app.get('/users', (req, res) => {
//   res.status(200).json(users);
// });
// GET all users external data
app.get('/users', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(400).json(users);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
  });

// GET one user data by id
// app.get('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const user = users.find(user => user._id === id);
//   if (user) {
//     return res.status(200).json(user);
//   } else {
//     res.status(400).send("No such user");
//   }
// });

// GET one user data by name external data by mongoose  
app.get('/users/:userName', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.userName })
      .then((user) => {
        res.status(400).json(user);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
  });

// POST new user internal data
// app.post('/users', (req, res) => {
//   const newUser = req.body;
//   if (newUser.Username) {
//     newUser._id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser)
//   } else {
//     res.status(400).send('users need name');
//   }
// });

//Add a user external database
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exist');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    })
});


// PUT user update info
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;
//   let user = users.find(user => user._id === id);
//   if (user) {
//     user.Username = updatedUser.Username;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// Update user info mongoose external data
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// DELETE user
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;
//   let user = users.find(user => user._id == id);
//   if (user) {
//     users = users.filter(user => user._id != id);
//     res.status(200).send(`User ${id} has been deleted`);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// DELETE user by username mongoose external data
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' is not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted');
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error:' + error);
      })
  });

// // POST movie to favorite list
// app.post('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;
//   let user = users.find(user => user._id == id);
//   if (user) {
//     user.FavoriteMovies.push(movieTitle);
//     res.status(200).send(`Movie ${movieTitle} has been add to user ${id} array`);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// Add a movie by ID to a user's list of favorites by mongoose
app.post('/users/:Username/movies/:MovieId', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $addToSet: {
        FavoriteMovies: req.params.MovieId
      }
    },
      { new: true },
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// DELETE movie from favorite list
// app.delete('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find(user => user._id == id);
//   if (user) {
//     user.FavoriteMovies = user.FavoriteMovies.filter(title => title !== movieTitle);
//     res.status(200).send(`Movie ${movieTitle} has been remove from user ${id} array`);
//   } else {
//     res.status(400).send('no such user');
//   }
// });

// Remove a movie by ID to a user's list of favorites by mongoose
app.delete('/users/:Username/movies/:MovieId', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $pull: {
        FavoriteMovies: req.params.MovieId
      }
    },
      { new: true },
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oh oh, something went wrong. Please try again later.");
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

