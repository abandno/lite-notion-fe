module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 要进行测试的文件匹配模式
  // testMatch: ['<rootDir>/tests/**/*.test.{js,ts}'],
  "testMatch": ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  // "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",

  // 测试文件中支持的文件扩展名
  moduleFileExtensions: ['js', 'json'],

  // // 在测试运行之前运行的全局设置脚本
  // setupFiles: ['<rootDir>/tests/setup.js'],

  // Jest 应该搜索测试文件的目录
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // 测试覆盖率报告的输出目录
  coverageDirectory: '<rootDir>/coverage',

  // 指定 Jest 应该使用的测试环境
  testEnvironment: 'node',

  // 指定 Jest 应该如何转换测试文件
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  // // 转换器的匹配模式
  // transform: {
  //   '^.+\\.js$': 'babel-jest',
  // },

  // 在测试过程中收集的覆盖率信息
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js}',
    '!src/**/*.d.ts',
    '!src/index.js', // 排除入口文件
  ],

  // 指定 Jest 应该在每个测试文件之前运行的设置文件
  // setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

  // 指定 Jest 应该忽略的文件和目录
  testPathIgnorePatterns: ['/node_modules/', '/public/'],

};
