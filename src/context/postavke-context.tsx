import { createContext, useContext, useEffect, useState } from "react";
import { Postavke } from "@/data/postavke";
import { supabase } from "@/lib/supabase";
import { postavkeIzBaze, postavkeUBazu } from "@/utils/mapiranje";
import { useAuth } from "./auth-context";

type PostavkeContextTip = {
  postavke: Postavke | null;
  ucitavanje: boolean;
  spremiPostavke: (nove: Postavke) => Promise<void>;
};

const PostavkeContext = createContext<PostavkeContextTip | undefined>(undefined);

export function PostavkeProvider(props: { children: React.ReactNode }) {
  const [postavke, postaviPostavke] = useState<Postavke | null>(null);
  const [ucitavanje, postaviUcitavanje] = useState(true);
  const { sesija } = useAuth();

  async function dohvatiPostavke() {
    if (!sesija) return;

    const { data: clanstvo, error: greskaClanstvo } = await supabase
      .from("clanovi")
      .select("objekt_id")
      .eq("korisnik_id", sesija.user.id)
      .single();

    if (greskaClanstvo) {
      console.log("Greška pri dohvatu objekta:", greskaClanstvo.message);
      postaviUcitavanje(false);
      return;
    }

    const { data, error } = await supabase
      .from("postavke")
      .select("*")
      .eq("objekt_id", clanstvo.objekt_id)
      .single();

    if (error) {
      console.log("Greška pri dohvatu postavki:", error.message);
      postaviUcitavanje(false);
      return;
    }

    postaviPostavke(postavkeIzBaze(data));
    postaviUcitavanje(false);
  }

  async function spremiPostavke(nove: Postavke) {
    const { error } = await supabase
      .from("postavke")
      .update(postavkeUBazu(nove))
      .eq("id", nove.id);

    if (error) {
      console.log("Greška pri spremanju postavki:", error.message);
      return;
    }

    postaviPostavke(nove);
  }

  useEffect(() => {
    if (!sesija) {
      postaviPostavke(null);
      postaviUcitavanje(false);
      return;
    }

    postaviUcitavanje(true);
    dohvatiPostavke();
  }, [sesija]);

  return (
    <PostavkeContext.Provider value={{ postavke, ucitavanje, spremiPostavke }}>
      {props.children}
    </PostavkeContext.Provider>
  );
}

export function usePostavke() {
  const context = useContext(PostavkeContext);
  if (!context) {
    throw new Error("usePostavke se mora koristiti unutar PostavkeProvider");
  }
  return context;
}