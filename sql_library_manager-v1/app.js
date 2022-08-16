const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'library.db'
});



(async () => {
    try {
      await sequelize.authenticate();

      console.log('Connection to the database successful!');
    } catch (error) {
      console.error('Error connecting to the database: ', error);
    }
  })();

  class Book extends Sequelize.Model {}
Book.init({
  title: Sequelize.STRING,
}, { sequelize });

(async () => {
  // Sync 'Books' table
  await Book.sync();

  try {

  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// app.set('view engine', 'pug')