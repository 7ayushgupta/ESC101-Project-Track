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
MAGIC = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
MAX_CLIENTS = 100
BUFFER_SIZE = 4096

server_socket = socket.socket()


def try_handshake(handshake):
  final_line = ""
  lines = handshake.splitlines()
  for line in lines:
      parts = line.partition(": ")
      if parts[0] == "Sec-WebSocket-Key":
          key = parts[2]
  accept_key = base64.b64encode(hashlib.sha1(key+MAGIC).digest())
  return (
    "HTTP/1.1 101 Switching Protocols\r\n"
    "Upgrade: WebSocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Accept: " + accept_key + "\r\n\r\n")

def handle(server_socket, addr):
  
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

  print 'Client closed:', addr
  lock.acquire()
  clients.remove(server_socket)
  lock.release()
  server_socket.close()



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
    print 'NEW CONNECTION ['+str(len(clients))+'], connected by ', addr
    clients.append(conn)
    threading.Thread(target = handle, args = (conn, addr)).start()

  
clients = []
start_server()

