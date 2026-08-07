// Lo Storico legge e organizza dati di cui non è proprietario. Per questo
// motivo questo file NON importa mai "@/lib/prisma": ogni lettura passa
// esclusivamente dalle funzioni pubbliche esposte da workouts e metrics,
// come richiesto da boundaries.md ("Lo storico legge e organizza i dati, ma
// non ne diventa proprietario") e da architecture.md (dipendenze
// unidirezionali Identità → Gestione allenamenti → Storico e
// Identità → Metriche personali → Storico).
//
// Se in futuro servisse una scrittura (es. correggere una sessione dallo
// storico), la richiesta va inoltrata al modulo proprietario (workouts o
// metrics), mai eseguita qui direttamente.
import { listBodyMeasurements } from "@/modules/metrics/service";
import {
  getSessionForUser,
  listDistinctExercisesFromSessions,
  listSessionExerciseHistoryForExercise,
  listSessionsForUser,
} from "@/modules/workouts/sessionService";
import type { ListSessionsFilters } from "@/modules/workouts/types";

export async function listSessionHistory(userId: string, filters: ListSessionsFilters = {}) {
  return listSessionsForUser(userId, filters);
}

export async function getSessionHistoryDetail(userId: string, sessionId: string) {
  return getSessionForUser(userId, sessionId);
}

export async function listMeasurementHistory(userId: string) {
  return listBodyMeasurements(userId);
}

// Confronto delle prestazioni (requirements.md, sezione 9): elenca gli
// esercizi svolti per il selettore, poi tutte le occorrenze di quello scelto
// dalla più recente alla più vecchia.
export async function listComparableExercises(userId: string) {
  return listDistinctExercisesFromSessions(userId);
}

export async function getExercisePerformanceHistory(userId: string, exerciseId: string) {
  return listSessionExerciseHistoryForExercise(userId, exerciseId);
}
