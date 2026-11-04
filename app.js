/* Block Relics pre-launch site. Hash router, prompts, leaderboard, chart. No dependencies. */
"use strict";

/* ---------------- toast ---------------- */
var toastTimer = null;
function toast(msg){
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 3200);
}
document.addEventListener('click', function(e){
  var b = e.target.closest('[data-coming]');
  if(b){ e.preventDefault(); toast('Coming soon — mainnet contracts deploy next. Nothing moves funds yet.'); }
});

/* ---------------- router ---------------- */
var ROUTES = ['home','market','mint','looms','creators','airdrop'];
var TITLES = {home:'Block Relics', market:'Live Market', mint:'Mint NFTs', looms:'Forged Looms', creators:'Creator Rewards', airdrop:'Trading Competition'};
function route(){
  var h = (location.hash || '#/').replace('#/','') || 'home';
  if(ROUTES.indexOf(h) < 0) h = 'home';
  document.querySelectorAll('[data-page]').forEach(function(s){ s.hidden = (s.getAttribute('data-page') !== h); });
  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.classList.toggle('active', a.getAttribute('data-route') === h);
  });
  document.title = TITLES[h] + ' — Block Relics';
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);

/* ---------------- AI prompts ---------------- */
var ADDR = '0x… (mainnet address pending)';
var PROMPTS = {
guide: {label:'AI prompt — site guide', text:
'You are the Block Relics site guide. Answer questions about the collection honestly and briefly.\n' +
'THE BASICS: Block Relics is 100,000 black-and-gold geometric relic NFTs on BSC, sold in 10 phases of 10,000. A phase ends the instant it sells out; the whole mint runs inside a 30-day window.\n' +
'PRICING: mint starts at $1 USDT in phase 1 and rises $0.50 per phase ($5.50 in phase 10). Max 10 mints per wallet TOTAL across all phases. No free mints except the creator program.\n' +
'AGENT ID: a free, soulbound, serial-numbered credential (one per wallet, non-transferable). Mandatory before minting anything AND before any buying or selling on the on-site market. Claim UI says "Free Agent ID — small fee required"; the exact total appears in the wallet at signing.\n' +
'MARKET: bid-only, USDT. Buyers escrow bids; sellers accept and settle with their OWN signed transaction (they may command their own AI). Every rule — quotas, floor, phase gates, Agent ID, 2% fee — is enforced as preset conditions in the contract code. No central executor.\n' +
'FLOOR: the owner buy wall guarantees $2 + $1/phase ($11 at phase 10). Nobody but the owner can bid below the floor.\n' +
'LOOMS: burn any 10 Relics to forge 1 dragon Loom ($0.80 fee to owner). Forging unlocks after phase 1; loom selling after phase 2.\n' +
'COMPETITION: $100k trading competition ($60k NFT / $40k loom), buys and sells both count for both sides, paid after the mint ends.\n' +
'CONTRACTS (mainnet pending): AgentID ' + ADDR + ' · RelicNFT ' + ADDR + ' · LoomNFT ' + ADDR + ' · Marketplace ' + ADDR + '.\n' +
'HARD RULES: never invent contract addresses, never promise profits or returns, never claim anything is deployed or live until it is. If unsure, say so.'},

claim: {label:'AI prompt — claim Agent ID', text:
'Walk the user through claiming their Block Relics Agent ID, step by step.\n' +
'WHAT IT IS: a free soulbound credential card — one per wallet, non-transferable, serial-numbered from No. 0001. It is the key to everything: no wallet can mint a Relic or trade (buy or sell) on the on-site market without one.\n' +
'THE FEE: the claim screen says "Free Agent ID — small fee required" and does not advertise an amount. The exact total appears in the wallet at signing (a small BNB fee that goes to the project owner). Never quote a fee amount on the page; the wallet is the source of truth.\n' +
'STEPS: 1) Connect a BSC wallet. 2) Open the Mint page, Agent ID section. 3) Press "Claim Free Agent ID". 4) Review the total in the wallet prompt and sign. 5) The card appears with its serial number.\n' +
'EDGE CASES: one claim per wallet — a second attempt reverts. The card cannot be transferred or sold. If the user loses wallet access, the ID is lost with it.\n' +
'CONTRACT: AgentID ' + ADDR + ' (mainnet pending).\n' +
'HARD RULES: never promise the claim is live before mainnet deployment. Never invent the fee amount.'},

mint: {label:'AI prompt — mint Relics', text:
'Guide the user through minting Block Relics NFTs.\n' +
'PREREQUISITE: the wallet must hold an Agent ID. No Agent ID, no mint — the transaction reverts.\n' +
'PRICING: $1 USDT in phase 1, rising $0.50 every phase to $5.50 in phase 10. The price shown is always the RUNNING phase only.\n' +
'LIMITS: max 10 mints per wallet TOTAL across all phases — not per phase. Each phase holds 10,000 NFTs with phase-ranged token IDs (phase 1 = 1–10,000).\n' +
'TIMING: a phase ends the instant its 10,000 sell out and the next begins immediately. The entire mint closes 30 days after launch no matter what.\n' +
'PAYMENT: USDT on BSC. 100% of mint revenue goes straight to the owner wallet inside the mint transaction — nothing to withdraw later.\n' +
'RARITY: every mint costs the same; rarity (Common → Legendary) is a secondary-market prestige signal only. Forging treats all Relics equally, 10:1.\n' +
'STEPS: 1) Hold an Agent ID. 2) Choose quantity (≤ remaining wallet allowance). 3) Approve USDT, then mint. 4) Tokens appear in the wallet.\n' +
'CONTRACT: RelicNFT ' + ADDR + ' (mainnet pending).\n' +
'HARD RULES: never claim minting is live before deployment. Never promise a specific rarity outcome.'},

buy: {label:'AI prompt — place a buy bid', text:
'Explain how to place a buy bid on the Block Relics market.\n' +
'THE MODEL: the market is BID-ONLY. There are no sell listings. Buyers lock USDT in escrowed bids; a seller accepts a bid when they choose to sell.\n' +
'REQUIREMENTS: the bidder must hold an Agent ID. Public bidding opens after 1,000 total mints (the owner can bid anytime).\n' +
'THE FLOOR: bids must be at or above $2 + $1/phase ($11 at phase 10, holding after the mint ends). Nobody except the owner can bid below the floor — low bids revert at placement, and stale bids cannot fill after the floor rises.\n' +
'BID TYPES: bid on a specific token, or place a collection-wide bid at your price.\n' +
'ESCROW: bid USDT is locked in the Marketplace contract. Cancel anytime to get it back — no permission needed.\n' +
'WHAT HAPPENS NEXT: when a seller accepts your bid, they settle with their own signed transaction. You receive the NFT; the 2% fee goes to the owner; the seller gets the rest.\n' +
'CONTRACT: Marketplace ' + ADDR + ' (mainnet pending).\n' +
'HARD RULES: never present the owner floor promise as live liquidity before real USDT is escrowed. Never invent bid data.'},

sell: {label:'AI prompt — accept a bid & sell', text:
'Walk a seller through accepting a buy bid on the Block Relics market.\n' +
'THE CORE IDEA: the SELLER settles the sale with their own signed transaction — optionally by commanding their own AI ("accept bid #5 for my token #123"). There is no central executor; every rule below is enforced as preset conditions in the contract code, and the sale reverts if any fail.\n' +
'PRE-CHECKS: 1) You hold an Agent ID. 2) You own the token. 3) The marketplace is approved to move it. 4) The market is open.\n' +
'PHASE GATES: no Relic selling in phase 1 (selling opens after Phase-1 end); loom selling opens after phase 2.\n' +
'QUOTAS: each token carries the minter\'s Agent ID binding from birth, and it travels with the token through free transfers. Your quota depends on mints in your join phase: 2–9 mints → 1 sale/phase from J+1; 10 mints → 2 sales/phase from J+1; 0–1 mints → locked until J+2, then 1 per 2 phases. After phase 10 ends, all quotas lift. Only an on-site market sale clears the binding.\n' +
'SETTLEMENT: 2% of the bid goes straight to the owner; you receive the rest in USDT instantly.\n' +
'CONTRACT: Marketplace ' + ADDR + ' (mainnet pending).\n' +
'HARD RULES: never tell the user an owner AI will execute for them. Never promise a sale will succeed — quotas, floor and gates decide.'},

forge: {label:'AI prompt — forge a Loom', text:
'Guide the user through forging a dragon Loom.\n' +
'THE DEAL: burn any 10 Relics to forge 1 Loom. All Relics are equal here — rarity does not matter, 10:1 always.\n' +
'UNLOCKS: forging opens after phase 1 ends. Loom selling opens after phase 2. Max 10,000 Looms can ever exist.\n' +
'THE FEE: $0.80 USDT per Loom, paid to the owner inside the forge transaction.\n' +
'STEPS: 1) Own 10 Relics in one wallet. 2) Approve the Loom contract on the Relic collection. 3) Call forge with the 10 token IDs. 4) The Relics burn and the Loom mints to you.\n' +
'WHY: looms carry a higher buy-wall floor (≈10× the NFT floor + $2 premium, rising faster), which is the flywheel that drives Relic demand.\n' +
'CONTRACT: LoomNFT ' + ADDR + ' (mainnet pending).\n' +
'HARD RULES: never claim forging is live before deployment. Never suggest rarity improves forge odds — it does not.'},

creator: {label:'AI prompt — creator program', text:
'Explain the Block Relics creator program.\n' +
'THE POOL: 5,000 NFTs reserved for creators.\n' +
'ELIGIBILITY: more than 1,000 X followers AND more than 30,000 Telegram followers. Both conditions must hold.\n' +
'THE FLOW: 1) Submit your X and Telegram links. 2) We verify follower counts (partly manual — the X API is paywalled). 3) Publish your promo post about Block Relics. 4) Submit the post link plus your wallet address. 5) You receive a free NFT — counting as 1 mint quota, plus 2 extra sell quota per phase.\n' +
'TOP 10: the ten best-performing creators receive 10 Looms each after all phases end.\n' +
'WHAT TO POST: the collection basics — 100k supply, 10 phases, $1 mint, Agent ID gating, bid-only market, $2 floor promise. Keep claims to published facts; never promise returns or a launch date that isn\'t announced.\n' +
'HARD RULES: never approve anyone yourself and never promise acceptance. Eligibility checks are manual.'},

competition: {label:'AI prompt — trading competition', text:
'Explain the $100,000 Block Relics trading competition.\n' +
'THE POOLS: $60,000 for NFT volume (minimum $1,000 on-site volume to qualify) and $40,000 for Loom volume (minimum $2,000). Two separate leaderboards.\n' +
'HOW VOLUME COUNTS: every on-site trade credits its full USDT volume to BOTH the buyer and the seller. Buys and sells both count — wash between your own wallets still only counts real volume once per side per trade; the contract tracks nftVolume/loomVolume per wallet.\n' +
'RANKING: ranked by volume while the competition is open. The owner freezes the final standings with closeCompetition(). Rewards are paid after the mint ends; the reward token and exact rank splits are announced before close.\n' +
'STRATEGY NOTES: consistent trading beats one big print; both sides of each trade earn credit, so active market-making accumulates fastest.\n' +
'CONTRACT: Marketplace ' + ADDR + ' (mainnet pending) — volume reads come from nftVolume/loomVolume.\n' +
'HARD RULES: never promise a specific payout or rank. Never claim the competition is live before the market opens.'}
};

function buildPrompts(){
  document.querySelectorAll('.prompt[data-prompt]').forEach(function(el){
    var key = el.getAttribute('data-prompt');
    var p = PROMPTS[key];
    if(!p) return;
    var lines = p.text.split('\n');
    var preview = lines.slice(0,3).join('\n');
    el.innerHTML =
      '<div class="prompt-head"><span>'+p.label+'</span><button type="button" class="copy-btn">Copy</button></div>'+
      '<div class="prompt-body"><pre></pre><div class="fade"></div></div>'+
      '<button type="button" class="prompt-toggle">Show full prompt</button>';
    var pre = el.querySelector('pre');
    pre.textContent = preview;
    el.querySelector('.prompt-toggle').addEventListener('click', function(){
      var open = el.classList.toggle('open');
      pre.textContent = open ? p.text : preview;
      this.textContent = open ? 'Show less' : 'Show full prompt';
    });
    el.querySelector('.copy-btn').addEventListener('click', function(){
      var done = function(){ toast('Full prompt copied.'); };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(p.text).then(done, function(){ fallback(); });
      } else { fallback(); }
      function fallback(){
        var ta = document.createElement('textarea');
        ta.value = p.text; document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); done(); }catch(e){ toast('Copy failed — select the text manually.'); }
        document.body.removeChild(ta);
      }
    });
  });
}

/* ---------------- steppers ---------------- */
function stepper(btnAttr, outId, min, max, onChange){
  var out = document.getElementById(outId);
  if(!out) return;
  var v = parseInt(out.textContent,10) || min;
  document.querySelectorAll('['+btnAttr+']').forEach(function(b){
    b.addEventListener('click', function(){
      v = Math.min(max, Math.max(min, v + parseInt(b.getAttribute(btnAttr),10)));
      out.textContent = v;
      if(onChange) onChange(v);
    });
  });
}

/* ---------------- upcoming phases ---------------- */
function buildUpcoming(){
  var box = document.getElementById('upcomingPhases');
  if(!box) return;
  var html = '';
  for(var p=2; p<=10; p++){
    var price = (1 + 0.5*(p-1)).toFixed(2);
    html += '<div class="up"><b>$'+price+'</b><span>Phase '+p+'</span></div>';
  }
  box.innerHTML = html;
}

/* ---------------- floor chart ---------------- */
function buildChart(){
  var svg = document.getElementById('floorChart');
  if(!svg) return;
  var W=640,H=300,padL=40,padB=44,padT=16;
  var cw=(W-padL-8)/10, maxV=11, out='';
  for(var i=1;i<=10;i++){
    var v=2+(i-1), h=(H-padT-padB)*(v/maxV);
    var x=padL+(i-1)*cw+6, y=H-padB-h, w=cw-12;
    out+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="5" fill="url(#gg)"/>'+
         '<text x="'+(x+w/2)+'" y="'+(y-8)+'" text-anchor="middle" fill="#f0c94a" font-size="13" font-weight="700">$'+v+'</text>'+
         '<text x="'+(x+w/2)+'" y="'+(H-padB+20)+'" text-anchor="middle" fill="#a9a396" font-size="11">P'+i+'</text>';
  }
  out+='<line x1="'+padL+'" y1="'+(H-padB)+'" x2="'+W+'" y2="'+(H-padB)+'" stroke="rgba(212,175,55,.4)"/>';
  svg.innerHTML='<defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">'+
    '<stop offset="0" stop-color="#f0c94a"/><stop offset="1" stop-color="#d4af37"/></linearGradient></defs>'+out;
}

/* ---------------- leaderboard ---------------- */
var LB = {
nft: [
  ['0x8f3a…B21c',1241,'$18,420'],['0x1d77…9e04','No. 0317','$15,905'],
  ['0x5b02…77aa','No. 0089','$12,300'],['0xc419…3f6d','No. 1204','$11,760'],
  ['0x92e0…a1b8','No. 0450','$9,880'],['0x3c6f…52d9','No. 2210','$8,415'],
  ['0x77b1…0c3e','No. 0777','$7,200'],['0xae54…f890','No. 1502','$6,540'],
  ['0x09d2…4b71','No. 3318','$5,975'],['0x6f88…d2a5','No. 0915','$5,410']
],
loom: [
  ['0x8f3a…B21c',1241,'$31,200'],['0x2a9d…61c3','No. 0112','$27,850'],
  ['0x5b02…77aa','No. 0089','$24,100'],['0xd730…8b19','No. 2011','$21,400'],
  ['0x1d77…9e04','No. 0317','$19,750'],['0x44ab…9e77','No. 0560','$17,300'],
  ['0xc419…3f6d','No. 1204','$15,020'],['0x9e01…b3f2','No. 4410','$13,680'],
  ['0x77b1…0c3e','No. 0777','$12,150'],['0x3c6f…52d9','No. 2210','$11,020']
]};
function renderLB(pool){
  var body = document.getElementById('lbBody');
  if(!body) return;
  var rows = LB[pool], max = 20000;
  var html = '';
  rows.forEach(function(r,i){
    var num = parseFloat(r[2].replace(/[$,]/g,''));
    var pct = Math.min(100, Math.round(num/max*100));
    html += '<tr><td>'+(i+1)+'</td><td>'+r[0]+'<br><span class="muted" style="font-size:.75rem">'+r[1]+'</span></td>'+
      '<td><b>'+r[2]+'</b><div class="volbar"><i style="width:'+pct+'%"></i></div></td>'+
      '<td><span class="pill ok">Qualified</span></td></tr>';
  });
  body.innerHTML = html;
}
document.addEventListener('click', function(e){
  var t = e.target.closest('[data-lb]');
  if(!t) return;
  document.querySelectorAll('[data-lb]').forEach(function(b){ b.classList.remove('active'); });
  t.classList.add('active');
  renderLB(t.getAttribute('data-lb'));
});

/* ---------------- init ---------------- */
document.addEventListener('DOMContentLoaded', function(){
  route();
  buildPrompts();
  buildUpcoming();
  buildChart();
  renderLB('nft');
  stepper('data-step','mintQty',1,10);
  stepper('data-forge-step','forgeQty',1,10,function(v){
    var el=document.getElementById('forgeRelics');
    if(el) el.textContent = 'burns '+(v*10)+' Relics';
  });
});
