import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Piccolo catalogo iniziale di esercizi predefiniti (ownerId = null), come
// richiesto da requirements.md sezione 5. Non è un elenco esaustivo: è
// sufficiente a far funzionare i flussi di modelli/sessioni fin da subito.
const PREDEFINED_EXERCISES = [
  {
    name: "Panca piana",
    tracksSets: true,
    tracksReps: true,
    tracksLoad: true,
    tracksDuration: false,
    tracksDistance: false,
  },
  {
    name: "Squat",
    tracksSets: true,
    tracksReps: true,
    tracksLoad: true,
    tracksDuration: false,
    tracksDistance: false,
  },
  {
    name: "Stacco da terra",
    tracksSets: true,
    tracksReps: true,
    tracksLoad: true,
    tracksDuration: false,
    tracksDistance: false,
  },
  {
    name: "Trazioni",
    tracksSets: true,
    tracksReps: true,
    tracksLoad: false,
    tracksDuration: false,
    tracksDistance: false,
  },
  {
    name: "Plank",
    tracksSets: true,
    tracksReps: false,
    tracksLoad: false,
    tracksDuration: true,
    tracksDistance: false,
  },
  {
    name: "Corsa",
    tracksSets: false,
    tracksReps: false,
    tracksLoad: false,
    tracksDuration: true,
    tracksDistance: true,
  },
];

async function main(): Promise<void> {
  for (const exercise of PREDEFINED_EXERCISES) {
    const existing = await prisma.exercise.findFirst({
      where: { name: exercise.name, ownerId: null },
    });

    if (!existing) {
      await prisma.exercise.create({ data: { ...exercise, ownerId: null } });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
