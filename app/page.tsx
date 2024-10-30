"use client";

import { useState } from "react";
import ListaActividades from "./components/lista-actividades";
import RegistroActividades from "./components/registro-actividades";

interface Actividad {
  id: string;
  fecha: string;
  titulo: string;
  area: string;
  descripcion: string;
  duracion: number;
  observaciones: string[];
  estado: string;
}

export default function GestionActividades() {
  const [actividadParaEditar, setActividadParaEditar] = useState<
    Actividad | undefined
  >(undefined);
  const [actualizacionNecesaria, setActualizacionNecesaria] = useState(false);

  const handleEditActividad = (actividad: Actividad) => {
    setActividadParaEditar(actividad);
  };

  const handleActualizacion = () => {
    setActualizacionNecesaria(!actualizacionNecesaria);
    setActividadParaEditar(undefined);
  };

  return (
      <div className="flex flex-col md:flex-row gap-4 px-10 py-4 w-full">
        <div className=" md:w-[550px]">
          <ListaActividades
            onEditActividad={handleEditActividad}
            key={actualizacionNecesaria.toString()}
          />
        </div>
        <div className="flex justify-center md:w-full">
          <RegistroActividades
            actividadParaEditar={actividadParaEditar}
            onActualizacion={handleActualizacion}
          />
        </div>
      </div>
  );
}
