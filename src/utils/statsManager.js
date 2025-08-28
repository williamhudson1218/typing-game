const STATS_KEY = "typingStats";

export const getStats = () => {
  return (
    JSON.parse(localStorage.getItem(STATS_KEY)) || {
      wordsTyped: 0,
      accuracy: 0,
      averageSpeed: 0,
      totalTime: 0,
      lessonsCompleted: 0,
      // Add history for tracking improvement
      history: [],
    }
  );
};

export const saveStats = (stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updateLessonStats = (lessonStats) => {
  const currentStats = getStats();
  const { wpm, accuracy, totalWords, totalTime, totalErrors } = lessonStats;

  const newTotalWords = currentStats.wordsTyped + totalWords;

  const newStats = {
    ...currentStats,
    wordsTyped: newTotalWords,
    accuracy: (
      (currentStats.accuracy * currentStats.wordsTyped +
        accuracy * totalWords) /
      newTotalWords
    ).toFixed(1),
    averageSpeed: (
      (currentStats.averageSpeed * currentStats.wordsTyped +
        wpm * totalWords) /
      newTotalWords
    ).toFixed(1),
    totalTime: currentStats.totalTime + totalTime,
    lessonsCompleted: currentStats.lessonsCompleted + 1,
    history: [
      ...currentStats.history,
      {
        date: new Date().toISOString(),
        ...lessonStats,
      },
    ],
  };

  saveStats(newStats);
  return newStats;
};
