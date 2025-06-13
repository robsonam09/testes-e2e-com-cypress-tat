Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.intercept('GET', '**/notes').as('getNotes') //interceptar requisições que acabam com /NOTES e usa como apelido @getNotes
  cy.visit('/signup') //Visitar a página de signup
  cy.get('#email').type(email) //e-mail definido na variável da linha 5
  cy.get('#password').type(password, { log: false }) //password definido na variável da linha 6 - log:false devido a dado sensível
  cy.get('#confirmPassword').type(password, { log: false }) //password definido na variável da linha 6 - log:false devido a dado sensível
  cy.contains('button', 'Signup').click() //verifica na página se contém um botão e clica
  cy.get('#confirmationCode').should('be.visible')

  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), { //recebe como argumento o e-mail aleatório
    sentTo: email //enviar para p e-mail que foi gerado de forma aleatória no script acima
  }).then(message => { //buscar a mensagem que foi enviada para este e-mail aleatório
    const confirmationCode = message.html.body.match(/\d{6}/)[0] //variável confirmationCode para a expressão e para identificar somente os dígitos
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`) //Após ter os 6 dígitos, digitar e pressionar enter para confirmar

    cy.wait('@getNotes') //esperar essa conexão acontecer pra depois ir adiante
  })
})

Cypress.Commands.add('guiLogin', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/login')
  cy.get('#email').type(username)
  cy.get('#password').type(password, { log: false })
  cy.contains('button', 'Login').click()
  cy.wait('@getNotes')
  cy.contains('h1', 'Your Notes').should('be.visible')
})

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.guiLogin(username, password)
  cy.session(username, login)
})


// Outros comands aqui ...

const attachFileHandler = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

Cypress.Commands.add('createNote', (note, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Create').click()

  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newNoteValue, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', note).click()
  cy.wait('@getNote')

  cy.get('#content')
    .as('contentField')
    .clear()
  cy.get('@contentField')
    .type(newNoteValue)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', newNoteValue).should('be.visible')
  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.get('.list-group-item')
    .its('length')
    .should('be.at.least', 1)
  cy.contains('.list-group-item', note)
    .should('not.exist')
})

// cypress/support/commands.js

// fillSettingsFormAndSubmit

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})