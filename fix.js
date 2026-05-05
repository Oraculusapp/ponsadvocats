const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
let js = scriptMatch[1];

// Fix 1: logo JPG → WebP (double quotes)
js = js.replace(/"LOGO PONS\.jpg"/g, '"logo.webp"');

// Fix 2: logo - add explicit width/height for CLS
const oldLogo = '{src:"logo.webp",alt:"Pons Advocats",style:{display:\'block\',height:h,width:\'auto\',borderRadius:light?4:0,padding:light?\'6px 10px\':0,background:light?\'rgba(255,255,255,0.92)":\'transparent\'}}';
// Use indexOf to find and replace precisely
const logoAttrOld = `{src:"logo.webp",alt:"Pons Advocats",style:{display:'block',height:h,width:'auto',borderRadius:light?4:0,padding:light?'6px 10px':0,background:light?'rgba(255,255,255,0.92)':'transparent'}}`;
const logoAttrNew = `{src:"logo.webp",alt:"Pons Advocats",width:Math.round(h*2.48),height:h,style:{display:'block',height:h,width:'auto',borderRadius:light?4:0,padding:light?'6px 10px':0,background:light?'rgba(255,255,255,0.92)':'transparent'}}`;
js = js.replace(logoAttrOld, logoAttrNew);
js = js.replace(logoAttrOld, logoAttrNew); // second instance (footer)

// Fix 3: team photos - wrap in <picture> with WebP
const oldImg = `createElement("img",{src:p.photo,alt:p.name,style:{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'}})`;
const newPic = `createElement("picture",null,createElement("source",{type:"image/webp",srcSet:p.photo==="antonio.jpg.jpg"?"antonio.webp":"mariona.webp"}),createElement("img",{src:p.photo,alt:p.name,width:260,height:320,style:{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'},loading:"lazy",decoding:"async"}))`;
js = js.replaceAll(oldImg, newPic);

console.log('logo.webp refs:', (js.match(/logo\.webp/g)||[]).length);
console.log('picture/webp elements:', (js.match(/image\/webp/g)||[]).length);
console.log('logo width attr:', js.includes('Math.round(h*2.48)'));

// Rebuild index.html
html = html.replace(/<script>([\s\S]*?)<\/script>(\s*<\/body>)/, '<script>' + js + '</script>$2');
fs.writeFileSync('index.html', html);
fs.writeFileSync('app.js', js);
console.log('Done. HTML:', (html.length/1024).toFixed(1)+'KB');
