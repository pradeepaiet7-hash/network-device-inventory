const seed=[
{id:"NB26001",category:"Firewall",type:"Sophos XGS 88",location:"Tulsi",ip:"",serial:"",status:"Active",passwordType:"Read-Write",remark:"Primary firewall"},
{id:"NB26002",category:"Firewall",type:"WatchGuard M290",location:"NGHO",ip:"",serial:"",status:"Active",passwordType:"Read-Write",remark:""},
{id:"NB26003",category:"Firewall",type:"FortiGate",location:"AWS",ip:"",serial:"",status:"Active",passwordType:"Read-Write",remark:""},
{id:"NB26004",category:"Switch",type:"D-Link",location:"NGW",ip:"",serial:"",status:"Active",passwordType:"Read-Write",remark:""},
{id:"NB26005",category:"Switch",type:"Cisco",location:"Tulsi",ip:"",serial:"",status:"Active",passwordType:"Read-Write",remark:""},
{id:"NB26006",category:"Switch",type:"Aruba",location:"Tulsi",ip:"",serial:"",status:"Active",passwordType:"Read-Write",remark:""},
{id:"NB26007",category:"Wireless",type:"Aruba AP-505",location:"Store",ip:"",serial:"",status:"Active",passwordType:"Readonly",remark:""},
{id:"NB26008",category:"Wireless",type:"Sophos AP",location:"Store",ip:"",serial:"",status:"Active",passwordType:"Readonly",remark:""},
{id:"NB26009",category:"VPN",type:"Sophos VPN",location:"Tulsi",ip:"",serial:"",status:"Active",passwordType:"Readonly",remark:""},
{id:"NB26010",category:"VPN",type:"WatchGuard VPN",location:"NGHO",ip:"",serial:"",status:"Active",passwordType:"Readonly",remark:""},
{id:"NB26011",category:"VPN",type:"IPsec tunnel",location:"AWS",ip:"",serial:"",status:"Active",passwordType:"Readonly",remark:""}
];
let devices=JSON.parse(localStorage.getItem("networkInventory")||"null")||seed;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("networkInventory",JSON.stringify(devices));render()}
function render(){
 $("totalCount").textContent=devices.length;
 ["Firewall","Switch","Wireless","VPN"].forEach(c=>$((c==="Switch"?"switch":c.toLowerCase())+"Count").textContent=devices.filter(d=>d.category===c).length);
 const locs=[...new Set(devices.map(d=>d.location))].sort(), old=$("location").value;
 $("location").innerHTML='<option value="">All Locations</option>'+locs.map(x=>`<option>${x}</option>`).join("");$("location").value=old;
 const q=$("search").value.toLowerCase(), cat=$("category").value, loc=$("location").value;
 const rows=devices.filter(d=>(!cat||d.category===cat)&&(!loc||d.location===loc)&&JSON.stringify(d).toLowerCase().includes(q));
 $("deviceRows").innerHTML=rows.map(d=>`<tr><td>${d.id}</td><td>${d.category}</td><td><b>${d.type}</b></td><td>${d.location}</td><td>${d.ip||"-"}</td><td>${d.serial||"-"}</td><td><span class="status ${d.status}">${d.status}</span></td><td><button onclick="editDevice('${d.id}')">Edit</button> <button class="secondary" onclick="deleteDevice('${d.id}')">Delete</button></td></tr>`).join("")||'<tr><td colspan="8">No devices found.</td></tr>';
}
function openModal(d=null){$("modal").classList.remove("hidden");$("modalTitle").textContent=d?"Edit Device":"Add Device";$("editId").value=d?.id||"";$("fCategory").value=d?.category||"Firewall";$("fType").value=d?.type||"";$("fLocation").value=d?.location||"Tulsi";$("fIp").value=d?.ip||"";$("fSerial").value=d?.serial||"";$("fStatus").value=d?.status||"Active";$("fPasswordType").value=d?.passwordType||"Readonly";$("fRemark").value=d?.remark||""}
function editDevice(id){openModal(devices.find(d=>d.id===id))}
function deleteDevice(id){if(confirm("Delete this device?")){devices=devices.filter(d=>d.id!==id);save()}}
$("addBtn").onclick=()=>openModal();$("closeBtn").onclick=()=>$("modal").classList.add("hidden");
$("deviceForm").onsubmit=e=>{e.preventDefault();const id=$("editId").value||("NB"+Date.now().toString().slice(-5));const d={id,category:$("fCategory").value,type:$("fType").value,location:$("fLocation").value,ip:$("fIp").value,serial:$("fSerial").value,status:$("fStatus").value,passwordType:$("fPasswordType").value,remark:$("fRemark").value};const i=devices.findIndex(x=>x.id===id);if(i>=0)devices[i]=d;else devices.push(d);save();$("modal").classList.add("hidden")};
["search","category","location"].forEach(id=>$(id).oninput=render);
$("exportBtn").onclick=()=>{const headers=["ID","Category","Device","Location","IP","Serial","Status","Password Type","Remark"];const csv=[headers,...devices.map(d=>headers.map(h=>d[{ID:"id",Category:"category",Device:"type",Location:"location",IP:"ip",Serial:"serial",Status:"status","Password Type":"passwordType",Remark:"remark"}[h]]||""))].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="network-device-inventory.csv";a.click()};
render();
