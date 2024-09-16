import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

app.use(bodyParser.urlencoded({ extended: true }));

let filterCategoryData = await axios.post(`${API_URL}/list.php?c=list`);
let filterCategory = null;
if (filterCategoryData.data.drinks) {
    filterCategory = filterCategoryData.data.drinks;
}

let filterAlcoholData = await axios.post(`${API_URL}/list.php?a=list`);
let filterAlcohol = null;
if (filterAlcoholData.data.drinks) {
    filterAlcohol = filterAlcoholData.data.drinks;
}

let filterGlassData = await axios.post(`${API_URL}/list.php?g=list`);
let filterGlass = null;
if (filterGlassData.data.drinks) {
    filterGlass = filterGlassData.data.drinks;
}


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

app.get("/", async (req, res) => {
    res.render("index.ejs", { 
        drinkName: 'Waiting for an Input....',
        alcName: '',
        ingredients: '',
        filterCategory: filterCategory,
        filterAlcohol: filterAlcohol,
        filterGlass: filterGlass,
        instructionsSteps: '',
        image: null,
        error: null,
    });
});
// SEARCH KEYWORD: best practice to refactor (so not repetitive, easier structure) code and restructure code into different ejs files for reusability
// BIAR EFFICIENT DAN GAUSAH ERROR AND NULL NULL
// pisah input semua di beda2 ejs (error, cocktail, alcohol)
// res.render (each ejs file)

// search cocktail by name
app.post("/search-cocktail" ,async (req, res) => { 
    try{
        const cocktailName = req.body.cocktailName; //from user input
        const result = await axios.get(`${API_URL}/search.php?s=${cocktailName}`);
        if (!result.data.drinks) {
            return res.render("index.ejs", { 
                error: "No cocktails found for this name!",
                filterCategory: filterCategory,
                filterAlcohol: filterAlcohol,
                filterGlass: filterGlass,
            });
        }
        const cocktail = result.data.drinks[0];
        const ingredients = extractIngredients(cocktail);
        const instructionsSteps = cocktail.strInstructions.split('.').filter(step => step.trim() !== "");

        
        return res.render("index.ejs", { 
            drinkName: cocktail.strDrink, 
            ingredients: ingredients,
            instructionsSteps: instructionsSteps,
            image: cocktail.strDrinkThumb || null,
            // HOW TO NOT TYPE THESE IN EVERY RES.RENDER
            filterCategory: filterCategory,
            filterAlcohol: filterAlcohol,
            filterGlass: filterGlass,
            error: null,
        });
    }
    catch (error){
        console.error(error);
        res.status(500).send('Error retrieving cocktail data');
    }
});

// search alcohol name
// add key values so user can input id,and list all the cocktails by the alcName
app.post("/search-alcohol" ,async (req, res) => { 
    try{
        const alcoholName = req.body.alcName;
        const result = await axios.get(`${API_URL}/search.php?i=${alcoholName}`);
        if (!result.data.ingredients) {
            return res.render("index.ejs", { 
                error: "No alcohol found for this name!",
                filterCategory: filterCategory,
                filterAlcohol: filterAlcohol,
                filterGlass: filterGlass,
            });
        }
       
        const alcohol = result.data.ingredients[0];
        if (alcohol != null){
            return res.render("index.ejs", { 
                drinkName: null,
                alcName: alcoholName,
                ingredient: alcohol.strIngredient ? alcohol.strIngredient : '', 
                description: alcohol.strDescription ? alcohol.strDescription : 'no  description found', 
                error: null,
                filterCategory: filterCategory,
                filterAlcohol: filterAlcohol,
                filterGlass: filterGlass,

    
                // data: alcohol,
                // error: null,
                // drinkName:null,
                // alcName: null,
            });
        }
        else{
            return res.render("index.ejs", { 
                error: "No alcohol found for this name!",
                filterCategory: filterCategory,
                filterAlcohol: filterAlcohol,
                filterGlass: filterGlass,
            });
        }
    }
    catch (error){
        console.error(error);
        console.log("ERRRORRR");
        res.status(500).send('Error retrieving alcohol data');
    }
});

// random cocktail button
app.post("/random-cocktail" ,async (req, res) => { 
    try{
        const result = await axios.get(`${API_URL}/random.php`);
        const cocktail = result.data.drinks[0];
        const ingredients = extractIngredients(cocktail);
        const instructionsSteps = cocktail.strInstructions.split('.').filter(step => step.trim() !== "");

        for (let i = 1; i <= 15; i++) {
            const ingredientList = cocktail[`strIngredient${i}`];
            const measureList = cocktail[`strMeasure${i}`];
            if (ingredientList != null && measureList != null){
                ingredients.push({
                    ingredient: ingredientList,
                    measure: measureList,
                });
            }
        }
        
        return res.render("index.ejs", { 
            drinkName: cocktail.strDrink, 
            ingredients: ingredients , //AN ARRAY, FOR LOOP IT WHEN CREATING <LI> IN EJS
            instructionsSteps: instructionsSteps,
            image: cocktail.strDrinkThumb || null,
            error: null,
            filterCategory: filterCategory,
            filterAlcohol: filterAlcohol,
            filterGlass: filterGlass,
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
            return res.render("index.ejs", { 
                drinks: [], 
                error: "No drinks found for this letter!",
                filterCategory: filterCategory,
                filterAlcohol: filterAlcohol,
                filterGlass: filterGlass,
            });
        }
        let drinks = result.data.drinks;

        let alcoholLevel = req.body.alcLevel;
        let drinkCategory = req.body.category;
        const sortOrder = req.body.sortOrder;

        // to count ingredients in each drink
        const countIngredients = (drink) => {
            let count = 0;
            for (let key in drink) {
                if (key.includes('strIngredient') && drink[key] !== null && drink[key] !== "") {
                    count++;
                }
            }
            return count;
        };

        // function to count instructions in each drink
        const countInstructionSteps = (instructions) => {
            const steps = instructions.split('.').filter(step => step.trim() !== "");
            return steps.length;
        };
      
        // Sort drinks by number of instruction steps
        drinks.sort((a, b) => {
            const stepsA = countInstructionSteps(a.strInstructions);
            const stepsB = countInstructionSteps(b.strInstructions);
        
            // Apply both ascending and descending order logic
            if (sortOrder === "instructions-ascending") {
                return stepsA - stepsB;
            } else if (sortOrder === "instructions-descending") {
                return stepsB - stepsA;
            } else {
                return 0; 
            }
        });
        if (alcoholLevel){ 
            drinks = drinks.filter((drink) => drink.strAlcoholic === alcoholLevel);
        }
        if (drinkCategory){
            drinks = drinks.filter((drink) => drink.strCategory === drinkCategory);
        }

        if (sortOrder === "name-ascending") {
            drinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink)); 
        } else if (sortOrder === "name-descending") {
            drinks.sort((a, b) => b.strDrink.localeCompare(a.strDrink)); 
        } else if (sortOrder === "ingredients-ascending"){
            drinks.sort((a, b) => countIngredients(a) - countIngredients(b));
        } else if (sortOrder === "ingredients-descending"){
            drinks.sort((a, b) => countIngredients(b) - countIngredients(a));
        }

        //make each keys to an array element
        //use .filter method to only get str drink, put to str drink array

        return res.render("index.ejs", { 
            drinks: drinks,
            error: null,
            drinkName: null,
            firstLetter: firstLetter,
            alcName: null,
            filterCategory: filterCategory,
            filterAlcohol: filterAlcohol,
            filterGlass: filterGlass,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving drinks data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
