import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pkg;
const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for sessions
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);

// Middleware to restrict access to authenticated users
const restrict = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
};

const db = new Pool({
    host: "localhost",
    user: "postgres",
    password: "iLoveGyubee",
    database: "cocktail_api_project",
    port: 5432,
});
db.connect();

const fetchFilterData = async (endpoint) => {
    const response = await axios.post(`${API_URL}/${endpoint}`);
    return response.data.drinks || null;
};

const filterCategory = await fetchFilterData("list.php?c=list");
const filterAlcohol = await fetchFilterData("list.php?a=list");
const filterGlass = await fetchFilterData("list.php?g=list");

const extractIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push({ ingredient, measure });
        }
    }
    return ingredients;
};

// Helper function to render the page with default values
const renderPage = (res, data = {}) => {
    const defaultData = {
        filterCategory: filterCategory,
        filterAlcohol: filterAlcohol,
        filterGlass: filterGlass,
        error: null,
        drinkName: null,
        ingredients: [],
        instructionsSteps: [],
        image: null,
        alcName: null,
        description: null,
        drinks: [],
        firstLetter: null,
    };
    res.render("index.ejs", { ...defaultData, ...data });
};
const fetchCocktailMiddleware = async (req, res, next) => {
    try {
        const { endpoint, errorMessage, responseKey } = req.fetchOptions;

        const result = await axios.get(`${API_URL}/${endpoint}`);

        // Check if the required responseKey exists and has data
        if (!result.data[responseKey] || result.data[responseKey].length === 0) {
            return renderPage(res, { error: errorMessage });
        }
        req.fetchedData = result.data[responseKey];
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving cocktail data");
    }
};

const sortDrinks = (drinks, keyExtractor, order = "ascending") => {
    return drinks.sort((a, b) => {
        const keyA = keyExtractor(a);
        const keyB = keyExtractor(b);

        if (order === "ascending") {
            return keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
        } else if (order === "descending") {
            return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
        }
        return 0; // No sorting for invalid order
    });
};

const filterDrinks = (drinks, alcoholLevel, category) => {
    if (alcoholLevel) {
        drinks = drinks.filter((drink) => drink.strAlcoholic === alcoholLevel);
    }
    if (category) {
        drinks = drinks.filter((drink) => drink.strCategory === category);
    }
    return drinks;
};

const countIngredients = (drink) => {
    let count = 0;
    for (let key in drink) {
        if (key.includes('strIngredient') && drink[key]) {
            count++;
        }
    }
    return count;
};

const countInstructionSteps = (instructions) => {
    if (!instructions) return 0;
    return instructions.split('.').filter((step) => step.trim() !== "").length;
};

app.get("/", restrict, async (req, res) => {
    renderPage(res, {});
});

// search cocktail by name
app.post("/search-cocktail",
    (req, res, next) => {
        req.fetchOptions = {
            endpoint: `search.php?s=${req.body.cocktailName}`,
            errorMessage: "No cocktails found for this name",
            responseKey: "drinks",
        };
        next();
    },
    fetchCocktailMiddleware,
    (req, res) => {
        const cocktail = req.fetchedData[0];
        const ingredients = extractIngredients(cocktail);
        const instructionsSteps = cocktail.strInstructions.split('.').filter(step => step.trim() !== "");
        renderPage(res, {
            drinkName: cocktail.strDrink,
            ingredients: ingredients,
            instructionsSteps: instructionsSteps,
            image: cocktail.strDrinkThumb || null,
        });
    }
);

app.post( "/search-alcohol",
    (req, res, next) => {
        req.fetchOptions = {
            endpoint: `search.php?i=${req.body.alcName}`,
            errorMessage: "No alcohol found for this name",
            responseKey: "ingredients",
        };
        next();
    },
    fetchCocktailMiddleware,
    (req, res) => {
        const alcohol = req.fetchedData[0];

        if (!alcohol || !alcohol.strIngredient) {
            // Render error message if no valid alcohol data is retrieved
            return renderPage(res, { error: "No alcohol found for this name" });
        }

        // Render the page with alcohol data
        renderPage(res, {
            alcName: req.body.alcName,
            ingredient: alcohol.strIngredient || "Unknown",
            description: alcohol.strDescription || "No description available.",
            type: alcohol.strType || "Unknown type",
            isAlcoholic: alcohol.strAlcohol || "Unknown",
            abv: alcohol.strABV || "Unknown ABV",
        });
    }
);

// random cocktail button
app.post("/random-cocktail" ,async (req, res) => { 
    try{
        const result = await axios.get(`${API_URL}/random.php`);
        const cocktail = result.data.drinks[0];
        const ingredients = extractIngredients(cocktail);
        const instructionsSteps = cocktail.strInstructions.split('.').filter(step => step.trim() !== "");
        

        renderPage(res, {
            drinkName: cocktail.strDrink, 
            ingredients: ingredients,
            instructionsSteps: instructionsSteps,
            image: cocktail.strDrinkThumb || null,
        });
    }
    catch (error){
        console.error(error);
        res.status(500).send('Error retrieving cocktail data');
    }
});

app.post("/first-letter-cocktail" ,async (req, res) => { 
    try{
        const firstLetter = req.body.firstLetterInput;
        const result = await axios.get(`${API_URL}/search.php?f=${firstLetter}`);

        if (!result.data.drinks) {
            return renderPage(res, {error: "No drinks found for this letter"});
        }
        let drinks = result.data.drinks;
        let alcoholLevel = req.body.alcLevel;
        let drinkCategory = req.body.category;
        const sortOrder = req.body.sortOrder;

        // Filter drinks by alcohol level and category
        drinks = filterDrinks(drinks, alcoholLevel, drinkCategory);

        // Sort drinks based on the provided order and criteria
        switch (sortOrder) {
            case "instructions-ascending":
            case "instructions-descending":
                drinks = sortDrinks(
                    drinks,
                    (drink) => countInstructionSteps(drink.strInstructions),
                    sortOrder.split("-")[1]
                );
                break;
            case "name-ascending":
            case "name-descending":
                drinks = sortDrinks(
                    drinks,
                    (drink) => drink.strDrink,
                    sortOrder.split("-")[1]
                );
                break;
            case "ingredients-ascending":
            case "ingredients-descending":
                drinks = sortDrinks(
                    drinks,
                    (drink) => countIngredients(drink),
                    sortOrder.split("-")[1]
                );
                break;
            default:
                break;
        }

        renderPage(res, {
            drinks: drinks,
            firstLetter: firstLetter,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving drinks data");
    }
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("An internal server error occurred");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Signup route
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, hashedPassword],
        (err) => {
            if (err) {
                return res.status(500).send("Signup failed. Username might already exist.");
            }
            res.redirect("/login");
        }
    );
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch the user from the database
        const results = await db.query("SELECT * FROM public.users WHERE username = $1", [username]);

        // Check if user exists
        if (results.rows.length === 0) {
            return res.status(401).send("Invalid username or password");
        }

        const user = results.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Password does not match
            return res.status(401).send("Invalid username or password");
        }

        // Successful login, set session
        req.session.user = { id: user.id, username: user.username };
        res.redirect("/");
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("An unexpected error occurred.");
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Add routes for login and signup pages
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});