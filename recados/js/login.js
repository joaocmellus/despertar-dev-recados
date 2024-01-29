// Signin refs
const signinForm = document.getElementById('signin-form')
const signinEmailInput = document.getElementById('signin-email')
const signinPasswordInput = document.getElementById('signin-password')

// Signup refs
const signupForm = document.getElementById('signup-form')
const signupModal = new bootstrap.Modal('#signup')
const modalSubmitBtn = document.getElementById('signup-btn')

const signupNameInput = document.getElementById('signup-name')
const signupEmailInput = document.getElementById('signup-email')
const signupPasswordInput = document.getElementById('signup-password')

// Signin functions
async function login(data) {
  try {
    const response = await api.post('/users/login', data)

    if (response.status === 200) {
      const userData = response.data

      localStorage.setItem('userId', userData.userId)
      location.href = "listar-recados.html"
    }
  } catch (error) {
    console.error('Erro ao fazer login', error)
  }
}

// Signin triggers
signinForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let is_valid = true

  const data = {
    email: signinEmailInput.value,
    password: signinPasswordInput.value,
  }
  
  if (!signinEmailInput.value) {
    setError(signinEmailInput, "E-mail é obrigatório.")
    is_valid = false;
  } else if (!signinEmailInput.validity.valid) {
    setError(signinEmailInput, 'Insira um email válido.')
    is_valid = false;
  }

  if (!signinPasswordInput.value) {
    setError(signinPasswordInput, "Senha é obrigatória.")
    is_valid = false;
  } else if (signinPasswordInput.value.length < 6) {
    setError(signinPasswordInput, 'A senha deve ter no mínimo 6 caracteres.')
    is_valid = false;
  }

  if (is_valid) {
    login(data)
  }
})

function setError(input, message) {
  const formControl = input.parentElement
  const alertWrapper = formControl.querySelector('.alert-wrapper')

  alertWrapper.innerHTML = renderAlert(message, 'danger')

  alertWrapper.classList.remove('d-none');
  setTimeout(() => {
    alertWrapper.classList.add('d-none');
  }, 3000);
}

const renderAlert = (message, type) => {
  return [
    `<div class="alert alert-${type} alert-dismissible rounded-4" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
}

// Signup functions
async function addNewUser(newUser) {
  try {
    const response = await api.post('/users/signup', newUser)

    if (response.status === 201) {
      signupModal.hide()
      signupForm.reset()
      signupForm.classList.remove('was-validated')

      const wrapper = document.createElement('div')
      wrapper.classList.add('row','mb-2', 'px-0')
      wrapper.innerHTML = renderAlert('Usuário criado com sucesso.', 'success')

      signinForm.innerHTML = wrapper.outerHTML + signinForm.innerHTML
    }
  } catch (error) {
    console.log('Erro ao cadastrar usuário', error)
  }
}

// Signup triggers
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let is_valid = true

  const newUser = {
    name: signupNameInput.value,
    email: signupEmailInput.value,
    password: signupPasswordInput.value,
  }
  
  if (!signupNameInput.value) {
    setError(signupNameInput, "Nome é obrigatório.")
    is_valid = false
  }
  
  if (!signupEmailInput.value) {
    setError(signupEmailInput, "E-mail é obrigatório.")
    is_valid = false
  } else if (!signupEmailInput.validity.valid) {
    setError(signupEmailInput, 'Insira um email válido.')
    is_valid = false
  }

  if (!signupPasswordInput.value) {
    setError(signupPasswordInput, "Senha é obrigatória.")
    is_valid = false
  } else if (signupPasswordInput.value.length < 6) {
    setError(signupPasswordInput, 'A senha deve ter no mínimo 6 caracteres.')
    is_valid = false
  }

  if (is_valid) { 
    addNewUser(newUser)
  }
})

modalSubmitBtn.addEventListener('click', (e) => {
  signupForm.requestSubmit();
})

{
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
}