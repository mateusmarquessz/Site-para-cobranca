// Modal de regularização
const overlay = document.getElementById('overlay');
const payBtn = document.getElementById('pay-btn');
const closeButtons = [document.getElementById('close-btn'), document.getElementById('close-x')];

function openModal() {
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-btn').focus();
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  payBtn.focus();
}

// Seleção das aulas
const selectAll = document.getElementById('select-all');
const lessons = [...document.querySelectorAll('.lesson')];
const $ = id => document.getElementById(id);

const beijos = n => `${n} ${n === 1 ? 'beijo' : 'beijos'}`;
const aulas = n => `${n} ${n === 1 ? 'aula' : 'aulas'}`;

function updateSelection() {
  const chosen = lessons.filter(c => c.checked);
  const total = chosen.reduce((sum, c) => sum + Number(c.value), 0);

  lessons.forEach(c => c.closest('tr').classList.toggle('selected', c.checked));
  selectAll.checked = chosen.length === lessons.length;
  selectAll.indeterminate = chosen.length > 0 && chosen.length < lessons.length;

  $('sel-info').textContent = `${chosen.length} de ${aulas(lessons.length)} ${chosen.length === 1 ? 'selecionada' : 'selecionadas'}`;
  $('subtotal').textContent = beijos(total);
  $('grand-total').textContent = beijos(total);

  const num = $('amount-num');
  if (num.textContent !== String(total)) {
    num.classList.add('bump');
    setTimeout(() => { num.textContent = total; num.classList.remove('bump'); }, 150);
  }
  $('amount-unit').textContent = total === 1 ? 'beijo' : 'beijos';
  $('amount-lessons').textContent = aulas(chosen.length);

  $('modal-count').textContent = total === 1 ? 'do 1 beijo pendente' : `dos ${total} beijos pendentes`;
  $('modal-lessons').textContent = `Valor a regularizar · ${aulas(chosen.length)}`;
  $('modal-total').textContent = beijos(total);

  payBtn.disabled = total === 0;
  $('pay-hint').hidden = total !== 0;
}

lessons.forEach(c => c.addEventListener('change', updateSelection));
selectAll.addEventListener('change', () => {
  lessons.forEach(c => { c.checked = selectAll.checked; });
  updateSelection();
});

// Clicar em qualquer parte da linha também marca/desmarca
document.querySelectorAll('tbody tr').forEach(row => {
  row.addEventListener('click', e => {
    if (e.target.closest('label')) return;
    const box = row.querySelector('.lesson');
    box.checked = !box.checked;
    updateSelection();
  });
});

updateSelection();

payBtn.addEventListener('click', openModal);
closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

// Entrada suave dos blocos ao carregar
const blocks = document.querySelectorAll('.page-head, .document, .summary-card, .help-card');
blocks.forEach(el => el.classList.add('reveal'));
requestAnimationFrame(() => {
  blocks.forEach((el, i) => setTimeout(() => el.classList.add('in'), 80 * i));
});
