function main () {
  const buttonFilter = document.querySelector('p.toggle-filter-form');
  const formDiv = document.querySelector('div.form');

  function hideForm (e) {
    formDiv.classList.toggle('hidden');
    if (formDiv.classList.contains('hidden')) {
      e.currentTarget.innerText = 'Filter';
    } else {
      e.currentTarget.innerText = 'Hide Filters';
    }
  }
  if (buttonFilter) {
    buttonFilter.addEventListener('click', hideForm);
  }
};
window.addEventListener('load', main);
