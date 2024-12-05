const { Queue } = require("bullmq");
const connection = require("../../config/redisconfig");

const messageQueue = new Queue("email-Queue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true, // Automatically remove job after completion
    removeOnFail: 86400, // Retain failed jobs for 1 day (86400 seconds)
    deadLetterQueue: "email-Queue-DLQ", // Moves failed jobs to DLQ
  },
});

async function addEmailQueue(data) {
  try {
    await messageQueue.add("messageJob", data, {
      backoff: {
        type: "fixed",
        delay: 5000, // 5 seconds delay between retries
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function addResetPasswordQueue(data) {
  await messageQueue.add("messageReset", data, {
    backoff: {
      type: "fixed",
      delay: 5000, // 5 seconds delay between retries
    },
  });
  return true;
}

module.exports = { addEmailQueue, addResetPasswordQueue };
