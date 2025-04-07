export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  PHP = 'php',
}

export const LANGUAGE_CONFIG: {
  [key in Language]: {
    displayName: string
    fileExtension: string
    sampleFileName: string
    version: string
    codeSnippet: string
    testCase: string
    isSupported: boolean
  }
} = {
  [Language.JAVASCRIPT]: {
    displayName: 'JavaScript',
    fileExtension: 'js',
    sampleFileName: 'script.js',
    version: '18.15.0',
    codeSnippet: `function sum(a, b) {
  return a + b
}`,
    testCase: `describe('Hàm sum', () => {
  test('Cộng 1 + 2 phải bằng 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('Cộng -1 + 1 phải bằng 0', () => {
    expect(sum(-1, 1)).toBe(0);
  });

  test('Cộng 0 + 0 phải bằng 0', () => {
    expect(sum(0, 0)).toBe(0);
  });
});`,
    isSupported: true,
  },
  [Language.TYPESCRIPT]: {
    displayName: 'TypeScript',
    fileExtension: 'ts',
    sampleFileName: 'app.ts',
    version: '5.0.3',
    codeSnippet: `console.log('Hello world!');`,
    testCase: `describe('Hàm sum', () => {
  test('Cộng 1 + 2 phải bằng 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('Cộng -1 + 1 phải bằng 0', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});`,
    isSupported: false,
  },
  [Language.PYTHON]: {
    displayName: 'Python',
    fileExtension: 'py',
    sampleFileName: 'main.py',
    version: '3.10.0',
    codeSnippet: `print('Hello world!')`,
    testCase: '',
    isSupported: false,
  },
  [Language.JAVA]: {
    displayName: 'Java',
    fileExtension: 'java',
    sampleFileName: 'Main.java',
    version: '15.0.2',
    codeSnippet: `public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello world!");\n\t}\n}`,
    testCase: '',
    isSupported: false,
  },
  [Language.PHP]: {
    displayName: 'PHP',
    fileExtension: 'php',
    sampleFileName: 'index.php',
    version: '8.2.3',
    codeSnippet: `<?php echo 'Hello world!';`,
    testCase: '',
    isSupported: false,
  },
}
