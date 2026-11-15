import { SURVEYOR3_AUDIO } from "@/data/kids/surveyor3Audio";

/** Story blocks per chapter — one MP3 may cover several on-screen lines. */
export const STORY_CLIPS = {
  meet: [{ src: SURVEYOR3_AUDIO.story.meet, lineCount: 5 }],
  job: [
    { src: SURVEYOR3_AUDIO.story.jobA, lineCount: 3 },
    { src: SURVEYOR3_AUDIO.story.jobB, lineCount: 3 },
  ],
  bounce: [
    { src: SURVEYOR3_AUDIO.story.bounceA, lineCount: 4 },
    { src: SURVEYOR3_AUDIO.story.bounceB, lineCount: 1 },
  ],
  visit: [
    { src: SURVEYOR3_AUDIO.story.visitA, lineCount: 4 },
    { src: SURVEYOR3_AUDIO.story.visitB, lineCount: 1 },
  ],
};

export const QUIZ_AUDIO = SURVEYOR3_AUDIO.quiz;

export const GAME_BEAT_AUDIO = {
  search: SURVEYOR3_AUDIO.game.scout,
  dig: SURVEYOR3_AUDIO.game.scoop,
  scan: SURVEYOR3_AUDIO.game.photo,
  notify: SURVEYOR3_AUDIO.game.radio,
  landing: SURVEYOR3_AUDIO.game.land,
  flag: SURVEYOR3_AUDIO.game.flag,
};

export const APOLLO12_AUDIO = SURVEYOR3_AUDIO.apollo12;