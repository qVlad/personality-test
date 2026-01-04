import type { Answer, MBTICode, Pole } from '../../../shared/types/index.js';

export class ScoringService {
  calculateMBTI(answers: Answer[]): MBTICode {
    const dichotomyCounts: Record<Pole, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    // Count answers for each pole
    answers.forEach((answer) => {
      dichotomyCounts[answer.selectedPole]++;
    });

    // Determine each dichotomy result
    // Tie-breaker: First pole wins (E, S, T, J)
    const e_i: 'E' | 'I' = dichotomyCounts.E >= dichotomyCounts.I ? 'E' : 'I';
    const s_n: 'S' | 'N' = dichotomyCounts.S >= dichotomyCounts.N ? 'S' : 'N';
    const t_f: 'T' | 'F' = dichotomyCounts.T >= dichotomyCounts.F ? 'T' : 'F';
    const j_p: 'J' | 'P' = dichotomyCounts.J >= dichotomyCounts.P ? 'J' : 'P';

    return `${e_i}${s_n}${t_f}${j_p}` as MBTICode;
  }

  isValidPole(pole: string): pole is Pole {
    return ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].includes(pole);
  }
}

export const scoringService = new ScoringService();
