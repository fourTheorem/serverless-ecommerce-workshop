import React, { Fragment, useState } from "react"
import { Gig } from "../types"

const now = new Date()
const currentYear = now.getFullYear()
const next5Years: string[] = []
for (let i = 0; i <= 5; i++) {
  next5Years.push(String(currentYear + i))
}
const months = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Now: 11,
  Dec: 12
}

function BuyTicketForm(props: { gig: Gig }) {
  const { gig } = props


  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiryMonth, setCardExpiryMonth] = useState("")
  const [cardExpiryYear, setCardExpiryYear] = useState("")
  const [cardCVC, setCardCVC] = useState("")
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  const [paymentInProgress, setPaymentInProgress] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{}>()
  const [paymentError, setPaymentError] = useState<string>()

  const fillWithDemoData = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setName('Alex Smith')
    setEmail('alexsmith@gmail.com')
    setNameOnCard('Alex Smith')
    setCardNumber('5454545454545454')
    setCardExpiryMonth('5')
    setCardExpiryYear(next5Years[3])
    setCardCVC('123')
    setDisclaimerAccepted(true)
  }

  return (
    <Fragment>
      <form>
        <div className="columns">
          <div className="column is-7">
            <div className="content">
              <h3 id="buy">Buy a ticket ({gig.price} USD)</h3>
              <a href="#" onClick={fillWithDemoData}>
                <small>(⚡️ quick fill form)</small>
              </a>
            </div>

            <hr />

            <div className="content">
              <h4>Ticket info</h4>
            </div>

            <input type="hidden" v-model="payment.gig" />

            <div className="field">
              <label htmlFor="name" className="label">Owner name</label>
              <div className="control">
                <input
                  onChange={e => { setName(e.target.value) }}
                  id="name"
                  name="name"
                  className='input'
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g. Alex Smith"
                  value={name}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email" className="label">Email</label>
              <div className="control">
                <input
                  onChange={e => { setEmail(e.target.value) }}
                  id="email"
                  name="email"
                  className='input'
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g. alexsmith@gmail.com"
                  value={email}
                />
              </div>
            </div>

            <hr />

            <div className="content">
              <h4>Payment info</h4>
            </div>

            <div className="field">
              <label htmlFor="nameOnCard" className="label">Name on card</label>
              <div className="control">
                <input
                  onChange={e => { setNameOnCard(e.target.value) }}
                  id="nameOnCard"
                  name="nameOnCard"
                  className='input'
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g Alex Smith"
                  value={nameOnCard}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="cardNumber" className="label">Card Number</label>
              <div className="control">
                <input
                  onChange={e => { setEmail(e.target.value) }}
                  id="cardNumber"
                  name="cardNumber"
                  className='input'
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g. 1234 5678 9012 3456"
                  value={cardNumber}
                />
              </div>
            </div>

            <div className="columns">
              <div className="column is-4">
                <div className="field">
                  <label htmlFor="cardExpiryMonth" className="label">Expiry Month</label>
                  <div className="control">
                    <select
                      onChange={e => { setCardExpiryMonth(e.target.value) }}
                      id="cardExpiryMonth"
                      name="cardExpiryMonth"
                      className='select'
                      disabled={paymentInProgress}
                      value={cardExpiryMonth}
                    >
                      <option value="" />
                      {Object.entries(months).map(([name, i]) => <option key={i} value={i}>{i} - {name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="field">
                  <label htmlFor="cardExpiryYear" className="label">Expiry Year</label>
                  <div className="control">
                    <select
                      onChange={e => { setCardExpiryYear(e.target.value) }}
                      id="cardExpiryYear"
                      name="cardExpiryYear"
                      className='select'
                      disabled={paymentInProgress}
                      value={cardExpiryYear}
                    >
                      <option value="" />
                      {next5Years.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="field">
                  <label htmlFor="cardCVC" className="label">CVC</label>
                  <div className="control">
                    <input
                      onChange={e => { setCardCVC(e.target.value) }}
                      id="cardCVC"
                      name="cardCVC"
                      className='input'
                      type="text"
                      disabled={paymentInProgress}
                      placeholder="e.g. 123"
                      value={cardCVC}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label htmlFor="disclaimerAccepted" className="checkbox">
                  <input
                    onChange={e => setDisclaimerAccepted(e.target.checked)}
                    id="disclaimerAccepted"
                    name="disclaimerAccepted"
                    type="checkbox"
                    disabled={paymentInProgress}
                    checked={disclaimerAccepted}
                  />
                  {' '}I understand this is a demo site and that
                  {' '}<strong>I don't have to use a real credit card</strong> I own!
                  No attempt to charge the card will be made anyway.
                </label>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button
                  type="submit"
                  disabled={true}
                  className={`button is-primary is-large ${paymentInProgress ? 'is-loading' : ''}`}
                  onClick={e => alert('TODO')}
                >Purchase</button>
              </div>
            </div>

          </div>
        </div>
      </form >

      {paymentResult && <div className="notification is-primary">
        <button className="delete" onClick={e => { e.preventDefault(); setPaymentResult(undefined) }}></button>
        <p>Payment processed correctly! you should receive an email with your ticket shortly.</p>
        <p><small>You can buy a new ticket by entering a new name and a new email</small></p>
      </div>}

      {paymentError && <div className="notification is-danger">
        <button className="delete" onClick={e => { e.preventDefault(); setPaymentError(undefined) }}></button>
        <p>Ooops, something went wrong with your payment!</p>
        <p><small><strong>{paymentError}</strong></small></p>
      </div>}

      <pre>
        {JSON.stringify({
          gig: gig.id,
          name,
          email,
          nameOnCard,
          cardNumber,
          cardExpiryMonth,
          cardExpiryYear,
          cardCVC,
          disclaimerAccepted,
        }, null, 2)}
      </pre>

    </Fragment>
  )
}

export default BuyTicketForm