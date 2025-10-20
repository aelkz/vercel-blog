#!/usr/bin/env python3
"""
HTML to MDX Converter
Converts HTML blog posts to MDX format, properly extracting content from <pre class="hljs"><code> tags
"""

import os
import re
import sys
from html.parser import HTMLParser
from datetime import datetime
import html as html_module

class BlogHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.in_date = False
        self.in_post_body = False
        self.in_pre = False
        self.in_code = False
        self.title = ""
        self.date = ""
        self.content = []
        self.current_pre_content = []
        self.code_language = ""
        self.skip_content = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # Extract title from h1.entry-title
        if tag == 'h1' and attrs_dict.get('class') == 'entry-title':
            self.in_title = True

        # Extract date from time.entry-date
        if tag == 'time' and 'entry-date' in attrs_dict.get('class', ''):
            self.in_date = True

        # Start capturing post body
        if tag == 'div' and 'post-body' in attrs_dict.get('class', ''):
            self.in_post_body = True

        if not self.in_post_body:
            return

        # Handle code blocks with proper language detection
        if tag == 'pre' and 'hljs' in attrs_dict.get('class', ''):
            self.in_pre = True
            self.current_pre_content = []

        if tag == 'code' and self.in_pre:
            self.in_code = True
            # Extract language from class like "hljs language-bash"
            class_attr = attrs_dict.get('class', '')
            lang_match = re.search(r'language-(\w+)', class_attr)
            if lang_match:
                self.code_language = lang_match.group(1)
            else:
                self.code_language = ""

        # Convert other HTML tags to markdown
        if not self.in_pre:
            if tag == 'h1':
                self.content.append('\n# ')
            elif tag == 'h2':
                self.content.append('\n## ')
            elif tag == 'h3':
                self.content.append('\n### ')
            elif tag == 'h4':
                self.content.append('\n#### ')
            elif tag == 'h5':
                self.content.append('\n##### ')
            elif tag == 'h6':
                self.content.append('\n###### ')
            elif tag == 'p':
                self.content.append('\n\n')
            elif tag == 'br':
                self.content.append('\n')
            elif tag == 'strong' or tag == 'b':
                self.content.append('**')
            elif tag == 'em' or tag == 'i':
                self.content.append('_')
            elif tag == 'a':
                href = attrs_dict.get('href', '')
                self.content.append(f'[')
                self.link_href = href
            elif tag == 'img':
                src = attrs_dict.get('src', '')
                alt = attrs_dict.get('alt', '')
                # Extract filename from src
                if src:
                    filename = os.path.basename(src.split('?')[0])
                    self.content.append(f'\n![{alt}](/images/{{slug}}/{filename})\n')
            elif tag == 'ul':
                self.content.append('\n')
            elif tag == 'ol':
                self.content.append('\n')
            elif tag == 'li':
                self.content.append('\n- ')
            elif tag == 'table':
                self.content.append('\n')

    def handle_endtag(self, tag):
        if tag == 'h1' and self.in_title:
            self.in_title = False

        if tag == 'time' and self.in_date:
            self.in_date = False

        if tag == 'div' and self.in_post_body:
            # Check if this is the closing post-body div
            # This is a simplification; in practice you'd need to track div depth
            pass

        if not self.in_post_body:
            return

        if tag == 'code' and self.in_code:
            self.in_code = False

        if tag == 'pre' and self.in_pre:
            self.in_pre = False
            # Add the complete code block to content
            code_text = ''.join(self.current_pre_content)
            # Decode HTML entities
            code_text = html_module.unescape(code_text)

            if self.code_language:
                self.content.append(f'\n```{self.code_language}\n{code_text}\n```\n')
            else:
                self.content.append(f'\n```\n{code_text}\n```\n')
            self.current_pre_content = []
            self.code_language = ""

        if not self.in_pre:
            if tag == 'strong' or tag == 'b':
                self.content.append('**')
            elif tag == 'em' or tag == 'i':
                self.content.append('_')
            elif tag == 'a':
                if hasattr(self, 'link_href'):
                    self.content.append(f']({self.link_href})')
                    delattr(self, 'link_href')
            elif tag == 'h1' or tag == 'h2' or tag == 'h3' or tag == 'h4' or tag == 'h5' or tag == 'h6':
                self.content.append('\n')

    def handle_data(self, data):
        if self.in_title:
            self.title = data.strip()
        elif self.in_date:
            self.date = data.strip()
        elif self.in_post_body:
            if self.in_pre and self.in_code:
                # Capture code content as-is
                self.current_pre_content.append(data)
            elif not self.in_pre:
                # Skip script/style content and certain divs
                if data.strip():
                    # Clean up the data
                    clean_data = html_module.unescape(data)
                    clean_data = re.sub(r'\s+', ' ', clean_data)
                    self.content.append(clean_data)

def convert_html_to_mdx(html_file_path, output_dir):
    """Convert HTML file to MDX format"""

    print(f"Processing: {html_file_path}")

    # Read HTML file
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Parse HTML
    parser = BlogHTMLParser()
    parser.feed(html_content)

    # Extract metadata
    title = parser.title
    date_str = parser.date

    # Parse date
    try:
        # Try different date formats
        for fmt in ['%d %B', '%B %d', '%d %b', '%b %d']:
            try:
                date_obj = datetime.strptime(date_str, fmt)
                # Use current year if not specified
                date_obj = date_obj.replace(year=datetime.now().year)
                published_date = date_obj.strftime('%Y-%m-%d')
                break
            except:
                continue
        else:
            # Default to today
            published_date = datetime.now().strftime('%Y-%m-%d')
    except:
        published_date = datetime.now().strftime('%Y-%m-%d')

    # Get slug from title
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')

    # Get content
    content_text = ''.join(parser.content)

    # Clean up content
    content_text = re.sub(r'\n{3,}', '\n\n', content_text)  # Remove excessive newlines
    content_text = re.sub(r'&nbsp;', ' ', content_text)  # Remove &nbsp;
    content_text = content_text.strip()

    # Replace {slug} placeholder in image paths
    content_text = content_text.replace('/images/{slug}/', f'/images/{slug}/')

    # Get description (first 150 chars)
    description = content_text[:150].replace('\n', ' ').strip()
    if len(content_text) > 150:
        description += '...'

    # Create frontmatter
    frontmatter = f"""---
title: "{title}"
publishedDate: "{published_date}"
lastUpdatedDate: "{published_date}"
tags:
  - technology
description: "{description}"
status: published
---

"""

    # Create full MDX content
    mdx_content = frontmatter + content_text

    # Write MDX file
    output_file = os.path.join(output_dir, f"{slug}.mdx")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(mdx_content)

    print(f"✓ Created: {output_file}")
    print(f"  Title: {title}")
    print(f"  Date: {published_date}")
    print(f"  Slug: {slug}")

    return slug

if __name__ == "__main__":
    # Get the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    # File paths
    import_dir = os.path.join(project_root, "_temp")
    output_dir = os.path.join(project_root, "content/posts")

    files = [
        "some-page-to-be-converted.html",
    ]

    created_files = []

    for filename in files:
        file_path = os.path.join(import_dir, filename)
        if os.path.exists(file_path):
            try:
                slug = convert_html_to_mdx(file_path, output_dir)
                created_files.append((filename, slug))
            except Exception as e:
                print(f"✗ Error processing {filename}: {str(e)}")
                import traceback
                traceback.print_exc()
        else:
            print(f"✗ File not found: {file_path}")

    print("\n=== Summary ===")
    print(f"Successfully converted {len(created_files)} files:")
    for orig, slug in created_files:
        print(f"  - {orig} → {slug}.mdx")
