const messagesContainer = document.querySelector('#messages-list')

const prevPage = document.getElementById('prevPage')
const nextPage = document.getElementById('nextPage')

// Variáveis globais
let currentPage = 1
let totalPages = 1

async function fetchMessages(page) {
  try {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      alert("Você precisa fazer login para visualizar os recados.")

      return
    }

    const params = {
      page,
      perPage: 3
    }

    const response = await api.get(`/notes/${userId}`, { params })
    const messages = response.data.userMessages

    console.log(messages)

    totalPages = response.data.totalPages

    messagesContainer.innerHTML = ''

    messages.forEach(message => {
      const messageCard = document.createElement('div')
      messageCard.classList.add('card')

      messageCard.innerHTML = `
        <div class="card" style="width: 30rem; max-width: 100%;">
          <div class="card-body">
            <h2>${message.title}</h2>
            <p class="card-text text-secondary">
              ${message.description}
            </p>
            <div class="col d-flex gap-2 ">
              <i class="bi bi-trash text-danger fs-5 " data-id="${message.id}" style="cursor: pointer;"></i>
              <i class="bi bi-pencil-square text-success fs-5" data-id="${message.id}" style="cursor: pointer;"></i>
            </div>
          </div>
        </div>
      `

      messagesContainer.appendChild(messageCard)

      const deleteIcon = messageCard.querySelector('.bi-trash')

      deleteIcon.addEventListener('click', () => {
        const messageId = deleteIcon.getAttribute('data-id')

        deleteMessage(messageId)
      })

      const editIcon = messageCard.querySelector('.bi-pencil-square')
      editIcon.addEventListener('click', () => {
        const messageId = editIcon.getAttribute('data-id')

        navigateToEditPage(messageId)
      })
    });

    if (messages.length === 0) {
      const h3 = document.createElement('h3')
      h3.textContent = 'Nenhum recado cadastrado.'
      messagesContainer.appendChild(h3)
    }
  } catch (error) {
    console.log('Erro ao buscar mensagens', error)
  }
}

fetchMessages(currentPage)

function navigateToEditPage(messageId) {
  location.href = `editar-recado.html?id=${messageId}`
}

prevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    fetchMessages(currentPage)
  }
})

nextPage.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMessages(currentPage)
  }
})
