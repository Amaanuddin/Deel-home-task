This project contains a monorepo setup with a React frontend (client) and a Node.js/Express backend (server). The frontend communicates with the backend using RESTful APIs.

## Project Structure
my-project/
  ├── client/       # React frontend
  ├── server/       # Node.js/Express backend
  ├── package.json  # Root package.json for running both client and server
  ├── README.md 

## Prerequisites
[https://nodejs.org/en/](Node.js) (Recommended: LTS version)
[https://www.npmjs.com/](npm) (Node package manager)

## Setup Instructions

**Step 1:** Clone the Repository

**Step 2:** Install Dependencies
Install the root dependencies and the dependencies for both the client and server:

`npm install
cd client && npm install
cd ../server && npm install
cd ..`

**Step 3:** Running the Application
To run both the client and server concurrently, use the following command:

`npm run dev`

This will start:

The Express server on http://localhost:3010
The React development server on http://localhost:3000

## Available Scripts
In the project root directory, you can run:

`npm run client`

Runs the React frontend in development mode.<br>
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

`npm run server`

Runs the Node.js/Express backend server.

`npm run dev`

Runs both the client and server concurrently.

## API Endpoints
The backend server exposes several API endpoints:

**GET /contracts/:id**
- Returns the contract by id.
**GET /contracts**
 - Returns a list of contracts belonging to a user (client or contractor), excluding terminated contracts.
**GET /jobs/unpaid**
 - Returns all unpaid jobs for a user (either a client or contractor), for active contracts only.
**POST /jobs/:id/pay** 
- Pays for a job if the client’s balance is sufficient.
**POST /balances/deposit/**
- Deposits money into the client’s balance, with constraints.
**GET /admin/best-profession?start=<date>&end=<date>**
 - Returns the profession that earned the most money in the specified time range.
**GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>**
 - Returns the clients who paid the most in the specified time range.

## CORS
CORS is enabled on the server to allow the frontend to communicate with the backend. The configuration can be found in server/app.js.

## Contributing
Feel free to submit issues and pull requests for any improvements or fixes.

## License
This project is licensed under the MIT License.