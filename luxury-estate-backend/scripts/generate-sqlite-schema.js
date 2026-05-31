const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const outPath = path.join(__dirname, '..', 'prisma', 'schema.sqlite.prisma');

let content = fs.readFileSync(schemaPath, 'utf-8');

// Change provider from mysql to sqlite
content = content.replace(/provider\s*=\s*"mysql"/, 'provider = "sqlite"');

// Remove all @db.* annotations (including parenthesized args like @db.VarChar(100))
content = content.replace(/ @db\.\w+(\([^)]*\))?/g, '');

fs.writeFileSync(outPath, content, 'utf-8');
console.log('Generated prisma/schema.sqlite.prisma');
