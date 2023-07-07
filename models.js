const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // to hash and compare password

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Number,
    Death: Number
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

//create custom static method mongoose, not using any user instance
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

//create method, using user instance in this.Password
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password); //by regular function this refer to user, not userSchema.methods like arrow function
}


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;






