// Simple prototype using Firebase Firestore (compat)
const firebaseConfig = {
  // TODO: replace with your Firebase project's configuration
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const title = document.getElementById('title');
const desc = document.getElementById('desc');
const priority = document.getElementById('priority');
const due = document.getElementById('due');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');

addBtn.addEventListener('click', async ()=>{
  if(!title.value.trim()){ alert('Enter title'); return; }
  const doc = {
    title: title.value,
    description: desc.value,
    priority: priority.value,
    due: due.value || null,
    status: 'To Do',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('tasks').add(doc);
  title.value=''; desc.value=''; due.value='';
});

function renderTask(id, data){
  const div = document.createElement('div');
  div.className='task';
  div.innerHTML = `<h3>${data.title}</h3>
  <p>${data.description || ''}</p>
  <p>Priority: ${data.priority} | Due: ${data.due || '—'} | Status: <strong>${data.status}</strong></p>
  <button class="small" data-id="${id}" data-action="toggle">Toggle Status</button>
  <button class="small" data-id="${id}" data-action="delete">Delete</button>`;
  taskList.appendChild(div);
}

taskList.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if(action === 'toggle'){
    const ref = db.collection('tasks').doc(id);
    const snap = await ref.get();
    const next = snap.data().status === 'To Do' ? 'Done' : 'To Do';
    await ref.update({status: next});
  } else if(action === 'delete'){
    if(confirm('Delete this task?')) await db.collection('tasks').doc(id).delete();
  }
});

// realtime listener
db.collection('tasks').orderBy('createdAt','desc').onSnapshot(snap=>{
  taskList.innerHTML='';
  let total = 0, done = 0;
  snap.forEach(doc => {
    total++;
    const d = doc.data();
    if(d.status === 'Done') done++;
    renderTask(doc.id, d);
  });
  stats.textContent = `Total tasks: ${total} | Done: ${done}`;
});
