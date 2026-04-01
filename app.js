let data={}, questions=[], current=0, score=0, user="", time=120, timer;

function shuffle(a){return a.sort(()=>Math.random()-0.5);}

function startQuiz(){
 user=document.getElementById("username").value;
 let sub=document.getElementById("subject").value;
 let n=parseInt(document.getElementById("numQ").value);

 fetch("questions.json").then(r=>r.json()).then(d=>{
  data=d;
  questions=shuffle(data[sub]).slice(0,n);
  document.getElementById("start").style.display="none";
  document.getElementById("quiz").style.display="block";
  startTimer();
  loadQ();
 });
}

function startTimer(){
 timer=setInterval(()=>{
  time--;
  document.getElementById("timer").innerText="Time: "+time;
  if(time<=0){clearInterval(timer);finish();}
 },1000);
}

function loadQ(){
 let q=questions[current];
 document.getElementById("question").innerText=q.question_text;
 let html="";
 ["A","B","C","D"].forEach(o=>{
  html+=`<input type="radio" name="opt" value="${o}"> ${q["option_"+o.toLowerCase()]}<br>`;
 });
 document.getElementById("options").innerHTML=html;
}

function nextQ(){
 let sel=document.querySelector('input[name="opt"]:checked');
 if(!sel) return alert("Select option");
 if(sel.value===questions[current].correct_answer) score++;
 current++;
 if(current<questions.length) loadQ();
 else finish();
}

function finish(){
 clearInterval(timer);
 document.getElementById("quiz").style.display="none";
 let res=`${user} Score: ${score}/${questions.length}`;
 document.getElementById("result").style.display="block";
 document.getElementById("result").innerText=res;

 let hist=JSON.parse(localStorage.getItem("hist")||"[]");
 hist.push({user,score,total:questions.length,time:new Date().toISOString()});
 localStorage.setItem("hist",JSON.stringify(hist));
 showBoard();
}

function showBoard(){
 let hist=JSON.parse(localStorage.getItem("hist")||"[]");
 hist.sort((a,b)=>b.score-a.score);
 let html="<h3>Leaderboard</h3>";
 hist.slice(0,5).forEach(h=>{
  html+=`<p>${h.user} - ${h.score}</p>`;
 });
 document.getElementById("leaderboard").innerHTML=html;
}

function downloadCSV(){
 let hist=JSON.parse(localStorage.getItem("hist")||"[]");
 let csv="Name,Score,Total,Time\n";
 hist.forEach(h=>{csv+=`${h.user},${h.score},${h.total},${h.time}\n`;});
 let blob=new Blob([csv]);
 let a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="results.csv";
 a.click();
}
