if(!self.define){let i,e={};const n=(n,d)=>(n=new URL(n+".js",d).href,e[n]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=n,i.onload=e,document.head.appendChild(i)}else i=n,importScripts(n),e()})).then((()=>{let i=e[n];if(!i)throw new Error(`Module ${n} didn’t register its module`);return i})));self.define=(d,r)=>{const c=i||("document"in self?document.currentScript.src:"")||location.href;if(e[c])return;let o={};const s=i=>n(i,c),f={module:{uri:c},exports:o,require:s};e[c]=Promise.all(d.map((i=>f[i]||s(i)))).then((i=>(r(...i),o)))}}define(["./workbox-8366b1fe"],(function(i){"use strict";self.addEventListener("message",(i=>{i.data&&"SKIP_WAITING"===i.data.type&&self.skipWaiting()})),i.precacheAndRoute([{url:"css/style.css",revision:"185088eb3f920988c45bf2948f61c5f1"},{url:"css/svg.css",revision:"b57d1f335709f5a8b54d69f0dfdd5ea4"},{url:"img/bg1.png",revision:"a427a16fb637db5ebd21de4edb511269"},{url:"img/favicon.png",revision:"7dedc14dff2e77c9342b3a72108b9c3d"},{url:"img/icon1.png",revision:"607d3fabbb8fdfffa2639b2346b81aae"},{url:"img/icon2.png",revision:"58b8bbac5c876585a5671da305184c14"},{url:"img/icon3.png",revision:"3b163d395437268a76de0dcce5c5627f"},{url:"img/icon4.png",revision:"cfb63ba670c4e3a15373044f18be45f1"},{url:"img/icon5.png",revision:"bcfafd9b8839b52dbde139a4244a01c7"},{url:"img/icon6.png",revision:"b1435134a0ec5d09ee86920bc2162548"},{url:"img/iconsphone/RSS144.png",revision:"d6dbae7df20ef49fe9be3229643c703a"},{url:"img/iconsphone/RSS168.png",revision:"795b95ef40e56dfadb32a2b3664d81b8"},{url:"img/iconsphone/RSS192.png",revision:"05c0dd4d6db778b2441508360abf5c0e"},{url:"img/iconsphone/RSS384.png",revision:"be435494e2b00362fe276cd5a790c3e0"},{url:"img/iconsphone/RSS48.png",revision:"242de94fd95de463bc9df4bb4d59ee2a"},{url:"img/iconsphone/RSS512.png",revision:"929aa645eae35127ad8ce975f75e697f"},{url:"img/iconsphone/RSS72.png",revision:"57856f9109af877b322b5b9ae6865aad"},{url:"img/iconsphone/RSS96.png",revision:"5fafd7ee2e4171167fcac7ebf7aed6e2"},{url:"img/img1.jpg",revision:"edd979d79b7d31d06fbff64364cd3dcf"},{url:"img/img2.jpg",revision:"394834eb882525890763c0d326f1cef1"},{url:"img/img3.jpg",revision:"838875b19948ea16e6826f425c3057d5"},{url:"img/img4.jpg",revision:"b64ad5e7d8c083d88cf8635835b41c37"},{url:"img/img5.jpg",revision:"7770800556a7eee4e2a788d7708d6b1d"},{url:"img/img6.jpg",revision:"6bdf740c3536de25893ae6153a14a5b2"},{url:"img/img7.jpg",revision:"2da25cc6234a74b9f60f09250bfb5316"},{url:"img/img8.jpg",revision:"2ddc3da24dd648cd3f7cadf65bbcd01c"},{url:"img/img9.jpg",revision:"05890700fff5ef08a91c10e04a7ae3b4"},{url:"img/logoRSS.png",revision:"7b94b6fa04b59ab8430455f3b4859792"},{url:"img/skill1.png",revision:"352a7c014e8c3b675d318735d807ac90"},{url:"img/skill2.png",revision:"0611da74cf878cd4a1b8f65741cde618"},{url:"img/skill3.png",revision:"a1ae58e0d7bcec83115d2c1d397d06f2"},{url:"img/skill4.png",revision:"1da25973b58389cf7138419dbef04a58"},{url:"img/skill5.png",revision:"c0ade1ecb6c45c939a5672cd815e2f95"},{url:"img/skill6.png",revision:"576612b70aba107f45940c49f7636cdd"},{url:"img/vectorlogoRSSbordenegro.svg",revision:"698abb248f338baf915d1136c27a6369"},{url:"index.html",revision:"270ad8efc56fab5a59cc1d9030bd0e53"},{url:"js/svgdraw.js",revision:"0aa9b1586c1675f92996a066e09a9fd0"},{url:"manifest.json",revision:"7511448215daa154e1f753b8c956ef35"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
