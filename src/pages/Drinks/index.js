import React, { useContext, useEffect, useState } from 'react';
import propTypes from 'prop-types';

import './styles.css';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import HorizontalCardDrinkList from '../../components/HorizontalCardDrinkList';
import drinksContext from '../../context/drinksContext';
import Loading from '../../components/Loading';

const BASIC_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

function Drinks({ match, history }) {
  const [stateDrinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState('all');
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingDrinks, setLoadingDrinks] = useState(false);
  const { drinksIngredients } = useContext(drinksContext);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategory(true);
      const MAX_NUMBER_CATEGORIES = 5;
      const responseDrinks = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
      const array = await responseDrinks.json();
      const { drinks } = array;
      const arrayCategories = drinks.map((drink) => drink.strCategory);
      const arrayCategoriesLimited = arrayCategories
        .filter((__, index) => index < MAX_NUMBER_CATEGORIES);
      await setCategories(arrayCategoriesLimited);
      setLoadingCategory(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoadingDrinks(true);
      const MAX_NUMBER_DRINKS = 12;
      const responseDrinks = await fetch(BASIC_URL);
      const array = await responseDrinks.json();
      const { drinks } = array;
      const drinksLimited = drinks
        .filter((__, index) => index < MAX_NUMBER_DRINKS);
      await setDrinks(drinksLimited);
      setLoadingDrinks(false);
    };

    const fetchDrinksIngredients = async () => {
      const MAX_NUMBER_DRINKS = 12;
      const responseDrinks = await
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drinksIngredients}`);
      const array = await responseDrinks.json();
      const { drinks } = array;
      const drinksLimited = drinks
        .filter((__, index) => index < MAX_NUMBER_DRINKS);
      setDrinks(drinksLimited);
    };

    if (drinksIngredients) { fetchDrinksIngredients(); } else { fetchDrinks(); }
  }, [drinksIngredients]);

  const drinksCorrect = stateDrinks.map((drink) => ({
    image: drink.strDrinkThumb,
    category: drink.strCategory,
    name: drink.strDrink,
    area: drink.strArea,
    id: drink.idDrink,
    type: history.location.pathname.substring(1, history.location.pathname.length - 1)
    ,
  }));

  const handleButtonCategory = async (category) => {
    if (categorySelected !== category) {
      const MAX_NUMBER_DRINKS = 12;
      const responseDrinks = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`,
      );
      const array = await responseDrinks.json();
      const { drinks } = array;
      const drinksLimited = drinks
        .filter((__, index) => index < MAX_NUMBER_DRINKS);
      setDrinks(drinksLimited);
      setCategorySelected(category);
    } else {
      const MAX_NUMBER_DRINKS = 12;
      const responseDrinks = await fetch(BASIC_URL);
      const array = await responseDrinks.json();
      const { drinks } = array;
      const drinksLimited = drinks
        .filter((__, index) => index < MAX_NUMBER_DRINKS);
      setDrinks(drinksLimited);
      setCategorySelected('all');
    }
  };

  const handleButtonAll = async () => {
    const MAX_NUMBER_FOODS = 12;
    const responseDrinks = await fetch(BASIC_URL);
    const array = await responseDrinks.json();
    const { drinks } = array;
    const drinksLimited = drinks
      .filter((__, index) => index < MAX_NUMBER_FOODS);
    setDrinks(drinksLimited);
    setCategorySelected('all');
  };

  return (
    (!loadingCategory && !loadingDrinks) ? (
      <div className="drinks">
        <Header title="Bebidas" search match={ match } history={ history } />

        <div className="recipes-buttons-container">

          <button
            data-testid="All-category-filter"
            type="button"
            className="recipes-buttons"
            onClick={ () => handleButtonAll() }
          >
            All
          </button>

          {categories
            ? (
              categories.map((category, index) => (
                <button
                  key={ index }
                  className="recipes-buttons"
                  data-testid={ `${category}-category-filter` }
                  type="button"
                  onClick={ () => handleButtonCategory(category) }
                >
                  {category}
                </button>)))
            : <p>Loading...</p>}

        </div>

        <div className="recipes-cards-container">

          {stateDrinks ? drinksCorrect.map((drink, index) => (

            <HorizontalCardDrinkList
              recipe={ drink }
              index={ index }
              history={ history }
              key={ index }
            />
          ))
            : <p>Loading...</p>}

        </div>

        <Footer />
      </div>)
      : <Loading />
  );
}

Drinks.propTypes = {
  match: propTypes.shape({
    path: propTypes.string,
  }).isRequired,
  history: propTypes.shape({
    push: propTypes.func,
    location: propTypes.shape({
      pathname: propTypes.string,
    }),
  }).isRequired,
};

export default Drinks;
