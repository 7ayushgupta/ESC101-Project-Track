## Websockets

Web sockets are defined as a two-way communication between the servers and the clients, which mean both the parties, communicate and exchange data at the same time. This protocol defines a full duplex communication from the ground up. Web sockets take a step forward in bringing desktop rich functionalities to the web browsers. It represents an evolution, which was awaited for a long time in client/server web technology.

Before diving to the need of Web sockets, it is necessary to have a look at the existing techniques, which are used for duplex communication between the server and the client. They are as follows −

    Polling
    Long Polling
    Streaming
    Postback and AJAX
    HTML5

#### Polling
Polling can be defined as a method, which performs periodic requests regardless of the data that exists in the transmission. The periodic requests are sent in a synchronous way. The client makes a periodic request in a specified time interval to the Server. The response of the server includes available data or some warning message in it.

#### Long Polling
Long polling, as the name suggests, includes similar technique like polling. The client and the server keep the connection active until some data is fetched or timeout occurs. If the connection is lost due to some reasons, the client can start over and perform sequential request.
Long polling is nothing but performance improvement over polling process, but constant requests may slow down the process.

#### Streaming
It is considered as the best option for real-time data transmission. The server keeps the connection open and active with the client until and unless the required data is being fetched. In this case, the connection is said to be open indefinitely. Streaming includes HTTP headers which increases the file size, increasing delay. This can be considered as a major drawback.

#### AJAX
AJAX is based on Javascript's XmlHttpRequest Object. It is an abbreviated form of Asynchronous Javascript and XML. XmlHttpRequest Object allows execution of the Javascript without reloading the complete web page. AJAX sends and receives only a portion of the web page.

The major drawbacks of AJAX in comparison with Web Sockets are −

    They send HTTP headers, which makes total size larger.
    The communication is half-duplex.
    The web server consumes more resources.

#### HTML5
HTML5 is a robust framework for developing and designing web applications. The main pillars include Mark-up, CSS3 and Javascript APIs together.

#### Why Do We Need Web Sockets?

Internet was conceived to be a collection of Hypertext Mark-up Language (HTML) pages linking one another to form a conceptual web of information. During the course of time, static resources increased in number and richer items, such as images and began to be a part of the web fabric. Server technologies advanced which allowed dynamic server pages - pages whose content was generated based on a query. Soon, the requirement to have more dynamic web pages lead to the availability of Dynamic Hypertext Mark-up Language (DHTML). All thanks to JavaScript. Over the following years, we saw cross frame communication in an attempt to avoid page reloads followed by HTTP Polling within frames. However, none of these solutions offered a truly standardized cross browser solution to real-time bi-directional communication between a server and a client.

This gave rise to the need of __Web Sockets Protocol__. It gave rise to full-duplex communication bringing desktop-rich functionality to all web browsers.
