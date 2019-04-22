'use strict';

// Distills the Html at a given URL to just its readable components
// TODO: Use xpath from a config file and remove hard-coded strings

import { Article } from './article';

export async function distillArticle(url: string): Promise<Article> {

  const fullUrl: string = 'api/1.0/News/Articles/' + encodeURIComponent(url);

  const response = await fetch(fullUrl, {
    method: "GET",
  });
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const title = {
    type: "title",
    content: getTitle(doc)
  }

  let article: Article = {
    organization: getOrganization(doc),
    url: decodeURIComponent(url),
    title: getTitle(doc),
    byline: getByline(doc),
    authors: getAuthors(doc),
    introImageUrl: getImage(doc),
    paragraphs: getParagraphs(doc)
  };

  return article;
}

function getOrganization(doc: Document): string {

  const title = doc
    .evaluate("//title", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    .iterateNext()
    .textContent || '';

  return title;
}

function getTitle(doc: Document): string {

  const title = doc
    .evaluate("//article//h1", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    .iterateNext()
    .textContent || '';

  return title;
}

function getImage(doc: Document): string {

  const imageNode = doc
    .evaluate("//article//figure//img/@src", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    .iterateNext();

  if (imageNode) {
    return imageNode.textContent || '';
  }
  else {
    return '';
  }
}

function getByline(doc: Document): string {

  const byline = doc
    .evaluate("//article//h2", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    .iterateNext()
    .textContent || '';

  return byline;
}

function getParagraphs(doc: Document): string[] {

  let paragraphs: string[] = [];

  const iterator = doc.evaluate("//article//p", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

  try {
    let thisNode = iterator.iterateNext();

    while (thisNode) {
      const paragraph = thisNode.textContent || ''; // TODO: Implement ?? ''; when available
      // console.info(paragraph);

      paragraphs.push(paragraph);
      thisNode = iterator.iterateNext();
    }
  }
  catch (e) {
    console.error('Error: Document tree modified during iteration ' + e);
  }

  return paragraphs;
}

function getAuthors(doc: Document): string {
  // TODO: Implement
  let authors: string = "";
  return authors;
}