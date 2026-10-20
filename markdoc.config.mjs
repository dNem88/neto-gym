import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';
import { nodes as defaultNodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  nodes: {
    ...defaultNodes,
    // Override only the nodes we want custom styling for
    heading: {
      ...defaultNodes.heading,
      render: component('./src/components/markdoc/Heading.astro'),
    },
    paragraph: {
      ...defaultNodes.paragraph,
      render: component('./src/components/markdoc/Paragraph.astro'),
    },
    image: {
      ...defaultNodes.image,
      render: component('./src/components/markdoc/BlogImage.astro'),
    },
    blockquote: {
      ...defaultNodes.blockquote,
      render: component('./src/components/markdoc/Blockquote.astro'),
    },
    list: {
      ...defaultNodes.list,
      render: component('./src/components/markdoc/List.astro'),
    },
    item: {
      ...defaultNodes.item,
      render: component('./src/components/markdoc/ListItem.astro'),
    },
    link: {
      ...defaultNodes.link,
      render: component('./src/components/markdoc/Link.astro'),
    },
    strong: {
      ...defaultNodes.strong,
      render: component('./src/components/markdoc/Strong.astro'),
    },
    em: {
      ...defaultNodes.em,
      render: component('./src/components/markdoc/Emphasis.astro'),
    },
  },
});