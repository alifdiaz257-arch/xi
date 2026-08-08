import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors-anywhere.herokuapp.com/',
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  let lastError = null;
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': '*/*',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
      });
      clearTimeout(timeout);
      if (response.ok) {
        return response;
      }
      throw new Error('HTTP ' + response.status);
    } catch (e) {
      lastError = e;
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
  throw lastError || new Error('Gagal fetch setelah ' + retries + ' percobaan');
}

async function fetchHtml(url) {
  try {
    const r = await fetchWithRetry(url);
    const text = await r.text();
    if (text && text.length > 100) return text;
  } catch (e) {}

  for (const proxy of PROXIES) {
    try {
      const proxyUrl = proxy + encodeURIComponent(url);
      const r = await fetchWithRetry(proxyUrl, {
        headers: {
          'Origin': 'https://scrape-website.vercel.app',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const text = await r.text();
      if (text && text.length > 100) {
        if (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('<body') ||
            text.includes('window.') || text.includes('document.') || text.includes('{"')) {
          return text;
        }
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('Gagal fetch website setelah semua percobaan');
}

async function fetchAsset(url) {
  try {
    const r = await fetchWithRetry(url);
    return await r.blob();
  } catch (e) {}

  for (const proxy of PROXIES) {
    try {
      const proxyUrl = proxy + encodeURIComponent(url);
      const r = await fetchWithRetry(proxyUrl, {
        headers: {
          'Origin': 'https://scrape-website.vercel.app',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const blob = await r.blob();
      if (blob && blob.size > 0) {
        return blob;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('Gagal fetch asset');
}

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const image = ['jpg','jpeg','png','gif','webp','avif','bmp','ico','tiff','svg'];
  const video = ['mp4','webm','ogg','mov','avi','mkv','flv','wmv','m4v','3gp','mpeg','mpg'];
  const audio = ['mp3','wav','aac','flac','m4a','ogg','wma','aiff','alac','opus'];
  const font = ['woff','woff2','ttf','otf','eot','fon'];
  const script = ['js','mjs','ts','jsx','tsx','cjs','mjs'];
  const style = ['css','scss','less','sass','styl','postcss'];
  const json = ['json','jsonld','geojson','topojson'];
  const xml = ['xml','rss','atom','xhtml','xslt','xsd','dtd'];
  const pdf = ['pdf'];
  const zip = ['zip','rar','7z','tar','gz','bz2','xz','tgz'];
  const php = ['php','phtml','php3','php4','php5','php7','phps'];
  const python = ['py','pyc','pyo','pyd','pyw'];
  const txt = ['txt','md','markdown','rst','text','log','csv','tsv','rtf'];

  if (image.includes(ext)) return 'image';
  if (video.includes(ext)) return 'video';
  if (audio.includes(ext)) return 'audio';
  if (font.includes(ext)) return 'font';
  if (script.includes(ext)) return 'script';
  if (style.includes(ext)) return 'style';
  if (json.includes(ext)) return 'json';
  if (xml.includes(ext)) return 'xml';
  if (pdf.includes(ext)) return 'pdf';
  if (zip.includes(ext)) return 'zip';
  if (php.includes(ext)) return 'php';
  if (python.includes(ext)) return 'python';
  if (txt.includes(ext)) return 'txt';
  if (ext === 'html' || ext === 'htm' || ext === 'xhtml') return 'html';
  return 'file';
}

function getFileName(url) {
  try {
    const u = new URL(url);
    let path = u.pathname;
    if (path.endsWith('/')) path += 'index.html';
    const parts = path.split('/');
    let name = parts.pop() || 'index.html';
    if (!name.includes('.')) name += '.html';
    return { name, path: parts.join('/') };
  } catch {
    return { name: 'unknown', path: '' };
  }
}

function resolveUrl(src, baseUrl) {
  try {
    if (!src) return null;
    if (src.startsWith('data:')) return null;
    if (src.startsWith('javascript:')) return null;
    if (src.startsWith('#')) return null;
    if (src.startsWith('mailto:')) return null;
    if (src.startsWith('tel:')) return null;
    if (src.startsWith('blob:')) return null;
    return new URL(src, baseUrl).href;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL diperlukan' }, { status: 400 });
    }

    let validUrl;
    try {
      validUrl = new URL(url).href;
    } catch {
      return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
    }

    const baseOrigin = new URL(validUrl).origin;
    const html = await fetchHtml(validUrl);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const assets = [];
    const foundUrls = new Set();

    assets.push(validUrl);
    foundUrls.add(validUrl);

    const extractors = [
      { selector: 'link[rel="stylesheet"]', attr: 'href' },
      { selector: 'link[rel="icon"]', attr: 'href' },
      { selector: 'link[rel="apple-touch-icon"]', attr: 'href' },
      { selector: 'link[rel="preload"]', attr: 'href' },
      { selector: 'link[rel="manifest"]', attr: 'href' },
      { selector: 'script[src]', attr: 'src' },
      { selector: 'img[src]', attr: 'src' },
      { selector: 'video[src]', attr: 'src' },
      { selector: 'audio[src]', attr: 'src' },
      { selector: 'source[src]', attr: 'src' },
      { selector: 'iframe[src]', attr: 'src' },
      { selector: 'embed[src]', attr: 'src' },
      { selector: 'object[data]', attr: 'data' },
      { selector: 'track[src]', attr: 'src' },
    ];

    extractors.forEach(({ selector, attr }) => {
      doc.querySelectorAll(selector).forEach(el => {
        const val = el.getAttribute(attr);
        if (val) {
          const resolved = resolveUrl(val, validUrl);
          if (resolved && resolved.startsWith(baseOrigin) && !foundUrls.has(resolved)) {
            assets.push(resolved);
            foundUrls.add(resolved);
          }
        }
      });
    });

    doc.querySelectorAll('*[style]').forEach(el => {
      const style = el.getAttribute('style');
      if (style) {
        const matches = style.match(/url\(["']?([^"')]+)["']?\)/g);
        if (matches) {
          matches.forEach(m => {
            const u = m.match(/url\(["']?([^"')]+)["']?\)/);
            if (u && u[1]) {
              const resolved = resolveUrl(u[1], validUrl);
              if (resolved && resolved.startsWith(baseOrigin) && !foundUrls.has(resolved)) {
                assets.push(resolved);
                foundUrls.add(resolved);
              }
            }
          });
        }
      }
    });

    const urlAttrs = ['src', 'href', 'data', 'poster', 'srcset', 'data-src', 'data-srcset', 'action', 'formaction'];
    doc.querySelectorAll('*').forEach(el => {
      urlAttrs.forEach(attr => {
        const val = el.getAttribute(attr);
        if (val) {
          if (attr === 'srcset' || attr === 'data-srcset') {
            const urls = val.split(',').map(s => s.trim().split(' ')[0]);
            urls.forEach(u => {
              if (u && !u.startsWith('data:')) {
                const resolved = resolveUrl(u, validUrl);
                if (resolved && resolved.startsWith(baseOrigin) && !foundUrls.has(resolved)) {
                  assets.push(resolved);
                  foundUrls.add(resolved);
                }
              }
            });
          } else if (val && !val.startsWith('data:') && !val.startsWith('javascript:') && !val.startsWith('#') &&
                     !val.startsWith('mailto:') && !val.startsWith('tel:') && !val.startsWith('blob:')) {
            const resolved = resolveUrl(val, validUrl);
            if (resolved && resolved.startsWith(baseOrigin) && !foundUrls.has(resolved)) {
              const ext = resolved.split('.').pop().toLowerCase();
              if (['jpg','jpeg','png','gif','webp','avif','bmp','ico','tiff','svg','css','js','json','xml','txt',
                   'pdf','zip','rar','7z','tar','gz','mp4','webm','ogg','mov','avi','mkv','mp3','wav','aac','flac',
                   'woff','woff2','ttf','otf','eot','php','py','rss','atom','jsonld','csv','tsv'].includes(ext)) {
                assets.push(resolved);
                foundUrls.add(resolved);
              }
            }
          }
        }
      });
    });

    const uniqueAssets = [...new Set(assets)].slice(0, 300);

    const domain = new URL(validUrl).hostname;
    const JSZip = require('jszip');
    const zip = new JSZip();

    const fileData = [];
    const failed = [];
    let downloaded = 0;
    const total = uniqueAssets.length;

    for (const assetUrl of uniqueAssets) {
      const { name } = getFileName(assetUrl);
      try {
        const blob = await fetchAsset(assetUrl);
        const { name: fileName, path: dirPath } = getFileName(assetUrl);
        const fullPath = dirPath ? dirPath + '/' + fileName : fileName;
        const fileType = getFileType(fileName);

        zip.file(fullPath, blob);
        const size = blob.size || 0;
        fileData.push({ name: fileName, path: fullPath, type: fileType, size });
        downloaded++;
      } catch (err) {
        failed.push(assetUrl);
      }
    }

    zip.file('index.html', html);
    fileData.push({ name: 'index.html', path: 'index.html', type: 'html', size: html.length });

    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    const sizeStr = (zipBlob.size / 1024).toFixed(1) + ' KB';

    const zipBase64 = Buffer.from(await zipBlob.arrayBuffer()).toString('base64');

    return NextResponse.json({
      success: true,
      zip: zipBase64,
      fileName: domain + '_' + new Date().toISOString().slice(0,10) + '.zip',
      fileCount: downloaded,
      failedCount: failed.length,
      size: sizeStr,
      files: fileData,
    });

  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat scraping',
    }, { status: 500 });
  }
}