import { createContext, use, useContext, useEffect, useState } from "react";
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

  async function dohvatiPostavke() {
    const { data, error } = await supabase.from("postavke").select("*").single();

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

  const { sesija } = useAuth();
  useEffect(() => {
    if (!sesija) {
      postaviPostavke(null);
      postaviUcitavanje(false);
    }
    dohvatiPostavke();
  }, []);

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