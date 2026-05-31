const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf-8');
const lines = content.split('\n');

const IS_DELETED_LINE = '  isDeleted          Boolean    @default(false) @map("IS_DELETED")';

// Find all model blocks
const modelBlocks = [];
let inModel = false;
let modelName = '';
let modelStart = -1;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (!inModel) {
    const match = line.match(/^model\s+(\w+)\s*\{/);
    if (match) {
      inModel = true;
      modelName = match[1];
      modelStart = i;
      braceDepth = 1;
    }
  } else {
    // Count braces to find the end of the model block
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceDepth += openBraces - closeBraces;

    if (braceDepth <= 0) {
      modelBlocks.push({ name: modelName, start: modelStart, end: i });
      inModel = false;
      modelName = '';
      modelStart = -1;
      braceDepth = 0;
    }
  }
}

// Collect models that need isDeleted (have tenantId or are named Tenant)
const targetModels = [];
for (const block of modelBlocks) {
  if (block.name === 'Tenant') {
    targetModels.push(block);
    continue;
  }
  // Check if model has tenantId field
  for (let i = block.start; i <= block.end; i++) {
    if (/\btenantId\b/.test(lines[i]) && !lines[i].trim().startsWith('//')) {
      targetModels.push(block);
      break;
    }
  }
}

// Filter out models that already have isDeleted
const modelsToEdit = targetModels.filter(block => {
  for (let i = block.start; i <= block.end; i++) {
    if (/\bisDeleted\b/.test(lines[i]) || /\bIS_DELETED\b/.test(lines[i])) {
      return false;
    }
  }
  return true;
});

// Sort by line number descending so edits don't shift indices
modelsToEdit.sort((a, b) => b.end - a.end);

for (const block of modelsToEdit) {
  // Find insertion point: before first @@ directive or before closing }
  let insertIdx = block.end; // default: before closing }
  for (let i = block.start; i < block.end; i++) {
    if (lines[i].trim().startsWith('@@')) {
      insertIdx = i;
      break;
    }
  }
  // Add empty line before @@ directives if not already present
  const insertBefore = lines[insertIdx];
  const needsBlankLine = insertBefore.trim() !== '' && insertIdx > block.start + 1;
  if (needsBlankLine) {
    lines.splice(insertIdx, 0, '', IS_DELETED_LINE);
  } else {
    lines.splice(insertIdx, 0, IS_DELETED_LINE);
  }
}

fs.writeFileSync(schemaPath, lines.join('\n'), 'utf-8');
console.log(`Added isDeleted to ${modelsToEdit.length} models`);
