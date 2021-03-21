export interface PartitaGiornata {
  id: number;
  data: string;
  partita: string;
  categoria: string;
  risultato?: string;
  arbitro?: string;
  voto?: number;
}