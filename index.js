require ("dotenv").config()


///> Server declaration and CORS
const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require ("socket.io")(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["*"]
    }
  });
const cors = require ("cors")
const corsOptions = {
    origin: [
      'http://localhost:3000',
    ]
  }
app.use(cors(corsOptions))
const port = process.env.PORT

///> info salas

const rooms = {
  Selection:{
    players:0,
},
  A:{
    turn:"X",
    players:0,
},
  B:{
  turn:"X",
  players:0,
},
  C:{
  turn:"X",
  players:0,
},
  D:{
    turn:"X",
    players:0,
},
  E:{
  turn:"X",
  players:0,
},
    F:{
  turn:"X",
  players:0,
},
}





///> Sockets listener
io.on("connection",(socket)=>{
  ///> realize connection
  console.log(`Connected: ${socket.id}`);
  

  ///> realize disconnection
  socket.on('disconnect', () =>{
    console.log(`Disconnected: ${socket.id}`)
    socket.emit('change', rooms);

  }
  );

  socket.on('leave', (room) =>{
    rooms[room].players--
    console.log("Room " + room + " have " + rooms[room].players + " users")
    if(room!=="Selection"){
      console.log(room)
      io.to(room).emit('all-leave');
      io.of().in(room).disconnectSockets();
      rooms[room].players=0;

    }
    socket.emit('change', rooms);
  }
  );

  ///> Join a room
  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  //   io.to(room).emit('play', [
  //     null, null,null,
  //     null, null,null,
  //     null, null,null,
  // ]);
    console.log(room)
    rooms[room].players++
    console.log("Room " + room + " have " + rooms[room].players + " users")
    io.to("Selection").emit('change', rooms);

 });

  ///> game manager
 socket.on('play', (data) => {
  const { squares, room } = data;
  console.log(`squares: ${squares}, room: ${room}`);
  io.to(room).emit('play', squares);
});

socket.on('reset', (room) => {
  console.log(`reseted`);
  io.to(room).emit('reset');
});


})



///> routes
app.get("/",( req , res )=>{
    res.send("Im alive :P")
})

app.get("/rooms",( req , res )=>{
  res.send(rooms)
})
app.get("/1",( req , res )=>{
  res.send("Im alive part 3 :P")
})
/// Server listener
server.listen(port || 8080, ()=>{
    console.log("listening at *: " + (port || 8080) )
})

