import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'regenerator-runtime/runtime';
import 'core-js/stable';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Retrieving recipe data from model (back end)
    await model.loadRecipe(id);
    const recipe = model.state.recipe;

    // 2) Render recipe HTML in view (front end)
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search
    await model.loadSearchResults(query);

    // 3) Render results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  // Add a handler to the search event in the view and pass the function to call
  searchView.addHandlerSearch(controlSearchResults);
};

init();
