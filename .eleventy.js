const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(lazyImagesPlugin);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    "./node_modules/@glidejs/glide/dist/glide.min.js" : "./static/js/glide.min.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
    "./node_modules/@glidejs/glide/dist/css/glide.core.min.css":
      "./static/css/glide.core.min.css",
      "./node_modules/@glidejs/glide/dist/css/glide.theme.min.css":
      "./static/css/glide.theme.min.css",  
  });

  //create collections
  eleventyConfig.addCollection('pages', async (collection) => {
    return collection.getFilteredByGlob('./src/pages/*.md');
  });
  eleventyConfig.addCollection('references', async (collection) => {
    return collection.getFilteredByGlob('./src/references/*.md');
  });


  function sortByOrder(values) {
    let vals = [...values]; 
    return vals.sort((a, b) => Math.sign(a.data.order - b.data.order));
  }

  eleventyConfig.addFilter("sortByOrder", sortByOrder);

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  eleventyConfig.addPassthroughCopy("./src/static/js");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
