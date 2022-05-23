import React, { Fragment, useContext, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { SettingsContext } from '../settings'
import { Gig } from '../types'

type BuyTicketFormData = {
  gigId: string,
  name: string,
  email: string,
  nameOnCard: string,
  cardNumber: string,
  cardExpiryMonth: string,
  cardExpiryYear: string,
  cardCVC: string,
  disclaimerAccepted: boolean,
}

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

function BuyTicketForm (props: { gig: Gig }) {
  const { gig } = props
  const settings = useContext(SettingsContext)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BuyTicketFormData>()

  const [paymentInProgress, setPaymentInProgress] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{}>()
  const [paymentError, setPaymentError] = useState<Error>()

  const onSubmitMock = () => {
    return new Promise((resolve, reject) => {
      // can succeed or fail with 50% chance
      const success = Math.random() >= 0.5

      setTimeout(() => {
        if (!success) {
          return reject(new Error('Card declined'))
        }

        return resolve(true)
      }, 2200)
    })
  }

  const onSubmit: SubmitHandler<BuyTicketFormData> = async (formData) => {
    try {
      setPaymentInProgress(true)
      setPaymentResult(undefined)
      setPaymentError(undefined)

      let responseData = {}
      if (settings.mock) {
        console.warn('Running in MOCK mode (using mock data). Update your `defaultSettings` in `src/settings.ts`. This will simulate a payment request with a 50% chance of succeess')
        responseData = (await onSubmitMock()) as boolean
      } else {
        const response = await fetch(`${settings.apiBaseUrl}/purchase`, { method: 'POST', body: JSON.stringify(formData) })
        responseData = await response.json()
      }

      setPaymentInProgress(false)
      setPaymentResult(responseData)
      setValue('name', '')
      setValue('email', '')
    } catch (err) {
      setPaymentInProgress(false)
      setPaymentError(err as Error)
    }
  }

  const fillWithDemoData = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setValue('name', 'Alex Smith')
    setValue('email', 'alexsmith@gmail.com')
    setValue('nameOnCard', 'Alex Smith')
    setValue('cardNumber', '5454545454545454')
    setValue('cardExpiryMonth', '5')
    setValue('cardExpiryYear', next5Years[3])
    setValue('cardCVC', '123')
    setValue('disclaimerAccepted', true)
  }

  return (
    <Fragment>
      <form method="POST" onSubmit={handleSubmit(onSubmit)}>
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

            <input type="hidden" {...register('gigId', { required: true, value: gig.id })} />

            <div className="field">
              <label htmlFor="name" className="label">Owner name</label>
              <div className="control">
                <input
                  {...register('name', { required: 'This field is required' })}
                  id="name"
                  className={`input ${errors.name ? 'is-danger' : ''}`}
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g. Alex Smith"
                />
                {errors.name && <p className="help is-danger">{errors.name.message}</p>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="email" className="label">Email</label>
              <div className="control">
                <input
                  {...register('email', { required: 'This field is required', minLength: { value: 4, message: 'Insert a valid email' } })}
                  id="email"
                  className={`input ${errors.email ? 'is-danger' : ''}`}
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g. alexsmith@gmail.com"
                />
                {errors.email && <p className="help is-danger">{errors.email.message}</p>}
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
                  {...register('nameOnCard', { required: 'This field is required' })}
                  id="nameOnCard"
                  className={`input ${errors.nameOnCard ? 'is-danger' : ''}`}
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g Alex Smith"
                />
                {errors.nameOnCard && <p className="help is-danger">{errors.nameOnCard.message}</p>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="cardNumber" className="label">Card Number</label>
              <div className="control">
                <input
                  {...register('cardNumber', {
                    required: 'This field is required',
                    pattern: { value: /^[0-9]{12,19}$/, message: 'Please inser a valid card number' }
                  })}
                  id="cardNumber"
                  className={`input ${errors.cardNumber ? 'is-danger' : ''}`}
                  type="text"
                  disabled={paymentInProgress}
                  placeholder="e.g. 1234567890123456"
                />
                {errors.cardNumber && <p className="help is-danger">{errors.cardNumber.message}</p>}
              </div>
            </div>

            <div className="columns">
              <div className="column is-4">
                <div className="field">
                  <label htmlFor="cardExpiryMonth" className="label">Expiry Month</label>
                  <div className="control">
                    <div className={`select ${errors.cardExpiryMonth ? 'is-danger' : ''}`}>
                      <select
                        {...register('cardExpiryMonth', { required: 'This field is required' })}
                        id="cardExpiryMonth"
                        disabled={paymentInProgress}
                      >
                        <option value="" />
                        {Object.entries(months).map(([name, i]) => <option key={i} value={i}>{i} - {name}</option>)}
                      </select>
                      {errors.cardExpiryMonth && <p className="help is-danger">{errors.cardExpiryMonth.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="field">
                  <label htmlFor="cardExpiryYear" className="label">Expiry Year</label>
                  <div className="control">
                    <div className={`select ${errors.cardExpiryYear ? 'is-danger' : ''}`}>
                      <select
                        {...register('cardExpiryYear', { required: 'This field is required' })}
                        id="cardExpiryYear"
                        disabled={paymentInProgress}
                      >
                        <option value="" />
                        {next5Years.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      {errors.cardExpiryYear && <p className="help is-danger">{errors.cardExpiryYear.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="field">
                  <label htmlFor="cardCVC" className="label">CVC</label>
                  <div className="control">
                    <input
                      {...register('cardCVC', {
                        required: 'This field is required',
                        pattern: { value: /^[0-9]{3,5}$/, message: 'Please insert a valid CVC' }
                      })}
                      id="cardCVC"
                      className={`input ${errors.cardCVC ? 'is-danger' : ''}`}
                      type="text"
                      disabled={paymentInProgress}
                      placeholder="e.g. 123"
                    />
                    {errors.cardCVC && <p className="help is-danger">{errors.cardCVC.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label htmlFor="disclaimerAccepted" className="checkbox">
                  <input
                    {...register('disclaimerAccepted', { required: 'This check is mandatory' })}
                    id="disclaimerAccepted"
                    type="checkbox"
                    disabled={paymentInProgress}
                  />
                  {' '}I understand this is a demo site and that
                  {' '}<strong>I don&apos;t have to use a real credit card</strong> I own!
                  No attempt to charge the card will be made anyway.
                  {errors.disclaimerAccepted && <p className="help is-danger">{errors.disclaimerAccepted.message}</p>}
                </label>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <input
                  type="submit"
                  disabled={paymentInProgress}
                  className='button is-primary is-large'
                  value={paymentInProgress ? 'Sending request...' : 'Purchase'}
                />
              </div>
            </div>

          </div>
        </div>
      </form >

      <hr />

      {paymentResult && <div className="notification is-primary">
        <button className="delete" onClick={e => { e.preventDefault(); setPaymentResult(undefined) }}></button>
        <p>Payment processed correctly! you should receive an email with your ticket shortly.</p>
        <p><small>You can buy a new ticket by entering a new name and a new email</small></p>
      </div>}

      {paymentError && <div className="notification is-danger">
        <button className="delete" onClick={e => { e.preventDefault(); setPaymentError(undefined) }}></button>
        <p>Ooops, something went wrong with your payment!</p>
        <p><small><strong>{paymentError.message}</strong></small></p>
      </div>}
    </Fragment>
  )
}

export default BuyTicketForm
