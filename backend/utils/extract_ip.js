const extractIp = (socket)=>{
    const ipCloudfare = socket.handshake.headers["cf-connecting-ip"];

    const forwaded = socket.handshake.headers["x-forwarded-for"];

    const ipAddr = ipCloudfare || (forwaded ? forwaded.split(",")[0].trim() : socket.handshake.address);

    return ipAddr;
}

module.exports = extractIp;