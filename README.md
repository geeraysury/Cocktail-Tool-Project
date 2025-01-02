This project is a web-based cocktail dictionary website built with Node.js, Express, and Axios. Users can search for cocktails by name, alcohol type, first letter, or even randomize their selection. The website fetches data from TheCocktailDB API and allows users to view detailed information about cocktails, including ingredients, preparation instructions, and more.

Objective:
The goal of this project is to create a user-friendly interface where users can:
* Search cocktails by name and get recipes.
* Search alcohol types and view descriptions.
* Get a random cocktail recipe.
* Filter and sort cocktails.

Algorithm Overview:
1. The app fetches available categories, alcohol types, and glass types from TheCocktailDB API during startup.
This data is then used to create filters that users can apply to their search results.
2. Users can submit a search query via the web interface, which sends a request to the respective API endpoint.
If searching by cocktail name, the app fetches detailed information (ingredients, instructions, and image) and displays it.
3. When searching by first letter, users can apply filters like alcohol content or glass type.
Users can also sort the results by the number of ingredients or instructions, or alphabetically by name.
4. Once a search is completed, the app dynamically renders the results on the page, using EJS to handle the presentation logic.

How to Run the Project:
1. To install npm, use this code at the terminal in the project directory:
npm i 
2. To start server, use this code:
node index.js
3. Search on your browser:
http://localhost:3000

How to Use the Website:
1. Sign up using any username and password you would like
2. Log in using the username and password you inputted, and you will be directed to the homepage
3. Input values based on the input title on the boxes, or click the "Random Cocktail" button to get a random cocktail recipe.
4. You can combine the different filters, and add the sort together with the filter(s), for the first letter input.

