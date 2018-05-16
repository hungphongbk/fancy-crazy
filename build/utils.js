import incstr from 'incstr';

const isProduction = process.env.NODE_ENV === 'production';

//region CSS Scope Minify
const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789'
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = generateNextId();
    // console.log(`${name} has id = ${index[name]}`);

    return index[name];
  };
};

const idLocal = createUniqueIdGenerator(), idComponent = createUniqueIdGenerator();
const components = {};
const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath.split('/').slice(-2).join('/');
  if (!components[componentName]) {
    components[componentName] = true;
    // console.log(componentName[0]+' '+resourcePath);
  }
  if (/^col-/.test(localName))
    return 'col-' + idLocal(localName);
  return idComponent(componentName).toUpperCase() + idLocal(localName);
};

const getLocalIdent = (context, localIdentName, localName) => generateScopedName(localName, context.resourcePath);
//endregion

const cssLoaders = (before = [], modules = false) => {
  const loaders = [
    {
      loader: "css-loader",
      options: {
        autoprefixer: true,
        minimize: true,
        // localIdentName: isProduction ? '[hash:base64:7]' : '[name]__[local]___[hash:base64:5]',
        getLocalIdent,
        importLoaders: before.length,
        camelCase: 'only',
        modules
      }
    }
  ];
  if (isProduction) {
    const ieOff=true;

    loaders.push({
      loader: "clean-css-loader",
      options: {
        level: 2,
        inline: false,
        compatibility:{
          properties:{
            iePrefixHack: ieOff,
            ieSuffixHack: ieOff
          }
        }
      }
    });
    loaders[0].options.importLoaders++;
  }
  loaders.push(...before);
  return loaders;
};

export default {
  getLocalIdent,
  cssLoaders
};
