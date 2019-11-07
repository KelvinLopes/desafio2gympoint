import Bee from 'bee-queue';
import EnrollmentedMail from '../app/jobs/enrollmentedMail';
import AnswerMail from '../app/jobs/answerMail';
import redisConfig from '../config/redis';

// Array with jobs files
const jobs = [EnrollmentedMail, AnswerMail];

// Create queues

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // Start queuing process
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Add queued process
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Process the queues
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  // Returns error queues messages
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
