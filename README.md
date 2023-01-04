# Crypto Website Backend

\*\* This document is a work in progress

## Contents

1. MVC Design
2. API
3. DAOs (Data Access Objects) --(To be added)
4. Routing --(To be added)
5. Database --(To be added)
6. Utilities --(To be added)
7. Testing --(To be added)

## MVC Design

This backend server is an adaptation of the Model View Controller design, such that the controller(s) handles
incoming requests through the REST API, it then passes those requests up to the model(s), which then gets
data from the MongoDB Database (when necessary), and hands the manipulated data back down to the controller
to be sent to the client. This data would typically be sent to the View to be configured for client display,
but because the front end of this application is designed to utilize client side rendering, rather than server
side rendering, the data that the front end needs is provided to it, and it handles the rest.

## API

The API is currently very simple and handles basic POST, GET, PUT, and DELETE requests. All requests are
currently available for cryptocurrency objects as follows:

- Posting new cryptos
- Getting the count of all crypto objects
- Getting 'x' cryptos through paging
- Getting, updating, and deleting cryptos by their id

Similarly, cryptocurrency metadata can also utilize POST and PUT currently, with more functionality to be
added moving forward.
