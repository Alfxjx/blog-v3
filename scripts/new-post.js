const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

const type = args[0] || 'blog';
const slug = args[1] || `new-post-${Date.now()}`;
const title = args[2] || '新文章标题';

const resourceDir = path.join(__dirname, '../packages/app/resource');

const typeDirMap = {
  blog: '_blogs',
  tech: '_techs',
  short: '_short',
  about: '_about',
};

const dir = path.join(resourceDir, typeDirMap[type] || '_blogs');
const filePath = path.join(dir, `${slug}.md`);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const date = new Date().toISOString();
const content = `---
title: '${title}'
excerpt: ''
date: '${date}'
coverImage: ''
type: ${type === 'about' ? 'about' : type === 'short' ? 'short' : type === 'tech' ? 'tech' : 'blog'}
tag: []
author:
  name: Alfxjx
  picture: '/assets/authors/alfxjx.jpg'
---

> 占位符内容
`;

fs.writeFileSync(filePath, content);
console.log(`Created: ${filePath}`);
