// const lex = require('pug-lexer'),
//   parse = require('pug-parser'),
//   fs = require('fs'),
//   genSource = require('pug-source-gen'),
//   walk = require('pug-walk'),
//   constantinople = require('constantinople'),
//   kebabCase = require('kebab-case'),
//   _ = require('lodash'),
//   path = require('path');
//
// const attrSpecs = [, , 'filename', 'output'],
//   attrs = {
//     filename: path.resolve(__dirname, 'form.pug'),
//     output: path.resolve(__dirname, 'form.transformed.pug')
//   };
// process.argv.forEach((val, index) => {
//   if (attrSpecs[index] && typeof val === "string" && val.length > 0)
//     attrs[attrSpecs[index]] = val;
// });
//
// const src = fs.readFileSync(attrs.filename, 'utf8');
//
// // Parse
// const output = attrs.output,
//   tokens = lex(src, {filename: attrs.filename}),
//   classList = JSON.parse(fs.readFileSync(process.cwd() + '/build/loaders/pug-bootstrap-moduled/classes.json', 'utf8'));
// const ast = parse(tokens);
//
// // Transform
// const new_ast = walk(ast, function before(node, replace) {
//
//   //find original classes
//   const findClasses = node => node.attrs.filter(attr => attr.name === 'class'),
//     removeClass = (node, classAttr) => {
//       console.log(classAttr.val);
//       const index = node.attrs.indexOf(classAttr);
//       if (index !== -1)
//         node.attrs.splice(index, 1);
//       else console.log(classAttr.val + ' not found');
//     },
//     reMustacheClass = (node, classNode) => {
//       if (node.name === 'h4')
//         console.log(node);
//       const clazz = constantinople.toConstant(classNode.val),
//         newClazz = '$bs.' + kebabCase.reverse(clazz).replace(/-/g, ''),
//         index = node.attrs.findIndex(attr => attr.name === ':class'),
//         isNew = index === -1,
//         cls = isNew ? {name: ':class', val: '""'} : node.attrs[index];
//
//       if (classList.findIndex(c => c === clazz) === -1) return;
//
//       // remove all whitespace from attr value
//       let val;
//       try {
//         val = constantinople.toConstant(cls.val).replace(/\s/g, '');
//       } catch (e) {
//         console.log(node);
//       }
//
//       // TODO: handle array|object syntax
//       if (val.length > 2 && val[0] === '[' && val[val.length - 1] === ']') {
//         val = val.replace(']', `,${newClazz}]`);
//       } else if (val.length > 2 && val[0] === '{' && val[val.length - 1] === '}') {
//         const pad = val.lastIndexOf('}');
//         val = val.substr(0, pad) + `,[${newClazz}]: true}`;
//       } else {
//         val = `[${newClazz}]`;
//       }
//
//       //put back to node
//       cls.val = JSON.stringify(val);
//       if (isNew)
//         node.attrs.push(cls);
//       else
//         node.attrs.splice(index, 1, cls);
//       removeClass(node, classNode);
//     };
//
//   if (node.type === 'Tag') {
//     findClasses(node).forEach(classAttr => {
//       reMustacheClass(node, classAttr);
//     });
//     //prevent duplicate
//     node.attrs = _.uniqBy(node.attrs, attr => attr.name + attr.val);
//   }
// });
// const generatedSource = genSource(new_ast).replace(/=true/g, '');
//
// fs.writeFileSync(output.replace('.pug', '.json'), JSON.stringify(ast, null, ' '), 'utf8');
// fs.writeFileSync(output, generatedSource, 'utf8');
