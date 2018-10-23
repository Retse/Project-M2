const data = [
  {
    title: 'Ruta Montserrat',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/2012_Montserrat.jpg/245px-2012_Montserrat.jpg',
    guide: [],
    date: '01/12/2018',
    location: {
      city: 'Barcelona',
      region: 'Catalunya',
      country: 'Spain'
    },
    startinPoint: 'Monistrol de Montserrat',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque sapien litora, donec purus magnis taciti a lobortis himenaeos aenean sociis, et sagittis curae suspendisse nibh quis penatibus ullamcorper montes. Donec vestibulum cursus nec purus gravida ligula ad laoreet a, nullam fusce quisque ornare venenatis nunc vitae mattis accumsan, semper sociis convallis aptent diam luctus ac habitasse. Urna rutrum dictumst eros in vivamus pellentesque etiam nullam, ligula lobortis hendrerit egestas vulputate parturient non cras cubilia, scelerisque nibh netus integer gravida primis justo.',
    participants: [],
    difficultyLevel: ['medium'],
    duration: 100,
    distance: 3.5
  },
  {
    title: 'Ruta Vall de Núria',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/2012_Montserrat.jpg/245px-2012_Montserrat.jpg',
    guide: [],
    date: '10/12/2018',
    location: {
      city: 'Girona',
      region: 'Catalunya',
      country: 'Spain'
    },
    startinPoint: 'Queralbs',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque sapien litora, donec purus magnis taciti a lobortis himenaeos aenean sociis, et sagittis curae suspendisse nibh quis penatibus ullamcorper montes. Donec vestibulum cursus nec purus gravida ligula ad laoreet a, nullam fusce quisque ornare venenatis nunc vitae mattis accumsan, semper sociis convallis aptent diam luctus ac habitasse. Urna rutrum dictumst eros in vivamus pellentesque etiam nullam, ligula lobortis hendrerit egestas vulputate parturient non cras cubilia, scelerisque nibh netus integer gravida primis justo.',
    participants: [],
    difficultyLevel: ['medium'],
    duration: 90,
    distance: 4
  }
];

const mongoose = require('mongoose');
const Event = require('../models/event');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

Event.insertMany(data)
  .then(() => {
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('error', error);
  });
