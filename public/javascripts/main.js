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

  const signup = document.querySelector('a.toggle-signup');
  const signupForm = document.querySelector('div.show-form');

  function showSignUp (e) {
    signupForm.classList.toggle('hidden');
    if (signupForm.classList.contains('hidden')) {
      e.currentTarget.innerText = 'Sign Up';
    } else {
      e.currentTarget.innerText = 'Hide Sign Up';
    }
  }
  if (signup) {
    signup.addEventListener('click', showSignUp);
  }
};

window.addEventListener('load', main);
