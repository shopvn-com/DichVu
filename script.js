const $ = id => document.getElementById(id);
const money = n => Number(n).toLocaleString("vi-VN") + " ₫";
const toast = (message, type="success") => {
  const region = $("toastRegion");
  if (!region) return;
  const item = document.createElement("div");
  item.className = "toast" + (type === "warning" ? " warning" : "");
  item.textContent = message;
  region.appendChild(item);
  window.setTimeout(() => item.remove(), 4200);
};
const packages = [
  {id:"monthly",name:"Thẻ Tháng",subtitle:"Quyền Lợi Thẻ Tháng",group:"monthly",groupName:"Thẻ tháng",uid:135000,log:130000,old:149000,uidLocked:true,tag:"Bán chạy",art:"🎫"},
  {id:"battle1",name:"Cẩm Nang Nâng Cao",subtitle:"Battle Pass I",group:"battle",groupName:"Cẩm nang",uid:260000,log:250000,old:299000,uidLocked:true,tag:"Khuyến nghị",art:"📘"},
  {id:"upgrade",name:"Thăng Cấp Cẩm Nang",subtitle:"Upgrade Battle Pass",group:"battle",groupName:"Cẩm nang",uid:260000,log:250000,old:299000,uidLocked:true,tag:"Khuyến nghị",art:"🔁"},
  {id:"battle2",name:"Cẩm Nang Sưu Tập",subtitle:"Battle Pass II",group:"battle",groupName:"Cẩm nang",uid:520000,log:500000,old:599000,uidLocked:true,tag:"Khuyến nghị",art:"🏅"},
  {id:"crystal60",name:"x60 Tinh Thể",subtitle:"Thưởng thêm: 6",group:"crystal",groupName:"Tinh thể",uid:35000,log:30000,old:29000,uidLocked:true,tag:"Phổ biến",art:"💎"},
  {id:"crystal300",name:"x300 Tinh Thể",subtitle:"Thưởng thêm: 30",group:"crystal",groupName:"Tinh thể",uid:135000,log:130000,old:149000,uidLocked:true,tag:"Giảm giá",art:"💎"},
  {id:"crystal980",name:"x980 Tinh Thể",subtitle:"Thưởng thêm: 98",group:"crystal",groupName:"Tinh thể",uid:390000,log:375000,old:499000,uidLocked:true,tag:"Siêu hời",art:"💎"},
  {id:"crystal1980",name:"x1980 Tinh Thể",subtitle:"Thưởng thêm: 198",group:"crystal",groupName:"Tinh thể",uid:780000,log:750000,old:999000,uidLocked:true,tag:"Siêu hời",art:"✨"},
  {id:"crystal3280",name:"x3280 Tinh Thể",subtitle:"Thưởng thêm: 328",group:"crystal",groupName:"Tinh thể",uid:1300000,log:1250000,old:1499000,uidLocked:true,tag:"Siêu hời",art:"🌟"},
  {id:"crystal6480",name:"x6480 Tinh Thể",subtitle:"Thưởng thêm: 648",group:"crystal",groupName:"Tinh thể",uid:2550000,log:2450000,old:2999000,uidLocked:true,tag:"Best Seller",art:"💠"}
];
let orders = [];
try { orders = JSON.parse(localStorage.getItem("aniimoOrders") || "[]"); if (!Array.isArray(orders)) orders = []; }
catch (error) { orders = []; }
let activeFilter = "all";

function renderPackages(){
  const grid=$("packagesGrid");
  grid.innerHTML=packages.map((p,i)=>`
    <article class="package-card" data-group="${p.group}" data-search="${(p.name+" "+p.subtitle).toLowerCase()}">
      <div class="package-card-top"><span class="package-tag">${p.tag}</span><span class="package-category">${p.groupName}</span></div>
      <div class="package-card-art" aria-hidden="true">${p.art}</div>
      <div class="package-card-info"><h3>${p.name}</h3><p>${p.subtitle}</p></div>
      <div class="package-methods">
        <label class="package-method locked"><input type="radio" name="package" value="${p.id}|uid|${p.uid}" disabled>
          <span><b>Nạp Qua UID</b><small>${money(p.uid)}</small></span><em>Tạm khóa</em></label>
        <label class="package-method ${i===0?"selected":""}"><input type="radio" name="package" value="${p.id}|log|${p.log}" ${i===0?"checked":""}>
          <span><b>Nạp Log Game</b><small>${money(p.log)}</small></span><small class="old-price">${money(p.old)}</small></label>
      </div>
    </article>`).join("");
  grid.addEventListener("change",e=>{
    if(!e.target.matches('input[name="package"]'))return;
    grid.querySelectorAll(".package-method").forEach(x=>x.classList.remove("selected"));
    e.target.closest(".package-method").classList.add("selected");
    updateSelection();
  });
  updateSelection();
}
function updateSelection(){
  const selected=document.querySelector('input[name="package"]:checked');
  if(!selected)return;
  const [id,method,amount]=selected.value.split("|");
  const p=packages.find(x=>x.id===id);
  $("payPackage").textContent=p.name+" — "+(method==="log"?"Nạp Log Game":"Nạp Qua UID");
  $("payAmount").textContent=money(amount);
  $("paymentPanel").querySelector(".status").textContent="ĐÃ CHỌN GÓI";
}
function applyFilters(){
  const q=($("packageSearch").value||"").trim().toLowerCase();
  document.querySelectorAll(".package-card").forEach(card=>{
    card.hidden=!(activeFilter==="all"||card.dataset.group===activeFilter)||!card.dataset.search.includes(q);
  });
}
function renderHistory(){
  $("historyCount").textContent=orders.length+" đơn";
  if(!orders.length){$("historyList").className="history-empty";$("historyList").textContent="Chưa có đơn hàng nào. Đơn demo sẽ xuất hiện tại đây sau khi bạn tạo đơn.";return;}
  $("historyList").className="";
  $("historyList").innerHTML=orders.slice(0,8).map(o=>`<div class="history-item">
    <div><strong>${o.packageName}</strong><small>Mã: ${o.code} · ${o.createdAt}<br>UID: ${o.playerId} · ${o.server||"Chưa rõ máy chủ"}</small><span class="history-status">${o.status}</span></div>
    <div class="history-price">${money(o.amount)}<small>${o.method==="log"?"Nạp Log Game":"Nạp UID"}</small></div></div>`).join("");
}
renderPackages();renderHistory();

$("packageTabs").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]");if(!btn)return;
  activeFilter=btn.dataset.filter;
  document.querySelectorAll(".filter-tab").forEach(x=>x.classList.toggle("active",x===btn));
  applyFilters();
});
$("packageSearch").addEventListener("input",applyFilters);

$("topupForm").addEventListener("submit",e=>{
  e.preventDefault();
  const selected=document.querySelector('input[name="package"]:checked');
  if(!selected){alert("Vui lòng chọn gói nạp.");return;}
  const gameEmail=$("gameEmail").value.trim(),playerId=$("playerId").value.trim(),
    server=$("gameServer").value,playerName=$("playerName").value.trim(),phone=$("contactPhone").value.trim();
  if(!gameEmail||!playerId||!server||!playerName||!phone){alert("Vui lòng điền đầy đủ thông tin bắt buộc.");return;}
  const [packageId,method,amountText]=selected.value.split("|");
  const item=packages.find(p=>p.id===packageId);
  const code="ANI-"+Array.from(crypto.getRandomValues(new Uint8Array(4))).map(x=>x.toString(16).padStart(2,"0")).join("").toUpperCase();
  const order={code,gameEmail,playerId,server,playerName,phone,otherContact:$("otherContact").value.trim(),packageId,packageName:item.name,method,amount:Number(amountText),status:"Chờ xác nhận thanh toán",createdAt:new Date().toLocaleString("vi-VN")};
  orders.unshift(order);localStorage.setItem("aniimoOrders",JSON.stringify(orders));
  $("payAmount").textContent=money(order.amount);$("payContent").textContent=code;
  $("payPackage").textContent=item.name+" — Nạp Log Game";
  $("payOrderCode").textContent=code;
  $("paymentPanel").hidden=false;
  $("paymentPanel").querySelector(".status").textContent="CHỜ THANH TOÁN";
  renderHistory();$("paymentPanel").scrollIntoView({behavior:"smooth",block:"center"});
  toast("Đã tạo đơn " + code + ". Hãy kiểm tra kỹ người nhận, số tiền và nội dung chuyển khoản trước khi thanh toán.", "warning");
});
$("lookupForm").addEventListener("submit",e=>{
  e.preventDefault();const code=$("orderCode").value.trim().toUpperCase();
  const order=orders.find(o=>o.code===code);
  $("lookupResult").textContent=order?`Đơn ${order.code} · ${order.packageName} · ${money(order.amount)} · UID ${order.playerId} · ${order.server} · Trạng thái: ${order.status}`:"Không tìm thấy mã đơn trong dữ liệu demo trên trình duyệt này.";
});
$("copyPayAmount").onclick=async()=>{
  try{await navigator.clipboard.writeText(($("payAmount").textContent||"").replace(/[^0-9]/g,""));$("copyPayAmount").textContent="Đã copy số tiền";}
  catch(e){toast("Không thể sao chép tự động. Vui lòng sao chép số tiền thủ công.", "warning");}
};
$("copyPayContent").onclick=async()=>{
  try{await navigator.clipboard.writeText($("payContent").textContent||"");$("copyPayContent").textContent="Đã copy nội dung";}
  catch(e){toast("Không thể sao chép tự động. Vui lòng sao chép nội dung thủ công.", "warning");}
};
const MEMBERS_KEY="aniimoMembersV1";
const SESSION_KEY="aniimoMemberSession";
const readMembers=()=>{try{return JSON.parse(localStorage.getItem(MEMBERS_KEY)||"[]")}catch(e){return []}};
const writeMembers=items=>localStorage.setItem(MEMBERS_KEY,JSON.stringify(items));
const accountMessage=(message,type="info")=>{const el=$("accountMessage");el.textContent=message;el.dataset.type=type;};
const showAccountView=view=>{
  $("loginView").hidden=view!=="login";
  $("registerView").hidden=view!=="register";
  $("memberDashboard").hidden=view!=="dashboard";
  $("loginTab").classList.toggle("active",view==="login");
  $("registerTab").classList.toggle("active",view==="register");
  $("loginTab").setAttribute("aria-selected",String(view==="login"));
  $("registerTab").setAttribute("aria-selected",String(view==="register"));
  $("accountMessage").textContent="";
};
const hashCredential=async(value,salt)=>{
  if(!window.crypto?.subtle)throw new Error("Trình duyệt chưa hỗ trợ bảo mật. Hãy mở website bằng HTTPS hoặc localhost.");
  const enc=new TextEncoder();
  const material=await crypto.subtle.importKey("raw",enc.encode(value),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode(salt),iterations:120000,hash:"SHA-256"},material,256);
  return Array.from(new Uint8Array(bits)).map(x=>x.toString(16).padStart(2,"0")).join("");
};
const randomSalt=()=>{
  const bytes=crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map(x=>x.toString(16).padStart(2,"0")).join("");
};
const currentMember=()=>sessionStorage.getItem(SESSION_KEY);
const openAccount=()=>{
  $("loginModal").classList.add("show");
  $("loginModal").setAttribute("aria-hidden","false");
  if(currentMember()){
    const m=readMembers().find(x=>x.nickname.toLowerCase()===currentMember().toLowerCase());
    if(m){$("memberDisplayName").textContent=m.nickname;$("memberOrderCount").textContent=orders.length;showAccountView("dashboard");}
    else{sessionStorage.removeItem(SESSION_KEY);showAccountView("login");}
  }else showAccountView("login");
};
const closeAccount=()=>{
  $("loginModal").classList.remove("show");
  $("loginModal").setAttribute("aria-hidden","true");
};
$("loginBtn").onclick=openAccount;
$("closeModal").onclick=closeAccount;
$("loginModal").onclick=e=>{if(e.target===$("loginModal"))closeAccount();};
$("loginTab").onclick=()=>showAccountView("login");
$("registerTab").onclick=()=>showAccountView("register");
document.querySelectorAll(".reveal-secret").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const input=$(btn.dataset.target);
    input.type=input.type==="password"?"text":"password";
    btn.textContent=input.type==="password"?"◉":"◎";
  });
});
$("registerForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const nickname=$("memberRegisterName").value.trim();
  const pin=$("memberRegisterPin").value;
  const confirmPin=$("memberRegisterPinConfirm").value;
  const phone3=$("memberRegisterPhone").value;
  if(!/^[A-Za-z0-9_]{3,24}$/.test(nickname)){accountMessage("Nickname cần từ 3–24 ký tự, chỉ gồm chữ, số và dấu gạch dưới.","error");return;}
  if(!/^\d{6}$/.test(pin)||!/^\d{3}$/.test(phone3)){accountMessage("Mã bí mật phải đủ 6 số và số điện thoại phải đủ 3 số cuối.","error");return;}
  if(pin!==confirmPin){accountMessage("Hai lần nhập mã bí mật chưa khớp.","error");return;}
  const members=readMembers();
  if(members.some(m=>m.nickname.toLowerCase()===nickname.toLowerCase())){accountMessage("Nickname này đã được sử dụng. Hãy chọn nickname khác.","error");return;}
  try{
    const salt=randomSalt();
    const credentialHash=await hashCredential(pin+":"+phone3,salt);
    members.push({nickname,salt,credentialHash,createdAt:new Date().toISOString()});
    writeMembers(members);
    sessionStorage.setItem(SESSION_KEY,nickname);
    $("loginBtn").textContent="Tài khoản: "+nickname;
    $("memberDisplayName").textContent=nickname;
    $("memberOrderCount").textContent=orders.length;
    showAccountView("dashboard");
    accountMessage("Tạo tài khoản thành công! Bạn đang đăng nhập trên thiết bị này.","success");
    $("registerForm").reset();
  }catch(err){accountMessage(err.message||"Không thể tạo tài khoản. Vui lòng thử lại.","error");}
});
$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const nickname=$("memberLoginName").value.trim();
  const pin=$("memberLoginPin").value;
  const phone3=$("memberLoginPhone").value;
  if(!nickname||!/^\d{6}$/.test(pin)||!/^\d{3}$/.test(phone3)){accountMessage("Vui lòng nhập Nickname, mã bí mật 6 số và 3 số cuối điện thoại.","error");return;}
  try{
    const member=readMembers().find(m=>m.nickname.toLowerCase()===nickname.toLowerCase());
    if(!member){accountMessage("Không tìm thấy tài khoản này trên trình duyệt hiện tại.","error");return;}
    const check=await hashCredential(pin+":"+phone3,member.salt);
    if(check!==member.credentialHash){accountMessage("Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại.","error");return;}
    sessionStorage.setItem(SESSION_KEY,member.nickname);
    $("loginBtn").textContent="Tài khoản: "+member.nickname;
    $("memberDisplayName").textContent=member.nickname;
    $("memberOrderCount").textContent=orders.length;
    $("loginForm").reset();
    showAccountView("dashboard");
    accountMessage("Đăng nhập thành công! Chào mừng bạn trở lại.","success");
  }catch(err){accountMessage(err.message||"Đăng nhập chưa thành công.","error");}
});
$("memberLogout").onclick=()=>{
  sessionStorage.removeItem(SESSION_KEY);
  $("loginBtn").textContent="Tài khoản";
  showAccountView("login");
  accountMessage("Bạn đã đăng xuất khỏi tài khoản ANIIMO.","success");
};
$("memberOrdersLink").onclick=()=>closeAccount();
if(currentMember()){
  $("loginBtn").textContent="Tài khoản: "+currentMember();
}
