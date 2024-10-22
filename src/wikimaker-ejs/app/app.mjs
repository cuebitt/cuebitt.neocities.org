import ejs from "https://esm.sh/ejs";
import { sideCard, toc } from "../templates/index.mjs";
import { nanoid } from "https://esm.sh/nanoid@5.0.7";
import { micromark } from "https://esm.sh/micromark@3";
import DOMPurify from "https://esm.sh/dompurify@3.1.7";
import { gfm, gfmHtml } from "https://esm.sh/micromark-extension-gfm@3?bundle";

// alias for convenience
const sanitize = DOMPurify.sanitize;
