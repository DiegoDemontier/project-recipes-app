import React from 'react';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

function Favorites() {
  return (
    <div className="favorite-recipes">
      <Header title="Receitas Favoritas" />
      <Footer />
    </div>
  );
}

export default Favorites;
