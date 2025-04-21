import React from 'react';

const Estrellas = ({ calificacion }) => {
  // Se asegura que la calificación esté entre 0 y 5
  const calificacionRedondeada = Math.round(calificacion);

  // Se genera un arreglo con el número de estrellas completas
  const estrellas = [];
  for (let i = 0; i < 5; i++) {
    if (i < calificacionRedondeada) {
      estrellas.push("★"); // Estrella completa
    } else {
      estrellas.push("☆"); // Estrella vacía
    }
  }

  return (
    <div>
      {estrellas.map((estrella, index) => (
        <span key={index}>{estrella}</span>
      ))}
    </div>
  );
};

export default Estrellas