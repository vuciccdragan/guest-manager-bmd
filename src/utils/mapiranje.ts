import { Gost } from "@/data/gosti";

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