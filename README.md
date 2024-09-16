# Auctions Web Application
The Auctions Web Application aims to create a platform where users can bid on items in various categories, 
view details of auctioned items, and manage their own bids. The main focus of the project was to implement
an intuitive user interface and a robust backend capable of handling real-time bidding operations and user interactions efficiently.

## Server
### Installation

1. Navigate to the server directory
2. Run ***npm install*** to install dependencies.
3. Set up the .env file 
    - PORT=5000
    - MONGO_URI=your db connection url
    - SECRET_KEY=your_api_key_here
    - CLIENT_ORIGIN=http://localhost:3000 
4. Run ***npm run dev*** and head over to localhost:5000

## Client
### Installation

1. Navigate to client directory
2. Run ***npm install*** to install dependencies
3. Set up the .env.local file 
    - NEXT_PUBLIC_API_URL=http://localhost:5000
4. Run ***npm run dev*** and head over to localhost:3000

## Technologies used
1. Node.js
2. Express.js
3. Next.js
4. MongoDB
5. JavaScript
6. MaterialUi & Bootstrap
