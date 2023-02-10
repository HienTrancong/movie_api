
const express = require('express'),
  morgan = require('morgan');

const app = express();

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
      Name: "Inon Shampanier", Bio: "Known For. Paper Spiders Writer (2020) · The Millionaire Tour Writer (2012",
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
      Bio: "Pedro Mercedes Almodóvar Caballero is a Spanish film director, screenwriter, producer, and former actor. His films are marked by melodrama, irreverent humour, bold colour, glossy décor, quotations from popular culture, and complex narratives.", Birth: "1949",
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
      Birth: "1974",
      Death: null
    },
    ImagePath: "https://www.cinemaclock.com/images/posters/1000x1500/19/quo-vadis-aida-2020-i-movie-poster.jpg",
    Featured: false
  }
];

//Middleware
app.use(express.static('public'));
app.use(morgan('common'));


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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

