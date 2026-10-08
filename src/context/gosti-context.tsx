import { createContext, useContext, useState } from "react";
import { Gost, gosti as pocetniGosti } from "../data/gosti";

type GostiContextTip = {
  gosti: Gost[];
  dodajGosta: (noviGost: Gost) => void;
  obrisiGosta: (id: number) => void;
};

const GostiContext = createContext<GostiContextTip | undefined>(undefined);

export function GostiProvider(props: { children: React.ReactNode }) {
  const [gosti, postaviGoste] = useState<Gost[]>(pocetniGosti);

  function dodajGosta(noviGost: Gost) {
    postaviGoste([...gosti, noviGost]);
  }

  function obrisiGosta(id: number) {
    postaviGoste(gosti.filter(g => g.id !== id));
  }

  return (
    <GostiContext.Provider value={{ gosti, dodajGosta, obrisiGosta }}>
      {props.children}
    </GostiContext.Provider>
  );
}

export function useGosti() {
  const context = useContext(GostiContext);
  if (!context) {
    throw new Error("useGosti se mora koristiti unutar GostiProvider");
  }
  return context;
}