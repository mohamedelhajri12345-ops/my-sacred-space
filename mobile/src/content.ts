import { ATHKAR, TASBIH_PRESETS } from '../../src/data/athkar';
import quranData from '../../public/data/quran.json';
export const quran = quranData as Array<{i:number;n:string;e:string;t:string;c:number;v:string[]}>;
export const athkar = ATHKAR;
export const tasbihPresets = TASBIH_PRESETS;
