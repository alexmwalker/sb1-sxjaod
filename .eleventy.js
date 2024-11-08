const sass = require('sass');
const path = require('path');
const fs = require('fs');

var md = require('markdown-it')().use(require('markdown-it-footnote'));
//import markdownItFootnote from 'markdown-it-footnote';

function configureMarkdownIt() {
  // Reference: https://github.com/markdown-it/markdown-it-container/issues/23
  return markdownIt({ html: true })
    .use(markdownItAttrs)
    .use(markdownItFootnote)
    .use(markdownItContainer, 'dynamic', {
      validate: function () {
        return true;
      },
      render: function (tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return '<div class="' + token.info.trim() + '">';
        } else {
          return '</div>';
        }
      },
    });
}

module.exports = function (eleventyConfig) {
  // Watch SCSS files
  eleventyConfig.addWatchTarget('./src/scss/');

  // Pass through copy for CSS
  eleventyConfig.addPassthroughCopy('src/css');

  // Add current year shortcode
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode('addIcon', (iconName) => {
    return `<div class="icon i-${iconName}"></div>`;
  });

  eleventyConfig.addPairedShortcode(
    'classWrapper',
    (content, className = 'flow-content') => {
      return `<div class="${className}"> ${content} </div>`;
    }
  );

  eleventyConfig.addPairedShortcode(
    'contentContainer',
    (content, className = 'flow-content') => {
      return `<div class="${className}"> ${content} </div>`;
    }
  );

  eleventyConfig.addPairedShortcode('statContainer', (content) => {
    return `<div class='stat-container'>${content}</div>`;
  });

  eleventyConfig.addPairedShortcode(
    'statBlock',
    (content, bgcolor = 'blue-bg') => {
      return `<div class="col stat-block ${bgcolor}"> ${content} </div>`;
    }
  );

  eleventyConfig.addPairedShortcode(
    'summaryBlock',
    (content, summaryTitle = 'WE HAVE THE POWER TO MAKE A DIFFERENCE') => {
      // Function to format the title
      const formatTitle = (title) => {
        // Convert the title to lower case and capitalize the first letter
        return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
      };

      return `<div class="summary">
            <h3>${formatTitle(summaryTitle)}</h3>
            <div class="container">${content}</div>
        </div>`;
    }
  );
  // Compile SCSS before build
  eleventyConfig.on('beforeBuild', () => {
    const sassResult = sass.compile('src/scss/main.scss');
    fs.mkdirSync('src/css', { recursive: true });
    fs.writeFileSync('src/css/main.css', sassResult.css);
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};
