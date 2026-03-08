let users = JSON.parse(localStorage.getItem("users")) || [];
let editIndex = -1;

displayUsers();

function addUser(){

let name=document.getElementById("name").value;
let contact=document.getElementById("contact").value;
let teach=document.getElementById("teach").value;
let learn=document.getElementById("learn").value;
let level=document.getElementById("level").value;
let availability=document.getElementById("availability").value;

let picInput=document.getElementById("profilePic");

function saveUser(profilePic){

let user={
name,
contact,
teach,
learn,
level,
availability,
profilePic,
rating:0
};

if(editIndex === -1){
users.push(user);
}else{
users[editIndex]=user;
editIndex=-1;
}

localStorage.setItem("users",JSON.stringify(users));

displayUsers();

document.getElementById("name").value="";
document.getElementById("contact").value="";
document.getElementById("teach").value="";
document.getElementById("learn").value="";
}

if(picInput.files && picInput.files[0]){

let reader=new FileReader();

reader.onload=function(){
saveUser(reader.result);
};

reader.readAsDataURL(picInput.files[0]);

}else{

saveUser("https://via.placeholder.com/60");

}

}

function displayUsers(){

let container=document.getElementById("studentList");

container.innerHTML="";

users.forEach((u,i)=>{

let match="";

users.forEach((v,j)=>{
if(i!==j && u.learn.toLowerCase().includes(v.teach.toLowerCase())){
match=`Match with ${v.name}`;
}
});

container.innerHTML+=`

<div class="student-card animate__animated animate__fadeInUp">

<img src="${u.profilePic}">

<h3>${u.name}</h3>

<p><b>Teach:</b> ${u.teach}</p>

<p><b>Learn:</b> ${u.learn}</p>

<p><b>Level:</b> ${u.level}</p>

<p><b>Available:</b> ${u.availability}</p>

<p><b>Contact:</b> ${u.contact}</p>

<p class="match">${match}</p>

<p class="rating">Rating: ${u.rating} ⭐</p>

<button onclick="rateUser(${i})">Rate</button>

<button onclick="editUser(${i})">Update</button>

<button class="swap-btn" onclick="swapRequest('${u.name}')">Request Skill Swap</button>

<button class="delete-btn" onclick="deleteUser(${i})">Delete</button>

</div>

`;
});

updateSkillStats();
updateDashboard();

}

function editUser(i){

let u=users[i];

document.getElementById("name").value=u.name;
document.getElementById("contact").value=u.contact;
document.getElementById("teach").value=u.teach;
document.getElementById("learn").value=u.learn;
document.getElementById("level").value=u.level;
document.getElementById("availability").value=u.availability;

editIndex=i;

window.scrollTo({top:0,behavior:"smooth"});
}

function deleteUser(i){

users.splice(i,1);

localStorage.setItem("users",JSON.stringify(users));

displayUsers();

}

function rateUser(i){

let rating=prompt("Enter rating (1-5)");

if(rating>=1 && rating<=5){
users[i].rating=rating;
localStorage.setItem("users",JSON.stringify(users));
displayUsers();
}

}

function swapRequest(name){

let note=document.getElementById("notification");

note.innerText="Skill swap request sent to "+name;

note.style.display="block";

setTimeout(()=>{
note.style.display="none";
},3000);

}

function searchSkill(){

let keyword=document.getElementById("search").value.toLowerCase();

let cards=document.getElementsByClassName("student-card");

let found=false;

for(let card of cards){

let text=card.innerText.toLowerCase();

if(text.includes(keyword)){
card.style.display="block";
found=true;
}else{
card.style.display="none";
}

}

let msg=document.getElementById("noMatch");

if(!found){

if(!msg){
document.getElementById("studentList").innerHTML+=`<p id="noMatch">No skill match</p>`;
}

}else{
if(msg) msg.remove();
}

}

function updateSkillStats(){

let stats={};

users.forEach(u=>{
let skills=u.teach.split(",");
skills.forEach(s=>{
s=s.trim();
stats[s]=(stats[s]||0)+1;
});
});

let html="";

for(let s in stats){
html+=`<p>${s} : ${stats[s]} students</p>`;
}

document.getElementById("skillStats").innerHTML=html;

}

function updateDashboard(){

let totalStudents=users.length;

let skillSet=new Set();

let matches=0;

users.forEach((u,i)=>{

let teachSkills=u.teach.split(",");

teachSkills.forEach(s=>skillSet.add(s.trim()));

users.forEach((v,j)=>{
if(i!==j && u.learn.toLowerCase().includes(v.teach.toLowerCase())){
matches++;
}
});

});

document.getElementById("totalStudents").innerText=totalStudents;
document.getElementById("totalSkills").innerText=skillSet.size;
document.getElementById("totalMatches").innerText=matches;

}

function toggleTheme(){
document.body.classList.toggle("dark");
}