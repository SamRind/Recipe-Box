### RECIPE BOX

### Pages

1. Home Page

   - 3 links to other three pages (navbar)
   - 2 links that go to a login and signup page
   - 1 link to the My Box page
     - shows the contents of the box
   - 1 link to the About Us page
     - shows the Bio's for each contributor
     - Allows an overview of the web application
   - Express routing

2. Add your own recipe
3. Find recipe from url
   - Allows users to input a url from an external online recipe
   - This feature utilizes the mycookbook.io API to scrape the website for recipe details
   - Recipe is displayed on a page with a name, image, description, instructions, and ingredients
4. Search recipes from API
   - Allows the user to search a recipe on site
   - Uses an API from Edamam
   - Show the user some initial data and links to website
   - Shows a image of the recipe
   - Allows user to add a recipe to the box via button
   - Once the button is used links up to My Box and shows user the recipe

### APIS

1. Edamam API
   - Used through rapidapi
   - Allows 1000 pulls per rolling month
   - Serves back
     - Ingredients, diet info, images, source, yeild
2. MyCookbook.io
   - Used through rapidapi
   - Allows 100 requests per month with an overage charge
     -Serves back
     - Name, description, yield, images, ingredients, and instructions

### Modules and Libraries

Express
Bootstrap
Pug
Cors
Axios
Body-Parser


### If not running deployed site run with:
npx nodemon index.js
### Deployed Site: 
