const SEQUENCE_TIMEOUT = 5000;

let sequenceTimer: ReturnType<typeof setTimeout> | null = null;

function startSequence() {
  clearSequence();
  sequenceTimer = setTimeout(() => {
    sequenceTimer = null;
  }, SEQUENCE_TIMEOUT);
}

function completeSequence(handleActive: () => void) {
  if (sequenceTimer) {
    clearTimeout(sequenceTimer);
    handleActive();
    sequenceTimer = null;
  }
}

function clearSequence() {
  if (sequenceTimer) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
}

export { completeSequence, startSequence };
