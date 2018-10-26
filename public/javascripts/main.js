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

  const signup = document.querySelector('p.toggle-signup');
  // const signupForm = document.querySelector('div.show-form');
  const logInDiv = document.querySelector('div.show-login');
  const signUpDiv = document.querySelector('div.show-signup');

  function showSignUp (e) {
    signUpDiv.classList.toggle('hidden');
    if (signUpDiv.classList.contains('hidden')) {
      e.currentTarget.innerText = `Don't you have an acount? SignUp`;
      logInDiv.style.display = 'block';
    } else if (!signUpDiv.classList.contains('hidden')) {
      e.currentTarget.innerText = `Do you have an acount? LogIn`;
      logInDiv.style.display = 'none';
    }
  }
  if (signup) {
    signup.addEventListener('click', showSignUp);
  }
};

window.addEventListener('load', main);
