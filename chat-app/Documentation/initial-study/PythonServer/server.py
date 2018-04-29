#!/usr/bin/env python
# shebang tells the intrepreter which Python environment to use to execute

# import python libraries to facilitate use
import socket
import threading
import struct
import hashlib 
import base64

# defining global variables 
PORT = 9877
HOST = ""
MAGIC_KEY = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
MAX_CLIENTS = 100
BUFFER_SIZE = 4096

server_socket = socket.socket()

def try_handshake(handshake):
  lines = handshake.splitlines()
  for line in lines:
      parts = line.partition(": ")
      if parts[0] == "Sec-WebSocket-Key":
          key = parts[2]
  accept_key = base64.b64encode(hashlib.sha1(key+MAGIC_KEY).digest())
  return (
    "HTTP/1.1 101 Switching Protocols\r\n"
    "Upgrade: WebSocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Accept: " + accept_key + "\r\n\r\n")

def handle(server_socket, addr):
  # the initial client request data recieved from the client when it opens up a socket connection
  data = server_socket.recv(BUFFER_SIZE)
  response = try_handshake(data)
  server_socket.sendto(response, addr)
  lock = threading.Lock()

  while 1:
    print "Waiting for data from", addr
    data = server_socket.recv(BUFFER_SIZE)
    print "Done"
    if not data:
        print "No data"
        break
    print 'Data from', addr, ':', data
    broadcast(data,addr)

  print 'Client closed:', addr
  lock.acquire()
  clients_list.remove([server_socket,addr])
  lock.release()
  server_socket.close()

def broadcast(message, connection):
    for i in range(0,len(clients_list)):
        if clients_list[i][1]!=connection:
            try:
                print 'Sending to' + str(clients_list[i][1])
                clients_list[i][0].send(message)
            except:
                clients_list[i][0].close()
                 # if the link is broken, we remove the client

def start_server():

  #creating a websocket connection
  server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
  
  # handling whether the HOST, port are user inputs or automatic
  global HOST, PORT
  HOST_input = raw_input("Enter HOST/IP [optional]:");
  PORT_input = raw_input("Enter PORT to use [optional]:");
  try:
    server_socket.bind((HOST_input,PORT_input))
    HOST = HOST_input
    PORT = PORT_input
  except:
    server_socket.bind((HOST,PORT))
  
  print 'STARTING SERVER...'

  server_socket.listen(MAX_CLIENTS)

  print 'SERVER STARTED'

  while 1:
    conn, addr = server_socket.accept()
    print 'NEW CONNECTION ['+str(len(clients_list))+'], connected by ', addr
    clients_list.append([conn,addr])
    threading.Thread(target = handle, args = (conn, addr)).start()

  
clients_list = []
start_server()

