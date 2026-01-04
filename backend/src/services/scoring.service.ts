import type {
  Answer,
  AnswerValue,
  ArchetypeCode,
  TraitCode,
  TraitScore,
  PersonalityType,
  Question,
} from '../../../shared/types/index.js';
import { questionService } from './question.service.js';
import { personalityService } from './personality.service.js';

const ALL_TRAITS: TraitCode[] = [
  'CREATIVE',
  'DELIBERATIVE',
  'DETAILED',
  'CONCEPTUAL',
  'PRACTICAL',
  'EXTRAVERTED',
  'TOUGH',
  'NURTURING',
  'LEADERSHIP',
  'COMPOSED',
  'AUTONOMOUS',
  'DETERMINED',
];

export class ScoringService {
  calculateTraitScores(answers: Answer[]): TraitScore[] {
    const questions = questionService.getAllQuestions();
    const traitTotals: Record<TraitCode, number> = {} as Record<TraitCode, number>;
    const traitMaxPossible: Record<TraitCode, number> = {} as Record<TraitCode, number>;

    // Initialize
    ALL_TRAITS.forEach((trait) => {
      traitTotals[trait] = 0;
      traitMaxPossible[trait] = 0;
    });

    // Calculate totals
    answers.forEach((answer) => {
      const question = questions.find((q: Question) => q.id === answer.questionId);
      if (!question) return;

      const optionIndex = answer.selectedOption === 'A' ? 0 : 1;
      const selectedOption = question.options[optionIndex];

      // Add weights for selected option
      selectedOption.traits.forEach(({ trait, weight }) => {
        traitTotals[trait] += weight;
      });

      // Track max possible for each trait mentioned in this question
      question.options.forEach((option) => {
        option.traits.forEach(({ trait, weight }) => {
          if (weight > 0) {
            traitMaxPossible[trait] += weight;
          }
        });
      });
    });

    // Calculate normalized scores (0-100)
    return ALL_TRAITS.map((trait) => ({
      trait,
      score:
        traitMaxPossible[trait] > 0
          ? Math.round((traitTotals[trait] / traitMaxPossible[trait]) * 100)
          : 50,
    }));
  }

  findBestArchetype(traitScores: TraitScore[]): ArchetypeCode {
    const archetypes = personalityService.getAllTypes();
    const scoreMap = new Map(traitScores.map((ts) => [ts.trait, ts.score]));

    let bestArchetype: ArchetypeCode = 'EXPLORER';
    let bestScore = -Infinity;

    archetypes.forEach((archetype: PersonalityType) => {
      // Calculate match score based on dominant traits
      let matchScore = 0;
      archetype.dominantTraits.forEach((trait: TraitCode, index: number) => {
        const traitScore = scoreMap.get(trait) || 50;
        // Weight primary trait more than secondary
        const weight = 3 - index; // 3, 2, 1
        matchScore += traitScore * weight;
      });

      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestArchetype = archetype.code;
      }
    });

    return bestArchetype;
  }

  calculateArchetype(answers: Answer[]): ArchetypeCode {
    const traitScores = this.calculateTraitScores(answers);
    return this.findBestArchetype(traitScores);
  }

  isValidAnswerValue(value: string): value is AnswerValue {
    return value === 'A' || value === 'B';
  }
}

export const scoringService = new ScoringService();
