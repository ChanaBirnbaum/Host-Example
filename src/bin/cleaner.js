#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import depcheck from 'depcheck';
import { ESLint } from 'eslint';
import prettier from 'prettier';
import enquirer from 'enquirer';

const { MultiSelect } = enquirer;;

const projectPath = process.cwd();

// === 🧪 שלב 1: הרצת טסטים לפני ואחרי ===
function runTests(when = '') {
  try {
    console.log(chalk.blue(`\n🧪 מריץ טסטים ${when} שינויים...`));
    execSync('npx jest --passWithNoTests', { stdio: 'inherit' });
    console.log(chalk.green(`✅ הטסטים ${when} עברו.\n`));
  } catch (e) {
    console.error(chalk.red(`❌ הטסטים ${when} נכשלו. עוצר.`));
    process.exit(1);
  }
}

// === 🔒 גיבוי ב-Git ===
function createGitCheckpoint() {
  try {
    execSync('git add . && git commit -m "🔒 גיבוי לפני ניקוי אוטומטי"', {
      stdio: 'ignore',
    });
    console.log(chalk.blue('📝 בוצע גיבוי בגיט.'));
  } catch {
    console.warn(chalk.yellow('⚠️ לא ניתן ליצור גיבוי. האם Git מאותחל?'));
  }
}

// === 📂 קבצים לא בשימוש ===
function findUnusedFiles() {
  return new Promise((resolve) => {
    depcheck(projectPath, {}, (unused) => resolve(unused.unusedFiles || []));
  });
}

// === 🚫 בעיות ESLint ===
async function findLintIssues() {
  const eslint = new ESLint({ fix: false });
  const results = await eslint.lintFiles(['src/**/*.{js,jsx,ts,tsx}']);
  return results.flatMap((r) =>
    r.messages
      .filter((m) =>
        ['no-unused-vars', 'unused-imports/no-unused-imports'].includes(m.ruleId)
      )
      .map((m) => ({
        file: r.filePath,
        message: m.message,
        rule: m.ruleId,
        line: m.line,
      }))
  );
}

// === ❓ תפריט מחיקה לקבצים ===
async function promptFileDeletion(files) {
  if (!files.length) {
    console.log(chalk.gray('✅ אין קבצים למחיקה.'));
    return;
  }

  const selected = await new MultiSelect({
    message: 'בחר קבצים למחיקה:',
    choices: files,
  }).run();

  for (const file of selected) {
    try {
      fs.unlinkSync(file);
      console.log(chalk.red('🗑️ נמחק:'), file);
    } catch (e) {
      console.log(chalk.yellow('⚠️ שגיאה במחיקה:'), file);
    }
  }
}

// === 🧹 תיקון קוד בעייתי עם ESLint ===
async function fixLintIssues(issues) {
  const uniqueFiles = [...new Set(issues.map((i) => i.file))];

  if (!uniqueFiles.length) {
    console.log(chalk.gray('✅ אין קבצים לתיקון.'));
    return;
  }

  const selected = await new MultiSelect({
    message: 'בחר קבצים להרצה עם --fix:',
    choices: uniqueFiles,
  }).run();

  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(selected);
  await ESLint.outputFixes(results);
  console.log(chalk.green('🔧 בוצעו תיקונים ל־ESLint.'));
}

// === ✨ פורמט עם Prettier ===
async function formatFiles() {
  const files = getAllJSFiles('src');
  const config = await prettier.resolveConfig(projectPath);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const formatted = prettier.format(content, { ...config, filepath: file });
    fs.writeFileSync(file, formatted, 'utf8');
    console.log(chalk.green('✨ פורמט:'), file);
  }
}

function getAllJSFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(getAllJSFiles(full));
    } else if (full.match(/\.(js|jsx|ts|tsx)$/)) {
      results.push(full);
    }
  });
  return results;
}

// === 🔁 הרצה ===
(async () => {
  const dryRun = process.argv.includes('--dry-run');

  console.log(chalk.cyan('\n🧼 מנקה את הקוד בפרויקט...\n'));

  runTests('לפני');
  if (!dryRun) createGitCheckpoint();

  const unusedFiles = await findUnusedFiles();
  const lintIssues = await findLintIssues();

  console.log(chalk.yellow('\n📂 קבצים לא בשימוש:'));
  await promptFileDeletion(unusedFiles);

  console.log(chalk.yellow('\n🚫 בעיות קוד שנמצאו:'));
  lintIssues.forEach((i, idx) =>
    console.log(`#${idx + 1} ${chalk.cyan(i.message)} (${i.rule}) בשורה ${i.line} בקובץ ${i.file}`)
  );
  await fixLintIssues(lintIssues);

  console.log(chalk.yellow('\n✨ מבצע פורמט עם Prettier...'));
  await formatFiles();

  runTests('אחרי');
  console.log(chalk.green('\n✅ ניקוי ואופטימיזציה הושלמו בהצלחה!'));
})();
