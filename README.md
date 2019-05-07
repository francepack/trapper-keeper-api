# Trapper Keeper BackEnd
## Description
This is the backend that supports our application Trapper-keeper found at:<br/>
https://github.com/francepack/trapper-keeper-ui

## How to use
Clone this repository into the same folder that holds trapper-keeper-ui (found at the link above).<br/>
While in the file that will hold both trapper-keeper ui and api, run this command in your terminal to clone this repo:
```
git clone https://github.com/francepack/trapper-keeper-api.git
```

Install all required npm packages by running the following command in your terminal:
```
npm install
```

Start the server with command:
```
npm start
```

Server will be running on port 3001. You can view stored data by typing the following into your browser as a url
```
http://localhost:3001/api/v1/notes
```

## Technologies
This was made using node.js and Express. Testing completed with Jest, Enzyme, and supertest.

## Endpoints
This API covers the following endpoints: to GET all notes, GET a specfic note, POST a note, PUT a note, DELETE a note.
#### GET **api/v1/notes**
Get all notes.
#### GET **api/v1/notes/:id**
Get a specific note.
#### POST **api/v1/notes**
Add a new note.
#### PUT **api/v1/notes/:id**
Edit an existing note.
#### DELETE **api/v1/notes/:id**
Delete a note.

## Contributers
Edgar Munoz [@criteriamor](https://github.com/criteriamor)<br/>
Taylor Sperry [@taylorsperry](https://github.com/taylorsperry)<br/>
Mason France [@francepack](https://github.com/francepack)
