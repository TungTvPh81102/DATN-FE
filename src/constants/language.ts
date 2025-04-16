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
    fileName: string
    version: string
    sampleCode: string
    sampleStudentCode: string
    isSupported: boolean
  }
} = {
  [Language.JAVASCRIPT]: {
    displayName: 'JavaScript',
    fileExtension: 'js',
    fileName: 'index.js',
    version: '18.15.0',
    sampleCode: `function sum(a, b) {\n\treturn a + b;\n}`,
    sampleStudentCode: `function sum() {\n\t\n}`,
    isSupported: true,
  },
  [Language.TYPESCRIPT]: {
    displayName: 'TypeScript',
    fileExtension: 'ts',
    fileName: 'index.ts',
    version: '5.0.3',
    sampleCode: `function sum(a: number, b: number) {\n\treturn a + b;\n}`,
    sampleStudentCode: `function sum() {\n\t\n}`,
    isSupported: true,
  },
  [Language.PYTHON]: {
    displayName: 'Python',
    fileExtension: 'py',
    fileName: 'main.py',
    version: '3.10.0',
    sampleCode: `def sum(a, b):\n\treturn a + b`,
    sampleStudentCode: `def sum():\n\tpass`,
    isSupported: false,
  },
  [Language.JAVA]: {
    displayName: 'Java',
    fileExtension: 'java',
    fileName: 'Main.java',
    version: '15.0.2',
    sampleCode: `public class Main {\n\tpublic static int sum(int a, int b) {\n\t\treturn a + b;\n\t}\n}`,
    sampleStudentCode: `public class Main {\n\tpublic static int sum() {\n\t\t\n\t}\n}`,
    isSupported: false,
  },
  [Language.PHP]: {
    displayName: 'PHP',
    fileExtension: 'php',
    fileName: 'index.php',
    version: '8.2.3',
    sampleCode: `<?php\nfunction sum($a, $b) {\n\treturn $a + $b;\n}`,
    sampleStudentCode: `<?php\nfunction sum() {\n\t\n}`,
    isSupported: false,
  },
}
