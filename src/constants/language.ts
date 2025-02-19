export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  csharp: '6.12.0',
  php: '8.2.3',
  react: '18.2.0',
  html: 'HTML5',
  css: 'CSS3',
}

export const SUPPORTED_LANGUAGES = [
  { value: 'JavaScript', key: 'javascript' },
  { value: 'Python', key: 'python' },
  { value: 'PHP', key: 'php' },
  { value: 'Java', key: 'java' },
  { value: 'Typescript', key: 'typescript' },
]

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  react: `import React from 'react';\n\nfunction App() {\n\treturn (\n\t\t<div>Hello, React!</div>\n\t);\n}\n\nexport default App;\n`,
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<title>Hello World</title>\n</head>\n<body>\n\t<h1>Hello, HTML!</h1>\n</body>\n</html>\n`,
  css: `body {\n\tfont-family: Arial, sans-serif;\n\tbackground-color: #f0f0f0;\n}\n\nh1 {\n\tcolor: #333;\n}\n`,
}
