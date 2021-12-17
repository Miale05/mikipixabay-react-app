import React, {useState, useEffect} from 'react';
import Formulario from './components/Formulario';
import Error from './components/Error';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  // state de la app
  const [busqueda, guardarBusqueda] = useState('');
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaactual, guardarPaginaActual] = useState(1);
  const [totalpaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarApi = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '24855100-fbbed73bb12fce30d7efdffb1';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);
      
      // Calcular el total de paginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(calcularTotalPaginas);

      //Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({ behavior: 'smooth' })
    }
    consultarApi();
    
  }, [busqueda, paginaactual])

  
  // definir la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;

    if(nuevaPaginaActual === 0) return;

    guardarPaginaActual(nuevaPaginaActual);
  }

  // definir la pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;

    if(nuevaPaginaActual > totalpaginas) return;

    guardarPaginaActual(nuevaPaginaActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imagenes "Miki Pixabay"</p>

        <Formulario 
          guardarBusqueda={guardarBusqueda}
          guardarPaginaActual={guardarPaginaActual}
        />
      </div>
      <div className="row justify-content-center">
        {<p>Página {paginaactual}</p>}
        <ListadoImagenes
          imagenes={imagenes}
        />

        { (paginaactual === 1) ? null : (
          <button
            type="button"
            className="bbtn btn-info mr-1 mb-5"
            onClick={paginaAnterior}
          >&laquo; Anterior</button>
        )}

        { (paginaactual === totalpaginas) ? null : (totalpaginas === 0) ? (
          <Error mensaje="No existen resultados para esta búsqueda." />
        ) : (
          <button
            type="button"
            className="bbtn btn-info mb-5"
            onClick={paginaSiguiente}
          >Siguiente &raquo;</button>
        )}

      </div>
    </div>
  );
}

export default App;
