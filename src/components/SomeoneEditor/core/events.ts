enum BackSizeLevel {
  SMALL = 1,
  MEDIUM,
  LARGE,
  MAX,
}

const currentBackSize = {
  level: BackSizeLevel.SMALL,
  watcher: 0,
  count: 0,
};

const BACK_SIZE_LEVEL_MAP = {
  [BackSizeLevel.SMALL]: 1,
  [BackSizeLevel.MEDIUM]: 10,
  [BackSizeLevel.LARGE]: 60,
  [BackSizeLevel.MAX]: 120,
};

const MAX_BACK_SIZE_LEVEL = 4;
const LEVEL_SIZE_COUNT = 30;

export function getBackSize() {
  clearTimeout(currentBackSize.watcher);
  currentBackSize.count++;

  currentBackSize.watcher = window.setTimeout(() => {
    currentBackSize.count = 1;
    (currentBackSize.level = 1), (currentBackSize.count = 0);
  }, 500);

  if (currentBackSize.level < MAX_BACK_SIZE_LEVEL) {
    if (currentBackSize.count >= LEVEL_SIZE_COUNT) {
      currentBackSize.level++;
      currentBackSize.count = 0;
    }
  }

  return BACK_SIZE_LEVEL_MAP[currentBackSize.level];
}
