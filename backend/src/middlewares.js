const connectDB = require('../utils/db_connect');

const blacklisting = async (socket, next)=>{
    const client = await connectDB();

    const ipAddress = parseHeader(socket.handshake.headers["forwarded"] || socket.handshake);

    if ()

    const ipAddr = socket.handshake.
    if ()
    
    next();

}