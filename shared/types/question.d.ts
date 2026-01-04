export type Dichotomy = 'EI' | 'SN' | 'TF' | 'JP';
export type Pole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export interface QuestionOption {
    text: string;
    pole: Pole;
}
export interface Question {
    id: number;
    text: string;
    dichotomy: Dichotomy;
    options: [QuestionOption, QuestionOption];
}
