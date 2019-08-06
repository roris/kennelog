import { Application } from '../declarations';
import users from './users/users.service';
import dogs from './dogs/dogs.service';
import breeds from './breeds/breeds.service';
import uploads from './uploads/uploads.service';
import blobs from './blobs/blobs.service';
import pairs from './pairs/pairs.service';
import litters from './litters/litters.service';
import dogsLitters from './dogs-litters/dogs-litters.service';
import events from './events/events.service';
import measures from './measures/measures.service';
import weights from './weights/weights.service';
import heights from './heights/heights.service';
import lengths from './lengths/lengths.service';
import hipScores from './hip-scores/hip-scores.service';
import elbowScores from './elbow-scores/elbow-scores.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(dogs);
  app.configure(breeds);
  app.configure(uploads);
  app.configure(blobs);
  app.configure(pairs);
  app.configure(litters);
  app.configure(dogsLitters);
  app.configure(events);
  app.configure(measures);
  app.configure(weights);
  app.configure(heights);
  app.configure(lengths);
  app.configure(hipScores);
  app.configure(elbowScores);
}
