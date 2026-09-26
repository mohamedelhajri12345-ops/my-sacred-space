// Reuse the existing project's trusted local content instead of duplicating it.
import athkarData from '../../src/data/athkar';
import quranData from '../../public/data/quran.json';

export const quran = quranData as any;
export const athkar = athkarData as any;
