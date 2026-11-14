/**
 * Pre-rendered voice clips for Surveyor 3 + Apollo 12 kids mode.
 * Drop MP3s in public/surveyor3/audio/ with these exact names.
 */
const BASE = "/surveyor3/audio";

export const SURVEYOR3_AUDIO = {
  story: {
    meet: `${BASE}/s3-story-01-meet.mp3`,
    jobA: `${BASE}/s3-story-02-job-a.mp3`,
    jobB: `${BASE}/s3-story-03-job-b.mp3`,
    bounceA: `${BASE}/s3-story-04-bounce-a.mp3`,
    bounceB: `${BASE}/s3-story-05-bounce-b.mp3`,
    visitA: `${BASE}/s3-story-06-visit-a.mp3`,
    visitB: `${BASE}/s3-story-07-visit-b.mp3`,
    invite: `${BASE}/s3-invite.mp3`,
  },
  quiz: {
    meet: `${BASE}/s3-quiz-01-meet.mp3`,
    job: `${BASE}/s3-quiz-02-job.mp3`,
    bounce: `${BASE}/s3-quiz-03-bounce.mp3`,
    visit: `${BASE}/s3-quiz-04-visit.mp3`,
  },
  game: {
    scout: `${BASE}/s3-game-01-scout.mp3`,
    scoop: `${BASE}/s3-game-02-scoop.mp3`,
    photo: `${BASE}/s3-game-03-photo.mp3`,
    radio: `${BASE}/s3-game-04-radio.mp3`,
    land: `${BASE}/s3-game-05-land.mp3`,
    flag: `${BASE}/s3-game-06-flag.mp3`,
  },
  apollo12: {
    walk: `${BASE}/s3-a12-01-walk.mp3`,
    quote: `${BASE}/s3-a12-02-quote.mp3`,
    artifacts: `${BASE}/s3-a12-03-artifacts.mp3`,
    finale: `${BASE}/s3-a12-04-finale.mp3`,
  },
};