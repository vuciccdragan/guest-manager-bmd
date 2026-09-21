export type Gost = {
    id: number,
    ime: string,
    apartman: string,
    odDatum: string,
    doDatum: string,
    tipGosta: "booking" | "direkt" |"prijatelji",
    odrasli: number,
    djeca: number
};

export const bojaZaTipGosta = {
    booking: "#BCFFCB",
    direkt: "#B1D8FD",
    prijatelji: "#FFF9BC"
}

export const gosti: Gost[] = [
    {
        id: 1,
        ime: "Marko Marić",
        apartman: "A1",
        odDatum: "2026-07-14",
        doDatum: "2026-07-21",
        tipGosta: "booking",
        odrasli: 2,
        djeca: 0
    }, 
    {
        id: 2,
        ime: "Ana Anić",
        apartman: "A2",
        odDatum: "2026-07-15",
        doDatum: "2026-07-22",
        tipGosta: "direkt",
        odrasli: 2,
        djeca: 2
    },
    {
        id: 3,
        ime: "Ivana Ivić",
        apartman: "A5",
        odDatum: "2026-07-16",
        doDatum: "2026-07-23",
        tipGosta: "prijatelji",
        odrasli: 2,
        djeca: 1
    }
]