import path from 'path';
import fs from 'fs';
import type { PersonalityType, MBTICode } from '../../../shared/types/index.js';

function loadPersonalityTypes(): PersonalityType[] {
  const dataPath = path.join(__dirname, '../data/personality-types.json');
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data) as PersonalityType[];
}

const personalityTypesData: PersonalityType[] = loadPersonalityTypes();

export class PersonalityService {
  private types: Map<MBTICode, PersonalityType>;

  constructor() {
    this.types = new Map();
    personalityTypesData.forEach((type) => {
      this.types.set(type.code, type);
    });
  }

  getByCode(code: MBTICode): PersonalityType | null {
    return this.types.get(code) || null;
  }

  getAll(): PersonalityType[] {
    return personalityTypesData;
  }

  isValidCode(code: string): code is MBTICode {
    return this.types.has(code as MBTICode);
  }
}

export const personalityService = new PersonalityService();
