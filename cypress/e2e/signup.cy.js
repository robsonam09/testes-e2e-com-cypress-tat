//biblioteca para gerar um e-mail temporário e blibioteca pra instalar o mailosaur npm install cypress-mailosaur@2.13.0 @faker-js/faker@8.0.2 --save-dev
import { faker } from '@faker-js/faker/locale/en'

//describe - titulo do teste
//it - bloco de teste
describe('Sign up', () => {
  const emailAddress = `${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net` //variável emailaddress que gera um nome aleatorio e o maliosaur captura
  const password = Cypress.env('USER_PASSWORD') //buscando do cypress.env e armazenando na variável

  it('successfully signs up using confirmation code sent via email', () => {
    cy.fillSignupFormAndSubmit(emailAddress, password)

    cy.contains('h1', 'Your Notes').should('be.visible') //verifica se your notes na página está visível
    cy.contains('a', 'Create a new note').should('be.visible') //verifica se create a new note na página está visível

  })
})
