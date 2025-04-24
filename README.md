This project is a web-based cocktail dictionary website built with Node.js, Express, and Axios. Users can search for cocktails by name, alcohol type, first letter, or even randomize their selection. The website fetches data from TheCocktailDB API and allows users to view detailed information about cocktails, including ingredients, preparation instructions, and more.

Objective:
The goal of this project is to create a user-friendly interface where users can:
* Search cocktails by name and get recipes.
* Search alcohol types and view descriptions.
* Get a random cocktail recipe.
* Filter and sort cocktails.
* Sign up and log in securely using SQL for user authentication.

Features:
* Search Cocktails: Users can search for cocktails by name or first letter and receive detailed recipes.
* Random Selection: Users can randomize their cocktail search for surprise results.
* Filtering and Sorting: Users can filter results by alcohol content, category, or glass type and sort them alphabetically or by ingredients/instructions.
* User Authentication: Users can sign up and log in securely using their credentials, which are stored in a PostgreSQL database.
* Direct to Homepage: After logging in, users are redirected to the homepage where they can begin their searches.

Algorithm Overview:
1.  Users can submit a search query via the web interface, which sends a request to the respective API endpoint. If searching by cocktail name, the app fetches detailed information (ingredients, instructions, and image) and displays it.
2. When searching by first letter, users can apply filters like alcohol content or glass type. Users can also sort the results by the number of ingredients or instructions, or alphabetically by name.
3. SQL-based user authentication allows users to securely sign up and log in, with their credentials stored in a PostgreSQL database.
4. Once logged in, users are directed to the homepage, where they can explore the cocktail dictionary and utilize all available features.
5. The app dynamically renders results on the page, using EJS to handle the presentation logic.

How to Run the Project:
1. Open your terminal and navigate to the directory where you want to store the project. Then run: git clone https://github.com/geeraysury/Cocktail-Tool-Project.git
2. Navigate into the project folder: cd your-repo-name
3. To install npm, use this code at the terminal in the project directory:
npm i 
4. To start server, use this code:
node index.js
5. Search on your browser:
http://localhost:3000

How to Use the Website:
1. Sign up using any username and password you would like
2. Log in using the username and password you inputted, and you will be redirected to the homepage
3. Input values based on the input title on the boxes, or click the "Random Cocktail" button to get a random cocktail recipe.
4. When searching by the first letter, combine different filters (alcohol content, category, glass type) and sorting options for tailored results.

