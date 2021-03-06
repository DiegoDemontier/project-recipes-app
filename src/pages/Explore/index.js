import React from 'react';
import { useHistory } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import './ExploreStyles.css';

function Explore() {
  const history = useHistory();
  return (
    <div className="explore application-container">
      <Header title="Explorar" />
      <button
        type="button"
        data-testid="explore-food"
        onClick={ () => history.push('/explorar/comidas') }
        style={ { marginTop: '50px' } }
        className="selecting-button"
      >
        Explorar Comidas
      </button>
      <button
        type="button"
        data-testid="explore-drinks"
        onClick={ () => history.push('/explorar/bebidas') }
        style={ { marginTop: '50px' } }
        className="selecting-button"
      >
        Explorar Bebidas
      </button>
      <Footer />
    </div>
  );
}

export default Explore;
