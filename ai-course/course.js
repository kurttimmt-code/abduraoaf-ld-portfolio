/* AI at Work: independent instructional-design demonstration.
   No analytics, no network requests, no learner data sent to a server. */
(() => {
'use strict';
const KEY = 'abduraoaf-ai-at-work-v1';
const moduleKeys = ['lesson-1','lesson-2','lesson-3','lesson-4','lesson-5'];
const initial = () => ({done:[],passed:false,best:0,attempts:0});
let store = initial();
try {const raw=JSON.parse(localStorage.getItem(KEY)||'{}');
  if(raw && typeof raw==='object') store={done:Array.isArray(raw.done)?raw.done.filter(x=>moduleKeys.includes(x)):[],passed:raw.passed===true,best:Number(raw.best)||0,attempts:Number(raw.attempts)||0};
} catch(_) { /* Local-file browsers sometimes restrict storage; interactive lessons still run. */ }
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(_){}}
function markDone(key){if(!store.done.includes(key)){store.done.push(key);save();renderProgress();}}
function renderProgress(){
  const n=store.done.length;
  const count=document.getElementById('overview-count');if(count)count.textContent=`${n}/5`;
  const meter=document.getElementById('overview-meter');if(meter)meter.style.width=(n/5*100)+'%';
  const sidecount=document.getElementById('course-fraction');if(sidecount)sidecount.textContent=`${n} of 5 complete`;
  const sidefill=document.getElementById('course-meter-fill');if(sidefill)sidefill.style.width=(n/5*100)+'%';
  document.querySelectorAll('[data-status]').forEach(el=>{
    const done=store.done.includes(el.dataset.status);
    el.classList.toggle('done',done);
    el.setAttribute('aria-label',done?'Completed lesson':'Incomplete lesson');
    el.title=done?'Lesson complete':'Not completed yet';
  });
  const as=document.getElementById('assessment-status'); if(as)as.textContent=store.passed?`Assessment passed · best score ${store.best}%`:'Final assessment not yet passed';
  const badge=document.getElementById('assessment-badge');if(badge&&store.passed)badge.textContent='✓ PASSED';
}
renderProgress();
const reset=document.getElementById('reset-progress');
if(reset)reset.addEventListener('click',()=>{
  if(!confirm('Reset all five lesson checks and your assessment results on this device?'))return;
  store=initial();save();renderProgress();
});

const checks={
'lesson-1':{
 q:'An AI tool produces a fluent, detailed answer with three references. What can you safely conclude?',
 answers:[
  'The answer is reliable because it includes references.',
  'The answer may be useful, but important facts and references still need verification.',
  'The answer is unusable because AI cannot provide any useful information.'
 ],right:1,
 yes:'Correct. Language fluency and citation-style text are not proof. Check important claims against trusted original sources.',
 no:['References can be invented or misrepresented. Find and inspect the original sources.','','AI can produce useful first drafts; the safeguard is appropriate verification.']
},
'lesson-2':{
 q:'A manager wants to use AI to draft a public, non-confidential workshop agenda. What is the best approach?',
 answers:[
  'Use an approved tool, give clear instructions and review the draft before sharing.',
  'Upload employee performance records so the draft is more personalised.',
  'Avoid all AI; it is unsuitable for any workplace writing task.'
 ],right:0,
 yes:'Exactly. This is a suitable low-risk drafting task when the tool is approved and a human checks the output.',
 no:['','Unnecessary personal data raises privacy risk and is not needed for this task.','This is a reasonable use case with approvals and human review.']
},
'lesson-3':{
 q:'Which instruction gives the strongest foundation for an AI-generated first draft?',
 answers:[
  'Make something professional.',
  'Write a detailed training course for everyone immediately.',
  'Draft a one-page checklist for new managers, based only on the non-sensitive points below. Use plain English, five bullets and flag anything needing verification.'
 ],right:2,
 yes:'Correct. The prompt establishes an audience, goal, context boundaries, format and a verification requirement.',
 no:['This does not identify the task, audience or required output.','This remains broad and gives no constraints or quality criteria.','']
},
'lesson-4':{
 q:'A chatbot suggests an exact legal statistic and names a source. What should happen before citing it in client material?',
 answers:[
  'Share it, since precise numbers show that the system has checked.',
  'Confirm the figure and its meaning against the original source, then seek appropriate review.',
  'Rewrite the statistic in a more confident tone.'
 ],right:1,
 yes:'Right. Accurate, properly contextualised claims need independent evidence and an accountable approval process.',
 no:['A precise number is not evidence and may be invented.','','Polishing the wording does not fix an unsupported claim.']
}
};
function renderChecks(){
 document.querySelectorAll('.knowledge-check:not(.scenario-gate)').forEach(node=>{
  const key=node.dataset.key, data=checks[key];if(!data)return;
  node.innerHTML=`<div class="check-kicker">KNOWLEDGE CHECK <span>· Complete to mark the lesson</span></div><h3>${escapeHTML(data.q)}</h3><div class="check-choices"></div><div class="check-feedback" hidden role="status"></div>`;
  const options=node.querySelector('.check-choices');const feedback=node.querySelector('.check-feedback');
  data.answers.forEach((answer,i)=>{
    const b=document.createElement('button');b.type='button';b.className='check-choice';b.textContent=answer;
    b.addEventListener('click',()=>{
      const right=i===data.right;
      feedback.hidden=false;feedback.className='check-feedback '+(right?'correct':'retry');
      feedback.textContent=(right?'✓ '+data.yes:'Not quite. '+data.no[i]+' Try another response.');
      if(right){markDone(key);node.classList.add('completed');options.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add('correct');}
      else{b.classList.add('incorrect');b.disabled=true;}
    });options.appendChild(b);
  });
  if(store.done.includes(key)){
    const info=document.createElement('p');info.className='previously-completed';info.textContent='✓ You completed this check previously. You can review the activity again.';node.appendChild(info);
  }
 });
}
renderChecks();
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

const build=document.getElementById('build-prompt');
if(build)build.addEventListener('click',()=>{
 const val=id=>document.getElementById(id).value.trim();
 const vals=[val('pb-task'),val('pb-audience'),val('pb-context'),val('pb-format'),val('pb-guardrails')];
 const dest=document.getElementById('prompt-output');
 if(vals.some(v=>!v)){dest.textContent='Please complete all five fields before building a prompt.';return;}
 const prompt=`TASK\n${vals[0]}\n\nAUDIENCE\n${vals[1]}\n\nCONTEXT\n${vals[2]}\n\nREQUIRED OUTPUT\n${vals[3]}\n\nCONSTRAINTS & QUALITY\n${vals[4]}\n\nState any assumptions. I will check all relevant claims and approve the final version.`;
 dest.textContent=prompt;dest.dataset.text=prompt;
 document.getElementById('copy-prompt').hidden=false;
});
const copy=document.getElementById('copy-prompt');
if(copy)copy.addEventListener('click',async()=>{
 const str=document.getElementById('prompt-output').dataset.text||'';
 if(!str)return;
 try{await navigator.clipboard.writeText(str);document.getElementById('copy-feedback').textContent='Copied to clipboard.';}
 catch(_){const range=document.createRange();range.selectNodeContents(document.getElementById('prompt-output'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);document.getElementById('copy-feedback').textContent='Select the highlighted text and copy it.';}
});

const scenario=[
 {title:'The input: what should go into AI?',
  context:'You have notes from a client conversation and a blank update template. You could ask AI to help structure the update.',
  choices:[
   ['Paste the complete client notes, including names, pricing and confidential issues, into a free public chatbot.',false,'That exposes confidential information through an unapproved workflow. Never assume public tools are permitted for client data.'],
   ['Use an approved tool and permitted, minimised or anonymised information to request a draft structure.',true,'Strong decision. Confirm approval and use only the minimum necessary information.'],
   ['Let the chatbot find a similar real client case on the internet and base your update on it.',false,'Unrelated cases may be inaccurate, irrelevant or confidential. Use the authorised project facts instead.']
  ]},
 {title:'The draft: it sounds convincing, but…',
  context:'The AI-generated draft includes a precise delivery deadline and a statement that the team has completed a regulatory review. Neither was in your source notes.',
  choices:[
   ['Keep both statements; the model probably inferred them from the context.',false,'Inference is not evidence. Invented deadlines and compliance claims cannot be treated as facts.'],
   ['Remove unsupported assertions, check facts with the project owner and regenerate if needed.',true,'Right. Verify claims with accountable sources, correct errors and document what still needs confirmation.'],
   ['Add “according to AI” before each unsupported statement.',false,'Attribution to AI does not make unsupported statements suitable for external use.']
  ]},
 {title:'The handoff: who approves the update?',
  context:'You have checked the draft against approved sources. A stakeholder asks you to email the client immediately.',
  choices:[
   ['Send it without further review because the tool made the work faster.',false,'Speed does not remove professional responsibility. Follow the required review and approval process.'],
   ['Ask the appropriate project owner to review and approve the client-facing wording before it is sent.',true,'Exactly. AI supports drafting; accountable humans own the final professional communication.'],
   ['Ask the model to declare the update compliant and then send it.',false,'A model cannot replace an authorised compliance review or human sign-off.']
  ]}
];
const sc=document.getElementById('scenario-lab');
if(sc){
 let stage=0,finished=false;
 const title=sc.querySelector('#scenario-title'),context=sc.querySelector('#scenario-context'),optionNode=sc.querySelector('#scenario-options'),feedback=sc.querySelector('#scenario-feedback'),next=sc.querySelector('#scenario-next');
 function draw(){
   const d=scenario[stage];sc.querySelector('#scenario-stage').textContent=`STAGE ${stage+1} / 3`;
   sc.querySelector('#scenario-successes').textContent=`${stage} decisions completed`;
   sc.querySelector('#scenario-gauge-fill').style.width=(stage/3*100)+'%';
   title.textContent=d.title;context.textContent=d.context;optionNode.replaceChildren();
   feedback.hidden=true;next.hidden=true;next.textContent='Continue →';
   d.choices.forEach(([txt,correct,reason])=>{
     const b=document.createElement('button');b.type='button';b.className='scenario-choice';b.textContent=txt;
     b.addEventListener('click',()=>{
       feedback.hidden=false;feedback.textContent=(correct?'✓ Well judged. ':'Consider the risk: ')+reason;
       feedback.className='scenario-feedback '+(correct?'correct':'retry');
       if(correct){optionNode.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add('correct');next.hidden=false;if(stage===2)next.textContent='Complete scenario →';}
       else{b.disabled=true;b.classList.add('incorrect');}
     });optionNode.appendChild(b);
   });
 }
 next.addEventListener('click',()=>{
   if(stage<2){stage++;draw();return;}
   finished=true;markDone('lesson-5');
   sc.querySelector('#scenario-stage').textContent='SCENARIO COMPLETED';
   sc.querySelector('#scenario-successes').textContent='3 of 3 decisions completed';
   sc.querySelector('#scenario-gauge-fill').style.width='100%';
   title.textContent='You completed the client-update scenario.';
   context.textContent='You protected confidential inputs, checked unsupported claims, and kept an accountable person in the approval loop. These are behaviours that matter on the job.';
   optionNode.innerHTML='<div class="scenario-complete">✓ Practical scenario complete. Your progress has been recorded on this device.</div>';
   feedback.hidden=true;next.hidden=true;
 });draw();
 if(store.done.includes('lesson-5')){const p=document.createElement('p');p.className='previously-completed';p.textContent='✓ Previously completed. You can replay the scenario.';sc.appendChild(p);}
}

// Ten distinct, applied assessment items. Right answers appear in different positions.
const exam=[
 {q:'What is the most accurate description of generative AI?',a:['A system that can only search existing web pages','A system that creates responses from learned patterns and given context','A system that guarantees the correctness of every output'],r:1,e:'Generative AI produces new content based on patterns and supplied context; its output can still be wrong.'},
 {q:'A colleague says, “The summary looks convincing, so the numbers must be right.” What is the best response?',a:['Confirm the numbers against a trusted source before use','Accept them because the wording is confident','Ask AI to make the wording more persuasive'],r:0,e:'Confidence and fluent language do not establish factual accuracy.'},
 {q:'Which task is usually the best first use case for an approved workplace AI tool?',a:['Determine an employee’s performance rating without review','Upload an unredacted client contract into a public chatbot','Draft titles for a non-confidential internal workshop'],r:2,e:'A non-sensitive first-draft task is more appropriate than confidential uploads or consequential unsupervised decisions.'},
 {q:'Which prompt is likely to produce the most usable first draft?',a:['Create a good training document.','Draft a one-page checklist for new hires, using the non-confidential points provided; use five bullets and flag gaps.','Work on this until it looks impressive.'],r:1,e:'The prompt defines audience, output, context boundaries and quality constraints.'},
 {q:'You need to summarise sensitive client material. What should you do first?',a:['Check tool approval, permissions and data-handling requirements','Assume any work account is automatically safe for all client data','Paste everything in and delete the conversation afterwards'],r:0,e:'Approval and data-handling checks need to happen before input. Deleting a chat is not a substitute for authorisation.'},
 {q:'An AI answer cites a legal case you cannot find. What is the best next step?',a:['Keep the reference and add a disclaimer','Ask AI to rewrite the same claim with stronger language','Remove or withhold the claim until the original source is confirmed'],r:2,e:'Never rely on an unverified citation. Check the original source or remove the unsupported claim.'},
 {q:'The AI draft has an invented delivery deadline. What should happen?',a:['Keep it to make the update look complete','Check the approved project facts and correct the draft','Ask the model whether it is sure, then accept its answer'],r:1,e:'AI-generated details must be reconciled with real, authorised facts, not accepted on confidence.'},
 {q:'Who is accountable for approving a high-stakes AI-assisted client update?',a:['The authorised human owner and relevant reviewers','The AI system because it drafted the message','No one, provided the draft includes an AI disclaimer'],r:0,e:'Human accountability and review remain essential for professional client communications.'},
 {q:'You are creating a prompt for a generic internal meeting agenda. What improves its quality most?',a:['Include the names and private medical details of the team','Say “be brilliant” repeatedly','Specify the audience, time available, desired format and constraints'],r:2,e:'Relevant task context and output requirements are useful; extra sensitive data are unnecessary.'},
 {q:'Which sequence best represents a responsible AI-supported workflow?',a:['Generate → send → check later','Choose approved task → minimise inputs → draft → verify → human approve','Upload everything → trust response → automate distribution'],r:1,e:'Responsible use begins with approved purpose and protected inputs, and ends with verification and accountable human review.'}
];
const form=document.getElementById('final-assessment');
if(form){
 const place=document.getElementById('assessment-questions'),result=document.getElementById('assessment-result'),validate=document.getElementById('assessment-validate');
 exam.forEach((item,index)=>{
   const fieldset=document.createElement('div');fieldset.className='exam-question';fieldset.setAttribute('role','group');
   const title=document.createElement('h3');title.className='exam-question-title';title.id='exam-question-'+index;
   title.textContent=`${String(index+1).padStart(2,'0')}. ${item.q}`;fieldset.setAttribute('aria-labelledby',title.id);fieldset.appendChild(title);
   item.a.forEach((answer,i)=>{
     const label=document.createElement('label');label.className='exam-answer';
     const input=document.createElement('input');input.type='radio';input.name='q'+index;input.value=String(i);
     const span=document.createElement('span');span.textContent=answer;
     label.append(input,span);fieldset.appendChild(label);
   });place.appendChild(fieldset);
 });
 const refreshAnswered=()=>{
   const n=exam.filter((_,i)=>form.querySelector(`input[name="q${i}"]:checked`)).length;
   document.getElementById('answered-count').textContent=n;
   document.getElementById('answered-bar').style.width=(n/exam.length*100)+'%';
 };
 form.addEventListener('change',()=>{validate.textContent='';refreshAnswered();});
 form.addEventListener('submit',e=>{
   e.preventDefault();const selected=exam.map((_,i)=>form.querySelector(`input[name="q${i}"]:checked`));
   const firstMissing=selected.findIndex(x=>!x);if(firstMissing!==-1){
     validate.textContent=`Answer all ten questions first (question ${firstMissing+1} is unanswered).`;
     form.querySelectorAll('.exam-question').forEach(x=>x.classList.remove('needs-answer'));
     const fld=place.children[firstMissing];fld.classList.add('needs-answer');fld.scrollIntoView({behavior:'smooth',block:'center'});return;
   }
   const score=selected.reduce((n,x,i)=>n+(Number(x.value)===exam[i].r?1:0),0);
   const pct=score*10,pass=score>=8;
   store.attempts++;store.best=Math.max(store.best,pct);if(pass)store.passed=true;save();renderProgress();
   const title=document.createElement('h2');title.textContent=pass?'You passed. Great work.':'Review and try again.';
   const summary=document.createElement('p');summary.textContent=`Score: ${score}/10 (${pct}%). Pass mark: 80%. ${pass?'You demonstrated the essential decision-making skills.':'Review the explanations below before another attempt.'}`;
   const status=document.createElement('div');status.className='result-status '+(pass?'passed':'not-passed');
   status.append(title,summary);
   const list=document.createElement('div');list.className='review-list';
   exam.forEach((item,i)=>{
      const correct=Number(selected[i].value)===item.r;
      const entry=document.createElement('div');entry.className='review-entry';
      const h=document.createElement('h3');h.textContent=`${correct?'✓':'↻'} Question ${i+1}: ${correct?'Correct':'Review'}`;
      const p1=document.createElement('p');p1.textContent=item.q;
      const p2=document.createElement('p');p2.innerHTML=`<strong>Best answer:</strong> ${escapeHTML(item.a[item.r])}`;
      const explain=document.createElement('p');explain.textContent=item.e;
      entry.append(h,p1,p2,explain);list.appendChild(entry);
   });
   const note=document.createElement('p');note.className='text-hint';note.textContent=pass?'Your assessment progress is saved on this device. You can review your answers or retake the assessment at any time.':'You may retake the quiz as many times as you like.';
   const again=document.createElement('button');again.className='btn dark';again.type='button';again.textContent='Retake the assessment →';
   again.addEventListener('click',()=>{form.reset();refreshAnswered();result.hidden=true;form.hidden=false;window.scrollTo({top:form.getBoundingClientRect().top+window.scrollY-85,behavior:'smooth'});});
   result.replaceChildren(status,list,note,again);result.hidden=false;form.hidden=true;
   result.scrollIntoView({behavior:'smooth',block:'start'});
 });
}
})();
