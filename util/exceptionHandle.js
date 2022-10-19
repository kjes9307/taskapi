// 處理未定的重大錯誤
process.on('uncaughtException', err => {
      console.error('Uncaughted Exception！')
      console.error(err);
      process.exit(1);
});

// 處理忘了寫catch的promise ， 部會crash
process.on('unhandledRejection', (reason, promise) => {
    console.error('rejection：', promise, '原因：', reason);
});