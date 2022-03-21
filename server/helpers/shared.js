'use strict';

exports.getValidUrl = (url) => {
  if (url === '' || url === undefined) return '';
  let newUrl = decodeURIComponent(url);
  newUrl = newUrl.trim().replace(/\s/g, '');

  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }

  return newUrl;
};
