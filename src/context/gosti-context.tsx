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
  const [objektId, postaviObjektId] = useState<string | null>(null);


  async function dodajGosta(noviGost: Gost) {
    if (!objektId) return;
    const { data, error} = await supabase.from("gosti").insert(uBazu(noviGost, objektId)).select().single()

    if(error) {
      console.log("Greška", error.message)
      return;
    }

    postaviGoste([...gosti, izBaze(data)]);
  }

  async function obrisiGosta(id: string) {
    if(!objektId) return;
    const {error} = await supabase.from("gosti").delete().eq("id", id)

    if (error) {
      console.log("Greška bri brisanju: ", error.message)
      return;
    }

    postaviGoste(gosti.filter(g => g.id !== id));
  }
  
  async function urediGosta(izmijenjeniGost: Gost) {
    if (!objektId) return;
    const {error} = await supabase.from("gosti").update(uBazu(izmijenjeniGost, objektId)).eq("id", izmijenjeniGost.id)

    if (error) {
      console.log("Greška pri uređivanju", error.message)
      return;
    }

    postaviGoste(gosti.map(g => g.id === izmijenjeniGost.id ? izmijenjeniGost : g ))
  }

  async function dohvatiGoste() {
    const { data, error } = await supabase.from("gosti").select("*")
    if (error) {
      console.log("Greška pri dohvatu: ", error.message)
      postaviUcitavanje(false)
      return;
    }
    postaviGoste(data.map(izBaze));
    postaviUcitavanje(false);
  }

  async function dohvatiObjekt () {
    const {data, error} = await supabase.from("clanovi").select("objekt_id").single();

    if (error) {
      console.log("Greška pri dohvatu objekta: ", error.message);
      return;
    }
    postaviObjektId(data.objekt_id);
  }

  useEffect(() => {
    dohvatiGoste();
    dohvatiObjekt();
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