import lex            from 'pug-lexer';
import parser         from 'pug-parser';
import kebabCase      from 'kebab-case';
import _              from 'lodash';
import walk           from 'pug-walk';
import constantinople from 'constantinople';
import genSource      from 'pug-source-gen';

module.exports = function (source, testClass) {
  const ast = parser(lex(source)),
    new_ast = walk(ast, function before(node, replace) {

      //find original classes
      const findClasses = node => node.attrs.filter(attr => attr.name === 'class'),
        removeClass = (node, classAttr) => {
          const index = node.attrs.indexOf(classAttr);
          if (index !== -1)
            node.attrs.splice(index, 1);
          else console.log(classAttr.val + ' not found');
        },
        reMustacheClass = (node, classNode) => {
          const clazz = constantinople.toConstant(classNode.val),
            newClazz = '$bs.' + kebabCase.reverse(clazz).replace(/-/g, ''),
            index = node.attrs.findIndex(attr => attr.name === ':class'),
            isNew = (typeof node.attrs[index] === 'undefined'),
            cls = isNew ? {name: ':class', val: '""'} : node.attrs[index];

          if (!testClass(clazz)) return;

          // remove all whitespace from attr value
          let val = constantinople.toConstant(cls.val).replace(/\s/g, '');

          // TODO: handle array|object syntax
          if (val.length > 2 && val[0] === '[' && val[val.length - 1] === ']') {
            val = val.replace(']', `,${newClazz}]`);
          } else if (val.length > 2 && val[0] === '{' && val[val.length - 1] === '}') {
            const pad = val.lastIndexOf('}');
            val = val.substr(0, pad) + `,[${newClazz}]: true}`;
          } else {
            val = `[${val.length===0?val:(val+',')}${newClazz}]`;
          }

          //put back to node
          cls.val = JSON.stringify(val);
          if (isNew)
            node.attrs.push(cls);
          else
            node.attrs.splice(index, 1, cls);
          removeClass(node, classNode);
        };

      if (node.type === 'Tag') {
        findClasses(node).forEach(classAttr => {
          reMustacheClass(node, classAttr);
        });
        //prevent duplicate
        node.attrs = _.uniqBy(node.attrs, attr => attr.name + attr.val);
      }
    });
  return genSource(new_ast).replace(/=true/g, '').toString();
}
