import { Training } from "./training.model";

function nowPlusDays(days: number): Date {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
}

export const TRAININGS = [
  new Training('AngularJS Basics', 'old school', false, nowPlusDays(24), 'assets/images/trainings/angularjs-shield.svg'),
  new Training('AngularJS Advanced', 'old school but important', false, nowPlusDays(12), 'assets/images/trainings/angularjs-shield.svg'),
  new Training('Angular2 & TypeScript', 'hot', false, nowPlusDays(6), 'assets/images/trainings/angular2-shield.svg'),
  new Training('TypeScript', 'Javascript and more', false, nowPlusDays(1), 'assets/images/trainings/typescript-logo.svg')
];
