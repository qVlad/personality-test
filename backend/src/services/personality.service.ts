import path from 'path';
import fs from 'fs';
import type { PersonalityType, ArchetypeCode } from '../../../shared/types/index.js';

function loadPersonalityTypes(): PersonalityType[] {
  // In production, look for data in the source directory
  const srcDataPath = path.join(__dirname, '../../src/data/personality-types.json');
  const distDataPath = path.join(__dirname, '../data/personality-types.json');
  const dataPath = fs.existsSync(srcDataPath) ? srcDataPath : distDataPath;
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data) as PersonalityType[];
}

const personalityTypesData: PersonalityType[] = loadPersonalityTypes();

export class PersonalityService {
  private types: Map<ArchetypeCode, PersonalityType>;

  constructor() {
    this.types = new Map();
    personalityTypesData.forEach((type) => {
      this.types.set(type.code, type);
    });
  }

  getByCode(code: ArchetypeCode): PersonalityType | null {
    return this.types.get(code) || null;
  }

  getAll(): PersonalityType[] {
    return personalityTypesData;
  }

  getAllTypes(): PersonalityType[] {
    return personalityTypesData;
  }

  isValidCode(code: string): code is ArchetypeCode {
    return this.types.has(code as ArchetypeCode);
  }
}

export const personalityService = new PersonalityService();
