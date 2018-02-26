from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class SimpleEcho(WebSocket):

    def handleMessage(self):
        # echo message back to client
        self.sendMessage(self.data)

    def handleConnected(self):
        print(self.address, 'Connected To Server')

    def handleClose(self):
        print(self.address, 'Closed connection')

server = SimpleWebSocketServer('', 8000, SimpleEcho)
server.serveforever()
