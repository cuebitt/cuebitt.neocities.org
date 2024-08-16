/*
	wiMDy - A simple markdown blog renderer
	by Cuebitt (cuebitt.neocities.org) <3

  Supports GFM, frontmatter, and syntax highlighting
*/

import remarkParse from "https://esm.sh/remark-parse@11?bundle";
import remarkRehype from "https://esm.sh/remark-rehype@11?bundle";
import remarkFrontmatter from "https://esm.sh/remark-frontmatter@5?bundle";
import remarkGfm from "https://esm.sh/remark-gfm@4?bundle";
import rehypeStringify from "https://esm.sh/rehype-stringify@10?bundle";
import rehypeHighlight from "https://esm.sh/rehype-highlight@6?bundle";

import { matter } from "https://esm.sh/vfile-matter@5";
import { unified } from "https://esm.sh/unified@11";

import DOMPurify from "https://esm.sh/dompurify@3.1.6";

// browser query parameters proxy
const PARAMS = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

// DOM elements
const archive_list = document.getElementById("archive-list");

const blog_post = document.getElementById("blog-post");
const blog_post_heading = document.getElementById("post-heading");
const blog_post_title = document.getElementById("post-title");
const blog_post_subtitle = document.getElementById("post-subtitle");

const loader_wrapper = document.getElementById("loader-wrapper");

// unified plugin to parse frontmatter
function MatterPlugin() {
  return function (tree, file) {
    matter(file);
  };
}

// fetch markdown post and parse it
const getPost = async (post_file) => {
  const postR = await fetch(`/blog/posts/${post_file}.md`);

  if (!postR.ok) {
    document.getElementById("blog-post").innerHTML = "Post not found";
    return;
  }

  const postText = await postR.text();

  // Parse markdown text content
  const output = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(MatterPlugin)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeHighlight)
    .process(postText);

  return {
    frontmatter: output.data.matter,
    content: output.value,
  };
};

// generate archive list from posts.json
const generateArchiveList = async () => {
  const { posts } = await (await fetch("/blog/posts.json")).json();

  const post_item_template = document.getElementById("archive-template");
  const post_links = posts.map((post) => {
    const post_link = post_item_template.content.cloneNode(true);

    const post_a = post_link.querySelector("a");
    post_a.href = `/blog.html?post=${post.file.replace(".md", "")}`;
    post_a.textContent = `${post.archive_date} - ${post.archive_title}`;

    return post_link;
  });

  return post_links;
};

// render post or archive on page load
if (PARAMS.post) {
  archive_list.classList.add("hidden");
  blog_post.classList.remove("hidden");

  getPost(PARAMS.post).then((post) => {
    // process frontmatter
    if ("title" in post.frontmatter) {
      blog_post_title.textContent = post.frontmatter.title;
      blog_post_title.classList.remove("hidden");
    }

    const subtitle = [];
    if ("author" in post.frontmatter) {
      blog_post_heading.classList.remove("hidden");
      subtitle.push(`by ${post.frontmatter.author}`);
    }
    if ("date" in post.frontmatter) {
      blog_post_heading.classList.remove("hidden");

      // this is kind of a hack, todo fix this later
      let postDate = post.frontmatter.date.split("-").reverse().join("/");

      subtitle.push(postDate);
    }

    // render subtitle, if present
    blog_post_subtitle.textContent = subtitle.join(", ");

    // sanitize and render post content
    loader_wrapper.classList.add("hidden");
    blog_post.innerHTML = DOMPurify.sanitize(post.content);
  });
} else {
  archive_list.classList.remove("hidden");
  blog_post.classList.add("hidden");

  // generate archive list and append it to the DOM
  generateArchiveList().then((posts) => {
    loader_wrapper.classList.add("hidden");
    posts.forEach((post) => {
      archive_list.appendChild(post);
    });
  });
}
