---
title: Hello World
date: 2024-08-08
author: Cuebitt
---

![it fucken WIMDY](https://files.catbox.moe/v55czy.png)

I've been meaning to add a blog to my Neocities site for quite a while now (I've had "blog" listed in my [Webgarden Pot](/greenhouse/) for months now. oops!). So I searched for a suitable solution, and I didn't really find one that I liked. So, in the spirit of needlessly reinventing the wheel, I made my own hacked together solution.

## Existing Solutions

The existing blogging solutions I found online were either not very Neocities-ish (SSGs like 11ty or Hugo) or not really conforming with the way I like to organize my website's files (Zonelets). That's not to say I think any of these projects are bad, they're just not a great fit for my Neocities site.

## What I Want

The blog portion of my site should have the following features:

1. No build step
   - The rest of my site doesn't use a build tool, so why start now?
2. No frontend framework
   - This is Neocities, after all.
3. Only 1 HTML document that all the posts share
   - Personally I think having a huge collection of HTML documents is hard to manage and kinda error prone.
   - I want to change something in the `head` tag or some shared formatting, I would have to change all of them 🥲.
4. Markdown-based posts
   - This is just my personal preference. I could write the posts in HTML, but Markdown is easier for me to manage.
5. Direct links to posts
   - I'm not gonna make someone click through a bunch of stuff to get to a post. I'd rather my posts be directly linkable instead.
6. Code syntax highlighting
   - I'm a software developer, after all.

And as a bonus:

7. Portable
   - I want _you_ to be able to add a blog to your site using my blog system!

I don't really want to manage comments or other social features, so I'm leaving all that stuff out. I also want to minimize the amount of `npm` packages my site depends on... but that's a problem for later.

## What I Ended Up With

To add a blog to my site, I've created a (very) simple barebones blogging system I'm calling "wiMDy". (the "MD" being "Markdown", of course). It uses a query parameter in the URL to select a blog post from a Markdown file and converts it to HTML when the page loads. It's a _little_ slower than pre-generated HTML, but this way I'm not managing individual HTML files.

I've used `remark` and `rehype` to parse (GitHub-flavored) Markdown files and generate HTML for my blog posts. I'm not really satisfied with bringing in so many dependencies, but I couldn't find a better way to parse Markdown files with YAML frontmatter

## How You Can Use It

(I'm not ready to distribute wiMDy quite yet, but I'll post a link here once I'm finished with it.)

Adding wiMDy to your own site is pretty simple:

1. Place the `blog.html` file at the your website's root directory. (the topmost folder, typically your `index.html` homepage is in the same location)
2. Place the `blog` folder in your website's root directory.
3. Modify the `blog.html` and `blog.css` files to your liking. They are intentionally unstyled so you can customize them yourself.

Then, to create a blog post:

1. Create Markdown files in the `blog/posts` directory. They should have no spaces in the file name and end in `.md`
   1. If you don't know how to write in Markdown, it's easy! [Here's a beginner guide](https://www.markdownguide.org/basic-syntax/).
2. Add the post to the `posts.json` file. Don't forget the comma between each post! You can copy the following template:

```json
{
  "file": "hello_world.md",
  "archive_title": "Hello World",
  "archive_date": "2024-08-08"
}
```

![add post demo](blog/posts/hello_world_assets/add_post_demo.png)

You can now access the blog post at `(your site name).neocities.org/blog.html?post={file name here}`! Replace `{file name here}` with the name of the `.md` file in the posts folder without `.md` at the end. (For example, this post is located in the file `hello_world.md` and can be accessed at `cuebitt.neocities.org/blog/post?=hello_world`.)

You can also optionally add metadata to the blog post Markdown file via YAML frontmatter. To do so, add this at the beginning of the Markdown file:

```
---
title: Title Here
author: Author Here
date: YYYY-MM-DD
---
```

Make sure you remember to add the three dashes (`---`) to the beginning and end of the frontmatter section. The information from the YAML frontmatter will be added to the top of the blog post!

## What Now?

I'm not done putting the finishing touches on wiMDy yet, so some of the details above may change. Feel free to customize the look of the page however you like! The parts of the HTML document that shouldn't be removed are labeled with comments, and each file is attributed to me so you don't have to credit me anywhere in your site. But if you want to, I would appreciate it 🥰. Hopefully you find wiMDy as useful as I do!
