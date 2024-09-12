import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs", { 
        drinkName: 'test',
        alcName: 'aaa',
        ingredients: [],
        instructionsSteps: [],
        image: null,
        error: null,
    });
});

// search cocktail by name
app.post("/search-cocktail" ,async (req, res) => { 
    try{
        const cocktailName = req.body.cocktailName; //from user input
        const result = await axios.get(`${API_URL}/search.php?s=${cocktailName}`);
        if (!result.data.drinks) {
            return res.render("index.ejs", { 
                error: "No cocktails found for this name!",
            });
        }
        const cocktail = result.data.drinks[0];
        const ingredients = [];
        const instructions = cocktail.strInstructions;
        const instructionsSteps = instructions.split('.').filter(step => step.trim() !== "");

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
            error: null
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
            });
        }
       
        const alcohol = result.data.ingredients[0];
        if (alcohol != null){
            return res.render("index.ejs", { 
                drinkName: null,
                alcName: alcoholName,
                ingredient: alcohol.strIngredient ? alcohol.strIngredient : '', 
                description: alcohol.strDescription ? alcohol.strDescription : 'no  description found', 
                error: null 
    
                // data: alcohol,
                // error: null,
                // drinkName:null,
                // alcName: null,
            });
        }
        else{
            return res.render("index.ejs", { 
                error: "No alcohol found for this name!",
            });
        }
    }
    catch (error){
        console.error(error);
        console.log("ERRRORRR");
        res.status(500).send('Error retrieving alcohol data');
    }
});

// random cocktail
app.post("/random-cocktail" ,async (req, res) => { 
    try{
        const result = await axios.get(`${API_URL}/random.php`);
        const cocktail = result.data.drinks[0];
        const ingredients = [];
        const instructions = cocktail.strInstructions;
        const instructionsSteps = instructions.split('.').filter(step => step.trim() !== "");

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
            error: null
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
                error: "No drinks found for this letter!" 
            });
        }
        const listCocktails = result.data.drinks;
        //make each keys to an array element
        //use .filter method to only get str drink, put to str drink array

        return res.render("index.ejs", { 
            listCocktails: listCocktails,
            error: null
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
