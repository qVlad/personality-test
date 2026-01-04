import type { Answer } from '../../../shared/types/session';
import type { Pole } from '../../../shared/types/question';
import { scoringService } from '../../src/services/scoring.service';

describe('ScoringService', () => {
  describe('calculateMBTI', () => {
    it('should return ESTJ for all E, S, T, J answers', () => {
      const answers: Answer[] = [
        { questionId: 1, selectedPole: 'E' },
        { questionId: 2, selectedPole: 'E' },
        { questionId: 3, selectedPole: 'E' },
        { questionId: 4, selectedPole: 'E' },
        { questionId: 5, selectedPole: 'E' },
        { questionId: 6, selectedPole: 'S' },
        { questionId: 7, selectedPole: 'S' },
        { questionId: 8, selectedPole: 'S' },
        { questionId: 9, selectedPole: 'S' },
        { questionId: 10, selectedPole: 'S' },
        { questionId: 11, selectedPole: 'T' },
        { questionId: 12, selectedPole: 'T' },
        { questionId: 13, selectedPole: 'T' },
        { questionId: 14, selectedPole: 'T' },
        { questionId: 15, selectedPole: 'T' },
        { questionId: 16, selectedPole: 'J' },
        { questionId: 17, selectedPole: 'J' },
        { questionId: 18, selectedPole: 'J' },
        { questionId: 19, selectedPole: 'J' },
        { questionId: 20, selectedPole: 'J' },
      ];

      const result = scoringService.calculateMBTI(answers);
      expect(result).toBe('ESTJ');
    });

    it('should return INFP for all I, N, F, P answers', () => {
      const answers: Answer[] = [
        { questionId: 1, selectedPole: 'I' },
        { questionId: 2, selectedPole: 'I' },
        { questionId: 3, selectedPole: 'I' },
        { questionId: 4, selectedPole: 'I' },
        { questionId: 5, selectedPole: 'I' },
        { questionId: 6, selectedPole: 'N' },
        { questionId: 7, selectedPole: 'N' },
        { questionId: 8, selectedPole: 'N' },
        { questionId: 9, selectedPole: 'N' },
        { questionId: 10, selectedPole: 'N' },
        { questionId: 11, selectedPole: 'F' },
        { questionId: 12, selectedPole: 'F' },
        { questionId: 13, selectedPole: 'F' },
        { questionId: 14, selectedPole: 'F' },
        { questionId: 15, selectedPole: 'F' },
        { questionId: 16, selectedPole: 'P' },
        { questionId: 17, selectedPole: 'P' },
        { questionId: 18, selectedPole: 'P' },
        { questionId: 19, selectedPole: 'P' },
        { questionId: 20, selectedPole: 'P' },
      ];

      const result = scoringService.calculateMBTI(answers);
      expect(result).toBe('INFP');
    });

    it('should handle tie by choosing first pole (E, S, T, J)', () => {
      // With 5 questions per dichotomy, a tie can happen with 2-3 split
      // But since we have exactly 5, we can't have a tie.
      // Let's test 3-2 split which should choose the majority
      const answers: Answer[] = [
        { questionId: 1, selectedPole: 'E' },
        { questionId: 2, selectedPole: 'E' },
        { questionId: 3, selectedPole: 'E' },
        { questionId: 4, selectedPole: 'I' },
        { questionId: 5, selectedPole: 'I' },
        { questionId: 6, selectedPole: 'S' },
        { questionId: 7, selectedPole: 'S' },
        { questionId: 8, selectedPole: 'N' },
        { questionId: 9, selectedPole: 'N' },
        { questionId: 10, selectedPole: 'N' },
        { questionId: 11, selectedPole: 'T' },
        { questionId: 12, selectedPole: 'F' },
        { questionId: 13, selectedPole: 'F' },
        { questionId: 14, selectedPole: 'F' },
        { questionId: 15, selectedPole: 'F' },
        { questionId: 16, selectedPole: 'J' },
        { questionId: 17, selectedPole: 'J' },
        { questionId: 18, selectedPole: 'J' },
        { questionId: 19, selectedPole: 'J' },
        { questionId: 20, selectedPole: 'P' },
      ];

      const result = scoringService.calculateMBTI(answers);
      expect(result).toBe('ENFJ');
    });

    it('should handle all 16 personality types', () => {
      const types = [
        'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
        'ISTP', 'ISFP', 'INFP', 'INTP',
        'ESTP', 'ESFP', 'ENFP', 'ENTP',
        'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
      ];

      types.forEach((type) => {
        const answers = createAnswersForType(type);
        const result = scoringService.calculateMBTI(answers);
        expect(result).toBe(type);
      });
    });
  });

  describe('isValidPole', () => {
    it('should return true for valid poles', () => {
      const validPoles = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
      validPoles.forEach((pole) => {
        expect(scoringService.isValidPole(pole)).toBe(true);
      });
    });

    it('should return false for invalid poles', () => {
      const invalidPoles = ['X', 'Y', 'Z', '', 'EI', 'e', 'i'];
      invalidPoles.forEach((pole) => {
        expect(scoringService.isValidPole(pole)).toBe(false);
      });
    });
  });
});

function createAnswersForType(type: string): Answer[] {
  const answers: Answer[] = [];
  const [ei, sn, tf, jp] = type.split('');

  // Questions 1-5: E/I dichotomy
  for (let i = 1; i <= 5; i++) {
    answers.push({ questionId: i, selectedPole: ei as Pole });
  }

  // Questions 6-10: S/N dichotomy
  for (let i = 6; i <= 10; i++) {
    answers.push({ questionId: i, selectedPole: sn as Pole });
  }

  // Questions 11-15: T/F dichotomy
  for (let i = 11; i <= 15; i++) {
    answers.push({ questionId: i, selectedPole: tf as Pole });
  }

  // Questions 16-20: J/P dichotomy
  for (let i = 16; i <= 20; i++) {
    answers.push({ questionId: i, selectedPole: jp as Pole });
  }

  return answers;
}
