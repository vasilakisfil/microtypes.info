const Plugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const yamlFront = require('yaml-front-matter');
const { Serializer } = require('jsonapi-serializer');
const yaml = require('js-yaml');
const mkdirp = require('mkdirp');
const assign = require('lodash.assign');

const {
  existsSync,
  readFileSync,
  writeFileSync,
} = require('fs');

const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

/*
const ContentSerializer = new Serializer('content', {
  id: 'path',
  attributes: [
    '__content',
    'title',
    'subtitle',
  ],
  keyForAttribute(attr) {
    switch (attr) {
      case '__content':
        return 'content';
      default:
        return attr;
    }
  },
});
*/

//need to fux contentSerializer
//need to get multiple sets of content files
function subpageUrls(parentUrl, currentPage, childPages) {
  if (currentPage && parentUrl) {
    // eslint-disable-next-line no-param-reassign
    currentPage.url = `${parentUrl}/${currentPage.url}`;
  }

  if (childPages) {
    childPages.forEach((page) => {
      subpageUrls(currentPage ? currentPage.url : null, page, page.pages);
    });
  }
}

class BroccoliStaticSiteJson extends Plugin {
  constructor(folder, options) {
    // tell broccoli which "nodes" we're watching
    super([folder], options);

    this.options = assign({}, {
      folder,
      contentFolder: 'content',
    }, options);

    Plugin.call(this, [folder], {
      annotation: options.annotation,
    });
  }

  build() {
    // build content folder if it doesnt exist
    if (!existsSync(join(this.outputPath, this.options.contentFolder))) {
      mkdirp.sync(join(this.outputPath, this.options.contentFolder));
    }

    // build the tree of MD files
    const paths = walkSync(this.inputPaths);

    const mdFiles = paths.filter(path => extname(path) === '.md');

    const fileData = mdFiles.map(path => ({
      path,
      content: readFileSync(join(this.options.folder, path)),
    })).map(file => assign({}, {
      path: file.path,
    }, yamlFront.loadFront(file.content)));

    let attributes = Array.from(
      new Set(
        fileData.map(data => Object.keys(data)).reduce(
          (a, b) => a.concat(b)
        ), []
      )
    );

    this.contentSerializer = new Serializer('content', {
      id: 'path',
      attributes: attributes,
      keyForAttribute(attr) {
        switch (attr) {
          case '__content':
            return 'content';
          case 'linkName': //FIX ME!!
            return 'link-name';
          case 'isIndex': //FIX ME!!
            return 'is-index';
          default:
            return attr;
        }
      },
    });

    if (!existsSync(join(this.outputPath, this.options.contentFolder))) {
      mkdirp.sync(join(this.outputPath, this.options.contentFolder));
    }

    fileData.forEach((file) => {
      const directory = dirname(join(this.outputPath, this.options.contentFolder, file.path));
      if (!existsSync(directory)) {
        mkdirp.sync(dirname(join(this.outputPath, this.options.contentFolder, file.path)));
      }

      console.log(file.path);
      const serialized = this.contentSerializer.serialize(file);

      writeFileSync(
        join(
          this.outputPath,
          this.options.contentFolder,
          `${join(dirname(file.path), basename(file.path, '.md'))}.json`
        ),
        JSON.stringify(serialized)
      );
    });

    const all = fileData.map((file) => {
      const directory = dirname(join(this.outputPath, this.options.contentFolder, file.path));
      if (!existsSync(directory)) {
        mkdirp.sync(dirname(join(this.outputPath, this.options.contentFolder, file.path)));
      }

      return this.contentSerializer.serialize(file).data;
    });

    writeFileSync(
      join(
        this.outputPath,
        `${this.options.contentFolder}.json`,
      ),
      JSON.stringify({data: all})
    );
  }
}

module.exports = BroccoliStaticSiteJson;
