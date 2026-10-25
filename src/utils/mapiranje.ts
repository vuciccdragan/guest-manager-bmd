import { Gost } from "@/data/gosti";
import { Postavke } from "@/data/postavke";

export function izBaze(redak: any): Gost {
    return {
        id: redak.id,
        ime: redak.ime,
        apartman: redak.apartman,
        odDatum: redak.od_datum,
        doDatum: redak.do_datum,
        tipGosta: redak.tip_gosta,
        odrasli: redak.odrasli,
        djeca: redak.djeca,
    };
}

export function uBazu(gost: Gost, objektId: string) {
    return {
        ime: gost.ime,
        apartman: gost.apartman,
        od_datum: gost.odDatum,
        do_datum: gost.doDatum,
        tip_gosta: gost.tipGosta,
        odrasli: gost.odrasli,
        djeca: gost.djeca,
        objekt_id: objektId
    }
}

export function postavkeIzBaze(redak: any): Postavke {
  return {
    id: redak.id,
    objektId: redak.objekt_id,
    servisBooking: redak.servis_booking,
    servisDirekt: redak.servis_direkt,
    servisPrijatelji: redak.servis_prijatelji,
  };
}

export function postavkeUBazu(postavke: Postavke) {
  return {
    servis_booking: postavke.servisBooking,
    servis_direkt: postavke.servisDirekt,
    servis_prijatelji: postavke.servisPrijatelji,
  };
}