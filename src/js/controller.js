import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime';
import 'core-js/stable';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Update results view to highlight selected result
    resultsView.update(model.getSearchResultsPage());

    // 2) Retrieving recipe data from model (back end)
    await model.loadRecipe(id);
    const recipe = model.state.recipe;

    // 3) Render recipe HTML in view (front end)
    recipeView.render(model.state.recipe);

    // 4) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update recipe servings in state
  model.updateServings(newServings);

  // 2) Update the view
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // 1) Update bookmark in state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update the view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks preview
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarkRender = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe);
};

// Pass controller functions to event handlers in the view
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarkRender);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
