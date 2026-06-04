module.exports = function(eleventyConfig) {
  // Pass v52 HTML files through unchanged at original paths
  eleventyConfig.addPassthroughCopy({"src/*.html": "/"});
  eleventyConfig.addPassthroughCopy({"src/*.png": "/"});
  eleventyConfig.addPassthroughCopy({"src/*.jpg": "/"});
  eleventyConfig.addPassthroughCopy({"src/*.jpeg": "/"});
  eleventyConfig.addPassthroughCopy({"src/*.ico": "/"});
  eleventyConfig.addPassthroughCopy({"src/*.svg": "/"});
  eleventyConfig.addPassthroughCopy({"src/uploads": "/uploads"});
  eleventyConfig.addPassthroughCopy({"src/admin": "/admin"});

  // Date filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
const adjusted = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // Body block renderer: paragraphs, images with captions, pull quotes, raw HTML
  eleventyConfig.addFilter("renderBody", function(blocks) {
    if (!blocks) return "";
    if (typeof blocks === "string") return blocks;
    if (!Array.isArray(blocks)) return "";
    return blocks.map(b => {
      if (!b) return "";
      if (b.type === "text" && b.text) {
        return b.text.split(/\n\s*\n/)
          .filter(p => p.trim())
          .map(p => "<p>" + p.replace(/\n/g, "<br>") + "</p>")
          .join("\n");
      }
      if (b.type === "image" && b.image) {
        const caption = b.caption ? '<p class="img-caption" style="text-align:center;">' + b.caption + '</p>' : '';
        return '<figure class="inline-image" style="margin: 32px 0;"><img src="' + b.image + '" alt="' + (b.alt || '') + '" style="width:100%;display:block;" />' + caption + '</figure>';
      }
      if (b.type === "quote" && b.text) {
        return '<blockquote style="font-size: 24px; font-style: italic; color: var(--neon); border-left: 3px solid var(--neon); padding-left: 24px; margin: 36px 0; line-height: 1.5;">' + b.text + '</blockquote>';
      }
      if (b.type === "html" && b.html) {
        return b.html;
      }
      return "";
    }).join("\n");
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: false,
    dataTemplateEngine: "njk"
  };
};
