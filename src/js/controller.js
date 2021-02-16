import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'regenerator-runtime/runtime';
import 'core-js/stable';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

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
    alert(err);
  }
};

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
