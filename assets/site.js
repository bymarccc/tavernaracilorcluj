document.documentElement.classList.add("js");
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* fill values */
const ph=(el,txt)=>{el.textContent=txt;el.classList.add("ph")};
$$("[data-price]").forEach(el=>{const v=SITE.prices[el.dataset.price];v?el.textContent=v+" lei":ph(el,"… lei")});
$$("[data-val]").forEach(el=>{if(el.hasAttribute("data-keep"))return;const k=el.dataset.val,v=SITE[k];
  if(v){el.textContent=v}else if(el.tagName!=="A"&&!el.closest(".bar")){ph(el,"de completat")}
});
$$("[data-link]").forEach(el=>{
  const k=el.dataset.val,v=SITE[k];
  if(!v){ if(el.hasAttribute("data-keep")){el.href=el.dataset.fallback||"#form"} else if(el.closest(".bar")){el.remove()} else {ph(el,"de completat")} return}
  el.href=(el.dataset.link==="tel"?"tel:"+v.replace(/[^\d+]/g,""):"mailto:"+v);
  if(!el.closest(".bar")&&!el.hasAttribute("data-keep"))el.textContent=v;
});

$$("[data-menu]").forEach(a=>{if(SITE.menuUrl){a.href=SITE.menuUrl;a.target="_blank";a.rel="noopener"}});
$$("[data-go]").forEach(a=>{a.href=SITE.links[a.dataset.go]||"#form"});

/* header, menu, mobile bar */
const header=$("#top"),bar=$("#bar"),loc=$("#locatie"),frm=$("#form"),burger=$("#burger"),menu=$("#menu");
const onScroll=()=>{const y=scrollY;header.classList.toggle("compact",y>40);if(bar&&loc&&frm)bar.classList.toggle("on",y>loc.offsetTop-innerHeight*.5&&y<frm.offsetTop-innerHeight*.5)};
addEventListener("scroll",onScroll,{passive:true});onScroll();
const setMenu=o=>{menu.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);document.body.style.overflow=o?"hidden":"";if(o)header.classList.remove("compact")};
burger.addEventListener("click",()=>setMenu(!menu.classList.contains("open")));
menu.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&menu.classList.contains("open")){setMenu(false);burger.focus()}});
$$("[data-social]").forEach(a=>{const u=SITE.social[a.dataset.social];u?a.href=u:a.classList.add("off")});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
$$(".rv").forEach(el=>io.observe(el));
$$(".ocard").forEach((el,i)=>{el.style.transitionDelay=(i%3*120)+"ms";io.observe(el)});

/* hero video: fade in when ready, no autoplay for reduced motion */
const hv=$("video[data-hero]");
if(hv){const rdy=()=>hv.classList.add("vready");hv.addEventListener("loadeddata",rdy);hv.addEventListener("canplay",rdy);if(hv.readyState>=2)rdy();
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){hv.removeAttribute("autoplay");hv.pause()}else hv.play().catch(()=>{})}

/* videos: play only while visible, hide if file missing */
$$("video[data-lazy]").forEach(v=>{
  v.addEventListener("loadeddata",()=>v.classList.add("vready"));
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){v.preload="auto";v.play().catch(()=>{})}else v.pause();
  }),{threshold:.35}).observe(v);
});

/* package buttons preselect the form */
const packSel=$("#pack");
$$("[data-pack]").forEach(a=>a.addEventListener("click",()=>{if(packSel)packSel.value=a.dataset.pack}));
const wanted=new URLSearchParams(location.search).get("pack");
if(packSel&&wanted)packSel.value=wanted;

/* form */
const form=$("#enquiry")||document.createElement("form"),status=$("#status")||{};
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const bad=$$("[required]",form).find(i=>!i.value.trim());
  if(bad){status.textContent="Vă rugăm completați toate câmpurile obligatorii.";bad.focus();return}
  const d=Object.fromEntries(new FormData(form));
  const body=`Companie: ${d.company}\nPersoană de contact: ${d.person}\nE-mail / telefon: ${d.contact}\nData preferată: ${d.date}\nNumăr aproximativ de invitați: ${d.guests}\nPachet: ${d.pack||"nedecis"}`;
  if(SITE.formEndpoint){
    try{
      const r=await fetch(SITE.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)});
      if(!r.ok)throw 0;status.textContent="Mulțumim! Revenim cu propunerea în cel mai scurt timp.";form.reset();
    }catch(_){status.textContent="Nu am putut trimite cererea. Vă rugăm încercați din nou sau contactați-ne direct."}
  }else if(SITE.email){
    location.href=`mailto:${SITE.email}?subject=${encodeURIComponent("Cerere ofertă eveniment de firmă – "+d.company)}&body=${encodeURIComponent(body)}`;
    status.textContent="Se deschide aplicația de e-mail cu cererea completată.";
  }else{
    status.textContent="Formularul nu este încă conectat. Completați SITE.email sau SITE.formEndpoint.";
  }
});

/* package slider dots */
(()=>{const row=$(".cards"),dots=$$("#pdots i");if(!row||!dots.length)return;
const upd=()=>{const cs=[...row.children];const x=row.scrollLeft+row.clientWidth/2;let best=0,d=1e9;cs.forEach((c,i)=>{const m=Math.abs(c.offsetLeft+c.offsetWidth/2-x);if(m<d){d=m;best=i}});
if(row.scrollLeft+row.clientWidth>=row.scrollWidth-4)best=cs.length-1;dots.forEach((e,i)=>e.classList.toggle("on",i===best))};
row.addEventListener("scroll",upd,{passive:true});upd()})();

/* seafood boil booking form */
(()=>{const f=$("#boilform"),st=$("#bf-status");if(!f)return;
f.addEventListener("submit",async e=>{e.preventDefault();
const bad=$$("[required]",f).find(i=>!i.value.trim());
if(bad){st.textContent="Vă rugăm completați câmpurile marcate cu *.";bad.focus();return}
const d=Object.fromEntries(new FormData(f));
const body=`Pachet: Seafood Boil\nPrenume: ${d.prenume}\nNume: ${d.nume}\nCompanie: ${d.companie||"-"}\nTelefon: ${d.telefon}\nE-mail: ${d.email}\nData preferată: ${d.data}\nNumăr aproximativ de persoane: ${d.persoane}\nMesaj: ${d.mesaj||"-"}`;
if(SITE.formEndpoint){try{const r=await fetch(SITE.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({pachet:"Seafood Boil",...d})});if(!r.ok)throw 0;st.textContent="Mulțumim! Revenim cu propunerea în cel mai scurt timp.";f.reset()}catch(_){st.textContent="Nu am putut trimite cererea. Încercați din nou sau contactați-ne direct."}}
else if(SITE.email){location.href=`mailto:${SITE.email}?subject=${encodeURIComponent("Cerere ofertă Seafood Boil – "+d.prenume+" "+d.nume)}&body=${encodeURIComponent(body)}`;st.textContent="Se deschide aplicația de e-mail cu cererea completată."}
else st.textContent="Formularul nu este încă conectat."})})();
