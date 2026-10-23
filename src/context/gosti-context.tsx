import { createContext, useContext, useState, useEffect } from "react";
import { Gost } from "../data/gosti";
import { supabase } from "@/lib/supabase";
import { izBaze, uBazu } from "@/utils/mapiranje";

type GostiContextTip = {
  gosti: Gost[];
  dodajGosta: (noviGost: Gost) => void;
  obrisiGosta: (id: string) => void;
  urediGosta: (izmijenjeniGost: Gost) => void
  ucitavanje: boolean
};

const GostiContext = createContext<GostiContextTip | undefined>(undefined);

export function GostiProvider(props: { children: React.ReactNode }) {
  const [ucitavanje, postaviUcitavanje] = useState(true);
  const [gosti, postaviGoste] = useState<Gost[]>([]);


  function dodajGosta(noviGost: Gost) {
    postaviGoste([...gosti, noviGost]);
  }

  function obrisiGosta(id: string) {
    postaviGoste(gosti.filter(g => g.id !== id));
  }
  function urediGosta(izmijenjeniGost: Gost) {
    postaviGoste(gosti.map(g => g.id === izmijenjeniGost.id ? izmijenjeniGost : g ))
  }

  async function dohvatiGoste() {
    const { data, error } = await supabase.from("gosti").select("*")
    if (error) {
      console.log("Greška", error.message)
      postaviUcitavanje(false)
      return;
    }
    postaviGoste(data.map(izBaze));
    postaviUcitavanje(false);
  }

  useEffect(() => {
    dohvatiGoste();
  }, []);

  return (
    <GostiContext.Provider value={{ gosti, ucitavanje, dodajGosta, obrisiGosta, urediGosta }}>
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