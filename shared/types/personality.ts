// PrinciplesYou Archetype System

export type ArchetypeCode =
  // Advocates
  | 'INSPIRER' | 'COACH' | 'CAMPAIGNER'
  // Architects
  | 'ORCHESTRATOR' | 'STRATEGIST' | 'PLANNER'
  // Creators
  | 'ARTISAN' | 'INVENTOR' | 'ADVENTURER'
  // Enthusiasts
  | 'ENTERTAINER' | 'PROMOTER' | 'IMPRESARIO'
  // Fighters
  | 'CRITIC' | 'ENFORCER' | 'PROTECTOR'
  // Givers
  | 'HELPER' | 'PROBLEM_SOLVER' | 'PEACEKEEPER'
  // Individualists
  | 'INDIVIDUALIST'
  // Leaders
  | 'COMMANDER' | 'QUIET_LEADER' | 'SHAPER'
  // Producers
  | 'INVESTIGATOR' | 'IMPLEMENTER' | 'TECHNICIAN'
  // Seekers
  | 'EXPLORER' | 'THINKER' | 'GROWTH_SEEKER';

export type ArchetypeGroup =
  | 'ADVOCATES'
  | 'ARCHITECTS'
  | 'CREATORS'
  | 'ENTHUSIASTS'
  | 'FIGHTERS'
  | 'GIVERS'
  | 'INDIVIDUALISTS'
  | 'LEADERS'
  | 'PRODUCERS'
  | 'SEEKERS';

// 12 core traits measured by the assessment
export type TraitCode =
  // Cognitive traits
  | 'CREATIVE'
  | 'DELIBERATIVE'
  | 'DETAILED'
  | 'CONCEPTUAL'
  | 'PRACTICAL'
  // Interpersonal traits
  | 'EXTRAVERTED'
  | 'TOUGH'
  | 'NURTURING'
  | 'LEADERSHIP'
  // Motivational traits
  | 'COMPOSED'
  | 'AUTONOMOUS'
  | 'DETERMINED';

export interface TraitScore {
  trait: TraitCode;
  score: number; // 0-100
}

export interface PersonalityType {
  code: ArchetypeCode;
  name: string;
  group: ArchetypeGroup;
  groupName: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  // Trait profile that defines this archetype (high traits)
  dominantTraits: TraitCode[];
}
