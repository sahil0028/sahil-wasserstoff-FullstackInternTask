const express = require('express');
const app = express();
const port = 3000;
const db = require('./server/config/db');
const router = require('./server/router/router');
const cors = require('cors')

db()

app.use(express.static(__dirname + '/public/'));

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/server',router)

require('./server/config/seed')
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(port, () => {
  console.log(`BM backend listening at http://localhost:${port}`);
});

// webserver for realtime bidding
const io = require('socket.io')(server, {
  pingTimeOut: 60000,
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log('user joined', userData._id);
    socket.emit('connected');
  });
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user joined room', room);
  });
  socket.on('new message',(newMessageReceived)=>{
    let participants = newMessageReceived.participants;
    if(!participants){ return console.log('no participants')}
    // console.log('new message',newMessageReceived)
    // console.log('participants',participants)
    participants.forEach(user => {
      if(user === newMessageReceived.userData._id) {
        return;
      }
      // console.log('participants user-',user)
      socket.in(newMessageReceived.aucData._id).emit('message received', newMessageReceived);
    });

  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


