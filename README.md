This is a web-based cocktail dictionary built with Node.js, Express, and Axios, using data from TheCocktailDB API. Users can search for cocktails, get random drink ideas, view ingredients and instructions, and save their favorites. User login and data storage are handled using PostgreSQL.

**Project Goal**
Create a fun, user-friendly cocktail search tool where users can:
- Search cocktails by name, alcohol type, or first letter
- Get a random cocktail
- Filter and sort drinks by alcohol level, glass type, or category
- Sign up / log in securely using PostgreSQL, and save their favorites cocktail

**Main Features**
- Cocktail Search – Search by name or letter and view full recipes
- Alcohol Lookup – Search alcohols and view descriptions
- Random Drink Generator – Get a surprise cocktail suggestion
- Filtering & Sorting – Filter by alcohol level or glass type; sort alphabetically or by recipe length
- User Auth – Sign up, log in, and store data securely in PostgreSQL

**Simplified Algorithm**
1. Users enter a search → the app sends a request to TheCocktailDB API
2. The response includes drink details (ingredients, instructions, image)
3. Users can sort and filter results or randomize their search
4. Signups and logins are handled via SQL (PostgreSQL)
5. Logged-in users can explore all features and save favorite drinks
6. Everything is rendered with EJS for a clean UI

**How to Run the Project:**
1. Open your terminal and navigate to the directory where you want to store the project. Then run: git clone https://github.com/geeraysury/CocktailDictionary-Website.git
2. Navigate into the project folder: cd CocktailDictionary-Website
3. To install npm, use this code at the terminal in the project directory:
npm i
4. Make sure Docker Desktop is installed and running. Then in terminal type:
docker-compose up --build
5. Once running, type:
docker exec -it cocktail_api_db psql -U postgres -d cocktail_api_project
Then in the shell, type:
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  drink_name VARCHAR(255) NOT NULL,
  image TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT
);

6. Search on your browser:
http://localhost:3000

**How to Use the Website:**
1. Sign up using any username and password you would like
2. Log in using the username and password you inputted, and you will be redirected to the homepage
3. Input values based on the input title on the boxes, or click the "Random Cocktail" button to get a random cocktail recipe.
4. When searching by the first letter, combine different filters (alcohol content, category, glass type) and sorting options for tailored results.
